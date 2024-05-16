import { z } from "zod";

export const bookRecommendationRequestSchema = z.object({
  book_id: z.number().min(1).max(10000),
  method: z.enum(["Content-Based", "Collaborative", "Hybrid"]),
  limit: z.number().min(5).max(20),
});

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(200),
  user_id: z.string().max(100),
  public: z.boolean().optional(),
});

export const addBookToCollectionBodySchema = z.object({
  book_id: z.number().min(1).max(10000),
});

export const CollectionParamsSchema = z.object({
  collectionId: z.string(),
});

export const deleteBookFromCollectionParamsSchema = z.object({
  collectionId: z.string().min(1),
  bookId: z.string().min(1).max(10000),
});

export const updateCollectionBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    public: z.boolean().optional(),
  })
  .refine((data) => data.name || data.public !== undefined, {
    message: "At least one field (name or public) must be provided",
  });
