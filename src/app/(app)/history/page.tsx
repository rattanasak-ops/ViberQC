"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { getScoreColor } from "@/config/theme";

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-green-500", label: "Completed" },
  failed: { icon: XCircle, color: "text-red-500", label: "Failed" },
  running: { icon: Loader2, color: "text-blue-500", label: "Running" },
  pending: { icon: Clock, color: "text-yellow-500", label: "Pending" },
} as const;

const demoHistory = [
  {
    id: "s1",
    projectName: "Viber Shopping Bot",
    url: "https://shopping-bot.example.com",
    status: "completed" as const,
    score: 85,
    duration: "28.4s",
    createdAt: "2024-03-10 14:30",
  },
  {
    id: "s2",
    projectName: "Viber Support App",
    url: "https://support-app.example.com",
    status: "completed" as const,
    score: 62,
    duration: "32.1s",
    createdAt: "2024-03-09 10:15",
  },
  {
    id: "s3",
    projectName: "Viber Mini Game",
    url: "https://mini-game.example.com",
    status: "completed" as const,
    score: 91,
    duration: "24.7s",
    createdAt: "2024-03-07 16:45",
  },
  {
    id: "s4",
    projectName: "Viber Shopping Bot",
    url: "https://shopping-bot.example.com",
    status: "failed" as const,
    score: null,
    duration: "5.2s",
    createdAt: "2024-03-06 09:20",
  },
  {
    id: "s5",
    projectName: "Viber Support App",
    url: "https://support-app.example.com",
    status: "completed" as const,
    score: 58,
    duration: "31.5s",
    createdAt: "2024-03-05 11:00",
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
        <p className="text-sm text-muted-foreground">All your past scans</p>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {demoHistory.map((scan, i) => {
          const statusCfg = statusConfig[scan.status];
          const StatusIcon = statusCfg.icon;

          return (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={scan.status === "completed" ? `/scan/${scan.id}` : "#"}>
                <Card className="cursor-pointer transition-all hover:border-primary/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <StatusIcon className={`h-5 w-5 ${statusCfg.color}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{scan.projectName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {scan.url}
                          </span>
                          <span>{scan.duration}</span>
                          <span>{scan.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {scan.score !== null && (
                      <span
                        className="text-lg font-bold"
                        style={{ color: getScoreColor(scan.score) }}
                      >
                        {scan.score}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
