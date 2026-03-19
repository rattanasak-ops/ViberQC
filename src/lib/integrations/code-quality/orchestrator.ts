// ============================================================
// ViberQC — Code Quality Deep Scan Orchestrator
// ============================================================

import { SonarCloudClient } from "./sonarcloud-client";
import { CodacyClient } from "./codacy-client";
import type {
  CodeQualityDeepScanResult,
  SonarMetrics,
  CodacyAnalysis,
} from "./types";

export type CodeQualityApiName = "sonarcloud" | "codacy";

interface CodeQualityScanInput {
  githubRepo?: string; // "owner/repo"
  url?: string;
}

/**
 * Run code quality deep scan.
 * Both SonarCloud and Codacy require a GitHub repo, not a URL.
 */
export async function runCodeQualityDeepScan(
  input: CodeQualityScanInput,
  userId: string,
  enabledApis: CodeQualityApiName[] = [],
): Promise<CodeQualityDeepScanResult> {
  const errors: { provider: string; message: string }[] = [];
  const providersUsed: string[] = [];

  const paid: {
    sonarcloud: SonarMetrics | null;
    codacy: CodacyAnalysis | null;
  } = { sonarcloud: null, codacy: null };

  const tasks: Promise<void>[] = [];

  // SonarCloud — uses project key (typically org_repo or just repo)
  if (enabledApis.includes("sonarcloud") && process.env.SONARCLOUD_TOKEN) {
    const projectKey = input.githubRepo?.replace("/", "_") ?? "";
    if (projectKey) {
      tasks.push(
        new SonarCloudClient()
          .getMeasures(projectKey, userId)
          .then((r) => {
            paid.sonarcloud = r;
            providersUsed.push("sonarcloud");
          })
          .catch((e) => {
            errors.push({ provider: "sonarcloud", message: String(e) });
          }),
      );
    } else {
      errors.push({
        provider: "sonarcloud",
        message: "githubRepo is required for SonarCloud analysis",
      });
    }
  }

  // Codacy — uses GitHub provider/org/repo
  if (enabledApis.includes("codacy") && process.env.CODACY_API_TOKEN) {
    const parts = input.githubRepo?.split("/");
    if (parts && parts.length === 2) {
      const [org, repo] = parts;
      tasks.push(
        new CodacyClient()
          .getRepoAnalysis("gh", org, repo, userId)
          .then((r) => {
            paid.codacy = r;
            providersUsed.push("codacy");
          })
          .catch((e) => {
            errors.push({ provider: "codacy", message: String(e) });
          }),
      );
    } else {
      errors.push({
        provider: "codacy",
        message: "githubRepo (owner/repo) is required for Codacy analysis",
      });
    }
  }

  await Promise.allSettled(tasks);

  // Calculate overall grade
  const overallGrade = calculateCodeQualityGrade(paid.sonarcloud, paid.codacy);

  // Count total issues
  const totalIssues =
    (paid.sonarcloud
      ? paid.sonarcloud.bugs +
        paid.sonarcloud.vulnerabilities +
        paid.sonarcloud.codeSmells
      : 0) + (paid.codacy?.issues ?? 0);

  return {
    sonarcloud: paid.sonarcloud,
    codacy: paid.codacy,
    overallGrade,
    totalIssues,
    scannedAt: new Date().toISOString(),
    providersUsed,
    errors,
  };
}

function calculateCodeQualityGrade(
  sonar: SonarMetrics | null,
  codacy: CodacyAnalysis | null,
): string {
  const gradeOrder = ["A", "B", "C", "D", "E", "F"];

  const sonarGrade = sonar?.ratings.maintainability ?? null;
  const codacyGrade = codacy?.grade ?? null;

  const sonarIdx = sonarGrade ? gradeOrder.indexOf(sonarGrade) : -1;
  const codacyIdx = codacyGrade ? gradeOrder.indexOf(codacyGrade) : -1;

  if (sonarIdx === -1 && codacyIdx === -1) return "N/A";
  if (sonarIdx === -1) return codacyGrade!;
  if (codacyIdx === -1) return sonarGrade!;

  // Return the worse grade
  const worstIdx = Math.max(sonarIdx, codacyIdx);
  return gradeOrder[worstIdx] ?? "N/A";
}
