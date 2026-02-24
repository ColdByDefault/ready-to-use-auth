# Better Auth Components

Fully customisable, type-safe authentication UI components built on top of
[Better Auth](https://www.better-auth.com/), Next.js 16 App Router, shadcn/ui,
and Tailwind CSS v4. UI and business logic are strictly separated — swap out
the form shell without touching a single line of auth code, or change providers
in one place and have every page update automatically.

---

## File Structure

```
.
├── app/
│   ├── page.tsx                          # Landing page — Sign In / Sign Up redirect buttons
│   ├── sign-in/page.tsx                  # Sign-in route (RSC wrapper)
│   ├── sign-up/page.tsx                  # Sign-up route (RSC wrapper)
│   └── api/auth/[...all]/route.ts        # Better Auth catch-all handler
│
├── components/auth/
│   ├── providers.ts                      # All 10 providers — flip `enabled` to show/hide
│   ├── microsoft-icon.tsx                # Inline SVG Windows logo (drop-in for react-icons)
│   │
│   ├── sign-in/
│   │   ├── sign-in-form.tsx              # Pure UI — zero logic, only props/callbacks
│   │   ├── sign-in-logic.tsx             # Controller — auth calls, validation, state
│   │   └── index.ts                      # Re-exports SignInLogic as `SignIn`
│   │
│   └── sign-up/
│       ├── sign-up-form.tsx              # Pure UI — zero logic, only props/callbacks
│       ├── sign-up-logic.tsx             # Controller — auth calls, validation, state
│       └── index.ts                      # Re-exports SignUpLogic as `SignUp`
│
├── lib/
│   ├── auth.ts                           # Server-side Better Auth instance
│   └── auth-client.ts                    # Client-side auth client + Session type
│
└── types/
    └── auth.ts                           # All shared types (no `any`)
```

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

At a minimum you need:

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Random secret — run `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Base URL of your app, e.g. `http://localhost:3000` |

Add credentials for each provider you want to enable (see `.env.example` for
links to every developer console).

### 3. Add a database adapter

Open `lib/auth.ts` and uncomment the `database` key for your adapter:

```ts
// lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  // ...
})
```

Better Auth supports Drizzle, Prisma, Mongoose, and raw `pg`/`mysql2`.
See the [Better Auth docs](https://www.better-auth.com/docs/concepts/database)
for the full list.

### 4. Run the dev server

```bash
pnpm dev
```

Visit `http://localhost:3000` — you will see the landing page with buttons
linking to `/sign-in` and `/sign-up`.

---

## Customising Providers

All providers are declared in `components/auth/providers.ts`. Each entry has:

| Field | Type | Description |
|---|---|---|
| `id` | `SocialProvider` | Better Auth provider id |
| `label` | `string` | Button label text |
| `icon` | `AuthIconComponent` | Any `React.ComponentType<IconProps>` |
| `brandColor` | `string` | Hex — applied as the icon fill colour |
| `enabled` | `boolean` | `true` = visible in UI, `false` = hidden |

To enable Discord, for example:

```ts
// components/auth/providers.ts
{
  id: "discord",
  label: "Discord",
  icon: SiDiscord,
  brandColor: "#5865F2",
  enabled: true,   // <-- flip this
},
```

Make sure the corresponding `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` env
vars are set.

---

## Customising Redirect Paths

Every page that renders `<SignIn>` or `<SignUp>` can override the redirect
behaviour without touching the components themselves:

```tsx
// app/sign-in/page.tsx
import { SignIn } from "@/components/auth/sign-in"

export default function SignInPage() {
  return (
    <SignIn
      callbackConfig={{
        callbackURL: "/dashboard",
        errorCallbackURL: "/sign-in",
      }}
    />
  )
}
```

```tsx
// app/sign-up/page.tsx
import { SignUp } from "@/components/auth/sign-up"

export default function SignUpPage() {
  return (
    <SignUp
      callbackConfig={{
        callbackURL: "/onboarding",         // after email sign-up
        newUserCallbackURL: "/welcome",     // after OAuth sign-up (new user)
        errorCallbackURL: "/sign-up",
      }}
    />
  )
}
```

---

## Overriding Providers at the Call-Site

You can also enable/disable or rename providers per-page without touching
`providers.ts`:

```tsx
<SignIn
  providerOverrides={{
    discord: { enabled: true, label: "Sign in with Discord" },
    github: { enabled: false },
  }}
/>
```

---

## Reading the Session

Import the typed `authClient` wherever you need session data:

```tsx
"use client"
import { authClient } from "@/lib/auth-client"

export function UserAvatar() {
  const { data: session } = authClient.useSession()
  if (!session) return null
  return <img src={session.user.image ?? ""} alt={session.user.name} />
}
```

For server components, use the `auth` instance directly:

```ts
// app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  return <p>Hello, {session.user.name}</p>
}
```

---

## Extending the UI

The UI (`sign-in-form.tsx`, `sign-up-form.tsx`) receives only typed props and
fires only typed callbacks — it contains zero auth logic. To swap the look
entirely, replace the form file contents while keeping the same prop interface
defined in `types/auth.ts` (`SignInFormProps` / `SignUpFormProps`).

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
```

---

## Tech Stack

| Layer | Package |
|---|---|
| Auth | [better-auth](https://www.better-auth.com/) ^1.2 |
| Framework | Next.js 16 App Router |
| UI | shadcn/ui + Tailwind CSS v4 |
| Icons | react-icons/si (Simple Icons) |
| Validation | zod |
| Types | TypeScript — strict, zero `any` |
