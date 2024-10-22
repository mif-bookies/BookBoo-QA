import express from "express";
import recommendationController from "../controllers/recommendationController";

const router = express.Router();

router.get("/api/recommend", recommendationController.getRecommendations());

export default router;
