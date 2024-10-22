import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import express, { Express } from "express";
import request from "supertest";
import bookController from "../src/controllers/bookController";

jest.mock("../src/services/bookService");

const mockedBookService = {
  fetchSearchedBooks: jest.fn(),
  fetchRandomBooks: jest.fn(),
  fetchBookById: jest.fn(),
};

describe("Book Routes with Mocked Database", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.get("/api/book/search", bookController.searchBooks(mockedBookService));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of books for a valid search query", async () => {
    mockedBookService.fetchSearchedBooks.mockResolvedValue({
      count: 1,
      next: null,
      prev: null,
      results: [
        {
          id: 1,
          title: "Mocked Book",
          description: "A mocked book description",
          coverImage: "mocked_cover.jpg",
          averageRating: 4.5,
          ratingsCount: 100,
          pageCount: 300,
          publicationYear: 2020,
          authors: ["Mocked Author"],
          genres: ["Mocked Genre"],
        },
      ],
    });

    const response = await request(app)
      .get("/api/book/search")
      .query({ query: "Mocked Book" });

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results[0].title).toBe("Mocked Book");
    expect(mockedBookService.fetchSearchedBooks).toHaveBeenCalledWith(
      "Mocked Book",
      1,
      10
    );
  });

  it("should return 400 when query parameter is missing", async () => {
    const response = await request(app).get("/api/book/search");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Query parameter 'query' is required");
    expect(mockedBookService.fetchSearchedBooks).not.toHaveBeenCalled();
  });

  it("should return 404 when no books match the query", async () => {
    mockedBookService.fetchSearchedBooks.mockResolvedValue({
      count: 0,
      next: null,
      prev: null,
      results: [],
    });

    const response = await request(app)
      .get("/api/book/search")
      .query({ query: "NonExistentBook12345" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No books found matching the query.");
    expect(mockedBookService.fetchSearchedBooks).toHaveBeenCalledWith(
      "NonExistentBook12345",
      1,
      10
    );
  });
});
