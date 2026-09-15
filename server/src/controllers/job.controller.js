import Job from "../models/Job.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
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

const expandSearchKeyword = (keyword = "") => {
  const normalized = keyword.trim().toLowerCase();

  const expansions = {
    frontend:
      "Frontend Developer Frontend Engineer React Developer UI Developer",

    "frontend developer":
      "Frontend Developer Frontend Engineer React Developer UI Developer",

    "frontend engineer":
      "Frontend Engineer Frontend Developer React Developer UI Developer",

    backend:
      "Backend Developer Backend Engineer Node.js Developer API Developer",

    "backend developer":
      "Backend Developer Backend Engineer Node.js Developer API Developer",

    "backend engineer":
      "Backend Engineer Backend Developer Node.js Developer API Developer",

    "full stack":
      "Full Stack Developer Full Stack Engineer MERN Developer Full Stack Web Developer",

    "full stack developer":
      "Full Stack Developer Full Stack Engineer MERN Developer Full Stack Web Developer",

    "full stack engineer":
      "Full Stack Engineer Full Stack Developer MERN Developer Full Stack Web Developer",

    react:
      "React Developer React Engineer Frontend Developer Frontend Engineer",

    "react developer":
      "React Developer React Engineer Frontend Developer Frontend Engineer",

    node: "Node.js Developer Backend Developer Backend Engineer API Developer",

    "node.js":
      "Node.js Developer Backend Developer Backend Engineer API Developer",

    "node js":
      "Node.js Developer Backend Developer Backend Engineer API Developer",

    javascript:
      "JavaScript Developer Frontend Developer Full Stack Developer Web Developer",

    js: "JavaScript Developer Frontend Developer Full Stack Developer Web Developer",

    java: "Java Developer Java Software Engineer Backend Developer",

    python: "Python Developer Python Software Engineer Backend Developer",

    software:
      "Software Engineer Software Developer Software Development Engineer",

    "software engineer":
      "Software Engineer Software Developer Software Development Engineer",

    "software developer":
      "Software Developer Software Engineer Software Development Engineer",

    devops: "DevOps Engineer Cloud Engineer Site Reliability Engineer",

    cloud: "Cloud Engineer DevOps Engineer AWS Engineer Azure Engineer",

    "data analyst": "Data Analyst Business Analyst Data Analytics",

    "data scientist": "Data Scientist Machine Learning Engineer Data Science",

    "machine learning":
      "Machine Learning Engineer ML Engineer Data Scientist AI Engineer",

    ai: "AI Engineer Machine Learning Engineer Artificial Intelligence Engineer",
  };

  return expansions[normalized] || keyword.trim();
};

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

export const testJSearch = async (req, res) => {
  const jobs = await fetchJSearchJobs("software engineer", "India");

  return res.status(200).json(jobs);
};

export const getExternalJobs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || "software engineer";

  const location = req.query.location || "India";

  const jobType = req.query.jobType || "";

  const experience = req.query.experience || "";

  const expandedKeyword = experience
    ? keyword.trim()
    : expandSearchKeyword(keyword);

  const jobs = await fetchJSearchJobs(
    expandedKeyword,
    location,
    jobType,
    experience,
  );

  const normalizedJobs = normalizeJSearchJobs(jobs, location);

  const filteredJobs = filterJobsByExperience(normalizedJobs, experience);

  return res
    .status(200)
    .json(
      new ApiResponse(200, filteredJobs, "External jobs fetched successfully"),
    );
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const { keyword, location, jobType, experience, sort = "latest" } = req.query;

  const requestedLocation = location || "India";

  let allJobs = [];

  if (keyword?.trim()) {
    const expandedKeyword = experience
      ? keyword.trim()
      : expandSearchKeyword(keyword);

    console.log("JOB SEARCH KEYWORD:", keyword);

    console.log("EXPANDED SEARCH KEYWORD:", expandedKeyword);

    const results = await Promise.allSettled([
      fetchJSearchJobs(expandedKeyword, requestedLocation, jobType, experience),

      fetchJoobleJobs(expandedKeyword, requestedLocation, jobType, experience),

      fetchTheirStackJobs(
        keyword.trim(),
        requestedLocation,
        jobType,
        experience,
      ),
    ]);

    const [jsearchResult, joobleResult, theirStackResult] = results;

    let jsearchJobs = [];
    let joobleJobs = [];
    let theirStackJobs = [];

    if (jsearchResult.status === "fulfilled") {
      jsearchJobs = normalizeJSearchJobs(
        jsearchResult.value,
        requestedLocation,
      );

      console.log("JSEARCH JOB COUNT:", jsearchJobs.length);
    } else {
      console.log(
        "JSEARCH UNAVAILABLE:",
        jsearchResult.reason?.response?.data || jsearchResult.reason?.message,
      );
    }

    if (joobleResult.status === "fulfilled") {
      joobleJobs = normalizeJoobleJobs(joobleResult.value, requestedLocation);

      console.log("JOOBLE JOB COUNT:", joobleJobs.length);
    } else {
      console.log(
        "JOOBLE UNAVAILABLE:",
        joobleResult.reason?.response?.data || joobleResult.reason?.message,
      );
    }

    if (theirStackResult.status === "fulfilled") {
      theirStackJobs = normalizeTheirStackJobs(
        theirStackResult.value,
        requestedLocation,
      );

      console.log("THEIRSTACK JOB COUNT:", theirStackJobs.length);
    } else {
      console.log(
        "THEIRSTACK UNAVAILABLE:",
        theirStackResult.reason?.response?.data ||
          theirStackResult.reason?.message,
      );
    }

    allJobs = [...jsearchJobs, ...joobleJobs, ...theirStackJobs];

    allJobs = filterJobsByExperience(allJobs, experience);

    console.log("TOTAL JOBS BEFORE DEDUPLICATION:", allJobs.length);
  }

  const uniqueJobs = deduplicateJobs(allJobs);

  uniqueJobs.sort((a, b) => {
    const first = new Date(a.createdAt || 0).getTime();

    const second = new Date(b.createdAt || 0).getTime();

    return sort === "oldest" ? first - second : second - first;
  });

  const isGuest = !req.user;

  const requestedPage = Math.max(1, Number(req.query.page || 1));

  const requestedLimit = Math.min(
    50,
    Math.max(1, Number(req.query.limit || 20)),
  );

  const totalJobs = uniqueJobs.length;

  let currentPage = requestedPage;
  let totalPages = Math.max(1, Math.ceil(totalJobs / requestedLimit));

  let paginatedJobs;

  if (isGuest) {
    paginatedJobs = uniqueJobs.slice(0, 4);

    currentPage = 1;
    totalPages = 1;

    console.log("GUEST USER - SHOWING JOBS:", paginatedJobs.length);
  } else {
    const start = (currentPage - 1) * requestedLimit;

    const end = start + requestedLimit;

    paginatedJobs = uniqueJobs.slice(start, end);

    console.log("LOGGED-IN USER - SHOWING JOBS:", paginatedJobs.length);
  }

  console.log("MERGED UNIQUE JOB COUNT:", totalJobs);

  res.set("Cache-Control", "no-store");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalJobs,
        currentPage,
        totalPages,
        jobs: paginatedJobs,
        isGuest,
        visibleJobs: paginatedJobs.length,
      },
      "Jobs fetched successfully",
    ),
  );
});

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const { keyword, location, jobType } = req.query;

    const filter = {};

    if (keyword) {
      filter.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          company: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          skills: {
            $in: [new RegExp(keyword, "i")],
          },
        },
      ];
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    const jobs = await Job.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
