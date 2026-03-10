// ============================================================
// ViberQC — Real Scan Engine (Rules-Based Analysis)
// Fetches URL, analyzes HTML/headers/performance
// No AI API keys required — pure programmatic analysis
// ============================================================

import type { ScanScores, ScanIssue, ScanPhase, IssueSeverity } from "@/types";
import { siteConfig } from "@/config/site";

interface PhaseResult {
  phase: ScanPhase;
  score: number;
  issues: ScanIssue[];
}

interface FetchedPage {
  url: string;
  html: string;
  headers: Record<string, string>;
  statusCode: number;
  responseTimeMs: number;
  contentLength: number;
  redirectCount: number;
  finalUrl: string;
  isHttps: boolean;
}

let issueCounter = 0;
function nextIssueId(): string {
  return `issue-${++issueCounter}`;
}

function createIssue(
  phase: ScanPhase,
  severity: IssueSeverity,
  title: string,
  description: string,
  recommendation: string
): ScanIssue {
  return {
    id: nextIssueId(),
    phase,
    severity,
    title,
    description,
    recommendation,
    filePath: null,
    lineNumber: null,
  };
}

// ============================================================
// Main Entry Point
// ============================================================
export async function runScan(url: string): Promise<{
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
}> {
  const startTime = Date.now();
  issueCounter = 0;

  // Fetch the page
  const page = await fetchPage(url);

  // Run all 8 phases in parallel
  const results = await Promise.all([
    analyzePerformance(page),
    analyzeSEO(page),
    analyzeAccessibility(page),
    analyzeSecurity(page),
    analyzeCodeQuality(page),
    analyzeBestPractices(page),
    analyzePWA(page),
    analyzeViber(page),
  ]);

  const allIssues = results.flatMap((r) => r.issues);
  const scores = calculateScores(results);

  return {
    scores,
    issues: allIssues,
    durationMs: Date.now() - startTime,
  };
}

