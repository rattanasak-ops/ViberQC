// ============================================================
// ViberQC — AI Fix Suggestions Orchestrator
// Fetches top issues from DB and generates fix suggestions
// ============================================================

import { db } from "@/lib/db";
import { scanIssues, scans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateFix } from "./ai-fix-client";
import type { AiFixInput, AiFixBatchResult, AiFixSuggestion } from "./types";

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

/**
 * Generate AI fix suggestions for the top issues of a scan.
 * @param scanId - The scan ID to fetch issues from
 * @param userId - The user making the request
 * @param maxFixes - Maximum number of fixes to generate (default 10)
 * @param context - Additional context (url, htmlSnippet, headers)
 */
export async function runAiFixSuggestions(
  scanId: string,
  userId: string,
  maxFixes = 10,
  context: {
    url?: string;
    htmlSnippet?: string;
    headers?: Record<string, string>;
  } = {},
): Promise<AiFixBatchResult> {
  const errors: { issueId: string; message: string }[] = [];
  const fixes: AiFixSuggestion[] = [];
  let totalTokensUsed = 0;
  let totalCostCents = 0;
  let usedProvider = "none";

  // Verify scan exists and belongs to user
  const [scan] = await db
    .select({ id: scans.id, url: scans.url, userId: scans.userId })
    .from(scans)
    .where(eq(scans.id, scanId))
    .limit(1);

  if (!scan) {
    return {
      fixes: [],
      totalTokensUsed: 0,
      totalCostCents: 0,
      provider: "none",
      scannedAt: new Date().toISOString(),
      errors: [{ issueId: "", message: "Scan not found" }],
    };
  }

  // Fetch issues, ordered by severity
  const issues = await db
    .select()
    .from(scanIssues)
    .where(eq(scanIssues.scanId, scanId))
    .orderBy(desc(scanIssues.createdAt));

  // Sort by severity and take top N
  const sortedIssues = issues
    .sort(
      (a, b) =>
        (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4),
    )
    .slice(0, maxFixes);

  if (sortedIssues.length === 0) {
    return {
      fixes: [],
      totalTokensUsed: 0,
      totalCostCents: 0,
      provider: "none",
      scannedAt: new Date().toISOString(),
      errors: [{ issueId: "", message: "No issues found for this scan" }],
    };
  }

  // Generate fixes sequentially to control cost
  for (const issue of sortedIssues) {
    const input: AiFixInput = {
      issueId: issue.id,
      phase: issue.phase,
      severity: issue.severity,
      title: issue.title,
      description: issue.description,
      recommendation: issue.recommendation,
      context: {
        url: context.url ?? scan.url,
        htmlSnippet: context.htmlSnippet,
        headers: context.headers,
      },
    };

    try {
      const fix = await generateFix(input);
      fixes.push(fix);
      totalTokensUsed += fix.tokensUsed;
      totalCostCents += fix.costCents;
      if (usedProvider === "none") usedProvider = fix.provider;
    } catch (e) {
      errors.push({ issueId: issue.id, message: String(e) });
    }
  }

  return {
    fixes,
    totalTokensUsed,
    totalCostCents,
    provider: usedProvider,
    scannedAt: new Date().toISOString(),
    errors,
  };
}
