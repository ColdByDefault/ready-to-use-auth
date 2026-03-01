import Link from "next/link";
import Image from "next/image";
import { VersionBadge } from "@/components/landing-default/version-badge";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-2 sm:px-10">
      <div className="flex items-center gap-2">
        <Image
          src="/icon.svg"
          alt="Logo"
          width={28}
          height={28}
          className="dark:invert [.midnight-purple_&]:invert [.gray_&]:invert"
        />
        <Link href="/">
          {" "}
          <span className="text-sm font-semibold tracking-tight">
            ready-to-use-auth
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <VersionBadge />
        <ThemeToggle />
      </div>
    </header>
  );
}
