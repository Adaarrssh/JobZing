import ResumeAnalysis from "../models/ResumeAnalysis.model.js";
import { analyzeSkillGap } from "./skillGap.service.js";

export const getJobMatch = async ({ userId, jobSkills }) => {
  const resumeAnalysis = await ResumeAnalysis.findOne({
    userId,
    analysisStatus: "completed",
  }).sort({ createdAt: -1 });

  if (!resumeAnalysis) {
    throw new Error("No completed resume analysis found");
  }

  const skillGap = await analyzeSkillGap({
    resumeSkills: resumeAnalysis.existingSkills,
    jobSkills,
  });

  return {
    resumeAnalysisId: resumeAnalysis._id,
    ...skillGap,
  };
};
