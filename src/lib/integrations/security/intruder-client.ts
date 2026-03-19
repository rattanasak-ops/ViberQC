// ============================================================
// ViberQC — Intruder Client (Paid: $149-499/mo)
// Infrastructure + Cloud + Web App vulnerability scanning
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { IntruderResult } from "./types";

export class IntruderClient extends BaseApiClient {
  constructor() {
    super(
      { ...getApiConfig("intruder"), apiKey: process.env.INTRUDER_API_KEY },
      apiCache,
    );
  }

  async getIssues(targetId: string, userId?: string): Promise<IntruderResult> {
    const response = await this.request<{
      issues: {
        id: string;
        title: string;
        severity: string;
        description: string;
        remediation: string;
      }[];
    }>(`/targets/${targetId}/issues`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
      userId,
    });

    const issues = response.data.issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      severity: issue.severity,
      description: issue.description,
      remediation: issue.remediation,
    }));

    // Simple risk score based on issue severities
    const weights = { critical: 10, high: 5, medium: 2, low: 1 };
    const totalWeight = issues.reduce((sum, i) => {
      const key = i.severity.toLowerCase() as keyof typeof weights;
      return sum + (weights[key] ?? 0);
    }, 0);
    const riskScore = Math.min(100, totalWeight);

    return { issues, riskScore };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/targets`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
