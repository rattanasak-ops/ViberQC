// ============================================================
// /api/scan/accessibility-deep — Accessibility Deep Scan Add-on
// POST: Run accessibility deep scan with premium APIs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { checkSufficientCredits, deductCredits } from "@/lib/credits/service";
import {
  runAccessibilityDeepScan,
  type AccessibilityApiName,
} from "@/lib/integrations/accessibility/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { url, enabledApis = ["axe"] } = body as {
      url: string;
      enabledApis?: AccessibilityApiName[];
    };

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Check credits for paid APIs (WAVE is the only paid one)
    const hasPaidApis = enabledApis.some(
      (api) => !["axe", "pa11y"].includes(api),
    );

    if (hasPaidApis) {
      const hasCredits = await checkSufficientCredits(user.id, 1);
      if (!hasCredits) {
        return NextResponse.json(
          {
            error:
              "Insufficient credits. Purchase Accessibility Deep Scan add-on.",
          },
          { status: 402 },
        );
      }

      // Deduct 1 credit
      await deductCredits(
        user.id,
        1,
        `Accessibility Deep Scan: ${url}`,
        "scan",
      );
    }

    // Run scan
    const result = await runAccessibilityDeepScan(url, user.id, enabledApis);

    return NextResponse.json({
      result,
      creditsUsed: hasPaidApis ? 1 : 0,
    });
  } catch (error) {
    console.error("[accessibility-deep] Error:", error);
    return NextResponse.json(
      { error: "Accessibility deep scan failed" },
      { status: 500 },
    );
  }
}
