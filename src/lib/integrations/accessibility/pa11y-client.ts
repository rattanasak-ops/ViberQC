// ============================================================
// ViberQC — Pa11y Client (FREE, local)
// Lightweight stub — pa11y requires headless browser
// In production, install pa11y and run directly
// ============================================================

import type { Pa11yResult, Pa11yIssue } from "./types";

export interface Pa11yAnalyzeOptions {
  standard?: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";
  timeout?: number;
  includeWarnings?: boolean;
}

/**
 * Pa11y client stub.
 * Pa11y is a Node CLI tool that requires a headless browser.
 * This client fetches HTML and performs basic HTML_CodeSniffer-style checks
 * as a lightweight approximation. For full Pa11y analysis, install pa11y
 * as a dependency and run it in a production environment.
 */
export class Pa11yClient {
  async analyze(
    url: string,
    options?: Pa11yAnalyzeOptions,
  ): Promise<Pa11yResult> {
    const standard = options?.standard ?? "WCAG2AA";
    const timeout = options?.timeout ?? 15_000;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "ViberQC-Pa11y-Scanner/1.0",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`);
      }

      const html = await response.text();
      const issues = this.performChecks(html, standard);

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const documentTitle = titleMatch ? titleMatch[1].trim() : "";

      return {
        documentTitle,
        pageUrl: url,
        issues,
      };
    } catch (error) {
      console.error("[Pa11yClient] analyze failed:", error);
      throw error;
    }
  }

  /**
   * Basic HTML_CodeSniffer-style checks.
   * Pa11y uses HTML_CodeSniffer under the hood.
   */
  private performChecks(html: string, standard: string): Pa11yIssue[] {
    const issues: Pa11yIssue[] = [];
    const isAA = standard === "WCAG2AA" || standard === "WCAG2AAA";

    // Check: missing viewport meta
    if (!/<meta[^>]*name=["']viewport["'][^>]*>/i.test(html)) {
      issues.push({
        code: "WCAG2AA.Principle1.Guideline1_4.1_4_10.C32,C31,C33,C38,SCR34,G206",
        type: "error",
        typeCode: 1,
        message:
          "A viewport meta tag should be present to ensure proper mobile rendering.",
        context: "<head>...</head>",
        selector: "html > head",
      });
    }

    // Check: missing skip navigation link
    const hasSkipLink =
      /<a[^>]*href=["']#(main|content|maincontent)[^"']*["'][^>]*>/i.test(html);
    if (!hasSkipLink && isAA) {
      issues.push({
        code: "WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1",
        type: "warning",
        typeCode: 2,
        message:
          "A skip navigation link should be provided to bypass repetitive content.",
        context: "<body>",
        selector: "html > body",
      });
    }

    // Check: heading hierarchy
    const headings = html.match(/<h([1-6])[^>]*>/gi) ?? [];
    let prevLevel = 0;
    for (const heading of headings) {
      const levelMatch = heading.match(/<h([1-6])/i);
      if (levelMatch) {
        const level = parseInt(levelMatch[1], 10);
        if (level - prevLevel > 1 && prevLevel > 0) {
          issues.push({
            code: "WCAG2AA.Principle1.Guideline1_3.1_3_1_A.G141",
            type: "warning",
            typeCode: 2,
            message: `Heading levels should not be skipped. Expected h${prevLevel + 1} but found h${level}.`,
            context: heading,
            selector: `h${level}`,
          });
        }
        prevLevel = level;
      }
    }

    // Check: missing landmark roles
    const hasMain =
      /<main[^>]*>/i.test(html) || /role=["']main["']/i.test(html);
    if (!hasMain) {
      issues.push({
        code: "WCAG2AA.Principle1.Guideline1_3.1_3_1.ARIA11",
        type: "warning",
        typeCode: 2,
        message:
          'The page should contain a main landmark (either <main> element or role="main").',
        context: "<body>",
        selector: "html > body",
      });
    }

    // Check: auto-playing media
    const autoplayMedia = html.match(/<(?:video|audio)[^>]*autoplay[^>]*>/gi);
    if (autoplayMedia && autoplayMedia.length > 0) {
      issues.push({
        code: "WCAG2AA.Principle1.Guideline1_4.1_4_2.F93",
        type: "error",
        typeCode: 1,
        message:
          "Audio or video elements should not autoplay without user consent.",
        context: autoplayMedia[0].substring(0, 200),
        selector: "video, audio",
      });
    }

    // Check: missing form labels (similar to axe but Pa11y-style codes)
    const inputsWithoutLabel = html.match(
      /<input(?![^>]*(?:aria-label|aria-labelledby|type=["'](?:hidden|submit|reset|button|image)["']))[^>]*>/gi,
    );
    if (inputsWithoutLabel && inputsWithoutLabel.length > 0) {
      for (const input of inputsWithoutLabel.slice(0, 3)) {
        issues.push({
          code: "WCAG2AA.Principle1.Guideline1_3.1_3_1.F68",
          type: "error",
          typeCode: 1,
          message:
            "This form field should be labelled in some way. Use the label element, aria-label, or aria-labelledby.",
          context: input.substring(0, 200),
          selector: "input",
        });
      }
    }

    return issues;
  }
}
