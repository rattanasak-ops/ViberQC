// ============================================================
// ViberQC — Performance Deep Scan Types
// ============================================================

// --- Google PageSpeed Insights ---
export interface PageSpeedResult {
  score: number; // 0-100
  metrics: PageSpeedMetrics;
  audits: PageSpeedAudit[];
  strategy: "mobile" | "desktop";
  fetchedAt: string;
}

export interface PageSpeedMetrics {
  firstContentfulPaint: number; // ms
  largestContentfulPaint: number; // ms
  totalBlockingTime: number; // ms
  cumulativeLayoutShift: number; // unitless
  speedIndex: number; // ms
  timeToInteractive: number; // ms
}

export interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number | null; // 0-1 or null
  displayValue: string;
  numericValue: number | null;
}

// --- GTmetrix ---
export interface GtmetrixResult {
  testId: string;
  grade: string; // "A", "B", "C", "D", "E", "F"
  performanceScore: number; // 0-100
  structureScore: number; // 0-100
  metrics: GtmetrixMetrics;
  pageDetails: GtmetrixPageDetails;
}

export interface GtmetrixMetrics {
  largestContentfulPaint: number; // ms
  totalBlockingTime: number; // ms
  cumulativeLayoutShift: number;
  firstContentfulPaint: number; // ms
  timeToInteractive: number; // ms
  speedIndex: number; // ms
}

export interface GtmetrixPageDetails {
  pageLoadTime: number; // ms
  totalPageSize: number; // bytes
  totalRequests: number;
  htmlSize: number; // bytes
  cssSize: number; // bytes
  jsSize: number; // bytes
  imageSize: number; // bytes
}

// --- WebPageTest ---
export interface WebPageTestResult {
  testId: string;
  summary: string;
  median: WebPageTestRun;
  location: string;
  connectivity: string;
}

export interface WebPageTestRun {
  firstView: WebPageTestView;
  repeatView: WebPageTestView | null;
}

export interface WebPageTestView {
  loadTime: number; // ms
  firstContentfulPaint: number; // ms
  largestContentfulPaint: number; // ms
  totalBlockingTime: number; // ms
  cumulativeLayoutShift: number;
  speedIndex: number; // ms
  timeToFirstByte: number; // ms
  fullyLoaded: number; // ms
  bytesIn: number; // bytes
  requests: number;
}

// --- Unified Result ---
export interface PerformanceDeepScanResult {
  pagespeed: PageSpeedResult | null;
  gtmetrix: GtmetrixResult | null;
  webpagetest: WebPageTestResult | null;
  overallScore: number;
  scannedAt: string;
  providersUsed: string[];
  errors: { provider: string; message: string }[];
}
