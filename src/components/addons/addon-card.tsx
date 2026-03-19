"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

interface AddonCardProps {
  slug: string;
  name: string;
  description: string | null;
  category: string;
  pricingMonthly: number | null;
  pricingPerUse: number | null;
  creditsIncluded: number | null;
  features: { checks?: string[] } | null;
  isBundle?: boolean;
  onSubscribe: (slug: string) => void;
  onTryScan: (slug: string) => void;
  loading?: boolean;
}

const categoryIcons: Record<string, string> = {
  security: "🔒",
  seo: "📊",
  performance: "⚡",
  accessibility: "♿",
  code_quality: "💻",
  cross_browser: "📱",
  uptime: "📡",
  ai_fix: "🤖",
  report: "📄",
  bundle: "🔥",
};

export function AddonCard({
  slug,
  name,
  description,
  category,
  pricingMonthly,
  pricingPerUse,
  creditsIncluded,
  features,
  isBundle,
  onSubscribe,
  onTryScan,
  loading,
}: AddonCardProps) {
  const icon = categoryIcons[category] ?? "📦";
  const checks = (features as { checks?: string[] })?.checks ?? [];

  return (
    <Card
      className={`transition-all hover:shadow-lg ${
        isBundle ? "border-primary/50 bg-primary/5" : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="font-semibold text-foreground">{name}</h3>
          </div>
          {isBundle && (
            <Badge className="bg-primary text-primary-foreground">
              BEST VALUE
            </Badge>
          )}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">{description}</p>

        {checks.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {checks.slice(0, 4).map((check) => (
              <li
                key={check}
                className="flex items-center gap-2 text-sm text-foreground/80"
              >
                <Check className="h-3.5 w-3.5 text-primary" />
                {check.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        )}

        <div className="mb-4 space-y-1 text-sm">
          {pricingMonthly != null && (
            <div className="font-medium text-foreground">
              ฿{(pricingMonthly / 100).toFixed(0)}/mo
              {creditsIncluded ? ` (${creditsIncluded} scans)` : ""}
            </div>
          )}
          {pricingPerUse != null && (
            <div className="text-muted-foreground">
              or ฿{(pricingPerUse / 100).toFixed(2)}/scan
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onSubscribe(slug)}
            disabled={loading}
            className="flex-1"
          >
            <Zap className="mr-1.5 h-3.5 w-3.5" />
            Subscribe
          </Button>
          {pricingPerUse != null && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onTryScan(slug)}
              disabled={loading}
            >
              Try 1 Scan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
