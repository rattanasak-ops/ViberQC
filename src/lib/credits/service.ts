// ============================================================
// ViberQC — Credit Management Service
// ============================================================

import { db } from "@/lib/db";
import { creditTransactions, userAddons, addonPackages } from "@/lib/db/schema";
import { eq, and, sum, sql } from "drizzle-orm";

// -----------------------------------------------------------
// Get user's total credit balance
// -----------------------------------------------------------
export async function getUserCreditBalance(userId: string): Promise<number> {
  const result = await db
    .select({
      total: sum(creditTransactions.amount).mapWith(Number),
    })
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId));

  return result[0]?.total ?? 0;
}

// -----------------------------------------------------------
// Check if user has enough credits
// -----------------------------------------------------------
export async function checkSufficientCredits(
  userId: string,
  required: number,
): Promise<boolean> {
  const balance = await getUserCreditBalance(userId);
  return balance >= required;
}

// -----------------------------------------------------------
// Deduct credits for a scan/report/action
// -----------------------------------------------------------
export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  referenceType?: string,
  referenceId?: string,
): Promise<{ success: boolean; balanceAfter: number }> {
  const balance = await getUserCreditBalance(userId);

  if (balance < amount) {
    return { success: false, balanceAfter: balance };
  }

  const newBalance = balance - amount;

  await db.insert(creditTransactions).values({
    userId,
    transactionType: "spent",
    amount: -amount,
    balanceAfter: newBalance,
    description,
    referenceType: referenceType ?? null,
    referenceId: referenceId ?? null,
  });

  return { success: true, balanceAfter: newBalance };
}

// -----------------------------------------------------------
// Add credits (purchase, monthly reset, promotion)
// -----------------------------------------------------------
export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  userAddonId?: string,
): Promise<{ balanceAfter: number }> {
  const balance = await getUserCreditBalance(userId);
  const newBalance = balance + amount;

  await db.insert(creditTransactions).values({
    userId,
    userAddonId: userAddonId ?? null,
    transactionType: "earned",
    amount,
    balanceAfter: newBalance,
    description,
  });

  return { balanceAfter: newBalance };
}

// -----------------------------------------------------------
// Refund credits (e.g. scan failed)
// -----------------------------------------------------------
export async function refundCredits(
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
): Promise<{ balanceAfter: number }> {
  const balance = await getUserCreditBalance(userId);
  const newBalance = balance + amount;

  await db.insert(creditTransactions).values({
    userId,
    transactionType: "refunded",
    amount,
    balanceAfter: newBalance,
    description,
    referenceId: referenceId ?? null,
  });

  return { balanceAfter: newBalance };
}

// -----------------------------------------------------------
// Reset monthly credits for all active add-on subscribers
// Called by cron job on the 1st of each month
// -----------------------------------------------------------
export async function resetMonthlyCredits(): Promise<number> {
  const activeAddons = await db
    .select({
      id: userAddons.id,
      userId: userAddons.userId,
      creditsIncluded: addonPackages.creditsIncluded,
      addonName: addonPackages.name,
    })
    .from(userAddons)
    .innerJoin(addonPackages, eq(userAddons.addonId, addonPackages.id))
    .where(eq(userAddons.status, "active"));

  let resetCount = 0;

  for (const addon of activeAddons) {
    if (!addon.creditsIncluded || addon.creditsIncluded <= 0) continue;

    await addCredits(
      addon.userId,
      addon.creditsIncluded,
      `Monthly credit reset: ${addon.addonName}`,
      addon.id,
    );

    // Update credits_remaining on user_addon
    await db
      .update(userAddons)
      .set({
        creditsRemaining: addon.creditsIncluded,
        creditsResetAt: new Date(),
      })
      .where(eq(userAddons.id, addon.id));

    resetCount++;
  }

  return resetCount;
}

// -----------------------------------------------------------
// Get credit transaction history (paginated)
// -----------------------------------------------------------
export async function getCreditHistory(
  userId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{
  transactions: (typeof creditTransactions.$inferSelect)[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const offset = (page - 1) * limit;

  const [transactions, countResult] = await Promise.all([
    db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(sql`${creditTransactions.createdAt} DESC`)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId)),
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// -----------------------------------------------------------
// Get credits breakdown per addon
// -----------------------------------------------------------
export async function getCreditBreakdown(userId: string): Promise<
  {
    addonId: string;
    addonName: string;
    creditsRemaining: number;
    creditsIncluded: number | null;
    status: string;
  }[]
> {
  const addons = await db
    .select({
      addonId: userAddons.addonId,
      addonName: addonPackages.name,
      creditsRemaining: userAddons.creditsRemaining,
      creditsIncluded: addonPackages.creditsIncluded,
      status: userAddons.status,
    })
    .from(userAddons)
    .innerJoin(addonPackages, eq(userAddons.addonId, addonPackages.id))
    .where(and(eq(userAddons.userId, userId), eq(userAddons.status, "active")));

  return addons;
}
