"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const ScoreGauge = dynamic(
  () =>
    import("@/components/scan/score-gauge").then((m) => ({
      default: m.ScoreGauge,
    })),
  { ssr: false },
);
const RadarChart = dynamic(
  () =>
    import("@/components/scan/radar-chart").then((m) => ({
      default: m.RadarChart,
    })),
  { ssr: false },
);
const IssueList = dynamic(
  () =>
    import("@/components/scan/issue-list").then((m) => ({
      default: m.IssueList,
    })),
  { ssr: false },
);
const ShareCard = dynamic(
  () =>
    import("@/components/scan/share-card").then((m) => ({
      default: m.ShareCard,
    })),
  { ssr: false },
);
const AiFixPanel = dynamic(
  () =>
    import("@/components/scan/ai-fix-panel").then((m) => ({
      default: m.AiFixPanel,
    })),
  { ssr: false },
);
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
  CheckCircle2,
  XCircle,
  Info,
  Download,
  FileText,
} from "lucide-react";
import type { ScanScores, ScanIssue } from "@/types";

interface ScanResult {
  url: string;
  status: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
  shareToken?: string;
}

type PhaseStatus = "pending" | "running" | "done";

interface PhaseProgress {
  id: string;
  name: string;
  icon: typeof Zap;
  status: PhaseStatus;
}

