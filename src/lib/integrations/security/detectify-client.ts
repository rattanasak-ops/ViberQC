// ============================================================
// ViberQC — Detectify Client (Paid: App $90/mo, EASM $302/mo)
// DAST + External Attack Surface Management
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { DetectifyResult } from "./types";

export class DetectifyClient extends BaseApiClient {
  constructor() {
    super(
      { ...getApiConfig("detectify"), apiKey: process.env.DETECTIFY_API_KEY },
      apiCache,
    );
  }

  async startScan(scanProfileToken: string, userId?: string): Promise<void> {
    await this.request(`/scans/${scanProfileToken}/`, {
      method: "POST",
      headers: { "X-Detectify-Key": this.config.apiKey ?? "" },
      userId,
    });
  }

  async getScanResults(
    scanProfileToken: string,
    userId?: string,
  ): Promise<DetectifyResult> {
    const response = await this.request<{
      findings: {
        uuid: string;
        title: string;
        found_at: string;
        severity: string;
        definition: {
          description: string;
          risk: string;
          remediation: string;
        };
      }[];
    }>(`/scans/${scanProfileToken}/latest/findings/`, {
      method: "GET",
      headers: { "X-Detectify-Key": this.config.apiKey ?? "" },
      userId,
    });

    return {
      findings: response.data.findings.map((f) => ({
        uuid: f.uuid,
        title: f.title,
        severity: f.severity,
        definition: f.definition,
      })),
      score: 0, // Detectify doesn't provide a single score
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/domains/`, {
        headers: { "X-Detectify-Key": this.config.apiKey },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
