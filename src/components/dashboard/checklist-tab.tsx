"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  Download,
  RotateCcw,
  ClipboardList,
  Code,
  TestTube,
  Zap,
  Shield,
  Eye,
  Search as SearchIcon,
  Rocket,
  AlertTriangle,
  CheckCheck,
} from "lucide-react";

import {
  PHASES,
  CHECKLIST_ITEMS,
  getPhaseItems,
  type ChecklistItem,
  type ChecklistPhase,
} from "@/data/checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ============================================================
// Constants & Helpers
// ============================================================

const PHASE_ICONS: Record<string, React.ElementType> = {
  ClipboardList,
  Code,
  TestTube,
  Zap,
  Shield,
  Eye,
  Search: SearchIcon,
  Rocket,
};

const SEVERITY_CONFIG = {
  critical: {
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-500",
    label: "Critical",
  },
  high: {
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    dot: "bg-orange-500",
    label: "High",
  },
  medium: {
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dot: "bg-yellow-500",
    label: "Medium",
  },
  low: {
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    dot: "bg-green-500",
    label: "Low",
  },
} as const;

type SeverityFilter = "all" | ChecklistItem["severity"];

// ============================================================
// Sub-components
// ============================================================

function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-vqc-primary)" />
            <stop offset="100%" stopColor="var(--color-vqc-primary-light)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-foreground"
          key={percentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(percentage)}%
        </motion.span>
        <span className="text-xs text-muted-foreground">Completed</span>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: ChecklistItem["severity"] }) {
  const config = SEVERITY_CONFIG[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${config.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

function PhaseProgressBar({
  phase,
  checkedItems,
}: {
  phase: (typeof PHASES)[number];
  checkedItems: Set<string>;
}) {
  const items = getPhaseItems(phase.id);
  const checked = items.filter((item) => checkedItems.has(item.id)).length;
  const percentage = items.length > 0 ? (checked / items.length) * 100 : 0;
  const Icon = PHASE_ICONS[phase.icon] || ClipboardList;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${phase.color}20` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: phase.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center justify-between">
          <span className="truncate text-xs font-medium text-foreground">
            {phase.name}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            {checked}/{items.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: phase.color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function ChecklistItemRow({
  item,
  isChecked,
  isExpanded,
  onToggleCheck,
  onToggleExpand,
}: {
  item: ChecklistItem;
  isChecked: boolean;
  isExpanded: boolean;
  onToggleCheck: () => void;
  onToggleExpand: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className={`group rounded-xl border transition-colors ${
        isChecked
          ? "border-green-500/20 bg-green-500/5"
          : "border-border/50 bg-card/30 hover:bg-card/60"
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Checkbox */}
        <button
          onClick={onToggleCheck}
          className="mt-0.5 shrink-0 transition-transform hover:scale-110"
          aria-label={isChecked ? "Uncheck item" : "Check item"}
        >
          {isChecked ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1 text-left"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span
                className={`text-sm font-medium ${
                  isChecked
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {item.title}
              </span>
            </button>
          </div>

          <p className="ml-5 mt-0.5 text-xs text-muted-foreground">
            {item.titleTh}
          </p>

          {/* Badges row */}
          <div className="ml-5 mt-2 flex flex-wrap items-center gap-1.5">
            <SeverityBadge severity={item.severity} />
            {item.autoDetectable && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                <Zap className="h-3 w-3" />
                Auto
              </span>
            )}
            {item.tool && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                <Code className="h-3 w-3" />
                {item.tool}
              </span>
            )}
          </div>

          {/* Expanded description */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="ml-5 mt-2 rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Main Component
// ============================================================

export function ChecklistTab() {
  // State
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activePhase, setActivePhase] = useState<ChecklistPhase | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Handlers
  const toggleCheck = useCallback((id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const markAllInPhase = useCallback(
    (phase: ChecklistPhase) => {
      const items = getPhaseItems(phase);
      setCheckedItems((prev) => {
        const next = new Set(prev);
        items.forEach((item) => next.add(item.id));
        return next;
      });
    },
    []
  );

  const resetPhase = useCallback(
    (phase: ChecklistPhase) => {
      const items = getPhaseItems(phase);
      setCheckedItems((prev) => {
        const next = new Set(prev);
        items.forEach((item) => next.delete(item.id));
        return next;
      });
    },
    []
  );

  const exportAsJson = useCallback(() => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalItems: CHECKLIST_ITEMS.length,
      checkedCount: checkedItems.size,
      percentage: Math.round((checkedItems.size / CHECKLIST_ITEMS.length) * 100),
      phases: PHASES.map((phase) => {
        const items = getPhaseItems(phase.id);
        const checked = items.filter((item) => checkedItems.has(item.id));
        return {
          phase: phase.id,
          name: phase.name,
          total: items.length,
          checked: checked.length,
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            checked: checkedItems.has(item.id),
          })),
        };
      }),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viberqc-checklist-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [checkedItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    let items = CHECKLIST_ITEMS;

    if (activePhase !== "all") {
      items = items.filter((item) => item.phase === activePhase);
    }

    if (severityFilter !== "all") {
      items = items.filter((item) => item.severity === severityFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.titleTh.includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.tool && item.tool.toLowerCase().includes(query))
      );
    }

    return items;
  }, [activePhase, severityFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const checked = checkedItems.size;
    const criticalRemaining = CHECKLIST_ITEMS.filter(
      (item) => item.severity === "critical" && !checkedItems.has(item.id)
    ).length;
    const autoDetectable = CHECKLIST_ITEMS.filter(
      (item) => item.autoDetectable
    ).length;

    return { total, checked, criticalRemaining, autoDetectable };
  }, [checkedItems]);

  const overallPercentage =
    stats.total > 0 ? (stats.checked / stats.total) * 100 : 0;

  // Group filtered items by phase
  const groupedItems = useMemo(() => {
    const groups: Record<ChecklistPhase, ChecklistItem[]> = {
      planning: [],
      development: [],
      functional: [],
      performance: [],
      security: [],
      accessibility: [],
      seo: [],
      deployment: [],
    };
    filteredItems.forEach((item) => {
      groups[item.phase].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-2">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              {/* Circular gauge */}
              <CircularProgress percentage={overallPercentage} />

              {/* Stats grid */}
              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  QC Checklist Progress
                </h2>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <StatCard
                    label="Total Items"
                    value={stats.total}
                    icon={ClipboardList}
                    color="bg-primary/20 text-primary"
                  />
                  <StatCard
                    label="Completed"
                    value={stats.checked}
                    icon={CheckCheck}
                    color="bg-green-500/20 text-green-400"
                  />
                  <StatCard
                    label="Critical Left"
                    value={stats.criticalRemaining}
                    icon={AlertTriangle}
                    color="bg-red-500/20 text-red-400"
                  />
                  <StatCard
                    label="Auto-detect"
                    value={stats.autoDetectable}
                    icon={Zap}
                    color="bg-cyan-500/20 text-cyan-400"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Phase progress overview */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">
              Phase Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PHASES.map((phase) => (
                <PhaseProgressBar
                  key={phase.id}
                  phase={phase}
                  checkedItems={checkedItems}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search & Filters bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search checklist items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card/50 border-border/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsJson}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-2">
                {/* Phase filter */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Phase
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setActivePhase("all")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        activePhase === "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      All Phases
                    </button>
                    {PHASES.map((phase) => {
                      const Icon = PHASE_ICONS[phase.icon] || ClipboardList;
                      return (
                        <button
                          key={phase.id}
                          onClick={() => setActivePhase(phase.id)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            activePhase === phase.id
                              ? "text-primary-foreground"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                          }`}
                          style={
                            activePhase === phase.id
                              ? { backgroundColor: phase.color }
                              : undefined
                          }
                        >
                          <Icon className="h-3 w-3" />
                          {phase.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Severity filter */}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Severity
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      ["all", "critical", "high", "medium", "low"] as const
                    ).map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setSeverityFilter(sev)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          severityFilter === sev
                            ? sev === "all"
                              ? "bg-primary text-primary-foreground"
                              : `${SEVERITY_CONFIG[sev].color} border`
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {sev === "all" ? "All" : SEVERITY_CONFIG[sev].label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checklist items grouped by phase */}
      <div className="space-y-6">
        {PHASES.filter(
          (phase) =>
            activePhase === "all" || activePhase === phase.id
        ).map((phase) => {
          const items = groupedItems[phase.id];
          if (items.length === 0) return null;

          const Icon = PHASE_ICONS[phase.icon] || ClipboardList;
          const phaseChecked = items.filter((item) =>
            checkedItems.has(item.id)
          ).length;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${phase.color}20` }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: phase.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {phase.name}
                          <Badge variant="secondary" className="text-xs">
                            {phaseChecked}/{items.length}
                          </Badge>
                        </CardTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {phase.nameTh}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => markAllInPhase(phase.id)}
                        className="gap-1"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Mark All
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => resetPhase(phase.id)}
                        className="gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <ChecklistItemRow
                          key={item.id}
                          item={item}
                          isChecked={checkedItems.has(item.id)}
                          isExpanded={expandedItems.has(item.id)}
                          onToggleCheck={() => toggleCheck(item.id)}
                          onToggleExpand={() => toggleExpand(item.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-foreground">
            No items found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setActivePhase("all");
              setSeverityFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
