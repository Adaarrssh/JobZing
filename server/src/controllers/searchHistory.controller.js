import SearchHistory from "../models/SearchHistory.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createSearchHistory = asyncHandler(async (req, res) => {
  const { query, filters } = req.body;

  if (!query || !query.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  const searchHistory = await SearchHistory.create({
    userId: req.user._id,
    query: query.trim(),
    filters: filters || {},
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        searchHistory,
        "Search history created successfully",
      ),
    );
});

export const getSearchHistory = asyncHandler(async (req, res) => {
  const searchHistory = await SearchHistory.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        searchHistory,
        "Search history fetched successfully",
      ),
    );
});

export const deleteSearchHistory = asyncHandler(async (req, res) => {
  const searchHistory = await SearchHistory.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!searchHistory) {
    throw new ApiError(404, "Search history not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Search history deleted successfully"));
});
