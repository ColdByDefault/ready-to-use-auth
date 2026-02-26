# ready-to-use-auth

A production-ready Next.js 16 authentication template powered by [Better Auth](https://www.better-auth.com/).

Drop it into any project and get email/password + OAuth sign-in/sign-up working in minutes. Every part is customizable — database adapter, OAuth providers, UI shell, and redirect paths — without touching auth logic.

**Stack:** Next.js 16 App Router · Better Auth ^1.2 · shadcn/ui · Tailwind CSS v4 · TypeScript (strict, zero `any`)

---

## Project Structure

```
proxy.ts                       # Route protection — replaces middleware.ts in Next.js 16+

app/
  page.tsx                     # Landing page
  sign-in/page.tsx             # Sign-in route — RSC wrapper
  sign-up/page.tsx             # Sign-up route — RSC wrapper
  dashboard/
    page.tsx                   # Protected page — RSC with server-side session check
  api/auth/[...all]/route.ts   # Better Auth catch-all handler

components/auth/
  providers.ts                 # All 10 OAuth providers — flip `enabled` to toggle
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
  auth.ts                      # All shared types
```

---

## Quick Start

```bash
# 1. Install
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
pnpm dev
```

Visit `http://localhost:3000` — landing page with Sign In / Create Account buttons.

---

## How It Works

Every auth form is split into two files:

| Layer     | File               | Responsibility                                                                      |
| --------- | ------------------ | ----------------------------------------------------------------------------------- |
| **UI**    | `sign-*-form.tsx`  | Pure presentational. Receives typed props. Zero auth logic, zero router calls.      |
| **Logic** | `sign-*-logic.tsx` | `"use client"`. State, zod validation, `authClient` calls. Passes everything to UI. |

This means you can replace the entire UI without touching auth logic, or reuse the same logic with a completely different design.

---

## Customization

### 1. Database

Two files work together — keep the **same numbered option** active in both:

| #   | Adapter       | Engine                       | Migration                                           |
| --- | ------------- | ---------------------------- | --------------------------------------------------- |
| 1   | Prisma        | PostgreSQL _(default)_       | `@better-auth/cli generate` → `prisma migrate dev`  |
| 2   | Prisma        | MySQL / SQLite / CockroachDB | same                                                |
| 3   | Drizzle ORM   | pg / MySQL / SQLite          | `@better-auth/cli generate` → `drizzle-kit migrate` |
| 4   | MongoDB       | MongoDB                      | none (schema-less)                                  |
| 5   | Kysely direct | PostgreSQL                   | `@better-auth/cli migrate`                          |
| 6   | Kysely direct | MySQL                        | `@better-auth/cli migrate`                          |
| 7   | Kysely direct | SQLite                       | `@better-auth/cli migrate`                          |
| 8   | Kysely direct | Bun SQLite                   | `@better-auth/cli migrate`                          |

Each option is fully documented as comments in `lib/db.ts` and `lib/auth.ts`. Change one block in each file and run the migration.

---

### 2. Toggle Providers On/Off

All 10 providers live in `components/auth/providers.ts`. Each has an `enabled` boolean:

```ts
{
  id: "discord",
  label: "Discord",
  icon: SiDiscord,
  brandColor: "#5865F2",
  enabled: true, // flip to show in UI
}
```

Then add env vars and register the redirect URI — that's it. Every page using `<SignIn>` or `<SignUp>` picks up the change automatically.

**All 10 providers:**

| Provider    | id          | Default    |
| ----------- | ----------- | ---------- |
| Google      | `google`    | ✅ enabled |
| GitHub      | `github`    | ✅ enabled |
| Microsoft   | `microsoft` | ✅ enabled |
| Apple       | `apple`     | ✅ enabled |
| Facebook    | `facebook`  | ✅ enabled |
| LinkedIn    | `linkedin`  | ✅ enabled |
| Discord     | `discord`   | disabled   |
| Twitter / X | `twitter`   | disabled   |
| Twitch      | `twitch`    | disabled   |
| Spotify     | `spotify`   | disabled   |

---

### 3. Override Providers Per-Page

Both `<SignIn>` and `<SignUp>` accept an optional `providerOverrides` prop that
lets you show/hide or rename providers for that specific page only -- without
changing `providers.ts`:

```tsx
// app/sign-in/page.tsx
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
}
```

`providerOverrides` is typed as `Partial<Record<SocialProvider, { enabled?: boolean; label?: string }>>` — specify only what you want to change.

---

### 4. Change Redirect Paths

Both components accept a `callbackConfig` prop to override where users go after
auth:

```tsx
// Sign-In: redirect to /admin after login
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
/>
```

**`AuthCallbackConfig` type:**

| Field                | Type     | Default        | Description                                        |
| -------------------- | -------- | -------------- | -------------------------------------------------- |
| `callbackURL`        | `string` | `"/dashboard"` | Redirect on successful auth                        |
| `errorCallbackURL`   | `string` | Current page   | Redirect on auth error                             |
| `newUserCallbackURL` | `string` | `callbackURL`  | Redirect for first-time OAuth users (sign-up only) |

---

### 5. Page Layout and Copy

`app/sign-in/page.tsx` and `app/sign-up/page.tsx` are plain RSCs — edit headings, descriptions, and footer links directly there. They are intentionally minimal.

---

### 6. Add a Custom Provider Icon

Create any component that satisfies `AuthIconComponent` (a
`React.ComponentType<IconProps>` -- receives `size`, `className`, `style`).

A ready-made template is at `components/auth/microsoft-icon.tsx`. Copy it, rename it, paste your SVG paths:

```tsx
// components/auth/my-icon.tsx
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
}
```

Register it in `providers.ts`:

```ts
import { MyIcon } from "@/components/auth/my-icon";

{ id: "spotify", label: "Spotify", icon: MyIcon, brandColor: "#1DB954", enabled: true }
```

If the provider ID doesn't exist in the `SocialProvider` union yet, add it to `types/auth.ts` and register the server-side config in `lib/auth.ts` under `socialProviders`.

---

### 7. Swap the Entire UI Shell

The UI components (`sign-in-form.tsx`, `sign-up-form.tsx`) are **purely presentational** — they only receive typed props and fire typed callbacks.

To replace the UI entirely: create a new component that accepts the same prop interface, then update one import line in the logic file.

**Prop interfaces:**

**`SignUpFormProps`:**

```ts
interface SignUpFormProps {
  values: SignUpFormValues; // { name, email, password, confirmPassword }
  fieldErrors: SignUpFieldErrors; // Partial<Record<keyof values, string>>
  authError: AuthError | null; // { message: string; code?: string }
  isLoading: boolean; // email form is submitting
  providers: ProviderConfig[]; // enabled providers to render
  socialLoadingProvider: SocialProvider | null; // which social btn is loading
  onFieldChange: (field: keyof SignUpFormValues, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSocialSignIn: (provider: SocialProvider) => void;
}
```

**`SignInFormProps`:**

```ts
interface SignInFormProps {
  values: SignInFormValues; // { email, password, rememberMe }
  fieldErrors: SignInFieldErrors; // Partial<Record<keyof values, string>>
  authError: AuthError | null;
  isLoading: boolean;
  providers: ProviderConfig[];
  socialLoadingProvider: SocialProvider | null;
  onFieldChange: (
    field: keyof SignInFormValues,
    value: string | boolean,
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSocialSignIn: (provider: SocialProvider) => void;
}
```

**Swap in one line:**

```tsx
// components/auth/sign-in/sign-in-logic.tsx
import { SignInFormUI } from "./my-sign-in-form"; // ← change this import
```

Your new UI inherits all state, validation, loading states, and auth calls automatically.

**Minimal example:**

```tsx
import type { SignInFormProps } from "@/types/auth";

export function SignInFormUI({
  values,
  fieldErrors,
  authError,
  isLoading,
  providers,
  socialLoadingProvider,
  onFieldChange,
  onSubmit,
  onSocialSignIn,
}: SignInFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        value={values.email}
        onChange={(e) => onFieldChange("email", e.target.value)}
      />
      {fieldErrors.email && <span>{fieldErrors.email}</span>}
      <input
        type="password"
        value={values.password}
        onChange={(e) => onFieldChange("password", e.target.value)}
      />
      {authError && <div role="alert">{authError.message}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      {providers
        .filter((p) => p.enabled)
        .map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={socialLoadingProvider !== null}
            onClick={() => onSocialSignIn(p.id)}
          >
            <p.icon size={16} style={{ color: p.brandColor }} /> {p.label}
          </button>
        ))}
    </form>
  );
}
```

---

### 8. Dark Mode

Dark mode is active out of the box via `next-themes`. The `ThemeProvider` in `app/layout.tsx` uses `attribute="class"`. All components use Tailwind `dark:` variants. System theme is used by default.

Add a toggle anywhere:

```tsx
"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle
    </button>
  );
}
```

---

### 9. Landing Page

The default landing page lives entirely in `components/landing-default/`. The root route (`app/page.tsx`) is a thin wrapper that just imports it — making it trivial to replace.

**To remove or replace the default landing page:**

```tsx
// app/page.tsx
// 1. Delete the `components/landing-default/` folder (optional).
// 2. Replace the import with your own component:
import { MyLandingPage } from "@/components/my-landing";

export default function HomePage() {
  return <MyLandingPage />;
}
```

**Version badge** (`components/landing-default/version-badge.tsx`) reads the version dynamically from `package.json` at build time — no manual updates needed. You can use it independently anywhere:

```tsx
import { VersionBadge } from "@/components/landing-default";

// Renders: ● v0.5.0
<VersionBadge />;
```

To disable only the version badge while keeping the rest of the landing page, remove the `<VersionBadge />` line from `components/landing-default/landing-page.tsx`.

---

## Reading the Session

**Client component:**

```tsx
"use client";
import { authClient } from "@/lib/auth-client";

export function UserBadge() {
  const { data: session } = authClient.useSession();
  if (!session) return null;
  return <span>{session.user.name}</span>;
}
```

**Server component (recommended for protected pages):**

```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <p>Hello, {session.user.name}</p>;
}
```

> **Tip:** prefer server-side session checks for protected pages — they avoid the redirect flash that client-side `useEffect` guards produce. For protecting multiple routes at once, use `proxy.ts` at the project root (Next.js 16+ replaces `middleware.ts` with `proxy.ts`).

---

## Type Reference

All types are in `types/auth.ts` -- zero `any` across the entire codebase.

| Type                 | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `SocialProvider`     | Union: `"google" \| "github" \| "discord" \| ...`        |
| `ProviderConfig`     | `{ id, label, icon, brandColor, enabled }`               |
| `AuthIconComponent`  | `React.ComponentType<IconProps>`                         |
| `IconProps`          | `{ size?, className?, style?, "aria-hidden"? }`          |
| `SignUpFormValues`   | `{ name, email, password, confirmPassword }`             |
| `SignInFormValues`   | `{ email, password, rememberMe }`                        |
| `AuthError`          | `{ message: string; code?: string }`                     |
| `AuthCallbackConfig` | `{ callbackURL, errorCallbackURL, newUserCallbackURL? }` |
| `SignUpFieldErrors`  | `Partial<Record<keyof SignUpFormValues, string>>`        |
| `SignInFieldErrors`  | `Partial<Record<keyof SignInFormValues, string>>`        |
| `SignUpFormProps`    | Full prop interface for the sign-up UI                   |
| `SignInFormProps`    | Full prop interface for the sign-in UI                   |

---

## OAuth Redirect URIs

For each provider you enable, register this callback URL in their developer
console:

```
{NEXT_PUBLIC_APP_URL}/api/auth/callback/{provider-id}
```

Examples:

```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
http://localhost:3000/api/auth/callback/microsoft
http://localhost:3000/api/auth/callback/apple
http://localhost:3000/api/auth/callback/facebook
http://localhost:3000/api/auth/callback/linkedin
```
