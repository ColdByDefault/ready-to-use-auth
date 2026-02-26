import type { IconProps } from "@/types/auth";

/**
 * Template for a custom provider icon.
 *
 * Implements `AuthIconComponent` — a drop-in replacement for react-icons icons.
 * Receives `size`, `className`, and `style` so it behaves identically to any
 * react-icons icon in the provider button grid.
 *
 * How to use:
 *   1. Replace the <path> below with your own SVG path data.
 *   2. Adjust `viewBox` to match your SVG's coordinate system if needed.
 *   3. Rename the component and the file to match your provider
 *      (e.g. `SlackIcon` in `slack-icon.tsx`).
 *   4. Add it to `components/auth/providers.ts`:
 *
 *        import { CustomIcon } from "@/components/auth/custom-icon"
 *
 *        { id: "slack", label: "Slack", icon: CustomIcon,
 *          brandColor: "#4A154B", enabled: true }
 *
 *   5. If the provider ID is not already in the SocialProvider union in
 *      `types/auth.ts`, add it there and register it in `lib/auth.ts`.
 */
export function CustomIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Replace with your SVG path(s) */}
      <path d="M12 0 L24 24 L0 24 Z" />
    </svg>
  );
}
