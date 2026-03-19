// ============================================================
// /api/scan/performance-deep — Performance Deep Scan Add-on
// POST: Run performance deep scan with premium APIs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { checkSufficientCredits, deductCredits } from "@/lib/credits/service";
import {
  runPerformanceDeepScan,
  type PerformanceApiName,
} from "@/lib/integrations/performance/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { url, enabledApis = [] } = body as {
      url: string;
      enabledApis?: PerformanceApiName[];
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

    // Check credits for paid APIs
    const hasPaidApis = enabledApis.some((api) => !["pagespeed"].includes(api));

    if (hasPaidApis) {
      const hasCredits = await checkSufficientCredits(user.id, 1);
      if (!hasCredits) {
        return NextResponse.json(
          {
            error:
              "Insufficient credits. Purchase Performance Deep Scan add-on.",
          },
          { status: 402 },
        );
      }

      // Deduct 1 credit
      await deductCredits(user.id, 1, `Performance Deep Scan: ${url}`, "scan");
    }

    // Run scan
    const result = await runPerformanceDeepScan(url, user.id, enabledApis);

    return NextResponse.json({
      result,
      creditsUsed: hasPaidApis ? 1 : 0,
    });
  } catch (error) {
    console.error("[performance-deep] Error:", error);
    return NextResponse.json(
      { error: "Performance deep scan failed" },
      { status: 500 },
    );
  }
}
