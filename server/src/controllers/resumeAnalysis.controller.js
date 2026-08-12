import { validationResult } from "express-validator";
import { analyzeResume } from "../services/resumeAnalysis.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const analyzeResumeController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { resumeUrl, resumeText } = req.body;

  const analysis = await analyzeResume({
    userId: req.user._id,
    resumeUrl,
    resumeText,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        analysis,
        "Resume submitted for analysis successfully.",
      ),
    );
});
