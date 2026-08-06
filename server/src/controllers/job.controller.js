import Job from "../models/Job.js";
import { fetchJobs } from "../services/job.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { fetchJSearchJobs } from "../services/provider/jsearch.provider.js";

export const testJSearch = async (req, res) => {
  const jobs = await fetchJSearchJobs("software engineer");

  res.status(200).json(jobs);
};

export const getExternalJobs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || "software engineer";

  const jobs = await fetchJSearchJobs(keyword);

  return res.status(200).json(
    new ApiResponse(
      200,
      jobs,
      "External jobs fetched successfully"
    )
  );
});


export const getAllJobs = asyncHandler(async (req, res) => {
  const result = await fetchJobs(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalJobs: result.totalJobs,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        jobs: result.jobs,
      },
      "Jobs fetched successfully"
    )
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
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
        { skills: { $in: [new RegExp(keyword, "i")] } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

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