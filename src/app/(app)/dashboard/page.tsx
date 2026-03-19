"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const TabSkeleton = () => (
  <div className="space-y-4 pt-4">
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-48 w-full rounded-xl" />
  </div>
);

const OverviewTab = dynamic(
  () =>
    import("@/components/dashboard/overview-tab").then((m) => ({
      default: m.OverviewTab,
    })),
  { loading: TabSkeleton },
);
const ChecklistTab = dynamic(
  () =>
    import("@/components/dashboard/checklist-tab").then((m) => ({
      default: m.ChecklistTab,
    })),
  { loading: TabSkeleton },
);
const ToolsTab = dynamic(
  () =>
    import("@/components/dashboard/tools-tab").then((m) => ({
      default: m.ToolsTab,
    })),
  { loading: TabSkeleton },
);
const PromptTab = dynamic(
  () =>
    import("@/components/dashboard/prompt-tab").then((m) => ({
      default: m.PromptTab,
    })),
  { loading: TabSkeleton },
);
const SettingsTab = dynamic(
  () =>
    import("@/components/dashboard/settings-tab").then((m) => ({
      default: m.SettingsTab,
    })),
  { loading: TabSkeleton },
);
import {
  LayoutDashboard,
  ListChecks,
  Wrench,
  Sparkles,
  Settings,
  Zap,
} from "lucide-react";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    labelTh: "ภาพรวม",
    icon: LayoutDashboard,
    color: "#6C63FF",
  },
  {
    id: "checklist",
    label: "Checklist",
    labelTh: "รายการตรวจสอบ",
    icon: ListChecks,
    color: "#22C55E",
  },
  {
    id: "tools",
    label: "Tools",
    labelTh: "เครื่องมือ",
    icon: Wrench,
    color: "#FFB800",
  },
  {
    id: "prompts",
    label: "AI Prompts",
    labelTh: "AI Prompts",
    icon: Sparkles,
    color: "#8D83FF",
  },
  {
    id: "settings",
    label: "Settings",
    labelTh: "ตั้งค่า",
    icon: Settings,
    color: "#84CC16",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              360° QC Dashboard
            </h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <Zap className="mr-1 inline h-3 w-3" />
              AI-Powered
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            ระบบตรวจสอบคุณภาพ 360° สำหรับ Web & Viber Apps
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-border/50 bg-muted/30 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                )}
              >
                <Icon
                  className="h-4 w-4"
                  style={{ color: isActive ? tab.color : undefined }}
                />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-primary/20"
                    layoutId="activeTab"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "checklist" && <ChecklistTab />}
          {activeTab === "tools" && <ToolsTab />}
          {activeTab === "prompts" && <PromptTab />}
          {activeTab === "settings" && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
