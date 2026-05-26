"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RateLimitBannerProps {
  remaining: number | null;
  reset: number | null;
}

export function RateLimitBanner({ remaining, reset }: RateLimitBannerProps) {
  if (remaining === null) return null;

  const isLow = remaining <= 10;
  if (!isLow) return null;

  const resetTime = reset
    ? new Date(reset).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "soon";

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-amber-200">GitHub API rate limit low</span>
          <Badge variant="warning">{remaining} requests left</Badge>
        </div>
        <p className="text-muted-foreground">
          Unauthenticated API allows 60 requests/hour. Resets around {resetTime}. For higher
          limits, set{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            NEXT_PUBLIC_GITHUB_TOKEN
          </code>{" "}
          in your environment.
        </p>
      </div>
    </div>
  );
}
