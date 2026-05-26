import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Activity, Github } from "lucide-react";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepoPulse — GitHub Repository Health Analyzer",
  description:
    "Analyze any public GitHub repository. Get a RepoPulse score, README improvements, topic suggestions, and shareable reports.",
  keywords: ["github", "readme", "repository", "open source", "analyzer"],
  openGraph: {
    title: "RepoPulse",
    description: "Improve your GitHub repository presentation and star potential.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <div className="gradient-mesh fixed inset-0 -z-10" />
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="size-5" />
              </div>
              <span>
                Repo<span className="text-primary">Pulse</span>
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <a
                href="https://github.com/Dragonia-developer/RepoPulse#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Docs
              </a>
              <a
                href="https://github.com/Dragonia-developer/RepoPulse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                <Github className="size-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-border/50 py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
            <p>
              RepoPulse uses the public GitHub API only. No backend required. MIT Licensed.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
