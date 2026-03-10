// ============================================================
// ViberQC — Scan Orchestrator
// Runs 8 QC phases in parallel batches for speed
// ============================================================

import type { Scan, ScanScores, ScanIssue, ScanPhase } from "@/types";
import { callAI, getModelTierForPhase } from "@/lib/ai/client";
import { siteConfig } from "@/config/site";

interface PhaseResult {
  phase: ScanPhase;
  score: number;
  issues: ScanIssue[];
}

export async function runScan(url: string): Promise<{
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
}> {
  const startTime = Date.now();

  // Batch 1: Fast phases (parallel)
  const batch1 = await Promise.all([
    runPhase(url, "performance", 1),
    runPhase(url, "seo", 2),
    runPhase(url, "accessibility", 3),
  ]);

  // Batch 2: Medium phases (parallel)
  const batch2 = await Promise.all([
    runPhase(url, "security", 4),
    runPhase(url, "code-quality", 5),
    runPhase(url, "best-practices", 6),
  ]);

  // Batch 3: Depends on batch 1+2 (parallel)
  const batch3 = await Promise.all([
    runPhase(url, "pwa", 7),
    runPhase(url, "viber", 8),
  ]);

  const allResults = [...batch1, ...batch2, ...batch3];
  const allIssues = allResults.flatMap((r) => r.issues);
  const scores = calculateScores(allResults);

  return {
    scores,
    issues: allIssues,
    durationMs: Date.now() - startTime,
  };
}

async function runPhase(
  url: string,
  phase: ScanPhase,
  phaseNumber: number
): Promise<PhaseResult> {
  const tier = getModelTierForPhase(phaseNumber);

  // TODO: Implement phase-specific prompts from lib/ai/prompts/
  const prompt = `Analyze the following URL for ${phase} issues: ${url}`;

  const response = await callAI(prompt, tier);

  // TODO: Parse AI response into structured PhaseResult
  return {
    phase,
    score: 0,
    issues: [],
  };
}

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
