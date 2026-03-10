"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getScoreColor } from "@/config/theme";

const demoReports = [
  {
    id: "r1",
    scanId: "1",
    projectName: "Viber Shopping Bot",
    url: "https://shopping-bot.example.com",
    score: 85,
    format: "web" as const,
    createdAt: "2024-03-10 14:30",
  },
  {
    id: "r2",
    scanId: "2",
    projectName: "Viber Support App",
    url: "https://support-app.example.com",
    score: 62,
    format: "pdf" as const,
    createdAt: "2024-03-09 10:15",
  },
  {
    id: "r3",
    scanId: "3",
    projectName: "Viber Mini Game",
    url: "https://mini-game.example.com",
    score: 91,
    format: "web" as const,
    createdAt: "2024-03-07 16:45",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">View and download your scan reports</p>
      </div>

      {/* Report List */}
      <div className="space-y-3">
        {demoReports.map((report, i) => (
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
                      <h3 className="font-medium text-foreground">{report.projectName}</h3>
                      <Badge variant="outline" className="text-xs">
                        {report.format.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.createdAt}
                      </span>
                      <span>{report.url}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(report.score) }}
                  >
                    {report.score}
                  </span>
                  <div className="flex gap-1">
                    <Link href={`/scan/${report.scanId}`}>
                      <Button variant="ghost" size="icon-sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon-sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
