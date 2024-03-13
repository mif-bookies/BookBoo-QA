ALTER TABLE "BookAuthor" DROP CONSTRAINT "BookAuthor_book_id_Book_id_fk";
--> statement-breakpoint
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_book_id_Book_id_fk";
--> statement-breakpoint
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "CollectionBook" DROP CONSTRAINT "CollectionBook_collection_id_Collection_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_book_id_Book_id_fk" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_book_id_Book_id_fk" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Collection" ADD CONSTRAINT "Collection_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_collection_id_Collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
