import {
    fetchSearchedBooks,
    fetchBookById,
  } from '../src/services/bookService'; // Adjust the import path as necessary
  import {
    getBookById,
    getBookAuthors,
    getBookGenres,
    getRandomBooks,
    getTotalBooksCount,
    searchBooks,
  } from '../src/data-access/bookDataAccess'; // Adjust the import path as necessary
  
  jest.mock('../src/data-access/bookDataAccess');
  
  describe('Book Service', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('fetchSearchedBooks', () => {
      const mockQuery = 'test';
      const mockLimit = 10;
      const mockPage = 1;
      const mockBooks = [
        { id: 1, title: 'Book 1' },
        { id: 2, title: 'Book 2' },
      ];
  
      it('should fetch searched books with authors and genres', async () => {
        (searchBooks as jest.Mock).mockResolvedValue(mockBooks);
        (getBookAuthors as jest.Mock).mockResolvedValue([{ name: 'Author 1' }]);
        (getBookGenres as jest.Mock).mockResolvedValue([{ genre: 'Genre 1' }]);
        (getTotalBooksCount as jest.Mock).mockResolvedValue(2);
  
        const result = await fetchSearchedBooks(mockQuery, mockPage, mockLimit);
  
        expect(result).toEqual({
          count: 2,
          next: `${process.env.EXPRESS_URL}:${process.env.PORT}/api/book/search?query=test&page=2&limit=10`,
          prev: null,
          results: [
            {
              id: 1,
              title: 'Book 1',
              authors: ['Author 1'],
              genres: ['Genre 1'],
            },
            {
              id: 2,
              title: 'Book 2',
              authors: ['Author 1'],
              genres: ['Genre 1'],
            },
          ],
        });
        expect(searchBooks).toHaveBeenCalledWith(mockQuery, mockLimit, 0);
        expect(getTotalBooksCount).toHaveBeenCalledWith(mockQuery);
      });
  
      it('should handle no books found', async () => {
        (searchBooks as jest.Mock).mockResolvedValue([]);
        (getTotalBooksCount as jest.Mock).mockResolvedValue(0);
  
        const result = await fetchSearchedBooks(mockQuery, mockPage, mockLimit);
  
        expect(result).toEqual({
          count: 0,
          next: null,
          prev: null,
          results: [],
        });
        expect(searchBooks).toHaveBeenCalledWith(mockQuery, mockLimit, 0);
        expect(getTotalBooksCount).toHaveBeenCalledWith(mockQuery);
      });
    });
  
    describe('fetchBookById', () => {
      const mockBookId = 1;
      const mockBook = { id: mockBookId, title: 'Test Book' };
  
      it('should fetch a book by its ID with authors and genres', async () => {
        (getBookById as jest.Mock).mockResolvedValue(mockBook);
        (getBookAuthors as jest.Mock).mockResolvedValue([{ name: 'Author 1' }]);
        (getBookGenres as jest.Mock).mockResolvedValue([{ genre: 'Genre 1' }]);
  
        const result = await fetchBookById(mockBookId);
  
        expect(result).toEqual({
          id: mockBookId,
          title: 'Test Book',
          authors: ['Author 1'],
          genres: ['Genre 1'],
        });
        expect(getBookById).toHaveBeenCalledWith(mockBookId);
        expect(getBookAuthors).toHaveBeenCalledWith(mockBookId);
        expect(getBookGenres).toHaveBeenCalledWith(mockBookId);
      });
  
      it('should return null if the book is not found', async () => {
        (getBookById as jest.Mock).mockResolvedValue(null);
  
        const result = await fetchBookById(mockBookId);
  
        expect(result).toBeNull();
        expect(getBookById).toHaveBeenCalledWith(mockBookId);
        expect(getBookAuthors).not.toHaveBeenCalled();
        expect(getBookGenres).not.toHaveBeenCalled();
      });
    });
  });
  