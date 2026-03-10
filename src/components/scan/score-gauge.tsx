"use client";

import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/config/theme";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  animated?: boolean;
}

export function ScoreGauge({
  score,
  size = 160,
  label,
  animated = true,
}: ScoreGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);
  const scoreLabel = label || getScoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : undefined}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {animated ? (
            <motion.span
              className="text-4xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}
            </motion.span>
          ) : (
            <span className="text-4xl font-bold text-foreground">{score}</span>
          )}
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Label */}
      <span className="text-sm font-medium" style={{ color }}>
        {scoreLabel}
      </span>
    </div>
  );
}
