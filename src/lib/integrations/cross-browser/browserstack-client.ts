// ============================================================
// ViberQC — BrowserStack Screenshots Client
// Docs: https://www.browserstack.com/screenshots/api
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { BrowserConfig, BrowserStackJob, Screenshot } from "./types";

interface BrowserStackScreenshotResponse {
  job_id: string;
  state: "queued" | "processing" | "done";
  callback_url: string | null;
  screenshots: {
    os: string;
    os_version: string;
    browser: string;
    browser_version: string;
    image_url: string;
    thumb_url: string;
    state: string;
    created_at: string;
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
  { os: "Windows", osVersion: "11", browser: "edge", browserVersion: "latest" },
  {
    os: "OS X",
    osVersion: "Ventura",
    browser: "safari",
    browserVersion: "16.0",
  },
];

export class BrowserStackClient extends BaseApiClient {
  private authHeader: string;

  constructor() {
    super(
      {
        ...getApiConfig("browserstack"),
        timeout: 120_000, // screenshots take time
      },
      apiCache,
    );
    const username = process.env.BROWSERSTACK_USERNAME ?? "";
    const accessKey = process.env.BROWSERSTACK_ACCESS_KEY ?? "";
    this.authHeader = `Basic ${Buffer.from(`${username}:${accessKey}`).toString("base64")}`;
  }

  /**
   * Start a screenshot job.
   */
  async startScreenshots(
    url: string,
    browsers: BrowserConfig[] = DEFAULT_BROWSERS,
    userId?: string,
  ): Promise<BrowserStackJob> {
    const response = await this.request<BrowserStackScreenshotResponse>("", {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        browsers: browsers.map((b) => ({
          os: b.os,
          os_version: b.osVersion,
          browser: b.browser,
          browser_version: b.browserVersion,
          device: b.device ?? null,
        })),
        wait_time: 5,
        quality: "compressed",
      }),
      userId,
    });

    return this.mapJob(response.data);
  }

  /**
   * Poll for screenshot job completion.
   */
  async getJobStatus(jobId: string, userId?: string): Promise<BrowserStackJob> {
    const response = await this.request<BrowserStackScreenshotResponse>(
      `/${jobId}.json`,
      {
        method: "GET",
        headers: {
          Authorization: this.authHeader,
        },
        userId,
      },
    );

    return this.mapJob(response.data);
  }

  /**
   * Start and poll until done (max ~2 min).
   */
  async takeScreenshots(
    url: string,
    browsers: BrowserConfig[] = DEFAULT_BROWSERS,
    userId?: string,
  ): Promise<BrowserStackJob> {
    const job = await this.startScreenshots(url, browsers, userId);
    return this.pollUntilDone(job.jobId, userId);
  }

  private async pollUntilDone(
    jobId: string,
    userId?: string,
    maxAttempts = 12,
    intervalMs = 10_000,
  ): Promise<BrowserStackJob> {
    for (let i = 0; i < maxAttempts; i++) {
      const job = await this.getJobStatus(jobId, userId);
      if (job.state === "done") return job;
      await sleep(intervalMs);
    }
    // Return last status even if not done
    return this.getJobStatus(jobId, userId);
  }

  private mapJob(data: BrowserStackScreenshotResponse): BrowserStackJob {
    return {
      jobId: data.job_id,
      state: data.state,
      callbackUrl: data.callback_url,
      screenshots: (data.screenshots ?? []).map((s) => this.mapScreenshot(s)),
    };
  }

  private mapScreenshot(s: {
    os: string;
    os_version: string;
    browser: string;
    browser_version: string;
    image_url: string;
    thumb_url: string;
    state: string;
    created_at: string;
  }): Screenshot {
    return {
      browser: s.browser,
      browserVersion: s.browser_version,
      os: s.os,
      osVersion: s.os_version,
      imageUrl: s.image_url ?? "",
      thumbUrl: s.thumb_url ?? "",
      status:
        s.state === "done"
          ? "done"
          : s.state === "failed"
            ? "failed"
            : "pending",
      createdAt: s.created_at,
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!process.env.BROWSERSTACK_USERNAME) return false;
    try {
      const res = await fetch(
        "https://www.browserstack.com/screenshots/browsers.json",
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
