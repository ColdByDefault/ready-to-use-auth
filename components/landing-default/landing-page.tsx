import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Database,
  Layers,
  Moon,
  Puzzle,
  Lock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VersionBadge } from "./version-badge";

const FEATURES = [
  {
    icon: Lock,
    title: "Type-Safe Auth",
    description:
      "Strict TypeScript throughout — zero any, full inference on session, errors, and callbacks.",
  },
  {
    icon: Users,
    title: "10 OAuth Providers",
    description:
      "Google, GitHub, Microsoft, Apple, Facebook, and more. Flip a boolean to enable each one.",
  },
  {
    icon: Layers,
    title: "Swappable UI Shell",
    description:
      "Forms are purely presentational. Replace the entire UI in one import line without touching auth logic.",
  },
  {
    icon: Database,
    title: "8 DB Adapters",
    description:
      "Prisma, Drizzle, Kysely (pg / MySQL / SQLite / Bun), and MongoDB. Change one block in two files.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "System theme out of the box via next-themes. All components ship with dark: variants.",
  },
  {
    icon: Puzzle,
    title: "Route Protection",
    description:
      "proxy.ts-based guard compatible with Next.js 16+. Server-side session checks, no redirect flash.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col overflow-hidden">
      {/* Subtle dot-grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.5 0 0 / 0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Top fade */}
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b to-transparent"
      />

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
            <ShieldCheck className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            ready-to-use-auth
          </span>
        </div>
        <VersionBadge />
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center sm:px-8">
        {/* Announcement pill */}
        <Link
          href="https://www.better-auth.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-muted/60 text-muted-foreground hover:text-foreground hover:border-foreground/20 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs transition-colors"
        >
          <span className="bg-green-500 size-1.5 rounded-full" />
          Powered by Better Auth
          <ArrowRight className="size-3" />
        </Link>

        {/* Headline */}
        <div className="flex flex-col gap-4">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Auth that&apos;s ready
            <br />
            <span className="text-muted-foreground">on day one.</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed sm:text-lg">
            A production-ready Next.js 16 authentication template. Drop it into
            any project and get email &amp; OAuth sign-in working in minutes.
            Every layer is customizable.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/sign-in">
              Sign in
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="/sign-up">Create account</Link>
          </Button>
        </div>

        {/* ── Features grid ─────────────────────────────────────────────── */}
        <div className="mt-8 grid w-full gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="border-border bg-card/60 rounded-xl border p-5 backdrop-blur-sm"
            >
              <div className="bg-muted mb-3 inline-flex size-9 items-center justify-center rounded-lg">
                <Icon className="text-foreground size-4" />
              </div>
              <h3 className="text-foreground mb-1 text-sm font-semibold">
                {title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-border/50 border-t px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            Built by{" "}
            <Link
              href="https://github.com/ColdByDefault"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4 transition-colors"
            >
              ColdByDefault© {new Date().getFullYear()}
            </Link>{" "}
            · <span className="text-gray-300 font-bold">MIT License</span>
          </p>
          <Link
            href="https://github.com/ColdByDefault/ready-to-use-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
          >
            View on GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
}
