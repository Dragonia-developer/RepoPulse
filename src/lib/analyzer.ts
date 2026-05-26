import type { AnalysisResult, GitHubRepoData, ScoreCategory } from "@/types/repo";

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

function hasSection(readme: string, patterns: RegExp[]): boolean {
  const lower = readme.toLowerCase();
  return patterns.some((p) => p.test(lower));
}

function countMatches(text: string, pattern: RegExp): number {
  return (text.match(pattern) || []).length;
}

function statusFromScore(score: number): ScoreCategory["status"] {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 40) return "fair";
  return "poor";
}

function inferLanguageTopics(language: string | null): string[] {
  const map: Record<string, string[]> = {
    TypeScript: ["typescript", "nodejs", "web"],
    JavaScript: ["javascript", "nodejs", "web"],
    Python: ["python", "pypi", "automation"],
    Go: ["golang", "backend", "cli"],
    Rust: ["rust", "systems-programming"],
    Java: ["java", "spring", "backend"],
    Kotlin: ["kotlin", "android"],
    Swift: ["swift", "ios"],
    Ruby: ["ruby", "rails"],
    PHP: ["php", "web"],
    "C#": ["csharp", "dotnet"],
    C: ["c", "systems"],
    "C++": ["cpp", "systems"],
    Shell: ["shell", "devops", "cli"],
    Dart: ["dart", "flutter"],
    Vue: ["vue", "frontend"],
  };
  return language ? map[language] ?? [language.toLowerCase()] : [];
}

function buildSuggestedTopics(
  repo: GitHubRepoData,
  readme: string,
): string[] {
  const existing = new Set(repo.topics.map((t) => t.toLowerCase()));
  const candidates = [
    ...inferLanguageTopics(repo.language),
    repo.language?.toLowerCase(),
    "open-source",
    "developer-tools",
    "github",
  ].filter(Boolean) as string[];

  const readmeLower = readme.toLowerCase();
  if (/react|next\.?js|vue|svelte|angular/i.test(readmeLower)) {
    candidates.push("frontend", "web");
  }
  if (/api|rest|graphql|backend/i.test(readmeLower)) {
    candidates.push("api", "backend");
  }
  if (/cli|command.?line|terminal/i.test(readmeLower)) {
    candidates.push("cli");
  }
  if (/machine.?learning|ai|llm|gpt/i.test(readmeLower)) {
    candidates.push("machine-learning", "ai");
  }
  if (/docker|kubernetes|devops|ci\//i.test(readmeLower)) {
    candidates.push("devops", "docker");
  }

  return [...new Set(candidates)]
    .filter((t) => !existing.has(t))
    .slice(0, 8);
}

