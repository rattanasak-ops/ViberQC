// ============================================================
// ViberQC — Ahrefs API Client (Premium: API $500-10,000/mo)
// Domain Rating, Backlinks, Organic Keywords
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { AhrefsMetrics } from "./types";

export class AhrefsClient extends BaseApiClient {
  constructor() {
    super(
      { ...getApiConfig("ahrefs"), apiKey: process.env.AHREFS_API_TOKEN },
      apiCache,
    );
  }

  async getDomainRating(
    domain: string,
    userId?: string,
  ): Promise<AhrefsMetrics> {
    const cacheKey = `ahrefs:${domain}`;

    const response = await this.request<{
      domain_rating: number;
      url_rating: number;
      backlinks: number;
      refdomains: number;
      organic_keywords: number;
      organic_traffic: number;
    }>(`/site-explorer/domain-rating?target=${encodeURIComponent(domain)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
      userId,
      cacheKey,
      cacheTtl: CACHE_TTL.DOMAIN_AUTHORITY,
    });

    return {
      domainRating: response.data.domain_rating ?? 0,
      urlRating: response.data.url_rating ?? 0,
      backlinks: response.data.backlinks ?? 0,
      referringDomains: response.data.refdomains ?? 0,
      organicKeywords: response.data.organic_keywords ?? 0,
      organicTraffic: response.data.organic_traffic ?? 0,
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    try {
      const res = await fetch(
        `${this.config.baseUrl}/site-explorer/domain-rating?target=ahrefs.com`,
        {
          headers: { Authorization: `Bearer ${this.config.apiKey}` },
        },
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}
