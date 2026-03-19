"use client";

import { motion } from "framer-motion";
import { getScoreColor } from "@/config/theme";
import type { ScanScores } from "@/types";

interface RadarChartProps {
  scores: ScanScores;
  size?: number;
  animated?: boolean;
}

const phases = [
  { key: "performance", label: "Performance" },
  { key: "seo", label: "SEO" },
  { key: "accessibility", label: "A11y" },
  { key: "security", label: "Security" },
  { key: "codeQuality", label: "Code" },
  { key: "bestPractices", label: "Best" },
  { key: "pwa", label: "PWA" },
  { key: "viber", label: "Viber" },
] as const;

export function RadarChart({
  scores,
  size = 280,
  animated = true,
}: RadarChartProps) {
  const center = size / 2;
  const maxRadius = (size - 60) / 2;
  const numPhases = phases.length;
  const angleStep = (2 * Math.PI) / numPhases;

  function getPoint(index: number, value: number): [number, number] {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return [
      center + radius * Math.cos(angle),
      center + radius * Math.sin(angle),
    ];
  }

  // Score polygon points
  const scorePoints = phases
    .map((phase, i) => {
      const score = scores[phase.key as keyof ScanScores] ?? 0;
      return getPoint(i, score);
    })
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  // Grid rings (25%, 50%, 75%, 100%)
  const gridRings = [25, 50, 75, 100];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Grid rings */}
        {gridRings.map((ring) => {
          const ringPoints = Array.from({ length: numPhases }, (_, i) => {
            const [x, y] = getPoint(i, ring);
            return `${x},${y}`;
          }).join(" ");

          return (
            <polygon
              key={ring}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
              opacity={0.3}
            />
          );
        })}

        {/* Axis lines */}
        {phases.map((_, i) => {
          const [x, y] = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
              opacity={0.2}
            />
          );
        })}

        {/* Score polygon */}
        {animated ? (
          <motion.polygon
            points={scorePoints}
            fill="var(--color-vqc-primary)"
            fillOpacity={0.2}
            stroke="var(--color-vqc-primary)"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        ) : (
          <polygon
            points={scorePoints}
            fill="var(--color-vqc-primary)"
            fillOpacity={0.2}
            stroke="var(--color-vqc-primary)"
            strokeWidth={2}
          />
        )}

        {/* Score dots */}
        {phases.map((phase, i) => {
          const score = scores[phase.key as keyof ScanScores] ?? 0;
          const [x, y] = getPoint(i, score);
          const color = getScoreColor(score);

          return animated ? (
            <motion.circle
              key={phase.key}
              cx={x}
              cy={y}
              r={4}
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
            />
          ) : (
            <circle key={phase.key} cx={x} cy={y} r={4} fill={color} />
          );
        })}

        {/* Labels */}
        {phases.map((phase, i) => {
          const [x, y] = getPoint(i, 118);
          const score = scores[phase.key as keyof ScanScores] ?? 0;

          return (
            <text
              key={phase.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {phase.label} ({score})
            </text>
          );
        })}
      </svg>
    </div>
  );
}
