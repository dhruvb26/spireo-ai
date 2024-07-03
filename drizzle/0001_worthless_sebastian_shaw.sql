ALTER TABLE "spireo.ai_draft" RENAME COLUMN "name" TO "content";--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "spireo.ai_draft" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "spireo.ai_draft" ("content");