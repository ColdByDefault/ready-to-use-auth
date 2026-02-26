import { betterAuth } from "better-auth";

// ── Step 1 of 2: pick an adapter import ─────────────────────────────────────
// Uncomment the line that matches the option you activated in lib/db.ts.
import { prismaAdapter } from "better-auth/adapters/prisma"; // Options 1 & 2
// import { drizzleAdapter } from "better-auth/adapters/drizzle";  // Option 3
// import { mongodbAdapter } from "better-auth/adapters/mongodb";  // Option 4
// (Options 5-8 need no adapter import — pass `db` directly)

// ── Step 2 of 2: pick a client import ───────────────────────────────────────
// Uncomment the line that matches your lib/db.ts export.
import { prisma } from "./db"; // Options 1 & 2  (Prisma)
// import { db } from "./db";              // Options 3, 5, 6, 7, 8
// import { db, client } from "./db";     // Option 4  (MongoDB)
// ────────────────────────────────────────────────────────────────────────────

export const auth = betterAuth({
  // ── database ──────────────────────────────────────────────────────────────
  // Keep exactly ONE line active — must match the option in lib/db.ts.
  // Full reference: https://www.better-auth.com/docs/concepts/database
  database: prismaAdapter(prisma, { provider: "postgresql" }), // Option 1  ← default
  // database: prismaAdapter(prisma, { provider: "mysql" }),        // Option 2a
  // database: prismaAdapter(prisma, { provider: "sqlite" }),       // Option 2b
  // database: prismaAdapter(prisma, { provider: "cockroachdb" }),  // Option 2c
  // database: drizzleAdapter(db, { provider: "pg" }),              // Option 3a
  // database: drizzleAdapter(db, { provider: "mysql" }),           // Option 3b
  // database: drizzleAdapter(db, { provider: "sqlite" }),          // Option 3c
  // database: mongodbAdapter(db, { client }),                      // Option 4
  // database: db,                                                  // Options 5 – 8  (direct / Kysely)
  //
  // ── experimental joins (all adapters) ────────────────────────────────────
  // Reduces DB round-trips by 2–3×. Requires relations in your Prisma/Drizzle
  // schema — run `npx @better-auth/cli@latest generate` to add them, then:
  // experimental: { joins: true },
  // ─────────────────────────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // --- Default-enabled ---
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    },

    // --- Available but disabled in UI by default ---
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    },
  },
});
