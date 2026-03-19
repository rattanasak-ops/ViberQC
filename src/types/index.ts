// ============================================================
// ViberQC — Core Type Definitions
// ============================================================

// --- User ---
export type UserRole = "admin" | "user";
export type AuthProvider = "email" | "google" | "github";
export type PlanType = "free" | "pro" | "team" | "enterprise";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  provider: AuthProvider;
  locale: "th" | "en";
  plan: PlanType;
  createdAt: Date;
  updatedAt: Date;
}

// --- Project ---
export interface Project {
  id: string;
  userId: string;
  name: string;
  url: string;
  githubRepo: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// --- Scan ---
export type ScanStatus = "pending" | "running" | "completed" | "failed";
export type ScanPhase =
  | "performance"
  | "seo"
  | "accessibility"
  | "security"
  | "code-quality"
  | "best-practices"
  | "pwa"
  | "viber";

export type IssueSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface ScanScores {
  overall: number;
  performance: number;
  seo: number;
  accessibility: number;
  security: number;
  codeQuality: number;
  bestPractices: number;
  pwa: number;
  viber: number;
}

export interface ScanIssue {
  id: string;
  phase: ScanPhase;
  severity: IssueSeverity;
  title: string;
  description: string;
  recommendation: string;
  filePath: string | null;
  lineNumber: number | null;
}

export interface Scan {
  id: string;
  projectId: string;
  userId: string | null;
  url: string;
  status: ScanStatus;
  scores: ScanScores | null;
  issues: ScanIssue[];
  aiModelUsed: string;
  durationMs: number | null;
  shareToken: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

// --- Report ---
export type ReportFormat = "web" | "pdf";

export interface Report {
  id: string;
  scanId: string;
  userId: string;
  format: ReportFormat;
  shareUrl: string;
  shareToken: string;
  createdAt: Date;
  expiresAt: Date | null;
}

// --- AI ---
export type AIProvider = "openrouter" | "openai" | "gemini" | "grok" | "claude";
export type AIModelTier = "fast" | "smart";

export interface AIResponse {
  content: string;
  provider: AIProvider;
  confidence: number;
  tokensUsed: number;
  costUSD: number;
}

// --- Add-on ---
export type AddonCategory =
  | "security"
  | "seo"
  | "performance"
  | "accessibility"
  | "code_quality"
  | "cross_browser"
  | "uptime"
  | "ai_fix"
  | "report"
  | "bundle";

export type AddonStatus =
  | "active"
  | "canceled"
  | "expired"
  | "past_due"
  | "trialing";

export type CreditTransactionType = "earned" | "spent" | "refunded" | "expired";

export interface AddonPackage {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: AddonCategory;
  features: Record<string, unknown> | null;
  pricingMonthly: number | null;
  pricingYearly: number | null;
  pricingPerUse: number | null;
  creditsIncluded: number | null;
  isActive: boolean;
  sortOrder: number;
}

export interface UserAddon {
  id: string;
  userId: string;
  addonId: string;
  status: AddonStatus;
  billingCycle: string | null;
  creditsRemaining: number;
  creditsResetAt: Date | null;
  startedAt: Date;
  expiresAt: Date | null;
  canceledAt: Date | null;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  userAddonId: string | null;
  transactionType: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  description: string | null;
  referenceType: string | null;
  referenceId: string | null;
  createdAt: Date;
}

// --- Badge ---
export type BadgeType = "free" | "pro" | "team";

export interface Badge {
  id: string;
  projectId: string;
  scanId: string;
  type: BadgeType;
  score: number;
  generatedSvg: string;
  createdAt: Date;
}

// --- Subscription ---
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing";

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
