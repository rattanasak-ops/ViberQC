// ============================================================
// ViberQC — In-Memory Scan Result Store
// Stores scan results for sharing without requiring a database
// Results expire after 24 hours
// ============================================================

import type { ScanScores, ScanIssue } from "@/types";

export interface StoredScanResult {
  token: string;
  url: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
  expiresAt: number;
}

// In-memory store (survives across requests in same process)
const scanStore = new Map<string, StoredScanResult>();

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function saveScanResult(data: {
  url: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
}): string {
  // Cleanup expired entries
  const now = Date.now();
  for (const [key, value] of scanStore) {
    if (value.expiresAt < now) {
      scanStore.delete(key);
    }
  }

  const token = generateToken();
  scanStore.set(token, {
    ...data,
    token,
    expiresAt: now + EXPIRY_MS,
  });

  return token;
}

export function getScanResult(token: string): StoredScanResult | null {
  const result = scanStore.get(token);
  if (!result) return null;
  if (result.expiresAt < Date.now()) {
    scanStore.delete(token);
    return null;
  }
  return result;
}
