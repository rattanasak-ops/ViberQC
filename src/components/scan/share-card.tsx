"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "./score-gauge";

interface ShareCardProps {
  url: string;
  score: number;
  shareUrl: string;
}

export function ShareCard({ url, score, shareUrl }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ScoreGauge score={score} size={80} animated={false} />
          <div>
            <p className="text-sm font-medium text-foreground">
              ViberQC Scan Result
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{url}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-3 w-3" />
          ) : (
            <Copy className="mr-2 h-3 w-3" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <Button size="sm">
          <Share2 className="mr-2 h-3 w-3" />
          Share
        </Button>
      </div>
    </div>
  );
}
