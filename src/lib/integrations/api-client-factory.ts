// ============================================================
// ViberQC — API Client Factory + Provider Registry
// ============================================================

import type { ApiClientConfig } from "./base-client";

// -----------------------------------------------------------
// All supported API providers
// -----------------------------------------------------------

export type ApiProvider =
  // Security
  | "snyk"
  | "detectify"
  | "stackhawk"
  | "intruder"
  | "qualys"
  | "tenable"
  | "mozilla_observatory"
  | "ssl_labs"
  // Performance
  | "pagespeed_insights"
  | "gtmetrix"
  | "webpagetest"
  | "speedcurve"
  | "debugbear"
  | "calibre"
  | "datadog"
  | "crux"
  // SEO
  | "dataforseo"
  | "ahrefs"
  | "semrush"
  | "moz"
  | "majestic"
  // Accessibility
  | "axe_core"
  | "wave"
  | "pa11y"
  | "axe_devtools"
  // Code Quality
  | "sonarcloud"
  | "codacy"
  | "codeclimate"
  // Cross-Browser
  | "browserstack"
  | "lambdatest"
  | "saucelabs"
  // Uptime
  | "uptimerobot"
  | "pingdom"
  | "statuscake"
  | "better_stack"
  | "checkly"
  // AI
  | "anthropic_claude"
  | "openai_gpt"
  | "google_gemini"
  // Report
  | "puppeteer"
  | "gotenberg"
  | "docraptor"
  | "quickchart"
  | "resend";

// -----------------------------------------------------------
// Provider Registry — config for each API
// -----------------------------------------------------------

