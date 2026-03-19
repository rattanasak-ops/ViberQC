// ============================================================
// ViberQC — Accessibility Deep Scan Types
// ============================================================

// --- axe-core ---
export interface AxeViolation {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  description: string;
  help: string;
  helpUrl: string;
  nodes: {
    html: string;
    target: string[];
    failureSummary: string;
  }[];
  tags: string[];
}

export interface AxeResult {
  violations: AxeViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
}

// --- WAVE ---
export interface WaveItem {
  id: string;
  description: string;
  count: number;
  selectors: string[];
}

export interface WaveCategory {
  count: number;
  items: WaveItem[];
}

export interface WaveResult {
  categories: {
    error: WaveCategory;
    contrast: WaveCategory;
    alert: WaveCategory;
    feature: WaveCategory;
    structure: WaveCategory;
    aria: WaveCategory;
  };
  statistics: {
    totalElements: number;
    pageTitle: string;
    pageUrl: string;
  };
}

// --- Pa11y ---
export interface Pa11yIssue {
  code: string;
  type: string;
  typeCode: number;
  message: string;
  context: string;
  selector: string;
}

export interface Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: Pa11yIssue[];
}

// --- Unified Result ---
export interface AccessibilityDeepScanResult {
  axe: AxeResult | null;
  wave: WaveResult | null;
  pa11y: Pa11yResult | null;
  wcagLevel: string;
  totalViolations: number;
  scannedAt: string;
  providersUsed: string[];
  errors: { provider: string; message: string }[];
}
