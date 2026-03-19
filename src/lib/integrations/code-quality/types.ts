// ============================================================
// ViberQC — Code Quality Deep Scan Types
// ============================================================

// --- SonarCloud ---
export interface SonarMetrics {
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplicatedLinesDensity: number;
  ratings: {
    reliability: string; // A-E
    security: string;
    maintainability: string;
  };
}

// --- Codacy ---
export interface CodacyAnalysis {
  grade: string; // A-F
  issues: number;
  complexity: number;
  duplication: number;
  coverage: number;
  categories: {
    security: number;
    errorProne: number;
    codeStyle: number;
    compatibility: number;
    performance: number;
    unused: number;
  };
}

// --- Unified Result ---
export interface CodeQualityDeepScanResult {
  sonarcloud: SonarMetrics | null;
  codacy: CodacyAnalysis | null;
  overallGrade: string;
  totalIssues: number;
  scannedAt: string;
  providersUsed: string[];
  errors: { provider: string; message: string }[];
}
