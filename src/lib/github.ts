import type { FetchResult, GitHubRepoData, RepoSlug } from "@/types/repo";

const GITHUB_API = "https://api.github.com";

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public rateLimitRemaining?: number | null,
    public rateLimitReset?: number | null,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export function parseRepoUrl(input: string): RepoSlug | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const patterns = [
    /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?(?:\.git)?(?:[#?].*)?$/i,
    /^github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?(?:\.git)?$/i,
    /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\.git$/i, "");
      if (owner && repo) return { owner, repo };
    }
  }

  return null;
}

function parseRateLimitHeaders(headers: Headers) {
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");
  return {
    rateLimitRemaining: remaining ? Number(remaining) : null,
    rateLimitReset: reset ? Number(reset) * 1000 : null,
  };
}

function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function githubFetch<T>(
  path: string,
  token?: string,
): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: authHeaders(token),
    next: { revalidate: 0 },
  });

  const { rateLimitRemaining, rateLimitReset } = parseRateLimitHeaders(res.headers);

  if (!res.ok) {
    let message = `GitHub API error (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }

    if (res.status === 404) {
      message = "Repository not found. Check the URL and ensure the repo is public.";
    }
    if (res.status === 403 && rateLimitRemaining === 0) {
      message = "GitHub API rate limit exceeded. Try again later or add a token.";
    }

    throw new GitHubApiError(message, res.status, rateLimitRemaining, rateLimitReset);
  }

  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}

export async function fetchRepository(
  slug: RepoSlug,
  token?: string,
): Promise<FetchResult> {
  const { owner, repo } = slug;

  const { data: repoData, headers } = await githubFetch<GitHubRepoData>(
    `/repos/${owner}/${repo}`,
    token,
  );
  const { rateLimitRemaining, rateLimitReset } = parseRateLimitHeaders(headers);

  let readme = "";
  try {
    const readmeRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/readme`,
      {
        headers: {
          ...authHeaders(token),
          Accept: "application/vnd.github.raw",
        },
        next: { revalidate: 0 },
      },
    );
    if (readmeRes.ok) {
      readme = await readmeRes.text();
    }
  } catch {
    readme = "";
  }

  return {
    repo: repoData,
    readme,
    rateLimitRemaining,
    rateLimitReset,
  };
}
