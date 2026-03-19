// ============================================================
// ViberQC — Base API Client
// Abstract base class ที่ทุก API integration ต้อง extend
// Handles: retry, circuit breaker, rate limit, usage tracking
// ============================================================

import { CircuitBreaker, CircuitOpenError } from "./circuit-breaker";
import { RateLimiter } from "./rate-limiter";
import { ApiCache } from "./cache";
import { db } from "@/lib/db";
import { addonApiUsage } from "@/lib/db/schema";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

export interface ApiClientConfig {
  provider: string;
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  circuitBreaker?: {
    failureThreshold: number;
    resetTimeout: number;
  };
  costPerCall?: number; // cents
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  durationMs: number;
  cached: boolean;
  provider: string;
}

export interface ApiError {
  provider: string;
  status: number;
  message: string;
  retryable: boolean;
}

// -----------------------------------------------------------
// Base Client
// -----------------------------------------------------------

export abstract class BaseApiClient {
  protected readonly config: ApiClientConfig;
  protected readonly circuitBreaker: CircuitBreaker;
  protected readonly rateLimiter: RateLimiter | null;
  protected readonly cache: ApiCache;

  constructor(config: ApiClientConfig, cache?: ApiCache) {
    this.config = {
      timeout: 30_000,
      maxRetries: 3,
      retryDelay: 1_000,
      costPerCall: 0,
      ...config,
    };

    this.circuitBreaker = new CircuitBreaker(
      config.circuitBreaker?.failureThreshold ?? 5,
      config.circuitBreaker?.resetTimeout ?? 60_000,
    );

    this.rateLimiter = config.rateLimit
      ? new RateLimiter(config.rateLimit.maxRequests, config.rateLimit.windowMs)
      : null;

    this.cache = cache ?? new ApiCache();
  }

  /**
   * Make an API request with retry, circuit breaker, rate limiting, and usage tracking.
   */
  protected async request<T>(
    endpoint: string,
    options?: RequestInit & {
      userId?: string;
      addonId?: string;
      cacheKey?: string;
      cacheTtl?: number;
    },
  ): Promise<ApiResponse<T>> {
    const { userId, addonId, cacheKey, cacheTtl, ...fetchOptions } =
      options ?? {};

    // Check cache first
    if (cacheKey) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== null) {
        return {
          data: cached,
          status: 200,
          durationMs: 0,
          cached: true,
          provider: this.config.provider,
        };
      }
    }

    // Rate limit
    if (this.rateLimiter) {
      await this.rateLimiter.waitForToken();
    }

    // Circuit breaker + retry
    const start = Date.now();
    let lastError: Error | null = null;
    const maxRetries = this.config.maxRetries!;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.circuitBreaker.execute(async () => {
          const url = `${this.config.baseUrl}${endpoint}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            this.config.timeout,
          );

          try {
            const headers = new Headers(fetchOptions.headers);
            if (this.config.apiKey && !headers.has("Authorization")) {
              headers.set("Authorization", `Bearer ${this.config.apiKey}`);
            }
            if (
              !headers.has("Content-Type") &&
              fetchOptions.method === "POST"
            ) {
              headers.set("Content-Type", "application/json");
            }

            const response = await fetch(url, {
              ...fetchOptions,
              headers,
              signal: controller.signal,
            });

            if (!response.ok) {
              const body = await response.text().catch(() => "");
              throw new ApiRequestError(
                `${this.config.provider} API error: ${response.status} ${response.statusText}`,
                response.status,
                this.config.provider,
                response.status >= 500 || response.status === 429,
                body,
              );
            }

            const data = (await response.json()) as T;
            return { data, status: response.status };
          } finally {
            clearTimeout(timeoutId);
          }
        });

        const durationMs = Date.now() - start;

        // Cache result
        if (cacheKey && cacheTtl) {
          this.cache.set(cacheKey, result.data, cacheTtl);
        }

        // Track usage (fire and forget)
        if (userId) {
          this.trackUsage(
            userId,
            addonId,
            endpoint,
            result.status,
            durationMs,
          ).catch(() => {});
        }

        return {
          data: result.data,
          status: result.status,
          durationMs,
          cached: false,
          provider: this.config.provider,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on circuit open or non-retryable errors
        if (error instanceof CircuitOpenError) throw error;
        if (error instanceof ApiRequestError && !error.retryable) throw error;

        // Wait before retry
        if (attempt < maxRetries) {
          await sleep(this.config.retryDelay! * (attempt + 1));
        }
      }
    }

    // Track failed usage
    if (userId) {
      const durationMs = Date.now() - start;
      this.trackUsage(userId, addonId, endpoint, 0, durationMs).catch(() => {});
    }

    throw lastError ?? new Error(`${this.config.provider}: request failed`);
  }

  /**
   * Track API usage in the database.
   */
  private async trackUsage(
    userId: string,
    addonId: string | undefined,
    endpoint: string,
    responseStatus: number,
    durationMs: number,
  ): Promise<void> {
    try {
      await db.insert(addonApiUsage).values({
        userId,
        addonId: addonId ?? "00000000-0000-0000-0000-000000000000",
        apiProvider: this.config.provider,
        endpoint,
        costCents: this.config.costPerCall ?? 0,
        responseStatus,
        durationMs,
      });
    } catch {
      // Non-critical — don't crash if tracking fails
    }
  }

  /**
   * Health check — subclasses should implement a lightweight ping.
   */
  abstract healthCheck(): Promise<boolean>;

  /**
   * Get current circuit breaker state.
   */
  getCircuitState() {
    return this.circuitBreaker.getState();
  }

  /**
   * Get provider name.
   */
  getProvider(): string {
    return this.config.provider;
  }
}

// -----------------------------------------------------------
// Custom Error
// -----------------------------------------------------------

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly provider: string,
    public readonly retryable: boolean,
    public readonly responseBody?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
