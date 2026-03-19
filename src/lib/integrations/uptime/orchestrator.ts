// ============================================================
// ViberQC — Uptime Monitoring Orchestrator
// Continuous monitoring, not per-scan. No credits needed.
// ============================================================

import { UptimeRobotClient } from "./uptimerobot-client";
import { BetterStackClient } from "./betterstack-client";
import type {
  UptimeMonitor,
  UptimeSetupResult,
  UptimeStatusResult,
} from "./types";

export type UptimeApiName = "uptimerobot" | "better_stack";

/**
 * Create a new uptime monitor using the preferred provider.
 */
export async function createUptimeMonitor(
  name: string,
  url: string,
  userId: string,
  provider: UptimeApiName = "uptimerobot",
  checkIntervalSeconds = 300,
): Promise<UptimeSetupResult> {
  try {
    let monitor: UptimeMonitor;

    if (provider === "better_stack" && process.env.BETTER_STACK_API_TOKEN) {
      const client = new BetterStackClient();
      monitor = await client.createMonitor(
        name,
        url,
        checkIntervalSeconds,
        userId,
      );
    } else if (process.env.UPTIMEROBOT_API_KEY) {
      const client = new UptimeRobotClient();
      monitor = await client.createMonitor(
        name,
        url,
        checkIntervalSeconds,
        userId,
      );
    } else {
      return {
        monitor: emptyMonitor(name, url, provider),
        provider,
        success: false,
        message: "No API key configured for the selected provider",
      };
    }

    return {
      monitor,
      provider,
      success: true,
      message: `Monitor created successfully via ${provider}`,
    };
  } catch (error) {
    return {
      monitor: emptyMonitor(name, url, provider),
      provider,
      success: false,
      message: String(error),
    };
  }
}

/**
 * List all monitors from the preferred provider.
 */
export async function listUptimeMonitors(
  userId: string,
  provider: UptimeApiName = "uptimerobot",
): Promise<UptimeStatusResult> {
  const errors: { provider: string; message: string }[] = [];
  let monitors: UptimeMonitor[] = [];

  try {
    if (provider === "better_stack" && process.env.BETTER_STACK_API_TOKEN) {
      const client = new BetterStackClient();
      monitors = await client.getMonitors(userId);
    } else if (process.env.UPTIMEROBOT_API_KEY) {
      const client = new UptimeRobotClient();
      monitors = await client.getMonitors(userId);
    } else {
      errors.push({
        provider,
        message: "No API key configured",
      });
    }
  } catch (e) {
    errors.push({ provider, message: String(e) });
  }

  return {
    monitors,
    provider,
    scannedAt: new Date().toISOString(),
    errors,
  };
}

/**
 * Delete a monitor.
 */
export async function deleteUptimeMonitor(
  monitorId: string,
  userId: string,
  provider: UptimeApiName = "uptimerobot",
): Promise<boolean> {
  if (provider === "better_stack" && process.env.BETTER_STACK_API_TOKEN) {
    return new BetterStackClient().deleteMonitor(monitorId, userId);
  }
  if (process.env.UPTIMEROBOT_API_KEY) {
    return new UptimeRobotClient().deleteMonitor(monitorId, userId);
  }
  return false;
}

function emptyMonitor(
  name: string,
  url: string,
  provider: string,
): UptimeMonitor {
  return {
    id: "",
    name,
    url,
    status: "unknown",
    uptimePercent: 0,
    responseTimeMs: 0,
    checkIntervalSeconds: 300,
    lastCheckedAt: null,
    createdAt: new Date().toISOString(),
    provider,
  };
}
