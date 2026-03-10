// ============================================================
// POST /api/webhook/stripe — Handle Stripe webhook events
// Handles: checkout.session.completed, invoice.paid,
//          customer.subscription.updated/deleted
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

/** Helper: get period dates from a subscription's first item */
function getSubscriptionPeriod(sub: Stripe.Subscription) {
  const item = sub.items?.data?.[0];
  return {
    start: item ? new Date(item.current_period_start * 1000) : new Date(),
    end: item ? new Date(item.current_period_end * 1000) : new Date(),
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("[stripe webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as "pro" | "team" | "enterprise";

        if (userId && plan) {
          // Update user plan
          await db.update(users).set({ plan, stripeCustomerId: session.customer as string }).where(eq(users.id, userId));

          // Create subscription record
          if (session.subscription) {
            const sub = await stripe.subscriptions.retrieve(session.subscription as string);
            const period = getSubscriptionPeriod(sub);
            await db.insert(subscriptions).values({
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: sub.id,
              plan,
              status: "active",
              currentPeriodStart: period.start,
              currentPeriodEnd: period.end,
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const period = getSubscriptionPeriod(sub);
        await db
          .update(subscriptions)
          .set({
            status: sub.status === "active" ? "active" : sub.status === "past_due" ? "past_due" : "canceled",
            currentPeriodStart: period.start,
            currentPeriodEnd: period.end,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await db
          .update(subscriptions)
          .set({ status: "canceled", updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));

        // Downgrade user to free
        const subRecord = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.stripeSubscriptionId, sub.id),
        });
        if (subRecord) {
          await db.update(users).set({ plan: "free" }).where(eq(users.id, subRecord.userId));
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId =
          invoice.parent?.subscription_details?.subscription ??
          null;
        if (subId && typeof subId === "string") {
          await db
            .update(subscriptions)
            .set({ status: "past_due", updatedAt: new Date() })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe webhook] Error handling event:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
