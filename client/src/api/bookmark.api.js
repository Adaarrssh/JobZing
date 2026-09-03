import API from "./api";

export const getBookmarks = async () => {
  const response = await API.get("/bookmarks");
  return response.data;
};

export const addBookmark = async (data) => {
  const response = await API.post("/bookmarks", data);
  return response.data;
};

export const removeBookmark = async (id) => {
  const response = await API.delete(`/bookmarks/${id}`);
  return response.data;
};
