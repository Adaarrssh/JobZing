import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { analyzeResume } from "../services/resumeAnalysis.service.js";
import { extractResumeText } from "../services/resumeParser.service.js";

export const analyzeResumeController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  if (!req.file) {
    throw new ApiError(400, "Resume PDF is required");
  }

  const resumeText = await extractResumeText(req.file.buffer);

  if (!resumeText) {
    throw new ApiError(400, "Could not extract text from resume");
  }

  const resumeUrl = req.body.resumeUrl || "";

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
        "Resume submitted for analysis successfully",
      ),
    );
});
