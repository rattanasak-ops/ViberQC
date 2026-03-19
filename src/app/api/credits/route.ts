// ============================================================
// ViberQC — Credits API
// GET  /api/credits — Get user credit balance + breakdown
// ============================================================

import { NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import {
  getUserCreditBalance,
  getCreditBreakdown,
} from "@/lib/credits/service";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const [balance, breakdown] = await Promise.all([
      getUserCreditBalance(user.id),
      getCreditBreakdown(user.id),
    ]);

    return NextResponse.json({
      balance,
      breakdown,
    });
  } catch (error) {
    console.error("Failed to fetch credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 },
    );
  }
}
