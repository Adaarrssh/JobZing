import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getCompanies as getCompaniesService,
  getCompanyById as getCompanyByIdService,
  searchCompanies as searchCompaniesService,
} from "../services/company.service.js";
import {
  fetchJSearchJobs,
  normalizeJSearchJobs,
} from "../services/provider/jsearch.provider.js";
import {
  fetchJoobleJobs,
  normalizeJoobleJobs,
} from "../services/provider/jooble.provider.js";
import {
  fetchTheirStackJobs,
  normalizeTheirStackJobs,
} from "../services/provider/theirstack.provider.js";

const filterJobsByExperience = (jobs, experience) => {
  if (!experience) {
    return jobs;
  }

  if (experience === "Fresher") {
    return jobs.filter((job) => job.experience === "Fresher");
  }

  if (experience === "Experienced") {
    return jobs.filter(
      (job) => job.experience === "1-3 Years" || job.experience === "3+ Years",
    );
  }

  if (experience === "Intern") {
    return jobs.filter(
      (job) =>
        job.jobType === "Intern" ||
        job.jobType === "Internship" ||
        /intern|internship/i.test(`${job.title} ${job.description}`),
    );
  }

  return jobs;
};

const deduplicateJobs = (jobs) => {
  const uniqueJobs = [];
  const seen = new Set();

  jobs.forEach((job) => {
    const title = String(job.title || "")
      .toLowerCase()
      .trim();

    const company = String(job.company || "")
      .toLowerCase()
      .trim();

    const location = String(job.location || "")
      .toLowerCase()
      .trim();

    const fallbackKey = [title, company, location].join("-");

    const key = job.jobId || job._id || fallbackKey;

    const normalizedKey = String(key).toLowerCase().trim();

    if (!seen.has(normalizedKey)) {
      seen.add(normalizedKey);
      uniqueJobs.push(job);
    }
  });

  return uniqueJobs;
};

const isAuthenticatedRequest = (req) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return false;
  }

  const token = authorization.slice(7).trim();

  if (!token || !process.env.JWT_SECRET) {
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

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

export const searchCompanyJobs = asyncHandler(async (req, res) => {
  const company = String(req.query.company || "").trim();

  const location = String(req.query.location || "India").trim() || "India";

  const jobType = String(req.query.jobType || "").trim();

  const experience = String(req.query.experience || "").trim();

  const sort = req.query.sort === "oldest" ? "oldest" : "latest";

  const requestedPage = Math.max(1, Number(req.query.page || 1));

  const requestedLimit = Math.min(
    50,
    Math.max(1, Number(req.query.limit || 8)),
  );

  if (!company) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Company name is required"));
  }

  const results = await Promise.allSettled([
    fetchJSearchJobs("", location, jobType, experience, company),
    fetchJoobleJobs("", location, jobType, experience, company),
    fetchTheirStackJobs("", location, jobType, experience, company),
  ]);

  const [jsearchResult, joobleResult, theirStackResult] = results;

  let allJobs = [];

  if (jsearchResult.status === "fulfilled") {
    allJobs = [
      ...allJobs,
      ...normalizeJSearchJobs(jsearchResult.value, location),
    ];
  }

  if (joobleResult.status === "fulfilled") {
    allJobs = [
      ...allJobs,
      ...normalizeJoobleJobs(joobleResult.value, location),
    ];
  }

  if (theirStackResult.status === "fulfilled") {
    allJobs = [
      ...allJobs,
      ...normalizeTheirStackJobs(theirStackResult.value, location),
    ];
  }

  allJobs = filterJobsByExperience(allJobs, experience);

  const uniqueJobs = deduplicateJobs(allJobs);

  uniqueJobs.sort((a, b) => {
    const first = new Date(a.createdAt || 0).getTime();

    const second = new Date(b.createdAt || 0).getTime();

    return sort === "oldest" ? first - second : second - first;
  });

  const authenticated = isAuthenticatedRequest(req);

  const guestLimit = 4;

  if (!authenticated) {
    const guestJobs = uniqueJobs.slice(0, guestLimit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalJobs: uniqueJobs.length,
          visibleJobs: guestJobs.length,
          currentPage: 1,
          totalPages: 1,
          isGuest: true,
          jobs: guestJobs,
        },
        "Company jobs fetched successfully",
      ),
    );
  }

  const totalJobs = uniqueJobs.length;

  const totalPages = Math.max(1, Math.ceil(totalJobs / requestedLimit));

  const currentPage = Math.min(requestedPage, totalPages);

  const start = (currentPage - 1) * requestedLimit;

  const end = start + requestedLimit;

  const paginatedJobs = uniqueJobs.slice(start, end);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalJobs,
        visibleJobs: paginatedJobs.length,
        currentPage,
        totalPages,
        isGuest: false,
        jobs: paginatedJobs,
      },
      "Company jobs fetched successfully",
    ),
  );
});
