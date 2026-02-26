import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SignUp } from "@/components/auth/sign-up";

export const metadata: Metadata = {
  title: "Create account",
  description: "Sign up for a new account.",
};

/**
 * Sign-up page — pure RSC wrapper.
 * All interactivity lives inside the SignUp (SignUpLogic) component.
 *
 * Customise the auth flow by passing props to <SignUp>:
 *   <SignUp
 *     callbackConfig={{ callbackURL: "/onboarding", newUserCallbackURL: "/welcome" }}
 *     providerOverrides={{ discord: { enabled: true } }}
 *   />
 */
export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* add Logo here */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <ShieldCheck className="size-4" />
          </div>
          <span className="sr-only">Back to home</span>
        </Link>

        {/* Card shell */}
        <div className="bg-card border-border rounded-xl border p-8 shadow-sm">
          <SignUp />
        </div>

        {/* Footer note */}
        <p className="text-muted-foreground mt-6 text-center text-xs leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
