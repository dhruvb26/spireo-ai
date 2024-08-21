CREATE TABLE IF NOT EXISTS "spireo.ai_post_format" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"templates" jsonb NOT NULL,
	"category" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spireo.ai_post_format" ADD CONSTRAINT "spireo.ai_post_format_user_id_spireo.ai_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."spireo.ai_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
