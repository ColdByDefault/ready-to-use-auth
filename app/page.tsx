import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Root landing page — two CTA buttons routing to sign-in and sign-up.
 * All layout is a pure RSC; no client code needed here.
 */
export default function HomePage() {
  return (
    <main className="from-background to-muted/30 flex min-h-screen flex-col items-center justify-center bg-linear-to-b px-4">
      <div className="flex max-w-sm flex-col items-center gap-8 text-center">
        {/* Logo mark */}
        <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-2xl shadow-lg">
          <ShieldCheck className="size-7" />
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-2">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            Better Auth Components
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
            Fully customizable, type-safe authentication powered by{" "}
            <span className="text-foreground font-medium">better-auth</span>.
            Pick a flow to get started.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1" size="lg">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1" size="lg">
            <Link href="/sign-up">Create account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
