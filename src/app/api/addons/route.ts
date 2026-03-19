// ============================================================
// ViberQC — Add-on Packages API
// GET  /api/addons — List all active packages (public)
// POST /api/addons — Purchase an add-on (auth required)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addonPackages, userAddons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import { addCredits } from "@/lib/credits/service";
import { PLAN_DISCOUNTS } from "@/data/addon-packages";

// --- GET: List all active add-on packages ---
export async function GET() {
  try {
    const packages = await db
      .select()
      .from(addonPackages)
      .where(eq(addonPackages.isActive, true))
      .orderBy(addonPackages.sortOrder);

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Failed to fetch addon packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 },
    );
  }
}

// --- POST: Purchase an add-on ---
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { addonId, billingCycle = "monthly" } = body;

    if (!addonId) {
      return NextResponse.json(
        { error: "addonId is required" },
        { status: 400 },
      );
    }

    // Check addon exists
    const addon = await db
      .select()
      .from(addonPackages)
      .where(eq(addonPackages.id, addonId))
      .limit(1);

    if (addon.length === 0) {
      return NextResponse.json(
        { error: "Add-on package not found" },
        { status: 404 },
      );
    }

    const pkg = addon[0];

    // Check if user already has this addon active
    const existing = await db
      .select()
      .from(userAddons)
      .where(eq(userAddons.userId, user.id));

    const alreadyActive = existing.find(
      (ua) => ua.addonId === addonId && ua.status === "active",
    );

    if (alreadyActive) {
      return NextResponse.json(
        { error: "You already have this add-on active" },
        { status: 409 },
      );
    }

    // Create user addon record
    // TODO: Integrate with Stripe for real payment
    const creditsToGive = pkg.creditsIncluded ?? 0;
    const now = new Date();
    const resetAt = new Date(now);
    resetAt.setMonth(resetAt.getMonth() + 1);

    const [newUserAddon] = await db
      .insert(userAddons)
      .values({
        userId: user.id,
        addonId,
        status: "active",
        billingCycle,
        creditsRemaining: creditsToGive,
        creditsResetAt: resetAt,
      })
      .returning();

    // Add initial credits
    if (creditsToGive > 0) {
      await addCredits(
        user.id,
        creditsToGive,
        `Initial credits: ${pkg.name}`,
        newUserAddon.id,
      );
    }

    return NextResponse.json(
      {
        userAddon: newUserAddon,
        message: `Successfully subscribed to ${pkg.name}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to purchase addon:", error);
    return NextResponse.json(
      { error: "Failed to purchase add-on" },
      { status: 500 },
    );
  }
}
