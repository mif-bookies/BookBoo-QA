import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import {
  Book,
  BookAuthor,
  BookGenre,
  Collection,
  CollectionBook,
  User,
} from "../db/schema";

export async function getPublicCollections() {
  return db
    .select({
      id: Collection.id,
      name: Collection.name,
      creatorName: User.username,
    })
    .from(Collection)
    .innerJoin(User, eq(User.id, Collection.user_id))
    .where(eq(Collection.public, true))
    .execute();
}

export async function getUserCollections(userId: string) {
  return db
    .select({
      id: Collection.id,
      name: Collection.name,
      public: Collection.public,
    })
    .from(Collection)
    .where(eq(Collection.user_id, userId))
    .execute();
}

export async function getCollectionById(collectionId: number) {
  const collection = await db
    .select()
    .from(Collection)
    .where(eq(Collection.id, collectionId))
    .execute();
  return collection[0] || null;
}

export async function getBooksInCollection(collectionId: number) {
  return db
    .select({
      id: Book.id,
      title: Book.title,
      coverImage: Book.cover_image,
      pageCount: Book.page_count,
      description: Book.description,
      normalizedTitle: Book.normalized_title,
      publicationYear: Book.publication_year,
    })
    .from(CollectionBook)
    .innerJoin(Book, eq(Book.id, CollectionBook.book_id))
    .where(eq(CollectionBook.collection_id, collectionId))
    .execute();
}

export async function getBookAuthors(bookId: number) {
  return db
    .select({ name: BookAuthor.name })
    .from(BookAuthor)
    .where(eq(BookAuthor.book_id, bookId))
    .execute();
}

export async function getBookGenres(bookId: number) {
  return db
    .select({ genre: BookGenre.genre })
    .from(BookGenre)
    .where(eq(BookGenre.book_id, bookId))
    .execute();
}

export async function checkExistingCollection(userId: string, name: string) {
  return db
    .select()
    .from(Collection)
    .where(and(eq(Collection.user_id, userId), eq(Collection.name, name)))
    .execute();
}

export async function createCollection(
  name: string,
  userId: string,
  isPublic: boolean
) {
  const newCollection = await db
    .insert(Collection)
    .values({ name, user_id: userId, public: isPublic })
    .returning()
    .execute();
  return newCollection[0];
}

export async function checkBookExists(bookId: number) {
  const books = await db
    .select()
    .from(Book)
    .where(eq(Book.id, bookId))
    .execute();
  return books.length > 0;
}

export async function checkBookInCollection(
  collectionId: number,
  bookId: number
) {
  const entries = await db
    .select()
    .from(CollectionBook)
    .where(
      and(
        eq(CollectionBook.collection_id, collectionId),
        eq(CollectionBook.book_id, bookId)
      )
    )
    .execute();
  return entries.length > 0;
}

export async function addBookToCollection(
  collectionId: number,
  bookId: number
) {
  const addedBooks = await db
    .insert(CollectionBook)
    .values({ collection_id: collectionId, book_id: bookId })
    .returning()
    .execute();
  return addedBooks[0];
}

export async function removeBookFromCollection(
  collectionId: number,
  bookId: number
) {
  await db
    .delete(CollectionBook)
    .where(
      and(
        eq(CollectionBook.collection_id, collectionId),
        eq(CollectionBook.book_id, bookId)
      )
    )
    .execute();
}

export async function updateCollection(
  collectionId: number,
  updateFields: Partial<{ name: string; public: boolean }>
) {
  const updatedCollections = await db
    .update(Collection)
    .set(updateFields)
    .where(eq(Collection.id, collectionId))
    .returning()
    .execute();
  return updatedCollections[0];
}

export async function deleteCollection(collectionId: number) {
  await db.delete(Collection).where(eq(Collection.id, collectionId)).execute();
}
