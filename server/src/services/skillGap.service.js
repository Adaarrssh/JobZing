import ai from "../config/gemini.config.js";

const normalizeSkill = (skill) => {
  return skill
    .toLowerCase()
    .replace(/[.\-_/]/g, "")
    .replace(/\s+/g, "")
    .trim();
};

export const analyzeSkillGap = async ({ resumeSkills, jobSkills }) => {
  const normalizedResumeSkills = resumeSkills.map(normalizeSkill);
  const normalizedJobSkills = jobSkills.map(normalizeSkill);

  const matchedSkills = jobSkills.filter((skill) =>
    normalizedResumeSkills.includes(normalizeSkill(skill)),
  );

  const missingSkills = jobSkills.filter(
    (skill) => !normalizedResumeSkills.includes(normalizeSkill(skill)),
  );

  const matchScore =
    jobSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / jobSkills.length) * 100);

  const prompt = `
You are an expert technical recruiter and career advisor.

Candidate Skills:
${JSON.stringify(resumeSkills)}

Job Skills:
${JSON.stringify(jobSkills)}

Matched Skills:
${JSON.stringify(matchedSkills)}

Missing Skills:
${JSON.stringify(missingSkills)}

Return ONLY valid JSON in exactly this structure:

{
  "criticalSkills": [],
  "recommendedSkills": []
}

Rules:

- criticalSkills: missing skills that are especially important for this job.
- recommendedSkills: additional useful skills that can improve the candidate's chances.
- Do not repeat matchedSkills or missingSkills in recommendedSkills.
- Do not invent candidate skills.
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

  const parsedResult = JSON.parse(result);

  return {
    matchedSkills,
    missingSkills,
    criticalSkills: parsedResult.criticalSkills ?? [],
    recommendedSkills: parsedResult.recommendedSkills ?? [],
    matchScore,
  };
};
