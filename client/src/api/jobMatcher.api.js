import API from "./api";

export const matchJob = async (data) => {
  const response = await API.post("/job-matcher", data);
  return response.data;
};
