ALTER TABLE "spireo.ai_draft" RENAME COLUMN "title" TO "document_title";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name" ON "spireo.ai_draft" USING btree ("content");