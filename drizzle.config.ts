import { defineConfig } from "drizzle-kit";
process.env.DATABASE_URL =
  "postgresql://postgres.ldzwdhsvdnqnimirszih:2RgmDAFJdUgIfsxx@aws-0-us-east-2.pooler.supabase.com:5432/postgres";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
