/**
 * POST /api/demo-signout
 *
 * Clears the demo session cookie set by /api/demo-signin.
 * Safe to call even when the cookie is absent.
 */

import { NextResponse } from "next/server";
import { DEMO_COOKIE } from "@/lib/demo-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(DEMO_COOKIE);
  return response;
}
