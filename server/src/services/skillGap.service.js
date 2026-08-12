import ai from "../config/gemini.config.js";

export const analyzeSkillGap = async ({ resumeSkills, jobSkills }) => {
  const prompt = `
You are an expert technical recruiter and career advisor.

Compare the candidate's resume skills with the skills required for the job.

Candidate Skills:
${JSON.stringify(resumeSkills)}

Job Skills:
${JSON.stringify(jobSkills)}

Return ONLY valid JSON in exactly this structure:

{
  "matchedSkills": [],
  "missingSkills": [],
  "criticalSkills": [],
  "recommendedSkills": [],
  "matchScore": 0
}

Rules:
- matchedSkills: skills present in both the candidate skills and job skills.
- missingSkills: job skills that are not present in the candidate skills.
- criticalSkills: missing job skills that are especially important for this role.
- recommendedSkills: additional skills that can improve the candidate's chances for this role.
- matchScore: number from 0 to 100 based primarily on the required job skills.
- Do not invent candidate skills.
- Do not put the same skill in multiple categories.
- Keep skill names concise and standardized.
- Return JSON only.
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

  return JSON.parse(result);
};
