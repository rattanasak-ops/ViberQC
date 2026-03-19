// ============================================================
// ViberQC — Cross-Browser Scan Types
// ============================================================

// --- Shared ---
export interface BrowserConfig {
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  device?: string;
}

export interface Screenshot {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  imageUrl: string;
  thumbUrl: string;
  status: "done" | "failed" | "pending";
  createdAt: string;
}

// --- BrowserStack ---
export interface BrowserStackJob {
  jobId: string;
  state: "queued" | "processing" | "done";
  screenshots: Screenshot[];
  callbackUrl: string | null;
}

// --- LambdaTest ---
export interface LambdaTestJob {
  testId: string;
  status: "queued" | "processing" | "completed" | "failed";
  screenshots: Screenshot[];
}

// --- Unified Result ---
export interface CrossBrowserScanResult {
  screenshots: Screenshot[];
  responsiveScore: number;
  totalBrowsers: number;
  passedBrowsers: number;
  provider: string;
  scannedAt: string;
  providersUsed: string[];
  errors: { provider: string; message: string }[];
}
