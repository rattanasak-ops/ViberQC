// ============================================================
// ViberQC — LambdaTest Screenshots Client
// Docs: https://www.lambdatest.com/support/api-doc/
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { BrowserConfig, LambdaTestJob, Screenshot } from "./types";

interface LambdaTestStartResponse {
  test_id: string;
  status: string;
}

interface LambdaTestStatusResponse {
  test_id: string;
  test_status: string;
  screenshots: {
    os: string;
    os_version: string;
    browser: string;
    browser_version: string;
    screenshot_url: string;
    thumbnail_url: string;
    status: string;
    activity_id: string;
  }[];
}

const DEFAULT_BROWSERS: BrowserConfig[] = [
  {
    os: "Windows",
    osVersion: "11",
    browser: "chrome",
    browserVersion: "latest",
  },
  {
    os: "Windows",
    osVersion: "11",
    browser: "firefox",
    browserVersion: "latest",
  },
  {
    os: "macOS",
    osVersion: "Ventura",
    browser: "safari",
    browserVersion: "16",
  },
  { os: "Windows", osVersion: "11", browser: "edge", browserVersion: "latest" },
];

export class LambdaTestClient extends BaseApiClient {
  private authHeader: string;

  constructor() {
    super(
      {
        ...getApiConfig("lambdatest"),
        timeout: 120_000,
      },
      apiCache,
    );
    const username = process.env.LAMBDATEST_USERNAME ?? "";
    const accessKey = process.env.LAMBDATEST_ACCESS_KEY ?? "";
    this.authHeader = `Basic ${Buffer.from(`${username}:${accessKey}`).toString("base64")}`;
  }

  /**
   * Start a screenshot test.
   */
  async startScreenshots(
    url: string,
    browsers: BrowserConfig[] = DEFAULT_BROWSERS,
    userId?: string,
  ): Promise<LambdaTestJob> {
    const response = await this.request<LambdaTestStartResponse>(
      "/screenshots/v1",
      {
        method: "POST",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          configs: browsers.map((b) => ({
            os: b.os,
            os_version: b.osVersion,
            browser: b.browser,
            browser_version: b.browserVersion,
          })),
          defer_time: 5,
          smart_scroll: true,
        }),
        userId,
      },
    );

    return {
      testId: response.data.test_id,
      status: "queued",
      screenshots: [],
    };
  }

  /**
   * Get screenshot test status.
   */
  async getTestStatus(testId: string, userId?: string): Promise<LambdaTestJob> {
    const response = await this.request<LambdaTestStatusResponse>(
      `/screenshots/v1/${testId}`,
      {
        method: "GET",
        headers: {
          Authorization: this.authHeader,
        },
        userId,
      },
    );

    const data = response.data;
    return {
      testId: data.test_id,
      status:
        data.test_status === "completed"
          ? "completed"
          : data.test_status === "failed"
            ? "failed"
            : data.test_status === "processing"
              ? "processing"
              : "queued",
      screenshots: (data.screenshots ?? []).map((s) => this.mapScreenshot(s)),
    };
  }

  /**
   * Start and poll until completed (max ~2 min).
   */
  async takeScreenshots(
    url: string,
    browsers: BrowserConfig[] = DEFAULT_BROWSERS,
    userId?: string,
  ): Promise<LambdaTestJob> {
    const job = await this.startScreenshots(url, browsers, userId);
    return this.pollUntilDone(job.testId, userId);
  }

  private async pollUntilDone(
    testId: string,
    userId?: string,
    maxAttempts = 12,
    intervalMs = 10_000,
  ): Promise<LambdaTestJob> {
    for (let i = 0; i < maxAttempts; i++) {
      const job = await this.getTestStatus(testId, userId);
      if (job.status === "completed" || job.status === "failed") return job;
      await sleep(intervalMs);
    }
    return this.getTestStatus(testId, userId);
  }

  private mapScreenshot(s: {
    os: string;
    os_version: string;
    browser: string;
    browser_version: string;
    screenshot_url: string;
    thumbnail_url: string;
    status: string;
  }): Screenshot {
    return {
      browser: s.browser,
      browserVersion: s.browser_version,
      os: s.os,
      osVersion: s.os_version,
      imageUrl: s.screenshot_url ?? "",
      thumbUrl: s.thumbnail_url ?? "",
      status:
        s.status === "completed"
          ? "done"
          : s.status === "failed"
            ? "failed"
            : "pending",
      createdAt: new Date().toISOString(),
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!process.env.LAMBDATEST_USERNAME) return false;
    try {
      const res = await fetch(
        "https://api.lambdatest.com/screenshots/v1/os-browsers",
        { headers: { Authorization: this.authHeader } },
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
