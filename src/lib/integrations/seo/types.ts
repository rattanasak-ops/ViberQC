// ============================================================
// ViberQC — SEO Pro Scan Types
// ============================================================

// --- Google CrUX ---
export interface CruxMetrics {
  lcp: CruxMetricData | null;
  fid: CruxMetricData | null;
  cls: CruxMetricData | null;
  inp: CruxMetricData | null;
  ttfb: CruxMetricData | null;
}

export interface CruxMetricData {
  p75: number;
  good: number;
  needsImprovement: number;
  poor: number;
}

// --- DataForSEO ---
export interface DataForSeoOnPageResult {
  title: { length: number; content: string; isOptimal: boolean };
  metaDescription: { length: number; content: string; isOptimal: boolean };
  h1: string[];
  h2: string[];
  canonical: string | null;
  robots: string | null;
  schemaTypes: string[];
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  contentWordCount: number;
}

export interface DataForSeoBacklinkResult {
  totalBacklinks: number;
  referringDomains: number;
  domainRank: number;
  brokenBacklinks: number;
  doFollow: number;
  noFollow: number;
}

export interface DataForSeoSerpResult {
  keyword: string;
  position: number | null;
  url: string;
  title: string;
  searchVolume: number;
}

// --- Moz ---
export interface MozMetrics {
  domainAuthority: number;
  pageAuthority: number;
  spamScore: number;
  rootDomainsLinking: number;
  totalLinks: number;
}

// --- Majestic ---
export interface MajesticMetrics {
  trustFlow: number;
  citationFlow: number;
  referringDomains: number;
  externalBacklinks: number;
  referringIps: number;
  referringSubnets: number;
}

// --- Ahrefs ---
export interface AhrefsMetrics {
  domainRating: number;
  urlRating: number;
  backlinks: number;
  referringDomains: number;
  organicKeywords: number;
  organicTraffic: number;
}

// --- SEMrush ---
export interface SemrushOverview {
  domainScore: number;
  organicKeywords: number;
  organicTraffic: number;
  backlinks: number;
  referringDomains: number;
}

// --- Unified Result ---
export interface SeoDeepScanResult {
  crux: CruxMetrics | null;
  dataForSeo: {
    onPage: DataForSeoOnPageResult | null;
    backlinks: DataForSeoBacklinkResult | null;
    serp: DataForSeoSerpResult[] | null;
  } | null;
  moz: MozMetrics | null;
  majestic: MajesticMetrics | null;
  ahrefs: AhrefsMetrics | null;
  semrush: SemrushOverview | null;
  scannedAt: string;
  providersUsed: string[];
  errors: { provider: string; message: string }[];
}
