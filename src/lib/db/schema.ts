// ============================================================
// ViberQC — Database Schema (Drizzle ORM + PostgreSQL)
// ============================================================

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  pgEnum,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const authProviderEnum = pgEnum("auth_provider", [
  "email",
  "google",
  "github",
]);
export const planEnum = pgEnum("plan_type", [
  "free",
  "pro",
  "team",
  "enterprise",
]);
export const scanStatusEnum = pgEnum("scan_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);
export const reportFormatEnum = pgEnum("report_format", ["web", "pdf"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "trialing",
]);

// --- Users ---
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  hashedPassword: text("hashed_password"),
  role: userRoleEnum("role").notNull().default("user"),
  provider: authProviderEnum("provider").notNull().default("email"),
  locale: text("locale").notNull().default("en"),
  plan: planEnum("plan").notNull().default("free"),
  scansUsed: integer("scans_used").notNull().default(0),
  scansResetAt: timestamp("scans_reset_at", { withTimezone: true }),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- NextAuth Required Tables ---
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

// --- Projects ---
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  githubRepo: text("github_repo"),
  description: text("description"),
  lastScanId: uuid("last_scan_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// --- Scans ---
export const scans = pgTable("scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  status: scanStatusEnum("status").notNull().default("pending"),
  scoreOverall: integer("score_overall"),
  scores: jsonb("scores"), // ScanScores object
  phases: jsonb("phases"), // Phase results
  aiModelUsed: text("ai_model_used"),
  aiProvider: text("ai_provider"),
  costUsd: decimal("cost_usd", { precision: 10, scale: 6 }),
  durationMs: integer("duration_ms"),
  shareToken: text("share_token").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

// --- Scan Issues ---
export const scanIssues = pgTable("scan_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  scanId: uuid("scan_id")
    .notNull()
    .references(() => scans.id, { onDelete: "cascade" }),
  phase: text("phase").notNull(),
  severity: text("severity").notNull(), // critical | high | medium | low | info
  title: text("title").notNull(),
  description: text("description").notNull(),
  recommendation: text("recommendation"),
  filePath: text("file_path"),
  lineNumber: integer("line_number"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Reports ---
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  scanId: uuid("scan_id")
    .notNull()
    .references(() => scans.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  format: reportFormatEnum("format").notNull().default("web"),
  shareUrl: text("share_url"),
  shareToken: text("share_token").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

// --- Subscriptions ---
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  plan: planEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Badges ---
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  scanId: uuid("scan_id")
    .notNull()
    .references(() => scans.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("free"), // free | pro | team
  score: integer("score").notNull(),
  generatedSvg: text("generated_svg"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Waitlist (Sprint 0) ---
export const waitlist = pgTable("waitlist", {
  email: text("email").primaryKey(),
  source: text("source"), // twitter | reddit | direct | referral
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================
// Add-on System — Enums
// ============================================================

export const addonCategoryEnum = pgEnum("addon_category", [
  "security",
  "seo",
  "performance",
  "accessibility",
  "code_quality",
  "cross_browser",
  "uptime",
  "ai_fix",
  "report",
  "bundle",
]);

export const addonStatusEnum = pgEnum("addon_status", [
  "active",
  "canceled",
  "expired",
  "past_due",
  "trialing",
]);

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "earned",
  "spent",
  "refunded",
  "expired",
]);

// ============================================================
// Add-on System — Tables
// ============================================================

// --- Add-on Packages (แพ็คเกจที่ขาย) ---
export const addonPackages = pgTable("addon_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: addonCategoryEnum("category").notNull(),
  features: jsonb("features"),
  pricingMonthly: integer("pricing_monthly"), // cents/satang
  pricingYearly: integer("pricing_yearly"),
  pricingPerUse: integer("pricing_per_use"),
  creditsIncluded: integer("credits_included").default(0),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- User Add-ons (add-on ที่ user ซื้อแล้ว) ---
export const userAddons = pgTable("user_addons", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  addonId: uuid("addon_id")
    .notNull()
    .references(() => addonPackages.id),
  status: addonStatusEnum("status").notNull().default("active"),
  billingCycle: varchar("billing_cycle", { length: 20 }).default("monthly"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  creditsRemaining: integer("credits_remaining").notNull().default(0),
  creditsResetAt: timestamp("credits_reset_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Credit Transactions (log การใช้ credits) ---
export const creditTransactions = pgTable("credit_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userAddonId: uuid("user_addon_id").references(() => userAddons.id),
  transactionType: creditTransactionTypeEnum("transaction_type").notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  description: text("description"),
  referenceType: varchar("reference_type", { length: 50 }),
  referenceId: uuid("reference_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Add-on API Usage (tracking third-party API calls) ---
export const addonApiUsage = pgTable("addon_api_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  addonId: uuid("addon_id")
    .notNull()
    .references(() => addonPackages.id),
  apiProvider: varchar("api_provider", { length: 50 }).notNull(),
  endpoint: text("endpoint"),
  costCents: integer("cost_cents").default(0),
  responseStatus: integer("response_status"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
