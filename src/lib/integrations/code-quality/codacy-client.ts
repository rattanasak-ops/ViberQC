// ============================================================
// ViberQC — Codacy Client (Paid: Pro $15/dev/mo)
// Docs: https://api.codacy.com/api/v3/docs
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type { CodacyAnalysis } from "./types";

interface CodacyRepoResponse {
  data: {
    repository: {
      name: string;
      grade: string;
      languages: string[];
    };
    issuesCount: number;
    complexFilesCount: number;
    duplicatedFilesCount: number;
    coveragePercentage: number;
    gradeLetter: string;
    categories: {
      Security: number;
      ErrorProne: number;
      CodeStyle: number;
      Compatibility: number;
      Performance: number;
      UnusedCode: number;
    };
  };
}

export class CodacyClient extends BaseApiClient {
  constructor() {
    super(
      {
        ...getApiConfig("codacy"),
        apiKey: process.env.CODACY_API_TOKEN,
      },
      apiCache,
    );
  }

  /**
   * Get repository analysis summary.
   * @param provider - "gh" for GitHub, "gl" for GitLab, "bb" for Bitbucket
   * @param org - Organization/username
   * @param repo - Repository name
   */
  async getRepoAnalysis(
    provider: string,
    org: string,
    repo: string,
    userId?: string,
  ): Promise<CodacyAnalysis> {
    const response = await this.request<CodacyRepoResponse>(
      `/analysis/organizations/${encodeURIComponent(provider)}/${encodeURIComponent(org)}/repositories/${encodeURIComponent(repo)}`,
      {
        method: "GET",
        headers: {
          "api-token": this.config.apiKey ?? "",
          Accept: "application/json",
        },
        userId,
        cacheKey: `codacy:repo:${provider}:${org}:${repo}`,
        cacheTtl: 60 * 60 * 1000, // 1 hour
      },
    );

    const data = response.data.data;

    return {
      grade: data?.gradeLetter ?? data?.repository?.grade ?? "N/A",
      issues: data?.issuesCount ?? 0,
      complexity: data?.complexFilesCount ?? 0,
      duplication: data?.duplicatedFilesCount ?? 0,
      coverage: data?.coveragePercentage ?? 0,
      categories: {
        security: data?.categories?.Security ?? 0,
        errorProne: data?.categories?.ErrorProne ?? 0,
        codeStyle: data?.categories?.CodeStyle ?? 0,
        compatibility: data?.categories?.Compatibility ?? 0,
        performance: data?.categories?.Performance ?? 0,
        unused: data?.categories?.UnusedCode ?? 0,
      },
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/user`, {
        headers: {
          "api-token": this.config.apiKey,
          Accept: "application/json",
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
