// ============================================================
// POST /api/scan/ai-fix-public — Public AI Fix (no auth, limited)
// For 3-Minute Magic Flow — generates fixes from raw issues
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { generateFix } from "@/lib/integrations/ai-fix/ai-fix-client";
import type {
  AiFixInput,
  AiFixSuggestion,
} from "@/lib/integrations/ai-fix/types";
import type { ScanIssue } from "@/types";

const MAX_FREE_FIXES = 3; // Free users get top 3 fixes only

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issues, url } = body as {
      issues: ScanIssue[];
      url: string;
    };

    if (!issues || !Array.isArray(issues) || issues.length === 0) {
      return NextResponse.json(
        { error: "issues array is required" },
        { status: 400 },
      );
    }

    // Sort by severity and take top N
    const severityOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      info: 4,
    };

    const topIssues = [...issues]
      .sort(
        (a, b) =>
          (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4),
      )
      .slice(0, MAX_FREE_FIXES);

    const fixes: AiFixSuggestion[] = [];
    const errors: { issueId: string; message: string }[] = [];

    for (const issue of topIssues) {
      const input: AiFixInput = {
        issueId: issue.id,
        phase: issue.phase,
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        recommendation: issue.recommendation ?? null,
        context: { url },
      };

      try {
        const fix = await generateFix(input);
        fixes.push(fix);
      } catch (e) {
        errors.push({
          issueId: issue.id,
          message: e instanceof Error ? e.message : "AI fix failed",
        });
      }
    }

    return NextResponse.json({
      fixes,
      totalIssues: issues.length,
      fixedCount: fixes.length,
      remaining: Math.max(0, issues.length - MAX_FREE_FIXES),
      errors,
    });
  } catch (error) {
    console.error("[ai-fix-public] Error:", error);
    return NextResponse.json(
      { error: "AI fix generation failed" },
      { status: 500 },
    );
  }
}
