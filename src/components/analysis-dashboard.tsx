"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Copy,
  Download,
  FileText,
  Lightbulb,
  ListChecks,
  Tag,
  Wand2,
} from "lucide-react";
import type { AnalysisResult, FetchResult } from "@/types/repo";
import { ScoreRing } from "@/components/score-ring";
import { ShareCard } from "@/components/share-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { copyToClipboard, downloadMarkdown } from "@/lib/export";
import { cn } from "@/lib/utils";

interface AnalysisDashboardProps {
  data: FetchResult;
  analysis: AnalysisResult;
}

function CopyButton({
  label,
  text,
  variant = "outline",
}: {
  label: string;
  text: string;
  variant?: "default" | "outline" | "secondary";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant={variant} size="sm" onClick={handleCopy}>
      <Copy className="size-3.5" />
      {copied ? "Copied!" : label}
    </Button>
  );
}

const statusColors = {
  excellent: "text-emerald-400",
  good: "text-primary",
  fair: "text-amber-400",
  poor: "text-red-400",
};

export function AnalysisDashboard({ data, analysis }: AnalysisDashboardProps) {
  const { repo } = data;
  const pushed = new Date(repo.pushed_at).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <ShareCard repo={repo} analysis={analysis} />

      <div className="flex flex-wrap gap-2">
        <CopyButton label="Copy Fixes" text={analysis.fixesMarkdown} variant="default" />
        <CopyButton label="Generate README Upgrade" text={analysis.readmeUpgrade} />
        <CopyButton label="Copy Report" text={analysis.reportMarkdown} />
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            downloadMarkdown(
              `repopulse-${repo.full_name.replace("/", "-")}.md`,
              analysis.reportMarkdown,
            )
          }
        >
          <Download className="size-3.5" />
          Download Report
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="items-center text-center">
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Weighted across 11 categories</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <ScoreRing score={analysis.overallScore} />
            <div className="mt-6 grid w-full grid-cols-2 gap-3 text-center text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold">{repo.stargazers_count.toLocaleString()}</p>
                <p className="text-muted-foreground">Stars</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold">{repo.forks_count.toLocaleString()}</p>
                <p className="text-muted-foreground">Forks</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold">{repo.open_issues_count}</p>
                <p className="text-muted-foreground">Open Issues</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold truncate text-xs">{repo.license?.spdx_id ?? "—"}</p>
                <p className="text-muted-foreground">License</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Last push: {pushed}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>How your repository scores in each area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cat.label}</span>
                  <span className={cn("font-semibold tabular-nums", statusColors[cat.status])}>
                    {cat.score}
                  </span>
                </div>
                <Progress value={cat.score} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{cat.feedback}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-400" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.strengths.length ? (
              <ul className="space-y-2">
                {analysis.strengths.map((s) => (
                  <li key={s} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Keep building — strengths will appear as you improve.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 text-amber-400" />
              Missing Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.improvements.map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="size-5 text-primary" />
            Priority Checklist
          </CardTitle>
          <CardDescription>Focus on high-impact items first</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.priorityChecklist.map((item) => (
              <div
                key={item.task}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <Badge
                  variant={
                    item.priority === "high"
                      ? "danger"
                      : item.priority === "medium"
                        ? "warning"
                        : "secondary"
                  }
                  className="shrink-0 uppercase"
                >
                  {item.priority}
                </Badge>
                <span className="text-sm">{item.task}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="suggestions">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="readme">README Upgrade</TabsTrigger>
          <TabsTrigger value="topics">Topics & Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Better Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
                {analysis.suggestedDescription}
              </p>
              <div className="mt-3">
                <CopyButton label="Copy Description" text={analysis.suggestedDescription} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested README Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedReadmeSections.length ? (
                  analysis.suggestedReadmeSections.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your README covers the essential sections.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="size-5" />
                README Upgrade Blocks
              </CardTitle>
              <CardDescription>Copy and paste into your README.md</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-lg border border-border">
                <pre className="p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                  {analysis.readmeUpgrade || "Your README already includes the recommended sections."}
                </pre>
              </ScrollArea>
              <div className="mt-3">
                <CopyButton label="Copy README Blocks" text={analysis.readmeUpgrade} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="size-5" />
                Suggested GitHub Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedTopics.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              {repo.topics.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <p className="mb-2 text-sm text-muted-foreground">Current topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-lg border border-border">
                <pre className="p-4 text-xs whitespace-pre-wrap font-mono">
                  {analysis.suggestedBadges.join("\n")}
                </pre>
              </ScrollArea>
              <div className="mt-3">
                <CopyButton
                  label="Copy Badges"
                  text={analysis.suggestedBadges.join("\n")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
