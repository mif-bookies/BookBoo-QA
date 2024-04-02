export interface BookWithAuthorsAndGenres {
  bookId: number;
  title: string;
  coverImage: string;
  pageCount: number;
  description: string;
  normalizedTitle: string;
  publicationYear: number;
  authors?: string[];
  genres?: string[];
}
