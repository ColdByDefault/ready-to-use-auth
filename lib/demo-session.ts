/**
 * demo-session.ts
 *
 * Utilities for demo/showcase mode (NEXT_PUBLIC_DEMO_MODE=true).
 * When demo mode is active, a lightweight cookie-based session replaces
 * Better Auth + the database entirely.
 *
 * To disable demo mode (after cloning): remove NEXT_PUBLIC_DEMO_MODE from
 * your environment variables (or set it to "false"). The normal Better Auth
 * flow will be used automatically.
 */

import { cookies } from "next/headers";

// Name of the HttpOnly cookie that tracks the demo session.
export const DEMO_COOKIE = "demo_session";

export interface DemoUser {
  name: string;
  email: string;
}

/** Returns true when the app is running in showcase/demo mode. */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Reads the demo session cookie and returns the embedded user info.
 * Returns null if not in demo mode or if the cookie is absent / malformed.
 * Server-only (uses next/headers).
 */
export async function getDemoSession(): Promise<DemoUser | null> {
  if (!isDemoMode()) return null;

  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(
      Buffer.from(raw, "base64url").toString("utf-8"),
    ) as DemoUser;
  } catch {
    return null;
  }
}
