import { db } from "../db/db";
import { Book, BookAuthor, BookGenre } from "../db/schema";
import { inArray } from "drizzle-orm";

export async function getBooksByIds(bookIds: number[]) {
  return db
    .select({
      id: Book.id,
      title: Book.title,
      averageRating: Book.average_rating,
      ratingsCount: Book.ratings_count,
      coverImage: Book.cover_image,
      pageCount: Book.page_count,
      description: Book.description,
      normalizedTitle: Book.normalized_title,
      publicationYear: Book.publication_year,
    })
    .from(Book)
    .where(inArray(Book.id, bookIds))
    .execute();
}

export async function getAuthorsByBookIds(bookIds: number[]) {
  return db
    .select({
      bookId: BookAuthor.book_id,
      name: BookAuthor.name,
    })
    .from(BookAuthor)
    .where(inArray(BookAuthor.book_id, bookIds))
    .execute();
}

export async function getGenresByBookIds(bookIds: number[]) {
  return db
    .select({
      bookId: BookGenre.book_id,
      genre: BookGenre.genre,
    })
    .from(BookGenre)
    .where(inArray(BookGenre.book_id, bookIds))
    .execute();
}
