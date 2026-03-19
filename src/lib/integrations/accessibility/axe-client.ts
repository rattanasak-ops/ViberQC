// ============================================================
// ViberQC — axe-core Client (FREE, local)
// Lightweight stub — axe-core requires browser context
// In production, use @axe-core/puppeteer or similar
// ============================================================

import type { AxeResult, AxeViolation } from "./types";

export interface AxeAnalyzeOptions {
  standard?: "wcag2a" | "wcag2aa" | "wcag2aaa" | "wcag21a" | "wcag21aa";
  tags?: string[];
}

/**
 * axe-core client stub.
 * axe-core needs a real browser DOM to run. This client fetches
 * the HTML and performs basic structural checks as a lightweight
 * approximation. For full axe analysis, integrate with Puppeteer
 * or Playwright in a production environment.
 */
export class AxeCoreClient {
  async analyze(url: string, options?: AxeAnalyzeOptions): Promise<AxeResult> {
    const standard = options?.standard ?? "wcag2aa";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15_000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "ViberQC-Accessibility-Scanner/1.0",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`);
      }

      const html = await response.text();
      const violations = this.performBasicChecks(html, standard);

      return {
        violations,
        passes: 0, // Approximation — full axe needed for accurate count
        incomplete: 0,
        inapplicable: 0,
      };
    } catch (error) {
      console.error("[AxeCoreClient] analyze failed:", error);
      throw error;
    }
  }

  /**
   * Basic structural accessibility checks on raw HTML.
   * These approximate what axe-core does in a real browser.
   */
  private performBasicChecks(html: string, _standard: string): AxeViolation[] {
    const violations: AxeViolation[] = [];

    // Check: images without alt attribute
    const imgWithoutAlt = html.match(/<img(?![^>]*alt=)[^>]*>/gi);
    if (imgWithoutAlt && imgWithoutAlt.length > 0) {
      violations.push({
        id: "image-alt",
        impact: "critical",
        description: "Images must have alternate text",
        help: "Ensures <img> elements have alternate text or a role of none or presentation",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.9/image-alt",
        nodes: imgWithoutAlt.slice(0, 5).map((node) => ({
          html: node.substring(0, 200),
          target: ["img"],
          failureSummary: "Element does not have an alt attribute",
        })),
        tags: ["wcag2a", "wcag111", "cat.text-alternatives"],
      });
    }

    // Check: missing document language
    if (!/<html[^>]*lang=/i.test(html)) {
      violations.push({
        id: "html-has-lang",
        impact: "serious",
        description: "<html> element must have a lang attribute",
        help: "The <html> element must have a valid value for the lang attribute",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.9/html-has-lang",
        nodes: [
          {
            html: "<html>",
            target: ["html"],
            failureSummary: "The <html> element does not have a lang attribute",
          },
        ],
        tags: ["wcag2a", "wcag311", "cat.language"],
      });
    }

    // Check: missing document title
    if (!/<title[^>]*>[^<]+<\/title>/i.test(html)) {
      violations.push({
        id: "document-title",
        impact: "serious",
        description: "Documents must have a <title> element",
        help: "Each HTML document must contain a non-empty <title> element",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.9/document-title",
        nodes: [
          {
            html: "<head>",
            target: ["head"],
            failureSummary:
              "Document does not have a non-empty <title> element",
          },
        ],
        tags: ["wcag2a", "wcag242", "cat.text-alternatives"],
      });
    }

    // Check: empty links
    const emptyLinks = html.match(/<a[^>]*>\s*<\/a>/gi);
    if (emptyLinks && emptyLinks.length > 0) {
      violations.push({
        id: "link-name",
        impact: "serious",
        description: "Links must have discernible text",
        help: "Ensures links have discernible text",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.9/link-name",
        nodes: emptyLinks.slice(0, 5).map((node) => ({
          html: node.substring(0, 200),
          target: ["a"],
          failureSummary:
            "Element is in the tab order but does not have accessible text",
        })),
        tags: ["wcag2a", "wcag244", "wcag412", "cat.name-role-value"],
      });
    }

    // Check: empty buttons
    const emptyButtons = html.match(/<button[^>]*>\s*<\/button>/gi);
    if (emptyButtons && emptyButtons.length > 0) {
      violations.push({
        id: "button-name",
        impact: "critical",
        description: "Buttons must have discernible text",
        help: "Ensures buttons have discernible text",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.9/button-name",
        nodes: emptyButtons.slice(0, 5).map((node) => ({
          html: node.substring(0, 200),
          target: ["button"],
          failureSummary:
            "Element does not have inner text that is visible to screen readers",
        })),
        tags: ["wcag2a", "wcag412", "cat.name-role-value"],
      });
    }

    // Check: form inputs without labels
    const inputsWithoutLabel = html.match(
      /<input(?![^>]*(?:aria-label|aria-labelledby|id\s*=\s*["'][^"']+["']))[^>]*type=["'](?:text|email|password|tel|search|url|number)[^>]*>/gi,
    );
    if (inputsWithoutLabel && inputsWithoutLabel.length > 0) {
      violations.push({
        id: "label",
        impact: "critical",
        description: "Form elements must have labels",
        help: "Ensures every form element has a label",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.9/label",
        nodes: inputsWithoutLabel.slice(0, 5).map((node) => ({
          html: node.substring(0, 200),
          target: ["input"],
          failureSummary: "Form element does not have an associated label",
        })),
        tags: ["wcag2a", "wcag412", "wcag131", "cat.forms"],
      });
    }

    return violations;
  }
}
