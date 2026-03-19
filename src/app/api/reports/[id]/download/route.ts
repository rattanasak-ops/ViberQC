// ============================================================
// /api/reports/[id]/download — Download PDF Report
// GET: Generate and return PDF (cached to filesystem)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { generatePdfReport } from "@/lib/report/pdf-generator";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const CACHE_DIR = join(process.cwd(), ".cache", "pdf-reports");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;

    // Verify ownership
    const report = await db
      .select()
      .from(reports)
      .where(and(eq(reports.id, id), eq(reports.userId, user.id)))
      .limit(1);

    if (report.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check cache first
    const cachePath = join(CACHE_DIR, `${id}.pdf`);
    let pdfBuffer: Buffer;

    if (existsSync(cachePath)) {
      pdfBuffer = readFileSync(cachePath);
    } else {
      // Generate and cache
      pdfBuffer = await generatePdfReport({
        scanId: report[0].scanId,
      });

      // Save to cache
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(cachePath, pdfBuffer);
    }

    const uint8 = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="viberqc-report-${id}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[reports download] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
