// ============================================================
// ViberQC — Uptime Monitoring Types
// ============================================================

// --- Shared ---
export interface UptimeMonitor {
  id: string;
  name: string;
  url: string;
  status: "up" | "down" | "paused" | "unknown";
  uptimePercent: number;
  responseTimeMs: number;
  checkIntervalSeconds: number;
  lastCheckedAt: string | null;
  createdAt: string;
  provider: string;
}

// --- Setup Result ---
export interface UptimeSetupResult {
  monitor: UptimeMonitor;
  provider: string;
  success: boolean;
  message: string;
}

// --- Status Result ---
export interface UptimeStatusResult {
  monitors: UptimeMonitor[];
  provider: string;
  scannedAt: string;
  errors: { provider: string; message: string }[];
}
