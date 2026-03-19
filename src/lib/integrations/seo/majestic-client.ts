// ============================================================
// ViberQC — Majestic API Client (API plan $399.99/mo)
// Trust Flow, Citation Flow, Backlink data
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { MajesticMetrics } from "./types";

export class MajesticClient extends BaseApiClient {
  constructor() {
    super(getApiConfig("majestic"), apiCache);
  }

  async getMetrics(url: string, userId?: string): Promise<MajesticMetrics> {
    const apiKey = process.env.MAJESTIC_API_KEY ?? "";
    const cacheKey = `majestic:${url}`;

    const response = await this.request<{
      DataTables: {
        Results: {
          Data: {
            TrustFlow: number;
            CitationFlow: number;
            RefDomains: number;
            ExtBackLinks: number;
            RefIPs: number;
            RefSubNets: number;
          }[];
        };
      };
    }>(
      `?cmd=GetIndexItemInfo&items=1&item0=${encodeURIComponent(url)}&datasource=fresh&app_api_key=${apiKey}`,
      {
        method: "GET",
        userId,
        cacheKey,
        cacheTtl: CACHE_TTL.DOMAIN_AUTHORITY,
      },
    );

    const data = response.data.DataTables?.Results?.Data?.[0];
    if (!data) {
      return {
        trustFlow: 0,
        citationFlow: 0,
        referringDomains: 0,
        externalBacklinks: 0,
        referringIps: 0,
        referringSubnets: 0,
      };
    }

    return {
      trustFlow: data.TrustFlow ?? 0,
      citationFlow: data.CitationFlow ?? 0,
      referringDomains: data.RefDomains ?? 0,
      externalBacklinks: data.ExtBackLinks ?? 0,
      referringIps: data.RefIPs ?? 0,
      referringSubnets: data.RefSubNets ?? 0,
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!process.env.MAJESTIC_API_KEY) return false;
    return true;
  }
}
