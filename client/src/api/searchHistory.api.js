import API from "./api";

export const createSearchHistory = async (data) => {
  const response = await API.post("/search-history", data);
  return response.data;
};

export const getSearchHistory = async () => {
  const response = await API.get("/search-history");
  return response.data;
};

export const deleteSearchHistory = async (id) => {
  const response = await API.delete(`/search-history/${id}`);
  return response.data;
};
