// ============================================================
// ViberQC — Qualys SSL Labs Client (FREE)
// Docs: https://www.ssllabs.com/projects/ssllabs-apis/
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { SslLabsResult, SslLabsEndpoint } from "./types";

interface SslLabsApiResponse {
  host: string;
  status: string; // "DNS" | "IN_PROGRESS" | "READY" | "ERROR"
  endpoints?: {
    ipAddress: string;
    grade: string;
    hasWarnings: boolean;
    details?: {
      protocols: { name: string; version: string }[];
      heartbleed: boolean;
      poodle: boolean;
      freak: boolean;
      logjam: boolean;
      certChains?: { issues: number }[];
    };
  }[];
}

export class SslLabsClient extends BaseApiClient {
  constructor() {
    super(getApiConfig("ssl_labs"), apiCache);
  }

  async analyze(hostname: string, userId?: string): Promise<SslLabsResult> {
    const cacheKey = `ssllabs:${hostname}`;

    // Check cache first
    const cached = this.cache.get<SslLabsResult>(cacheKey);
    if (cached) return cached;

    // Start analysis
    const response = await this.request<SslLabsApiResponse>(
      `/analyze?host=${encodeURIComponent(hostname)}&publish=off&fromCache=on&maxAge=24`,
      { method: "GET", userId },
    );

    // If not ready, poll
    if (response.data.status !== "READY" && response.data.status !== "ERROR") {
      return this.pollResult(hostname, userId, cacheKey);
    }

    const result = this.mapResult(response.data);
    this.cache.set(cacheKey, result, CACHE_TTL.SSL_GRADE);
    return result;
  }

  private async pollResult(
    hostname: string,
    userId?: string,
    cacheKey?: string,
    maxAttempts = 20,
  ): Promise<SslLabsResult> {
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(10_000); // SSL Labs takes 60-120s, poll every 10s

      const response = await this.request<SslLabsApiResponse>(
        `/analyze?host=${encodeURIComponent(hostname)}&publish=off`,
        { method: "GET", userId },
      );

      if (
        response.data.status === "READY" ||
        response.data.status === "ERROR"
      ) {
        const result = this.mapResult(response.data);
        if (cacheKey) this.cache.set(cacheKey, result, CACHE_TTL.SSL_GRADE);
        return result;
      }
    }

    return {
      host: hostname,
      grade: "N/A",
      hasWarnings: false,
      endpoints: [],
    };
  }

  private mapResult(data: SslLabsApiResponse): SslLabsResult {
    const endpoints: SslLabsEndpoint[] = (data.endpoints ?? []).map((ep) => ({
      ipAddress: ep.ipAddress,
      grade: ep.grade ?? "N/A",
      protocols: ep.details?.protocols ?? [],
      certExpiry: null,
      vulnerabilities: {
        heartbleed: ep.details?.heartbleed ?? false,
        poodle: ep.details?.poodle ?? false,
        freak: ep.details?.freak ?? false,
        logjam: ep.details?.logjam ?? false,
      },
    }));

    const topGrade = endpoints[0]?.grade ?? "N/A";

    return {
      host: data.host,
      grade: topGrade,
      hasWarnings: endpoints.some((e) => e.grade !== "A" && e.grade !== "A+"),
      endpoints,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.config.baseUrl}/info`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
