"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitFork, Star } from "lucide-react";
import type { AnalysisResult, GitHubRepoData } from "@/types/repo";
import { ScoreRing } from "@/components/score-ring";
import { Badge } from "@/components/ui/badge";

interface ShareCardProps {
  repo: GitHubRepoData;
  analysis: AnalysisResult;
}

export function ShareCard({ repo, analysis }: ShareCardProps) {
  const topStrengths = analysis.strengths.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-lg"
    >
      <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <ScoreRing score={analysis.overallScore} size={120} />
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              RepoPulse Report
            </p>
            <h3 className="text-xl font-bold">{repo.full_name}</h3>
            {repo.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {repo.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-4 text-amber-400" />
              {repo.stargazers_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="size-4" />
              {repo.forks_count.toLocaleString()}
            </span>
            {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
          </div>
          {topStrengths.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topStrengths.map((s) => (
                <Badge key={s} variant="success" className="max-w-[200px] truncate">
                  {s.split(":")[0]}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View repo <ExternalLink className="size-3.5" />
        </a>
      </div>
      <p className="relative mt-4 text-center text-xs text-muted-foreground">
        Analyzed with RepoPulse — Improve your README & discoverability
      </p>
    </motion.div>
  );
}
