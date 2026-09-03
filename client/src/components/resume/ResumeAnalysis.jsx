import { Award, BriefcaseBusiness, GraduationCap, Target } from "lucide-react";
import SkillGap from "./SkillGap";

const ResumeAnalysis = ({ analysis, job }) => {
  if (!analysis) {
    return null;
  }

  const skills = analysis.skills || analysis.extractedSkills || [];
  const experience = analysis.experience || [];
  const education = analysis.education || [];

  const score =
    analysis.score ?? analysis.resumeScore ?? analysis.matchScore ?? null;

  return (
    <section className="resume-analysis">
      <div className="resume-analysis-header">
        <div>
          <h2>Resume Analysis</h2>

          {job?.title && (
            <p>
              Analysis for <strong>{job.title}</strong>
            </p>
          )}
        </div>

        {score !== null && (
          <div className="resume-score">
            <span>{score}</span>
            <small>Score</small>
          </div>
        )}
      </div>

      <div className="resume-analysis-grid">
        <div className="analysis-card">
          <div className="analysis-card-icon">
            <Target size={22} />
          </div>

          <div>
            <span>Skills</span>
            <strong>{skills.length}</strong>
          </div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-icon">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <span>Experience</span>
            <strong>{experience.length}</strong>
          </div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-icon">
            <GraduationCap size={22} />
          </div>

          <div>
            <span>Education</span>
            <strong>{education.length}</strong>
          </div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-icon">
            <Award size={22} />
          </div>

          <div>
            <span>Profile</span>
            <strong>
              {analysis.profileCompleteness ?? analysis.completeness ?? "—"}
            </strong>
          </div>
        </div>
      </div>

      {analysis.summary && (
        <div className="analysis-section">
          <h3>Resume Summary</h3>
          <p>{analysis.summary}</p>
        </div>
      )}

      <SkillGap analysis={analysis} job={job} />
    </section>
  );
};

export default ResumeAnalysis;
