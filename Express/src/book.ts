import { count, eq, sql } from "drizzle-orm";
import express, { Request, Response } from "express";
import { db } from "./db/db";
import { Book, BookAuthor, BookGenre } from "./db/schema";

const router = express.Router();
const { EXPRESS_URL, PORT } = process.env;

router.get("/api/book", async function (req: Request, res: Response) {
  try {
    const books = await db
      .select({
        id: Book.id,
        title: Book.title,
        description: Book.description,
        coverImage: Book.cover_image,
        averageRating: Book.average_rating,
        ratingsCount: Book.ratings_count,
        pageCount: Book.page_count,
        publicationYear: Book.publication_year,
      })
      .from(Book)
      .orderBy(sql.raw("RANDOM()"))
      .limit(5)
      .execute();

    const booksDetails = await Promise.all(
      books.map(async (book) => {
        const authors = await db
          .select({
            name: BookAuthor.name,
          })
          .from(BookAuthor)
          .where(eq(BookAuthor.book_id, book.id))
          .execute();

        const genres = await db
          .select({
            genre: BookGenre.genre,
          })
          .from(BookGenre)
          .where(eq(BookGenre.book_id, book.id))
          .execute();

        return {
          ...book,
          genres: genres.map((g) => g.genre),
          authors: authors.map((a) => a.name),
        };
      })
    );

    return res.json(booksDetails);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/book/search", async function (req, res) {
  try {
    const query = req.query.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    if (!query) {
      return res
        .status(400)
        .json({ error: "Query parameter 'query' is required" });
    }

    const books = await db
      .select({
        id: Book.id,
        title: Book.title,
        description: Book.description,
        coverImage: Book.cover_image,
        averageRating: Book.average_rating,
        ratingsCount: Book.ratings_count,
        pageCount: Book.page_count,
        publicationYear: Book.publication_year,
      })
      .from(Book)
      .where(sql`title ILIKE ${`%${query}%`}`)
      .limit(limit)
      .offset(offset)
      .execute();

    const booksDetails = await Promise.all(
      books.map(async (book) => {
        const authors = await db
          .select({
            name: BookAuthor.name,
          })
          .from(BookAuthor)
          .where(eq(BookAuthor.book_id, book.id))
          .execute();

        const genres = await db
          .select({
            genre: BookGenre.genre,
          })
          .from(BookGenre)
          .where(eq(BookGenre.book_id, book.id))
          .execute();

        return {
          ...book,
          genres: genres.map((g) => g.genre),
          authors: authors.map((a) => a.name),
        };
      })
    );

    if (booksDetails.length === 0)
      return res
        .status(404)
        .json({ error: "No books found matching the query." });

    const totalCountResult = await db
      .select({ count: count() })
      .from(Book)
      .where(sql`title ILIKE ${`%${query}%`}`)
      .execute();

    const totalBooksCount = Number(totalCountResult[0]?.count) || 0;
    const totalPages = Math.ceil(totalBooksCount / limit);
    const next =
      page < totalPages
        ? EXPRESS_URL +
          ":" +
          PORT +
          "/api/book/search?query=" +
          query +
          "&page=" +
          (page + 1) +
          "&limit=" +
          limit
        : null;
    const prev =
      page > 1
        ? EXPRESS_URL +
          ":" +
          PORT +
          "/api/book/search?query=" +
          query +
          "&page=" +
          (page - 1) +
          "&limit=" +
          limit
        : null;

    return res.json({
      count: totalBooksCount,
      next,
      prev,
      results: booksDetails,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/book/:id", async function (req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const bookArray = await db
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
      .where(eq(Book.id, id))
      .execute();

    const book = bookArray[0];
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const [authors, genres] = await Promise.all([
      db
        .select({ name: BookAuthor.name })
        .from(BookAuthor)
        .where(eq(BookAuthor.book_id, id))
        .execute(),
      db
        .select({ genre: BookGenre.genre })
        .from(BookGenre)
        .where(eq(BookGenre.book_id, id))
        .execute(),
    ]);

    const bookDetails = {
      ...book,
      authors: authors.map((a) => a.name),
      genres: genres.map((g) => g.genre),
    };

    return res.json(bookDetails);
  } catch (error) {
    console.error("Error fetching book details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
