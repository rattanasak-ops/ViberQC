// ============================================================
// ViberQC — WebPageTest Client (Paid: $15/mo)
// Docs: https://docs.webpagetest.org/api/
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type {
  WebPageTestResult,
  WebPageTestRun,
  WebPageTestView,
} from "./types";

interface WptRunResponse {
  statusCode: number;
  data: {
    testId: string;
    jsonUrl: string;
    userUrl: string;
  };
}

interface WptResultResponse {
  statusCode: number; // 200 = complete, 1xx = in progress
  data: {
    id: string;
    summary: string;
    testUrl: string;
    location: string;
    connectivity: string;
    median: {
      firstView: WptViewData;
      repeatView?: WptViewData;
    };
  };
}

interface WptViewData {
  loadTime: number;
  firstContentfulPaint: number;
  "chromeUserTiming.LargestContentfulPaint"?: number;
  TotalBlockingTime?: number;
  "chromeUserTiming.CumulativeLayoutShift"?: number;
  SpeedIndex: number;
  TTFB: number;
  fullyLoaded: number;
  bytesIn: number;
  requests: number;
}

export class WebPageTestClient extends BaseApiClient {
  constructor() {
    super(
      {
        ...getApiConfig("webpagetest"),
        apiKey: process.env.WEBPAGETEST_API_KEY,
      },
      apiCache,
    );
  }

  async analyze(url: string, userId?: string): Promise<WebPageTestResult> {
    const cacheKey = `webpagetest:${url}`;

    const cached = this.cache.get<WebPageTestResult>(cacheKey);
    if (cached) return cached;

    // Start test
    const startResponse = await this.request<WptRunResponse>(
      `/runtest.php?url=${encodeURIComponent(url)}&f=json&k=${this.config.apiKey}&runs=1&fvonly=0&lighthouse=1`,
      {
        method: "POST",
        userId,
      },
    );

    if (startResponse.data.statusCode !== 200) {
      throw new Error(
        `WebPageTest failed to start: status ${startResponse.data.statusCode}`,
      );
    }

    const testId = startResponse.data.data.testId;

    // Poll for completion
    const result = await this.pollResult(testId, userId);
    this.cache.set(cacheKey, result, CACHE_TTL.PERFORMANCE);
    return result;
  }

  private async pollResult(
    testId: string,
    userId?: string,
    maxAttempts = 30,
  ): Promise<WebPageTestResult> {
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(10_000); // WPT takes 60-120s typically

      const response = await this.request<WptResultResponse>(
        `/jsonResult.php?test=${testId}`,
        {
          method: "GET",
          userId,
        },
      );

      if (response.data.statusCode === 200) {
        return this.mapResult(response.data);
      }

      // Status >= 400 means error
      if (response.data.statusCode >= 400) {
        throw new Error(
          `WebPageTest test ${testId} failed with status ${response.data.statusCode}`,
        );
      }

      // 1xx means still in progress, continue polling
    }

    throw new Error(
      `WebPageTest test ${testId} timed out after ${maxAttempts} attempts`,
    );
  }

  private mapResult(data: WptResultResponse): WebPageTestResult {
    const d = data.data;

    const mapView = (v: WptViewData): WebPageTestView => ({
      loadTime: v.loadTime,
      firstContentfulPaint: v.firstContentfulPaint,
      largestContentfulPaint: v["chromeUserTiming.LargestContentfulPaint"] ?? 0,
      totalBlockingTime: v.TotalBlockingTime ?? 0,
      cumulativeLayoutShift: v["chromeUserTiming.CumulativeLayoutShift"] ?? 0,
      speedIndex: v.SpeedIndex,
      timeToFirstByte: v.TTFB,
      fullyLoaded: v.fullyLoaded,
      bytesIn: v.bytesIn,
      requests: v.requests,
    });

    const median: WebPageTestRun = {
      firstView: mapView(d.median.firstView),
      repeatView: d.median.repeatView ? mapView(d.median.repeatView) : null,
    };

    return {
      testId: d.id,
      summary: d.summary,
      median,
      location: d.location,
      connectivity: d.connectivity,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.config.baseUrl}/testStatus.php?test=dummy&f=json`,
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
