import * as collectionService from '../src/services/collectionService';
import * as dataAccess from '../src/data-access/collectionDataAccess';

// Mock the data-access layer
jest.mock('../src/data-access/collectionDataAccess');

// Type assertions for the mocked functions
const getCollectionByIdMock = dataAccess.getCollectionById as jest.Mock;
const checkBookExistsMock = dataAccess.checkBookExists as jest.Mock;
const checkBookInCollectionMock = dataAccess.checkBookInCollection as jest.Mock;
const addBookToCollectionMock = dataAccess.addBookToCollection as jest.Mock;
const removeBookFromCollectionMock = dataAccess.removeBookFromCollection as jest.Mock;

describe('addBookToUserCollection', () => {
  const mockUserId = 'user123';
  const mockCollectionId = 1;
  const mockBookId = 100;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a book to the user\'s collection successfully', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
    checkBookExistsMock.mockResolvedValue(true);
    checkBookInCollectionMock.mockResolvedValue(false);
    addBookToCollectionMock.mockResolvedValue({ id: mockBookId, title: 'Sample Book' });

    const result = await collectionService.addBookToUserCollection(mockCollectionId, mockBookId, mockUserId);

    expect(result).toEqual({ id: mockBookId, title: 'Sample Book' });
    expect(getCollectionByIdMock).toHaveBeenCalledWith(mockCollectionId);
    expect(checkBookExistsMock).toHaveBeenCalledWith(mockBookId);
    expect(checkBookInCollectionMock).toHaveBeenCalledWith(mockCollectionId, mockBookId);
    expect(addBookToCollectionMock).toHaveBeenCalledWith(mockCollectionId, mockBookId);
  });

  it('should throw 403 if the user is not the owner of the collection', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: 'differentUserId' });

    await expect(
      collectionService.addBookToUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('Forbidden: Access denied');
  });

  it('should throw 404 if the collection does not exist', async () => {
    getCollectionByIdMock.mockResolvedValue(null);

    await expect(
      collectionService.addBookToUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('Collection not found');
  });

  it('should throw 404 if the book does not exist', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
    checkBookExistsMock.mockResolvedValue(false);

    await expect(
      collectionService.addBookToUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('Book not found');
  });

  it('should throw 409 if the book is already in the collection', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
    checkBookExistsMock.mockResolvedValue(true);
    checkBookInCollectionMock.mockResolvedValue(true);

    await expect(
      collectionService.addBookToUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('This book is already in the collection');
  });
});

describe('removeBookFromUserCollection', () => {
  const mockUserId = 'user123';
  const mockCollectionId = 1;
  const mockBookId = 100;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove a book from the user\'s collection successfully', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
    checkBookExistsMock.mockResolvedValue(true);
    checkBookInCollectionMock.mockResolvedValue(true);

    await collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId);

    expect(getCollectionByIdMock).toHaveBeenCalledWith(mockCollectionId);
    expect(checkBookExistsMock).toHaveBeenCalledWith(mockBookId);
    expect(checkBookInCollectionMock).toHaveBeenCalledWith(mockCollectionId, mockBookId);
    expect(removeBookFromCollectionMock).toHaveBeenCalledWith(mockCollectionId, mockBookId);
  });

  it('should throw 403 if the user is not the owner of the collection', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: 'differentUserId' });

    await expect(
      collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('Forbidden: Access denied');
  });

  it('should throw 404 if the collection does not exist', async () => {
    getCollectionByIdMock.mockResolvedValue(null);

    await expect(
      collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('Collection not found');
  });

  it('should throw 404 if the book does not exist', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
    checkBookExistsMock.mockResolvedValue(false);

    await expect(
      collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('Book not found');
  });

  it('should throw 404 if the book is not in the collection', async () => {
    getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
    checkBookExistsMock.mockResolvedValue(true);
    checkBookInCollectionMock.mockResolvedValue(false);

    await expect(
      collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
    ).rejects.toThrow('Book not found in the collection');
  });
});

describe('removeBookFromUserCollection', () => {
    const mockUserId = 'user123';
    const mockCollectionId = 1;
    const mockBookId = 100;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should remove a book from the user\'s collection successfully', async () => {
      getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
      checkBookExistsMock.mockResolvedValue(true);
      checkBookInCollectionMock.mockResolvedValue(true);
  
      await collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId);
  
      expect(dataAccess.getCollectionById).toHaveBeenCalledWith(mockCollectionId);
      expect(dataAccess.checkBookExists).toHaveBeenCalledWith(mockBookId);
      expect(dataAccess.checkBookInCollection).toHaveBeenCalledWith(mockCollectionId, mockBookId);
      expect(dataAccess.removeBookFromCollection).toHaveBeenCalledWith(mockCollectionId, mockBookId);
    });
  
    it('should throw 403 if the user is not the owner of the collection', async () => {
      getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: 'differentUserId' });
  
      await expect(
        collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
      ).rejects.toThrow('Forbidden: Access denied');
    });
  
    it('should throw 404 if the collection does not exist', async () => {
      getCollectionByIdMock.mockResolvedValue(null);
  
      await expect(
        collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
      ).rejects.toThrow('Collection not found');
    });
  
    it('should throw 404 if the book does not exist', async () => {
      getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
      checkBookExistsMock.mockResolvedValue(false);
  
      await expect(
        collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
      ).rejects.toThrow('Book not found');
    });
  
    it('should throw 404 if the book is not in the collection', async () => {
      getCollectionByIdMock.mockResolvedValue({ id: mockCollectionId, user_id: mockUserId });
      checkBookExistsMock.mockResolvedValue(true);
      checkBookInCollectionMock.mockResolvedValue(false);
  
      await expect(
        collectionService.removeBookFromUserCollection(mockCollectionId, mockBookId, mockUserId)
      ).rejects.toThrow('Book not found in the collection');
    });
  });
  