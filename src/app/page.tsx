import { RepoAnalyzer } from "@/components/repo-analyzer";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEMO_URL } from "@/lib/site";
import { ExternalLink } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="mb-12 text-center">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">Open Source · No Backend Required</Badge>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(badgeVariants({ variant: "outline" }), "hover:bg-accent")}
          >
            Deployed on Vercel
          </a>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Make your repo{" "}
          <span className="bg-gradient-to-r from-primary via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            impossible to ignore
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          RepoPulse analyzes any public GitHub repository and scores README quality,
          discoverability, demo visibility, and star potential — with actionable fixes you
          can copy in one click.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              Open Live Demo
            </a>
          </Button>
        </div>
      </section>

      <RepoAnalyzer />
    </div>
  );
}
