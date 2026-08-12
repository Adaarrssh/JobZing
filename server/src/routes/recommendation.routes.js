import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getRecommendedJobsController } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/", protect, getRecommendedJobsController);

export default router;
