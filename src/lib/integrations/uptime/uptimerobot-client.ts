// ============================================================
// ViberQC — UptimeRobot Client (Free: 50 monitors)
// Docs: https://uptimerobot.com/api/
// Note: UptimeRobot uses POST for all endpoints with API key in body
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { UptimeMonitor } from "./types";

interface UptimeRobotMonitor {
  id: number;
  friendly_name: string;
  url: string;
  status: number; // 0=paused, 1=not checked, 2=up, 8=seems down, 9=down
  all_time_uptime_ratio: string;
  average_response_time: string;
  interval: number;
  create_datetime: number;
}

interface UptimeRobotGetMonitorsResponse {
  stat: string;
  monitors: UptimeRobotMonitor[];
}

interface UptimeRobotNewMonitorResponse {
  stat: string;
  monitor: { id: number };
}

interface UptimeRobotDeleteResponse {
  stat: string;
  monitor: { id: number };
}

export class UptimeRobotClient extends BaseApiClient {
  private readonly uptimeApiKey: string;

  constructor() {
    super(getApiConfig("uptimerobot"), apiCache);
    this.uptimeApiKey = process.env.UPTIMEROBOT_API_KEY ?? "";
  }

  /**
   * Create a new HTTP(s) monitor.
   */
  async createMonitor(
    name: string,
    url: string,
    intervalSeconds = 300,
    userId?: string,
  ): Promise<UptimeMonitor> {
    const response = await this.request<UptimeRobotNewMonitorResponse>(
      "/newMonitor",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          api_key: this.uptimeApiKey,
          friendly_name: name,
          url,
          type: "1", // HTTP(s)
          interval: String(intervalSeconds),
        }).toString(),
        userId,
      },
    );

    return {
      id: String(response.data.monitor?.id ?? ""),
      name,
      url,
      status: "unknown",
      uptimePercent: 100,
      responseTimeMs: 0,
      checkIntervalSeconds: intervalSeconds,
      lastCheckedAt: null,
      createdAt: new Date().toISOString(),
      provider: "uptimerobot",
    };
  }

  /**
   * List all monitors.
   */
  async getMonitors(userId?: string): Promise<UptimeMonitor[]> {
    const response = await this.request<UptimeRobotGetMonitorsResponse>(
      "/getMonitors",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          api_key: this.uptimeApiKey,
          format: "json",
          response_times: "1",
          all_time_uptime_ratio: "1",
        }).toString(),
        userId,
      },
    );

    return (response.data.monitors ?? []).map((m) => this.mapMonitor(m));
  }

  /**
   * Delete a monitor.
   */
  async deleteMonitor(monitorId: string, userId?: string): Promise<boolean> {
    const response = await this.request<UptimeRobotDeleteResponse>(
      "/deleteMonitor",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          api_key: this.uptimeApiKey,
          id: monitorId,
        }).toString(),
        userId,
      },
    );

    return response.data.stat === "ok";
  }

  private mapMonitor(m: UptimeRobotMonitor): UptimeMonitor {
    const statusMap: Record<number, UptimeMonitor["status"]> = {
      0: "paused",
      1: "unknown",
      2: "up",
      8: "down",
      9: "down",
    };

    return {
      id: String(m.id),
      name: m.friendly_name,
      url: m.url,
      status: statusMap[m.status] ?? "unknown",
      uptimePercent: parseFloat(m.all_time_uptime_ratio) || 0,
      responseTimeMs: parseInt(m.average_response_time, 10) || 0,
      checkIntervalSeconds: m.interval,
      lastCheckedAt: null,
      createdAt: m.create_datetime
        ? new Date(m.create_datetime * 1000).toISOString()
        : new Date().toISOString(),
      provider: "uptimerobot",
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.uptimeApiKey) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/getAccountDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          api_key: this.uptimeApiKey,
          format: "json",
        }).toString(),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
