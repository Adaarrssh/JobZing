import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import api, { getErrorMessage, unwrap } from "../services/api";
import { normalizeSkills, scoreTone } from "../utils/helpers";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    if (!file) {
      setError("Please choose a PDF resume.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF resumes are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    if (resumeUrl.trim()) {
      formData.append("resumeUrl", resumeUrl.trim());
    }

    setLoading(true);

    try {
      const response = await api.post("/resume-analysis/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });

      const data = unwrap(response);

      setAnalysis(data?.analysis || data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Resume analysis failed. Check the PDF and your backend Gemini configuration.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-intro">
          <div>
            <span className="eyebrow">RESUME INTELLIGENCE</span>

            <h1>Turn your resume into a career signal.</h1>

            <p>
              Upload a PDF. JobZing extracts your skills and uses Gemini to
              surface strengths, gaps, target roles and next improvements.
            </p>
          </div>

          <div className="resume-note">
            <ShieldCheck size={17} />
            PDF only · Max 5 MB
          </div>
        </div>

        <div className="resume-grid">
          <form className="upload-card" onSubmit={submit}>
            <div className="upload-icon">
              <Upload />
            </div>

            <h2>Analyze your resume</h2>

            <p>
              Your backend accepts PDF files only. The file is parsed
              server-side and analyzed by Gemini.
            </p>

            <label className={`dropzone ${file ? "has-file" : ""}`}>
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />

              {file ? (
                <>
                  <FileText size={28} />

                  <strong>{file.name}</strong>

                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </>
              ) : (
                <>
                  <Upload size={25} />

                  <strong>Choose PDF resume</strong>

                  <span>or drop it here</span>
                </>
              )}
            </label>

            <label className="field">
              <span>
                Resume URL <em>optional</em>
              </span>

              <input
                type="url"
                value={resumeUrl}
                onChange={(event) => setResumeUrl(event.target.value)}
                placeholder="https://…"
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button
              className="btn btn-primary btn-lg full"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Analyzing resume…
                </>
              ) : (
                <>
                  Analyze resume
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="analysis-area">
            {!analysis ? (
              <div className="analysis-empty">
                <div className="big-ai-icon">
                  <BrainCircuit />
                </div>

                <h2>Your analysis will appear here.</h2>

                <p>
                  You'll get a score, extracted skills, target roles, missing
                  capabilities and actionable improvements.
                </p>

                <div className="analysis-benefits">
                  <span>
                    <CheckCircle2 />
                    Skill extraction
                  </span>

                  <span>
                    <CheckCircle2 />
                    Role recommendations
                  </span>

                  <span>
                    <CheckCircle2 />
                    Improvement plan
                  </span>
                </div>
              </div>
            ) : (
              <AnalysisResults analysis={analysis} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisResults({ analysis }) {
  const existing = normalizeSkills(analysis?.existingSkills);

  const missing = normalizeSkills(analysis?.missingSkills);

  const recommended = normalizeSkills(analysis?.recommendedSkills);

  const recommendedRoles = Array.isArray(analysis?.recommendedRoles)
    ? analysis.recommendedRoles
    : [];

  const improvementSuggestions = Array.isArray(analysis?.improvementSuggestions)
    ? analysis.improvementSuggestions
    : [];

  const score = Number(analysis?.resumeScore || 0);

  return (
    <div className="analysis-results">
      <div className="score-card">
        <div className={`score-circle ${scoreTone(score)}`}>
          <strong>{score}</strong>
          <span>/100</span>
        </div>

        <div>
          <span className="eyebrow">RESUME SCORE</span>

          <h2>
            {score >= 80
              ? "Strong foundation"
              : score >= 60
                ? "Good start, room to grow"
                : "Needs a sharper pass"}
          </h2>

          <p>
            Use the insights below to make your next version more focused and
            job-ready.
          </p>
        </div>
      </div>

      <ResultSection
        title="Skills detected"
        icon={<CheckCircle2 />}
        tone="success"
        items={existing}
        empty="No skills were detected."
      />

      <ResultSection
        title="Skills to work on"
        icon={<XCircle />}
        tone="danger"
        items={missing}
        empty="No specific missing skills were returned."
      />

      <ResultSection
        title="Recommended next skills"
        icon={<Sparkles />}
        tone="orange"
        items={recommended}
        empty="No extra skills were returned."
      />

      <div className="result-grid-two">
        <ResultSection
          title="Recommended roles"
          icon={<Target />}
          tone="blue"
          items={recommendedRoles}
          empty="No roles returned."
        />

        <ResultSection
          title="Improvement suggestions"
          icon={<Lightbulb />}
          tone="yellow"
          items={improvementSuggestions}
          isList
          empty="No suggestions returned."
        />
      </div>

      <Link className="btn btn-primary" to="/recommendations">
        View my job matches
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}

function ResultSection({
  title,
  icon,
  tone,
  items = [],
  empty,
  isList = false,
}) {
  return (
    <section className="result-section">
      <div className="result-heading">
        <div className={`result-icon ${tone}`}>{icon}</div>

        <h3>{title}</h3>

        <span>{items.length}</span>
      </div>

      {items.length ? (
        <div className={isList ? "suggestion-list" : "skill-cloud"}>
          {items.map((item, index) =>
            isList ? (
              <div key={`${item}-${index}`} className="suggestion">
                <Lightbulb size={15} />
                <span>{item}</span>
              </div>
            ) : (
              <span key={`${item}-${index}`}>{item}</span>
            ),
          )}
        </div>
      ) : (
        <p className="result-empty">{empty}</p>
      )}
    </section>
  );
}
