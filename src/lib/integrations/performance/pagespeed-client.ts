// ============================================================
// ViberQC — Google PageSpeed Insights Client (FREE)
// Docs: https://developers.google.com/speed/docs/insights/v5/get-started
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type {
  PageSpeedResult,
  PageSpeedMetrics,
  PageSpeedAudit,
} from "./types";

interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
}

interface PageSpeedApiResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
    };
    audits: Record<string, LighthouseAudit>;
  };
  analysisUTCTimestamp: string;
}

export class PageSpeedClient extends BaseApiClient {
  constructor() {
    super(getApiConfig("pagespeed_insights"), apiCache);
  }

  async analyze(
    url: string,
    strategy: "mobile" | "desktop" = "mobile",
    userId?: string,
  ): Promise<PageSpeedResult> {
    const cacheKey = `pagespeed:${strategy}:${url}`;

    const cached = this.cache.get<PageSpeedResult>(cacheKey);
    if (cached) return cached;

    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";

    const response = await this.request<PageSpeedApiResponse>(
      `/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}${keyParam}`,
      {
        method: "GET",
        userId,
      },
    );

    const result = this.mapResult(response.data, strategy);
    this.cache.set(cacheKey, result, CACHE_TTL.PERFORMANCE);
    return result;
  }

  private mapResult(
    data: PageSpeedApiResponse,
    strategy: "mobile" | "desktop",
  ): PageSpeedResult {
    const lhr = data.lighthouseResult;
    const audits = lhr.audits;

    const metrics: PageSpeedMetrics = {
      firstContentfulPaint: audits["first-contentful-paint"]?.numericValue ?? 0,
      largestContentfulPaint:
        audits["largest-contentful-paint"]?.numericValue ?? 0,
      totalBlockingTime: audits["total-blocking-time"]?.numericValue ?? 0,
      cumulativeLayoutShift:
        audits["cumulative-layout-shift"]?.numericValue ?? 0,
      speedIndex: audits["speed-index"]?.numericValue ?? 0,
      timeToInteractive: audits["interactive"]?.numericValue ?? 0,
    };

    const keyAudits: PageSpeedAudit[] = Object.values(audits)
      .filter((a) => a.score !== null && a.score < 1)
      .slice(0, 20)
      .map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        score: a.score,
        displayValue: a.displayValue ?? "",
        numericValue: a.numericValue ?? null,
      }));

    return {
      score: Math.round((lhr.categories.performance.score ?? 0) * 100),
      metrics,
      audits: keyAudits,
      strategy,
      fetchedAt: data.analysisUTCTimestamp ?? new Date().toISOString(),
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.config.baseUrl}/runPagespeed?url=https://www.google.com&strategy=mobile&category=performance`,
        { method: "GET" },
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}
