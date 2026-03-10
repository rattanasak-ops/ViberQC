"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { RadarChart } from "@/components/scan/radar-chart";
import { IssueList } from "@/components/scan/issue-list";
import { FolderKanban, ScanLine, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScanScores, ScanIssue } from "@/types";

// Demo data — จะเปลี่ยนเป็นข้อมูลจริงใน Phase 3
const demoScores: ScanScores = {
  overall: 72,
  performance: 85,
  seo: 78,
  accessibility: 65,
  security: 60,
  codeQuality: 75,
  bestPractices: 80,
  pwa: 55,
  viber: 70,
};

const demoIssues: ScanIssue[] = [
  {
    id: "1",
    phase: "security",
    severity: "critical",
    title: "Missing Content-Security-Policy header",
    description: "No CSP header detected. This exposes your app to XSS attacks.",
    recommendation: "Add a strict CSP header in your server configuration.",
    filePath: null,
    lineNumber: null,
  },
  {
    id: "2",
    phase: "performance",
    severity: "high",
    title: "Large JavaScript bundle (1.2MB)",
    description: "Main bundle exceeds recommended 250KB limit.",
    recommendation: "Enable code splitting and lazy load non-critical modules.",
    filePath: "src/app/page.tsx",
    lineNumber: 1,
  },
  {
    id: "3",
    phase: "accessibility",
    severity: "medium",
    title: "Missing alt text on 5 images",
    description: "Images without alt attributes are inaccessible to screen readers.",
    recommendation: "Add descriptive alt text to all <img> elements.",
    filePath: null,
    lineNumber: null,
  },
];

const stats = [
  { label: "Projects", value: "3", icon: FolderKanban, color: "#6C63FF" },
  { label: "Total Scans", value: "12", icon: ScanLine, color: "#22C55E" },
  { label: "Avg Score", value: "72", icon: TrendingUp, color: "#FFB800" },
  { label: "Open Issues", value: "8", icon: AlertTriangle, color: "#EF4444" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your Viber App quality</p>
        </div>
        <Link
          href="/scan"
          className={cn(buttonVariants(), "h-9")}
        >
          <ScanLine className="mr-2 h-4 w-4" />
          New Scan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="rounded-lg p-2.5"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
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

      {/* Score + Radar */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <ScoreGauge score={demoScores.overall} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <RadarChart scores={demoScores} size={260} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <IssueList issues={demoIssues} maxItems={5} />
        </CardContent>
      </Card>
    </div>
  );
}
