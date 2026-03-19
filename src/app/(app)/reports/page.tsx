"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getScoreColor } from "@/config/theme";

interface ReportItem {
  id: string;
  scanId: string;
  format: "web" | "pdf";
  shareUrl: string | null;
  shareToken: string | null;
  createdAt: string;
  expiresAt: string | null;
  url: string;
  scoreOverall: number | null;
  scores: unknown;
  completedAt: string | null;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(data.reports ?? []);
    } catch {
      setError("ไม่สามารถโหลด reports ได้");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPdf(reportId: string) {
    setDownloadingId(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/download`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `viberqc-report-${reportId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("ไม่สามารถดาวน์โหลด PDF ได้ กรุณาลองอีกครั้ง");
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">กำลังโหลด reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive">
        <AlertCircle className="mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">
          View and download your scan reports
        </p>
      </div>

      {/* Empty State */}
      {reports.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">ยังไม่มี report</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              สร้าง report ได้จากหน้าผล scan
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report List */}
      <div className="space-y-3">
        {reports.map((report, i) => {
          const score = report.scoreOverall ?? 0;
          const createdDate = new Date(report.createdAt).toLocaleDateString(
            "th-TH",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          );

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {report.url}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {report.format.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {createdDate}
                        </span>
                        {report.shareToken && (
                          <span className="text-primary/60">
                            /r/{report.shareToken}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className="text-lg font-bold"
                      style={{ color: getScoreColor(score) }}
                    >
                      {score}
                    </span>
                    <div className="flex gap-1">
                      {report.shareToken && (
                        <Link href={`/r/${report.shareToken}`}>
                          <Button variant="ghost" size="icon-sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDownloadPdf(report.id)}
                        disabled={downloadingId === report.id}
                      >
                        {downloadingId === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
