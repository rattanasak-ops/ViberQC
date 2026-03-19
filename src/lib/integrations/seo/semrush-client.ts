// ============================================================
// ViberQC — SEMrush API Client (Premium: Business $499.95/mo)
// Domain Overview, Organic Positions, Backlinks
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { SemrushOverview } from "./types";

export class SemrushClient extends BaseApiClient {
  constructor() {
    super(getApiConfig("semrush"), apiCache);
  }

  async getDomainOverview(
    domain: string,
    userId?: string,
    database = "th",
  ): Promise<SemrushOverview> {
    const apiKey = process.env.SEMRUSH_API_KEY ?? "";
    const cacheKey = `semrush:${domain}`;

    const response = await this.request<string>(
      `/?type=domain_ranks&key=${apiKey}&export_columns=Dn,Rk,Or,Ot,Oc,Ob&domain=${encodeURIComponent(domain)}&database=${database}`,
      {
        method: "GET",
        userId,
        cacheKey,
        cacheTtl: CACHE_TTL.DOMAIN_AUTHORITY,
      },
    );

    // SEMrush returns CSV-like format for some endpoints
    const data = response.data;
    if (typeof data === "string") {
      const lines = data.trim().split("\n");
      if (lines.length >= 2) {
        const values = lines[1].split(";");
        return {
          domainScore: parseInt(values[1] ?? "0", 10),
          organicKeywords: parseInt(values[2] ?? "0", 10),
          organicTraffic: parseInt(values[3] ?? "0", 10),
          backlinks: parseInt(values[4] ?? "0", 10),
          referringDomains: parseInt(values[5] ?? "0", 10),
        };
      }
    }

    return {
      domainScore: 0,
      organicKeywords: 0,
      organicTraffic: 0,
      backlinks: 0,
      referringDomains: 0,
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!process.env.SEMRUSH_API_KEY) return false;
    return true;
  }
}
