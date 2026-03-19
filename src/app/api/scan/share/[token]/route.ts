// ============================================================
// GET /api/scan/share/[token] — Get shared scan result
// Public: No auth required
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getScanResult } from "@/lib/scan/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const result = getScanResult(token);

  if (!result) {
    return NextResponse.json(
      { error: "Scan result not found or expired" },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
