import Bookmark from "../models/Bookmark.js";

export const getBookmarks = async () => {
  const bookmarks = await Bookmark.find();
  return {
    count: bookmarks.length,
    bookmarks,
  };
};

export const addBookmark = async (data) => {
  return await Bookmark.create(data);
};

export const removeBookmark = async (id) => {
  return await Bookmark.findByIdAndDelete(id);
};
