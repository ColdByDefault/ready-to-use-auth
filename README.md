# Better Auth Components

Fully customisable, type-safe authentication UI components built on top of
[Better Auth](https://www.better-auth.com/), Next.js 16 App Router, shadcn/ui,
and Tailwind CSS v4. UI and business logic are strictly separated -- swap out
the form shell without touching a single line of auth code, or change providers
in one place and have every page update automatically.

---

## File Structure

```
.
├── app/
│   ├── page.tsx                          # Landing -- Sign In / Sign Up buttons
│   ├── sign-in/page.tsx                  # Sign-in route (RSC wrapper)
│   ├── sign-up/page.tsx                  # Sign-up route (RSC wrapper)
│   └── api/auth/[...all]/route.ts        # Better Auth catch-all handler
│
├── components/auth/
│   ├── providers.ts                      # All 10 providers -- flip `enabled`
│   ├── microsoft-icon.tsx                # Inline SVG (drop-in for react-icons)
│   │
│   ├── sign-in/
│   │   ├── sign-in-form.tsx              # Pure UI -- zero logic, only props
│   │   ├── sign-in-logic.tsx             # Controller -- auth calls, state
│   │   └── index.ts                      # Re-exports as `SignIn`
│   │
│   └── sign-up/
│       ├── sign-up-form.tsx              # Pure UI -- zero logic, only props
│       ├── sign-up-logic.tsx             # Controller -- auth calls, state
│       └── index.ts                      # Re-exports as `SignUp`
│
├── lib/
│   ├── auth.ts                           # Server-side Better Auth instance
│   ├── auth-client.ts                    # Client-side auth client
│   └── db.ts                             # DB client — pick your adapter (Options 1-8)
│
├── types/
│   └── auth.ts                           # All shared types (zero `any`)
│
├── .env.example                          # Template with links to dev consoles
└── README.md
```

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

At minimum you need:

| Variable              | Description                                    |
| --------------------- | ---------------------------------------------- |
| `BETTER_AUTH_SECRET`  | Random secret -- run `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Base URL, e.g. `http://localhost:3000`         |

Then add `CLIENT_ID` / `CLIENT_SECRET` pairs for every provider you enable.
See `.env.example` for direct links to each developer console.

### 3. Configure your database

Two files work together — keep the **same numbered option** active in both:

| File          | What to change                               |
| ------------- | -------------------------------------------- |
| `lib/db.ts`   | Uncomment the client setup block for your DB |
| `lib/auth.ts` | Uncomment the matching `database:` line      |

**Default (PostgreSQL + Prisma, already active):**

```
lib/db.ts    → Option 1 block is active
lib/auth.ts  → database: prismaAdapter(prisma, { provider: "postgresql" })
```

**Available options:**

| #   | Adapter         | Engine                       | Migration command                                   |
| --- | --------------- | ---------------------------- | --------------------------------------------------- |
| 1   | Prisma          | PostgreSQL (default)         | `@better-auth/cli generate` → `prisma migrate dev`  |
| 2   | Prisma          | MySQL / SQLite / CockroachDB | `@better-auth/cli generate` → `prisma migrate dev`  |
| 3   | Drizzle ORM     | pg / MySQL / SQLite          | `@better-auth/cli generate` → `drizzle-kit migrate` |
| 4   | MongoDB         | MongoDB                      | none (schema-less)                                  |
| 5   | Direct (Kysely) | PostgreSQL                   | `@better-auth/cli migrate`                          |
| 6   | Direct (Kysely) | MySQL                        | `@better-auth/cli migrate`                          |
| 7   | Direct (Kysely) | SQLite / better-sqlite3      | `@better-auth/cli migrate`                          |
| 8   | Direct (Kysely) | Bun SQLite                   | `@better-auth/cli migrate`                          |

Each option includes its required packages and migration steps as comments
directly in `lib/db.ts`. See [Better Auth database docs](https://www.better-auth.com/docs/concepts/database) for full details.

### 4. Start the dev server

```bash
pnpm dev
```

Visit `http://localhost:3000` -- you'll see the landing page with Sign In and
Sign Up buttons.

---

## Architecture -- UI vs Logic Separation

Every auth form is split into two files:

| Layer     | File               | Responsibility                                                                                                 |
| --------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| **UI**    | `sign-*-form.tsx`  | Pure presentational. Receives typed props and callbacks. Zero auth logic, zero `useRouter`, zero `authClient`. |
| **Logic** | `sign-*-logic.tsx` | `"use client"`. Holds React state, zod validation, `authClient` calls. Passes everything down to UI.           |

```
┌──────────────────────────────────────────┐
│  app/sign-in/page.tsx  (RSC wrapper)     │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  SignInLogic  ("use client")     │   │
│   │  - form state (React.useState)   │   │
│   │  - zod validation                │   │
│   │  - authClient.signIn.email()     │   │
│   │  - authClient.signIn.social()    │   │
│   │                                  │   │
│   │   ┌──────────────────────────┐   │   │
│   │   │  SignInFormUI            │   │   │
│   │   │  - Input fields          │   │   │
│   │   │  - Provider buttons      │   │   │
│   │   │  - Error display         │   │   │
│   │   │  - Loading states        │   │   │
│   │   │  (pure props, no logic)  │   │   │
│   │   └──────────────────────────┘   │   │
│   └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

This means you can:

- Replace the **entire UI** without touching auth logic
- Reuse the **same logic** with a completely different design
- Test the **UI in isolation** by passing mock props
- Test the **logic in isolation** without rendering any UI

---

## Customization Guide

### 1. Toggle Providers On/Off

All 10 providers live in `components/auth/providers.ts`. Each has an `enabled`
boolean:

```ts
// components/auth/providers.ts

// To enable Discord, just flip the flag:
{
  id: "discord",
  label: "Discord",
  icon: SiDiscord,
  brandColor: "#5865F2",
  enabled: true,   // <-- was false
}
```

Set the matching `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` env vars and
you're done. Every page that renders `<SignIn>` or `<SignUp>` picks up the
change automatically.

**Available providers (all 10):**

| Provider    | id          | Default  |
| ----------- | ----------- | -------- |
| Google      | `google`    | enabled  |
| GitHub      | `github`    | enabled  |
| Microsoft   | `microsoft` | enabled  |
| Apple       | `apple`     | enabled  |
| Facebook    | `facebook`  | enabled  |
| LinkedIn    | `linkedin`  | enabled  |
| Discord     | `discord`   | disabled |
| Twitter / X | `twitter`   | disabled |
| Twitch      | `twitch`    | disabled |
| Spotify     | `spotify`   | disabled |

---

### 2. Override Providers Per-Page

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

`providerOverrides` is typed as
`Partial<Record<SocialProvider, { enabled?: boolean; label?: string }>>`, so
you only specify what you want to change.

---

### 3. Change Redirect Paths

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

### 4. Custom Headings and Copy

The sign-up/sign-in pages (`app/sign-up/page.tsx`, `app/sign-in/page.tsx`) are
plain React Server Components. To change headings, descriptions, or footer
text, edit the page file directly -- the card wrapper lives there:

```tsx
// app/sign-up/page.tsx
export default function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Change heading and description here */}
          <CardTitle className="text-2xl">Join the waitlist</CardTitle>
          <CardDescription>
            Create your account to get early access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp />
        </CardContent>
        <CardFooter className="justify-center">
          {/* Change footer link text here */}
          <p className="text-muted-foreground text-sm">
            Already on the list?{" "}
            <Link
              href="/sign-in"
              className="text-foreground font-medium hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
```

---

### 5. Add a Brand-New Provider Icon

Create any component that satisfies `AuthIconComponent` (a
`React.ComponentType<IconProps>` -- receives `size`, `className`, `style`).

A ready-to-edit template is already at `components/auth/custom-icon.tsx`:

```tsx
// components/auth/custom-icon.tsx
import type { IconProps } from "@/types/auth";

export function CustomIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Replace with your SVG path(s) */}
      <path d="M12 0 L24 24 L0 24 Z" />
    </svg>
  );
}
```

Rename the file and the component to match your provider, then add it to
the `PROVIDERS` array in `components/auth/providers.ts`:

```ts
import { CustomIcon } from "@/components/auth/custom-icon"

