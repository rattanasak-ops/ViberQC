// ============================================================
// ViberQC — SEO Pro Scan Orchestrator
// ============================================================

import { CruxClient } from "./crux-client";
import { DataForSeoClient } from "./dataforseo-client";
import { MozClient } from "./moz-client";
import { MajesticClient } from "./majestic-client";
import { AhrefsClient } from "./ahrefs-client";
import { SemrushClient } from "./semrush-client";
import type {
  SeoDeepScanResult,
  DataForSeoOnPageResult,
  DataForSeoBacklinkResult,
  DataForSeoSerpResult,
  MozMetrics,
  MajesticMetrics,
  AhrefsMetrics,
  SemrushOverview,
  CruxMetrics,
} from "./types";

export type SeoApiName =
  | "crux"
  | "dataforseo"
  | "moz"
  | "majestic"
  | "ahrefs"
  | "semrush";

export async function runSeoDeepScan(
  url: string,
  userId: string,
  enabledApis: SeoApiName[] = [],
): Promise<SeoDeepScanResult> {
  const domain = new URL(url).hostname;
  const errors: { provider: string; message: string }[] = [];
  const providersUsed: string[] = [];

  // --- Free: CrUX (always) ---
  let crux: CruxMetrics | null = null;
  try {
    crux = await new CruxClient().getMetrics(url, userId);
    providersUsed.push("crux");
  } catch (e) {
    errors.push({ provider: "crux", message: String(e) });
  }

  // --- Paid APIs ---
  const paid: {
    dataForSeoOnPage: DataForSeoOnPageResult | null;
    dataForSeoBacklinks: DataForSeoBacklinkResult | null;
    dataForSeoSerp: DataForSeoSerpResult[] | null;
    moz: MozMetrics | null;
    majestic: MajesticMetrics | null;
    ahrefs: AhrefsMetrics | null;
    semrush: SemrushOverview | null;
  } = {
    dataForSeoOnPage: null,
    dataForSeoBacklinks: null,
    dataForSeoSerp: null,
    moz: null,
    majestic: null,
    ahrefs: null,
    semrush: null,
  };

  const tasks: Promise<void>[] = [];

  if (enabledApis.includes("dataforseo") && process.env.DATAFORSEO_LOGIN) {
    const client = new DataForSeoClient();
    tasks.push(
      client
        .analyzeOnPage(url, userId)
        .then((r) => {
          paid.dataForSeoOnPage = r;
        })
        .catch((e) => {
          errors.push({ provider: "dataforseo_onpage", message: String(e) });
        }),
    );
    tasks.push(
      client
        .getBacklinks(domain, userId)
        .then((r) => {
          paid.dataForSeoBacklinks = r;
          providersUsed.push("dataforseo");
        })
        .catch((e) => {
          errors.push({ provider: "dataforseo_backlinks", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("moz") && process.env.MOZ_ACCESS_ID) {
    tasks.push(
      new MozClient()
        .getUrlMetrics(url, userId)
        .then((r) => {
          paid.moz = r;
          providersUsed.push("moz");
        })
        .catch((e) => {
          errors.push({ provider: "moz", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("majestic") && process.env.MAJESTIC_API_KEY) {
    tasks.push(
      new MajesticClient()
        .getMetrics(url, userId)
        .then((r) => {
          paid.majestic = r;
          providersUsed.push("majestic");
        })
        .catch((e) => {
          errors.push({ provider: "majestic", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("ahrefs") && process.env.AHREFS_API_TOKEN) {
    tasks.push(
      new AhrefsClient()
        .getDomainRating(domain, userId)
        .then((r) => {
          paid.ahrefs = r;
          providersUsed.push("ahrefs");
        })
        .catch((e) => {
          errors.push({ provider: "ahrefs", message: String(e) });
        }),
    );
  }

  if (enabledApis.includes("semrush") && process.env.SEMRUSH_API_KEY) {
    tasks.push(
      new SemrushClient()
        .getDomainOverview(domain, userId)
        .then((r) => {
          paid.semrush = r;
          providersUsed.push("semrush");
        })
        .catch((e) => {
          errors.push({ provider: "semrush", message: String(e) });
        }),
    );
  }

  await Promise.allSettled(tasks);

  const hasDataForSeo = paid.dataForSeoOnPage || paid.dataForSeoBacklinks;

  return {
    crux,
    dataForSeo: hasDataForSeo
      ? {
          onPage: paid.dataForSeoOnPage,
          backlinks: paid.dataForSeoBacklinks,
          serp: paid.dataForSeoSerp,
        }
      : null,
    moz: paid.moz,
    majestic: paid.majestic,
    ahrefs: paid.ahrefs,
    semrush: paid.semrush,
    scannedAt: new Date().toISOString(),
    providersUsed,
    errors,
  };
}
