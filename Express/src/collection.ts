import { and, eq } from "drizzle-orm";
import express from "express";
import { BookWithAuthorsAndGenres } from "../types/BookAuthorGenre";
import {
  CollectionParamsSchema,
  addBookToCollectionBodySchema,
  createCollectionSchema,
  deleteBookFromCollectionParamsSchema,
  updateCollectionBodySchema,
} from "../types/validationSchemas";
import { db } from "./db/db";
import {
  Book,
  BookAuthor,
  BookGenre,
  Collection,
  CollectionBook,
  User,
} from "./db/schema";

const router = express.Router();

router.get("/api/collection", async (req, res) => {
  try {
    const publicCollections = await db
      .select({
        id: Collection.id,
        name: Collection.name,
        creatorName: User.username,
      })
      .from(Collection)
      .innerJoin(User, eq(User.id, Collection.user_id))
      .where(eq(Collection.public, true))
      .execute();

    if (!publicCollections.length) {
      return res.status(404).json({ message: "No public collections found" });
    }

    res.json(publicCollections);
  } catch (error) {
    console.error("Error fetching public collections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/collection/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userCollections = await db
      .select({
        id: Collection.id,
        name: Collection.name,
        public: Collection.public,
      })
      .from(Collection)
      .where(eq(Collection.user_id, userId))
      .execute();

    if (!userCollections.length) {
      return res.status(404).json({ message: "No collections found" });
    }

    res.json(userCollections);
  } catch (error) {
    console.error("Error fetching user collections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/collection/:userId/:collectionId", async (req, res) => {
  const { userId, collectionId } = req.params;

  try {
    const collection = await db
      .select()
      .from(Collection)
      .where(
        and(
          eq(Collection.id, parseInt(collectionId)),
          eq(Collection.user_id, userId)
        )
      )
      .execute();

    if (!collection.length) {
      return res
        .status(404)
        .json({ error: "Collection not found or does not belong to the user" });
    }

    const booksInCollection: BookWithAuthorsAndGenres[] = await db
      .select({
        bookId: Book.id,
        title: Book.title,
        coverImage: Book.cover_image,
        pageCount: Book.page_count,
        description: Book.description,
        normalizedTitle: Book.normalized_title,
        publicationYear: Book.publication_year,
      })
      .from(CollectionBook)
      .innerJoin(Book, eq(Book.id, CollectionBook.book_id))
      .where(eq(CollectionBook.collection_id, parseInt(collectionId)))
      .execute();

    if (!booksInCollection.length) {
      return res
        .status(404)
        .json({ message: "No books found in the collection" });
    }

    for (let book of booksInCollection) {
      const authors = await db
        .select({ name: BookAuthor.name })
        .from(BookAuthor)
        .where(eq(BookAuthor.book_id, book.bookId))
        .execute();

      const genres = await db
        .select({ genre: BookGenre.genre })
        .from(BookGenre)
        .where(eq(BookGenre.book_id, book.bookId))
        .execute();

      book.authors = authors.map((author) => author.name);
      book.genres = genres.map((genre) => genre.genre);
    }

    res.json(booksInCollection);
  } catch (error) {
    console.error("Error fetching books from collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/collection", async (req, res) => {
  const body = req.body;
  const validation = createCollectionSchema.safeParse(body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "Invalid request parameters", details: validation.error });
  }

  const { name, user_id, public: publicStatus } = validation.data;

  try {
    const existingCollection = await db
      .select()
      .from(Collection)
      .where(and(eq(Collection.user_id, user_id), eq(Collection.name, name)))
      .execute();

    if (existingCollection.length > 0) {
      return res.status(409).json({
        error: "User already has a collection with this name",
      });
    }

    const newCollection = await db
      .insert(Collection)
      .values({ name, user_id, public: publicStatus })
      .returning()
      .execute();

    res.json(newCollection);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/collection/:collectionId/book", async (req, res) => {
  const bodyValidation = addBookToCollectionBodySchema.safeParse(req.body);
  const paramsValidation = CollectionParamsSchema.safeParse(req.params);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Invalid request body", details: bodyValidation.error });
  }

  if (!paramsValidation.success) {
    return res.status(400).json({
      error: "Invalid URL parameter",
      details: paramsValidation.error,
    });
  }

  const { book_id } = bodyValidation.data;
  const collection_id = parseInt(paramsValidation.data.collectionId, 10);

  if (isNaN(collection_id)) {
    return res
      .status(400)
      .json({ error: "Collection ID must be a valid number" });
  }

  try {
    const collectionExists = await db
      .select()
      .from(Collection)
      .where(eq(Collection.id, collection_id))
      .execute();
    const bookExists = await db
      .select()
      .from(Book)
      .where(eq(Book.id, book_id))
      .execute();

    if (collectionExists.length === 0)
      return res.status(404).json({ error: "Collection not found" });
    if (bookExists.length === 0)
      return res.status(404).json({ error: "Book not found" });

    const existingEntry = await db
      .select()
      .from(CollectionBook)
      .where(
        and(
          eq(CollectionBook.collection_id, collection_id),
          eq(CollectionBook.book_id, book_id)
        )
      )
      .execute();
    if (existingEntry.length > 0)
      return res
        .status(409)
        .json({ error: "This book is already in the collection" });

    const addedBook = await db
      .insert(CollectionBook)
      .values({ collection_id, book_id })
      .returning()
      .execute();
    res.json({
      message: "Book added to collection successfully",
      addedBook: addedBook[0],
    });
  } catch (error) {
    console.error("Error adding book to collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/api/collection/:collectionId/book/:bookId",
  async (req, res) => {
    const paramsValidation = deleteBookFromCollectionParamsSchema.safeParse(
      req.params
    );
    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Invalid URL parameters",
        details: paramsValidation.error,
      });
    }

    const { collectionId, bookId } = paramsValidation.data;
    const collection_id = parseInt(collectionId, 10);
    const book_id = parseInt(bookId, 10);

    if (isNaN(collection_id) || isNaN(book_id)) {
      return res
        .status(400)
        .json({ error: "Invalid collection_id or book_id" });
    }

    try {
      const collectionExists = await db
        .select()
        .from(Collection)
        .where(eq(Collection.id, collection_id))
        .execute();
      if (!collectionExists.length)
        return res.status(404).json({ error: "Collection not found" });

      const bookExists = await db
        .select()
        .from(Book)
        .where(eq(Book.id, book_id))
        .execute();
      if (!bookExists.length)
        return res.status(404).json({ error: "Book not found" });

      const bookInCollection = await db
        .select()
        .from(CollectionBook)
        .where(
          and(
            eq(CollectionBook.collection_id, collection_id),
            eq(CollectionBook.book_id, book_id)
          )
        )
        .execute();
      if (!bookInCollection.length)
        return res
          .status(404)
          .json({ error: "Book not found in the collection" });

      await db
        .delete(CollectionBook)
        .where(
          and(
            eq(CollectionBook.collection_id, collection_id),
            eq(CollectionBook.book_id, book_id)
          )
        )
        .execute();

      res.json({});
    } catch (error) {
      console.error("Error removing book from collection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch("/api/collection/:collectionId", async (req, res) => {
  const paramsValidation = CollectionParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    return res.status(400).json({
      error: "Invalid URL parameter",
      details: paramsValidation.error.issues,
    });
  }

  const bodyValidation = updateCollectionBodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: bodyValidation.error.issues,
    });
  }
  const { collectionId } = paramsValidation.data;
  const { name: newName, isPublic: newPublicStatus } = bodyValidation.data;

  if (!newName && (newPublicStatus === undefined || newPublicStatus === null)) {
    return res.status(400).json({ error: "Missing fields to update" });
  }

  const updateFields: { name?: string; public?: boolean } = {};
  if (newName) updateFields.name = newName;
  if (newPublicStatus !== undefined) updateFields.public = newPublicStatus;

  try {
    const parsedCollectionId = parseInt(collectionId, 10);
    if (isNaN(parsedCollectionId)) {
      return res.status(400).json({ error: "Invalid collectionId" });
    }

    const updatedCollection = await db
      .update(Collection)
      .set(updateFields)
      .where(eq(Collection.id, parsedCollectionId))
      .returning()
      .execute();

    if (updatedCollection.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.json(updatedCollection[0]);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/api/collection/:collectionId", async (req, res) => {
  const paramsValidation = CollectionParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    return res.status(400).json({
      error: "Invalid URL parameter",
      details: paramsValidation.error.issues,
    });
  }

  const { collectionId } = paramsValidation.data;
  const parsedCollectionId = parseInt(collectionId, 10);

  try {
    const deletedCollection = await db
      .delete(Collection)
      .where(eq(Collection.id, parsedCollectionId))
      .returning()
      .execute();

    if (!deletedCollection.length) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.json({});
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
