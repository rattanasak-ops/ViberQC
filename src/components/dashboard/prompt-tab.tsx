"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Check,
  Code,
  Wrench,
  Eye,
  Zap,
  Sparkles,
  Terminal,
  FileCode,
  ClipboardCopy,
} from "lucide-react";

import {
  PROMPT_TEMPLATES,
  PROMPT_CATEGORIES,
  fillPromptTemplate,
  type PromptTemplate,
  type PromptCategory,
} from "@/data/prompts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Icon map for categories
// ---------------------------------------------------------------------------
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Search,
  Wrench,
  Code,
  Eye,
  Zap,
};

function getCategoryIcon(iconName: string) {
  return CATEGORY_ICONS[iconName] ?? Sparkles;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extractVariablePlaceholders(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

/** Render template text with variable placeholders highlighted */
function HighlightedTemplate({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\{[^}]+\}$/.test(part) ? (
          <span
            key={i}
            className="rounded bg-primary/20 px-1 font-semibold text-primary"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Category filter pills */
function CategoryFilters({
  active,
  onSelect,
}: {
  active: PromptCategory | null;
  onSelect: (cat: PromptCategory | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={active === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
      >
        <Sparkles className="mr-1 size-3.5" />
        All
      </Button>
      {PROMPT_CATEGORIES.map((cat) => {
        const Icon = getCategoryIcon(cat.icon);
        return (
          <Button
            key={cat.id}
            variant={active === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(cat.id)}
            style={
              active === cat.id ? { backgroundColor: cat.color } : undefined
            }
          >
            <Icon className="mr-1 size-3.5" />
            {cat.name}
          </Button>
        );
      })}
    </div>
  );
}

/** Single prompt template card in the list */
function PromptListItem({
  prompt,
  isSelected,
  onSelect,
}: {
  prompt: PromptTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const cat = PROMPT_CATEGORIES.find((c) => c.id === prompt.category);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onSelect}
        className={`w-full rounded-lg border p-3 text-left transition-all ${
          isSelected
            ? "border-primary bg-primary/10 ring-1 ring-primary/40"
            : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
        }`}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="font-medium text-foreground">{prompt.name}</span>
          {cat && (
            <Badge
              variant="secondary"
              className="text-[10px]"
              style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
            >
              {cat.name}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{prompt.nameTh}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
          {prompt.description}
        </p>
        {prompt.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {prompt.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </button>
    </motion.div>
  );
}

/** Right-side panel: preview + variable form */
function PromptPreview({ prompt }: { prompt: PromptTemplate }) {
  const variables = extractVariablePlaceholders(prompt.template);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const filledTemplate = useMemo(
    () => fillPromptTemplate(prompt.template, values),
    [prompt.template, values],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(filledTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = filledTemplate;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [filledTemplate]);

  const cat = PROMPT_CATEGORIES.find((c) => c.id === prompt.category);

  return (
    <motion.div
      key={prompt.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <FileCode className="size-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {prompt.name}
          </h3>
          {cat && (
            <Badge
              variant="secondary"
              style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
            >
              {cat.name}
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{prompt.nameTh}</p>
        <p className="mt-1 text-sm text-muted-foreground/80">
          {prompt.description}
        </p>
      </div>

      {/* Variable form */}
      {variables.length > 0 && (
        <Card className="border-border/50 bg-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Terminal className="mr-1.5 inline size-4 text-primary" />
              Variables ({variables.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {variables.map((v) => (
              <div key={v} className="flex flex-col gap-1">
                <label
                  htmlFor={`var-${v}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {v}
                </label>
                <Input
                  id={`var-${v}`}
                  placeholder={`Enter ${v}...`}
                  value={values[v] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [v]: e.target.value }))
                  }
                  className="h-8 bg-background/50 text-sm"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Template preview */}
      <div className="relative">
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border/50 bg-muted/60 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Code className="size-3.5" />
            Prompt Template
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {prompt.template.length} chars
          </span>
        </div>
        <div className="max-h-[400px] overflow-auto rounded-b-lg border border-border/50 bg-muted/30 p-4 font-mono text-xs leading-relaxed text-foreground/90">
          <HighlightedTemplate text={filledTemplate} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleCopy} size="lg" className="gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check className="size-4 text-green-400" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <ClipboardCopy className="size-4" />
                Fill & Copy
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        <Button variant="outline" size="lg" className="gap-2" disabled>
          <Terminal className="size-4" />
          Open in Cursor
          <Badge variant="secondary" className="ml-1 text-[10px]">
            Soon
          </Badge>
        </Button>
      </div>

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PromptTab() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PromptCategory | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    PROMPT_TEMPLATES[0]?.id ?? null,
  );

  // Filtered templates
  const filtered = useMemo(() => {
    let list = PROMPT_TEMPLATES;
    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameTh.includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }
    return list;
  }, [categoryFilter, search]);

  const selectedPrompt = useMemo(
    () => PROMPT_TEMPLATES.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  // Stats
  const stats = useMemo(() => {
    const perCategory: Record<string, number> = {};
    for (const p of PROMPT_TEMPLATES) {
      perCategory[p.category] = (perCategory[p.category] ?? 0) + 1;
    }
    return { total: PROMPT_TEMPLATES.length, perCategory };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {stats.total} Prompts
          </span>
        </div>
        {PROMPT_CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <div
              key={cat.id}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Icon className="size-3.5" style={{ color: cat.color }} />
              <span>
                {cat.nameTh}: {stats.perCategory[cat.id] ?? 0}
              </span>
            </div>
          );
        })}
      </div>

      {/* Search + category filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 bg-muted/40"
          />
        </div>
        <CategoryFilters active={categoryFilter} onSelect={setCategoryFilter} />
      </div>

      {/* Two-panel layout (stacked on mobile) */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: template list */}
        <div className="flex max-h-[calc(100vh-320px)] flex-col gap-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-280px)]">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((prompt) => (
                <PromptListItem
                  key={prompt.id}
                  prompt={prompt}
                  isSelected={selectedId === prompt.id}
                  onSelect={() => setSelectedId(prompt.id)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 py-12 text-muted-foreground"
              >
                <Search className="size-8 opacity-40" />
                <p className="text-sm">No prompts found</p>
                <p className="text-xs">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: preview panel */}
        <div className="min-w-0">
          {selectedPrompt ? (
            <PromptPreview prompt={selectedPrompt} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/50 py-20 text-muted-foreground">
              <FileCode className="size-10 opacity-30" />
              <p className="text-sm">Select a prompt template</p>
              <p className="text-xs">
                Choose from the list to preview and customize
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
