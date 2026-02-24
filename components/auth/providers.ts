import {
  SiGoogle,
  SiGithub,
  SiDiscord,
  SiX,
  SiFacebook,
  SiApple,
  SiTwitch,
  SiSpotify,
  SiLinkedin,
} from "react-icons/si";

import { MicrosoftIcon } from "@/components/auth/microsoft-icon";
import type { ProviderConfig } from "@/types/auth";

/**
 * All 10 supported OAuth providers.
 *
 * - `enabled: true`  → shown in the sign-in / sign-up UI by default.
 * - `enabled: false` → scaffolded on the server (lib/auth.ts) but hidden in
 *   the UI. Flip the flag to activate them without any other changes.
 * - `brandColor`     → applied as the icon's inline color for instant visual
 *   recognition while keeping the button itself neutral/outline.
 */
export const PROVIDERS: ProviderConfig[] = [
  {
    id: "google",
    label: "Google",
    icon: SiGoogle,
    brandColor: "#4285F4",
    enabled: true,
  },
  {
    id: "github",
    label: "GitHub",
    icon: SiGithub,
    brandColor: "#24292E",
    enabled: true,
  },
  {
    id: "microsoft",
    label: "Microsoft",
    icon: MicrosoftIcon,
    brandColor: "#00A4EF",
    enabled: true,
  },
  {
    id: "apple",
    label: "Apple",
    icon: SiApple,
    brandColor: "#000000",
    enabled: true,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: SiFacebook,
    brandColor: "#1877F2",
    enabled: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: SiLinkedin,
    brandColor: "#0A66C2",
    enabled: true,
  },
  {
    id: "discord",
    label: "Discord",
    icon: SiDiscord,
    brandColor: "#5865F2",
    enabled: false,
  },
  {
    id: "twitter",
    label: "Twitter / X",
    icon: SiX,
    brandColor: "#000000",
    enabled: false,
  },
  {
    id: "twitch",
    label: "Twitch",
    icon: SiTwitch,
    brandColor: "#9146FF",
    enabled: false,
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: SiSpotify,
    brandColor: "#1DB954",
    enabled: false,
  },
];

/** Convenience — only the providers currently visible in the UI. */
export const ENABLED_PROVIDERS = PROVIDERS.filter((p) => p.enabled);
