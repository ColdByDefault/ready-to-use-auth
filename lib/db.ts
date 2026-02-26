// lib/db.ts — Pick your database connection
//
// Keep exactly ONE option active. Comment out everything else.
// Then uncomment the matching `database:` line in lib/auth.ts.
//
// Each option is numbered so you can cross-reference the two files easily.
// ---------------------------------------------------------------------------

// ── Option 1 · Prisma + PostgreSQL (default) ─────────────────────────────────
//
//   Uses the Prisma pg driver adapter for a direct connection pool — no
//   DATABASE_URL connection string rewriting, works with connection poolers
//   (PgBouncer, Supabase, Neon, etc.) out of the box.
//
//   Packages:  prisma  @prisma/adapter-pg  pg
//   Migrations:
//     npx @better-auth/cli@latest generate   ← updates schema.prisma
//     npx prisma migrate dev                  ← applies it to your DB
//
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

// ── Option 2 · Prisma + MySQL / SQLite / CockroachDB ──────────────────────────
//
//   Standard Prisma client — no driver adapter needed for non-pg providers.
//   Change the `provider` in prisma/schema.prisma datasource to match.
//
//   Packages:  prisma
//   Migrations:
//     npx @better-auth/cli@latest generate   ← updates schema.prisma
//     npx prisma migrate dev
//
// import { PrismaClient } from "../generated/prisma/client";
// export const prisma = new PrismaClient();

// ── Option 3 · Drizzle ORM ────────────────────────────────────────────────────
//
//   Uncomment the single import line for your database engine, then the
//   shared export line below it.
//
//   Packages (pick one): drizzle-orm + drizzle-kit + the DB driver
//   Migrations:
//     npx @better-auth/cli@latest generate   ← writes Drizzle schema file
//     npx drizzle-kit generate               ← generates migration file
//     npx drizzle-kit migrate                ← applies migration to your DB
//
// import { drizzle } from "drizzle-orm/node-postgres";   // PostgreSQL
// import { drizzle } from "drizzle-orm/mysql2";           // MySQL
// import { drizzle } from "drizzle-orm/better-sqlite3";   // SQLite
// import * as schema from "./schema";                      // your generated Drizzle schema
// export const db = drizzle(process.env.DATABASE_URL!, { schema });

// ── Option 4 · MongoDB ────────────────────────────────────────────────────────
//
//   No schema generation or migration needed — collections are created
//   automatically at runtime.
//   Pass `client` to enable multi-document transaction support.
//
//   Packages:  mongodb  better-auth/adapters/mongodb
//
// import { MongoClient } from "mongodb";
// const client = new MongoClient(process.env.DATABASE_URL!);
// export const db = client.db();
// export { client };

// ── Option 5 · Direct PostgreSQL — Kysely built-in ────────────────────────────
//
//   Skips the ORM layer entirely. Better Auth talks to postgres via Kysely.
//   Single migration command — no separate generate step.
//
//   Packages:  pg
//   Migrations:  npx @better-auth/cli migrate
//
// import { Pool } from "pg";
// export const db = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Option 6 · Direct MySQL — Kysely built-in ─────────────────────────────────
//
//   Packages:  mysql2
//   Migrations:  npx @better-auth/cli migrate
//
// import mysql from "mysql2/promise";
// export const db = mysql.createPool(process.env.DATABASE_URL!);

// ── Option 7 · Direct SQLite / better-sqlite3 — Kysely built-in ──────────────
//
//   Packages:  better-sqlite3  @types/better-sqlite3
//   Migrations:  npx @better-auth/cli migrate
//
// import Database from "better-sqlite3";
// export const db = new Database("./dev.db");

// ── Option 8 · Bun SQLite — Kysely built-in ───────────────────────────────────
//
//   Bun runtime only. No extra packages needed.
//   Migrations:  npx @better-auth/cli migrate
//
// import { Database } from "bun:sqlite";
// export const db = new Database("./dev.db");
