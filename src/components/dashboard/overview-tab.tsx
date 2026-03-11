"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { RadarChart } from "@/components/scan/radar-chart";
import { IssueList } from "@/components/scan/issue-list";
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
  TrendingUp,
  Target,
  BarChart3,
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

const phaseConfig = [
  { key: "performance", name: "Performance", nameTh: "ประสิทธิภาพ", icon: Zap, color: "#FFB800" },
  { key: "seo", name: "SEO", nameTh: "SEO", icon: Search, color: "#84CC16" },
  { key: "accessibility", name: "Accessibility", nameTh: "การเข้าถึง", icon: Eye, color: "#F97316" },
  { key: "security", name: "Security", nameTh: "ความปลอดภัย", icon: Shield, color: "#EF4444" },
  { key: "codeQuality", name: "Code Quality", nameTh: "คุณภาพโค้ด", icon: Code, color: "#8D83FF" },
  { key: "bestPractices", name: "Best Practices", nameTh: "แนวปฏิบัติ", icon: CheckCircle, color: "#22C55E" },
  { key: "pwa", name: "PWA", nameTh: "PWA", icon: Smartphone, color: "#06B6D4" },
  { key: "viber", name: "Viber", nameTh: "Viber", icon: MessageCircle, color: "#6C63FF" },
];

function getScoreColor(score: number): string {
  if (score >= 90) return "#22C55E";
  if (score >= 70) return "#84CC16";
  if (score >= 50) return "#FFB800";
  if (score >= 25) return "#F97316";
  return "#EF4444";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 25) return "Poor";
  return "Critical";
}

export function OverviewTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanProgress, setScanProgress] = useState("");

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    setScanProgress("Connecting to server...");

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
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  const criticalCount = result?.issues.filter((i) => i.severity === "critical").length ?? 0;
  const highCount = result?.issues.filter((i) => i.severity === "high").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Scan Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <ScanLine className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quick Scan</h3>
                <p className="text-sm text-muted-foreground">สแกน URL เพื่อตรวจสอบคุณภาพ 360°</p>
              </div>
            </div>
            <form onSubmit={handleScan} className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="https://your-app.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 pl-10"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="h-12 px-6" disabled={!url.trim() || loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                {loading ? "Scanning..." : "Scan"}
              </Button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "90%" }}
                      transition={{ duration: 15, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">{scanProgress}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                {
                  label: "Overall Score",
                  labelTh: "คะแนนรวม",
                  value: result.scores.overall,
                  suffix: "/100",
                  icon: Target,
                  color: getScoreColor(result.scores.overall),
                },
                {
                  label: "Quality Gate",
                  labelTh: "ระดับคุณภาพ",
                  value: getScoreLabel(result.scores.overall),
                  icon: TrendingUp,
                  color: getScoreColor(result.scores.overall),
                },
                {
                  label: "Issues Found",
                  labelTh: "พบปัญหา",
                  value: result.issues.length,
                  icon: AlertTriangle,
                  color: result.issues.length > 10 ? "#EF4444" : "#FFB800",
                },
                {
                  label: "Scan Time",
                  labelTh: "เวลาสแกน",
                  value: (result.durationMs / 1000).toFixed(1) + "s",
                  icon: Clock,
                  color: "#6C63FF",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg p-2" style={{ backgroundColor: `${stat.color}15` }}>
                        <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold" style={{ color: stat.color }}>
                          {stat.value}
                          {stat.suffix && <span className="text-sm font-normal text-muted-foreground">{stat.suffix}</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Severity Summary */}
            {(criticalCount > 0 || highCount > 0) && (
              <div className="flex flex-wrap gap-3">
                {criticalCount > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-500">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {criticalCount} Critical
                  </span>
                )}
                {highCount > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-500">
                    {highCount} High
                  </span>
                )}
              </div>
            )}

            {/* Score + Radar */}
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Overall Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-6">
                    <ScoreGauge score={result.scores.overall} size={200} />
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Quality Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-6">
                    <RadarChart scores={result.scores} size={260} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Phase Scores */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Phase Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {phaseConfig.map((phase) => {
                      const score = (result.scores as unknown as Record<string, number>)[phase.key] ?? 0;
                      const color = getScoreColor(score);
                      return (
                        <div key={phase.key} className="rounded-xl border border-border/50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg p-2" style={{ backgroundColor: `${phase.color}15` }}>
                              <phase.icon className="h-5 w-5" style={{ color: phase.color }} />
                            </div>
                            <div>
                              <p className="text-xl font-bold" style={{ color }}>{score}</p>
                              <p className="text-xs text-muted-foreground">{phase.name}</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Issues */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Issues Found ({result.issues.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <IssueList issues={result.issues} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Share */}
            {result.shareToken && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-primary/20">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Share this result</p>
                      <p className="text-xs text-muted-foreground">แชร์ผลสแกนให้ทีม</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/r/${result.shareToken}`;
                        navigator.clipboard.writeText(shareUrl);
                      }}
                    >
                      Copy Share Link
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="rounded-2xl bg-primary/5 p-6">
            <ScanLine className="h-12 w-12 text-primary/40" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">Ready to Scan</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            กรอก URL ด้านบนเพื่อเริ่มตรวจสอบคุณภาพเว็บแอปพลิเคชัน 360°
          </p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {phaseConfig.slice(0, 4).map((phase) => (
              <div key={phase.key} className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3">
                <phase.icon className="h-4 w-4" style={{ color: phase.color }} />
                <span className="text-[10px] text-muted-foreground">{phase.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
