import { BookWithAuthorsAndGenres } from "../../types/BookAuthorGenre";
import * as dataAccess from "../data-access/collectionDataAccess";

export async function fetchPublicCollections() {
  const publicCollections = await dataAccess.getPublicCollections();
  if (!publicCollections.length) {
    throw { status: 404, message: "No public collections found" };
  }
  return publicCollections;
}

export async function fetchUserCollections(userId: string) {
  const userCollections = await dataAccess.getUserCollections(userId);
  if (!userCollections.length) {
    throw { status: 404, message: "No collections found" };
  }
  return userCollections;
}

export async function fetchCollectionDetails(
  collectionId: number,
  userId?: string
) {
  const collection = await dataAccess.getCollectionById(collectionId);
  if (!collection) {
    throw { status: 404, message: "Collection not found" };
  }

  const isOwner = collection.user_id === userId;
  if (!collection.public && !isOwner) {
    throw { status: 403, message: "Forbidden: Access denied" };
  }

  const booksInCollection = await dataAccess.getBooksInCollection(collectionId);

  const booksWithDetails: BookWithAuthorsAndGenres[] = [];
  for (const book of booksInCollection) {
    const [authors, genres] = await Promise.all([
      dataAccess.getBookAuthors(book.id),
      dataAccess.getBookGenres(book.id),
    ]);

    booksWithDetails.push({
      ...book,
      authors: authors.map((author) => author.name),
      genres: genres.map((genre) => genre.genre),
    });
  }

  return {
    title: collection.name,
    books: booksWithDetails,
    isOwner,
    public: collection.public,
  };
}

export async function createNewCollection(
  name: string,
  userId: string,
  publicStatus: boolean
) {
  const existingCollection = await dataAccess.checkExistingCollection(
    userId,
    name
  );
  if (existingCollection.length > 0) {
    throw {
      status: 409,
      message: "User already has a collection with this name",
    };
  }

  const newCollection = await dataAccess.createCollection(
    name,
    userId,
    publicStatus
  );
  return newCollection;
}

export async function addBookToUserCollection(
  collectionId: number,
  bookId: number,
  userId: string
) {
  const collection = await dataAccess.getCollectionById(collectionId);
  if (!collection) {
    throw { status: 404, message: "Collection not found" };
  }
  if (collection.user_id !== userId) {
    throw { status: 403, message: "Forbidden: Access denied" };
  }
  const bookExists = await dataAccess.checkBookExists(bookId);
  if (!bookExists) {
    throw { status: 404, message: "Book not found" };
  }
  const bookInCollection = await dataAccess.checkBookInCollection(
    collectionId,
    bookId
  );
  if (bookInCollection) {
    throw { status: 409, message: "This book is already in the collection" };
  }
  const addedBook = await dataAccess.addBookToCollection(collectionId, bookId);
  return addedBook;
}

export async function removeBookFromUserCollection(
  collectionId: number,
  bookId: number,
  userId: string
) {
  const collection = await dataAccess.getCollectionById(collectionId);
  if (!collection) {
    throw { status: 404, message: "Collection not found" };
  }
  if (collection.user_id !== userId) {
    throw { status: 403, message: "Forbidden: Access denied" };
  }
  const bookExists = await dataAccess.checkBookExists(bookId);
  if (!bookExists) {
    throw { status: 404, message: "Book not found" };
  }
  const bookInCollection = await dataAccess.checkBookInCollection(
    collectionId,
    bookId
  );
  if (!bookInCollection) {
    throw { status: 404, message: "Book not found in the collection" };
  }
  await dataAccess.removeBookFromCollection(collectionId, bookId);
}

export async function updateUserCollection(
  collectionId: number,
  updateFields: Partial<{ name: string; public: boolean }>,
  userId: string
) {
  const collection = await dataAccess.getCollectionById(collectionId);
  if (!collection) {
    throw { status: 404, message: "Collection not found" };
  }
  if (collection.user_id !== userId) {
    throw { status: 403, message: "Forbidden: You do not own this collection" };
  }
  const updatedCollection = await dataAccess.updateCollection(
    collectionId,
    updateFields
  );
  return updatedCollection;
}

export async function deleteUserCollection(
  collectionId: number,
  userId: string
) {
  const collection = await dataAccess.getCollectionById(collectionId);
  if (!collection) {
    throw { status: 404, message: "Collection not found" };
  }
  if (collection.user_id !== userId) {
    throw { status: 403, message: "Forbidden: You do not own this collection" };
  }
  await dataAccess.deleteCollection(collectionId);
}
