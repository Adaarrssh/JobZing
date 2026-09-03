import API from "./api";

export const getAllJobs = async (params = {}) => {
  const response = await API.get("/jobs", {
    params,
  });

  return response.data;
};

export const searchJobs = async (params = {}) => {
  const response = await API.get("/jobs/search", {
    params,
  });

  return response.data;
};

export const getExternalJobs = async (params = {}) => {
  const response = await API.get("/jobs/external", {
    params,
  });

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await API.get(`/jobs/${jobId}`);

  return response.data;
};
