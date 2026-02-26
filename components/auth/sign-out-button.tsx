"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Demo mode — clear the lightweight cookie session
      await fetch("/api/demo-signout", { method: "POST" });
    } else {
      // Normal mode — Better Auth
      await signOut();
    }
    router.push("/sign-in");
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full bg-foreground text-background font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
    >
      Sign Out
    </button>
  );
}
