import { defineConfig } from "drizzle-kit";
process.env.DATABASE_URL = "postgresql://postgres:IhQe7ciN1OyncnwV@db.hkjsjlzmmqfpmvfvysiy.supabase.co:5432/postgres";
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
