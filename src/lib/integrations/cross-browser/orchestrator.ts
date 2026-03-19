// ============================================================
// ViberQC — Cross-Browser Scan Orchestrator
// ============================================================

import { BrowserStackClient } from "./browserstack-client";
import { LambdaTestClient } from "./lambdatest-client";
import type {
  CrossBrowserScanResult,
  BrowserConfig,
  Screenshot,
} from "./types";

export type CrossBrowserApiName = "browserstack" | "lambdatest";

/**
 * Run cross-browser screenshot scan.
 * Uses the first available provider (BrowserStack preferred).
 */
export async function runCrossBrowserScan(
  url: string,
  userId: string,
  enabledApis: CrossBrowserApiName[] = [],
  browsers?: BrowserConfig[],
): Promise<CrossBrowserScanResult> {
  const errors: { provider: string; message: string }[] = [];
  const providersUsed: string[] = [];

  const paid: {
    screenshots: Screenshot[];
    provider: string | null;
  } = { screenshots: [], provider: null };

  // Try BrowserStack first
  if (
    enabledApis.includes("browserstack") &&
    process.env.BROWSERSTACK_USERNAME &&
    process.env.BROWSERSTACK_ACCESS_KEY
  ) {
    try {
      const client = new BrowserStackClient();
      const job = await client.takeScreenshots(url, browsers, userId);
      paid.screenshots = job.screenshots;
      paid.provider = "browserstack";
      providersUsed.push("browserstack");
    } catch (e) {
      errors.push({ provider: "browserstack", message: String(e) });
    }
  }

  // Fall back to LambdaTest if BrowserStack didn't produce results
  if (
    paid.screenshots.length === 0 &&
    enabledApis.includes("lambdatest") &&
    process.env.LAMBDATEST_USERNAME &&
    process.env.LAMBDATEST_ACCESS_KEY
  ) {
    try {
      const client = new LambdaTestClient();
      const job = await client.takeScreenshots(url, browsers, userId);
      paid.screenshots = job.screenshots;
      paid.provider = "lambdatest";
      providersUsed.push("lambdatest");
    } catch (e) {
      errors.push({ provider: "lambdatest", message: String(e) });
    }
  }

  const totalBrowsers = paid.screenshots.length;
  const passedBrowsers = paid.screenshots.filter(
    (s) => s.status === "done",
  ).length;
  const responsiveScore =
    totalBrowsers > 0 ? Math.round((passedBrowsers / totalBrowsers) * 100) : 0;

  return {
    screenshots: paid.screenshots,
    responsiveScore,
    totalBrowsers,
    passedBrowsers,
    provider: paid.provider ?? "none",
    scannedAt: new Date().toISOString(),
    providersUsed,
    errors,
  };
}
