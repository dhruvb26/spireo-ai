import { type Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    database: "postgres",
    host: "aws-0-us-west-1.pooler.supabase.com",
    port: 6543,
    url: env.DATABASE_URL,
    password: env.DATABASE_PASSWORD,
    user: "postgres.cwhreifatenhdzazycsn",
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;
