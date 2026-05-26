import { RepoAnalyzer } from "@/components/repo-analyzer";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">
          Open Source · No Backend Required
        </Badge>
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
      </section>

      <RepoAnalyzer />
    </div>
  );
}
