import { Request, Response, NextFunction } from "express";
import { getCollectionById } from "../data-access/collectionDataAccess";
import { authMiddleware } from "./authMiddleware";

export async function checkPublicCollection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { collectionId } = req.params;

  try {
    const collectionIdNum = parseInt(collectionId, 10);
    const collection = await getCollectionById(collectionIdNum);

    if (collection && collection.public) {
      if (req.headers.authorization) {
        await authMiddleware(req, res, () => next());
      } else {
        next();
      }
    } else {
      await authMiddleware(req, res, next);
    }
  } catch (error) {
    console.error("Error checking collection:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
