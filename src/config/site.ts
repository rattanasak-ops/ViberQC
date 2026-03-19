// ============================================================
// ViberQC — Site Configuration
// ============================================================

export const siteConfig = {
  name: "ViberQC",
  description: "AI-powered 360° Quality Control for Viber Apps",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Scan limits per plan
  plans: {
    free: {
      scansPerMonth: 3,
      projects: 1,
      phases: ["performance", "seo", "accessibility"] as const,
      pdfReports: 0,
      apiCalls: 0,
    },
    pro: {
      scansPerMonth: 1000, // fair use
      projects: 5,
      phases: "all" as const,
      pdfReports: 5,
      apiCalls: 100,
    },
    team: {
      scansPerMonth: 1000,
      projects: 20,
      phases: "all" as const,
      pdfReports: -1, // unlimited
      apiCalls: 1000,
      teamMembers: 5,
    },
    enterprise: {
      scansPerMonth: -1, // unlimited
      projects: -1,
      phases: "all" as const,
      pdfReports: -1,
      apiCalls: -1,
      teamMembers: -1,
    },
  },

  // Pricing
  pricing: {
    pro: { usd: 12, thb: 199 },
    team: { usd: 39, thb: 699 },
    enterprise: { usd: 99, thb: null }, // custom
    annualDiscount: 0.33, // 4 months free
  },

  // Scan phases (8 total)
  scanPhases: [
    { id: "performance", name: "Performance", icon: "Zap", weight: 0.15 },
    { id: "seo", name: "SEO", icon: "Search", weight: 0.1 },
    { id: "accessibility", name: "Accessibility", icon: "Eye", weight: 0.15 },
    { id: "security", name: "Security", icon: "Shield", weight: 0.2 },
    { id: "code-quality", name: "Code Quality", icon: "Code", weight: 0.15 },
    {
      id: "best-practices",
      name: "Best Practices",
      icon: "CheckCircle",
      weight: 0.1,
    },
    { id: "pwa", name: "PWA", icon: "Smartphone", weight: 0.05 },
    { id: "viber", name: "Viber Specific", icon: "MessageCircle", weight: 0.1 },
  ] as const,

  // Social links
  links: {
    github: "https://github.com/viberqc",
    twitter: "https://twitter.com/viberqc",
  },
} as const;
