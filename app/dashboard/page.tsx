import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { isDemoMode, getDemoSession } from "@/lib/demo-session";

export default async function DashboardPage() {
  // ---------------------------------------------------------------------------
  // Demo / showcase mode — use the lightweight cookie session instead of
  // calling Better Auth (which would hit the database).
  // ---------------------------------------------------------------------------
  let user: { name?: string | null; email: string };

  if (isDemoMode()) {
    const demoSession = await getDemoSession();
    if (!demoSession) redirect("/sign-in");
    user = demoSession;
  } else {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/sign-in");
    user = session.user;
  }

  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user.name || "User"}!</p>
      <p className="text-muted-foreground text-sm">Email: {user.email}</p>
      <SignOutButton />
    </main>
  );
}
