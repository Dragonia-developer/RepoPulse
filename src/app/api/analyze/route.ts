import { NextRequest, NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/analyzer";
import { fetchRepository, parseRepoUrl } from "@/lib/github";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  let slug = parseRepoUrl(url);
  if (!slug && owner && repo) {
    slug = { owner, repo };
  }

  if (!slug) {
    return NextResponse.json(
      { error: "Invalid repository URL. Use owner/repo or a full GitHub URL." },
      { status: 400 },
    );
  }

  try {
    const token = process.env.GITHUB_TOKEN ?? process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const result = await fetchRepository(slug, token);
    const analysis = analyzeRepository(result.repo, result.readme);

    return NextResponse.json({
      ...result,
      analysis,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to analyze repository";
    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 500;

    return NextResponse.json(
      {
        error: message,
        rateLimitRemaining:
          err && typeof err === "object" && "rateLimitRemaining" in err
            ? (err as { rateLimitRemaining: number | null }).rateLimitRemaining
            : null,
        rateLimitReset:
          err && typeof err === "object" && "rateLimitReset" in err
            ? (err as { rateLimitReset: number | null }).rateLimitReset
            : null,
      },
      { status },
    );
  }
}
