import Bookmark from "../models/Bookmark.js";

// Add Bookmark
export const addBookmark = async (req, res) => {
  try {
    const { user, job } = req.body;

    const existingBookmark = await Bookmark.findOne({ user, job });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "Job already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({ user, job });

    return res.status(201).json({
      success: true,
      message: "Bookmark added successfully",
      data: bookmark,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarks = await Bookmark.find({ user: userId }).populate("job");

    return res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Bookmark
export const removeBookmark = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: userId,
      job: jobId,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};