const phaseDefinitions = [
  { id: "fetch", name: "Fetching page", icon: Globe },
  { id: "performance", name: "Performance", icon: Zap },
  { id: "seo", name: "SEO", icon: Search },
  { id: "accessibility", name: "Accessibility", icon: Eye },
  { id: "security", name: "Security", icon: Shield },
  { id: "code-quality", name: "Code Quality", icon: Code },
  { id: "best-practices", name: "Best Practices", icon: CheckCircle },
  { id: "pwa", name: "PWA", icon: Smartphone },
  { id: "viber", name: "Viber Optimization", icon: MessageCircle },
] as const;

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
  const [phases, setPhases] = useState<PhaseProgress[]>([]);
  const [scanDone, setScanDone] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Phase-by-phase progress simulation
  const simulateProgress = useCallback(() => {
    const initial: PhaseProgress[] = phaseDefinitions.map((p) => ({
      id: p.id,
      name: p.name,
      icon: p.icon,
      status: "pending" as PhaseStatus,
    }));
    initial[0].status = "running";
    setPhases(initial);

    // Stagger phase completion to simulate real scanning
    const delays = [800, 1400, 2000, 2500, 3000, 3400, 3800, 4100, 4400];

    delays.forEach((delay, idx) => {
      setTimeout(() => {
        setPhases((prev) => {
          const next = prev.map((p) => ({ ...p }));
          // Mark current as done
          next[idx].status = "done";
          // Mark next as running (if exists)
          if (idx + 1 < next.length) {
            next[idx + 1].status = "running";
          }
          return next;
        });
      }, delay);
    });
  }, []);

  // Complete all phases instantly (when real scan finishes)
  const completeAllPhases = useCallback(() => {
    setPhases((prev) =>
      prev.map((p) => ({ ...p, status: "done" as PhaseStatus })),
    );
    setScanDone(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    setScanDone(false);

    let scanUrl = url.trim();
    if (!scanUrl.startsWith("http://") && !scanUrl.startsWith("https://")) {
      scanUrl = "https://" + scanUrl;
    }

    // Start phase animation
    simulateProgress();

    try {
      const res = await fetch("/api/scan/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to run scan");
        setLoading(false);
        setPhases([]);
        return;
      }

      // Complete all phases
      completeAllPhases();

      // Small delay to let the final checkmarks animate before showing results
      setTimeout(() => {
        setResult(data);
        setLoading(false);

        setTimeout(() => {
          document.getElementById("scan-results")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 400);
      }, 600);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
      setPhases([]);
    }
  }

  const criticalCount =
    result?.issues.filter((i) => i.severity === "critical").length ?? 0;
  const highCount =
    result?.issues.filter((i) => i.severity === "high").length ?? 0;
  const mediumCount =
    result?.issues.filter((i) => i.severity === "medium").length ?? 0;
  const lowCount =
    result?.issues.filter((i) => i.severity === "low").length ?? 0;

  const completedPhases = phases.filter((p) => p.status === "done").length;
  const progressPercent =
    phases.length > 0 ? (completedPhases / phases.length) * 100 : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1">
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
                  Seconds
                </span>
              </h1>

              <p className="mt-4 text-lg text-muted-foreground">
                Paste your URL below. We analyze Performance, SEO, Security,
                Accessibility, and 4 more dimensions — instantly.
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
                    aria-label="Website URL to scan"
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
                    role="alert"
                    aria-live="assertive"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
                  >
                    <XCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phase-by-Phase Loading Progress */}
              <AnimatePresence>
                {loading && phases.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8"
                  >
                    {/* Progress bar */}
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Analyzing{" "}
                        {phases.find((p) => p.status === "running")?.name ??
                          "Complete"}
                        ...
                      </span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>

                    {/* Phase list */}
                    <div className="mt-5 space-y-1.5">
                      {phases.map((phase, i) => {
                        const Icon = phase.icon;
                        return (
                          <motion.div
                            key={phase.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              phase.status === "running"
                                ? "bg-primary/5 text-foreground"
                                : phase.status === "done"
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/50"
                            }`}
                          >
                            {/* Status indicator */}
                            <div className="flex h-5 w-5 items-center justify-center">
                              {phase.status === "running" ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              ) : phase.status === "done" ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </motion.div>
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                              )}
                            </div>

                            {/* Phase icon + name */}
                            <Icon
                              className={`h-4 w-4 ${
                                phase.status === "running" ? "text-primary" : ""
                              }`}
                            />
                            <span
                              className={
                                phase.status === "running" ? "font-medium" : ""
                              }
                            >
                              {phase.name}
                            </span>

                            {/* Elapsed indicator for running phase */}
                            {phase.status === "running" && (
                              <span className="ml-auto text-xs text-primary/60">
                                analyzing...
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Scan done message */}
                    {scanDone && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center text-sm font-medium text-green-500"
                      >
                        <CheckCircle2 className="mr-1 inline h-4 w-4" />
                        Scan complete — loading results...
                      </motion.div>
                    )}
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
                <div className="mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Scan Results
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5" />
                          {result.url}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {(result.durationMs / 1000).toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Issue summary badges */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {criticalCount > 0 && (
                      <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                        <XCircle className="h-3 w-3" />
                        {criticalCount} Critical
                      </span>
                    )}
                    {highCount > 0 && (
                      <span className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500">
                        <AlertTriangle className="h-3 w-3" />
                        {highCount} High
                      </span>
                    )}
                    {mediumCount > 0 && (
                      <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">
                        <Info className="h-3 w-3" />
                        {mediumCount} Medium
                      </span>
                    )}
                    {lowCount > 0 && (
                      <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500">
                        {lowCount} Low
                      </span>
                    )}
                    {result.issues.length === 0 && (
                      <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        All Passed
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
                          const issues = result.issues.filter(
                            (i) => i.phase === key,
                          );
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-3 rounded-xl border border-border/50 p-4 transition-colors hover:bg-muted/50"
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
                                {issues.length > 0 && (
                                  <p className="text-[10px] text-muted-foreground/70">
                                    {issues.length} issue
                                    {issues.length > 1 ? "s" : ""}
                                  </p>
                                )}
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

                {/* AI Fix Suggestions */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <AiFixPanel issues={result.issues} url={result.url} />
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
                    shareUrl={
                      typeof window !== "undefined" && result.shareToken
                        ? `${window.location.origin}/r/${result.shareToken}`
                        : ""
                    }
                  />
                </motion.div>

                {/* Download PDF Report */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Download PDF Report
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Full report with AI summary, charts &
                            recommendations
                          </p>
                        </div>
                      </div>
                      <Button
                        size="lg"
                        disabled={pdfLoading}
                        onClick={async () => {
                          if (!result) return;
                          setPdfLoading(true);
                          try {
                            const res = await fetch("/api/reports/generate", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                url: result.url,
                                scores: result.scores,
                                issues: result.issues,
                                durationMs: result.durationMs,
                                scannedAt: result.scannedAt,
                                includeAiSummary: true,
                              }),
                            });
                            if (!res.ok)
                              throw new Error("PDF generation failed");
                            const blob = await res.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = blobUrl;
                            a.download = `viberqc-report-${Date.now()}.pdf`;
                            a.click();
                            URL.revokeObjectURL(blobUrl);
                          } catch {
                            alert("ไม่สามารถสร้าง PDF ได้ กรุณาลองอีกครั้ง");
                          } finally {
                            setPdfLoading(false);
                          }
                        }}
                      >
                        {pdfLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Scan Again */}
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setResult(null);
                      setUrl("");
                      setPhases([]);
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