export const API_REGISTRY: Record<ApiProvider, ApiClientConfig> = {
  // --- Security (Free) ---
  mozilla_observatory: {
    provider: "mozilla_observatory",
    baseUrl: "https://observatory-api.mdn.mozilla.net/api/v2",
    costPerCall: 0,
  },
  ssl_labs: {
    provider: "ssl_labs",
    baseUrl: "https://api.ssllabs.com/api/v4",
    timeout: 120_000, // SSL scan takes long
    costPerCall: 0,
  },

  // --- Security (Paid) ---
  snyk: {
    provider: "snyk",
    baseUrl: "https://api.snyk.io/rest",
    apiKey: process.env.SNYK_API_TOKEN,
    rateLimit: { maxRequests: 1620, windowMs: 60_000 },
    costPerCall: 5,
  },
  detectify: {
    provider: "detectify",
    baseUrl: "https://api.detectify.com/rest/v3",
    apiKey: process.env.DETECTIFY_API_KEY,
    costPerCall: 30,
  },
  stackhawk: {
    provider: "stackhawk",
    baseUrl: "https://api.stackhawk.com/api/v1",
    apiKey: process.env.STACKHAWK_API_KEY,
    costPerCall: 15,
  },
  intruder: {
    provider: "intruder",
    baseUrl: "https://api.intruder.io/v1",
    apiKey: process.env.INTRUDER_API_KEY,
    costPerCall: 50,
  },
  qualys: {
    provider: "qualys",
    baseUrl: "https://qualysapi.qualys.com/api/v2",
    apiKey: process.env.QUALYS_API_KEY,
    costPerCall: 100,
  },
  tenable: {
    provider: "tenable",
    baseUrl: "https://cloud.tenable.com",
    apiKey: process.env.TENABLE_API_KEY,
    costPerCall: 150,
  },

  // --- Performance (Free) ---
  pagespeed_insights: {
    provider: "pagespeed_insights",
    baseUrl: "https://www.googleapis.com/pagespeedonline/v5",
    rateLimit: { maxRequests: 240, windowMs: 60_000 },
    costPerCall: 0,
  },
  crux: {
    provider: "crux",
    baseUrl: "https://chromeuxreport.googleapis.com/v1/records:queryRecord",
    costPerCall: 0,
  },

  // --- Performance (Paid) ---
  gtmetrix: {
    provider: "gtmetrix",
    baseUrl: "https://gtmetrix.com/api/2.0",
    apiKey: process.env.GTMETRIX_API_KEY,
    rateLimit: { maxRequests: 60, windowMs: 60_000 },
    costPerCall: 4,
  },
  webpagetest: {
    provider: "webpagetest",
    baseUrl: "https://www.webpagetest.org",
    apiKey: process.env.WEBPAGETEST_API_KEY,
    timeout: 120_000,
    costPerCall: 2,
  },
  speedcurve: {
    provider: "speedcurve",
    baseUrl: "https://api.speedcurve.com/v1",
    apiKey: process.env.SPEEDCURVE_API_KEY,
    costPerCall: 8,
  },
  debugbear: {
    provider: "debugbear",
    baseUrl: "https://www.debugbear.com/api/v1",
    apiKey: process.env.DEBUGBEAR_API_KEY,
    costPerCall: 10,
  },
  calibre: {
    provider: "calibre",
    baseUrl: "https://calibreapp.com/api",
    apiKey: process.env.CALIBRE_API_KEY,
    costPerCall: 10,
  },
  datadog: {
    provider: "datadog",
    baseUrl: "https://api.datadoghq.com/api/v1",
    apiKey: process.env.DATADOG_API_KEY,
    costPerCall: 1,
  },

  // --- SEO ---
  dataforseo: {
    provider: "dataforseo",
    baseUrl: "https://api.dataforseo.com/v3",
    costPerCall: 1,
  },
  ahrefs: {
    provider: "ahrefs",
    baseUrl: "https://api.ahrefs.com/v3",
    apiKey: process.env.AHREFS_API_TOKEN,
    rateLimit: { maxRequests: 60, windowMs: 60_000 },
    costPerCall: 50,
  },
  semrush: {
    provider: "semrush",
    baseUrl: "https://api.semrush.com",
    apiKey: process.env.SEMRUSH_API_KEY,
    costPerCall: 30,
  },
  moz: {
    provider: "moz",
    baseUrl: "https://lsapi.seomoz.com/v2",
    costPerCall: 3,
  },
  majestic: {
    provider: "majestic",
    baseUrl: "https://api.majestic.com/api",
    apiKey: process.env.MAJESTIC_API_KEY,
    costPerCall: 10,
  },

  // --- Accessibility ---
  axe_core: {
    provider: "axe_core",
    baseUrl: "", // local npm — no API
    costPerCall: 0,
  },
  wave: {
    provider: "wave",
    baseUrl: "https://wave.webaim.org/api/request",
    apiKey: process.env.WAVE_API_KEY,
    costPerCall: 3,
  },
  pa11y: {
    provider: "pa11y",
    baseUrl: "", // local npm — no API
    costPerCall: 0,
  },
  axe_devtools: {
    provider: "axe_devtools",
    baseUrl: "https://axe.deque.com/api/v1",
    apiKey: process.env.AXE_DEVTOOLS_API_KEY,
    costPerCall: 20,
  },

  // --- Code Quality ---
  sonarcloud: {
    provider: "sonarcloud",
    baseUrl: "https://sonarcloud.io/api",
    apiKey: process.env.SONARCLOUD_TOKEN,
    costPerCall: 5,
  },
  codacy: {
    provider: "codacy",
    baseUrl: "https://app.codacy.com/api/v3",
    apiKey: process.env.CODACY_API_TOKEN,
    costPerCall: 8,
  },
  codeclimate: {
    provider: "codeclimate",
    baseUrl: "https://api.codeclimate.com/v1",
    apiKey: process.env.CODECLIMATE_API_KEY,
    costPerCall: 10,
  },

  // --- Cross-Browser ---
  browserstack: {
    provider: "browserstack",
    baseUrl: "https://www.browserstack.com/screenshots",
    costPerCall: 10,
  },
  lambdatest: {
    provider: "lambdatest",
    baseUrl: "https://api.lambdatest.com",
    costPerCall: 8,
  },
  saucelabs: {
    provider: "saucelabs",
    baseUrl: "https://api.us-west-1.saucelabs.com",
    costPerCall: 15,
  },

  // --- Uptime ---
  uptimerobot: {
    provider: "uptimerobot",
    baseUrl: "https://api.uptimerobot.com/v2",
    apiKey: process.env.UPTIMEROBOT_API_KEY,
    costPerCall: 0,
  },
  pingdom: {
    provider: "pingdom",
    baseUrl: "https://api.pingdom.com/api/3.1",
    apiKey: process.env.PINGDOM_API_TOKEN,
    costPerCall: 0,
  },
  statuscake: {
    provider: "statuscake",
    baseUrl: "https://api.statuscake.com/v1",
    apiKey: process.env.STATUSCAKE_API_KEY,
    costPerCall: 0,
  },
  better_stack: {
    provider: "better_stack",
    baseUrl: "https://uptime.betterstack.com/api/v2",
    apiKey: process.env.BETTER_STACK_API_TOKEN,
    costPerCall: 0,
  },
  checkly: {
    provider: "checkly",
    baseUrl: "https://api.checklyhq.com/v1",
    apiKey: process.env.CHECKLY_API_KEY,
    costPerCall: 0,
  },

  // --- AI ---
  anthropic_claude: {
    provider: "anthropic_claude",
    baseUrl: "https://api.anthropic.com/v1",
    apiKey: process.env.ANTHROPIC_API_KEY,
    costPerCall: 1,
  },
  openai_gpt: {
    provider: "openai_gpt",
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    costPerCall: 1,
  },
  google_gemini: {
    provider: "google_gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: process.env.GOOGLE_API_KEY,
    costPerCall: 0,
  },

  // --- Report ---
  puppeteer: {
    provider: "puppeteer",
    baseUrl: "", // local npm
    costPerCall: 0,
  },
  gotenberg: {
    provider: "gotenberg",
    baseUrl: process.env.GOTENBERG_URL ?? "http://localhost:3000",
    costPerCall: 0,
  },
  docraptor: {
    provider: "docraptor",
    baseUrl: "https://docraptor.com",
    apiKey: process.env.DOCRAPTOR_API_KEY,
    costPerCall: 15,
  },
  quickchart: {
    provider: "quickchart",
    baseUrl: "https://quickchart.io",
    costPerCall: 0,
  },
  resend: {
    provider: "resend",
    baseUrl: "https://api.resend.com",
    apiKey: process.env.RESEND_API_KEY,
    costPerCall: 0,
  },
};

