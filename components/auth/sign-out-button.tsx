"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
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
