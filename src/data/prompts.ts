// ============================================================
// ViberQC — AI Prompt Templates for Cursor / VS Code / CLI
// Generates context-aware prompts per phase, tool, and item
// ============================================================

import type { ChecklistPhase } from "./checklist";

export interface PromptTemplate {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  category: PromptCategory;
  phases?: ChecklistPhase[];
  template: string;
  variables: string[];
  tags: string[];
}

export type PromptCategory =
  | "audit"
  | "fix"
  | "generate"
  | "review"
  | "optimize";

export const PROMPT_CATEGORIES = [
  { id: "audit" as const, name: "Audit & Analyze", nameTh: "ตรวจสอบและวิเคราะห์", icon: "Search", color: "#6C63FF" },
  { id: "fix" as const, name: "Fix & Repair", nameTh: "แก้ไขและซ่อมแซม", icon: "Wrench", color: "#22C55E" },
  { id: "generate" as const, name: "Generate Code", nameTh: "สร้างโค้ด", icon: "Code", color: "#FFB800" },
  { id: "review" as const, name: "Code Review", nameTh: "รีวิวโค้ด", icon: "Eye", color: "#F97316" },
  { id: "optimize" as const, name: "Optimize", nameTh: "เพิ่มประสิทธิภาพ", icon: "Zap", color: "#84CC16" },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // ============================================================
  // Mega Audit Prompts
  // ============================================================
  {
    id: "mega-audit",
    name: "360° Quality Audit",
    nameTh: "ตรวจสอบคุณภาพ 360°",
    description: "Complete quality audit across all 8 phases — the most comprehensive prompt",
    category: "audit",
    template: `You are a senior QA engineer performing a comprehensive 360° quality audit on a web application.

**Project:** {projectName}
**URL:** {projectUrl}
**Tech Stack:** {techStack}

Analyze the following areas and provide a detailed report:

## 1. Performance & Optimization
- Core Web Vitals (LCP, FID, CLS, TTFB)
- Bundle size analysis
- Image optimization
- Caching strategy

## 2. SEO & Standards
- Meta tags completeness
- Structured data (JSON-LD)
- Sitemap & robots.txt
- Open Graph & Twitter Cards

## 3. Security & Privacy
- HTTP security headers (CSP, HSTS, X-Frame-Options)
- Authentication & session management
- Input validation & sanitization
- PDPA/GDPR compliance

## 4. Accessibility (WCAG 2.1)
- Color contrast ratios
- Keyboard navigation
- ARIA labels & semantic HTML
- Screen reader compatibility

## 5. Code Quality
- TypeScript strict mode compliance
- No unused imports/variables
- Error handling patterns
- DRY principle adherence

## 6. Functional Testing
- All routes render correctly
- Forms validate and submit
- API endpoints return correct data
- Edge cases handled

## 7. Development Best Practices
- Git workflow & commit standards
- Environment configuration
- Dependency management
- Documentation completeness

## 8. Deploy & Monitoring
- CI/CD pipeline status
- Error tracking setup
- Health check endpoints
- Backup & rollback strategy

For each area:
1. Score it 0-100
2. List specific issues found
3. Provide exact code fixes
4. Estimate fix time

Output format: structured JSON with scores, issues, and recommendations.`,
    variables: ["projectName", "projectUrl", "techStack"],
    tags: ["comprehensive", "all-phases"],
  },

  // ============================================================
  // Per-Phase Audit Prompts
  // ============================================================
  {
    id: "audit-performance",
    name: "Performance Audit",
    nameTh: "ตรวจสอบประสิทธิภาพ",
    description: "Deep performance analysis with Core Web Vitals focus",
    category: "audit",
    phases: ["performance"],
    template: `Analyze the performance of this web application:

**URL:** {projectUrl}
**Framework:** {techStack}

Check these critical areas:
1. **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
2. **Bundle Size**: JS bundle < 200KB gzipped, total page < 1MB
3. **Image Optimization**: WebP/AVIF format, lazy loading, proper sizing
4. **Caching**: HTTP cache headers, service worker, ISR/SSG usage
5. **Font Loading**: font-display: swap, subset fonts, preload
6. **Third-party Scripts**: defer/async loading, impact analysis
7. **Server Response**: TTFB < 600ms, HTTP/2 or HTTP/3
8. **Code Splitting**: Dynamic imports, route-based splitting

For each issue found, provide:
- Severity (critical/high/medium/low)
- Current value vs target
- Exact code fix with file path
- Expected improvement`,
    variables: ["projectUrl", "techStack"],
    tags: ["performance", "web-vitals"],
  },
  {
    id: "audit-security",
    name: "Security Audit",
    nameTh: "ตรวจสอบความปลอดภัย",
    description: "OWASP Top 10 and security headers analysis",
    category: "audit",
    phases: ["security"],
    template: `Perform a security audit on this web application:

**URL:** {projectUrl}
**Framework:** {techStack}

Check these areas:
1. **HTTP Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
2. **Authentication**: Session management, JWT security, OAuth implementation
3. **Input Validation**: XSS prevention, SQL injection, CSRF protection
4. **Data Protection**: HTTPS enforcement, sensitive data exposure, PDPA/GDPR
5. **Dependencies**: Known vulnerabilities (npm audit), outdated packages
6. **Secrets Management**: No hardcoded API keys, .env configuration
7. **CORS**: Proper origin restrictions, no wildcards in production
8. **Rate Limiting**: Brute force protection on auth endpoints

For each vulnerability:
- OWASP category
- Risk level (critical/high/medium/low)
- Proof of concept
- Remediation code
- References`,
    variables: ["projectUrl", "techStack"],
    tags: ["security", "owasp"],
  },
  {
    id: "audit-accessibility",
    name: "Accessibility Audit (WCAG 2.1)",
    nameTh: "ตรวจสอบการเข้าถึง (WCAG 2.1)",
    description: "WCAG 2.1 AA compliance check",
    category: "audit",
    phases: ["accessibility"],
    template: `Perform a WCAG 2.1 AA accessibility audit:

**URL:** {projectUrl}
**Framework:** {techStack}

Check:
1. **Perceivable**: Alt text, color contrast ≥4.5:1, text resizing, media alternatives
2. **Operable**: Keyboard navigation, focus indicators, no time limits, skip links
3. **Understandable**: Language attribute, consistent navigation, error identification
4. **Robust**: Valid HTML, ARIA usage, screen reader testing

For each issue: WCAG criterion, severity, element selector, fix code.`,
    variables: ["projectUrl", "techStack"],
    tags: ["accessibility", "wcag"],
  },
  {
    id: "audit-seo",
    name: "SEO Audit",
    nameTh: "ตรวจสอบ SEO",
    description: "Complete SEO analysis with meta tags and structured data",
    category: "audit",
    phases: ["seo"],
    template: `Perform a comprehensive SEO audit:

**URL:** {projectUrl}
**Framework:** {techStack}

Check:
1. **Meta Tags**: title (unique, <60 chars), description (<160 chars), viewport
2. **Open Graph**: og:title, og:description, og:image, og:type
3. **Twitter Cards**: twitter:card, twitter:title, twitter:image
4. **Structured Data**: JSON-LD Schema.org markup, validation
5. **Technical SEO**: sitemap.xml, robots.txt, canonical URLs, hreflang
6. **Content**: H1 hierarchy, internal linking, broken links
7. **Mobile**: Mobile-friendly test, responsive design
8. **Performance**: Core Web Vitals impact on SEO

For each issue: priority, current state, recommended fix, expected SEO impact.`,
    variables: ["projectUrl", "techStack"],
    tags: ["seo", "meta-tags"],
  },

  // ============================================================
  // Fix Prompts
  // ============================================================
  {
    id: "fix-issue",
    name: "Fix Specific Issue",
    nameTh: "แก้ไขปัญหาเฉพาะจุด",
    description: "Generate exact fix for a specific issue found in scan",
    category: "fix",
    template: `Fix this specific issue in my web application:

**Issue:** {issueTitle}
**Severity:** {issueSeverity}
**Phase:** {issuePhase}
**Description:** {issueDescription}

**Project Tech Stack:** {techStack}
**File Path:** {filePath}

Requirements:
1. Provide the exact code fix (before → after)
2. Explain why this fix works
3. List any dependencies needed
4. Show how to verify the fix
5. Note any side effects to watch for

Format: Include file paths, line numbers, and copy-paste ready code.`,
    variables: ["issueTitle", "issueSeverity", "issuePhase", "issueDescription", "techStack", "filePath"],
    tags: ["fix", "specific"],
  },
  {
    id: "fix-all-phase",
    name: "Fix All Issues in Phase",
    nameTh: "แก้ไขทุกปัญหาใน Phase",
    description: "Generate fixes for all issues in a specific phase",
    category: "fix",
    template: `Fix ALL issues found in the {phaseName} phase of my web application:

**Project:** {projectName}
**Tech Stack:** {techStack}
**Issues Found:**
{issuesList}

For each issue:
1. Priority order (fix critical first)
2. Exact code fix with file path
3. Dependencies or config changes needed
4. Verification steps

After all fixes, provide a summary table:
| Issue | Severity | Fix Applied | Verified |
|-------|----------|------------|----------|`,
    variables: ["phaseName", "projectName", "techStack", "issuesList"],
    tags: ["fix", "batch"],
  },

  // ============================================================
  // Generate Prompts
  // ============================================================
  {
    id: "gen-cursorrules",
    name: "Generate .cursorrules",
    nameTh: "สร้างไฟล์ .cursorrules",
    description: "Generate optimized .cursorrules file for your project",
    category: "generate",
    template: `Generate an optimized .cursorrules file for this project:

**Project Name:** {projectName}
**Tech Stack:** {techStack}
**Project Type:** {projectType}
**Key Libraries:** {keyLibraries}

The .cursorrules should include:
1. Project context and architecture overview
2. Coding standards (naming, file structure, patterns)
3. Framework-specific rules (Next.js App Router, React Server Components)
4. Component patterns (shadcn/ui v4, no asChild, use buttonVariants)
5. Database patterns (Drizzle ORM)
6. TypeScript strict mode rules
7. Testing requirements
8. Security best practices
9. Performance guidelines
10. Thai language support (Sarabun font, i18n)

Make it comprehensive but focused — Cursor should understand the project deeply.`,
    variables: ["projectName", "techStack", "projectType", "keyLibraries"],
    tags: ["cursor", "ai-rules"],
  },
  {
    id: "gen-test-suite",
    name: "Generate Test Suite",
    nameTh: "สร้าง Test Suite",
    description: "Generate comprehensive test suite for a component or API",
    category: "generate",
    template: `Generate a comprehensive test suite:

**Target:** {targetFile}
**Type:** {testType} (unit/integration/e2e)
**Framework:** Vitest + Testing Library
**Tech Stack:** {techStack}

Include tests for:
1. Happy path scenarios
2. Edge cases (empty state, max limits, special chars)
3. Error handling
4. Loading states
5. Accessibility (role, aria-label)
6. User interactions (click, type, submit)

Generate the complete test file with imports, setup, and all test cases.`,
    variables: ["targetFile", "testType", "techStack"],
    tags: ["testing", "vitest"],
  },
  {
    id: "gen-api-endpoint",
    name: "Generate API Endpoint",
    nameTh: "สร้าง API Endpoint",
    description: "Generate a complete Next.js API route with validation",
    category: "generate",
    template: `Generate a Next.js App Router API route:

**Endpoint:** {endpoint}
**Method:** {method}
**Purpose:** {purpose}
**Tech Stack:** Next.js 16 + TypeScript + Drizzle ORM + PostgreSQL

Include:
1. Input validation (Zod schema)
2. Authentication check (NextAuth.js v5)
3. Database query (Drizzle ORM)
4. Error handling with proper status codes
5. TypeScript types for request/response
6. Rate limiting consideration
7. CORS headers if needed

Follow the existing pattern in the codebase.`,
    variables: ["endpoint", "method", "purpose"],
    tags: ["api", "nextjs"],
  },

  // ============================================================
  // Review Prompts
  // ============================================================
  {
    id: "review-pr",
    name: "Pull Request Review",
    nameTh: "รีวิว Pull Request",
    description: "Comprehensive PR review checklist",
    category: "review",
    template: `Review this Pull Request:

**PR Title:** {prTitle}
**Changed Files:** {changedFiles}
**Diff Summary:** {diffSummary}

Review criteria:
1. **Code Quality**: Clean code, DRY, SOLID principles
2. **Type Safety**: No 'any', proper generics, strict mode
3. **Security**: No XSS, SQL injection, secrets exposure
4. **Performance**: No N+1 queries, unnecessary re-renders
5. **Accessibility**: ARIA labels, keyboard nav, contrast
6. **Testing**: Test coverage, edge cases
7. **Error Handling**: Proper try/catch, user-facing errors
8. **Documentation**: JSDoc, README updates if needed

Output: structured review with approve/request-changes decision.`,
    variables: ["prTitle", "changedFiles", "diffSummary"],
    tags: ["review", "pr"],
  },
  {
    id: "review-component",
    name: "Component Review",
    nameTh: "รีวิว Component",
    description: "Deep review of a React component",
    category: "review",
    template: `Review this React component for quality:

**Component:** {componentName}
**File:** {filePath}
**Code:**
\`\`\`tsx
{componentCode}
\`\`\`

Check:
1. Props interface is complete and well-typed
2. No unnecessary re-renders (useMemo, useCallback)
3. Proper loading/error/empty states
4. Accessibility (ARIA, keyboard, focus)
5. Responsive design
6. Dark mode support
7. Error boundary handling
8. Performance (lazy loading, code splitting)

Provide specific improvements with before/after code.`,
    variables: ["componentName", "filePath", "componentCode"],
    tags: ["review", "react"],
  },

  // ============================================================
  // Optimize Prompts
  // ============================================================
  {
    id: "optimize-bundle",
    name: "Optimize Bundle Size",
    nameTh: "ลดขนาด Bundle",
    description: "Analyze and reduce JavaScript bundle size",
    category: "optimize",
    template: `Analyze and optimize the JavaScript bundle of this Next.js application:

**Project:** {projectName}
**Current Bundle Size:** {currentSize}
**Target:** < 200KB gzipped

Steps:
1. Identify largest dependencies
2. Find unused code (tree-shaking opportunities)
3. Suggest dynamic imports for heavy components
4. Recommend lighter alternatives for heavy libraries
5. Configure next.config for optimal splitting
6. Verify no duplicate packages

Provide exact config changes and import modifications.`,
    variables: ["projectName", "currentSize"],
    tags: ["optimize", "bundle"],
  },
  {
    id: "optimize-db",
    name: "Optimize Database Queries",
    nameTh: "ปรับปรุง Database Queries",
    description: "Analyze and optimize Drizzle ORM queries",
    category: "optimize",
    template: `Optimize the database queries in this application:

**ORM:** Drizzle ORM + PostgreSQL
**Schema File:** {schemaFile}
**Slow Queries:** {slowQueries}

Analyze:
1. Missing indexes
2. N+1 query problems
3. Over-fetching (SELECT *)
4. Connection pooling
5. Query caching opportunities
6. Transaction usage

Provide optimized Drizzle queries and index creation SQL.`,
    variables: ["schemaFile", "slowQueries"],
    tags: ["optimize", "database"],
  },
];

// Helper functions
export function getPromptsByCategory(category: PromptCategory): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter((p) => p.category === category);
}

export function getPromptsByPhase(phase: ChecklistPhase): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter((p) => p.phases?.includes(phase));
}

export function fillPromptTemplate(template: string, variables: Record<string, string>): string {
  let filled = template;
  for (const [key, value] of Object.entries(variables)) {
    filled = filled.replaceAll(`{${key}}`, value);
  }
  return filled;
}