// -----------------------------------------------------------
// Factory function — get config for a provider
// -----------------------------------------------------------

export function getApiConfig(provider: ApiProvider): ApiClientConfig {
  const config = API_REGISTRY[provider];
  if (!config) {
    throw new Error(`Unknown API provider: ${provider}`);
  }
  return config;
}

// -----------------------------------------------------------
// Helpers — check if provider is free
// -----------------------------------------------------------

export function isFreeTier(provider: ApiProvider): boolean {
  return (API_REGISTRY[provider]?.costPerCall ?? 0) === 0;
}

export function getProvidersByCategory(
  category: string,
): { provider: ApiProvider; config: ApiClientConfig }[] {
  const categoryMap: Record<string, ApiProvider[]> = {
    security: [
      "mozilla_observatory",
      "ssl_labs",
      "snyk",
      "detectify",
      "stackhawk",
      "intruder",
      "qualys",
      "tenable",
    ],
    seo: ["dataforseo", "ahrefs", "semrush", "moz", "majestic", "crux"],
    performance: [
      "pagespeed_insights",
      "gtmetrix",
      "webpagetest",
      "speedcurve",
      "debugbear",
      "calibre",
      "datadog",
      "crux",
    ],
    accessibility: ["axe_core", "wave", "pa11y", "axe_devtools"],
    code_quality: ["sonarcloud", "codacy", "codeclimate"],
    cross_browser: ["browserstack", "lambdatest", "saucelabs"],
    uptime: ["uptimerobot", "pingdom", "statuscake", "better_stack", "checkly"],
    ai_fix: ["anthropic_claude", "openai_gpt", "google_gemini"],
    report: ["puppeteer", "gotenberg", "docraptor", "quickchart", "resend"],
  };

  const providers = categoryMap[category] ?? [];
  return providers.map((p) => ({ provider: p, config: API_REGISTRY[p] }));
}
