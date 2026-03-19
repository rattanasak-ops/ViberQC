// ============================================================
// ViberQC — Moz API Client (Starter $20/mo, free tier available)
// Domain Authority, Page Authority, Spam Score
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { MozMetrics } from "./types";

export class MozClient extends BaseApiClient {
  private authHeader: string;

  constructor() {
    super(getApiConfig("moz"), apiCache);
    const accessId = process.env.MOZ_ACCESS_ID ?? "";
    const secretKey = process.env.MOZ_SECRET_KEY ?? "";
    this.authHeader = `Basic ${Buffer.from(`${accessId}:${secretKey}`).toString("base64")}`;
  }

  async getUrlMetrics(url: string, userId?: string): Promise<MozMetrics> {
    const cacheKey = `moz:${url}`;

    const response = await this.request<{
      results: {
        domain_authority: number;
        page_authority: number;
        spam_score: number;
        root_domains_to_root_domain: number;
        total_links: number;
      }[];
    }>("/url_metrics", {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targets: [url] }),
      userId,
      cacheKey,
      cacheTtl: CACHE_TTL.DOMAIN_AUTHORITY,
    });

    const result = response.data.results?.[0];
    if (!result) {
      return {
        domainAuthority: 0,
        pageAuthority: 0,
        spamScore: 0,
        rootDomainsLinking: 0,
        totalLinks: 0,
      };
    }

    return {
      domainAuthority: result.domain_authority ?? 0,
      pageAuthority: result.page_authority ?? 0,
      spamScore: result.spam_score ?? 0,
      rootDomainsLinking: result.root_domains_to_root_domain ?? 0,
      totalLinks: result.total_links ?? 0,
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!process.env.MOZ_ACCESS_ID) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/url_metrics`, {
        method: "POST",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targets: ["moz.com"] }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
