"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Globe, ExternalLink, MoreVertical } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getScoreColor } from "@/config/theme";

// Demo data
const demoProjects = [
  {
    id: "1",
    name: "Viber Shopping Bot",
    url: "https://shopping-bot.example.com",
    lastScore: 85,
    lastScan: "2 hours ago",
    totalScans: 5,
  },
  {
    id: "2",
    name: "Viber Support App",
    url: "https://support-app.example.com",
    lastScore: 62,
    lastScan: "1 day ago",
    totalScans: 3,
  },
  {
    id: "3",
    name: "Viber Mini Game",
    url: "https://mini-game.example.com",
    lastScore: 91,
    lastScan: "3 days ago",
    totalScans: 8,
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage your Viber Apps</p>
        </div>
        <Link href="/scan" className={cn(buttonVariants(), "h-9")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Link>
      </div>

      {/* Project Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/scan/${project.id}`}>
              <Card className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          {project.url}
                          <ExternalLink className="h-3 w-3" />
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        color: getScoreColor(project.lastScore),
                        backgroundColor: `${getScoreColor(project.lastScore)}15`,
                      }}
                    >
                      {project.lastScore}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last scan: {project.lastScan}</span>
                    <span>{project.totalScans} scans</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
