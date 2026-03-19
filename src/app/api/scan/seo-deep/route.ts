// ============================================================
// /api/scan/seo-deep — SEO Pro Scan Add-on
// POST: Run SEO deep scan with premium APIs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { checkSufficientCredits, deductCredits } from "@/lib/credits/service";
import {
  runSeoDeepScan,
  type SeoApiName,
} from "@/lib/integrations/seo/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { url, enabledApis = [] } = body as {
      url: string;
      enabledApis?: SeoApiName[];
    };

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Check credits for paid APIs
    const hasPaidApis = enabledApis.some((api) => api !== "crux");

    if (hasPaidApis) {
      const hasCredits = await checkSufficientCredits(user.id, 1);
      if (!hasCredits) {
        return NextResponse.json(
          { error: "Insufficient credits. Purchase SEO Pro Scan add-on." },
          { status: 402 },
        );
      }
      await deductCredits(user.id, 1, `SEO Pro Scan: ${url}`, "scan");
    }

    const result = await runSeoDeepScan(url, user.id, enabledApis);

    return NextResponse.json({
      result,
      creditsUsed: hasPaidApis ? 1 : 0,
    });
  } catch (error) {
    console.error("[seo-deep] Error:", error);
    return NextResponse.json(
      { error: "SEO deep scan failed" },
      { status: 500 },
    );
  }
}
