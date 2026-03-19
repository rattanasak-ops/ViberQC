// ============================================================
// /api/scan/cross-browser — Cross-Browser Screenshot Scan
// POST: Run cross-browser screenshot scan
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { checkSufficientCredits, deductCredits } from "@/lib/credits/service";
import {
  runCrossBrowserScan,
  type CrossBrowserApiName,
} from "@/lib/integrations/cross-browser/orchestrator";
import type { BrowserConfig } from "@/lib/integrations/cross-browser/types";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const {
      url,
      enabledApis = [],
      browsers,
    } = body as {
      url: string;
      enabledApis?: CrossBrowserApiName[];
      browsers?: BrowserConfig[];
    };

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Check credits (cross-browser APIs are paid)
    if (enabledApis.length > 0) {
      const hasCredits = await checkSufficientCredits(user.id, 1);
      if (!hasCredits) {
        return NextResponse.json(
          { error: "Insufficient credits. Purchase Cross-Browser add-on." },
          { status: 402 },
        );
      }

      await deductCredits(user.id, 1, `Cross-Browser Scan: ${url}`, "scan");
    }

    const result = await runCrossBrowserScan(
      url,
      user.id,
      enabledApis,
      browsers,
    );

    return NextResponse.json({
      result,
      creditsUsed: enabledApis.length > 0 ? 1 : 0,
    });
  } catch (error) {
    console.error("[cross-browser] Error:", error);
    return NextResponse.json(
      { error: "Cross-browser scan failed" },
      { status: 500 },
    );
  }
}
