"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  Zap,
  Search,
  Eye,
  Shield,
  Code,
  CheckCircle,
  Smartphone,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Performance",
    desc: "Load time, LCP, CLS, runtime analysis — every millisecond counts",
    color: "#22C55E",
    span: "lg:col-span-2 lg:row-span-2",
    illustration: "/images/illustration-speed.svg",
  },
  {
    icon: Search,
    title: "SEO",
    desc: "Meta tags, structure, search optimization",
    color: "#6C63FF",
  },
  {
    icon: Eye,
    title: "Accessibility",
    desc: "WCAG 2.1 AA compliance checks",
    color: "#FFB800",
  },
  {
    icon: Shield,
    title: "Security",
    desc: "OWASP Top 10 vulnerability detection",
    color: "#EF4444",
    illustration: "/images/illustration-shield.svg",
  },
  {
    icon: Code,
    title: "Code Quality",
    desc: "Patterns, best practices, maintainability",
    color: "#8D83FF",
  },
  {
    icon: CheckCircle,
    title: "Best Practices",
    desc: "Industry standards and modern web",
    color: "#84CC16",
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: Smartphone,
    title: "PWA",
    desc: "Progressive Web App readiness",
    color: "#F97316",
  },
  {
    icon: MessageCircle,
    title: "Viber Specific",
    desc: "Viber API and platform checks",
    color: "#6C63FF",
  },
];

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: y * -6, y: x * 6 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FeaturesGrid() {
  return (
    <section className="py-20 md:py-28 relative">
      {/* Section background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 dark:bg-primary/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Comprehensive Analysis
            </span>
          </motion.div>
          <motion.h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            360° Quality Control
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            8 phases of comprehensive scanning powered by AI
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: (i % 4) * 0.08,
                duration: 0.5,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className={feature.span}
            >
              <TiltCard className="h-full">
                <div
                  className={`
                    relative h-full overflow-hidden rounded-2xl
                    glass-card hover-lift
                    group cursor-default
                    transition-all duration-500
                    hover:border-primary/20 dark:hover:border-primary/30
                    ${feature.span?.includes("row-span-2") ? "p-8" : "p-6"}
                  `}
                >
                  {/* Noise grain */}
                  <div className="noise-grain" />

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${feature.color}08, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="relative inline-flex rounded-xl p-3 ring-1 ring-inset"
                    style={{
                      backgroundColor: `${feature.color}10`,
                      boxShadow: `0 0 20px ${feature.color}10`,
                    }}
                  >
                    <feature.icon
                      className={
                        feature.span?.includes("row-span-2")
                          ? "h-7 w-7"
                          : "h-5 w-5"
                      }
                      style={{ color: feature.color }}
                    />
                  </div>

                  {/* Text */}
                  <h3
                    className={`relative mt-4 font-semibold text-foreground ${feature.span?.includes("row-span-2") ? "text-xl" : "text-base"}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`relative mt-2 text-muted-foreground leading-relaxed ${feature.span?.includes("row-span-2") ? "text-base" : "text-sm"}`}
                  >
                    {feature.desc}
                  </p>

                  {/* Illustration for featured cards */}
                  {feature.illustration && (
                    <div className="relative mt-4 flex justify-center">
                      <Image
                        src={feature.illustration}
                        alt={feature.title}
                        width={feature.span?.includes("row-span-2") ? 140 : 80}
                        height={feature.span?.includes("row-span-2") ? 140 : 80}
                        className="opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                  )}

                  {/* Hero tile extra content */}
                  {feature.span?.includes("row-span-2") && (
                    <div className="relative mt-6 grid grid-cols-2 gap-3">
                      {["LCP", "CLS", "FID", "TTFB"].map((metric) => (
                        <div
                          key={metric}
                          className="rounded-lg bg-background/60 dark:bg-background/30 px-3 py-2 text-center"
                        >
                          <span className="text-xs text-muted-foreground">
                            {metric}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
