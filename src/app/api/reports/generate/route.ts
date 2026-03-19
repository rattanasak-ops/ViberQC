// ============================================================
// POST /api/reports/generate — Generate PDF from scan data
// Public: Works without auth (for 3-Minute Magic Flow)
// Accepts raw scan data, returns PDF buffer
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromData } from "@/lib/report/pdf-generator";
import { callAI } from "@/lib/ai/client";
import type { ScanScores, ScanIssue } from "@/types";

interface GenerateRequest {
  url: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
  includeAiSummary?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { url, scores, issues, durationMs, scannedAt } = body;

    if (!url || !scores) {
      return NextResponse.json(
        { error: "url and scores are required" },
        { status: 400 },
      );
    }

    // Generate AI summary if requested and AI is available
    let aiSummary: string | undefined;
    if (body.includeAiSummary !== false) {
      try {
        const summaryPrompt = buildSummaryPrompt(url, scores, issues);
        const aiResult = await callAI(summaryPrompt, "fast");
        aiSummary = aiResult.content;
      } catch {
        // AI not available — continue without summary
        console.warn("[reports/generate] AI summary skipped — no provider");
      }
    }

    const pdfBuffer = await generatePdfFromData({
      url,
      scores,
      issues: issues ?? [],
      durationMs: durationMs ?? 0,
      scannedAt: scannedAt ?? new Date().toISOString(),
      aiSummary,
    });

    const uint8 = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="viberqc-report.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("[reports/generate] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}

function buildSummaryPrompt(
  url: string,
  scores: ScanScores,
  issues: ScanIssue[],
): string {
  const critical = issues.filter((i) => i.severity === "critical").length;
  const high = issues.filter((i) => i.severity === "high").length;

  return `You are a senior web QC analyst. Analyze these scan results and write a concise executive summary (3-5 sentences in English).

Website: ${url}
Overall Score: ${scores.overall}/100

Phase Scores:
- Security: ${scores.security}/100 (weight 20%)
- Performance: ${scores.performance}/100 (weight 15%)
- Accessibility: ${scores.accessibility}/100 (weight 15%)
- Code Quality: ${scores.codeQuality}/100 (weight 15%)
- SEO: ${scores.seo}/100 (weight 10%)
- Best Practices: ${scores.bestPractices}/100 (weight 10%)
- Viber Specific: ${scores.viber}/100 (weight 10%)
- PWA: ${scores.pwa}/100 (weight 5%)

Issues: ${issues.length} total (${critical} critical, ${high} high)

Top issues:
${issues
  .filter((i) => i.severity === "critical" || i.severity === "high")
  .slice(0, 5)
  .map((i) => `- [${i.severity}] ${i.title}: ${i.description}`)
  .join("\n")}

Write a professional summary highlighting strengths, weaknesses, and top 3 recommendations. Be direct and actionable.`;
}
