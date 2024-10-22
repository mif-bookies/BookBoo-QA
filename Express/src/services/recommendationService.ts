import fetch from "node-fetch";
import { Author } from "../../types/Author";
import { Book } from "../../types/Book";
import { Genre } from "../../types/Genre";
import { bookRecommendationRequestSchema } from "../../types/validationSchemas";
import {
  getAuthorsByBookIds as defaultGetAuthorsByBookIds,
  getBooksByIds as defaultGetBooksByIds,
  getGenresByBookIds as defaultGetGenresByBookIds,
} from "../data-access/recommendationDataAccess";

interface ServiceDependencies {
  getBooksByIds?: typeof defaultGetBooksByIds;
  getAuthorsByBookIds?: typeof defaultGetAuthorsByBookIds;
  getGenresByBookIds?: typeof defaultGetGenresByBookIds;
  fetchFn?: typeof fetch;
}

export async function fetchBookRecommendations(
  queryParams: any,
  {
    getBooksByIds = defaultGetBooksByIds,
    getAuthorsByBookIds = defaultGetAuthorsByBookIds,
    getGenresByBookIds = defaultGetGenresByBookIds,
    fetchFn = fetch,
  }: ServiceDependencies = {}
) {
  const { book_id, method, limit } = queryParams;
  const bookIdNum = parseInt(book_id as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const validation = bookRecommendationRequestSchema.safeParse({
    book_id: bookIdNum,
    method,
    limit: limitNum,
  });

  if (!validation.success) {
    const errorDetails = validation.error;
    throw {
      status: 400,
      error: "Invalid request parameters",
      details: errorDetails,
    };
  }

  const {
    book_id: validBookId,
    method: validMethod,
    limit: validLimit,
  } = validation.data;

  try {
    const query = new URLSearchParams({
      book_id: validBookId.toString(),
      method: validMethod,
      limit: validLimit.toString(),
    }).toString();

    const response = await fetchFn(
      `${process.env.RECOMMENDATION_SERVICE_URL}/recommend?${query}`
    );

    if (!response.ok) {
      throw {
        status: response.status,
        error: "Error from recommendation service",
      };
    }

    const recommendedIds: number[] = await response.json();

    const [books, authors, genres] = await Promise.all([
      getBooksByIds(recommendedIds),
      getAuthorsByBookIds(recommendedIds),
      getGenresByBookIds(recommendedIds),
    ]);

    const booksWithDetails = books.map((book: Book) => ({
      ...book,
      authors: authors
        .filter((author: Author) => author.bookId === book.id)
        .map((author: Author) => author.name),
      genres: genres
        .filter((genre: Genre) => genre.bookId === book.id)
        .map((genre: Genre) => genre.genre),
    }));

    return booksWithDetails;
  } catch (error) {
    const serviceError = error as { status: number; error: string };
    if (serviceError.status && serviceError.error) {
      throw serviceError;
    } else {
      console.error("Error fetching book recommendations:", error);
      throw { status: 500, error: "Internal server error" };
    }
  }
}
