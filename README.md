# RepoPulse

<p align="center">
  <strong>Analyze any GitHub repository and get a score, improvement checklist, README suggestions, topic ideas, and star-growth tips.</strong>
</p>

<p align="center">
  <a href="https://repo-pulse-1u1f9ybyl-ixsosgts-projects.vercel.app/">
    <img src="https://img.shields.io/badge/Try%20Live%20Demo-RepoPulse-6366f1?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/Dragonia-developer/RepoPulse">
    <img src="https://img.shields.io/badge/GitHub-Dragonia--developer%2FRepoPulse-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-emerald-500?style=for-the-badge" alt="License">
  </a>
</p>

<p align="center">
  <a href="https://repo-pulse-1u1f9ybyl-ixsosgts-projects.vercel.app/">
    <img src="https://i.ibb.co/tw6MZT3w/image.png" alt="RepoPulse Dashboard" width="950">
  </a>
</p>

<p align="center">
  <strong>Improve your repository's discoverability, presentation, and star potential.</strong><br>
  Get actionable insights, missing improvements, README upgrades, and growth recommendations.
</p>

<p align="center">
  <a href="https://repo-pulse-1u1f9ybyl-ixsosgts-projects.vercel.app/">🌐 Live Demo</a>
  ·
  <a href="https://github.com/Dragonia-developer/RepoPulse">⭐ GitHub Repository</a>
</p>

---

## Features

- **Instant analysis** — Paste a GitHub URL (`owner/repo` or full URL)
- **RepoPulse Score (0–100)** — Weighted across 11 categories
- **Actionable dashboard** — Strengths, improvements, priority checklist
- **Smart suggestions** — Topics, description, README sections, badges
- **Copy & export** — Copy fixes, README upgrade blocks, full Markdown report
- **Shareable result card** — Beautiful score summary
- **No backend required** — Uses public GitHub API via Next.js API route
- **Rate limit awareness** — Warns when API quota is low

## Scoring Categories

| Category | What it measures |
|----------|------------------|
| README Quality | Length, structure, code blocks |
| Demo Visibility | Live demo links, homepage |
| Screenshot Presence | Images/GIFs in README |
| Installation Clarity | Install instructions |
| Usage Clarity | Examples and usage docs |
| License Presence | SPDX license on repo |
| Topics Quality | GitHub topic tags |
| Description Quality | Repo description length |
| Badges Presence | shields.io badges |
| Contribution Friendliness | CONTRIBUTING, issues |
| Project Activity | Recency of commits |

## Tech Stack

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) patterns
- [Lucide](https://lucide.dev/) icons
- [Framer Motion](https://www.framer.com/motion/) animations

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, pnpm, or yarn

### Installation

```bash
git clone https://github.com/Dragonia-developer/RepoPulse.git
cd RepoPulse
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and analyze any public repository.

### Production build

```bash
npm run build
npm run start
```

### Optional: GitHub Token

Unauthenticated API requests are limited to **60/hour**. For up to **5,000/hour**, create a [Personal Access Token](https://github.com/settings/tokens) (public repo access is enough):

```bash
cp .env.example .env.local
```

Add to `.env.local`:

```env
GITHUB_TOKEN=ghp_your_token_here
```

### Deploy (Vercel)

1. Push this repo to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add `GITHUB_TOKEN` in **Environment Variables** (optional, recommended)
4. Deploy — your live URL will be ready in minutes

## Usage

1. Open the [live demo](https://repo-pulse-1u1f9ybyl-ixsosgts-projects.vercel.app/) or run locally
2. Enter a public GitHub repository URL
3. Click **Analyze**
4. Review your RepoPulse score and category breakdown
5. Use **Copy Fixes** or **Generate README Upgrade** to improve your repo
6. **Download Report** as Markdown for your records

### Example repositories to try

- `vercel/next.js`
- `facebook/react`
- `tailwindlabs/tailwindcss`

## Project Structure

```
src/
├── app/
│   ├── api/analyze/    # Server-side GitHub API proxy
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/             # shadcn-style primitives
│   ├── analysis-dashboard.tsx
│   ├── repo-analyzer.tsx
│   └── ...
├── lib/
│   ├── analyzer.ts     # Scoring engine
│   ├── github.ts       # GitHub API client
│   └── export.ts       # Clipboard & download helpers
└── types/
    └── repo.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## API

### `GET /api/analyze?url={githubUrl}`

Fetches public GitHub data and returns analysis JSON.

**Example:**

```bash
curl "http://localhost:3000/api/analyze?url=https://github.com/vercel/next.js"
```

**Query parameters:**

| Parameter | Description |
|-----------|-------------|
| `url` | Full GitHub URL or `owner/repo` |

## License

MIT © 2026 — see [LICENSE](./LICENSE)

## Contributing

Contributions are welcome! Please open an issue or PR with your improvements.
