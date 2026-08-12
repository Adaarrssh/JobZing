import ResumeAnalysis from "../models/ResumeAnalysis.model.js";
import ai from "../config/gemini.config.js";

export const analyzeResume = async ({ userId, resumeUrl, resumeText }) => {
  const analysis = await ResumeAnalysis.create({
    userId,
    resumeUrl,
    resumeText,
    analysisStatus: "processing",
  });

  try {
    const prompt = `
You are an expert resume analyzer and career advisor.

Analyze the following resume and return ONLY valid JSON.

Resume:
${resumeText}

Return exactly this structure:

{
  "resumeScore": 0,
  "existingSkills": [],
  "missingSkills": [],
  "recommendedSkills": [],
  "recommendedRoles": [],
  "improvementSuggestions": []
}

Rules:
- resumeScore must be a number between 0 and 100.
- existingSkills must contain skills clearly present in the resume.
- missingSkills must contain important skills that are absent from the resume but relevant to the candidate's profile.
- recommendedSkills must contain skills that would improve the candidate's future job opportunities.
- Do not repeat skills between existingSkills, missingSkills and recommendedSkills.
- recommendedRoles should contain realistic job roles based on the resume.
- improvementSuggestions should contain concise actionable suggestions.
- Do not invent experience, education, projects or skills that are not present in the resume.
- Return JSON only. No markdown, no explanation outside JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let result = response.text.trim();

    result = result
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsedResult = JSON.parse(result);

    analysis.resumeScore = parsedResult.resumeScore ?? 0;
    analysis.existingSkills = parsedResult.existingSkills ?? [];
    analysis.missingSkills = parsedResult.missingSkills ?? [];
    analysis.recommendedSkills = parsedResult.recommendedSkills ?? [];
    analysis.recommendedRoles = parsedResult.recommendedRoles ?? [];
    analysis.improvementSuggestions = parsedResult.improvementSuggestions ?? [];
    analysis.analysisStatus = "completed";

    await analysis.save();

    return analysis;
  } catch (error) {
    analysis.analysisStatus = "failed";
    await analysis.save();

    throw error;
  }
};
