// ============================================================
// /api/reports — Reports CRUD
// GET: List user's reports (with scan data)
// POST: Create report (web or PDF)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports, scans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { nanoid } from "nanoid";
import { generatePdfReport } from "@/lib/report/pdf-generator";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const userReports = await db
      .select({
        id: reports.id,
        scanId: reports.scanId,
        format: reports.format,
        shareUrl: reports.shareUrl,
        shareToken: reports.shareToken,
        createdAt: reports.createdAt,
        expiresAt: reports.expiresAt,
        // Join scan data
        url: scans.url,
        scoreOverall: scans.scoreOverall,
        scores: scans.scores,
        completedAt: scans.completedAt,
      })
      .from(reports)
      .innerJoin(scans, eq(reports.scanId, scans.id))
      .where(eq(reports.userId, user.id))
      .orderBy(desc(reports.createdAt));

    return NextResponse.json({ reports: userReports });
  } catch (error) {
    console.error("[reports GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const {
      scanId,
      format = "web",
      emailTo,
      branding,
    } = body as {
      scanId: string;
      format?: "web" | "pdf";
      emailTo?: string;
      branding?: {
        logo?: string;
        companyName?: string;
        primaryColor?: string;
      };
    };

    if (!scanId) {
      return NextResponse.json(
        { error: "scanId is required" },
        { status: 400 },
      );
    }

    const shareToken = nanoid(16);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:6161";

    // Create report record
    const [report] = await db
      .insert(reports)
      .values({
        scanId,
        userId: user.id,
        format,
        shareToken,
        shareUrl: `${baseUrl}/r/${shareToken}`,
      })
      .returning();

    // PDF generation (async — don't block response)
    if (format === "pdf") {
      // Fire and forget — PDF generation runs in background
      generatePdfReport({ scanId, branding })
        .then(async (pdfBuffer) => {
          // Send email if requested
          if (emailTo) {
            const scan = await db
              .select()
              .from(scans)
              .where(eq(scans.id, scanId))
              .limit(1);

            if (scan.length > 0) {
              const { emailReport } = await import("@/lib/report/email");
              await emailReport(emailTo, pdfBuffer, {
                url: scan[0].url,
                score: scan[0].scoreOverall ?? 0,
                scannedAt: (
                  scan[0].completedAt ?? scan[0].createdAt
                ).toISOString(),
              });
            }
          }

          // TODO: Save PDF to storage (S3/R2) and update report record
        })
        .catch((err) => {
          console.error("[reports POST] PDF generation failed:", err);
        });
    }

    return NextResponse.json(
      {
        report,
        message:
          format === "pdf"
            ? "Report created. PDF is being generated..."
            : "Report created.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[reports POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 },
    );
  }
}
