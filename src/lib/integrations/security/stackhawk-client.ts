// ============================================================
// ViberQC — StackHawk Client (Paid: Pro $42/contributor/mo)
// DAST scanning for REST/GraphQL/gRPC APIs
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { StackHawkResult } from "./types";

export class StackHawkClient extends BaseApiClient {
  constructor() {
    super(
      { ...getApiConfig("stackhawk"), apiKey: process.env.STACKHAWK_API_KEY },
      apiCache,
    );
  }

  async scanApi(url: string, userId?: string): Promise<StackHawkResult> {
    // StackHawk requires a pre-configured application in their dashboard
    // This is a simplified integration that fetches scan results
    const response = await this.request<{
      findings: {
        pluginId: string;
        pluginName: string;
        severity: string;
        description: string;
        solution: string;
        url: string;
      }[];
    }>("/api/v1/scan/results", {
      method: "GET",
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
      userId,
    });

    const findings = response.data.findings.map((f) => ({
      pluginId: f.pluginId,
      name: f.pluginName,
      severity: f.severity,
      description: f.description,
      solution: f.solution,
      url: f.url || url,
    }));

    return {
      findings,
      summary: {
        total: findings.length,
        critical: findings.filter((f) => f.severity === "Critical").length,
        high: findings.filter((f) => f.severity === "High").length,
        medium: findings.filter((f) => f.severity === "Medium").length,
        low: findings.filter((f) => f.severity === "Low").length,
      },
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/api/v1/user`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
