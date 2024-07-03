ALTER TABLE "spireo.ai_draft" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "spireo.ai_draft" ALTER COLUMN "id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "spireo.ai_draft" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "spireo.ai_draft" ADD COLUMN "user_id" varchar(256);--> statement-breakpoint
ALTER TABLE "spireo.ai_draft" ADD COLUMN "linked_in_id" varchar(256);