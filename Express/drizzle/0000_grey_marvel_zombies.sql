CREATE TABLE IF NOT EXISTS "Book" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"average_rating" real NOT NULL,
	"ratings_count" integer NOT NULL,
	"cover_image" varchar(100) NOT NULL,
	"page_count" integer NOT NULL,
	"description" text NOT NULL,
	"normalized_title" varchar(200) NOT NULL,
	"publication_year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "BookAuthor" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "BookGenre" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"genre" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Collection" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date DEFAULT now() NOT NULL,
	"public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CollectionBook" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"username" varchar(200) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_book_id_Book_id_fk" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_book_id_Book_id_fk" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Collection" ADD CONSTRAINT "Collection_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_collection_id_Collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_book_id_Book_id_fk" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
