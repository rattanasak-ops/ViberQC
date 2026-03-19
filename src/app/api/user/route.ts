// ============================================================
// /api/user — Current user profile
// GET: Get profile
// PATCH: Update profile
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) return unauthorizedResponse();

    const user = await db.query.users.findFirst({
      where: eq(users.id, sessionUser.id),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't expose hashed password
    const { hashedPassword: _hp, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("[user GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) return unauthorizedResponse();

    const body = await request.json();
    const { fullName, locale } = body;

    const [updated] = await db
      .update(users)
      .set({
        ...(fullName !== undefined && { fullName }),
        ...(locale !== undefined && { locale }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, sessionUser.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { hashedPassword: _hp, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("[user PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
