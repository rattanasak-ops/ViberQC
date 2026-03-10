"use client";

import { motion, type Variants } from "framer-motion";

interface LogoProps {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = 40,
  animated = true,
  showText = true,
  className = "",
}: LogoProps) {
  const iconSize = size;
  const shieldPath = "M20 4L4 8v8c0 7.2 6.8 12.4 16 16 9.2-3.6 16-8.8 16-16V8L20 4z";

  const checkVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.4, ease: "easeOut" as const },
    },
  };

  const shieldVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const pulseVariants: Variants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  const svgContent = (
    <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield background with gradient */}
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="50%" stopColor="#8D83FF" />
              <stop offset="100%" stopColor="#5046E5" />
            </linearGradient>
            <linearGradient id="shieldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B3ACFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Outer glow */}
          {animated && (
            <motion.path
              d={shieldPath}
              fill="url(#shieldGlow)"
              variants={shieldVariants}
              initial="hidden"
              animate="visible"
            />
          )}

          {/* Shield body */}
          {animated ? (
            <motion.path
              d={shieldPath}
              fill="url(#shieldGrad)"
              variants={shieldVariants}
              initial="hidden"
              animate="visible"
            />
          ) : (
            <path d={shieldPath} fill="url(#shieldGrad)" />
          )}

          {/* Checkmark */}
          {animated ? (
            <motion.path
              d="M13 20l4.5 4.5L27 15"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              variants={checkVariants}
              initial="hidden"
              animate="visible"
            />
          ) : (
            <path
              d="M13 20l4.5 4.5L27 15"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}

          {/* AI circle indicator */}
          {animated ? (
            <motion.circle
              cx="32"
              cy="8"
              r="4"
              fill="#22C55E"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 500 }}
            />
          ) : (
            <circle cx="32" cy="8" r="4" fill="#22C55E" />
          )}
        </svg>
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {animated ? (
        <motion.div variants={pulseVariants} animate="animate">
          {svgContent}
        </motion.div>
      ) : (
        <div>{svgContent}</div>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Viber<span className="text-[#6C63FF]">QC</span>
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
            AI Quality Control
          </span>
        </div>
      )}
    </div>
  );
}

// Slogan variants
export const slogans = {
  primary: "Scan. Fix. Ship with Confidence.",
  secondary: "AI-Powered 360° Quality Control for Viber Apps",
  short: "QC Smarter, Ship Faster",
  thai: "สแกน แก้ไข ส่งมอบอย่างมั่นใจ",
} as const;
