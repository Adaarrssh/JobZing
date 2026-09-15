import Bookmark from "../models/Bookmark.js";

export const getBookmarks = async (userId) => {
  const bookmarks = await Bookmark.find({ user: userId }).sort({
    createdAt: -1,
  });

  return {
    count: bookmarks.length,
    bookmarks,
  };
};

export const addBookmark = async (data) => {
  const existing = await Bookmark.findOne({
    user: data.user,
    jobId: data.jobId,
    source: data.source,
  });

  if (existing) {
    return existing;
  }

  return await Bookmark.create(data);
};

export const removeBookmark = async (id, userId) => {
  return await Bookmark.findOneAndDelete({
    _id: id,
    user: userId,
  });
};
