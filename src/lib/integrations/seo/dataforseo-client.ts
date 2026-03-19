// ============================================================
// ViberQC — DataForSEO Client (Pay-as-you-go, ~$0.001/req)
// Best value SEO API — on-page, backlinks, SERP
// ============================================================

import { BaseApiClient } from "../base-client";
import { getApiConfig } from "../api-client-factory";
import { apiCache } from "../cache";
import type {
  DataForSeoOnPageResult,
  DataForSeoBacklinkResult,
  DataForSeoSerpResult,
} from "./types";

export class DataForSeoClient extends BaseApiClient {
  private authHeader: string;

  constructor() {
    super(getApiConfig("dataforseo"), apiCache);
    const login = process.env.DATAFORSEO_LOGIN ?? "";
    const password = process.env.DATAFORSEO_PASSWORD ?? "";
    this.authHeader = `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
  }

  async analyzeOnPage(
    url: string,
    userId?: string,
  ): Promise<DataForSeoOnPageResult> {
    const response = await this.request<{
      tasks: {
        result: {
          items: {
            meta: {
              title: string;
              description: string;
              canonical: string;
              robots: string;
            };
            page_timing: { duration_time: number };
            onpage_score: number;
            checks: Record<string, boolean | number>;
          }[];
        }[];
      }[];
    }>("/on_page/instant_pages", {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ url, enable_javascript: true }]),
      userId,
    });

    const item = response.data.tasks?.[0]?.result?.[0]?.items?.[0];
    if (!item) {
      return {
        title: { length: 0, content: "", isOptimal: false },
        metaDescription: { length: 0, content: "", isOptimal: false },
        h1: [],
        h2: [],
        canonical: null,
        robots: null,
        schemaTypes: [],
        imagesWithoutAlt: 0,
        internalLinks: 0,
        externalLinks: 0,
        contentWordCount: 0,
      };
    }

    const title = item.meta?.title ?? "";
    const desc = item.meta?.description ?? "";

    return {
      title: {
        length: title.length,
        content: title,
        isOptimal: title.length >= 30 && title.length <= 60,
      },
      metaDescription: {
        length: desc.length,
        content: desc,
        isOptimal: desc.length >= 120 && desc.length <= 160,
      },
      h1: [],
      h2: [],
      canonical: item.meta?.canonical ?? null,
      robots: item.meta?.robots ?? null,
      schemaTypes: [],
      imagesWithoutAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      contentWordCount: 0,
    };
  }

  async getBacklinks(
    domain: string,
    userId?: string,
  ): Promise<DataForSeoBacklinkResult> {
    const response = await this.request<{
      tasks: {
        result: {
          total_backlinks: number;
          referring_domains: number;
          rank: number;
          broken_backlinks: number;
          referring_links_types: { dofollow: number; nofollow: number };
        }[];
      }[];
    }>("/backlinks/summary/live", {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ target: domain }]),
      userId,
    });

    const result = response.data.tasks?.[0]?.result?.[0];
    if (!result) {
      return {
        totalBacklinks: 0,
        referringDomains: 0,
        domainRank: 0,
        brokenBacklinks: 0,
        doFollow: 0,
        noFollow: 0,
      };
    }

    return {
      totalBacklinks: result.total_backlinks ?? 0,
      referringDomains: result.referring_domains ?? 0,
      domainRank: result.rank ?? 0,
      brokenBacklinks: result.broken_backlinks ?? 0,
      doFollow: result.referring_links_types?.dofollow ?? 0,
      noFollow: result.referring_links_types?.nofollow ?? 0,
    };
  }

  async checkSerp(
    keyword: string,
    userId?: string,
    locationCode = 2764, // Thailand
  ): Promise<DataForSeoSerpResult[]> {
    const response = await this.request<{
      tasks: {
        result: {
          items: {
            type: string;
            rank_absolute: number;
            url: string;
            title: string;
            description: string;
          }[];
          search_information: { search_results_count: number };
        }[];
      }[];
    }>("/serp/google/organic/live/regular", {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          keyword,
          location_code: locationCode,
          language_code: "th",
          depth: 10,
        },
      ]),
      userId,
    });

    const items = response.data.tasks?.[0]?.result?.[0]?.items ?? [];
    return items
      .filter((i) => i.type === "organic")
      .map((i) => ({
        keyword,
        position: i.rank_absolute,
        url: i.url ?? "",
        title: i.title ?? "",
        searchVolume: 0,
      }));
  }

  async healthCheck(): Promise<boolean> {
    if (!process.env.DATAFORSEO_LOGIN) return false;
    try {
      const res = await fetch(
        "https://api.dataforseo.com/v3/appendix/user_data",
        {
          headers: { Authorization: this.authHeader },
        },
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}
