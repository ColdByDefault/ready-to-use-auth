import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { DEMO_COOKIE } from "@/lib/demo-session";

// ---------------------------------------------------------------------------
// Routes that require an active session.
// Add any new protected path prefixes here.
// ---------------------------------------------------------------------------
const PROTECTED_ROUTES = ["/dashboard"];

// ---------------------------------------------------------------------------
// Auth routes that should redirect already-authenticated users away.
// ---------------------------------------------------------------------------
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Nothing to check for public routes
  if (!isProtected && !isAuthRoute) return NextResponse.next();

  // ---------------------------------------------------------------------------
  // Demo / showcase mode — skip Better Auth + the database entirely.
  // Presence of the demo_session cookie is the only auth signal needed.
  // To disable: remove NEXT_PUBLIC_DEMO_MODE (or set it to "false").
  // ---------------------------------------------------------------------------
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const hasDemoSession = request.cookies.has(DEMO_COOKIE);

    if (isProtected && !hasDemoSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    if (isAuthRoute && hasDemoSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  // Unauthenticated user hitting a protected route → send to sign-in
  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting an auth route → send to dashboard
  if (isAuthRoute && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
