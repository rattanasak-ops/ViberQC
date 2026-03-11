"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  TestTube,
  Zap,
  Shield,
  Eye,
  Search,
  Activity,
  GitBranch,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Smartphone,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TOOLS,
  TOOL_CATEGORIES,
  type Tool,
  type ToolCategory,
  getToolsByCategory,
} from "@/data/tools";

// Map icon string names to Lucide components
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  TestTube,
  Zap,
  Shield,
  Eye,
  Search,
  Activity,
  GitBranch,
  Terminal,
  Smartphone,
  Globe,
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.35,
      ease: "easeOut" as const,
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export function ToolsTab() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback(async (id: string, command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  // Filter tools
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Get category info helper
  const getCategoryInfo = (categoryId: ToolCategory) =>
    TOOL_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Tools Catalog
          </h2>
          <p className="text-sm text-white/60">
            {filteredTools.length} of {TOOLS.length} tools
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            placeholder="Search tools by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-white/10 bg-[#1A1147] pl-10 text-white placeholder:text-white/40 focus-visible:border-[#6C63FF] focus-visible:ring-[#6C63FF]/30"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/25"
              : "bg-[#1A1147] text-white/60 hover:bg-[#1A1147]/80 hover:text-white/80"
          }`}
        >
          <Globe className="size-4" />
          All
          <span
            className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
              selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white/50"
            }`}
          >
            {TOOLS.length}
          </span>
        </button>

        {TOOL_CATEGORIES.map((category) => {
          const IconComponent = CATEGORY_ICONS[category.icon];
          const count = getToolsByCategory(category.id).length;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "text-white shadow-lg"
                  : "bg-[#1A1147] text-white/60 hover:bg-[#1A1147]/80 hover:text-white/80"
              }`}
              style={
                selectedCategory === category.id
                  ? {
                      backgroundColor: category.color,
                      boxShadow: `0 10px 25px -5px ${category.color}40`,
                    }
                  : undefined
              }
            >
              {IconComponent && <IconComponent className="size-4" />}
              {category.name}
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                  selectedCategory === category.id
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool, index) => {
            const categoryInfo = getCategoryInfo(tool.category);

            return (
              <motion.div
                key={tool.id}
                layout
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="h-full border-white/5 bg-[#1A1147] transition-all hover:border-[#6C63FF]/30 hover:shadow-lg hover:shadow-[#6C63FF]/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-bold text-white">
                        {tool.name}
                      </CardTitle>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {tool.free && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0"
                          >
                            Free
                          </Badge>
                        )}
                        {tool.cursorCompatible && (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/10 text-green-400 text-[10px] px-1.5 py-0"
                          >
                            <Check className="mr-0.5 size-2.5" />
                            Cursor
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                    {/* Description */}
                    <p className="text-sm leading-relaxed text-white/60">
                      {tool.description}
                    </p>

                    {/* Category Badge */}
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${categoryInfo?.color}15`,
                          color: categoryInfo?.color,
                        }}
                      >
                        {categoryInfo &&
                          CATEGORY_ICONS[categoryInfo.icon] &&
                          (() => {
                            const Icon = CATEGORY_ICONS[categoryInfo.icon];
                            return <Icon className="size-3" />;
                          })()}
                        {categoryInfo?.name}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* VS Code Extension */}
                    {tool.vscodeExtension && (
                      <div className="flex items-center gap-1.5 text-xs text-purple-400/80">
                        <Monitor className="size-3" />
                        <span>VS Code: {tool.vscodeExtension}</span>
                      </div>
                    )}

                    {/* Install Command */}
                    {tool.installCommand && (
                      <div className="mt-auto flex items-center gap-2 rounded-lg bg-black/30 px-3 py-2">
                        <Terminal className="size-3.5 shrink-0 text-[#6C63FF]" />
                        <code className="flex-1 truncate text-xs text-white/70">
                          {tool.installCommand}
                        </code>
                        <button
                          onClick={() => handleCopy(tool.id, tool.installCommand!)}
                          className="shrink-0 rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                          title="Copy install command"
                        >
                          {copiedId === tool.id ? (
                            <Check className="size-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Copy toast feedback */}
                    <AnimatePresence>
                      {copiedId === tool.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-center text-xs font-medium text-emerald-400"
                        >
                          Copied to clipboard!
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Visit Website */}
                    <div className="mt-auto pt-1">
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-white/10 bg-transparent text-white/70 hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/10 hover:text-white"
                        >
                          <ExternalLink className="mr-1.5 size-3.5" />
                          Visit Website
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-3 rounded-xl bg-[#1A1147] py-16"
        >
          <Search className="size-10 text-white/20" />
          <p className="text-lg font-medium text-white/40">No tools found</p>
          <p className="text-sm text-white/30">
            Try a different search term or category
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-white/10 text-white/60"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
