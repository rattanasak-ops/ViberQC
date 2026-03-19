// ============================================================
// ViberQC — User Add-on Detail API
// GET    /api/addons/[id] — Get user addon detail
// PATCH  /api/addons/[id] — Update (cancel, change billing)
// DELETE /api/addons/[id] — Cancel addon
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userAddons, addonPackages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";

// --- GET: Get user addon details ---
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;

    const result = await db
      .select({
        userAddon: userAddons,
        addon: addonPackages,
      })
      .from(userAddons)
      .innerJoin(addonPackages, eq(userAddons.addonId, addonPackages.id))
      .where(and(eq(userAddons.id, id), eq(userAddons.userId, user.id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to fetch user addon:", error);
    return NextResponse.json(
      { error: "Failed to fetch add-on" },
      { status: 500 },
    );
  }
}

// --- PATCH: Update user addon (cancel, change billing) ---
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const { action, billingCycle } = body;

    // Verify ownership
    const existing = await db
      .select()
      .from(userAddons)
      .where(and(eq(userAddons.id, id), eq(userAddons.userId, user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
    }

    if (action === "cancel") {
      const [updated] = await db
        .update(userAddons)
        .set({
          status: "canceled",
          canceledAt: new Date(),
        })
        .where(eq(userAddons.id, id))
        .returning();

      // TODO: Cancel Stripe subscription
      return NextResponse.json({
        userAddon: updated,
        message: "Add-on canceled successfully",
      });
    }

    if (billingCycle) {
      const [updated] = await db
        .update(userAddons)
        .set({ billingCycle })
        .where(eq(userAddons.id, id))
        .returning();

      return NextResponse.json({ userAddon: updated });
    }

    return NextResponse.json(
      { error: "No valid action provided" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Failed to update user addon:", error);
    return NextResponse.json(
      { error: "Failed to update add-on" },
      { status: 500 },
    );
  }
}

// --- DELETE: Cancel and remove addon ---
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;

    const existing = await db
      .select()
      .from(userAddons)
      .where(and(eq(userAddons.id, id), eq(userAddons.userId, user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
    }

    await db
      .update(userAddons)
      .set({
        status: "canceled",
        canceledAt: new Date(),
      })
      .where(eq(userAddons.id, id));

    // TODO: Cancel Stripe subscription

    return NextResponse.json({ message: "Add-on canceled" });
  } catch (error) {
    console.error("Failed to delete user addon:", error);
    return NextResponse.json(
      { error: "Failed to cancel add-on" },
      { status: 500 },
    );
  }
}
