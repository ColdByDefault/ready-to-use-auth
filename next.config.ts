import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // this is for demo purposes only — in production, you should serve SVGs from a trusted source and use a more restrictive CSP
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
