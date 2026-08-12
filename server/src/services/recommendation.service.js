import ResumeAnalysis from "../models/ResumeAnalysis.model.js";
import Job from "../models/Job.js";
import { analyzeSkillGap } from "./skillGap.service.js";

export const getRecommendedJobs = async ({ userId }) => {
  const resumeAnalysis = await ResumeAnalysis.findOne({
    userId,
    analysisStatus: "completed",
  }).sort({ createdAt: -1 });

  if (!resumeAnalysis) {
    throw new Error("No completed resume analysis found");
  }

  const jobs = await Job.find();

  if (!jobs.length) {
    return [];
  }

  const recommendations = [];

  for (const job of jobs) {
    const skillGap = await analyzeSkillGap({
      resumeSkills: resumeAnalysis.existingSkills,
      jobSkills: job.skills,
    });

    recommendations.push({
      job,
      matchScore: skillGap.matchScore,
      matchedSkills: skillGap.matchedSkills,
      missingSkills: skillGap.missingSkills,
      criticalSkills: skillGap.criticalSkills,
      recommendedSkills: skillGap.recommendedSkills,
    });
  }

  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
};
