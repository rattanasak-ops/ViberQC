// ============================================================
// ViberQC — Theme & Design Tokens (Palette B: AI Precision)
// ============================================================

export const colors = {
  // Primary
  primary: {
    DEFAULT: "#5A52D5",
    50: "#F0EEFF",
    100: "#D9D6FF",
    200: "#B3ACFF",
    300: "#8D83FF",
    400: "#5A52D5",
    500: "#5046E5",
    600: "#3A32CC",
    700: "#2D1B69",
    800: "#1A1147",
    900: "#0F0B2E",
    950: "#080619",
  },

  // Background
  background: {
    dark: "#0F0B2E",
    darkSecondary: "#2D1B69",
    light: "#FAFBFE",
    lightSecondary: "#F1F0FF",
  },

  // Semantic
  success: "#22C55E",
  error: "#EF4444",
  warning: "#FFB800",
  info: "#5A52D5",

  // Text
  text: {
    dark: "#E2E8F0",
    darkMuted: "#94A3B8",
    light: "#1E293B",
    lightMuted: "#64748B",
  },

  // QC Score colors
  score: {
    excellent: "#22C55E", // 90-100
    good: "#84CC16", // 70-89
    average: "#FFB800", // 50-69
    poor: "#F97316", // 25-49
    critical: "#EF4444", // 0-24
  },
} as const;

export const fonts = {
  thai: "Sarabun",
  english: "Inter",
  mono: "JetBrains Mono",
} as const;

export const borderRadius = {
  card: "16px",
  button: "12px",
  input: "8px",
  badge: "9999px",
} as const;

export function getScoreColor(score: number): string {
  if (score >= 90) return colors.score.excellent;
  if (score >= 70) return colors.score.good;
  if (score >= 50) return colors.score.average;
  if (score >= 25) return colors.score.poor;
  return colors.score.critical;
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 25) return "Poor";
  return "Critical";
}
