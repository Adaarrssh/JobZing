import axios from "axios";

export const fetchJSearchJobs = async (query) => {
  try {
    console.log("JSEARCH URL:", process.env.JSEARCH_BASE_URL);
    console.log("RAPIDAPI KEY EXISTS:", !!process.env.RAPIDAPI_KEY);
    console.log("QUERY:", query);

    const response = await axios.get(
      `${process.env.JSEARCH_BASE_URL}/search-v2`,
      {
        params: {
          query,
          num_pages: 1,
          country: "us",
          date_posted: "all",
        },
        headers: {
          "x-rapidapi-key": process.env.JSEARCH_API_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      },
    );

    console.log("JSEARCH STATUS:", response.status);
    console.log("JSEARCH RESPONSE:", JSON.stringify(response.data, null, 2));

    return response.data.data || [];
  } catch (error) {
    console.log("JSEARCH ERROR STATUS:", error.response?.status);
    console.log("JSEARCH ERROR DATA:", error.response?.data || error.message);

    throw error;
  }
};

export const normalizeJSearchJobs = (jobs) => {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs.map((job) => ({
    title: job.job_title,
    company: job.employer_name,
    location: `${job.job_city || ""}, ${job.job_country || ""}`,
    salary: job.job_salary || "Not disclosed",
    jobType: job.job_employment_type,
    experience: "Not specified",
    description: job.job_description,
    skills: [],
    applyLink: job.job_apply_link,
    source: "JSearch",
  }));
};
