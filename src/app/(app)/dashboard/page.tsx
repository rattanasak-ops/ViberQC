"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreGauge } from "@/components/scan/score-gauge";
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
  FolderKanban,
  TrendingUp,
  LayoutDashboard,
  ListChecks,
  Settings,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanScores, ScanIssue } from "@/types";

interface ScanResult {
  url: string;
  scores: ScanScores;
  issues: ScanIssue[];
  durationMs: number;
  scannedAt: string;
}

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "scan", label: "Quick Scan", icon: ScanLine },
  { id: "checklist", label: "Checklist", icon: ListChecks },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const scanCategories = [
  { id: "performance", name: "Performance", icon: Zap, color: "#22C55E", description: "Response time, compression, resource optimization" },
  { id: "seo", name: "SEO", icon: Search, color: "#6C63FF", description: "Meta tags, Open Graph, headings, canonical" },
  { id: "accessibility", name: "Accessibility", icon: Eye, color: "#FFB800", description: "ARIA, labels, heading hierarchy, landmarks" },
  { id: "security", name: "Security", icon: Shield, color: "#EF4444", description: "HTTPS, CSP, HSTS, security headers" },
  { id: "code-quality", name: "Code Quality", icon: Code, color: "#8D83FF", description: "HTML structure, deprecated tags, inline styles" },
  { id: "best-practices", name: "Best Practices", icon: CheckCircle, color: "#84CC16", description: "Viewport, charset, favicon, structured data" },
  { id: "pwa", name: "PWA", icon: Smartphone, color: "#F97316", description: "Manifest, service worker, theme-color" },
  { id: "viber", name: "Viber Specific", icon: MessageCircle, color: "#6C63FF", description: "OG tags for Viber preview, mobile optimization" },
];

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

