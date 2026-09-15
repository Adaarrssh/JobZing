import axios from "axios";

const normalizeCompanyName = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const isCompanyMatch = (jobCompany, requestedCompany) => {
  const actual = normalizeCompanyName(jobCompany);
  const requested = normalizeCompanyName(requestedCompany);

  if (!actual || !requested) {
    return false;
  }

  return (
    actual === requested ||
    actual.startsWith(`${requested} `) ||
    actual.includes(` ${requested} `) ||
    requested.startsWith(`${actual} `)
  );
};

const detectExperience = (job) => {
  const seniority = String(job.seniority || "").toLowerCase();

  if (seniority === "junior") {
    return "Fresher";
  }

  if (seniority === "mid_level") {
    return "1-3 Years";
  }

  if (
    seniority === "senior" ||
    seniority === "staff" ||
    seniority === "c_level"
  ) {
    return "3+ Years";
  }

  const text = [
    job.job_title,
    job.description,
    job.short_description,
    job.seniority,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const normalizedText = text
    .replace(/(\d)\s*\.\s*(\d)/g, "$1.$2")
    .replace(/(\d)\s*-\s*(\d)/g, "$1-$2");

  const rangeExperience = normalizedText.match(
    /(\d+(?:\.\d+)?)\s*(?:to|[-–])\s*(\d+(?:\.\d+)?)\s*years?/i,
  );

  const plusExperience = normalizedText.match(/(\d+(?:\.\d+)?)\s*\+\s*years?/i);

  if (rangeExperience) {
    const minimumYears = Number(rangeExperience[1]);
    const maximumYears = Number(rangeExperience[2]);

    if (minimumYears === 0 && maximumYears <= 2) {
      return "Fresher";
    }

    if (minimumYears < 3) {
      return "1-3 Years";
    }

    return "3+ Years";
  }

  if (plusExperience) {
    const years = Number(plusExperience[1]);

    if (years <= 1) {
      return "Fresher";
    }

    if (years < 3) {
      return "1-3 Years";
    }

    return "3+ Years";
  }

  if (
    /\b(fresher|freshers|entry[- ]level|no experience|graduate|graduates|trainee|junior)\b/i.test(
      normalizedText,
    )
  ) {
    return "Fresher";
  }

  if (
    /\b(senior|lead|principal|manager|mid[- ]level|experienced)\b/i.test(
      normalizedText,
    )
  ) {
    return "3+ Years";
  }

  return "Not specified";
};

const searchTheirStack = async (
  query,
  location = "India",
  jobType = "",
  experience = "",
  company = "",
) => {
  const body = {
    job_country_code_or: ["IN"],
    posted_at_max_age_days: 30,
    limit: 25,
    page: 0,
    is_closed: false,
  };

  if (query?.trim()) {
    body.job_title_or = [query.trim()];
  }

  if (company?.trim()) {
    body.company_name_or = [company.trim()];
  }

  if (location && location.toLowerCase() !== "india") {
    body.job_location_pattern_or = [location.trim()];
  }

  if (experience === "Fresher") {
    body.job_seniority_or = ["junior"];
  }

  if (experience === "Experienced") {
    body.job_seniority_or = ["mid_level", "senior", "staff", "c_level"];
  }

  if (experience === "Intern") {
    body.internship = true;
  }

  if (jobType === "Full-Time") {
    body.full_time = true;
  }

  if (jobType === "Part-Time") {
    body.part_time = true;
  }

  if (jobType === "Contract") {
    body.contract = true;
  }

  if (jobType === "Internship") {
    body.internship = true;
  }

  const response = await axios.post(
    `${process.env.THEIRSTACK_BASE_URL}/v1/jobs/search`,
    body,
    {
      headers: {
        Authorization: `Bearer ${process.env.THEIRSTACK_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
    },
  );

  const jobs = response.data?.data || [];

  return Array.isArray(jobs) ? jobs : [];
};

export const fetchTheirStackJobs = async (
  query,
  location = "India",
  jobType = "",
  experience = "",
  company = "",
) => {
  try {
    const jobs = await searchTheirStack(
      query,
      location,
      jobType,
      experience,
      company,
    );

    let filteredJobs = jobs;

    if (company?.trim()) {
      filteredJobs = jobs.filter((job) => isCompanyMatch(job.company, company));
    }

    const uniqueJobs = [];
    const seen = new Set();

    filteredJobs.forEach((job) => {
      const key =
        job.id ||
        [job.job_title, job.company, job.long_location]
          .filter(Boolean)
          .join("-");

      const normalizedKey = String(key).toLowerCase().trim();

      if (!seen.has(normalizedKey)) {
        seen.add(normalizedKey);
        uniqueJobs.push(job);
      }
    });

    return uniqueJobs;
  } catch (error) {
    console.log("THEIRSTACK ERROR STATUS:", error.response?.status);

    console.log(
      "THEIRSTACK ERROR DATA:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

export const normalizeTheirStackJobs = (jobs, requestedLocation = "India") => {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs.map((job) => {
    let location = "";

    if (job.remote) {
      location = "Remote";
    } else {
      location =
        job.long_location ||
        job.location ||
        job.cities?.join(", ") ||
        requestedLocation ||
        "India";
    }

    const salary =
      job.salary_string ||
      (job.min_annual_salary || job.max_annual_salary
        ? `${job.min_annual_salary || ""}${
            job.min_annual_salary && job.max_annual_salary ? " - " : ""
          }${job.max_annual_salary || ""}`
        : "Not disclosed");

    const description = job.description || job.short_description || "";

    return {
      jobId: `theirstack-${job.id}`,
      title: job.job_title || job.normalized_title || "Untitled role",
      company: job.company || "Company",
      location,
      salary,
      jobType: job.internship
        ? "Internship"
        : job.full_time
          ? "Full-Time"
          : job.part_time
            ? "Part-Time"
            : job.contract
              ? "Contract"
              : "Not specified",
      experience: detectExperience(job),
      description,
      skills: Array.isArray(job.technology_names) ? job.technology_names : [],
      applyLink: job.final_url || job.url || "",
      source: "TheirStack",
      createdAt: job.posted_at || job.discovered_at || null,
    };
  });
};
