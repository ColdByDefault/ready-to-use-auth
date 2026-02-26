import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-border/50 border-t px-6 py-5 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-muted-foreground text-xs">
          Built by{" "}
          <Link
            href="https://github.com/ColdByDefault"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            ColdByDefault© {new Date().getFullYear()}
          </Link>{" "}
          · <span className="text-gray-300 font-bold">MIT License</span>
        </p>
        <Link
          href="https://github.com/ColdByDefault/ready-to-use-auth"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
        >
          View on GitHub
        </Link>
      </div>
    </footer>
  );
}
