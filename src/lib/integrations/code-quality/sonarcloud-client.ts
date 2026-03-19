// ============================================================
// ViberQC — SonarCloud Client (Paid: Developer $10/mo)
// Docs: https://sonarcloud.io/web_api
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { SonarMetrics } from "./types";

interface SonarMeasuresResponse {
  component: {
    measures: {
      metric: string;
      value: string;
    }[];
  };
}

interface SonarIssuesResponse {
  total: number;
  issues: {
    key: string;
    rule: string;
    severity: string;
    type: string;
    message: string;
    component: string;
    line: number;
  }[];
}

export class SonarCloudClient extends BaseApiClient {
  constructor() {
    super(
      {
        ...getApiConfig("sonarcloud"),
        apiKey: process.env.SONARCLOUD_TOKEN,
      },
      apiCache,
    );
  }

  /**
   * Get component measures (bugs, vulnerabilities, code_smells, coverage, etc.)
   */
  async getMeasures(
    projectKey: string,
    userId?: string,
  ): Promise<SonarMetrics> {
    const metricKeys = [
      "bugs",
      "vulnerabilities",
      "code_smells",
      "coverage",
      "duplicated_lines_density",
      "reliability_rating",
      "security_rating",
      "sqale_rating",
    ].join(",");

    const response = await this.request<SonarMeasuresResponse>(
      `/measures/component?component=${encodeURIComponent(projectKey)}&metricKeys=${metricKeys}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        userId,
        cacheKey: `sonarcloud:measures:${projectKey}`,
        cacheTtl: 60 * 60 * 1000, // 1 hour
      },
    );

    const measures = response.data.component?.measures ?? [];
    const get = (metric: string): string =>
      measures.find((m) => m.metric === metric)?.value ?? "0";

    return {
      bugs: parseInt(get("bugs"), 10),
      vulnerabilities: parseInt(get("vulnerabilities"), 10),
      codeSmells: parseInt(get("code_smells"), 10),
      coverage: parseFloat(get("coverage")),
      duplicatedLinesDensity: parseFloat(get("duplicated_lines_density")),
      ratings: {
        reliability: ratingToGrade(get("reliability_rating")),
        security: ratingToGrade(get("security_rating")),
        maintainability: ratingToGrade(get("sqale_rating")),
      },
    };
  }

  /**
   * Search for issues on a project.
   */
  async getIssues(
    projectKey: string,
    userId?: string,
    pageSize = 100,
  ): Promise<SonarIssuesResponse> {
    const response = await this.request<SonarIssuesResponse>(
      `/issues/search?componentKeys=${encodeURIComponent(projectKey)}&ps=${pageSize}&resolved=false`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        userId,
      },
    );

    return response.data;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/system/status`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

// SonarQube rating values: 1=A, 2=B, 3=C, 4=D, 5=E
function ratingToGrade(value: string): string {
  const map: Record<string, string> = {
    "1": "A",
    "1.0": "A",
    "2": "B",
    "2.0": "B",
    "3": "C",
    "3.0": "C",
    "4": "D",
    "4.0": "D",
    "5": "E",
    "5.0": "E",
  };
  return map[value] ?? "N/A";
}
