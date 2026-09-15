import ResumeAnalysis from "../models/ResumeAnalysis.model.js";
import {
  fetchJSearchJobs,
  normalizeJSearchJobs,
} from "./provider/jsearch.provider.js";
import {
  fetchJoobleJobs,
  normalizeJoobleJobs,
} from "./provider/jooble.provider.js";
import {
  fetchTheirStackJobs,
  normalizeTheirStackJobs,
} from "./provider/theirstack.provider.js";

const normalizeSkill = (skill = "") => {
  return String(skill)
    .toLowerCase()
    .replace(/[.\-_/+#]/g, "")
    .replace(/\s+/g, "")
    .trim();
};

const getSkills = (job) => {
  if (Array.isArray(job?.skills) && job.skills.length) {
    return job.skills.filter(Boolean);
  }

  const text = `${job?.title || ""} ${job?.description || ""}`.toLowerCase();

  const commonSkills = [
    "javascript",
    "typescript",
    "react",
    "reactjs",
    "nextjs",
    "node",
    "nodejs",
    "express",
    "mongodb",
    "mysql",
    "postgresql",
    "sql",
    "java",
    "python",
    "c++",
    "html",
    "css",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "rest api",
    "api",
    "redux",
    "angular",
    "vue",
    "spring boot",
    "figma",
    "tailwind",
    "bootstrap",
  ];

  return commonSkills.filter((skill) => {
    const normalized = skill.toLowerCase();
    return text.includes(normalized);
  });
};

const calculateSkillGap = (resumeSkills = [], jobSkills = []) => {
  const normalizedResumeSkills = resumeSkills.map(normalizeSkill);

  const matchedSkills = jobSkills.filter((skill) =>
    normalizedResumeSkills.includes(normalizeSkill(skill)),
  );

  const missingSkills = jobSkills.filter(
    (skill) => !normalizedResumeSkills.includes(normalizeSkill(skill)),
  );

  const matchScore =
    jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

  const criticalSkills = missingSkills.slice(0, 3);

  return {
    matchedSkills,
    missingSkills,
    criticalSkills,
    recommendedSkills: missingSkills.slice(0, 5),
    matchScore,
  };
};

export const getRecommendedJobs = async ({ userId }) => {
  const resumeAnalysis = await ResumeAnalysis.findOne({
    userId,
    analysisStatus: "completed",
  }).sort({ createdAt: -1 });

  if (!resumeAnalysis) {
    throw new Error("No completed resume analysis found");
  }

  const resumeSkills = Array.isArray(resumeAnalysis.existingSkills)
    ? resumeAnalysis.existingSkills
    : [];

  const query = resumeSkills.slice(0, 5).join(" ");

  if (!query) {
    return [];
  }

  const results = await Promise.allSettled([
    fetchJSearchJobs(query, "India"),
    fetchJoobleJobs(query, "India"),
    fetchTheirStackJobs(query, "India"),
  ]);

  const jsearchJobs =
    results[0].status === "fulfilled"
      ? normalizeJSearchJobs(results[0].value, "India")
      : [];

  const joobleJobs =
    results[1].status === "fulfilled"
      ? normalizeJoobleJobs(results[1].value, "India")
      : [];

  const theirStackJobs =
    results[2].status === "fulfilled"
      ? normalizeTheirStackJobs(results[2].value, "India")
      : [];

  const allJobs = [...jsearchJobs, ...joobleJobs, ...theirStackJobs];

  const uniqueJobs = [];
  const seen = new Set();

  for (const job of allJobs) {
    const key = [job.title, job.company, job.location]
      .join("|")
      .toLowerCase()
      .trim();

    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  const recommendations = uniqueJobs.map((job) => {
    const jobSkills = getSkills(job);

    const skillGap = calculateSkillGap(resumeSkills, jobSkills);

    return {
      job: {
        _id: job.jobId,
        jobId: job.jobId,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType,
        experience: job.experience,
        description: job.description,
        skills: jobSkills,
        applyLink: job.applyLink,
        source: job.source,
        createdAt: job.createdAt,
      },
      matchScore: skillGap.matchScore,
      matchedSkills: skillGap.matchedSkills,
      missingSkills: skillGap.missingSkills,
      criticalSkills: skillGap.criticalSkills,
      recommendedSkills: skillGap.recommendedSkills,
    };
  });

  recommendations.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }

    return (a.job?.title || "").localeCompare(b.job?.title || "");
  });

  return recommendations.slice(0, 20);
};
