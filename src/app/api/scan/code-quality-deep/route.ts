// ============================================================
// /api/scan/code-quality-deep — Code Quality Deep Scan Add-on
// POST: Run code quality deep scan with SonarCloud + Codacy
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { checkSufficientCredits, deductCredits } from "@/lib/credits/service";
import {
  runCodeQualityDeepScan,
  type CodeQualityApiName,
} from "@/lib/integrations/code-quality/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const {
      url,
      githubRepo,
      enabledApis = [],
    } = body as {
      url?: string;
      githubRepo?: string;
      enabledApis?: CodeQualityApiName[];
    };

    if (!url && !githubRepo) {
      return NextResponse.json(
        { error: "url or githubRepo is required" },
        { status: 400 },
      );
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }
    }

    // Check credits (all code quality APIs are paid)
    if (enabledApis.length > 0) {
      const hasCredits = await checkSufficientCredits(user.id, 1);
      if (!hasCredits) {
        return NextResponse.json(
          { error: "Insufficient credits. Purchase Code Quality add-on." },
          { status: 402 },
        );
      }

      await deductCredits(
        user.id,
        1,
        `Code Quality Deep Scan: ${githubRepo ?? url}`,
        "scan",
      );
    }

    const result = await runCodeQualityDeepScan(
      { githubRepo, url },
      user.id,
      enabledApis,
    );

    return NextResponse.json({
      result,
      creditsUsed: enabledApis.length > 0 ? 1 : 0,
    });
  } catch (error) {
    console.error("[code-quality-deep] Error:", error);
    return NextResponse.json(
      { error: "Code quality deep scan failed" },
      { status: 500 },
    );
  }
}
