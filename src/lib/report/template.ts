// ============================================================
// ViberQC — HTML Report Template for PDF Generation
// Generates self-contained HTML with inline CSS
// ============================================================

import type { ScanScores, ScanIssue } from "@/types";
import {
  getRadarChartUrl,
  getScoreGaugeUrl,
  getPhaseBarChartUrl,
  getScoreLabel,
} from "./charts";

export interface ReportData {
  url: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
  aiSummary?: string;
  branding?: {
    logo?: string;
    companyName?: string;
    primaryColor?: string;
  };
}

export function generateReportHtml(data: ReportData): string {
  const { url, scores, issues, durationMs, scannedAt, aiSummary, branding } =
    data;
  const primary = branding?.primaryColor ?? "#6C63FF";
  const company = branding?.companyName ?? "ViberQC";
  const logoSrc =
    branding?.logo ??
    `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({ type: "text", data: { text: "V" } }))}&w=40&h=40`;

  const radarUrl = getRadarChartUrl(scores);
  const gaugeUrl = getScoreGaugeUrl(scores.overall);
  const barUrl = getPhaseBarChartUrl(scores);

  const criticalIssues = issues.filter((i) => i.severity === "critical");
  const highIssues = issues.filter((i) => i.severity === "high");
  const mediumIssues = issues.filter((i) => i.severity === "medium");
  const lowIssues = issues.filter((i) => i.severity === "low");
  const infoIssues = issues.filter((i) => i.severity === "info");

  const scanDate = new Date(scannedAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const durationSec = (durationMs / 1000).toFixed(1);

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1F2937;
      font-size: 13px;
      line-height: 1.6;
    }
    .page { page-break-after: always; padding: 40px; min-height: 100vh; }
    .page:last-child { page-break-after: avoid; }

    /* Cover */
    .cover {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center;
      background: linear-gradient(135deg, #0F0B2E 0%, #1a1145 100%);
      color: white; min-height: 100vh;
    }
    .cover h1 { font-size: 32px; margin-bottom: 8px; }
    .cover .url { font-size: 18px; color: ${primary}; margin-bottom: 40px; word-break: break-all; }
    .cover .gauge { margin: 20px 0; }
    .cover .grade { font-size: 24px; font-weight: bold; color: ${primary}; }
    .cover .meta { color: #9CA3AF; font-size: 14px; margin-top: 30px; }
    .cover .logo-text { font-size: 14px; color: #9CA3AF; margin-top: 50px; }

    /* Summary */
    h2 { color: ${primary}; font-size: 20px; margin-bottom: 16px; border-bottom: 2px solid ${primary}; padding-bottom: 6px; }
    .charts-row { display: flex; gap: 30px; align-items: flex-start; margin: 20px 0; }
    .charts-row img { max-width: 100%; }
    .chart-radar { flex: 1; }
    .chart-bar { flex: 1; }

    /* Phase Table */
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #F3F4F6; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; color: #6B7280; }
    td { padding: 10px 12px; border-bottom: 1px solid #E5E7EB; }
    .score-cell { font-weight: bold; font-size: 16px; }

    /* Issues */
    .severity-header { margin: 24px 0 12px; font-size: 16px; font-weight: bold; display: flex; align-items: center; gap: 8px; }
    .severity-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .severity-critical { background: #EF4444; }
    .severity-high { background: #F97316; }
    .severity-medium { background: #EAB308; }
    .severity-low { background: #3B82F6; }
    .severity-info { background: #6B7280; }

    .issue-card {
      border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px;
      margin-bottom: 10px; break-inside: avoid;
    }
    .issue-title { font-weight: bold; margin-bottom: 4px; }
    .issue-phase { font-size: 11px; color: #6B7280; text-transform: uppercase; }
    .issue-desc { color: #4B5563; margin: 6px 0; font-size: 12px; }
    .issue-fix {
      background: #F0FDF4; border-left: 3px solid #22C55E;
      padding: 8px 12px; margin-top: 6px; font-size: 12px; border-radius: 0 4px 4px 0;
    }
    .issue-fix strong { color: #15803D; }

    /* Footer */
    .footer {
      text-align: center; color: #9CA3AF; font-size: 11px;
      padding: 30px 0; border-top: 1px solid #E5E7EB; margin-top: 40px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: Cover -->
  <div class="page cover">
    <h1>QC SCAN REPORT</h1>
    <div class="url">${escapeHtml(url)}</div>
    <div class="gauge">
      <img src="${gaugeUrl}" width="280" alt="Score gauge" />
    </div>
    <div class="grade">${scores.overall}/100 — ${getScoreLabel(scores.overall)}</div>
    <div class="meta">
      Scanned: ${scanDate}<br/>
      Duration: ${durationSec}s &nbsp;|&nbsp;
      Issues: ${issues.length} found
    </div>
    <div class="logo-text">Generated by ${escapeHtml(company)}</div>
  </div>

  <!-- PAGE 2: Executive Summary -->
  <div class="page">
    <h2>360° Quality Breakdown</h2>
    <div class="charts-row">
      <div class="chart-radar">
        <img src="${radarUrl}" width="420" alt="Radar chart" />
      </div>
      <div class="chart-bar">
        <img src="${barUrl}" width="420" alt="Phase scores" />
      </div>
    </div>

    <h2 style="margin-top:30px;">Phase Scores</h2>
    <table>
      <thead>
        <tr><th>Phase</th><th>Score</th><th>Weight</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${phaseRow("Security", scores.security, "20%")}
        ${phaseRow("Performance", scores.performance, "15%")}
        ${phaseRow("Accessibility", scores.accessibility, "15%")}
        ${phaseRow("Code Quality", scores.codeQuality, "15%")}
        ${phaseRow("SEO", scores.seo, "10%")}
        ${phaseRow("Best Practices", scores.bestPractices, "10%")}
        ${phaseRow("Viber Specific", scores.viber, "10%")}
        ${phaseRow("PWA", scores.pwa, "5%")}
      </tbody>
    </table>

    <div style="margin-top:20px;padding:16px;background:#F9FAFB;border-radius:8px;">
      <strong>Summary:</strong>
      ${criticalIssues.length} critical, ${highIssues.length} high,
      ${mediumIssues.length} medium, ${lowIssues.length} low,
      ${infoIssues.length} info issues found.
    </div>

    ${
      aiSummary
        ? `
    <div style="margin-top:24px;padding:20px;background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border-radius:8px;border-left:4px solid ${primary};">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="font-size:18px;">🤖</span>
        <strong style="color:${primary};font-size:15px;">AI Executive Summary</strong>
      </div>
      <div style="color:#374151;font-size:13px;line-height:1.7;white-space:pre-line;">${escapeHtml(aiSummary)}</div>
    </div>
    `
        : ""
    }
  </div>

  <!-- PAGE 3+: Issues -->
  <div class="page">
    <h2>Issues Found (${issues.length})</h2>

    ${issueSection("Critical", criticalIssues, "critical")}
    ${issueSection("High", highIssues, "high")}
    ${issueSection("Medium", mediumIssues, "medium")}
    ${issueSection("Low", lowIssues, "low")}
    ${issueSection("Info", infoIssues, "info")}

    ${issues.length === 0 ? '<p style="color:#22C55E;font-size:16px;text-align:center;padding:40px;">No issues found — great job!</p>' : ""}

    <div class="footer">
      Generated by ${escapeHtml(company)} — AI-Powered 360° QC Platform<br/>
      &copy; ${new Date().getFullYear()} ${escapeHtml(company)}. All rights reserved.
    </div>
  </div>

</body>
</html>`;
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function phaseRow(name: string, score: number, weight: string): string {
  const color =
    score >= 90
      ? "#22C55E"
      : score >= 70
        ? "#84CC16"
        : score >= 50
          ? "#EAB308"
          : score >= 30
            ? "#F97316"
            : "#EF4444";
  const label = getScoreLabel(score);
  return `<tr>
    <td>${name}</td>
    <td class="score-cell" style="color:${color}">${score}</td>
    <td>${weight}</td>
    <td>${label}</td>
  </tr>`;
}

function issueSection(
  title: string,
  issues: ScanIssue[],
  severity: string,
): string {
  if (issues.length === 0) return "";

  const cards = issues
    .map(
      (issue) => `
    <div class="issue-card">
      <div class="issue-phase">${escapeHtml(issue.phase)}</div>
      <div class="issue-title">${escapeHtml(issue.title)}</div>
      <div class="issue-desc">${escapeHtml(issue.description)}</div>
      ${
        issue.recommendation
          ? `<div class="issue-fix"><strong>Fix:</strong> ${escapeHtml(issue.recommendation)}</div>`
          : ""
      }
    </div>`,
    )
    .join("");

  return `
    <div class="severity-header">
      <span class="severity-dot severity-${severity}"></span>
      ${title} (${issues.length})
    </div>
    ${cards}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
