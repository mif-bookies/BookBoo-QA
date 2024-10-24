import { Request, Response } from "express";
import * as collectionService from "../services/collectionService";
import {
  createCollectionSchema,
  addBookToCollectionBodySchema,
  CollectionParamsSchema,
  deleteBookFromCollectionParamsSchema,
  updateCollectionBodySchema,
} from "../../types/validationSchemas";

const collectionController = {
  getPublicCollections: async (req: Request, res: Response) => {
    try {
      const collections = await collectionService.fetchPublicCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching public collections:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },

  getUserCollections: async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (req.auth?.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: User ID mismatch" });
    }

    try {
      const collections = await collectionService.fetchUserCollections(userId);
      res.json(collections);
    } catch (error) {
      console.error("Error fetching user collections:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },

  getCollectionDetails: async (req: Request, res: Response) => {
    const { collectionId } = req.params;
    const userId = req.auth?.userId;

    try {
      const collectionDetails = await collectionService.fetchCollectionDetails(
        parseInt(collectionId, 10),
        userId
      );
      res.json(collectionDetails);
    } catch (error) {
      console.error("Error fetching collection details:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },

  createCollection: async (req: Request, res: Response) => {
    const validation = createCollectionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request parameters",
        details: validation.error.errors,
      });
    }

    const { name, user_id, public: publicStatus } = validation.data;

    if (req.auth?.userId !== user_id) {
      return res.status(403).json({ error: "Forbidden: User ID mismatch" });
    }

    try {
      const isPublic = publicStatus ?? false;

      const newCollection = await collectionService.createNewCollection(
        name,
        user_id,
        isPublic
      );
      res.json(newCollection);
    } catch (error) {
      console.error("Error creating collection:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },

  addBookToCollection: async (req: Request, res: Response) => {
    const bodyValidation = addBookToCollectionBodySchema.safeParse(req.body);
    const paramsValidation = CollectionParamsSchema.safeParse(req.params);

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: bodyValidation.error.errors,
      });
    }

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Invalid URL parameter",
        details: paramsValidation.error.errors,
      });
    }

    const { book_id } = bodyValidation.data;
    const collection_id = parseInt(paramsValidation.data.collectionId, 10);
    const userId = req.auth?.userId;

    try {
      const addedBook = await collectionService.addBookToUserCollection(
        collection_id,
        book_id,
        userId!
      );
      res.json({
        message: "Book added to collection successfully",
        addedBook,
      });
    } catch (error) {
      console.error("Error adding book to collection:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },

  removeBookFromCollection: async (req: Request, res: Response) => {
    const paramsValidation = deleteBookFromCollectionParamsSchema.safeParse(
      req.params
    );

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Invalid URL parameters",
        details: paramsValidation.error.errors,
      });
    }

    const { collectionId, bookId } = paramsValidation.data;
    const collection_id = parseInt(collectionId, 10);
    const book_id = parseInt(bookId, 10);
    const userId = req.auth?.userId;

    try {
      await collectionService.removeBookFromUserCollection(
        collection_id,
        book_id,
        userId!
      );
      res.json({ message: "Book removed from collection successfully" });
    } catch (error) {
      console.error("Error removing book from collection:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },

  updateCollection: async (req: Request, res: Response) => {
    const paramsValidation = CollectionParamsSchema.safeParse(req.params);
    const bodyValidation = updateCollectionBodySchema.safeParse(req.body);

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Invalid URL parameter",
        details: paramsValidation.error.errors,
      });
    }

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: bodyValidation.error.errors,
      });
    }

    const { collectionId } = paramsValidation.data;
    const { name: newName, public: newPublicStatus } = bodyValidation.data;

    if (
      !newName &&
      (newPublicStatus === undefined || newPublicStatus === null)
    ) {
      return res.status(400).json({ error: "Missing fields to update" });
    }

    const updateFields: Partial<{ name: string; public: boolean }> = {};
    if (newName) updateFields.name = newName;
    if (newPublicStatus !== undefined && newPublicStatus !== null)
      updateFields.public = newPublicStatus;

    const userId = req.auth?.userId;

    try {
      const updatedCollection = await collectionService.updateUserCollection(
        parseInt(collectionId, 10),
        updateFields,
        userId!
      );
      res.json(updatedCollection);
    } catch (error) {
      console.error("Error updating collection:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },

  deleteCollection: async (req: Request, res: Response) => {
    const paramsValidation = CollectionParamsSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Invalid URL parameter",
        details: paramsValidation.error.errors,
      });
    }

    const { collectionId } = paramsValidation.data;
    const userId = req.auth?.userId;

    try {
      await collectionService.deleteUserCollection(
        parseInt(collectionId, 10),
        userId!
      );
      res.json({ message: "Collection deleted successfully" });
    } catch (error) {
      console.error("Error deleting collection:", error);
      const err = error as { status?: number; message?: string };
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
};

export default collectionController;
