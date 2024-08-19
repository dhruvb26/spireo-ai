import { type Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    database: "postgres",
    host: "aws-0-us-west-1.pooler.supabase.com",
    port: 6543,
    url: env.DATABASE_URL,
    password: "PJbxQrac5af0SYBx",
    user: "postgres.cwhreifatenhdzazycsn",
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;
