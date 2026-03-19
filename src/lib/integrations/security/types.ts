// ============================================================
// ViberQC — Security Deep Scan Types
// ============================================================

// --- Mozilla Observatory ---
export interface ObservatoryResult {
  grade: string; // "A+", "A", "B-", etc.
  score: number; // 0-125+
  tests: ObservatoryTest[];
  scannedAt: string;
}

export interface ObservatoryTest {
  name: string;
  pass: boolean;
  result: string;
  scoreModifier: number;
}

// --- SSL Labs ---
export interface SslLabsResult {
  host: string;
  grade: string; // "A+", "A", "B", "C", "D", "F", "T"
  hasWarnings: boolean;
  endpoints: SslLabsEndpoint[];
}

export interface SslLabsEndpoint {
  ipAddress: string;
  grade: string;
  protocols: { name: string; version: string }[];
  certExpiry: string | null;
  vulnerabilities: {
    heartbleed: boolean;
    poodle: boolean;
    freak: boolean;
    logjam: boolean;
  };
}

// --- Snyk ---
export interface SnykScanResult {
  vulnerabilities: SnykVulnerability[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface SnykVulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  packageName: string;
  version: string;
  fixAvailable: boolean;
  cvssScore: number;
  cve: string[];
}

// --- StackHawk ---
export interface StackHawkResult {
  findings: StackHawkFinding[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface StackHawkFinding {
  pluginId: string;
  name: string;
  severity: string;
  description: string;
  solution: string;
  url: string;
}

// --- Detectify ---
export interface DetectifyResult {
  findings: DetectifyFinding[];
  score: number;
}

export interface DetectifyFinding {
  uuid: string;
  title: string;
  severity: string;
  definition: { description: string; risk: string; remediation: string };
}

// --- Intruder ---
export interface IntruderResult {
  issues: IntruderIssue[];
  riskScore: number;
}

export interface IntruderIssue {
  id: string;
  title: string;
  severity: string;
  description: string;
  remediation: string;
}

// --- Unified Result ---
export interface SecurityDeepScanResult {
  observatory: ObservatoryResult | null;
  sslLabs: SslLabsResult | null;
  snyk: SnykScanResult | null;
  stackhawk: StackHawkResult | null;
  detectify: DetectifyResult | null;
  intruder: IntruderResult | null;
  overallGrade: string;
  totalIssues: number;
  scannedAt: string;
  providersUsed: string[];
  errors: { provider: string; message: string }[];
}
