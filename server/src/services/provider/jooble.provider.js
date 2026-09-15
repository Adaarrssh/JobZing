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
  const text = [job.title, job.snippet, job.type]
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

const searchJooble = async (searchQuery, location = "India") => {
  const response = await axios.post(
    `${process.env.JOOBLE_BASE_URL}/api/${process.env.JOOBLE_API_KEY}`,
    {
      keywords: searchQuery,
      location: location || "India",
      page: 1,
      ResultOnPage: 20,
      companysearch: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    },
  );

  const jobs = response.data?.jobs;

  return Array.isArray(jobs) ? jobs : [];
};

export const fetchJoobleJobs = async (
  query,
  location = "India",
  jobType = "",
  experience = "",
  company = "",
) => {
  try {
    let searchQuery = [query?.trim(), company?.trim()]
      .filter(Boolean)
      .join(" ");

    if (!searchQuery) {
      searchQuery = "jobs";
    }

    if (experience === "Fresher") {
      searchQuery = `${searchQuery} Fresher`;
    }

    if (experience === "Experienced") {
      searchQuery = `${searchQuery} Experienced`;
    }

    if (experience === "Intern") {
      searchQuery = `${searchQuery} Internship`;
    }

    if (jobType === "Internship") {
      searchQuery = `${searchQuery} Internship`;
    }

    const jobs = await searchJooble(searchQuery, location);

    let filteredJobs = jobs;

    if (company?.trim()) {
      filteredJobs = jobs.filter((job) => isCompanyMatch(job.company, company));
    }

    const uniqueJobs = [];
    const seen = new Set();

    filteredJobs.forEach((job) => {
      const key =
        job.id ||
        [job.title, job.company, job.location].filter(Boolean).join("-");

      const normalizedKey = String(key).toLowerCase().trim();

      if (!seen.has(normalizedKey)) {
        seen.add(normalizedKey);
        uniqueJobs.push(job);
      }
    });

    return uniqueJobs;
  } catch (error) {
    console.log("JOOBLE ERROR STATUS:", error.response?.status);
    console.log("JOOBLE ERROR DATA:", error.response?.data || error.message);

    throw error;
  }
};

export const normalizeJoobleJobs = (jobs, requestedLocation = "India") => {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs.map((job) => ({
    jobId: `jooble-${job.id}`,
    title: job.title || "Untitled role",
    company: job.company || "Company",
    location: job.location || requestedLocation || "India",
    salary: job.salary || "Not disclosed",
    jobType: job.type || "Not specified",
    experience: detectExperience(job),
    description: job.snippet || "",
    skills: [],
    applyLink: job.link || "",
    source: "Jooble",
    createdAt: job.updated || null,
  }));
};
