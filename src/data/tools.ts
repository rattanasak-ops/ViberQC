// ============================================================
// ViberQC — Tools Catalog (35+ tools, 8 categories)
// Integrations: Cursor, VS Code, GitHub, CLI, and more
// ============================================================

export interface Tool {
  id: string;
  name: string;
  description: string;
  descriptionTh: string;
  category: ToolCategory;
  installCommand?: string;
  websiteUrl: string;
  icon: string;
  tags: string[];
  free: boolean;
  vscodeExtension?: string;
  cursorCompatible: boolean;
}

export type ToolCategory =
  | "ide"
  | "testing"
  | "performance"
  | "security"
  | "accessibility"
  | "seo"
  | "monitoring"
  | "devops";

export interface ToolCategoryInfo {
  id: ToolCategory;
  name: string;
  nameTh: string;
  icon: string;
  color: string;
}

export const TOOL_CATEGORIES: ToolCategoryInfo[] = [
  {
    id: "ide",
    name: "IDE & Editor",
    nameTh: "IDE และ Editor",
    icon: "Monitor",
    color: "#6C63FF",
  },
  {
    id: "testing",
    name: "Testing",
    nameTh: "การทดสอบ",
    icon: "TestTube",
    color: "#22C55E",
  },
  {
    id: "performance",
    name: "Performance",
    nameTh: "ประสิทธิภาพ",
    icon: "Zap",
    color: "#FFB800",
  },
  {
    id: "security",
    name: "Security",
    nameTh: "ความปลอดภัย",
    icon: "Shield",
    color: "#EF4444",
  },
  {
    id: "accessibility",
    name: "Accessibility",
    nameTh: "การเข้าถึง",
    icon: "Eye",
    color: "#F97316",
  },
  {
    id: "seo",
    name: "SEO & Analytics",
    nameTh: "SEO และวิเคราะห์",
    icon: "Search",
    color: "#84CC16",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    nameTh: "การตรวจสอบ",
    icon: "Activity",
    color: "#06B6D4",
  },
  {
    id: "devops",
    name: "DevOps & CI/CD",
    nameTh: "DevOps และ CI/CD",
    icon: "GitBranch",
    color: "#8B5CF6",
  },
];

