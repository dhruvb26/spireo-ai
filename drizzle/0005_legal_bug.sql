CREATE TABLE IF NOT EXISTS "spireo.ai_creator" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"profile_image_url" varchar(256),
	"full_name" varchar(128),
	"headline" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spireo.ai_post" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"creator_id" varchar(256) NOT NULL,
	"images" jsonb,
	"document" jsonb,
	"video" jsonb,
	"num_appreciations" integer DEFAULT 0,
	"num_comments" integer DEFAULT 0,
	"num_empathy" integer DEFAULT 0,
	"num_interests" integer DEFAULT 0,
	"num_likes" integer DEFAULT 0,
	"num_reposts" integer DEFAULT 0,
	"post_url" varchar(256),
	"reshared" boolean DEFAULT false,
	"text" text,
	"time" varchar(64),
	"urn" varchar(64),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spireo.ai_post" ADD CONSTRAINT "spireo.ai_post_creator_id_spireo.ai_creator_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."spireo.ai_creator"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
