// ============================================================
// ViberQC — Accessibility Deep Scan Orchestrator
// Coordinates all accessibility API clients
// ============================================================

import { AxeCoreClient } from "./axe-client";
import { WaveClient } from "./wave-client";
import { Pa11yClient } from "./pa11y-client";
import type { AccessibilityDeepScanResult } from "./types";

export type AccessibilityApiName = "axe" | "wave" | "pa11y";

/**
 * Run an accessibility deep scan using multiple providers.
 * Free tools (axe-core, pa11y) run based on enabledApis.
 * WAVE runs only if enabledApis includes "wave" AND WAVE_API_KEY exists.
 */
export async function runAccessibilityDeepScan(
  url: string,
  userId: string,
  enabledApis: AccessibilityApiName[] = ["axe"],
): Promise<AccessibilityDeepScanResult> {
  const errors: { provider: string; message: string }[] = [];
  const providersUsed: string[] = [];

  // --- Free tools (always available) ---
  const freeSettled = await Promise.allSettled([
    enabledApis.includes("axe")
      ? runProvider("axe", () => new AxeCoreClient().analyze(url))
      : Promise.resolve(null),
    enabledApis.includes("pa11y")
      ? runProvider("pa11y", () => new Pa11yClient().analyze(url))
      : Promise.resolve(null),
  ]);

  const axeSettled = freeSettled[0];
  const pa11ySettled = freeSettled[1];

  const axe = axeSettled.status === "fulfilled" ? axeSettled.value : null;
  if (axeSettled.status === "fulfilled" && axeSettled.value) {
    providersUsed.push("axe");
  }
  if (axeSettled.status === "rejected") {
    errors.push({ provider: "axe", message: String(axeSettled.reason) });
  }

  const pa11y = pa11ySettled.status === "fulfilled" ? pa11ySettled.value : null;
  if (pa11ySettled.status === "fulfilled" && pa11ySettled.value) {
    providersUsed.push("pa11y");
  }
  if (pa11ySettled.status === "rejected") {
    errors.push({ provider: "pa11y", message: String(pa11ySettled.reason) });
  }

  // --- Paid API (WAVE) ---
  const paid: {
    wave: import("./types").WaveResult | null;
  } = { wave: null };

  const paidTasks: Promise<void>[] = [];

  if (enabledApis.includes("wave") && process.env.WAVE_API_KEY) {
    paidTasks.push(
      runProvider("wave", () => new WaveClient().analyze(url, userId))
        .then((r) => {
          paid.wave = r;
          providersUsed.push("wave");
        })
        .catch((e) => {
          errors.push({ provider: "wave", message: String(e) });
        }),
    );
  }

  await Promise.allSettled(paidTasks);

  // --- Calculate WCAG level ---
  const wcagLevel = determineWcagLevel(axe, pa11y);

  // --- Count total violations ---
  const totalViolations =
    (axe?.violations.length ?? 0) +
    (paid.wave?.categories.error.count ?? 0) +
    (paid.wave?.categories.contrast.count ?? 0) +
    (pa11y?.issues.filter((i) => i.type === "error").length ?? 0);

  return {
    axe,
    wave: paid.wave,
    pa11y,
    wcagLevel,
    totalViolations,
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
    console.error(`[AccessibilityDeepScan] ${name} failed:`, error);
    throw error;
  }
}

/**
 * Determine the effective WCAG conformance level based on violations.
 * If critical violations exist, level is below WCAG 2.1 A.
 */
function determineWcagLevel(
  axe: import("./types").AxeResult | null,
  pa11y: import("./types").Pa11yResult | null,
): string {
  const hasCritical =
    axe?.violations.some((v) => v.impact === "critical") ?? false;
  const hasSerious =
    axe?.violations.some((v) => v.impact === "serious") ?? false;
  const errorCount =
    pa11y?.issues.filter((i) => i.type === "error").length ?? 0;

  if (hasCritical || errorCount > 10) return "Below WCAG 2.1 A";
  if (hasSerious || errorCount > 5) return "Partial WCAG 2.1 A";
  if (errorCount > 0) return "WCAG 2.1 A";
  return "WCAG 2.1 AA (approximate)";
}
