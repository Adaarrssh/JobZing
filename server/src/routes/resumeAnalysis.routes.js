import express from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { analyzeResumeValidation } from "../validations/resumeAnalysis.validation.js";
import { analyzeResumeController } from "../controllers/resumeAnalysis.controller.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResumeValidation,
  analyzeResumeController,
);

export default router;
