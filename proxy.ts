import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
