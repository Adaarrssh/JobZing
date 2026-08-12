import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  getCompanies as getCompaniesService,
  getCompanyById as getCompanyByIdService,
  searchCompanies as searchCompaniesService,
} from "../services/company.service.js";

export const getCompanies = asyncHandler(async (req, res) => {
  const result = await getCompaniesService();

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Companies fetched successfully"));
});

export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await getCompanyByIdService(req.params.id);

  if (!company) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Company not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company fetched successfully"));
});

export const searchCompanies = asyncHandler(async (req, res) => {
  const result = await searchCompaniesService(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Companies fetched successfully"));
});