import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
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
          <SignIn />
        </div>

        {/* Footer note */}
        <p className="text-muted-foreground mt-6 text-center text-xs leading-relaxed">
          Protected by better-auth. Your credentials are never stored in plain
          text.
        </p>
      </div>
    </main>
  );
}
