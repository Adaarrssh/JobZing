import API from "./api";

export const analyzeResume = async (resumeFile) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const response = await API.post("/resume-analysis/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
