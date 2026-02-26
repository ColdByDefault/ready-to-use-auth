import pkg from "@/package.json";

/**
 * Reads the version at build time from package.json.
 * Pure RSC — no client code needed.
 */
export function VersionBadge() {
  return (
    <span className="bg-muted text-muted-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs">
      <span className="size-1.5 rounded-full bg-green-500" />v{pkg.version}
    </span>
  );
}
