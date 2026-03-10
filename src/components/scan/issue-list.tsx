"use client";

import { AlertTriangle, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ScanIssue, IssueSeverity } from "@/types";
import { cn } from "@/lib/utils";

const severityConfig: Record<
  IssueSeverity,
  { icon: typeof AlertTriangle; color: string; bg: string; label: string }
> = {
  critical: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Critical" },
  high: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10", label: "High" },
  medium: { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Medium" },
  low: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", label: "Low" },
  info: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", label: "Info" },
};

interface IssueListProps {
  issues: ScanIssue[];
  maxItems?: number;
}

export function IssueList({ issues, maxItems }: IssueListProps) {
  const displayIssues = maxItems ? issues.slice(0, maxItems) : issues;

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <p className="mt-2 text-sm font-medium text-foreground">All checks passed!</p>
        <p className="text-xs text-muted-foreground">No issues found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayIssues.map((issue) => {
        const config = severityConfig[issue.severity];
        const Icon = config.icon;

        return (
          <Card key={issue.id} className="border-border/50">
            <CardContent className="flex items-start gap-3 p-4">
              <div className={cn("mt-0.5 rounded-md p-1.5", config.bg)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {issue.title}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {issue.phase}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {issue.description}
                </p>
                {issue.recommendation && (
                  <p className="mt-2 text-xs text-primary">
                    Fix: {issue.recommendation}
                  </p>
                )}
              </div>
              <Badge
                variant="secondary"
                className={cn("shrink-0 text-xs", config.color)}
              >
                {config.label}
              </Badge>
            </CardContent>
          </Card>
        );
      })}

      {maxItems && issues.length > maxItems && (
        <p className="py-2 text-center text-xs text-muted-foreground">
          +{issues.length - maxItems} more issues
        </p>
      )}
    </div>
  );
}
