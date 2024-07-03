CREATE TABLE IF NOT EXISTS "spireo.ai_linked_in_post" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"content" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
ALTER TABLE "spireo.ai_idea" RENAME COLUMN "name" TO "user_id";--> statement-breakpoint
ALTER TABLE "spireo.ai_idea" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "spireo.ai_idea" ALTER COLUMN "id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "spireo.ai_idea" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "spireo.ai_idea" ADD COLUMN "content" text;