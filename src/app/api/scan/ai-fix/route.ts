// ============================================================
// /api/scan/ai-fix — AI Fix Suggestions Add-on
// POST: Generate AI fix suggestions for scan issues
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { checkSufficientCredits, deductCredits } from "@/lib/credits/service";
import { runAiFixSuggestions } from "@/lib/integrations/ai-fix/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const {
      scanId,
      maxFixes = 10,
      context = {},
    } = body as {
      scanId: string;
      maxFixes?: number;
      context?: {
        url?: string;
        htmlSnippet?: string;
        headers?: Record<string, string>;
      };
    };

    if (!scanId) {
      return NextResponse.json(
        { error: "scanId is required" },
        { status: 400 },
      );
    }

    // Deduct 1 credit per batch of fixes
    const hasCredits = await checkSufficientCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits. Purchase AI Fix add-on." },
        { status: 402 },
      );
    }

    await deductCredits(
      user.id,
      1,
      `AI Fix Suggestions: scan ${scanId}`,
      "scan",
    );

    const result = await runAiFixSuggestions(
      scanId,
      user.id,
      maxFixes,
      context,
    );

    return NextResponse.json({
      result,
      creditsUsed: 1,
    });
  } catch (error) {
    console.error("[ai-fix] Error:", error);
    return NextResponse.json(
      { error: "AI fix suggestions failed" },
      { status: 500 },
    );
  }
}
