import type { IconProps } from "@/types/auth";

/**
 * Inline SVG of the Microsoft Windows four-square logo.
 * Implements AuthIconComponent so it is a drop-in for react-icons icons.
 */
export function MicrosoftIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 21 21"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="9.5" height="9.5" fill="#F25022" />
      <rect x="11" y="0" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="0" y="11" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="11" y="11" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}
