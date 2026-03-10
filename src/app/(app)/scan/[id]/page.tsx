"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { RadarChart } from "@/components/scan/radar-chart";
import { IssueList } from "@/components/scan/issue-list";
import { ShareCard } from "@/components/scan/share-card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Globe, Cpu } from "lucide-react";
import Link from "next/link";
import type { ScanScores, ScanIssue } from "@/types";

// Demo data
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
  {
    id: "4",
    phase: "pwa",
    severity: "medium",
    title: "No service worker registered",
    description: "PWA functionality requires a service worker for offline support.",
    recommendation: "Register a service worker with caching strategies.",
    filePath: null,
    lineNumber: null,
  },
  {
    id: "5",
    phase: "seo",
    severity: "low",
    title: "Missing canonical URL",
    description: "No canonical link found. May cause duplicate content issues.",
    recommendation: "Add <link rel='canonical'> to your page head.",
    filePath: null,
    lineNumber: null,
  },
];

const phaseScores = [
  { name: "Performance", score: 85, color: "#22C55E" },
  { name: "SEO", score: 78, color: "#6C63FF" },
  { name: "Accessibility", score: 65, color: "#FFB800" },
  { name: "Security", score: 60, color: "#EF4444" },
  { name: "Code Quality", score: 75, color: "#8D83FF" },
  { name: "Best Practices", score: 80, color: "#84CC16" },
  { name: "PWA", score: 55, color: "#F97316" },
  { name: "Viber", score: 70, color: "#6C63FF" },
];

export default function ScanResultPage() {
  return (
    <div className="space-y-8">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Scan Report</h1>
          <Badge variant="secondary">Completed</Badge>
        </div>

        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            https://shopping-bot.example.com
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            28.4s
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            Claude 3.5 Sonnet
          </span>
        </div>
      </div>

      {/* Score + Radar */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <ScoreGauge score={demoScores.overall} size={180} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Quality Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <RadarChart scores={demoScores} size={260} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Phase Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Phase Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {phaseScores.map((phase) => (
              <div
                key={phase.name}
                className="rounded-lg border border-border/50 p-3 text-center"
              >
                <p
                  className="text-2xl font-bold"
                  style={{ color: phase.color }}
                >
                  {phase.score}
                </p>
                <p className="text-xs text-muted-foreground">{phase.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      <Card>
        <CardHeader>
          <CardTitle>
            Issues Found ({demoIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IssueList issues={demoIssues} />
        </CardContent>
      </Card>

      {/* Share */}
      <ShareCard score={demoScores.overall} url="https://shopping-bot.example.com" shareUrl="https://viberqc.com/share/abc123" />
    </div>
  );
}
