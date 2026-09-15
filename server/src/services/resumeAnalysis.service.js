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
    if (!resumeText || !resumeText.trim()) {
      throw new Error("Resume text is empty or could not be extracted.");
    }

    const prompt = `
You are an expert technical resume analyzer and career advisor.

You must analyze the actual resume content provided below.

IMPORTANT:
- Do NOT return placeholder values.
- Do NOT copy example values.
- Calculate the resume score from the actual resume.
- Identify skills that are actually written in the resume.
- Read the complete resume before generating the result.
- The candidate may be a student or fresher. Do not penalize the candidate simply for having limited professional experience.
- Projects, technical skills, education, certifications, internships, achievements and relevant coursework should be considered when evaluating the resume.
- If the resume contains many technical skills and projects, existingSkills must contain those skills.
- resumeScore should normally be greater than 0 when the resume contains meaningful education, skills or projects.
- Do not invent information that is not present in the resume.

RESUME CONTENT START
${resumeText}
RESUME CONTENT END

Return a structured analysis of this exact resume.

existingSkills:
Include the important technical and professional skills explicitly present in the resume.

missingSkills:
Include important skills that are not present in the resume but would be useful for the candidate's likely target roles.

recommendedSkills:
Include additional skills that can improve the candidate's future job opportunities.

recommendedRoles:
Suggest realistic job roles based on the candidate's actual education, skills, projects and experience.

improvementSuggestions:
Give concise and actionable suggestions to improve the resume.

The resumeScore must be an integer between 0 and 100 and must reflect the actual quality of the resume.

Do not use zero or empty arrays as placeholders.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            resumeScore: {
              type: "integer",
              minimum: 0,
              maximum: 100,
            },
            existingSkills: {
              type: "array",
              items: {
                type: "string",
              },
            },
            missingSkills: {
              type: "array",
              items: {
                type: "string",
              },
            },
            recommendedSkills: {
              type: "array",
              items: {
                type: "string",
              },
            },
            recommendedRoles: {
              type: "array",
              items: {
                type: "string",
              },
            },
            improvementSuggestions: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: [
            "resumeScore",
            "existingSkills",
            "missingSkills",
            "recommendedSkills",
            "recommendedRoles",
            "improvementSuggestions",
          ],
        },
      },
    });

    const result = response.text?.trim();

    console.log("===== GEMINI RESUME RESPONSE =====");
    console.log(result);
    console.log("==================================");

    if (!result) {
      throw new Error("Gemini returned an empty resume analysis.");
    }

    const parsedResult = JSON.parse(result);

    const resumeScore = Number(parsedResult.resumeScore);

    if (
      !Number.isInteger(resumeScore) ||
      resumeScore < 0 ||
      resumeScore > 100
    ) {
      throw new Error("Gemini returned an invalid resume score.");
    }

    if (
      !Array.isArray(parsedResult.existingSkills) ||
      !Array.isArray(parsedResult.missingSkills) ||
      !Array.isArray(parsedResult.recommendedSkills) ||
      !Array.isArray(parsedResult.recommendedRoles) ||
      !Array.isArray(parsedResult.improvementSuggestions)
    ) {
      throw new Error("Gemini returned an invalid resume analysis structure.");
    }

    if (
      resumeScore === 0 &&
      parsedResult.existingSkills.length === 0 &&
      parsedResult.recommendedRoles.length === 0
    ) {
      throw new Error(
        "Gemini returned an empty resume analysis despite receiving resume content.",
      );
    }

    analysis.resumeScore = resumeScore;
    analysis.existingSkills = parsedResult.existingSkills;
    analysis.missingSkills = parsedResult.missingSkills;
    analysis.recommendedSkills = parsedResult.recommendedSkills;
    analysis.recommendedRoles = parsedResult.recommendedRoles;
    analysis.improvementSuggestions = parsedResult.improvementSuggestions;

    analysis.analysisStatus = "completed";

    await analysis.save();

    return analysis;
  } catch (error) {
    console.error("Resume analysis failed:", error);

    analysis.analysisStatus = "failed";
    await analysis.save();

    throw error;
  }
};
