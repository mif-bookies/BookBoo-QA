import { Request, Response } from "express";
import * as recommendationService from "../services/recommendationService";

interface ServiceError {
  status: number;
  error: string;
  details?: any;
}

const recommendationController = {
  getRecommendations:
    (service = recommendationService) =>
    async (req: Request, res: Response) => {
      try {
        const booksWithDetails = await service.fetchBookRecommendations(
          req.query
        );
        res.json(booksWithDetails);
      } catch (error) {
        const serviceError = error as ServiceError;
        if (serviceError.status && serviceError.error) {
          res
            .status(serviceError.status)
            .json({ error: serviceError.error, details: serviceError.details });
        } else {
          console.error("Error fetching recommendations:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    },
};

export default recommendationController;
