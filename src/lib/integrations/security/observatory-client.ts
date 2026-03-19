// ============================================================
// ViberQC — Mozilla Observatory Client (FREE)
// Docs: https://developer.mozilla.org/en-US/observatory
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { ObservatoryResult } from "./types";

export class ObservatoryClient extends BaseApiClient {
  constructor() {
    super(getApiConfig("mozilla_observatory"), apiCache);
  }

  async scan(hostname: string, userId?: string): Promise<ObservatoryResult> {
    const cacheKey = `observatory:${hostname}`;

    // Start scan
    const response = await this.request<{
      id: number;
      grade: string | null;
      score: number | null;
      state: string;
      tests_completed: number;
      tests_quantity: number;
    }>(`/scan?host=${encodeURIComponent(hostname)}`, {
      method: "POST",
      userId,
      cacheKey,
      cacheTtl: CACHE_TTL.OBSERVATORY,
    });

    const data = response.data;

    // If scan is still running, poll
    if (data.state !== "FINISHED" && data.state !== "FAILED") {
      return this.pollResult(hostname, userId);
    }

    // Get detailed test results
    return this.buildResult(hostname, data, userId);
  }

  async getResult(
    hostname: string,
    userId?: string,
  ): Promise<ObservatoryResult> {
    const response = await this.request<{
      id: number;
      grade: string | null;
      score: number | null;
      state: string;
    }>(`/scan?host=${encodeURIComponent(hostname)}`, {
      method: "GET",
      userId,
    });

    return this.buildResult(hostname, response.data, userId);
  }

  private async pollResult(
    hostname: string,
    userId?: string,
    maxAttempts = 10,
  ): Promise<ObservatoryResult> {
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(3000);

      const response = await this.request<{
        id: number;
        grade: string | null;
        score: number | null;
        state: string;
      }>(`/scan?host=${encodeURIComponent(hostname)}`, {
        method: "GET",
        userId,
      });

      if (
        response.data.state === "FINISHED" ||
        response.data.state === "FAILED"
      ) {
        return this.buildResult(hostname, response.data, userId);
      }
    }

    return {
      grade: "N/A",
      score: 0,
      tests: [],
      scannedAt: new Date().toISOString(),
    };
  }

  private async buildResult(
    hostname: string,
    scanData: { grade: string | null; score: number | null },
    _userId?: string,
  ): Promise<ObservatoryResult> {
    return {
      grade: scanData.grade ?? "N/A",
      score: scanData.score ?? 0,
      tests: [], // Full test details available via separate API call
      scannedAt: new Date().toISOString(),
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.config.baseUrl}/scan?host=mozilla.org`, {
        method: "GET",
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
