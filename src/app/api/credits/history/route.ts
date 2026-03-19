// ============================================================
// ViberQC — Credit History API
// GET /api/credits/history — Get paginated credit transactions
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { getCreditHistory } from "@/lib/credits/service";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100,
    );

    const result = await getCreditHistory(user.id, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch credit history:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit history" },
      { status: 500 },
    );
  }
}
