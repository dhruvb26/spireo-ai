import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",

  dbCredentials: {
    database: "postgres",
    host: "aws-0-us-west-1.pooler.supabase.com",
    port: 5432,
    url: env.DATABASE_URL,
    password: "fGgO3v2WU4M7sQMt",
    user: "postgres.xcmunoprvgyctysmjdjb",
  },
  tablesFilter: ["spireo.ai_*"],
} satisfies Config;
