"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Github, Loader2, Search } from "lucide-react";
import { parseRepoUrl } from "@/lib/github";
import type { AnalysisResult, FetchResult } from "@/types/repo";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { EmptyState } from "@/components/empty-state";
import { RateLimitBanner } from "@/components/rate-limit-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RepoAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FetchResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (input: string) => {
    setError(null);
    setData(null);
    setAnalysis(null);

    const slug = parseRepoUrl(input);
    if (!slug) {
      setError(
        "Invalid repository URL. Use formats like owner/repo or https://github.com/owner/repo",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(input.trim())}`);
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Failed to analyze repository");
        return;
      }

      const { analysis: analyzed, ...result } = body;
      setData(result);
      setAnalysis(analyzed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyze(url);
  };

  const handleExample = (example: string) => {
    setUrl(example);
    analyze(example);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Github className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="https://github.com/owner/repo or owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10"
            disabled={loading}
            aria-label="GitHub repository URL"
          />
        </div>
        <Button type="submit" disabled={loading || !url.trim()} className="sm:min-w-[140px]">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Search className="size-4" />
              Analyze
            </>
          )}
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {data && (
        <RateLimitBanner
          remaining={data.rateLimitRemaining}
          reset={data.rateLimitReset}
        />
      )}

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <Loader2 className="mb-4 size-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Fetching repository data from GitHub…</p>
          </motion.div>
        )}

        {!loading && analysis && data && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AnalysisDashboard data={data} analysis={analysis} />
          </motion.div>
        )}

        {!loading && !analysis && !error && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState onExample={handleExample} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
