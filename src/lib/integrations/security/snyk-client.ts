// ============================================================
// ViberQC — Snyk Client (Paid: Team $25/dev/mo)
// Docs: https://docs.snyk.io/snyk-api/rest-api
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { SnykScanResult, SnykVulnerability } from "./types";

interface SnykIssueResponse {
  data: {
    id: string;
    attributes: {
      title: string;
      severity: string;
      type: string;
      status: string;
    };
  }[];
}

export class SnykClient extends BaseApiClient {
  constructor() {
    super(
      {
        ...getApiConfig("snyk"),
        apiKey: process.env.SNYK_API_TOKEN,
      },
      apiCache,
    );
  }

  /**
   * Test a package for known vulnerabilities.
   * Requires a Snyk org ID.
   */
  async testPackage(
    ecosystem: string,
    packageName: string,
    version: string,
    userId?: string,
  ): Promise<SnykScanResult> {
    const orgId = process.env.SNYK_ORG_ID;
    if (!orgId) throw new Error("SNYK_ORG_ID is not set");

    const purl = `pkg:${ecosystem}/${encodeURIComponent(packageName)}@${version}`;

    const response = await this.request<{
      data: {
        id: string;
        attributes: {
          title: string;
          severity: string;
          effective_severity_level: string;
          slots: {
            disclosure_time?: string;
            exploit?: string;
            references?: { url: string }[];
          };
        };
      }[];
    }>(
      `/orgs/${orgId}/packages/${encodeURIComponent(purl)}/issues?version=2024-10-15`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${this.config.apiKey}`,
          "Content-Type": "application/vnd.api+json",
        },
        userId,
      },
    );

    return this.mapResult(response.data.data);
  }

  /**
   * List all issues for an organization's projects.
   */
  async getOrgIssues(userId?: string): Promise<SnykScanResult> {
    const orgId = process.env.SNYK_ORG_ID;
    if (!orgId) throw new Error("SNYK_ORG_ID is not set");

    const response = await this.request<SnykIssueResponse>(
      `/orgs/${orgId}/issues?version=2024-10-15&limit=100`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${this.config.apiKey}`,
          "Content-Type": "application/vnd.api+json",
        },
        userId,
      },
    );

    return this.mapResult(response.data.data);
  }

  private mapResult(
    issues: { id: string; attributes: { title: string; severity: string } }[],
  ): SnykScanResult {
    const vulnerabilities: SnykVulnerability[] = issues.map((issue) => ({
      id: issue.id,
      title: issue.attributes.title,
      severity:
        (issue.attributes.severity as SnykVulnerability["severity"]) ?? "low",
      packageName: "",
      version: "",
      fixAvailable: false,
      cvssScore: 0,
      cve: [],
    }));

    const summary = {
      critical: vulnerabilities.filter((v) => v.severity === "critical").length,
      high: vulnerabilities.filter((v) => v.severity === "high").length,
      medium: vulnerabilities.filter((v) => v.severity === "medium").length,
      low: vulnerabilities.filter((v) => v.severity === "low").length,
    };

    return { vulnerabilities, summary };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.config.baseUrl}/self?version=2024-10-15`,
        {
          headers: { Authorization: `token ${this.config.apiKey}` },
        },
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}
