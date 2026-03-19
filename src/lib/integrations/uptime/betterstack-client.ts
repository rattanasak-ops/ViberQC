// ============================================================
// ViberQC — Better Stack (formerly Better Uptime) Client
// Docs: https://betterstack.com/docs/uptime/api/
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { UptimeMonitor } from "./types";

interface BetterStackMonitor {
  id: string;
  attributes: {
    url: string;
    pronounceable_name: string;
    status: string; // "up", "down", "paused", "maintenance", "pending", "validating"
    check_frequency: number; // seconds
    last_checked_at: string | null;
    created_at: string;
    updated_at: string;
    response_times?: { value: number }[];
    uptime?: number;
  };
}

interface BetterStackListResponse {
  data: BetterStackMonitor[];
}

interface BetterStackCreateResponse {
  data: BetterStackMonitor;
}

export class BetterStackClient extends BaseApiClient {
  constructor() {
    super(
      {
        ...getApiConfig("better_stack"),
        apiKey: process.env.BETTER_STACK_API_TOKEN,
      },
      apiCache,
    );
  }

  /**
   * Create a new monitor.
   */
  async createMonitor(
    name: string,
    url: string,
    checkFrequency = 300,
    userId?: string,
  ): Promise<UptimeMonitor> {
    const response = await this.request<BetterStackCreateResponse>(
      "/monitors",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monitor_type: "status",
          url,
          pronounceable_name: name,
          check_frequency: checkFrequency,
        }),
        userId,
      },
    );

    return this.mapMonitor(response.data.data);
  }

  /**
   * List all monitors.
   */
  async getMonitors(userId?: string): Promise<UptimeMonitor[]> {
    const response = await this.request<BetterStackListResponse>("/monitors", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      userId,
    });

    return (response.data.data ?? []).map((m) => this.mapMonitor(m));
  }

  /**
   * Get a single monitor by ID.
   */
  async getMonitor(monitorId: string, userId?: string): Promise<UptimeMonitor> {
    const response = await this.request<{ data: BetterStackMonitor }>(
      `/monitors/${monitorId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        userId,
      },
    );

    return this.mapMonitor(response.data.data);
  }

  /**
   * Delete a monitor.
   */
  async deleteMonitor(monitorId: string, userId?: string): Promise<boolean> {
    await this.request<Record<string, never>>(`/monitors/${monitorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      userId,
    });
    return true;
  }

  private mapMonitor(m: BetterStackMonitor): UptimeMonitor {
    const statusMap: Record<string, UptimeMonitor["status"]> = {
      up: "up",
      down: "down",
      paused: "paused",
      maintenance: "paused",
      pending: "unknown",
      validating: "unknown",
    };

    const avgResponseTime = m.attributes.response_times?.length
      ? Math.round(
          m.attributes.response_times.reduce((sum, r) => sum + r.value, 0) /
            m.attributes.response_times.length,
        )
      : 0;

    return {
      id: m.id,
      name: m.attributes.pronounceable_name,
      url: m.attributes.url,
      status: statusMap[m.attributes.status] ?? "unknown",
      uptimePercent: m.attributes.uptime ?? 100,
      responseTimeMs: avgResponseTime,
      checkIntervalSeconds: m.attributes.check_frequency,
      lastCheckedAt: m.attributes.last_checked_at,
      createdAt: m.attributes.created_at,
      provider: "better_stack",
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/monitors?per_page=1`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
