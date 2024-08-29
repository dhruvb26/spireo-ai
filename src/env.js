import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string(),
    MODEL: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    ASSEMBLY_API_KEY: z.string(),
    RAPIDAPI_KEY: z.string(),
    LINKEDIN_CLIENT_ID: z.string(),
    DATABASE_PASSWORD: z.string(),
    UPLOADTHING_SECRET: z.string(),
    UPLOADTHING_APP_ID: z.string(),
    CRON_SECRET: z.string(),
    LINKEDIN_CLIENT_SECRET: z.string(),
    SPIREO_SECRET_KEY: z.string(),
    NEXTAUTH_SECRET: z.string(),
    VERCEL_URL: z.string(),
    REDIS_CLOUD_PASSWORD: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    FRIGADE_API_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_PUBLIC_BASE_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    CRON_SECRET: process.env.CRON_SECRET,
    MODEL: process.env.MODEL,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
    ASSEMBLY_API_KEY: process.env.ASSEMBLY_API_KEY,
    SPIREO_SECRET_KEY: process.env.SPIREO_SECRET_KEY,
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    REDIS_CLOUD_PASSWORD: process.env.REDIS_CLOUD_PASSWORD,
    FRIGADE_API_KEY: process.env.FRIGADE_API_KEY,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
