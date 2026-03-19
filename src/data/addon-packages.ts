// ============================================================
// ViberQC — Add-on Packages Seed Data
// ============================================================

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

export interface AddonPackageSeed {
  slug: string;
  name: string;
  category: AddonCategory;
  description: string;
  pricingMonthly: number | null; // cents/satang
  pricingPerUse: number | null;
  creditsIncluded: number | null;
  sortOrder: number;
  features: {
    apis: string[];
    checks: string[];
    includes?: string[]; // for bundle
  };
}

export const ADDON_PACKAGES: AddonPackageSeed[] = [
  {
    slug: "security-deep-scan",
    name: "Security Deep Scan",
    category: "security",
    description:
      "สแกนช่องโหว่เชิงลึกด้วย Snyk, SSL Labs, Mozilla Observatory, StackHawk",
    pricingMonthly: 900,
    pricingPerUse: 50,
    creditsIncluded: 25,
    sortOrder: 1,
    features: {
      apis: ["snyk", "mozilla_observatory", "ssl_labs", "stackhawk"],
      checks: [
        "dependency_vulnerabilities",
        "http_headers_grade",
        "ssl_grade",
        "owasp_top_10",
      ],
    },
  },
  {
    slug: "seo-pro-scan",
    name: "SEO Pro Scan",
    category: "seo",
    description: "วิเคราะห์ SEO เชิงลึกด้วย DataForSEO, Moz, CrUX API",
    pricingMonthly: 1500,
    pricingPerUse: 100,
    creditsIncluded: 20,
    sortOrder: 2,
    features: {
      apis: ["dataforseo", "moz", "crux"],
      checks: [
        "domain_authority",
        "backlink_profile",
        "serp_position",
        "core_web_vitals_real",
      ],
    },
  },
  {
    slug: "performance-insight",
    name: "Performance Insight",
    category: "performance",
    description:
      "Deep performance analysis ด้วย GTmetrix, WebPageTest, PageSpeed Insights",
    pricingMonthly: 500,
    pricingPerUse: 30,
    creditsIncluded: 20,
    sortOrder: 3,
    features: {
      apis: ["gtmetrix", "webpagetest", "pagespeed_insights", "crux"],
      checks: [
        "waterfall_analysis",
        "filmstrip",
        "core_web_vitals",
        "resource_breakdown",
      ],
    },
  },
  {
    slug: "accessibility-audit",
    name: "Accessibility Audit",
    category: "accessibility",
    description: "ตรวจ WCAG 2.2 AA/AAA ด้วย axe-core, WAVE API, Pa11y",
    pricingMonthly: 700,
    pricingPerUse: 40,
    creditsIncluded: 20,
    sortOrder: 4,
    features: {
      apis: ["axe_core", "wave", "pa11y"],
      checks: [
        "wcag_aa_compliance",
        "wcag_aaa_compliance",
        "aria_validation",
        "color_contrast_detailed",
      ],
    },
  },
  {
    slug: "code-quality",
    name: "Code Quality",
    category: "code_quality",
    description:
      "วิเคราะห์คุณภาพ source code ด้วย SonarCloud, Codacy (ต้องเชื่อม GitHub repo)",
    pricingMonthly: 900,
    pricingPerUse: 50,
    creditsIncluded: 20,
    sortOrder: 5,
    features: {
      apis: ["sonarcloud", "codacy"],
      checks: [
        "bugs",
        "code_smells",
        "security_hotspots",
        "test_coverage",
        "duplication",
      ],
    },
  },
  {
    slug: "cross-browser",
    name: "Cross-Browser Testing",
    category: "cross_browser",
    description:
      "Screenshot บนทุก browser/device ด้วย BrowserStack, LambdaTest",
    pricingMonthly: 1500,
    pricingPerUse: 100,
    creditsIncluded: 15,
    sortOrder: 6,
    features: {
      apis: ["browserstack", "lambdatest"],
      checks: [
        "chrome",
        "firefox",
        "safari",
        "edge",
        "mobile_ios",
        "mobile_android",
      ],
    },
  },
  {
    slug: "uptime-monitoring",
    name: "Uptime Monitoring",
    category: "uptime",
    description:
      "ติดตาม uptime 24/7, SSL expiry, response time ด้วย UptimeRobot, Better Stack",
    pricingMonthly: 500,
    pricingPerUse: null,
    creditsIncluded: null,
    sortOrder: 7,
    features: {
      apis: ["uptimerobot", "better_stack"],
      checks: [
        "http_monitor",
        "ssl_expiry_alert",
        "response_time_tracking",
        "status_page",
      ],
    },
  },
  {
    slug: "ai-fix-suggestions",
    name: "AI Fix Suggestions",
    category: "ai_fix",
    description:
      "AI วิเคราะห์ปัญหาและ generate code fix พร้อมใช้ ด้วย Claude/GPT/Gemini",
    pricingMonthly: 1200,
    pricingPerUse: 75,
    creditsIncluded: 20,
    sortOrder: 8,
    features: {
      apis: ["anthropic_claude", "openai_gpt", "google_gemini"],
      checks: [
        "code_fix_generation",
        "config_suggestion",
        "best_practice_recommendation",
      ],
    },
  },
  {
    slug: "premium-report",
    name: "Premium Report",
    category: "report",
    description:
      "PDF report แบบ branded + white-label + email delivery + scheduled reports",
    pricingMonthly: 500,
    pricingPerUse: 30,
    creditsIncluded: 20,
    sortOrder: 9,
    features: {
      apis: ["puppeteer", "quickchart", "resend"],
      checks: ["branded_pdf", "white_label", "scheduled_email", "custom_logo"],
    },
  },
  {
    slug: "full-360-deep-scan",
    name: "Full 360° Deep Scan",
    category: "bundle",
    description:
      "รวมทุก add-on ในราคาพิเศษ — Security + SEO + Performance + Accessibility + AI Fix + Report",
    pricingMonthly: 2900,
    pricingPerUse: 200,
    creditsIncluded: 20,
    sortOrder: 10,
    features: {
      apis: ["all"],
      checks: ["all"],
      includes: [
        "security-deep-scan",
        "seo-pro-scan",
        "performance-insight",
        "accessibility-audit",
        "ai-fix-suggestions",
        "premium-report",
      ],
    },
  },
];

// ส่วนลดตาม plan ของ user
export const PLAN_DISCOUNTS: Record<string, number> = {
  free: 0,
  pro: 0.1,
  team: 0.2,
  enterprise: 0.3,
};
