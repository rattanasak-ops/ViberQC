// ============================================================
// /api/reports — Reports CRUD
// GET: List user's reports
// POST: Create report from scan
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const userReports = await db.query.reports.findMany({
      where: eq(reports.userId, user.id),
      orderBy: desc(reports.createdAt),
    });

    return NextResponse.json(userReports);
  } catch (error) {
    console.error("[reports GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { scanId, format = "web" } = body;

    if (!scanId) {
      return NextResponse.json({ error: "scanId is required" }, { status: 400 });
    }

    const shareToken = nanoid(16);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:6161";

    const [report] = await db
      .insert(reports)
      .values({
        scanId,
        userId: user.id,
        format,
        shareToken,
        shareUrl: `${baseUrl}/share/${shareToken}`,
      })
      .returning();

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("[reports POST] Error:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
