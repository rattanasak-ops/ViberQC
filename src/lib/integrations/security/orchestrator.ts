// ============================================================
// ViberQC — Security Deep Scan Orchestrator
// Coordinates all security API clients
// ============================================================

import { ObservatoryClient } from "./observatory-client";
import { SslLabsClient } from "./ssllabs-client";
import { SnykClient } from "./snyk-client";
import { StackHawkClient } from "./stackhawk-client";
import { DetectifyClient } from "./detectify-client";
import { IntruderClient } from "./intruder-client";
import type { SecurityDeepScanResult } from "./types";

export type SecurityApiName =
  | "observatory"
  | "ssl_labs"
  | "snyk"
  | "stackhawk"
  | "detectify"
  | "intruder";

/**
 * Run a security deep scan using multiple providers.
 * Free APIs (Observatory, SSL Labs) always run.
 * Paid APIs run only if enabledApis includes them.
 */
export async function runSecurityDeepScan(
  url: string,
  userId: string,
  enabledApis: SecurityApiName[] = [],
): Promise<SecurityDeepScanResult> {
  const hostname = new URL(url).hostname;
  const errors: { provider: string; message: string }[] = [];
  const providersUsed: string[] = [];

  // --- Free APIs (always run) ---
  const [observatoryResult, sslLabsResult] = await Promise.allSettled([
    runProvider("observatory", () =>
      new ObservatoryClient().scan(hostname, userId),
    ),
    runProvider("ssl_labs", () =>
      new SslLabsClient().analyze(hostname, userId),
    ),
  ]);

  const observatory =
    observatoryResult.status === "fulfilled" ? observatoryResult.value : null;
  if (observatoryResult.status === "fulfilled")
    providersUsed.push("observatory");
  if (observatoryResult.status === "rejected") {
    errors.push({
      provider: "observatory",
      message: String(observatoryResult.reason),
    });
  }

  const sslLabs =
    sslLabsResult.status === "fulfilled" ? sslLabsResult.value : null;
  if (sslLabsResult.status === "fulfilled") providersUsed.push("ssl_labs");
  if (sslLabsResult.status === "rejected") {
    errors.push({
      provider: "ssl_labs",
      message: String(sslLabsResult.reason),
    });
  }

  // --- Paid APIs (run if enabled) ---
  const paid: {
    snyk: import("./types").SnykScanResult | null;
    stackhawk: import("./types").StackHawkResult | null;
    detectify: import("./types").DetectifyResult | null;
    intruder: import("./types").IntruderResult | null;
  } = { snyk: null, stackhawk: null, detectify: null, intruder: null };

  const paidTasks: Promise<void>[] = [];

  if (enabledApis.includes("snyk") && process.env.SNYK_API_TOKEN) {
    paidTasks.push(
      runProvider("snyk", () => new SnykClient().getOrgIssues(userId))
        .then((r) => {
          paid.snyk = r;
          providersUsed.push("snyk");
        })
        .catch((e) => {
          errors.push({ provider: "snyk", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("stackhawk") && process.env.STACKHAWK_API_KEY) {
    paidTasks.push(
      runProvider("stackhawk", () => new StackHawkClient().scanApi(url, userId))
        .then((r) => {
          paid.stackhawk = r;
          providersUsed.push("stackhawk");
        })
        .catch((e) => {
          errors.push({ provider: "stackhawk", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("detectify") && process.env.DETECTIFY_API_KEY) {
    paidTasks.push(
      runProvider("detectify", () =>
        new DetectifyClient().getScanResults("default", userId),
      )
        .then((r) => {
          paid.detectify = r;
          providersUsed.push("detectify");
        })
        .catch((e) => {
          errors.push({ provider: "detectify", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("intruder") && process.env.INTRUDER_API_KEY) {
    paidTasks.push(
      runProvider("intruder", () =>
        new IntruderClient().getIssues("default", userId),
      )
        .then((r) => {
          paid.intruder = r;
          providersUsed.push("intruder");
        })
        .catch((e) => {
          errors.push({ provider: "intruder", message: String(e) });
        }),
    );
  }

  await Promise.allSettled(paidTasks);

  // --- Calculate overall grade ---
  const overallGrade = calculateOverallGrade(
    observatory?.grade ?? null,
    sslLabs?.grade ?? null,
  );

  // --- Count total issues ---
  const totalIssues =
    (paid.snyk?.summary.critical ?? 0) +
    (paid.snyk?.summary.high ?? 0) +
    (paid.snyk?.summary.medium ?? 0) +
    (paid.snyk?.summary.low ?? 0) +
    (paid.stackhawk?.summary.total ?? 0) +
    (paid.detectify?.findings.length ?? 0) +
    (paid.intruder?.issues.length ?? 0);

  return {
    observatory,
    sslLabs,
    snyk: paid.snyk,
    stackhawk: paid.stackhawk,
    detectify: paid.detectify,
    intruder: paid.intruder,
    overallGrade,
    totalIssues,
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
    console.error(`[SecurityDeepScan] ${name} failed:`, error);
    throw error;
  }
}

function calculateOverallGrade(
  observatoryGrade: string | null,
  sslGrade: string | null,
): string {
  const gradeOrder = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D",
    "F",
  ];

  const obsIdx = observatoryGrade ? gradeOrder.indexOf(observatoryGrade) : -1;
  const sslIdx = sslGrade ? gradeOrder.indexOf(sslGrade) : -1;

  if (obsIdx === -1 && sslIdx === -1) return "N/A";
  if (obsIdx === -1) return sslGrade!;
  if (sslIdx === -1) return observatoryGrade!;

  // Return the worse grade
  const worstIdx = Math.max(obsIdx, sslIdx);
  return gradeOrder[worstIdx] ?? "N/A";
}
