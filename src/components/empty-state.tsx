"use client";

import { motion } from "framer-motion";
import { Github, Sparkles, Star, Zap } from "lucide-react";

const examples = [
  "vercel/next.js",
  "facebook/react",
  "tailwindlabs/tailwindcss",
];

interface EmptyStateProps {
  onExample: (url: string) => void;
}

export function EmptyState({ onExample }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <Sparkles className="size-8 text-primary" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">Analyze your repository</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        Paste any public GitHub URL to get a RepoPulse score, actionable improvements, and
        ready-to-copy README upgrades.
      </p>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Star, label: "Star potential", desc: "Optimize discoverability" },
          { icon: Zap, label: "Instant insights", desc: "11 scoring categories" },
          { icon: Github, label: "Public API only", desc: "No backend required" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="rounded-xl border border-border bg-card/50 p-4"
          >
            <item.icon className="mb-2 size-5 text-primary" />
            <p className="font-medium text-sm">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="mb-3 text-sm text-muted-foreground">Try an example:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onExample(ex)}
            className="rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {ex}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
