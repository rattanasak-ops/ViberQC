// ============================================================
// POST /api/scan/start — Start a new scan
// Public: Free users can scan without auth (3 limit)
// Auth: Logged-in users use their plan limits
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scans } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-utils";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 2_000) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const body = await request.json();
    const { url, projectId } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    const user = await getSessionUser();

    // Create scan record
    const [scan] = await db
      .insert(scans)
      .values({
        url,
        projectId: projectId ?? null,
        userId: user?.id ?? null,
        status: "pending",
        shareToken: nanoid(12),
      })
      .returning();

    // TODO: Phase 4 — Trigger actual scan orchestrator via background job
    // For now, return the scan record immediately

    return NextResponse.json({
      id: scan.id,
      url: scan.url,
      status: scan.status,
      shareToken: scan.shareToken,
    });
  } catch (error) {
    console.error("[scan/start] Error:", error);
    return NextResponse.json(
      { error: "Failed to start scan" },
      { status: 500 },
    );
  }
}