// Add to the PROVIDERS array:
{
  id: "spotify",      // must match a SocialProvider union member
  label: "Spotify",
  icon: CustomIcon,
  brandColor: "#1DB954",
  enabled: true,
}
```

To add an entirely new provider ID, also extend the `SocialProvider` union in
`types/auth.ts`:

```ts
export type SocialProvider =
  | "google"
  | "github"
  // ...
  | "my-new-provider"; // <-- add here
```

And register it in `lib/auth.ts` under `socialProviders`.

---

### 6. Swap the Entire UI Shell

The UI components (`sign-in-form.tsx`, `sign-up-form.tsx`) are **pure
presentational** -- they only receive typed props and fire typed callbacks.
The full prop interfaces are:

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

**To swap the UI:**

1. Create your new form component (e.g. `my-sign-in-form.tsx`) that accepts
   `SignInFormProps`
2. Change one import in the logic file:

```tsx
// components/auth/sign-in/sign-in-logic.tsx

// Before:
import { SignInFormUI } from "./sign-in-form";

// After:
import { SignInFormUI } from "./my-sign-in-form";
```

That's it. Your new UI gets all the same state, validation, loading states,
and auth calls for free.

**Example minimal custom UI:**

```tsx
// components/auth/sign-in/my-sign-in-form.tsx
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
        placeholder="Email"
      />
      {fieldErrors.email && <span>{fieldErrors.email}</span>}

      <input
        type="password"
        value={values.password}
        onChange={(e) => onFieldChange("password", e.target.value)}
        placeholder="Password"
      />
      {fieldErrors.password && <span>{fieldErrors.password}</span>}

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
            <p.icon size={16} style={{ color: p.brandColor }} />
            {p.label}
          </button>
        ))}
    </form>
  );
}
```

---

### 7. Dark Mode

Dark mode is already wired. The `ThemeProvider` in `app/layout.tsx` uses
`next-themes` with `attribute="class"`. All components use Tailwind `dark:`
variants.

**Adding a theme toggle button:**

```tsx
"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}
```

The system theme is used by default. No changes needed to any auth component.

---

## Reading the Session

### Client components

```tsx
"use client";
import { authClient } from "@/lib/auth-client";

export function UserAvatar() {
  const { data: session } = authClient.useSession();
  if (!session) return null;
  return <img src={session.user.image ?? ""} alt={session.user.name} />;
}
```

### Server components

```ts
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  return <p>Hello, {session.user.name}</p>
}
```

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

---

## Tech Stack

| Layer      | Package                                          |
| ---------- | ------------------------------------------------ |
| Auth       | [better-auth](https://www.better-auth.com/) ^1.2 |
| Framework  | Next.js 16 App Router                            |
| UI         | shadcn/ui + Tailwind CSS v4                      |
| Icons      | react-icons/si (Simple Icons) + custom SVGs      |
| Validation | zod                                              |
| Types      | TypeScript -- strict, zero `any`                 |
