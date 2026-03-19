// ============================================================
// ViberQC — AI Fix Suggestions Types
// ============================================================

export interface AiFixSuggestion {
  issueId: string;
  fixCode: string;
  explanation: string;
  language: string;
  fileHint: string | null;
  confidence: number; // 0-1
  provider: string;
  tokensUsed: number;
  costCents: number;
}

export interface AiFixInput {
  issueId: string;
  phase: string;
  severity: string;
  title: string;
  description: string;
  recommendation: string | null;
  context: {
    url?: string;
    htmlSnippet?: string;
    headers?: Record<string, string>;
  };
}

export interface AiFixBatchResult {
  fixes: AiFixSuggestion[];
  totalTokensUsed: number;
  totalCostCents: number;
  provider: string;
  scannedAt: string;
  errors: { issueId: string; message: string }[];
}
