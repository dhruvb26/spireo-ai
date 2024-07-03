ALTER TABLE "spireo.ai_draft" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "spireo.ai_draft" ("content");