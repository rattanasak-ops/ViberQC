// ============================================================
// ViberQC — WAVE API Client (Paid ~$0.025/credit)
// Docs: https://wave.webaim.org/api/
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { CACHE_TTL, apiCache } from "../cache";
import type { WaveResult, WaveCategory, WaveItem } from "./types";

// WAVE API response shape
interface WaveApiResponse {
  status: {
    success: boolean;
    httpstatuscode: number;
  };
  statistics: {
    pagetitle: string;
    pageurl: string;
    allitemcount: number;
    totalelements: number;
  };
  categories: {
    error: WaveApiCategory;
    contrast: WaveApiCategory;
    alert: WaveApiCategory;
    feature: WaveApiCategory;
    structure: WaveApiCategory;
    aria: WaveApiCategory;
  };
}

interface WaveApiCategory {
  description: string;
  count: number;
  items: Record<
    string,
    {
      id: string;
      description: string;
      count: number;
      selectors?: string[];
    }
  >;
}

export class WaveClient extends BaseApiClient {
  constructor() {
    super(
      {
        ...getApiConfig("wave"),
        apiKey: process.env.WAVE_API_KEY,
      },
      apiCache,
    );
  }

  /**
   * Analyze a URL using the WAVE API.
   * reporttype=4 returns the most detailed JSON response.
   */
  async analyze(url: string, userId?: string): Promise<WaveResult> {
    const apiKey = this.config.apiKey;
    if (!apiKey) {
      throw new Error("WAVE_API_KEY is not configured");
    }

    const cacheKey = `wave:${url}`;
    const encodedUrl = encodeURIComponent(url);

    const response = await this.request<WaveApiResponse>(
      `?key=${apiKey}&url=${encodedUrl}&reporttype=4`,
      {
        method: "GET",
        userId,
        cacheKey,
        cacheTtl: CACHE_TTL.SCAN_RESULT,
      },
    );

    return this.mapResult(response.data);
  }

  private mapResult(data: WaveApiResponse): WaveResult {
    const mapCategory = (cat: WaveApiCategory): WaveCategory => {
      const items: WaveItem[] = Object.values(cat.items).map((item) => ({
        id: item.id,
        description: item.description,
        count: item.count,
        selectors: item.selectors ?? [],
      }));

      return {
        count: cat.count,
        items,
      };
    };

    return {
      categories: {
        error: mapCategory(data.categories.error),
        contrast: mapCategory(data.categories.contrast),
        alert: mapCategory(data.categories.alert),
        feature: mapCategory(data.categories.feature),
        structure: mapCategory(data.categories.structure),
        aria: mapCategory(data.categories.aria),
      },
      statistics: {
        totalElements: data.statistics.totalelements,
        pageTitle: data.statistics.pagetitle,
        pageUrl: data.statistics.pageurl,
      },
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      // WAVE doesn't have a dedicated health endpoint;
      // just check if the API base URL is reachable
      const res = await fetch(this.config.baseUrl, { method: "HEAD" });
      return res.ok || res.status === 405;
    } catch {
      return false;
    }
  }
}
