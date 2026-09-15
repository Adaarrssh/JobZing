import ai from "../config/gemini.config.js";

const cleanText = (text) => {
  return String(text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const cleanJson = (text) => {
  return String(text || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const extractJobSkills = async ({ jobTitle, jobDescription }) => {
  const prompt = `
You are an expert technical recruiter.

Job Title:
${cleanText(jobTitle)}

Job Description:
${cleanText(jobDescription)}

Identify the important technical skills, technologies, frameworks, programming languages, databases, tools, platforms, methodologies, and role-specific technical capabilities required for this job.

Return ONLY valid JSON:

{
  "requiredSkills": []
}

Rules:
- Extract skills that are actually supported by the job title or description.
- Prefer concrete technical skills such as React, ReactJS, JavaScript, Node.js, SQL, MongoDB, Git, AWS, Docker, REST APIs, etc.
- Do not turn generic responsibilities into skills.
- Do not include generic soft skills such as teamwork, communication, hardworking, leadership, or adaptability unless the job specifically requires a formal technical capability related to them.
- Keep skill names concise and standardized.
- Do not invent skills.
- Return JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const parsedResult = JSON.parse(cleanJson(response.text));

  return Array.isArray(parsedResult.requiredSkills)
    ? parsedResult.requiredSkills
    : [];
};

const compareSkillsWithAI = async ({
  resumeSkills,
  requiredSkills,
  jobTitle,
  jobDescription,
}) => {
  const prompt = `
You are an expert technical recruiter performing a resume-to-job skill comparison.

Candidate Resume Skills:
${JSON.stringify(resumeSkills)}

Required Job Skills:
${JSON.stringify(requiredSkills)}

Job Title:
${cleanText(jobTitle)}

Job Description:
${cleanText(jobDescription)}

Compare the candidate's skills with the required job skills.

Return ONLY valid JSON in exactly this structure:

{
  "matchedSkills": [],
  "missingSkills": [],
  "criticalSkills": [],
  "recommendedSkills": []
}

Rules:

1. matchedSkills:
- Include only skills from requiredSkills that the candidate clearly has based on Candidate Resume Skills.
- Semantic equivalents are allowed.
- Examples:
  - React and ReactJS can be considered equivalent.
  - JavaScript and JS can be considered equivalent.
  - Node and Node.js can be considered equivalent.
  - Mongo and MongoDB can be considered equivalent.
  - REST and REST APIs can be considered equivalent when appropriate.
- Do not match a skill merely because it is related.
- Do not assume a candidate knows a technology just because they know another related technology.
- Never invent candidate skills.

2. missingSkills:
- Include required job skills that the candidate does not clearly demonstrate.
- Use the original required skill name where possible.

3. criticalSkills:
- Include only skills from missingSkills.
- Select the missing skills that are most important for successfully performing this specific job.
- Do not invent skills.

4. recommendedSkills:
- Include useful additional skills from the job description that would strengthen the candidate's profile.
- Do not repeat matchedSkills, missingSkills, or criticalSkills.
- Do not invent skills.

5. Keep all skill names concise and standardized.

Return JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return JSON.parse(cleanJson(response.text));
};

export const analyzeSkillGap = async ({
  resumeSkills = [],
  jobSkills = [],
  jobTitle = "",
  jobDescription = "",
}) => {
  const cleanedResumeSkills = Array.isArray(resumeSkills)
    ? resumeSkills.filter(Boolean).map(cleanText)
    : [];

  let requiredSkills = Array.isArray(jobSkills)
    ? jobSkills.filter(Boolean).map(cleanText)
    : [];

  const cleanedDescription = cleanText(jobDescription);

  if (requiredSkills.length === 0 && cleanedDescription) {
    requiredSkills = await extractJobSkills({
      jobTitle,
      jobDescription: cleanedDescription,
    });
  }

  requiredSkills = [...new Set(requiredSkills)];

  if (requiredSkills.length === 0) {
    return {
      requiredSkills: [],
      matchedSkills: [],
      missingSkills: [],
      criticalSkills: [],
      recommendedSkills: [],
      matchScore: 0,
    };
  }

  const comparison = await compareSkillsWithAI({
    resumeSkills: cleanedResumeSkills,
    requiredSkills,
    jobTitle,
    jobDescription: cleanedDescription,
  });

  const matchedSkills = Array.isArray(comparison.matchedSkills)
    ? comparison.matchedSkills
    : [];

  const missingSkills = Array.isArray(comparison.missingSkills)
    ? comparison.missingSkills
    : [];

  const criticalSkills = Array.isArray(comparison.criticalSkills)
    ? comparison.criticalSkills.filter((skill) =>
        missingSkills.some(
          (missing) =>
            String(missing).toLowerCase() === String(skill).toLowerCase(),
        ),
      )
    : [];

  const recommendedSkills = Array.isArray(comparison.recommendedSkills)
    ? comparison.recommendedSkills
    : [];

  const matchScore = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100,
  );

  return {
    requiredSkills,
    matchedSkills,
    missingSkills,
    criticalSkills,
    recommendedSkills,
    matchScore,
  };
};
