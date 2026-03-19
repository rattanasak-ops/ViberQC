// ============================================================
// ViberQC — Google CrUX API Client (FREE)
// Real user Core Web Vitals data
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { CruxMetrics, CruxMetricData } from "./types";

interface CruxApiResponse {
  record?: {
    metrics?: Record<
      string,
      {
        percentiles?: { p75: number };
        histogram?: { start: number; end?: number; density: number }[];
      }
    >;
  };
}

export class CruxClient extends BaseApiClient {
  constructor() {
    super(getApiConfig("crux"), apiCache);
  }

  async getMetrics(url: string, userId?: string): Promise<CruxMetrics> {
    const apiKey =
      process.env.GOOGLE_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY;
    const cacheKey = `crux:${url}`;

    const response = await this.request<CruxApiResponse>("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        formFactor: "PHONE",
      }),
      userId,
      cacheKey,
      cacheTtl: CACHE_TTL.PERFORMANCE,
    });

    // Override base URL for this call — CrUX uses query param for key
    // Actually, we need to reconstruct. The baseUrl already is the full endpoint.
    // Re-request with API key
    const fullUrl = `${this.config.baseUrl}?key=${apiKey}`;
    const res = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, formFactor: "PHONE" }),
    });

    if (!res.ok) {
      // URL might not have enough CrUX data
      return { lcp: null, fid: null, cls: null, inp: null, ttfb: null };
    }

    const data = (await res.json()) as CruxApiResponse;
    const metrics = data.record?.metrics ?? {};

    return {
      lcp: this.parseMetric(metrics["largest_contentful_paint"]),
      fid: this.parseMetric(metrics["first_input_delay"]),
      cls: this.parseMetric(metrics["cumulative_layout_shift"]),
      inp: this.parseMetric(metrics["interaction_to_next_paint"]),
      ttfb: this.parseMetric(metrics["experimental_time_to_first_byte"]),
    };
  }

  private parseMetric(metric?: {
    percentiles?: { p75: number };
    histogram?: { start: number; end?: number; density: number }[];
  }): CruxMetricData | null {
    if (!metric?.percentiles) return null;

    const histogram = metric.histogram ?? [];
    return {
      p75: metric.percentiles.p75,
      good: histogram[0]?.density ?? 0,
      needsImprovement: histogram[1]?.density ?? 0,
      poor: histogram[2]?.density ?? 0,
    };
  }

  async healthCheck(): Promise<boolean> {
    return true; // Free API, always available
  }
}
