// ============================================================
// GET /api/badge/[id] — Generate SVG badge for a scan
// Public: Embeddable badge showing score
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function getScoreColor(score: number): string {
  if (score >= 90) return "#22C55E";
  if (score >= 70) return "#84CC16";
  if (score >= 50) return "#FFB800";
  if (score >= 30) return "#F97316";
  return "#EF4444";
}

function generateBadgeSvg(score: number, label: string = "ViberQC"): string {
  const color = getScoreColor(score);
  const labelWidth = 60;
  const scoreWidth = 44;
  const totalWidth = labelWidth + scoreWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${score}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${scoreWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + scoreWidth / 2}" y="14">${score}</text>
  </g>
</svg>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const scan = await db.query.scans.findFirst({
      where: eq(scans.id, id),
    });

    if (!scan || !scan.scoreOverall) {
      const fallbackSvg = generateBadgeSvg(0, "ViberQC");
      return new NextResponse(fallbackSvg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache",
        },
      });
    }

    const svg = generateBadgeSvg(scan.scoreOverall);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[badge] Error:", error);
    return NextResponse.json({ error: "Failed to generate badge" }, { status: 500 });
  }
}
