// ============================================================
// /api/scan/security-deep — Security Deep Scan Add-on
// POST: Run security deep scan with premium APIs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { checkSufficientCredits, deductCredits } from "@/lib/credits/service";
import {
  runSecurityDeepScan,
  type SecurityApiName,
} from "@/lib/integrations/security/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { url, enabledApis = [] } = body as {
      url: string;
      enabledApis?: SecurityApiName[];
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
    const hasPaidApis = enabledApis.some(
      (api) => !["observatory", "ssl_labs"].includes(api),
    );

    if (hasPaidApis) {
      const hasCredits = await checkSufficientCredits(user.id, 1);
      if (!hasCredits) {
        return NextResponse.json(
          {
            error: "Insufficient credits. Purchase Security Deep Scan add-on.",
          },
          { status: 402 },
        );
      }

      // Deduct 1 credit
      await deductCredits(user.id, 1, `Security Deep Scan: ${url}`, "scan");
    }

    // Run scan
    const result = await runSecurityDeepScan(url, user.id, enabledApis);

    return NextResponse.json({
      result,
      creditsUsed: hasPaidApis ? 1 : 0,
    });
  } catch (error) {
    console.error("[security-deep] Error:", error);
    return NextResponse.json(
      { error: "Security deep scan failed" },
      { status: 500 },
    );
  }
}