export const TOOLS: Tool[] = [
  // ============================================================
  // IDE & Editor
  // ============================================================
  {
    id: "cursor",
    name: "Cursor",
    description:
      "AI-first code editor built on VS Code. Use .cursorrules for project-specific AI instructions.",
    descriptionTh:
      "Code Editor ที่ AI มาก่อน สร้างจาก VS Code ใช้ .cursorrules สำหรับคำสั่ง AI เฉพาะโปรเจกต์",
    category: "ide",
    websiteUrl: "https://cursor.sh",
    icon: "cursor",
    tags: ["ai", "editor", "vscode-fork"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    description:
      "The most popular code editor with extensive extension marketplace.",
    descriptionTh:
      "Code Editor ยอดนิยมที่สุดพร้อม Extension Marketplace ขนาดใหญ่",
    category: "ide",
    websiteUrl: "https://code.visualstudio.com",
    icon: "vscode",
    tags: ["editor", "microsoft", "extensions"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "windsurf",
    name: "Windsurf (Codeium)",
    description: "AI-powered IDE by Codeium with coding agent capabilities.",
    descriptionTh: "AI IDE จาก Codeium พร้อมความสามารถ Coding Agent",
    category: "ide",
    websiteUrl: "https://codeium.com/windsurf",
    icon: "windsurf",
    tags: ["ai", "editor", "agent"],
    free: true,
    cursorCompatible: false,
  },
  {
    id: "zed",
    name: "Zed Editor",
    description:
      "High-performance code editor built in Rust with collaboration features.",
    descriptionTh:
      "Code Editor ประสิทธิภาพสูงสร้างด้วย Rust พร้อม collaboration",
    category: "ide",
    websiteUrl: "https://zed.dev",
    icon: "zed",
    tags: ["fast", "rust", "collaboration"],
    free: true,
    cursorCompatible: false,
  },

  // ============================================================
  // Testing
  // ============================================================
  {
    id: "vitest",
    name: "Vitest",
    description: "Blazing fast unit testing framework powered by Vite.",
    descriptionTh: "Unit Testing Framework เร็วสุดๆ ขับเคลื่อนด้วย Vite",
    category: "testing",
    installCommand: "npm install -D vitest",
    websiteUrl: "https://vitest.dev",
    icon: "vitest",
    tags: ["unit-test", "vite", "fast"],
    free: true,
    vscodeExtension: "vitest.explorer",
    cursorCompatible: true,
  },
  {
    id: "playwright",
    name: "Playwright",
    description:
      "End-to-end testing framework by Microsoft for all modern browsers.",
    descriptionTh:
      "E2E Testing Framework จาก Microsoft สำหรับทุก browser สมัยใหม่",
    category: "testing",
    installCommand: "npm init playwright@latest",
    websiteUrl: "https://playwright.dev",
    icon: "playwright",
    tags: ["e2e", "browser", "microsoft"],
    free: true,
    vscodeExtension: "ms-playwright.playwright",
    cursorCompatible: true,
  },
  {
    id: "cypress",
    name: "Cypress",
    description: "JavaScript E2E testing framework with time-travel debugging.",
    descriptionTh:
      "JavaScript E2E Testing Framework พร้อม Time-travel Debugging",
    category: "testing",
    installCommand: "npm install -D cypress",
    websiteUrl: "https://www.cypress.io",
    icon: "cypress",
    tags: ["e2e", "component", "debugging"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "testing-library",
    name: "Testing Library",
    description: "Simple and complete testing utilities for React components.",
    descriptionTh: "เครื่องมือทดสอบ React Components ที่เรียบง่ายและครบถ้วน",
    category: "testing",
    installCommand: "npm install -D @testing-library/react",
    websiteUrl: "https://testing-library.com",
    icon: "testing-library",
    tags: ["react", "unit-test", "dom"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "storybook",
    name: "Storybook",
    description:
      "UI component workshop for building and testing components in isolation.",
    descriptionTh: "Workshop สำหรับสร้างและทดสอบ UI Components แยกส่วน",
    category: "testing",
    installCommand: "npx storybook@latest init",
    websiteUrl: "https://storybook.js.org",
    icon: "storybook",
    tags: ["ui", "components", "docs"],
    free: true,
    cursorCompatible: true,
  },

  // ============================================================
  // Performance
  // ============================================================
  {
    id: "lighthouse",
    name: "Lighthouse",
    description:
      "Google's automated tool for improving the quality of web pages.",
    descriptionTh: "เครื่องมืออัตโนมัติของ Google สำหรับปรับปรุงคุณภาพเว็บ",
    category: "performance",
    installCommand: "npm install -g lighthouse",
    websiteUrl: "https://developer.chrome.com/docs/lighthouse",
    icon: "lighthouse",
    tags: ["google", "audit", "core-web-vitals"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "webpack-analyzer",
    name: "Webpack Bundle Analyzer",
    description:
      "Visualize the size of webpack output files with an interactive treemap.",
    descriptionTh: "แสดงผลขนาดไฟล์ webpack ด้วย interactive treemap",
    category: "performance",
    installCommand: "npm install -D @next/bundle-analyzer",
    websiteUrl: "https://www.npmjs.com/package/webpack-bundle-analyzer",
    icon: "webpack",
    tags: ["bundle", "size", "optimization"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "k6",
    name: "k6 (Grafana)",
    description: "Modern load testing tool for developers and testers.",
    descriptionTh: "เครื่องมือ Load Testing สมัยใหม่สำหรับ developers",
    category: "performance",
    installCommand: "brew install k6",
    websiteUrl: "https://k6.io",
    icon: "k6",
    tags: ["load-test", "stress-test", "grafana"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "web-vitals",
    name: "Web Vitals",
    description: "Library for measuring Core Web Vitals metrics in the field.",
    descriptionTh: "Library สำหรับวัด Core Web Vitals metrics จริง",
    category: "performance",
    installCommand: "npm install web-vitals",
    websiteUrl: "https://web.dev/vitals",
    icon: "web-vitals",
    tags: ["metrics", "cwv", "google"],
    free: true,
    cursorCompatible: true,
  },

  // ============================================================
  // Security
  // ============================================================
  {
    id: "npm-audit",
    name: "npm audit",
    description:
      "Built-in npm tool to check for known vulnerabilities in dependencies.",
    descriptionTh: "เครื่องมือ npm ในตัวสำหรับตรวจสอบช่องโหว่ใน dependencies",
    category: "security",
    installCommand: "npm audit",
    websiteUrl: "https://docs.npmjs.com/cli/v8/commands/npm-audit",
    icon: "npm",
    tags: ["vulnerabilities", "dependencies", "built-in"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "snyk",
    name: "Snyk",
    description: "Developer security platform to find and fix vulnerabilities.",
    descriptionTh: "แพลตฟอร์มความปลอดภัยสำหรับ developers หาและแก้ช่องโหว่",
    category: "security",
    installCommand: "npm install -g snyk",
    websiteUrl: "https://snyk.io",
    icon: "snyk",
    tags: ["vulnerabilities", "code-scanning", "containers"],
    free: true,
    vscodeExtension: "snyk-security.snyk-vulnerability-scanner",
    cursorCompatible: true,
  },
  {
    id: "gitleaks",
    name: "Gitleaks",
    description:
      "Detect hardcoded secrets like passwords, API keys in git repos.",
    descriptionTh:
      "ตรวจจับ secrets ที่ hardcode เช่น passwords, API keys ใน git repos",
    category: "security",
    installCommand: "brew install gitleaks",
    websiteUrl: "https://github.com/gitleaks/gitleaks",
    icon: "gitleaks",
    tags: ["secrets", "git", "scanning"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "owasp-zap",
    name: "OWASP ZAP",
    description: "World's most widely used web app security scanner.",
    descriptionTh: "Web App Security Scanner ที่ใช้กันแพร่หลายที่สุดในโลก",
    category: "security",
    websiteUrl: "https://www.zaproxy.org",
    icon: "owasp",
    tags: ["scanner", "owasp", "pentest"],
    free: true,
    cursorCompatible: false,
  },
  {
    id: "helmet",
    name: "Helmet.js",
    description:
      "Express middleware to set security-related HTTP response headers.",
    descriptionTh: "Express Middleware สำหรับตั้งค่า Security Headers",
    category: "security",
    installCommand: "npm install helmet",
    websiteUrl: "https://helmetjs.github.io",
    icon: "helmet",
    tags: ["headers", "express", "middleware"],
    free: true,
    cursorCompatible: true,
  },

  // ============================================================
  // Accessibility
  // ============================================================
  {
    id: "axe",
    name: "axe DevTools",
    description: "Accessibility testing engine by Deque Systems.",
    descriptionTh: "เครื่องมือทดสอบ Accessibility จาก Deque Systems",
    category: "accessibility",
    installCommand: "npm install -D @axe-core/react",
    websiteUrl: "https://www.deque.com/axe",
    icon: "axe",
    tags: ["wcag", "testing", "automation"],
    free: true,
    vscodeExtension: "deque-systems.vscode-axe-linter",
    cursorCompatible: true,
  },
  {
    id: "pa11y",
    name: "Pa11y",
    description: "Automated accessibility testing tool with CI integration.",
    descriptionTh:
      "เครื่องมือทดสอบ Accessibility อัตโนมัติพร้อม CI integration",
    category: "accessibility",
    installCommand: "npm install -g pa11y",
    websiteUrl: "https://pa11y.org",
    icon: "pa11y",
    tags: ["wcag", "ci", "automated"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "wave",
    name: "WAVE",
    description: "Web accessibility evaluation tool by WebAIM.",
    descriptionTh: "เครื่องมือประเมิน Web Accessibility จาก WebAIM",
    category: "accessibility",
    websiteUrl: "https://wave.webaim.org",
    icon: "wave",
    tags: ["wcag", "evaluation", "browser"],
    free: true,
    cursorCompatible: false,
  },

  // ============================================================
  // SEO & Analytics
  // ============================================================
  {
    id: "google-search-console",
    name: "Google Search Console",
    description:
      "Monitor and maintain your site's presence in Google Search results.",
    descriptionTh: "ตรวจสอบและดูแลการแสดงผลเว็บไซต์ใน Google Search",
    category: "seo",
    websiteUrl: "https://search.google.com/search-console",
    icon: "google",
    tags: ["google", "indexing", "search"],
    free: true,
    cursorCompatible: false,
  },
  {
    id: "schema-validator",
    name: "Schema Markup Validator",
    description: "Google's tool to validate structured data markup.",
    descriptionTh: "เครื่องมือ Google สำหรับตรวจสอบ Structured Data",
    category: "seo",
    websiteUrl: "https://validator.schema.org",
    icon: "schema",
    tags: ["structured-data", "json-ld", "google"],
    free: true,
    cursorCompatible: false,
  },
  {
    id: "next-seo",
    name: "Next SEO",
    description: "Plugin for managing SEO in Next.js applications.",
    descriptionTh: "Plugin สำหรับจัดการ SEO ใน Next.js",
    category: "seo",
    installCommand: "npm install next-seo",
    websiteUrl: "https://github.com/garmeeh/next-seo",
    icon: "next-seo",
    tags: ["nextjs", "meta-tags", "og"],
    free: true,
    cursorCompatible: true,
  },

  // ============================================================
  // Monitoring
  // ============================================================
  {
    id: "sentry",
    name: "Sentry",
    description:
      "Application monitoring platform for error tracking and performance.",
    descriptionTh:
      "แพลตฟอร์มตรวจสอบแอปพลิเคชันสำหรับ error tracking และ performance",
    category: "monitoring",
    installCommand: "npx @sentry/wizard@latest -i nextjs",
    websiteUrl: "https://sentry.io",
    icon: "sentry",
    tags: ["errors", "performance", "tracing"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "betterstack",
    name: "Better Stack",
    description: "Uptime monitoring, incident management, and log aggregation.",
    descriptionTh: "Uptime Monitoring, จัดการ Incidents และรวม Logs",
    category: "monitoring",
    websiteUrl: "https://betterstack.com",
    icon: "betterstack",
    tags: ["uptime", "logs", "incidents"],
    free: true,
    cursorCompatible: false,
  },
  {
    id: "vercel-analytics",
    name: "Vercel Analytics",
    description: "Real-time analytics and Web Vitals tracking for Next.js.",
    descriptionTh: "Analytics เรียลไทม์และติดตาม Web Vitals สำหรับ Next.js",
    category: "monitoring",
    installCommand: "npm install @vercel/analytics",
    websiteUrl: "https://vercel.com/analytics",
    icon: "vercel",
    tags: ["analytics", "web-vitals", "vercel"],
    free: true,
    cursorCompatible: true,
  },

  // ============================================================
  // DevOps & CI/CD
  // ============================================================
  {
    id: "github-actions",
    name: "GitHub Actions",
    description:
      "CI/CD platform integrated with GitHub for automated workflows.",
    descriptionTh: "CI/CD Platform รวมกับ GitHub สำหรับ automated workflows",
    category: "devops",
    websiteUrl: "https://github.com/features/actions",
    icon: "github",
    tags: ["ci", "cd", "automation"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "docker",
    name: "Docker",
    description:
      "Container platform for building, shipping, and running applications.",
    descriptionTh: "Container Platform สำหรับสร้าง ส่ง และรันแอปพลิเคชัน",
    category: "devops",
    websiteUrl: "https://www.docker.com",
    icon: "docker",
    tags: ["containers", "deployment", "devops"],
    free: true,
    vscodeExtension: "ms-azuretools.vscode-docker",
    cursorCompatible: true,
  },
  {
    id: "pm2",
    name: "PM2",
    description: "Advanced Node.js process manager for production deployment.",
    descriptionTh: "Process Manager ขั้นสูงสำหรับ Node.js ใน production",
    category: "devops",
    installCommand: "npm install -g pm2",
    websiteUrl: "https://pm2.keymetrics.io",
    icon: "pm2",
    tags: ["process", "cluster", "deploy"],
    free: true,
    cursorCompatible: true,
  },
  {
    id: "nginx",
    name: "Nginx",
    description: "High-performance web server and reverse proxy.",
    descriptionTh: "Web Server และ Reverse Proxy ประสิทธิภาพสูง",
    category: "devops",
    websiteUrl: "https://nginx.org",
    icon: "nginx",
    tags: ["server", "proxy", "load-balancer"],
    free: true,
    cursorCompatible: false,
  },
  {
    id: "eslint",
    name: "ESLint",
    description: "Pluggable JavaScript/TypeScript linter for code quality.",
    descriptionTh: "JavaScript/TypeScript Linter สำหรับคุณภาพโค้ด",
    category: "devops",
    installCommand: "npm install -D eslint",
    websiteUrl: "https://eslint.org",
    icon: "eslint",
    tags: ["linting", "code-quality", "rules"],
    free: true,
    vscodeExtension: "dbaeumer.vscode-eslint",
    cursorCompatible: true,
  },
  {
    id: "prettier",
    name: "Prettier",
    description: "Opinionated code formatter supporting many languages.",
    descriptionTh: "Code Formatter ที่ออกความเห็นรองรับหลายภาษา",
    category: "devops",
    installCommand: "npm install -D prettier",
    websiteUrl: "https://prettier.io",
    icon: "prettier",
    tags: ["formatting", "code-style", "consistency"],
    free: true,
    vscodeExtension: "esbenp.prettier-vscode",
    cursorCompatible: true,
  },
  {
    id: "drizzle",
    name: "Drizzle ORM",
    description: "TypeScript ORM with SQL-like syntax and zero overhead.",
    descriptionTh: "TypeScript ORM ด้วย SQL-like syntax และไม่มี overhead",
    category: "devops",
    installCommand: "npm install drizzle-orm",
    websiteUrl: "https://orm.drizzle.team",
    icon: "drizzle",
    tags: ["database", "orm", "typescript"],
    free: true,
    cursorCompatible: true,
  },
];

// Helper functions
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getCursorCompatibleTools(): Tool[] {
  return TOOLS.filter((tool) => tool.cursorCompatible);
}

export function getFreeTools(): Tool[] {
  return TOOLS.filter((tool) => tool.free);
}

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}
