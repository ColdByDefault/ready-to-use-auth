import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VersionBadge } from "@/components/landing-default";

// ── Shared prose primitives ────────────────────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-foreground mt-10 mb-4 text-2xl font-bold tracking-tight border-b border-border pb-2">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-foreground mt-6 mb-2 text-lg font-semibold">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
      {children}
    </code>
  );
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="bg-muted/70 border border-border rounded-xl p-4 overflow-x-auto text-xs font-mono text-foreground leading-relaxed mb-4 whitespace-pre">
      {children}
    </pre>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground mb-4">
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* ── Top CTA banner ──────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-foreground font-bold text-sm hover:opacity-70 transition-opacity"
            >
              ready-to-use-auth
            </Link>
            <VersionBadge />
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/sign-up">
                Create account
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-foreground text-4xl font-bold tracking-tight mb-3">
            ready-to-use-auth
          </h1>
          <P>
            A production-ready Next.js 16 authentication starter powered by{" "}
            <a
              href="https://www.better-auth.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:opacity-70"
            >
              Better Auth
            </a>
            . Clone it, configure your DB and providers, and have a fully
            working auth layer in minutes — then build your app on top. Every
            part is customizable — database adapter, OAuth providers, UI shell,
            and redirect paths — without touching auth logic.
          </P>
          <P>
            <strong className="text-foreground">Stack:</strong> Next.js 16 App
            Router · Better Auth ^1.2 · shadcn/ui · Tailwind CSS v4 · TypeScript
            (strict, zero <Code>any</Code>)
          </P>
        </div>

        {/* Project Structure */}
        <H2>Project Structure</H2>
        <Pre>{`proxy.ts                       # Route protection — replaces middleware.ts in Next.js 16+

app/
  page.tsx                     # Landing page
  sign-in/page.tsx             # Sign-in route — RSC wrapper
  sign-up/page.tsx             # Sign-up route — RSC wrapper
  dashboard/
    page.tsx                   # Protected page — RSC with server-side session check
  api/auth/[...all]/route.ts   # Better Auth catch-all handler

components/auth/
  providers.ts                 # All 10 OAuth providers — flip \`enabled\` to toggle
  microsoft-icon.tsx           # Custom SVG icon (template for new providers)
  sign-out-button.tsx          # Client component — only piece that needs the browser
  sign-in/
    sign-in-form.tsx           # Pure UI — zero logic, receives typed props only
    sign-in-logic.tsx          # Controller — state, validation, auth calls
    index.ts                   # Re-exports as <SignIn>
  sign-up/
    sign-up-form.tsx           # Pure UI
    sign-up-logic.tsx          # Controller
    index.ts                   # Re-exports as <SignUp>

lib/
  auth.ts                      # Server-side Better Auth instance
  auth-client.ts               # Client-side auth client
  db.ts                        # Database connection — 8 options, pick one

types/
  auth.ts                      # All shared types`}</Pre>

        {/* Quick Start */}
        <H2>Quick Start</H2>
        <Pre>{`# 1. Install
pnpm install

# 2. Copy env template
cp .env.example .env.local

# 3. Fill in .env.local — minimum required:
#    BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
#    NEXT_PUBLIC_APP_URL=http://localhost:3000
#    DATABASE_URL=<your connection string>

# 4. Generate schema + run migrations (default: Prisma + PostgreSQL)
npx @better-auth/cli@latest generate
npx prisma migrate dev

# 5. Start
pnpm dev`}</Pre>
        <P>
          Visit <Code>http://localhost:3000</Code> — landing page with Sign In /
          Create Account buttons.
        </P>

        {/* How It Works */}
        <H2>How It Works</H2>
        <P>Every auth form is split into two files:</P>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-6">
                  Layer
                </th>
                <th className="text-left text-foreground font-semibold py-2 pr-6">
                  File
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Responsibility
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-6 text-muted-foreground font-medium">
                  UI
                </td>
                <td className="py-2 pr-6">
                  <Code>sign-*-form.tsx</Code>
                </td>
                <td className="py-2 text-muted-foreground">
                  Pure presentational. Receives typed props. Zero auth logic,
                  zero router calls.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-6 text-muted-foreground font-medium">
                  Logic
                </td>
                <td className="py-2 pr-6">
                  <Code>sign-*-logic.tsx</Code>
                </td>
                <td className="py-2 text-muted-foreground">
                  <Code>&quot;use client&quot;</Code>. State, zod validation,{" "}
                  <Code>authClient</Code> calls. Passes everything to UI.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <P>
          This means you can replace the entire UI without touching auth logic,
          or reuse the same logic with a completely different design.
        </P>

        {/* Customization */}
        <H2>Customization</H2>

        {/* 1. Database */}
        <H3>1. Database</H3>
        <P>
          Two files work together — keep the{" "}
          <strong className="text-foreground">same numbered option</strong>{" "}
          active in both:
        </P>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  #
                </th>
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Adapter
                </th>
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Engine
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Migration
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "1",
                  "Prisma",
                  "PostgreSQL (default)",
                  "@better-auth/cli generate → prisma migrate dev",
                ],
                ["2", "Prisma", "MySQL / SQLite / CockroachDB", "same"],
                [
                  "3",
                  "Drizzle ORM",
                  "pg / MySQL / SQLite",
                  "@better-auth/cli generate → drizzle-kit migrate",
                ],
                ["4", "MongoDB", "MongoDB", "none (schema-less)"],
                [
                  "5",
                  "Kysely direct",
                  "PostgreSQL",
                  "@better-auth/cli migrate",
                ],
                ["6", "Kysely direct", "MySQL", "@better-auth/cli migrate"],
                ["7", "Kysely direct", "SQLite", "@better-auth/cli migrate"],
                [
                  "8",
                  "Kysely direct",
                  "Bun SQLite",
                  "@better-auth/cli migrate",
                ],
              ].map(([num, adapter, engine, migration]) => (
                <tr key={num} className="border-b border-border/40">
                  <td className="py-1.5 pr-4">{num}</td>
                  <td className="py-1.5 pr-4">{adapter}</td>
                  <td className="py-1.5 pr-4">{engine}</td>
                  <td className="py-1.5 font-mono text-xs">{migration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Each option is fully documented as comments in <Code>lib/db.ts</Code>{" "}
          and <Code>lib/auth.ts</Code>. Change one block in each file and run
          the migration.
        </P>

        <Note>
          <strong className="text-foreground">Build script:</strong> The default{" "}
          <Code>build</Code> command in <Code>package.json</Code> is{" "}
          <Code>&quot;prisma generate &amp;&amp; next build&quot;</Code>. This
          is <strong className="text-foreground">Prisma-specific</strong>{" "}
          (options 1–2). If you switch to a different adapter, update the build
          script accordingly:
        </Note>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Adapter
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Build script
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Prisma (1–2)", '"prisma generate && next build" (default)'],
                ["Drizzle (3)", '"drizzle-kit generate && next build"'],
                ["MongoDB (4)", '"next build"'],
                ["Kysely (5–8)", '"next build"'],
              ].map(([adapter, script]) => (
                <tr key={adapter} className="border-b border-border/40">
                  <td className="py-1.5 pr-4 font-medium text-foreground">
                    {adapter}
                  </td>
                  <td className="py-1.5 font-mono text-xs">{script}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Prisma and Drizzle need a code-generation step before the build so the
          ORM client is available at compile time. MongoDB and Kysely don&apos;t
          require code generation.
        </P>

        {/* 2. Providers */}
        <H3>2. Toggle Providers On/Off</H3>
        <P>
          All 10 providers live in <Code>components/auth/providers.ts</Code>.
          Each has an <Code>enabled</Code> boolean:
        </P>
        <Pre>{`{
  id: "discord",
  label: "Discord",
  icon: SiDiscord,
  brandColor: "#5865F2",
  enabled: true, // flip to show in UI
}`}</Pre>
        <P>
          Then add env vars and register the redirect URI — that&apos;s it.
          Every page using <Code>&lt;SignIn&gt;</Code> or{" "}
          <Code>&lt;SignUp&gt;</Code> picks up the change automatically.
        </P>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-6">
                  Provider
                </th>
                <th className="text-left text-foreground font-semibold py-2 pr-6">
                  id
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Default
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Google", "google", "✅ enabled"],
                ["GitHub", "github", "✅ enabled"],
                ["Microsoft", "microsoft", "✅ enabled"],
                ["Apple", "apple", "✅ enabled"],
                ["Facebook", "facebook", "✅ enabled"],
                ["LinkedIn", "linkedin", "✅ enabled"],
                ["Discord", "discord", "disabled"],
                ["Twitter / X", "twitter", "disabled"],
                ["Twitch", "twitch", "disabled"],
                ["Spotify", "spotify", "disabled"],
              ].map(([provider, id, status]) => (
                <tr key={id} className="border-b border-border/40">
                  <td className="py-1.5 pr-6">{provider}</td>
                  <td className="py-1.5 pr-6">
                    <Code>{id}</Code>
                  </td>
                  <td className="py-1.5">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Provider Overrides */}
        <H3>3. Override Providers Per-Page</H3>
        <P>
          Both <Code>&lt;SignIn&gt;</Code> and <Code>&lt;SignUp&gt;</Code>{" "}
          accept an optional <Code>providerOverrides</Code> prop that lets you
          show/hide or rename providers for that specific page only — without
          changing <Code>providers.ts</Code>:
        </P>
        <Pre>{`// app/sign-in/page.tsx
import { SignIn } from "@/components/auth/sign-in";

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <SignIn
        providerOverrides={{
          // Enable Discord just on this page
          discord: { enabled: true, label: "Continue with Discord" },
          // Hide Facebook on this page
          facebook: { enabled: false },
          // Rename the Google button
          google: { label: "Sign in with Google Workspace" },
        }}
      />
    </main>
  );
}`}</Pre>
        <P>
          <Code>providerOverrides</Code> is typed as{" "}
          <Code>
            Partial&lt;Record&lt;SocialProvider,{" "}
            {"{ enabled?: boolean; label?: string }"}
            &gt;&gt;
          </Code>{" "}
          — specify only what you want to change.
        </P>

        {/* 4. Redirect Paths */}
        <H3>4. Change Redirect Paths</H3>
        <P>
          Both components accept a <Code>callbackConfig</Code> prop to override
          where users go after auth:
        </P>
        <Pre>{`// Sign-In: redirect to /admin after login
<SignIn
  callbackConfig={{
    callbackURL: "/admin",
    errorCallbackURL: "/sign-in?error=true",
  }}
/>

// Sign-Up: different redirect for new OAuth users
<SignUp
  callbackConfig={{
    callbackURL: "/dashboard",
    newUserCallbackURL: "/onboarding",   // first-time OAuth users
    errorCallbackURL: "/sign-up",
  }}
/>`}</Pre>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Field
                </th>
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Type
                </th>
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Default
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "callbackURL",
                  "string",
                  '"/dashboard"',
                  "Redirect on successful auth",
                ],
                [
                  "errorCallbackURL",
                  "string",
                  "Current page",
                  "Redirect on auth error",
                ],
                [
                  "newUserCallbackURL",
                  "string",
                  "callbackURL",
                  "Redirect for first-time OAuth users (sign-up only)",
                ],
              ].map(([field, type, def, desc]) => (
                <tr key={field} className="border-b border-border/40">
                  <td className="py-1.5 pr-4">
                    <Code>{field}</Code>
                  </td>
                  <td className="py-1.5 pr-4">
                    <Code>{type}</Code>
                  </td>
                  <td className="py-1.5 pr-4 font-mono text-xs">{def}</td>
                  <td className="py-1.5">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Page layout */}
        <H3>5. Page Layout and Copy</H3>
        <P>
          <Code>app/sign-in/page.tsx</Code> and{" "}
          <Code>app/sign-up/page.tsx</Code> are plain RSCs — edit headings,
          descriptions, and footer links directly there. They are intentionally
          minimal.
        </P>

        {/* 6. Custom icon */}
        <H3>6. Add a Custom Provider Icon</H3>
        <P>
          Create any component that satisfies <Code>AuthIconComponent</Code> (a{" "}
          <Code>React.ComponentType&lt;IconProps&gt;</Code> — receives{" "}
          <Code>size</Code>, <Code>className</Code>, <Code>style</Code>).
        </P>
        <P>
          A ready-made template is at{" "}
          <Code>components/auth/microsoft-icon.tsx</Code>. Copy it, rename it,
          paste your SVG paths:
        </P>
        <Pre>{`// components/auth/my-icon.tsx
import type { IconProps } from "@/types/auth";

export function MyIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="..." />
    </svg>
  );
}`}</Pre>
        <P>
          Register it in <Code>providers.ts</Code>:
        </P>
        <Pre>{`import { MyIcon } from "@/components/auth/my-icon";

{ id: "spotify", label: "Spotify", icon: MyIcon, brandColor: "#1DB954", enabled: true }`}</Pre>
        <P>
          If the provider ID doesn&apos;t exist in the{" "}
          <Code>SocialProvider</Code> union yet, add it to{" "}
          <Code>types/auth.ts</Code> and register the server-side config in{" "}
          <Code>lib/auth.ts</Code> under <Code>socialProviders</Code>.
        </P>

        {/* 7. Swap UI */}
        <H3>7. Swap the Entire UI Shell</H3>
        <P>
          The UI components (<Code>sign-in-form.tsx</Code>,{" "}
          <Code>sign-up-form.tsx</Code>) are{" "}
          <strong className="text-foreground">purely presentational</strong> —
          they only receive typed props and fire typed callbacks.
        </P>
        <P>
          To replace the UI entirely: create a new component that accepts the
          same prop interface, then update one import line in the logic file.
        </P>
        <Pre>{`// components/auth/sign-in/sign-in-logic.tsx
import { SignInFormUI } from "./my-sign-in-form"; // ← change this import`}</Pre>
        <P>
          Your new UI inherits all state, validation, loading states, and auth
          calls automatically.
        </P>

        {/* 8. Dark Mode */}
        <H3>8. Dark Mode</H3>
        <P>
          Dark mode is active out of the box via <Code>next-themes</Code>. The{" "}
          <Code>ThemeProvider</Code> in <Code>app/layout.tsx</Code> uses{" "}
          <Code>attribute=&quot;class&quot;</Code>. All components use Tailwind{" "}
          <Code>dark:</Code> variants. System theme is used by default.
        </P>
        <Pre>{`"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle
    </button>
  );
}`}</Pre>

        {/* 9. Landing Page */}
        <H3>9. Landing Page</H3>
        <P>
          The default landing page lives entirely in{" "}
          <Code>components/landing-default/</Code>. The root route (
          <Code>app/page.tsx</Code>) is a thin wrapper that just imports it —
          making it trivial to replace.
        </P>
        <Pre>{`// app/page.tsx
import { MyLandingPage } from "@/components/my-landing";

export default function HomePage() {
  return <MyLandingPage />;
}`}</Pre>
        <P>
          <strong className="text-foreground">Version badge</strong> (
          <Code>components/landing-default/version-badge.tsx</Code>) reads the
          version dynamically from <Code>package.json</Code> at build time — no
          manual updates needed.
        </P>

        {/* 10. Demo / Showcase Mode */}
        <H3>10. Demo / Showcase Mode</H3>
        <P>
          The project includes a{" "}
          <strong className="text-foreground">demo mode</strong> that lets you
          deploy it as a public showcase on Vercel (or anywhere){" "}
          <strong className="text-foreground">without a database</strong>.
          Visitors can sign in with hardcoded demo credentials and explore the
          dashboard, but cannot create real accounts.
        </P>

        <H3>How Demo Mode Works</H3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Component
                </th>
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  Normal mode
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Demo mode
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "Sign-in",
                  "Better Auth + DB",
                  "Validates against DEMO_EMAIL / DEMO_PASSWORD env vars",
                ],
                [
                  "Sign-up",
                  "Better Auth + DB",
                  "Shows an info notice (registration disabled)",
                ],
                [
                  "Dashboard",
                  "Reads session from DB",
                  "Reads session from a lightweight cookie",
                ],
                [
                  "Social providers",
                  "Shown",
                  "Hidden (no DB to store OAuth accounts)",
                ],
                [
                  "Middleware",
                  "Calls auth.api.getSession",
                  "Checks for the demo_session cookie",
                ],
              ].map(([component, normal, demo]) => (
                <tr key={component} className="border-b border-border/40">
                  <td className="py-1.5 pr-4 font-medium text-foreground">
                    {component}
                  </td>
                  <td className="py-1.5 pr-4">{normal}</td>
                  <td className="py-1.5">{demo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>Demo Environment Variables</H3>
        <Pre>{`# Set these three on Vercel (or in .env.local for local testing)
NEXT_PUBLIC_DEMO_MODE=true
DEMO_EMAIL=demo@example.com
DEMO_PASSWORD=Demo1234!`}</Pre>
        <P>
          <Code>DATABASE_URL</Code> and <Code>BETTER_AUTH_SECRET</Code> can be
          left empty — they are never used at runtime in demo mode.
        </P>

        <H3>Demo Mode Files</H3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-4">
                  File
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "lib/demo-session.ts",
                  "Cookie helpers + isDemoMode() / getDemoSession()",
                ],
                [
                  "app/api/demo-signin/route.ts",
                  "Validates demo creds, issues demo_session cookie",
                ],
                ["app/api/demo-signout/route.ts", "Clears the cookie"],
                ["proxy.ts", "Bypasses Better Auth in demo mode"],
                [
                  "app/dashboard/page.tsx",
                  "Reads cookie session instead of hitting DB",
                ],
                ["sign-in-logic.tsx", "POSTs to /api/demo-signin"],
                [
                  "sign-up-logic.tsx",
                  "Renders showcase notice instead of form",
                ],
                ["sign-out-button.tsx", "Calls /api/demo-signout"],
              ].map(([file, purpose]) => (
                <tr key={file} className="border-b border-border/40">
                  <td className="py-1.5 pr-4">
                    <Code>{file}</Code>
                  </td>
                  <td className="py-1.5">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>Disabling Demo Mode (After Cloning)</H3>
        <P>
          To switch to the real Better Auth flow, just remove{" "}
          <Code>NEXT_PUBLIC_DEMO_MODE</Code> from your environment (or set it to{" "}
          <Code>&quot;false&quot;</Code>). Then set up your database and auth
          secrets as described in the Quick Start section above.{" "}
          <strong className="text-foreground">No code changes needed</strong> —
          every component checks <Code>NEXT_PUBLIC_DEMO_MODE</Code> at runtime
          and falls back to the normal Better Auth path automatically.
        </P>
        <Pre>{`# 1. Remove (or set to "false") the demo flag
NEXT_PUBLIC_DEMO_MODE=false   # or just delete the line

# 2. Set up your real auth secrets
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
DATABASE_URL=postgresql://user:password@host:5432/dbname

# 3. Run migrations
npx prisma migrate dev

# 4. Deploy — everything uses Better Auth automatically`}</Pre>

        {/* Reading the Session */}
        <H2>Reading the Session</H2>
        <H3>Client component</H3>
        <Pre>{`"use client";
import { authClient } from "@/lib/auth-client";

export function UserBadge() {
  const { data: session } = authClient.useSession();
  if (!session) return null;
  return <span>{session.user.name}</span>;
}`}</Pre>
        <H3>Server component (recommended for protected pages)</H3>
        <Pre>{`import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <p>Hello, {"{session.user.name}"}</p>;
}`}</Pre>
        <Note>
          <strong className="text-foreground">Tip:</strong> prefer server-side
          session checks for protected pages — they avoid the redirect flash
          that client-side <Code>useEffect</Code> guards produce. For protecting
          multiple routes at once, use <Code>proxy.ts</Code> at the project root
          (Next.js 16+ replaces <Code>middleware.ts</Code> with{" "}
          <Code>proxy.ts</Code>).
        </Note>

        {/* Type Reference */}
        <H2>Type Reference</H2>
        <P>
          All types are in <Code>types/auth.ts</Code> — zero <Code>any</Code>{" "}
          across the entire codebase.
        </P>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground font-semibold py-2 pr-6">
                  Type
                </th>
                <th className="text-left text-foreground font-semibold py-2">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "SocialProvider",
                  'Union: "google" | "github" | "discord" | ...',
                ],
                ["ProviderConfig", "{ id, label, icon, brandColor, enabled }"],
                ["AuthIconComponent", "React.ComponentType<IconProps>"],
                ["IconProps", '{ size?, className?, style?, "aria-hidden"? }'],
                [
                  "SignUpFormValues",
                  "{ name, email, password, confirmPassword }",
                ],
                ["SignInFormValues", "{ email, password, rememberMe }"],
                ["AuthError", "{ message: string; code?: string }"],
                [
                  "AuthCallbackConfig",
                  "{ callbackURL, errorCallbackURL, newUserCallbackURL? }",
                ],
                [
                  "SignUpFieldErrors",
                  "Partial<Record<keyof SignUpFormValues, string>>",
                ],
                [
                  "SignInFieldErrors",
                  "Partial<Record<keyof SignInFormValues, string>>",
                ],
                ["SignUpFormProps", "Full prop interface for the sign-up UI"],
                ["SignInFormProps", "Full prop interface for the sign-in UI"],
              ].map(([type, desc]) => (
                <tr key={type} className="border-b border-border/40">
                  <td className="py-1.5 pr-6">
                    <Code>{type}</Code>
                  </td>
                  <td className="py-1.5">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* OAuth Redirect URIs */}
        <H2>OAuth Redirect URIs</H2>
        <P>
          For each provider you enable, register this callback URL in their
          developer console:
        </P>
        <Pre>{`{NEXT_PUBLIC_APP_URL}/api/auth/callback/{provider-id}`}</Pre>
        <P>Examples:</P>
        <Pre>{`http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
http://localhost:3000/api/auth/callback/microsoft
http://localhost:3000/api/auth/callback/apple
http://localhost:3000/api/auth/callback/facebook
http://localhost:3000/api/auth/callback/linkedin`}</Pre>
      </main>
    </div>
  );
}
