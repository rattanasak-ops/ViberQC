"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import type { ScanIssue } from "@/types";

interface AiFix {
  issueId: string;
  fixCode: string;
  explanation: string;
  language: string;
  fileHint: string | null;
  confidence: number;
  provider: string;
}

interface AiFixPanelProps {
  issues: ScanIssue[];
  url: string;
}

export function AiFixPanel({ issues, url }: AiFixPanelProps) {
  const [fixes, setFixes] = useState<AiFix[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  async function generateFixes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scan/ai-fix-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issues, url }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate fixes");
      }
      const data = await res.json();
      setFixes(data.fixes ?? []);
      setRemaining(data.remaining ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(issueId: string) {
    setExpanded((prev) => ({ ...prev, [issueId]: !prev[issueId] }));
  }

  async function copyCode(code: string, issueId: string) {
    await navigator.clipboard.writeText(code);
    setCopied(issueId);
    setTimeout(() => setCopied(null), 2000);
  }

  const criticalCount = issues.filter(
    (i) => i.severity === "critical" || i.severity === "high",
  ).length;

  if (fixes.length === 0 && !loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              AI Fix Suggestions
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {criticalCount > 0
                ? `${criticalCount} critical/high issues found — let AI generate code fixes`
                : "Let AI analyze issues and suggest code fixes"}
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            size="lg"
            onClick={generateFixes}
            disabled={loading || issues.length === 0}
            className="shadow-lg shadow-primary/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Fixes (Free — Top 3)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Fix Suggestions
          <Badge variant="outline" className="ml-auto text-xs">
            {fixes.length} fixes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {fixes.map((fix, i) => {
            const issue = issues.find((iss) => iss.id === fix.issueId);
            const isOpen = expanded[fix.issueId] ?? i === 0;

            return (
              <motion.div
                key={fix.issueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border/50 bg-card"
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(fix.issueId)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {issue?.title ?? fix.issueId}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {fix.explanation.slice(0, 80)}...
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-xs"
                    style={{
                      borderColor:
                        fix.confidence >= 0.8
                          ? "#22C55E"
                          : fix.confidence >= 0.5
                            ? "#EAB308"
                            : "#F97316",
                    }}
                  >
                    {Math.round(fix.confidence * 100)}%
                  </Badge>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/50 px-4 pb-4 pt-3">
                        {/* Explanation */}
                        <p className="text-sm text-muted-foreground">
                          {fix.explanation}
                        </p>

                        {/* Code block */}
                        {fix.fixCode && (
                          <div className="mt-3 relative">
                            {fix.fileHint && (
                              <div className="text-xs text-muted-foreground mb-1 font-mono">
                                {fix.fileHint}
                              </div>
                            )}
                            <div className="rounded-lg bg-[#0F0B2E] p-4 overflow-x-auto">
                              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                                {fix.fixCode}
                              </pre>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="absolute top-8 right-2"
                              onClick={() => copyCode(fix.fixCode, fix.issueId)}
                            >
                              {copied === fix.issueId ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Meta */}
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{fix.language}</span>
                          <span>via {fix.provider}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Upgrade prompt for remaining issues */}
        {remaining > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
            <Lock className="h-5 w-5 text-primary/60" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {remaining} more issues need fixes
              </p>
              <p className="text-xs text-muted-foreground">
                Upgrade to Pro for unlimited AI fix suggestions
              </p>
            </div>
            <a
              href="/pricing"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Upgrade
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
