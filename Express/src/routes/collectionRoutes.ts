import express from "express";
import collectionController from "../controllers/collectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { checkPublicCollection } from "../middlewares/checkPublicCollection";

const router = express.Router();

router.get("/api/collection", collectionController.getPublicCollections);

router.get(
  "/api/users/:userId/collections",
  authMiddleware,
  collectionController.getUserCollections
);

router.get(
  "/api/collection/:collectionId",
  checkPublicCollection,
  collectionController.getCollectionDetails
);

router.post(
  "/api/collection",
  authMiddleware,
  collectionController.createCollection
);

router.post(
  "/api/collection/:collectionId/book",
  authMiddleware,
  collectionController.addBookToCollection
);

router.delete(
  "/api/collection/:collectionId/book/:bookId",
  authMiddleware,
  collectionController.removeBookFromCollection
);

router.patch(
  "/api/collection/:collectionId",
  authMiddleware,
  collectionController.updateCollection
);

router.delete(
  "/api/collection/:collectionId",
  authMiddleware,
  collectionController.deleteCollection
);

export default router;
