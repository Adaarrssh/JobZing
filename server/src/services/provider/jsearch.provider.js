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

const isLikelyFresherJob = (job) => {
  if (job.job_required_experience?.no_experience_required === true) {
    return true;
  }

  const text = [
    job.job_title,
    job.job_description,
    job.job_highlights?.Qualifications?.join(" "),
    job.job_highlights?.Responsibilities?.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /\b(fresher|freshers|entry[- ]level|no experience|graduate|graduates|trainee|junior)\b/i.test(
      text,
    )
  ) {
    return true;
  }

  if (/\b0\s*(?:to|[-–])\s*1\s*years?\b/i.test(text)) {
    return true;
  }

  if (/\b0\s*(?:to|[-–])\s*2\s*years?\b/i.test(text)) {
    return true;
  }

  return false;
};

const searchJSearch = async (searchQuery, jobType = "") => {
  const params = {
    query: searchQuery,
    page: 1,
    num_pages: 1,
    country: "in",
    date_posted: "all",
  };

  if (jobType) {
    const employmentTypeMap = {
      "Full-Time": "FULLTIME",
      "Part-Time": "PARTTIME",
      Internship: "INTERN",
      Contract: "CONTRACTOR",
    };

    const employmentType = employmentTypeMap[jobType];

    if (employmentType) {
      params.employment_types = employmentType;
    }
  }

  const response = await axios.get(
    `${process.env.JSEARCH_BASE_URL}/search-v2`,
    {
      params,
      headers: {
        "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      timeout: 8000,
    },
  );

  const jobs = response.data?.data?.jobs || response.data?.data || [];

  return Array.isArray(jobs) ? jobs : [];
};

export const fetchJSearchJobs = async (
  query,
  location = "India",
  jobType = "",
  experience = "",
  company = "",
) => {
  try {
    const baseParts = [
      query?.trim(),
      company?.trim(),
      location || "India",
    ].filter(Boolean);

    let searchQueries = [baseParts.join(" ")];

    if (!searchQueries[0]) {
      searchQueries = ["jobs India"];
    }

    if (experience === "Fresher") {
      searchQueries = [
        `${query?.trim() || "jobs"} ${
          company?.trim() || ""
        } Fresher ${location || "India"}`
          .replace(/\s+/g, " ")
          .trim(),
      ];
    }

    if (experience === "Experienced") {
      searchQueries = [
        `${query?.trim() || "jobs"} ${
          company?.trim() || ""
        } Experienced ${location || "India"}`
          .replace(/\s+/g, " ")
          .trim(),
      ];
    }

    console.log("JSEARCH EXPERIENCE MODE:", experience || "all");
    console.log("JSEARCH QUERY 1:", searchQueries[0]);

    let jobs = await searchJSearch(searchQueries[0], jobType);

    console.log("JSEARCH QUERY 1 JOB COUNT:", jobs.length);

    if (experience === "Fresher" && !jobs.some(isLikelyFresherJob)) {
      const fallbackQuery = `${query?.trim() || "jobs"} ${
        company?.trim() || ""
      } Entry Level ${location || "India"}`
        .replace(/\s+/g, " ")
        .trim();

      console.log("JSEARCH FALLBACK QUERY:", fallbackQuery);

      const fallbackJobs = await searchJSearch(fallbackQuery, jobType);

      console.log("JSEARCH FALLBACK JOB COUNT:", fallbackJobs.length);

      jobs = [...jobs, ...fallbackJobs];
    }

    if (company?.trim()) {
      jobs = jobs.filter((job) => isCompanyMatch(job.employer_name, company));
    }

    const uniqueJobs = [];
    const seen = new Set();

    jobs.forEach((job) => {
      const key =
        job.job_id ||
        [job.job_title, job.employer_name, job.job_city]
          .filter(Boolean)
          .join("-");

      const normalizedKey = String(key).toLowerCase().trim();

      if (!seen.has(normalizedKey)) {
        seen.add(normalizedKey);
        uniqueJobs.push(job);
      }
    });

    console.log("JSEARCH FINAL RAW JOB COUNT:", uniqueJobs.length);

    return uniqueJobs;
  } catch (error) {
    console.log("JSEARCH ERROR STATUS:", error.response?.status);
    console.log("JSEARCH ERROR DATA:", error.response?.data || error.message);

    throw error;
  }
};

const detectExperience = (job) => {
  const requiredExperience = job.job_required_experience;

  if (requiredExperience?.no_experience_required === true) {
    return "Fresher";
  }

  const months = requiredExperience?.required_experience_in_months;

  if (typeof months === "number") {
    if (months <= 12) {
      return "Fresher";
    }

    if (months < 36) {
      return "1-3 Years";
    }

    return "3+ Years";
  }

  const text = [
    job.job_title,
    job.job_description,
    job.job_highlights?.Qualifications?.join(" "),
    job.job_highlights?.Responsibilities?.join(" "),
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

  const yearsExperience = normalizedText.match(
    /experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*years?/i,
  );

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

  if (yearsExperience) {
    const years = Number(yearsExperience[1]);

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

export const normalizeJSearchJobs = (jobs, requestedLocation = "India") => {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs.map((job) => {
    let location = "";

    if (job.job_is_remote) {
      location = "Remote";
    } else {
      location = [job.job_city, job.job_state, job.job_country]
        .filter(Boolean)
        .join(", ");
    }

    if (!location) {
      location = requestedLocation || "India";
    }

    const salary =
      job.job_min_salary || job.job_max_salary
        ? `${job.job_min_salary || ""}${
            job.job_min_salary && job.job_max_salary ? " - " : ""
          }${job.job_max_salary || ""}`
        : "Not disclosed";

    return {
      jobId: job.job_id,
      title: job.job_title || "Untitled role",
      company: job.employer_name || "Company",
      location,
      salary,
      jobType: job.job_employment_type || "Full-Time",
      experience: detectExperience(job),
      description: job.job_description || "",
      skills: job.job_required_skills || [],
      applyLink: job.job_apply_link || "",
      source: "JSearch",
      createdAt: job.job_posted_at_datetime_utc || null,
    };
  });
};