// ============================================================
// URL Fetcher
// ============================================================
async function fetchPage(url: string): Promise<FetchedPage> {
  const startTime = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "ViberQC/1.0 (Quality Scanner; +https://viberqc.com)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const html = await response.text();
    const responseTimeMs = Date.now() - startTime;

    // Convert headers to plain object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    return {
      url,
      html,
      headers,
      statusCode: response.status,
      responseTimeMs,
      contentLength: html.length,
      redirectCount: response.redirected ? 1 : 0,
      finalUrl: response.url,
      isHttps: response.url.startsWith("https://"),
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// Phase 1: Performance Analysis
// ============================================================
function analyzePerformance(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // Response time
  if (page.responseTimeMs > 5000) {
    issues.push(
      createIssue(
        "performance",
        "critical",
        `Slow response time (${(page.responseTimeMs / 1000).toFixed(1)}s)`,
        `Server took ${(page.responseTimeMs / 1000).toFixed(1)} seconds to respond. Target is under 2 seconds.`,
        "Optimize server response time. Check hosting, database queries, and caching."
      )
    );
    deductions += 30;
  } else if (page.responseTimeMs > 2000) {
    issues.push(
      createIssue(
        "performance",
        "high",
        `Moderate response time (${(page.responseTimeMs / 1000).toFixed(1)}s)`,
        `Server response time of ${(page.responseTimeMs / 1000).toFixed(1)}s exceeds recommended 2s threshold.`,
        "Enable server-side caching and CDN to improve response time."
      )
    );
    deductions += 15;
  } else if (page.responseTimeMs > 1000) {
    issues.push(
      createIssue(
        "performance",
        "medium",
        `Response time could be faster (${page.responseTimeMs}ms)`,
        `Response time is ${page.responseTimeMs}ms. Optimal is under 1 second.`,
        "Consider implementing edge caching or CDN."
      )
    );
    deductions += 5;
  }

  // HTML size
  const htmlSizeKB = page.contentLength / 1024;
  if (htmlSizeKB > 500) {
    issues.push(
      createIssue(
        "performance",
        "high",
        `Large HTML document (${htmlSizeKB.toFixed(0)}KB)`,
        `HTML document is ${htmlSizeKB.toFixed(0)}KB. This affects First Contentful Paint.`,
        "Reduce HTML size by removing inline scripts/styles and using external files."
      )
    );
    deductions += 15;
  } else if (htmlSizeKB > 200) {
    issues.push(
      createIssue(
        "performance",
        "medium",
        `HTML document size (${htmlSizeKB.toFixed(0)}KB)`,
        `HTML is ${htmlSizeKB.toFixed(0)}KB. Consider optimizing for faster loading.`,
        "Minify HTML and consider lazy-loading content."
      )
    );
    deductions += 8;
  }

  // Compression
  const encoding = page.headers["content-encoding"] || "";
  if (!encoding.includes("gzip") && !encoding.includes("br") && !encoding.includes("deflate")) {
    issues.push(
      createIssue(
        "performance",
        "high",
        "No compression enabled",
        "Response is not compressed. Gzip/Brotli compression can reduce transfer size by 60-80%.",
        "Enable gzip or Brotli compression on your web server."
      )
    );
    deductions += 15;
  }

  // Inline scripts count
  const inlineScripts = (page.html.match(/<script(?![^>]*src)[^>]*>/gi) || []).length;
  if (inlineScripts > 5) {
    issues.push(
      createIssue(
        "performance",
        "medium",
        `${inlineScripts} inline scripts detected`,
        `Found ${inlineScripts} inline <script> tags. These block rendering and can't be cached separately.`,
        "Move inline scripts to external files for better caching and parallel loading."
      )
    );
    deductions += 8;
  }

  // External resources count
  const externalScripts = (page.html.match(/<script[^>]*src=/gi) || []).length;
  const externalStyles = (page.html.match(/<link[^>]*stylesheet/gi) || []).length;
  const totalExternal = externalScripts + externalStyles;

  if (totalExternal > 20) {
    issues.push(
      createIssue(
        "performance",
        "high",
        `${totalExternal} external resources (${externalScripts} scripts, ${externalStyles} styles)`,
        `High number of external resources increases page load time due to HTTP requests.`,
        "Bundle and minify resources. Use code splitting to load only what's needed."
      )
    );
    deductions += 12;
  } else if (totalExternal > 10) {
    issues.push(
      createIssue(
        "performance",
        "medium",
        `${totalExternal} external resources detected`,
        `Found ${externalScripts} scripts and ${externalStyles} stylesheets.`,
        "Consider bundling resources to reduce HTTP requests."
      )
    );
    deductions += 5;
  }

  // Images without lazy loading
  const images = page.html.match(/<img[^>]*>/gi) || [];
  const lazyImages = page.html.match(/<img[^>]*loading\s*=\s*["']lazy["'][^>]*>/gi) || [];
  const nonLazyImages = images.length - lazyImages.length;
  if (nonLazyImages > 5) {
    issues.push(
      createIssue(
        "performance",
        "medium",
        `${nonLazyImages} images without lazy loading`,
        `${nonLazyImages} images lack loading="lazy" attribute, causing unnecessary downloads.`,
        'Add loading="lazy" to below-the-fold images.'
      )
    );
    deductions += 5;
  }

  return {
    phase: "performance",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ============================================================
// Phase 2: SEO Analysis
// ============================================================
function analyzeSEO(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // Title tag
  const titleMatch = page.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch?.[1]?.trim();
  if (!title) {
    issues.push(
      createIssue("seo", "critical", "Missing <title> tag", "Page has no title tag. This is essential for search engine ranking.", "Add a unique, descriptive <title> tag (50-60 characters).")
    );
    deductions += 25;
  } else if (title.length < 10) {
    issues.push(
      createIssue("seo", "medium", `Title too short (${title.length} chars)`, `Title "${title}" is only ${title.length} characters. Recommended: 50-60 chars.`, "Write a more descriptive title that includes target keywords.")
    );
    deductions += 8;
  } else if (title.length > 70) {
    issues.push(
      createIssue("seo", "low", `Title too long (${title.length} chars)`, `Title is ${title.length} characters. Search engines typically display 50-60 chars.`, "Shorten your title to 50-60 characters for optimal display.")
    );
    deductions += 3;
  }

  // Meta description
  const descMatch = page.html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i)
    || page.html.match(/<meta[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["'][^>]*>/i);
  const description = descMatch?.[1]?.trim();
  if (!description) {
    issues.push(
      createIssue("seo", "high", "Missing meta description", "No meta description found. Search engines use this in result snippets.", 'Add <meta name="description" content="..."> with 150-160 characters.')
    );
    deductions += 15;
  } else if (description.length < 50) {
    issues.push(
      createIssue("seo", "medium", `Meta description too short (${description.length} chars)`, `Description is only ${description.length} chars. Recommended: 150-160.`, "Expand your meta description to better describe the page content.")
    );
    deductions += 5;
  }

  // H1 tag
  const h1s = page.html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  if (h1s.length === 0) {
    issues.push(
      createIssue("seo", "high", "Missing H1 heading", "No <h1> tag found. Every page should have exactly one H1.", "Add a single <h1> heading that describes the page's main topic.")
    );
    deductions += 15;
  } else if (h1s.length > 1) {
    issues.push(
      createIssue("seo", "medium", `Multiple H1 tags (${h1s.length})`, `Found ${h1s.length} H1 headings. Best practice is to have exactly one.`, "Keep only one <h1> per page and use <h2>-<h6> for subheadings.")
    );
    deductions += 5;
  }

  // Canonical URL
  const hasCanonical = /<link[^>]*rel\s*=\s*["']canonical["'][^>]*>/i.test(page.html);
  if (!hasCanonical) {
    issues.push(
      createIssue("seo", "medium", "Missing canonical URL", "No canonical link found. This can cause duplicate content issues.", 'Add <link rel="canonical" href="..."> to prevent duplicate content.')
    );
    deductions += 8;
  }

  // Open Graph tags
  const hasOgTitle = /<meta[^>]*property\s*=\s*["']og:title["'][^>]*>/i.test(page.html);
  const hasOgDesc = /<meta[^>]*property\s*=\s*["']og:description["'][^>]*>/i.test(page.html);
  const hasOgImage = /<meta[^>]*property\s*=\s*["']og:image["'][^>]*>/i.test(page.html);

  if (!hasOgTitle || !hasOgDesc || !hasOgImage) {
    const missing = [];
    if (!hasOgTitle) missing.push("og:title");
    if (!hasOgDesc) missing.push("og:description");
    if (!hasOgImage) missing.push("og:image");
    issues.push(
      createIssue("seo", "medium", `Missing Open Graph tags: ${missing.join(", ")}`, "Open Graph tags improve link previews on social media and messaging apps.", `Add ${missing.join(", ")} meta tags for better social sharing.`)
    );
    deductions += missing.length * 3;
  }

  // Meta robots
  const robotsNoindex = /<meta[^>]*content\s*=\s*["'][^"']*noindex[^"']*["'][^>]*name\s*=\s*["']robots["'][^>]*>/i.test(page.html)
    || /<meta[^>]*name\s*=\s*["']robots["'][^>]*content\s*=\s*["'][^"']*noindex[^"']*["'][^>]*>/i.test(page.html);
  if (robotsNoindex) {
    issues.push(
      createIssue("seo", "info", "Page is set to noindex", "This page has a noindex directive, meaning it won't appear in search results.", "Remove noindex if you want this page to be indexed by search engines.")
    );
  }

  // Image alt text
  const allImages = page.html.match(/<img[^>]*>/gi) || [];
  const imagesWithoutAlt = allImages.filter(
    (img) => !(/alt\s*=\s*["'][^"']+["']/i.test(img))
  );
  if (imagesWithoutAlt.length > 0) {
    issues.push(
      createIssue("seo", "medium", `${imagesWithoutAlt.length} images missing alt text`, `Found ${imagesWithoutAlt.length} images without descriptive alt attributes.`, "Add descriptive alt text to all images for better SEO and accessibility.")
    );
    deductions += Math.min(10, imagesWithoutAlt.length * 2);
  }

  return {
    phase: "seo",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ============================================================
// Phase 3: Accessibility Analysis
// ============================================================
function analyzeAccessibility(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // Lang attribute
  const hasLang = /<html[^>]*lang\s*=\s*["'][^"']+["'][^>]*>/i.test(page.html);
  if (!hasLang) {
    issues.push(
      createIssue("accessibility", "high", "Missing lang attribute", "The <html> element has no lang attribute. Screen readers need this to pronounce content correctly.", 'Add lang attribute to <html> tag, e.g., <html lang="en">.')
    );
    deductions += 15;
  }

  // Skip to main content
  const hasSkipLink = /skip[\s-]*to[\s-]*(main|content)/i.test(page.html);
  if (!hasSkipLink) {
    issues.push(
      createIssue("accessibility", "medium", "Missing skip navigation link", 'No "skip to main content" link found. Keyboard users need this to bypass repetitive navigation.', 'Add a visually hidden "Skip to main content" link at the top of the page.')
    );
    deductions += 8;
  }

  // Images without alt
  const allImages = page.html.match(/<img[^>]*>/gi) || [];
  const noAlt = allImages.filter((img) => !/alt\s*=/i.test(img));
  if (noAlt.length > 0) {
    issues.push(
      createIssue("accessibility", "high", `${noAlt.length} images missing alt attribute`, `Found ${noAlt.length} <img> elements without any alt attribute. Screen readers cannot describe these images.`, "Add alt attributes to all images. Use empty alt=\"\" for decorative images.")
    );
    deductions += Math.min(20, noAlt.length * 3);
  }

  // Form labels
  const inputs = page.html.match(/<input[^>]*>/gi) || [];
  const inputsNeedingLabels = inputs.filter(
    (inp) =>
      !/type\s*=\s*["'](hidden|submit|button|reset|image)["']/i.test(inp) &&
      !/aria-label\s*=/i.test(inp) &&
      !/aria-labelledby\s*=/i.test(inp)
  );
  // Check if they have associated labels (simplified check)
  const labelCount = (page.html.match(/<label[^>]*for\s*=/gi) || []).length;
  const unlabeled = Math.max(0, inputsNeedingLabels.length - labelCount);
  if (unlabeled > 0) {
    issues.push(
      createIssue("accessibility", "high", `${unlabeled} form inputs may lack labels`, `Found form inputs that may not have associated <label> elements or aria-label attributes.`, "Associate a <label> with every form input using the for/id relationship or aria-label.")
    );
    deductions += Math.min(15, unlabeled * 3);
  }

  // Heading hierarchy
  const headings = page.html.match(/<h([1-6])[^>]*>/gi) || [];
  if (headings.length > 0) {
    const levels = headings.map((h) => parseInt(h.match(/<h([1-6])/i)?.[1] || "0"));
    // Check for skipped levels
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        issues.push(
          createIssue("accessibility", "medium", "Skipped heading level", `Heading hierarchy jumps from H${levels[i - 1]} to H${levels[i]}. This confuses screen reader navigation.`, "Use sequential heading levels (H1 → H2 → H3) without skipping.")
        );
        deductions += 5;
        break;
      }
    }
  }

  // ARIA landmarks
  const hasMain = /<main[^>]*>/i.test(page.html) || /role\s*=\s*["']main["']/i.test(page.html);
  if (!hasMain) {
    issues.push(
      createIssue("accessibility", "medium", "Missing main landmark", "No <main> element or role=\"main\" found. Landmarks help screen reader users navigate.", "Wrap your primary content in a <main> element.")
    );
    deductions += 5;
  }

  // Color contrast (basic check - look for very light text colors)
  const hasNav = /<nav[^>]*>/i.test(page.html) || /role\s*=\s*["']navigation["']/i.test(page.html);
  if (!hasNav) {
    issues.push(
      createIssue("accessibility", "low", "Missing navigation landmark", "No <nav> element found. This helps users understand the page structure.", "Use <nav> elements for navigation sections.")
    );
    deductions += 3;
  }

  // Tab index misuse
  const tabIndexAbuse = (page.html.match(/tabindex\s*=\s*["']([2-9]|\d{2,})["']/gi) || []).length;
  if (tabIndexAbuse > 0) {
    issues.push(
      createIssue("accessibility", "medium", `${tabIndexAbuse} elements with tabindex > 1`, "Using tabindex values greater than 0 creates an unpredictable tab order.", "Use tabindex=\"0\" or tabindex=\"-1\" instead of positive values.")
    );
    deductions += 5;
  }

  return {
    phase: "accessibility",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ============================================================
// Phase 4: Security Analysis
// ============================================================
function analyzeSecurity(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // HTTPS
  if (!page.isHttps) {
    issues.push(
      createIssue("security", "critical", "Not using HTTPS", "Site is served over HTTP. All data is transmitted unencrypted.", "Enable HTTPS with a valid SSL/TLS certificate (Let's Encrypt is free).")
    );
    deductions += 25;
  }

  // Content-Security-Policy
  if (!page.headers["content-security-policy"]) {
    issues.push(
      createIssue("security", "critical", "Missing Content-Security-Policy header", "No CSP header detected. Your app is vulnerable to XSS and data injection attacks.", "Add a Content-Security-Policy header to restrict resource loading sources.")
    );
    deductions += 20;
  }

  // Strict-Transport-Security
  if (!page.headers["strict-transport-security"]) {
    issues.push(
      createIssue("security", "high", "Missing Strict-Transport-Security (HSTS)", "No HSTS header found. Users could be downgraded to HTTP.", 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains header.')
    );
    deductions += 12;
  }

  // X-Content-Type-Options
  if (!page.headers["x-content-type-options"]) {
    issues.push(
      createIssue("security", "high", "Missing X-Content-Type-Options header", "Without this header, browsers may MIME-sniff responses, enabling XSS attacks.", "Add X-Content-Type-Options: nosniff header.")
    );
    deductions += 10;
  }

  // X-Frame-Options
  if (!page.headers["x-frame-options"] && !page.headers["content-security-policy"]?.includes("frame-ancestors")) {
    issues.push(
      createIssue("security", "high", "Missing clickjacking protection", "No X-Frame-Options or CSP frame-ancestors directive found. Site could be embedded in malicious frames.", "Add X-Frame-Options: DENY or SAMEORIGIN header.")
    );
    deductions += 10;
  }

  // X-XSS-Protection (legacy but still good)
  if (!page.headers["x-xss-protection"]) {
    issues.push(
      createIssue("security", "low", "Missing X-XSS-Protection header", "While modern browsers have built-in XSS protection, this header adds a defense layer.", "Add X-XSS-Protection: 1; mode=block header.")
    );
    deductions += 3;
  }

  // Referrer-Policy
  if (!page.headers["referrer-policy"]) {
    issues.push(
      createIssue("security", "medium", "Missing Referrer-Policy header", "Without a Referrer-Policy, the full URL may be sent as referrer to external sites.", "Add Referrer-Policy: strict-origin-when-cross-origin header.")
    );
    deductions += 5;
  }

  // Permissions-Policy
  if (!page.headers["permissions-policy"] && !page.headers["feature-policy"]) {
    issues.push(
      createIssue("security", "medium", "Missing Permissions-Policy header", "No Permissions-Policy set. Browser features like camera/microphone aren't restricted.", "Add Permissions-Policy header to restrict unused browser features.")
    );
    deductions += 5;
  }

  // Server header exposure
  const server = page.headers["server"];
  if (server && (server.includes("/") || /\d/.test(server))) {
    issues.push(
      createIssue("security", "medium", `Server version exposed: ${server}`, "Server header reveals software and version, helping attackers target known vulnerabilities.", "Remove or genericize the Server header. Don't expose version numbers.")
    );
    deductions += 5;
  }

  // X-Powered-By
  if (page.headers["x-powered-by"]) {
    issues.push(
      createIssue("security", "medium", `X-Powered-By exposed: ${page.headers["x-powered-by"]}`, "Revealing technology stack helps attackers find known vulnerabilities.", "Remove the X-Powered-By header.")
    );
    deductions += 5;
  }

  // Mixed content check (basic)
  const mixedContent = page.isHttps && /src\s*=\s*["']http:\/\//gi.test(page.html);
  if (mixedContent) {
    issues.push(
      createIssue("security", "high", "Mixed content detected", "HTTPS page loads resources over HTTP, which can be intercepted or modified.", "Update all resource URLs to use HTTPS.")
    );
    deductions += 10;
  }

  return {
    phase: "security",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ============================================================
// Phase 5: Code Quality Analysis
// ============================================================
function analyzeCodeQuality(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // DOCTYPE
  const hasDoctype = /^<!doctype\s+html/im.test(page.html.trim());
  if (!hasDoctype) {
    issues.push(
      createIssue("code-quality", "high", "Missing DOCTYPE declaration", "No <!DOCTYPE html> found. Browser may render in quirks mode.", "Add <!DOCTYPE html> as the first line of your HTML.")
    );
    deductions += 15;
  }

  // Deprecated HTML tags
  const deprecatedTags = ["<font", "<center", "<marquee", "<blink", "<big", "<strike", "<tt"];
  const foundDeprecated: string[] = [];
  for (const tag of deprecatedTags) {
    if (page.html.toLowerCase().includes(tag)) {
      foundDeprecated.push(tag.replace("<", ""));
    }
  }
  if (foundDeprecated.length > 0) {
    issues.push(
      createIssue("code-quality", "medium", `Deprecated HTML tags: ${foundDeprecated.join(", ")}`, `Found ${foundDeprecated.length} deprecated HTML element(s). These are not supported in HTML5.`, "Replace deprecated tags with modern CSS equivalents.")
    );
    deductions += foundDeprecated.length * 3;
  }

  // Inline styles
  const inlineStyles = (page.html.match(/style\s*=\s*["'][^"']+["']/gi) || []).length;
  if (inlineStyles > 20) {
    issues.push(
      createIssue("code-quality", "medium", `${inlineStyles} inline styles detected`, "Heavy use of inline styles makes maintenance difficult and increases HTML size.", "Move styles to external CSS files or CSS classes.")
    );
    deductions += 10;
  } else if (inlineStyles > 10) {
    issues.push(
      createIssue("code-quality", "low", `${inlineStyles} inline styles detected`, "Consider moving frequently-used inline styles to CSS classes.", "Use CSS classes instead of inline styles for better maintainability.")
    );
    deductions += 5;
  }

  // Empty links
  const emptyLinks = (page.html.match(/<a[^>]*href\s*=\s*["']\s*#?\s*["'][^>]*>/gi) || []).length;
  if (emptyLinks > 0) {
    issues.push(
      createIssue("code-quality", "medium", `${emptyLinks} empty or hash-only links`, `Found ${emptyLinks} links with empty or "#" href values.`, "Ensure all links have valid destinations or use button elements for actions.")
    );
    deductions += Math.min(10, emptyLinks * 2);
  }

  // HTML validation basics
  const unclosedTags = checkBasicHtmlStructure(page.html);
  if (unclosedTags.length > 0) {
    issues.push(
      createIssue("code-quality", "medium", "HTML structure issues", `Possible structure issues detected: ${unclosedTags.join(", ")}.`, "Validate your HTML using the W3C Markup Validation Service.")
    );
    deductions += 8;
  }

  // Console.log in production
  const consoleLogCount = (page.html.match(/console\.(log|debug|info)\s*\(/gi) || []).length;
  if (consoleLogCount > 0) {
    issues.push(
      createIssue("code-quality", "low", `${consoleLogCount} console statements in HTML`, "Console statements found in inline scripts. These should be removed in production.", "Remove console.log statements or use a build tool to strip them.")
    );
    deductions += 3;
  }

  // Nested tables
  const nestedTables = /<table[^>]*>[\s\S]*<table[^>]*>/i.test(page.html);
  if (nestedTables) {
    issues.push(
      createIssue("code-quality", "medium", "Nested tables detected", "Nested HTML tables indicate layout-based design. This is an outdated practice.", "Use CSS Grid or Flexbox for layout instead of nested tables.")
    );
    deductions += 8;
  }

  return {
    phase: "code-quality",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

function checkBasicHtmlStructure(html: string): string[] {
  const issues: string[] = [];
  const hasHtml = /<html[^>]*>/i.test(html);
  const hasHead = /<head[^>]*>/i.test(html);
  const hasBody = /<body[^>]*>/i.test(html);
  if (!hasHtml) issues.push("missing <html>");
  if (!hasHead) issues.push("missing <head>");
  if (!hasBody) issues.push("missing <body>");
  return issues;
}

// ============================================================
// Phase 6: Best Practices Analysis
// ============================================================
function analyzeBestPractices(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // Viewport meta
  const hasViewport = /<meta[^>]*name\s*=\s*["']viewport["'][^>]*>/i.test(page.html);
  if (!hasViewport) {
    issues.push(
      createIssue("best-practices", "critical", "Missing viewport meta tag", "No viewport meta tag found. Page won't render properly on mobile devices.", 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.')
    );
    deductions += 20;
  }

  // Charset
  const hasCharset = /<meta[^>]*charset\s*=\s*["']?utf-?8["']?[^>]*>/i.test(page.html);
  if (!hasCharset) {
    issues.push(
      createIssue("best-practices", "high", "Missing charset declaration", "No UTF-8 charset meta tag found. Characters may display incorrectly.", 'Add <meta charset="utf-8"> as the first element in <head>.')
    );
    deductions += 10;
  }

  // Favicon
  const hasFavicon = /<link[^>]*rel\s*=\s*["'](icon|shortcut icon|apple-touch-icon)["'][^>]*>/i.test(page.html);
  if (!hasFavicon) {
    issues.push(
      createIssue("best-practices", "low", "Missing favicon", "No favicon link found. Browsers will request /favicon.ico by default.", 'Add <link rel="icon" href="/favicon.ico"> in your <head>.')
    );
    deductions += 5;
  }

  // HTTP status
  if (page.statusCode !== 200) {
    issues.push(
      createIssue("best-practices", "high", `Non-200 status code (${page.statusCode})`, `Server returned HTTP ${page.statusCode}. Expected 200 OK.`, "Investigate why the server returns a non-200 status code.")
    );
    deductions += 15;
  }

  // Print styles
  const hasPrintStyles = /<link[^>]*media\s*=\s*["']print["'][^>]*>/i.test(page.html) ||
    /@media\s+print/i.test(page.html);
  if (!hasPrintStyles) {
    issues.push(
      createIssue("best-practices", "info", "No print stylesheet", "No print-specific styles found. Page may not print well.", "Consider adding @media print styles for better printing.")
    );
  }

  // Structured data
  const hasStructuredData = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>/i.test(page.html);
  if (!hasStructuredData) {
    issues.push(
      createIssue("best-practices", "low", "No structured data (JSON-LD)", "No structured data found. This helps search engines understand your content.", "Add JSON-LD structured data for rich search results.")
    );
    deductions += 3;
  }

  // Target _blank without rel
  const unsafeTargetBlank = (page.html.match(/<a[^>]*target\s*=\s*["']_blank["'][^>]*>/gi) || [])
    .filter((a) => !/rel\s*=\s*["'][^"']*noopener/i.test(a));
  if (unsafeTargetBlank.length > 0) {
    issues.push(
      createIssue("best-practices", "medium", `${unsafeTargetBlank.length} target="_blank" without rel="noopener"`, "Links with target=\"_blank\" without rel=\"noopener\" are a security risk.", 'Add rel="noopener noreferrer" to all target="_blank" links.')
    );
    deductions += 5;
  }

  return {
    phase: "best-practices",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ============================================================
// Phase 7: PWA Analysis
// ============================================================
function analyzePWA(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // Web App Manifest
  const hasManifest = /<link[^>]*rel\s*=\s*["']manifest["'][^>]*>/i.test(page.html);
  if (!hasManifest) {
    issues.push(
      createIssue("pwa", "high", "Missing web app manifest", "No <link rel=\"manifest\"> found. Required for PWA install prompt.", 'Create a manifest.json and add <link rel="manifest" href="/manifest.json">.')
    );
    deductions += 25;
  }

  // Service worker reference
  const hasServiceWorker = /serviceWorker|service-worker|sw\.js/i.test(page.html);
  if (!hasServiceWorker) {
    issues.push(
      createIssue("pwa", "high", "No service worker detected", "No service worker registration found. Required for offline support and push notifications.", "Register a service worker with caching strategies for offline functionality.")
    );
    deductions += 25;
  }

  // Theme color
  const hasThemeColor = /<meta[^>]*name\s*=\s*["']theme-color["'][^>]*>/i.test(page.html);
  if (!hasThemeColor) {
    issues.push(
      createIssue("pwa", "medium", "Missing theme-color meta tag", "No theme-color defined. This controls the browser's UI color on mobile.", 'Add <meta name="theme-color" content="#your-color"> tag.')
    );
    deductions += 10;
  }

  // Apple touch icon
  const hasAppleIcon = /<link[^>]*rel\s*=\s*["']apple-touch-icon["'][^>]*>/i.test(page.html);
  if (!hasAppleIcon) {
    issues.push(
      createIssue("pwa", "medium", "Missing apple-touch-icon", "No Apple touch icon for iOS home screen shortcut.", 'Add <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">.')
    );
    deductions += 8;
  }

  // HTTPS (required for PWA)
  if (!page.isHttps) {
    issues.push(
      createIssue("pwa", "critical", "HTTPS required for PWA", "Service workers and PWA features only work over HTTPS.", "Enable HTTPS to use PWA features.")
    );
    deductions += 20;
  }

  return {
    phase: "pwa",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ============================================================
// Phase 8: Viber-Specific Analysis
// ============================================================
function analyzeViber(page: FetchedPage): PhaseResult {
  const issues: ScanIssue[] = [];
  let deductions = 0;

  // Open Graph tags (critical for Viber link previews)
  const hasOgTitle = /<meta[^>]*property\s*=\s*["']og:title["'][^>]*>/i.test(page.html);
  const hasOgDescription = /<meta[^>]*property\s*=\s*["']og:description["'][^>]*>/i.test(page.html);
  const hasOgImage = /<meta[^>]*property\s*=\s*["']og:image["'][^>]*>/i.test(page.html);
  const hasOgUrl = /<meta[^>]*property\s*=\s*["']og:url["'][^>]*>/i.test(page.html);
  const hasOgType = /<meta[^>]*property\s*=\s*["']og:type["'][^>]*>/i.test(page.html);

  if (!hasOgTitle) {
    issues.push(
      createIssue("viber", "critical", "Missing og:title for Viber preview", "Viber uses og:title for link preview headlines. Without it, links look broken.", 'Add <meta property="og:title" content="Your Title"> tag.')
    );
    deductions += 20;
  }

  if (!hasOgDescription) {
    issues.push(
      createIssue("viber", "high", "Missing og:description for Viber preview", "Viber shows og:description in link previews. Missing this reduces click-through.", 'Add <meta property="og:description" content="Description"> tag.')
    );
    deductions += 12;
  }

  if (!hasOgImage) {
    issues.push(
      createIssue("viber", "critical", "Missing og:image for Viber preview", "Viber link previews without images get significantly less engagement.", 'Add <meta property="og:image" content="https://..."> with image at least 1200x630px.')
    );
    deductions += 20;
  }

  if (!hasOgUrl) {
    issues.push(
      createIssue("viber", "medium", "Missing og:url", "Without og:url, Viber may use the wrong URL for the canonical link.", 'Add <meta property="og:url" content="https://..."> tag.')
    );
    deductions += 5;
  }

  if (!hasOgType) {
    issues.push(
      createIssue("viber", "low", "Missing og:type", "No og:type specified. Defaults to 'website' but should be explicit.", 'Add <meta property="og:type" content="website"> tag.')
    );
    deductions += 3;
  }

  // OG Image size check
  const ogImageMatch = page.html.match(/<meta[^>]*property\s*=\s*["']og:image["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i)
    || page.html.match(/<meta[^>]*content\s*=\s*["']([^"']*)["'][^>]*property\s*=\s*["']og:image["'][^>]*>/i);
  if (ogImageMatch) {
    const imgUrl = ogImageMatch[1];
    if (!imgUrl.startsWith("https://")) {
      issues.push(
        createIssue("viber", "medium", "OG image not using HTTPS", "og:image should use HTTPS URL for Viber to display it properly.", "Change og:image URL to use HTTPS.")
      );
      deductions += 5;
    }
  }

  // Viber deep link support
  const hasViberDeepLink = /viber:\/\//i.test(page.html);
  if (!hasViberDeepLink) {
    issues.push(
      createIssue("viber", "info", "No Viber deep links", "No Viber deep links (viber://) found. Consider adding for better Viber integration.", "Add Viber deep links for direct messaging or sharing features.")
    );
  }

  // Mobile responsiveness (viewport)
  const hasViewport = /<meta[^>]*name\s*=\s*["']viewport["'][^>]*>/i.test(page.html);
  if (!hasViewport) {
    issues.push(
      createIssue("viber", "high", "Not mobile-optimized for Viber", "Viber is a mobile app. Without viewport meta, your page won't render well in Viber's built-in browser.", 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.')
    );
    deductions += 15;
  }

  // Response time for mobile
  if (page.responseTimeMs > 3000) {
    issues.push(
      createIssue("viber", "high", "Slow loading for Viber users", `Page loads in ${(page.responseTimeMs / 1000).toFixed(1)}s. Viber users on mobile expect fast loading.`, "Optimize for mobile: reduce images, enable compression, use CDN.")
    );
    deductions += 10;
  }

  return {
    phase: "viber",
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ============================================================
// Score Calculator
// ============================================================
function calculateScores(results: PhaseResult[]): ScanScores {
  const phases = siteConfig.scanPhases;
  let overall = 0;
  const scoreMap: Record<string, number> = {};

  for (const result of results) {
    const phaseConfig = phases.find((p) => p.id === result.phase);
    const weight = phaseConfig?.weight ?? 0.1;
    scoreMap[result.phase] = result.score;
    overall += result.score * weight;
  }

  return {
    overall: Math.round(overall),
    performance: scoreMap["performance"] ?? 0,
    seo: scoreMap["seo"] ?? 0,
    accessibility: scoreMap["accessibility"] ?? 0,
    security: scoreMap["security"] ?? 0,
    codeQuality: scoreMap["code-quality"] ?? 0,
    bestPractices: scoreMap["best-practices"] ?? 0,
    pwa: scoreMap["pwa"] ?? 0,
    viber: scoreMap["viber"] ?? 0,
  };
}
