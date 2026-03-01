import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FlaskConical } from "lucide-react";
import { SignIn } from "@/components/auth/sign-in";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account.",
};

/**
 * Sign-in page — pure RSC wrapper.
 * All interactivity lives inside the SignIn (SignInLogic) component.
 *
 * Customise the auth flow by passing props to <SignIn>:
 *   <SignIn
 *     callbackConfig={{ callbackURL: "/dashboard", errorCallbackURL: "/auth-error" }}
 *     providerOverrides={{ discord: { enabled: true } }}
 *   />
 */
export default function SignInPage() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const demoEmail = process.env.DEMO_EMAIL;
  const demoPassword = process.env.DEMO_PASSWORD;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* add Logo here */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Image
            src="/icon.svg"
            alt="Logo"
            width={32}
            height={32}
            className="dark:invert [.midnight-purple_&]:invert [.gray_&]:invert"
          />
          <span className="sr-only">Back to home</span>
        </Link>

        {/* Demo credentials hint */}
        {isDemo && demoEmail && demoPassword && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Showcase — use demo credentials
              </span>
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 space-y-0.5 font-mono">
              <p>Email: {demoEmail}</p>
              <p>Password: {demoPassword}</p>
            </div>
          </div>
        )}

        {/* Card shell */}
        <div className="bg-card border-border rounded-xl border p-8 shadow-sm">
          <SignIn />
        </div>

        {/* Footer note */}
        <p className="text-muted-foreground mt-6 text-center text-xs leading-relaxed">
          {isDemo
            ? "This is a read-only showcase. No real data is stored."
            : "Protected by better-auth. Your credentials are never stored in plain text."}
        </p>
      </div>
    </main>
  );
}
