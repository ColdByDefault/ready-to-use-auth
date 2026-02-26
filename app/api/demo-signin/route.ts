/**
 * POST /api/demo-signin
 *
 * Only active when NEXT_PUBLIC_DEMO_MODE=true.
 * Validates the submitted credentials against DEMO_EMAIL / DEMO_PASSWORD and
 * issues a lightweight HttpOnly cookie that the rest of the app treats as a
 * "demo session".
 *
 * To disable: remove NEXT_PUBLIC_DEMO_MODE (or set it to "false") and this
 * route will return 404, leaving all auth to Better Auth.
 */

import { NextResponse } from "next/server";
import type { DemoUser } from "@/lib/demo-session";
import { DEMO_COOKIE } from "@/lib/demo-session";

export async function POST(request: Request) {
  // Guard: only available in demo mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  let email: string;
  let password: string;

  try {
    ({ email, password } = (await request.json()) as {
      email: string;
      password: string;
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const demoEmail = process.env.DEMO_EMAIL;
  const demoPassword = process.env.DEMO_PASSWORD;

  if (
    !demoEmail ||
    !demoPassword ||
    email !== demoEmail ||
    password !== demoPassword
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Build a base64url-encoded payload — not sensitive (showcase only)
  const user: DemoUser = { name: "Demo User", email: demoEmail };
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_COOKIE, payload, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
