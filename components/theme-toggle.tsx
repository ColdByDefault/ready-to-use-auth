"use client";

import * as React from "react";
import {
  Check,
  Leaf,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Waves,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "ocean-blue", label: "Ocean Blue", Icon: Waves },
  { id: "forest-green", label: "Forest Green", Icon: Leaf },
  { id: "gray", label: "Gray", Icon: Palette },
  { id: "midnight-purple", label: "Midnight Purple", Icon: Sparkles },
  { id: "system", label: "System", Icon: Monitor },
] as const;

function TriggerIcon({
  theme,
  resolvedTheme,
}: {
  theme: string | undefined;
  resolvedTheme: string | undefined;
}) {
  if (theme === "ocean-blue") return <Waves className="size-[1.1rem]" />;
  if (theme === "forest-green") return <Leaf className="size-[1.1rem]" />;
  if (theme === "gray") return <Palette className="size-[1.1rem]" />;
  if (theme === "midnight-purple")
    return <Sparkles className="size-[1.1rem]" />;
  if (resolvedTheme === "dark") return <Moon className="size-[1.1rem]" />;
  return <Sun className="size-[1.1rem]" />;
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch: next-themes only knows the resolved theme on the
  // client. Render a neutral Sun icon on the server; swap in the real icon
  // after the first client-side paint.
  React.useEffect(() => setMounted(true), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          {mounted ? (
            <TriggerIcon theme={theme} resolvedTheme={resolvedTheme} />
          ) : (
            <Sun className="size-[1.1rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map(({ id, label, Icon }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setTheme(id)}
            className="gap-2"
          >
            <Icon className="size-4 text-muted-foreground" />
            <span>{label}</span>
            {theme === id && <Check className="ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Backwards-compatible alias
export { ThemeToggle as ModeToggle };
