import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getRecommendedJobs } from "../services/recommendation.service.js";

export const getRecommendedJobsController = asyncHandler(async (req, res) => {
  const recommendations = await getRecommendedJobs({
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        recommendations,
        "Job recommendations fetched successfully",
      ),
    );
});
