// ============================================================
// POST /api/scan/run — Run a scan and return results immediately
// Public: No auth required (3-Minute Magic Flow)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scan/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Please include https://" },
        { status: 400 }
      );
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported" },
        { status: 400 }
      );
    }

    // Run the actual scan
    const result = await runScan(url);

    return NextResponse.json({
      url,
      status: "completed",
      scores: result.scores,
      issues: result.issues,
      durationMs: result.durationMs,
      scannedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[scan/run] Error:", error);

    // Handle fetch errors
    const message =
      error instanceof Error
        ? error.name === "AbortError"
          ? "Scan timed out. The URL took too long to respond."
          : error.message.includes("fetch")
            ? "Could not reach the URL. Please check that it's accessible."
            : `Scan failed: ${error.message}`
        : "Failed to run scan";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
