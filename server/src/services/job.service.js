import Job from "../models/Job.js";

export const fetchJobs = async ({
  keyword,
  location,
  jobType,
  experience,
  page = 1,
  limit = 10,
  sort = "latest",
}) => {
  const filter = {};

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { company: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { skills: { $in: [new RegExp(keyword, "i")] } },
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

  if (experience) {
    filter.experience = experience;
  }

  let query = Job.find(filter);

  switch (sort) {
    case "oldest":
      query = query.sort({ createdAt: 1 });
      break;

    case "latest":
    default:
      query = query.sort({ createdAt: -1 });
  }

  const totalJobs = await Job.countDocuments(filter);

  const jobs = await query
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));

  return {
    totalJobs,
    totalPages: Math.ceil(totalJobs / Number(limit)),
    currentPage: Number(page),
    jobs,
  };
};