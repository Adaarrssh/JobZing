import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { analyzeResume } from "../../api/resume.api";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

const ResumeUpload = ({ onAnalysisComplete }) => {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or DOCX resume.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume size must be less than 5MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);

      const response = await analyzeResume(formData);

      onAnalysisComplete?.(response);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to analyze resume.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="resume-upload">
      <div className="resume-upload-header">
        <h2>Upload Your Resume</h2>
        <p>
          Upload your resume to analyze your skills and identify areas for
          improvement.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        hidden
      />

      {!file ? (
        <button
          type="button"
          className="resume-upload-box"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={32} />
          <strong>Choose your resume</strong>
          <span>PDF or DOCX up to 5MB</span>
        </button>
      ) : (
        <div className="resume-file">
          <div className="resume-file-info">
            <FileText size={30} />

            <div>
              <strong>{file.name}</strong>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            aria-label="Remove resume"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : (
        <button
          type="button"
          className="primary-button"
          onClick={handleAnalyze}
          disabled={!file}
        >
          Analyze Resume
        </button>
      )}
    </section>
  );
};

export default ResumeUpload;
