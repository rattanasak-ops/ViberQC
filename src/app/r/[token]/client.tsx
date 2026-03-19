"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { RadarChart } from "@/components/scan/radar-chart";
import { IssueList } from "@/components/scan/issue-list";
import {
  Globe,
  Clock,
  Loader2,
  ScanLine,
  Copy,
  Check,
  Zap,
  Shield,
  Eye,
  Search,
  Code,
  CheckCircle,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScanScores, ScanIssue } from "@/types";

interface ScanResult {
  url: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
}

const phaseIcons: Record<string, typeof Zap> = {
  performance: Zap,
  seo: Search,
  accessibility: Eye,
  security: Shield,
  "code-quality": Code,
  "best-practices": CheckCircle,
  pwa: Smartphone,
  viber: MessageCircle,
};

const phaseNames: Record<string, string> = {
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  security: "Security",
  "code-quality": "Code Quality",
  "best-practices": "Best Practices",
  pwa: "PWA",
  viber: "Viber",
};

function getPhaseScore(scores: ScanScores, phase: string): number {
  const map: Record<string, number> = {
    performance: scores.performance,
    seo: scores.seo,
    accessibility: scores.accessibility,
    security: scores.security,
    "code-quality": scores.codeQuality,
    "best-practices": scores.bestPractices,
    pwa: scores.pwa,
    viber: scores.viber,
  };
  return map[phase] ?? 0;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#22C55E";
  if (score >= 70) return "#84CC16";
  if (score >= 50) return "#FFB800";
  if (score >= 25) return "#F97316";
  return "#EF4444";
}

export function ShareResultClient({ token }: { token: string }) {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/scan/share/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Scan result not found or has expired.");
        setLoading(false);
      });
  }, [token]);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading scan result...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ScanLine className="h-16 w-16 text-muted-foreground/30" />
              <h2 className="mt-4 text-xl font-bold text-foreground">
                Result Not Found
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <Link href="/scan" className={cn(buttonVariants(), "mt-6")}>
                <ScanLine className="mr-2 h-4 w-4" />
                Run a New Scan
              </Link>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <ScanLine className="h-3 w-3" />
                    ViberQC Scan Report
                  </div>
                  <h1 className="mt-3 text-2xl font-bold text-foreground">
                    Scan Results
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {result.url}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {(result.durationMs / 1000).toFixed(1)}s
                    </span>
                    <span className="text-xs">
                      {new Date(result.scannedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="mr-2 h-3 w-3" />
                    ) : (
                      <Copy className="mr-2 h-3 w-3" />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Link
                    href="/scan"
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    <ScanLine className="mr-2 h-3 w-3" />
                    Scan Your App
                  </Link>
                </div>
              </div>

              {/* Overall Score + Radar */}
              <div className="grid gap-6 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                      <ScoreGauge score={result.scores.overall} size={200} />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Quality Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                      <RadarChart scores={result.scores} size={260} />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Phase Scores */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Phase Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {Object.entries(phaseIcons).map(([key, Icon]) => {
                        const score = getPhaseScore(result.scores, key);
                        const color = getScoreColor(score);
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 rounded-xl border border-border/50 p-4"
                          >
                            <div
                              className="rounded-lg p-2"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <Icon className="h-5 w-5" style={{ color }} />
                            </div>
                            <div>
                              <p
                                className="text-xl font-bold"
                                style={{ color }}
                              >
                                {score}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {phaseNames[key]}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Issues */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Issues Found ({result.issues.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IssueList issues={result.issues} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* CTA */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
                <h3 className="text-lg font-bold text-foreground">
                  Scan Your Own App
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Free 360° quality scan — no login required
                </p>
                <Link
                  href="/scan"
                  className={cn(buttonVariants({ size: "lg" }), "mt-4")}
                >
                  <ScanLine className="mr-2 h-5 w-5" />
                  Start Free Scan
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
