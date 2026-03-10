"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { RadarChart } from "@/components/scan/radar-chart";
import { IssueList } from "@/components/scan/issue-list";
import { ShareCard } from "@/components/scan/share-card";
import {
  ScanLine,
  Globe,
  Loader2,
  Zap,
  Shield,
  Eye,
  Search,
  Code,
  CheckCircle,
  Smartphone,
  MessageCircle,
  Clock,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";
import type { ScanScores, ScanIssue } from "@/types";

interface ScanResult {
  url: string;
  status: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
}

const phaseIcons = {
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

export default function PublicScanPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanProgress, setScanProgress] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    setScanProgress("Connecting to server...");

    // Add https:// if missing
    let scanUrl = url.trim();
    if (!scanUrl.startsWith("http://") && !scanUrl.startsWith("https://")) {
      scanUrl = "https://" + scanUrl;
    }

    try {
      setScanProgress("Fetching and analyzing page...");

      const res = await fetch("/api/scan/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to run scan");
        setLoading(false);
        return;
      }

      setResult(data);
      setLoading(false);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("scan-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const criticalCount = result?.issues.filter((i) => i.severity === "critical").length ?? 0;
  const highCount = result?.issues.filter((i) => i.severity === "high").length ?? 0;
  const mediumCount = result?.issues.filter((i) => i.severity === "medium").length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Scan Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
          </div>

          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                <Zap className="h-3.5 w-3.5" />
                Free Scan — No Login Required
              </div>

              <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Scan Your App in{" "}
                <span className="bg-gradient-to-r from-primary to-[#8D83FF] bg-clip-text text-transparent">
                  30 Seconds
                </span>
              </h1>

              <p className="mt-4 text-lg text-muted-foreground">
                Paste your URL below. We'll analyze Performance, SEO, Security,
                Accessibility, and more — instantly.
              </p>
            </motion.div>

            {/* Scan Form */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="https://your-app.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-14 pl-12 text-base"
                    required
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-14 px-8 text-base"
                  disabled={!url.trim() || loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ScanLine className="mr-2 h-5 w-5" />
                  )}
                  {loading ? "Scanning..." : "Scan Now"}
                </Button>
              </form>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading Progress */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: "90%" }}
                          transition={{ duration: 15, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {scanProgress}
                      </p>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                        {Object.entries(phaseIcons).map(([key, Icon], i) => (
                          <motion.div
                            key={key}
                            className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2"
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.5 }}
                          >
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-[10px] text-muted-foreground">
                              {phaseNames[key]}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Scroll indicator when results available */}
            {result && !loading && (
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <a
                  href="#scan-results"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                  View Results Below
                </a>
              </motion.div>
            )}
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.section
              id="scan-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-border/50 bg-muted/30"
            >
              <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                {/* Result Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Scan Results
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        {result.url}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {(result.durationMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {criticalCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                        <AlertTriangle className="h-3 w-3" />
                        {criticalCount} Critical
                      </span>
                    )}
                    {highCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500">
                        {highCount} High
                      </span>
                    )}
                    {mediumCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">
                        {mediumCount} Medium
                      </span>
                    )}
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
                  className="mt-6"
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
                                <Icon
                                  className="h-5 w-5"
                                  style={{ color }}
                                />
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
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Issues Found ({result.issues.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <IssueList issues={result.issues} />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Share */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ShareCard
                    score={result.scores.overall}
                    url={result.url}
                    shareUrl={typeof window !== "undefined" ? window.location.href : ""}
                  />
                </motion.div>

                {/* Scan Again */}
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setResult(null);
                      setUrl("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <ScanLine className="mr-2 h-4 w-4" />
                    Scan Another URL
                  </Button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
