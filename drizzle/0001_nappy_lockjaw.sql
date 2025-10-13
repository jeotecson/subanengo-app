ALTER TYPE "public"."type" ADD VALUE 'SCRAMBLED';--> statement-breakpoint
CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" integer NOT NULL,
	"storyTitle" text NOT NULL,
	"story" text NOT NULL,
	"translation" text NOT NULL,
	"audio_src" text
);
--> statement-breakpoint
ALTER TABLE "user_subscription" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_subscription" CASCADE;--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenge_options" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "challenge_options" ADD COLUMN "slot_order" integer;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "correct_answer" text;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "scramble_letters" text;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;