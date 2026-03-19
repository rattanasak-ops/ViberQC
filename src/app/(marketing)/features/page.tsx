"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Zap,
  Search,
  Eye,
  Shield,
  Code,
  CheckCircle,
  Smartphone,
  MessageCircle,
  Brain,
  BarChart3,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const scanPhases = [
  {
    icon: Zap,
    title: "Performance",
    description:
      "Analyze load times, Core Web Vitals (LCP, CLS, FID), runtime performance, bundle size, and resource optimization.",
    checks: [
      "Core Web Vitals",
      "Bundle analysis",
      "Image optimization",
      "Caching strategy",
    ],
    color: "#22C55E",
  },
  {
    icon: Search,
    title: "SEO",
    description:
      "Comprehensive SEO audit covering meta tags, Open Graph, structured data, sitemap, and search engine visibility.",
    checks: [
      "Meta tags & OG",
      "Structured data",
      "Sitemap & robots",
      "Canonical URLs",
    ],
    color: "#6C63FF",
  },
  {
    icon: Eye,
    title: "Accessibility",
    description:
      "WCAG 2.1 AA compliance checks for color contrast, keyboard navigation, screen readers, and ARIA attributes.",
    checks: [
      "Color contrast",
      "Keyboard navigation",
      "ARIA labels",
      "Focus management",
    ],
    color: "#FFB800",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "OWASP Top 10 vulnerability detection, CSP analysis, dependency auditing, and data exposure checks.",
    checks: [
      "OWASP Top 10",
      "CSP headers",
      "Dependency audit",
      "Data exposure",
    ],
    color: "#EF4444",
  },
  {
    icon: Code,
    title: "Code Quality",
    description:
      "Static analysis for code patterns, maintainability, complexity, dead code detection, and TypeScript best practices.",
    checks: [
      "Code patterns",
      "Complexity analysis",
      "Dead code",
      "TypeScript checks",
    ],
    color: "#8D83FF",
  },
  {
    icon: CheckCircle,
    title: "Best Practices",
    description:
      "Industry standards compliance including modern web APIs, responsive design, error handling, and logging.",
    checks: [
      "Modern APIs",
      "Responsive design",
      "Error handling",
      "Logging standards",
    ],
    color: "#84CC16",
  },
  {
    icon: Smartphone,
    title: "PWA Readiness",
    description:
      "Progressive Web App readiness assessment covering manifest, service worker, offline support, and installability.",
    checks: [
      "Web manifest",
      "Service worker",
      "Offline support",
      "Installability",
    ],
    color: "#F97316",
  },
  {
    icon: MessageCircle,
    title: "Viber Specific",
    description:
      "Platform-specific checks for Viber API integration, deep links, bot compatibility, and Viber Mini App standards.",
    checks: [
      "Viber API usage",
      "Deep links",
      "Bot compatibility",
      "Mini App standards",
    ],
    color: "#6C63FF",
  },
];

const highlights = [
  {
    icon: Brain,
    title: "Multi-Model AI",
    description:
      "Leverages Claude, GPT-4, Gemini, and Grok with automatic fallback for the most accurate analysis.",
  },
  {
    icon: BarChart3,
    title: "360° Scoring",
    description:
      "Weighted scoring across all 8 phases gives you a single, actionable quality score from 0–100.",
  },
  {
    icon: Clock,
    title: "30-Second Reports",
    description:
      "Parallel scanning architecture delivers comprehensive results in under 30 seconds.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center">
              <motion.h1
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                8 Phases of AI-Powered QC
              </motion.h1>
              <motion.p
                className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Every scan covers 8 critical quality dimensions — from
                performance to Viber-specific checks — all powered by
                multi-model AI.
              </motion.p>
            </div>

            {/* Highlights */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="inline-flex rounded-lg bg-primary/10 p-2.5">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scan Phases Grid */}
            <div className="mt-20">
              <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
                What We Scan
              </h2>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {scanPhases.map((phase, i) => (
                  <motion.div
                    key={phase.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Card className="group h-full border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <CardContent className="p-6">
                        <div
                          className="inline-flex rounded-lg p-2.5"
                          style={{ backgroundColor: `${phase.color}15` }}
                        >
                          <phase.icon
                            className="h-5 w-5"
                            style={{ color: phase.color }}
                          />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-foreground">
                          {phase.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {phase.description}
                        </p>
                        <ul className="mt-4 space-y-1.5">
                          {phase.checks.map((check) => (
                            <li
                              key={check}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                              <CheckCircle
                                className="h-3 w-3 shrink-0"
                                style={{ color: phase.color }}
                              />
                              {check}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base",
                )}
              >
                Start Free Scan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
