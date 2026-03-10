// ============================================================
// GET /api/scan/[id] — Get scan result by ID
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scans, scanIssues } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const scan = await db.query.scans.findFirst({
      where: eq(scans.id, id),
    });

    if (!scan) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 }
      );
    }

    const issues = await db.query.scanIssues.findMany({
      where: eq(scanIssues.scanId, id),
    });

    return NextResponse.json({
      ...scan,
      issues,
    });
  } catch (error) {
    console.error("[scan/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scan" },
      { status: 500 }
    );
  }
}
