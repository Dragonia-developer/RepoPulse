# RepoPulse

**RepoPulse** analyzes any public GitHub repository and helps developers improve repository presentation, README quality, discoverability, and star potential.

![RepoPulse Dashboard](./public/screenshot-placeholder.svg)

> Replace `public/screenshot-placeholder.svg` with a real screenshot at `docs/screenshot.png` after your first run.

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

- Node.js 18+
- npm, pnpm, or yarn

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

### Optional: GitHub Token

Unauthenticated requests are limited to **60/hour**. For higher limits, create a [Personal Access Token](https://github.com/settings/tokens) and add:

```bash
cp .env.example .env.local
# Edit .env.local:
GITHUB_TOKEN=ghp_your_token_here
```

## Usage

1. Enter a public GitHub repository URL
2. Click **Analyze**
3. Review your RepoPulse score and category breakdown
4. Use **Copy Fixes** or **Generate README Upgrade** to improve your repo
5. **Download Report** as Markdown for your records

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

## Screenshots

<!-- Add your screenshot here after capturing the dashboard -->

| Dashboard | Score Card |
|-----------|------------|
| ![Placeholder](./public/screenshot-placeholder.svg) | Analyze any public repo |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API

### `GET /api/analyze?url={githubUrl}`

Returns repository data and analysis JSON.

## License

MIT © 2026 — see [LICENSE](./LICENSE)

## Contributing

Contributions are welcome! Please open an issue or PR with your improvements.