function getStatusBadge(score: number) {
  if (score >= 90) return { text: "Pass", color: "bg-green-500/10 text-green-500" };
  if (score >= 70) return { text: "Good", color: "bg-lime-500/10 text-lime-500" };
  if (score >= 50) return { text: "Warning", color: "bg-yellow-500/10 text-yellow-500" };
  return { text: "Fail", color: "bg-red-500/10 text-red-500" };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let scanUrl = url.trim();
    if (!scanUrl.startsWith("http://") && !scanUrl.startsWith("https://")) {
      scanUrl = "https://" + scanUrl;
    }

    try {
      const res = await fetch("/api/scan/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Scan failed");
        setLoading(false);
        return;
      }

      const result: ScanResult = {
        url: data.url,
        scores: data.scores,
        issues: data.issues,
        durationMs: data.durationMs,
        scannedAt: data.scannedAt,
      };

      setLastScan(result);
      setScanHistory((prev) => [result, ...prev]);
      setLoading(false);
      setActiveTab("overview");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Enterprise 360° QC Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered quality control for Viber Apps
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border/50 bg-muted/50 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick scan inline */}
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleScan} className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Paste URL to scan..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-10 pl-10"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" disabled={!url.trim() || loading} className="h-10">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                  {loading ? "Scanning..." : "Scan"}
                </Button>
              </form>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          {lastScan ? (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Overall Score", value: lastScan.scores.overall.toString(), icon: TrendingUp, color: getScoreColor(lastScan.scores.overall) },
                  { label: "Total Issues", value: lastScan.issues.length.toString(), icon: AlertTriangle, color: "#EF4444" },
                  { label: "Scan Time", value: `${(lastScan.durationMs / 1000).toFixed(1)}s`, icon: Clock, color: "#6C63FF" },
                  { label: "Scans Today", value: scanHistory.length.toString(), icon: FolderKanban, color: "#22C55E" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="rounded-lg p-2.5" style={{ backgroundColor: `${stat.color}15` }}>
                          <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Score + Categories */}
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Overall Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-6">
                    <ScoreGauge score={lastScan.scores.overall} size={160} />
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Scan Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {scanCategories.map((cat) => {
                        const score = getPhaseScore(lastScan.scores, cat.id);
                        const status = getStatusBadge(score);
                        const Icon = cat.icon;
                        const issueCount = lastScan.issues.filter((i) => i.phase === cat.id).length;
                        return (
                          <div key={cat.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg p-2" style={{ backgroundColor: `${cat.color}15` }}>
                                <Icon className="h-4 w-4" style={{ color: cat.color }} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{cat.name}</p>
                                <p className="text-xs text-muted-foreground">{issueCount} issue{issueCount !== 1 ? "s" : ""}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold" style={{ color: getScoreColor(score) }}>{score}</span>
                              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", status.color)}>{status.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Issues ({lastScan.issues.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <IssueList issues={lastScan.issues} maxItems={10} />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ScanLine className="h-16 w-16 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No Scans Yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Paste a URL above and click "Scan" to analyze your Viber App's quality across 8 dimensions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "scan" && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Quick Scan</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleScan} className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input type="text" placeholder="https://your-viber-app.com" value={url} onChange={(e) => setUrl(e.target.value)} className="h-12 pl-12 text-base" disabled={loading} />
                </div>
                <Button type="submit" className="h-12 w-full text-base" disabled={!url.trim() || loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ScanLine className="mr-2 h-5 w-5" />}
                  {loading ? "Scanning..." : "Start 360° Scan"}
                </Button>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {scanCategories.map((cat, i) => {
              const Icon = cat.icon;
              const hasResult = lastScan !== null;
              const score = hasResult ? getPhaseScore(lastScan.scores, cat.id) : null;
              return (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg p-2.5" style={{ backgroundColor: `${cat.color}15` }}>
                          <Icon className="h-5 w-5" style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.description}</p>
                        </div>
                      </div>
                      {score !== null && (
                        <div className="mt-3 flex items-center justify-between">
                          <div className="h-2 flex-1 rounded-full bg-muted">
                            <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }} />
                          </div>
                          <span className="ml-3 text-sm font-bold" style={{ color: getScoreColor(score) }}>{score}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "checklist" && (
        <Card>
          <CardHeader><CardTitle>Quality Checklist</CardTitle></CardHeader>
          <CardContent>
            {lastScan ? (
              <div className="space-y-3">
                {scanCategories.map((cat) => {
                  const score = getPhaseScore(lastScan.scores, cat.id);
                  const passed = score >= 70;
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                      <div className={cn("rounded-full p-1", passed ? "bg-green-500/10" : "bg-red-500/10")}>
                        {passed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />}
                      </div>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm font-medium">{cat.name}</span>
                      <span className="text-sm font-bold" style={{ color: getScoreColor(score) }}>{score}/100</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">Run a scan first to see the quality checklist.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "tools" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { name: "URL Scanner", desc: "Scan any URL for quality issues", icon: ScanLine },
            { name: "Security Audit", desc: "Deep security header analysis", icon: Shield },
            { name: "SEO Checker", desc: "Meta tags & Open Graph analysis", icon: Search },
            { name: "Accessibility Test", desc: "WCAG compliance checking", icon: Eye },
          ].map((tool) => (
            <Card key={tool.name} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "settings" && (
        <Card>
          <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/50 p-4">
              <p className="text-sm font-medium">Scan Configuration</p>
              <p className="mt-1 text-xs text-muted-foreground">Configure scan phases, timeouts, and notification preferences.</p>
            </div>
            <div className="rounded-lg border border-border/50 p-4">
              <p className="text-sm font-medium">API Keys</p>
              <p className="mt-1 text-xs text-muted-foreground">Manage your ViberQC API key for programmatic access.</p>
            </div>
            <div className="rounded-lg border border-border/50 p-4">
              <p className="text-sm font-medium">Notifications</p>
              <p className="mt-1 text-xs text-muted-foreground">Configure email alerts for scan results and quality regressions.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
