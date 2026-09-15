import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getJobMatch } from "../services/jobMatcher.service.js";

export const getJobMatchController = asyncHandler(async (req, res) => {
  const { jobSkills = [], jobTitle = "", jobDescription = "" } = req.body;

  if (
    (!Array.isArray(jobSkills) || jobSkills.length === 0) &&
    !jobDescription.trim()
  ) {
    throw new ApiError(400, "Job details are required");
  }

  const result = await getJobMatch({
    userId: req.user._id,
    jobSkills,
    jobTitle,
    jobDescription,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Job match analyzed successfully"));
});
