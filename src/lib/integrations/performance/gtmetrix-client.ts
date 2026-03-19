// ============================================================
// ViberQC — GTmetrix Client (Paid: $10-43/mo)
// Docs: https://gtmetrix.com/api/docs/2.0/
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type {
  GtmetrixResult,
  GtmetrixMetrics,
  GtmetrixPageDetails,
} from "./types";

interface GtmetrixTestResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      state: string; // "queued" | "started" | "completed" | "error"
      source: string;
      report?: {
        url: string;
      };
    };
  };
}

interface GtmetrixReportResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      gtmetrix_grade: string;
      performance_score: number;
      structure_score: number;
      lcp: number; // ms
      tbt: number; // ms
      cls: number;
      fcp: number; // ms
      tti: number; // ms
      si: number; // ms
      page_load_time: number;
      page_bytes: number;
      page_requests: number;
      html_bytes: number;
      css_bytes: number;
      js_bytes: number;
      image_bytes: number;
    };
  };
}

export class GtmetrixClient extends BaseApiClient {
  constructor() {
    super(
      {
        ...getApiConfig("gtmetrix"),
        apiKey: process.env.GTMETRIX_API_KEY,
      },
      apiCache,
    );
  }

  async analyze(url: string, userId?: string): Promise<GtmetrixResult> {
    const cacheKey = `gtmetrix:${url}`;

    const cached = this.cache.get<GtmetrixResult>(cacheKey);
    if (cached) return cached;

    // Start test — GTmetrix uses Basic auth with API key as username
    const authHeader = `Basic ${Buffer.from(`${this.config.apiKey}:`).toString("base64")}`;

    const startResponse = await this.request<GtmetrixTestResponse>("/tests", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "test",
          attributes: { url },
        },
      }),
      userId,
    });

    const testId = startResponse.data.data.id;

    // Poll for completion
    const result = await this.pollResult(testId, authHeader, userId);
    this.cache.set(cacheKey, result, CACHE_TTL.PERFORMANCE);
    return result;
  }

  private async pollResult(
    testId: string,
    authHeader: string,
    userId?: string,
    maxAttempts = 30,
  ): Promise<GtmetrixResult> {
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(5_000); // GTmetrix takes 30-60s typically

      const response = await this.request<GtmetrixTestResponse>(
        `/tests/${testId}`,
        {
          method: "GET",
          headers: { Authorization: authHeader },
          userId,
        },
      );

      const state = response.data.data.attributes.state;

      if (state === "completed") {
        // Fetch the full report
        return this.fetchReport(testId, authHeader, userId);
      }

      if (state === "error") {
        throw new Error(`GTmetrix test ${testId} failed`);
      }
    }

    throw new Error(
      `GTmetrix test ${testId} timed out after ${maxAttempts} attempts`,
    );
  }

  private async fetchReport(
    testId: string,
    authHeader: string,
    userId?: string,
  ): Promise<GtmetrixResult> {
    const response = await this.request<GtmetrixReportResponse>(
      `/tests/${testId}/report`,
      {
        method: "GET",
        headers: { Authorization: authHeader },
        userId,
      },
    );

    const attrs = response.data.data.attributes;

    const metrics: GtmetrixMetrics = {
      largestContentfulPaint: attrs.lcp,
      totalBlockingTime: attrs.tbt,
      cumulativeLayoutShift: attrs.cls,
      firstContentfulPaint: attrs.fcp,
      timeToInteractive: attrs.tti,
      speedIndex: attrs.si,
    };

    const pageDetails: GtmetrixPageDetails = {
      pageLoadTime: attrs.page_load_time,
      totalPageSize: attrs.page_bytes,
      totalRequests: attrs.page_requests,
      htmlSize: attrs.html_bytes,
      cssSize: attrs.css_bytes,
      jsSize: attrs.js_bytes,
      imageSize: attrs.image_bytes,
    };

    return {
      testId,
      grade: attrs.gtmetrix_grade ?? "N/A",
      performanceScore: attrs.performance_score ?? 0,
      structureScore: attrs.structure_score ?? 0,
      metrics,
      pageDetails,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const authHeader = `Basic ${Buffer.from(`${this.config.apiKey}:`).toString("base64")}`;
      const res = await fetch(`${this.config.baseUrl}/status`, {
        headers: { Authorization: authHeader },
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
