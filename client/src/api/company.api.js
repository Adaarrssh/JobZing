import API from "./api";

export const getCompanies = async (params = {}) => {
  const response = await API.get("/companies", {
    params,
  });

  return response.data;
};

export const searchCompanies = async (params = {}) => {
  const response = await API.get("/companies/search", {
    params,
  });

  return response.data;
};

export const getCompanyById = async (id) => {
  const response = await API.get(`/companies/${id}`);

  return response.data;
};
