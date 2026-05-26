export interface RepoSlug {
  owner: string;
  repo: string;
}

export interface GitHubLicense {
  spdx_id: string;
  name: string;
}

export interface GitHubRepoData {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  license: GitHubLicense | null;
  topics: string[];
  homepage: string | null;
  html_url: string;
  default_branch: string;
  open_issues_count: number;
  pushed_at: string;
  language: string | null;
  has_issues: boolean;
  has_wiki: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface ScoreCategory {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  weight: number;
  feedback: string;
  status: "excellent" | "good" | "fair" | "poor";
}

export interface AnalysisResult {
  overallScore: number;
  categories: ScoreCategory[];
  strengths: string[];
  improvements: string[];
  priorityChecklist: { task: string; priority: "high" | "medium" | "low" }[];
  suggestedTopics: string[];
  suggestedDescription: string;
  suggestedReadmeSections: string[];
  suggestedBadges: string[];
  readmeUpgrade: string;
  fixesMarkdown: string;
  reportMarkdown: string;
}

export interface FetchResult {
  repo: GitHubRepoData;
  readme: string;
  rateLimitRemaining: number | null;
  rateLimitReset: number | null;
}
