
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  getBookmarks as getBookmarksService,
  addBookmark as addBookmarkService,
  removeBookmark as removeBookmarkService,
} from "../services/bookmark.service.js";

export const getBookmarks = asyncHandler(async (req, res) => {
  const result = await getBookmarksService();

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Bookmarks fetched successfully"));
});

export const addBookmark = asyncHandler(async (req, res) => {
  const bookmark = await addBookmarkService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, bookmark, "Bookmark added successfully"));
});

export const removeBookmark = asyncHandler(async (req, res) => {
  const bookmark = await removeBookmarkService(req.params.id);

  if (!bookmark) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Bookmark not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Bookmark removed successfully"));
});