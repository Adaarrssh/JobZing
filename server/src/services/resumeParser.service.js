import pdf from "pdf-parse";

export const extractResumeText = async (fileBuffer) => {
  const data = await pdf(fileBuffer);

  return data.text.trim();
};