function buildSuggestedDescription(repo: GitHubRepoData, readme: string): string {
  if (repo.description && repo.description.length >= 40) {
    return repo.description;
  }

  const firstParagraph = readme
    .replace(/^#.*$/m, "")
    .split("\n\n")
    .map((p) => p.replace(/[#*`\[\]]/g, "").trim())
    .find((p) => p.length > 30);

  const base = repo.description || firstParagraph || repo.name;
  const suffix =
    repo.language && !base.toLowerCase().includes(repo.language.toLowerCase())
      ? ` Built with ${repo.language}.`
      : "";

  const text = `${base}${suffix}`.slice(0, 160);
  return text.length < base.length + suffix.length ? `${text}…` : text;
}

function buildSuggestedBadges(repo: GitHubRepoData): string[] {
  const badges: string[] = [];
  const slug = repo.full_name;

  badges.push(`![GitHub stars](https://img.shields.io/github/stars/${slug}?style=for-the-badge)`);
  badges.push(`![GitHub forks](https://img.shields.io/github/forks/${slug}?style=for-the-badge)`);
  badges.push(`![GitHub issues](https://img.shields.io/github/issues/${slug}?style=for-the-badge)`);

  if (repo.license?.spdx_id) {
    badges.push(
      `![License](https://img.shields.io/github/license/${slug}?style=for-the-badge)`,
    );
  }
  if (repo.language) {
    badges.push(
      `![Language](https://img.shields.io/github/languages/top/${slug}?style=for-the-badge&color=6366f1)`,
    );
  }
  badges.push(
    `![Last commit](https://img.shields.io/github/last-commit/${slug}?style=for-the-badge)`,
  );

  return badges;
}

function buildReadmeUpgrade(repo: GitHubRepoData, readme: string): string {
  const name = repo.name;
  const demoUrl = repo.homepage || `https://github.com/${repo.full_name}#readme`;
  const installCmd =
    repo.language === "Python"
      ? "pip install package-name"
      : repo.language === "Rust"
        ? "cargo install package-name"
        : repo.language === "Go"
          ? "go install github.com/OWNER/REPO@latest"
          : "npm install package-name";

  const sections: string[] = [];

  if (!hasSection(readme, [/live demo|demo|preview|try it/i])) {
    sections.push(`## Live Demo

🔗 **[View Demo](${demoUrl})**

> Add a screenshot or GIF above this link for maximum impact.
`);
  }

  if (!hasSection(readme, [/## features|### features|key features/i])) {
    sections.push(`## Features

- ✨ **Core capability** — Describe your main value proposition
- 🚀 **Performance** — Highlight speed or efficiency wins
- 🛠️ **Developer experience** — Easy setup, great docs, extensible API
- 🔒 **Reliability** — Tests, CI, production-ready defaults
`);
  }

  if (!hasSection(readme, [/## install|### install|getting started/i])) {
    sections.push(`## Installation

\`\`\`bash
${installCmd.replace("package-name", name.toLowerCase()).replace("OWNER/REPO", repo.full_name)}
\`\`\`

### Prerequisites

- Node.js 18+ (or your runtime)
- Git
`);
  }

  if (!hasSection(readme, [/## usage|### usage|how to use/i])) {
    sections.push(`## Usage

\`\`\`bash
# Quick start
${name.toLowerCase()} --help
\`\`\`

\`\`\`${repo.language?.toLowerCase() === "python" ? "python" : "javascript"}
// Example usage
import { main } from '${name.toLowerCase()}';
await main();
\`\`\`
`);
  }

  if (!hasSection(readme, [/tech stack|built with|technologies/i]) && repo.language) {
    sections.push(`## Tech Stack

- **${repo.language}** — Primary language
- Add frameworks, databases, and infra here
`);
  }

  if (!hasSection(readme, [/roadmap|planned|upcoming/i])) {
    sections.push(`## Roadmap

- [ ] v1.0 — Core features stable
- [ ] v1.1 — Performance & polish
- [ ] v2.0 — Community-requested features

Contributions welcome — open an issue to discuss ideas.
`);
  }

  if (!hasSection(readme, [/contribut|pull request|code of conduct/i])) {
    sections.push(`## Contributing

Contributions are welcome! Please read our contributing guidelines before opening a PR.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing\`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
`);
  }

  return sections.join("\n");
}

function buildFixesMarkdown(result: Omit<AnalysisResult, "fixesMarkdown" | "reportMarkdown">): string {
  const lines: string[] = [
    "# RepoPulse Suggested Improvements",
    "",
    "## Priority Checklist",
    ...result.priorityChecklist.map(
      (item) => `- [${item.priority === "high" ? "x" : " "}] **${item.priority.toUpperCase()}** — ${item.task}`,
    ),
    "",
    "## Missing Improvements",
    ...result.improvements.map((i) => `- ${i}`),
    "",
    "## Suggested Description",
    "",
    result.suggestedDescription,
    "",
    "## Suggested Topics",
    "",
    result.suggestedTopics.map((t) => `\`${t}\``).join(" "),
    "",
    "## Suggested README Sections",
    "",
    ...result.suggestedReadmeSections.map((s) => `- ${s}`),
    "",
    "## Suggested Badges",
    "",
    ...result.suggestedBadges,
    "",
    "## README Upgrade Blocks",
    "",
    result.readmeUpgrade,
  ];
  return lines.join("\n");
}

function buildReportMarkdown(
  repo: GitHubRepoData,
  result: AnalysisResult,
): string {
  const pushed = new Date(repo.pushed_at).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

  return `# RepoPulse Report — ${repo.full_name}

**Overall Score:** ${result.overallScore}/100

| Metric | Value |
|--------|-------|
| Stars | ${repo.stargazers_count.toLocaleString()} |
| Forks | ${repo.forks_count.toLocaleString()} |
| Open Issues | ${repo.open_issues_count.toLocaleString()} |
| License | ${repo.license?.spdx_id ?? "None"} |
| Last Push | ${pushed} |
| Topics | ${repo.topics.length ? repo.topics.join(", ") : "None"} |

## Category Scores

${result.categories
  .map((c) => `- **${c.label}:** ${c.score}/${c.maxScore} — ${c.feedback}`)
  .join("\n")}

## Strengths

${result.strengths.map((s) => `- ${s}`).join("\n")}

## Improvements

${result.improvements.map((i) => `- ${i}`).join("\n")}

---

${result.fixesMarkdown}
`;
}

export function analyzeRepository(
  repo: GitHubRepoData,
  readme: string,
): AnalysisResult {
  const readmeLower = readme.toLowerCase();
  const readmeLen = readme.trim().length;
  const hasHomepage = Boolean(repo.homepage?.trim());
  const hasLicense = Boolean(repo.license);
  const topicCount = repo.topics.length;
  const descLen = (repo.description ?? "").length;

  const hasScreenshot =
    /!\[.*\]\(.*\.(png|jpg|jpeg|gif|webp|svg)/i.test(readme) ||
    /<img\s/i.test(readme);
  const hasBadges = /!\[.*\]\(https?:\/\/img\.shields\.io/i.test(readme);
  const hasInstall = hasSection(readme, [/## install|### install|getting started|npm install|pip install|cargo install/i]);
  const hasUsage = hasSection(readme, [/## usage|### usage|how to use|example/i]);
  const hasDemo = hasSection(readme, [/live demo|demo|preview|try it online/i]) || hasHomepage;
  const hasContributing = hasSection(readme, [/contribut|pull request|good first issue/i]);
  const hasFeatures = hasSection(readme, [/## features|### features/i]);

  const daysSincePush =
    (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24);

  const categories: ScoreCategory[] = [
    {
      id: "readme",
      label: "README Quality",
      maxScore: 100,
      score: clamp(
        (readmeLen > 500 ? 35 : readmeLen > 200 ? 25 : readmeLen > 50 ? 15 : 5) +
          (hasFeatures ? 20 : 0) +
          (readme.split("\n").length > 30 ? 15 : 10) +
          (countMatches(readme, /^##\s/gm) >= 4 ? 20 : countMatches(readme, /^##\s/gm) * 5) +
          (readme.includes("```") ? 10 : 0),
      ),
      weight: 14,
      feedback:
        readmeLen > 500
          ? "Solid README length with good structure."
          : "README is thin — expand with sections and examples.",
      status: "fair",
    },
    {
      id: "demo",
      label: "Demo Visibility",
      maxScore: 100,
      score: clamp(hasDemo ? (hasHomepage ? 95 : 75) : hasHomepage ? 60 : 15),
      weight: 10,
      feedback: hasDemo
        ? "Demo is visible to visitors."
        : "Add a Live Demo link or homepage URL.",
      status: "fair",
    },
    {
      id: "screenshot",
      label: "Screenshot Presence",
      maxScore: 100,
      score: clamp(hasScreenshot ? 95 : 10),
      weight: 9,
      feedback: hasScreenshot
        ? "Visual preview helps conversion."
        : "Add a screenshot or GIF near the top.",
      status: "fair",
    },
    {
      id: "install",
      label: "Installation Clarity",
      maxScore: 100,
      score: clamp(hasInstall ? 90 : 20),
      weight: 10,
      feedback: hasInstall
        ? "Installation steps are documented."
        : "Add a clear Installation section with commands.",
      status: "fair",
    },
    {
      id: "usage",
      label: "Usage Clarity",
      maxScore: 100,
      score: clamp(hasUsage ? 88 : 18),
      weight: 9,
      feedback: hasUsage
        ? "Usage examples help onboarding."
        : "Add code examples under a Usage section.",
      status: "fair",
    },
    {
      id: "license",
      label: "License Presence",
      maxScore: 100,
      score: clamp(hasLicense ? 100 : 0),
      weight: 8,
      feedback: hasLicense
        ? `Licensed under ${repo.license?.spdx_id}.`
        : "Add an open-source license (MIT recommended).",
      status: "fair",
    },
    {
      id: "topics",
      label: "Topics Quality",
      maxScore: 100,
      score: clamp(
        topicCount >= 5 ? 95 : topicCount >= 3 ? 75 : topicCount >= 1 ? 45 : 10,
      ),
      weight: 8,
      feedback:
        topicCount >= 3
          ? `${topicCount} topics help discoverability.`
          : "Add 3–5 relevant GitHub topics.",
      status: "fair",
    },
    {
      id: "description",
      label: "Description Quality",
      maxScore: 100,
      score: clamp(
        descLen >= 80 ? 95 : descLen >= 40 ? 70 : descLen >= 15 ? 40 : 5,
      ),
      weight: 8,
      feedback:
        descLen >= 40
          ? "Description communicates value."
          : "Write a compelling 1–2 sentence description.",
      status: "fair",
    },
    {
      id: "badges",
      label: "Badges Presence",
      maxScore: 100,
      score: clamp(hasBadges ? 92 : countMatches(readme, /!\[/) >= 2 ? 50 : 12),
      weight: 7,
      feedback: hasBadges
        ? "Badges build trust at a glance."
        : "Add shields.io badges for stars, license, CI.",
      status: "fair",
    },
    {
      id: "contributing",
      label: "Contribution Friendliness",
      maxScore: 100,
      score: clamp(
        (hasContributing ? 50 : 10) +
          (repo.has_issues ? 25 : 0) +
          (/good first issue|help wanted|contributing\.md/i.test(readmeLower) ? 25 : 0),
      ),
      weight: 8,
      feedback: hasContributing
        ? "Contributors know how to get started."
        : "Add CONTRIBUTING.md and issue templates.",
      status: "fair",
    },
    {
      id: "activity",
      label: "Project Activity",
      maxScore: 100,
      score: clamp(
        daysSincePush < 7 ? 100 : daysSincePush < 30 ? 85 : daysSincePush < 90 ? 60 : daysSincePush < 365 ? 35 : 15,
      ),
      weight: 9,
      feedback:
        daysSincePush < 30
          ? "Recently active — signals a healthy project."
          : `Last push was ${Math.floor(daysSincePush)} days ago.`,
      status: "fair",
    },
  ];

  categories.forEach((c) => {
    c.status = statusFromScore(c.score);
  });

  const totalWeight = categories.reduce((s, c) => s + c.weight, 0);
  const overallScore = Math.round(
    categories.reduce((s, c) => s + (c.score / c.maxScore) * 100 * (c.weight / totalWeight), 0),
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  categories.forEach((c) => {
    if (c.score >= 70) strengths.push(`${c.label}: ${c.feedback}`);
    else improvements.push(`${c.label}: ${c.feedback}`);
  });

  const suggestedReadmeSections: string[] = [];
  if (!hasSection(readme, [/live demo|demo/i])) suggestedReadmeSections.push("Live Demo");
  if (!hasFeatures) suggestedReadmeSections.push("Features");
  if (!hasInstall) suggestedReadmeSections.push("Installation");
  if (!hasUsage) suggestedReadmeSections.push("Usage");
  if (!hasSection(readme, [/tech stack|built with/i])) suggestedReadmeSections.push("Tech Stack");
  if (!hasSection(readme, [/roadmap/i])) suggestedReadmeSections.push("Roadmap");
  if (!hasContributing) suggestedReadmeSections.push("Contributing");

  const priorityChecklist: AnalysisResult["priorityChecklist"] = [];

  const addPriority = (
    condition: boolean,
    task: string,
    priority: "high" | "medium" | "low",
  ) => {
    if (condition) priorityChecklist.push({ task, priority });
  };

  addPriority(!hasScreenshot, "Add a hero screenshot or demo GIF to README", "high");
  addPriority(!hasDemo, "Link a live demo or set GitHub homepage URL", "high");
  addPriority(!hasInstall, "Document installation steps with copy-paste commands", "high");
  addPriority(!hasLicense, "Add a LICENSE file (MIT is popular)", "high");
  addPriority(topicCount < 3, "Add at least 3 GitHub topics for discoverability", "medium");
  addPriority(descLen < 40, "Improve repository description (80+ chars ideal)", "medium");
  addPriority(!hasBadges, "Add README badges (stars, license, build status)", "medium");
  addPriority(!hasUsage, "Add usage examples with code snippets", "medium");
  addPriority(!hasContributing, "Add contributing guidelines", "low");
  addPriority(daysSincePush > 90, "Ship a small update to show the project is maintained", "low");

  const suggestedTopics = buildSuggestedTopics(repo, readme);
  const suggestedDescription = buildSuggestedDescription(repo, readme);
  const suggestedBadges = buildSuggestedBadges(repo);
  const readmeUpgrade = buildReadmeUpgrade(repo, readme);

  const partial = {
    overallScore,
    categories,
    strengths: strengths.slice(0, 6),
    improvements: improvements.slice(0, 8),
    priorityChecklist: priorityChecklist.slice(0, 8),
    suggestedTopics,
    suggestedDescription,
    suggestedReadmeSections,
    suggestedBadges,
    readmeUpgrade,
  };

  const fixesMarkdown = buildFixesMarkdown(partial);
  const reportMarkdown = buildReportMarkdown(repo, {
    ...partial,
    fixesMarkdown,
    reportMarkdown: "",
  });

  return {
    ...partial,
    fixesMarkdown,
    reportMarkdown,
  };
}
