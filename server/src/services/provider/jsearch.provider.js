import axios from "axios";

export const fetchJSearchJobs = async (query) => {
  try {
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
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      }
    );

    const data = response.data.data;

    console.log("DATA:", data);
    console.log("TYPE:", typeof data);
    console.log("IS ARRAY:", Array.isArray(data));
    
    console.log(JSON.stringify(response.data, null, 2));
    return data;

    
  } catch (error) {
    console.log(error.response?.status);
    console.log(error.response?.data || error.message);
    return [];
  }
};

export const normalizeJSearchJobs = (jobs) => {
  console.log("normalize input:", jobs);

  if (!Array.isArray(jobs)) {
    console.log("Not an array!");
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