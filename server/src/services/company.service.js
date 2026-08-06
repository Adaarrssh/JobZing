import Company from "../models/Company.js";

export const getCompanies = async () => {
  const companies = await Company.find().sort({ createdAt: -1 });

  return {
    count: companies.length,
    companies,
  };
};

export const getCompanyById = async (id) => {
  return await Company.findById(id);
};

export const searchCompanies = async (query) => {
  const { name, location } = query;

  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  const companies = await Company.find(filter);

  return {
    count: companies.length,
    companies,
  };
};