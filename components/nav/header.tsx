import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { VersionBadge } from "@/components/landing-default/version-badge";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-2 sm:px-10">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
          <ShieldCheck className="size-4" />
        </div>
        <Link href="/">
          {" "}
          <span className="text-sm font-semibold tracking-tight">
            ready-to-use-auth
          </span>
        </Link>
      </div>
      <VersionBadge />
    </header>
  );
}
