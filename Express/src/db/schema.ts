import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const Book = pgTable("Book", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  average_rating: real("average_rating").notNull(),
  ratings_count: integer("ratings_count").notNull(),
  cover_image: varchar("cover_image", { length: 100 }).notNull(),
  page_count: integer("page_count").notNull(),
  description: text("description").notNull(),
  normalized_title: varchar("normalized_title", { length: 200 }).notNull(),
  publication_year: integer("publication_year").notNull(),
});

export const BookAuthor = pgTable("BookAuthor", {
  id: serial("id").primaryKey(),
  book_id: integer("book_id")
    .references(() => Book.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const BookGenre = pgTable("BookGenre", {
  id: serial("id").primaryKey(),
  book_id: integer("book_id")
    .references(() => Book.id, { onDelete: "cascade" })
    .notNull(),
  genre: varchar("genre", { length: 50 }).notNull(),
});

export const User = pgTable("User", {
  id: varchar("id", { length: 100 }).primaryKey(),
  username: varchar("username", { length: 200 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const Collection = pgTable("Collection", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  user_id: varchar("user_id", { length: 100 })
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  public: boolean("public").notNull().default(false),
});

export const CollectionBook = pgTable("CollectionBook", {
  id: serial("id").primaryKey(),
  collection_id: integer("collection_id")
    .references(() => Collection.id, { onDelete: "cascade" })
    .notNull(),
  book_id: integer("book_id")
    .references(() => Book.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const bookRelations = relations(Book, ({ many }) => ({
  authors: many(BookAuthor),
  genres: many(BookGenre),
  collectionBooks: many(CollectionBook),
}));

export const bookAuthorRelations = relations(BookAuthor, ({ one }) => ({
  book: one(Book, {
    fields: [BookAuthor.book_id],
    references: [Book.id],
  }),
}));

export const bookGenreRelations = relations(BookGenre, ({ one }) => ({
  book: one(Book, {
    fields: [BookGenre.book_id],
    references: [Book.id],
  }),
}));

export const collectionRelations = relations(Collection, ({ many }) => ({
  collectionBooks: many(CollectionBook),
}));

export const collectionBookRelations = relations(CollectionBook, ({ one }) => ({
  collection: one(Collection, {
    fields: [CollectionBook.collection_id],
    references: [Collection.id],
  }),
  book: one(Book, { fields: [CollectionBook.book_id], references: [Book.id] }),
}));

export const userRelations = relations(User, ({ many }) => ({
  collections: many(Collection),
}));

export type SelectBook = InferSelectModel<typeof Book>;
export type InsertBook = InferInsertModel<typeof Book>;
export type SelectUser = InferSelectModel<typeof User>;
export type InsertUser = InferInsertModel<typeof User>;
export type SelectCollection = InferSelectModel<typeof Collection>;
export type InsertCollection = InferInsertModel<typeof Collection>;
export type SelectCollectionBook = InferSelectModel<typeof CollectionBook>;
export type InsertCollectionBook = InferInsertModel<typeof CollectionBook>;
export type SelectBookAuthor = InferSelectModel<typeof BookAuthor>;
export type InsertBookAuthor = InferInsertModel<typeof BookAuthor>;
export type SelectBookGenre = InferSelectModel<typeof BookGenre>;
export type InsertBookGenre = InferInsertModel<typeof BookGenre>;
