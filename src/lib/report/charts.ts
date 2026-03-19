// ============================================================
// ViberQC — Chart Generation for PDF Reports
// Uses QuickChart API (free, Chart.js-based)
// ============================================================

import type { ScanScores } from "@/types";

const QUICKCHART_BASE = "https://quickchart.io/chart";
const PRIMARY_COLOR = "#6C63FF";
const PRIMARY_BG = "rgba(108, 99, 255, 0.2)";

// -----------------------------------------------------------
// Radar Chart — 8-phase quality breakdown
// -----------------------------------------------------------
export function getRadarChartUrl(scores: ScanScores, size = 500): string {
  const config = {
    type: "radar",
    data: {
      labels: [
        "Performance",
        "SEO",
        "Accessibility",
        "Security",
        "Code Quality",
        "Best Practices",
        "PWA",
        "Viber",
      ],
      datasets: [
        {
          label: "Score",
          data: [
            scores.performance,
            scores.seo,
            scores.accessibility,
            scores.security,
            scores.codeQuality,
            scores.bestPractices,
            scores.pwa,
            scores.viber,
          ],
          backgroundColor: PRIMARY_BG,
          borderColor: PRIMARY_COLOR,
          borderWidth: 2,
          pointBackgroundColor: PRIMARY_COLOR,
        },
      ],
    },
    options: {
      scale: {
        ticks: { beginAtZero: true, min: 0, max: 100, stepSize: 20 },
        pointLabels: { fontSize: 12 },
      },
      legend: { display: false },
    },
  };

  return `${QUICKCHART_BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=${size}&h=${size}&bkg=white&f=png`;
}

// -----------------------------------------------------------
// Score Gauge — doughnut chart as gauge
// -----------------------------------------------------------
export function getScoreGaugeUrl(score: number, size = 300): string {
  const color = getScoreColor(score);
  const remaining = 100 - score;

  const config = {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [score, remaining],
          backgroundColor: [color, "#E5E7EB"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      circumference: Math.PI,
      rotation: Math.PI,
      cutoutPercentage: 75,
      plugins: {
        datalabels: {
          display: true,
          formatter: (val: number, ctx: { dataIndex: number }) =>
            ctx.dataIndex === 0 ? `${val}` : "",
          font: { size: 36, weight: "bold" },
          color: color,
        },
      },
      legend: { display: false },
    },
  };

  return `${QUICKCHART_BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=${size}&h=${Math.round(size * 0.6)}&bkg=white&f=png`;
}

// -----------------------------------------------------------
// Phase Bar Chart — horizontal bars
// -----------------------------------------------------------
export function getPhaseBarChartUrl(scores: ScanScores, size = 600): string {
  const labels = [
    "Security",
    "Performance",
    "Accessibility",
    "Code Quality",
    "SEO",
    "Best Practices",
    "Viber",
    "PWA",
  ];
  const data = [
    scores.security,
    scores.performance,
    scores.accessibility,
    scores.codeQuality,
    scores.seo,
    scores.bestPractices,
    scores.viber,
    scores.pwa,
  ];
  const colors = data.map(getScoreColor);

  const config = {
    type: "horizontalBar",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [{ ticks: { min: 0, max: 100 } }],
      },
      legend: { display: false },
      plugins: {
        datalabels: {
          display: true,
          anchor: "end",
          align: "end",
          font: { weight: "bold" },
        },
      },
    },
  };

  return `${QUICKCHART_BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=${size}&h=350&bkg=white&f=png`;
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function getScoreColor(score: number): string {
  if (score >= 90) return "#22C55E"; // green
  if (score >= 70) return "#84CC16"; // lime
  if (score >= 50) return "#EAB308"; // yellow
  if (score >= 30) return "#F97316"; // orange
  return "#EF4444"; // red
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Poor";
  return "Critical";
}
