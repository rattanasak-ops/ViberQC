// ============================================================
// ViberQC — Performance Deep Scan Orchestrator
// Coordinates all performance API clients
// ============================================================

import { PageSpeedClient } from "./pagespeed-client";
import { GtmetrixClient } from "./gtmetrix-client";
import { WebPageTestClient } from "./webpagetest-client";
import type { PerformanceDeepScanResult } from "./types";

export type PerformanceApiName = "pagespeed" | "gtmetrix" | "webpagetest";

/**
 * Run a performance deep scan using multiple providers.
 * Free APIs (PageSpeed Insights) always run.
 * Paid APIs run only if enabledApis includes them.
 */
export async function runPerformanceDeepScan(
  url: string,
  userId: string,
  enabledApis: PerformanceApiName[] = [],
): Promise<PerformanceDeepScanResult> {
  const errors: { provider: string; message: string }[] = [];
  const providersUsed: string[] = [];

  // --- Free APIs (always run) ---
  const [pagespeedResult] = await Promise.allSettled([
    runProvider("pagespeed", () =>
      new PageSpeedClient().analyze(url, "mobile", userId),
    ),
  ]);

  const pagespeed =
    pagespeedResult.status === "fulfilled" ? pagespeedResult.value : null;
  if (pagespeedResult.status === "fulfilled") providersUsed.push("pagespeed");
  if (pagespeedResult.status === "rejected") {
    errors.push({
      provider: "pagespeed",
      message: String(pagespeedResult.reason),
    });
  }

  // --- Paid APIs (run if enabled) ---
  const paid: {
    gtmetrix: import("./types").GtmetrixResult | null;
    webpagetest: import("./types").WebPageTestResult | null;
  } = { gtmetrix: null, webpagetest: null };

  const paidTasks: Promise<void>[] = [];

  if (enabledApis.includes("gtmetrix") && process.env.GTMETRIX_API_KEY) {
    paidTasks.push(
      runProvider("gtmetrix", () => new GtmetrixClient().analyze(url, userId))
        .then((r) => {
          paid.gtmetrix = r;
          providersUsed.push("gtmetrix");
        })
        .catch((e) => {
          errors.push({ provider: "gtmetrix", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("webpagetest") && process.env.WEBPAGETEST_API_KEY) {
    paidTasks.push(
      runProvider("webpagetest", () =>
        new WebPageTestClient().analyze(url, userId),
      )
        .then((r) => {
          paid.webpagetest = r;
          providersUsed.push("webpagetest");
        })
        .catch((e) => {
          errors.push({ provider: "webpagetest", message: String(e) });
        }),
    );
  }

  await Promise.allSettled(paidTasks);

  // --- Calculate overall score ---
  const overallScore = calculateOverallScore(
    pagespeed?.score ?? null,
    paid.gtmetrix?.performanceScore ?? null,
  );

  return {
    pagespeed,
    gtmetrix: paid.gtmetrix,
    webpagetest: paid.webpagetest,
    overallScore,
    scannedAt: new Date().toISOString(),
    providersUsed,
    errors,
  };
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

async function runProvider<T>(name: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[PerformanceDeepScan] ${name} failed:`, error);
    throw error;
  }
}

function calculateOverallScore(
  pagespeedScore: number | null,
  gtmetrixScore: number | null,
): number {
  const scores: number[] = [];

  if (pagespeedScore !== null) scores.push(pagespeedScore);
  if (gtmetrixScore !== null) scores.push(gtmetrixScore);

  if (scores.length === 0) return 0;

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
