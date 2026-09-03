import API from "./api";

export const getRecommendedJobs = async (params = {}) => {
  const response = await API.get("/recommendations", {
    params,
  });

  return response.data;
};
