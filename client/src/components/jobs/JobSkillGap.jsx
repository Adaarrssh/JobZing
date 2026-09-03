import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";

const normalizeSkills = (skills = []) => {
  return skills
    .map((skill) => (typeof skill === "string" ? skill : skill?.name || ""))
    .filter(Boolean);
};

const JobSkillGap = ({
  matchedSkills = [],
  missingSkills = [],
  recommendedSkills = [],
  matchScore,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="job-skill-gap-loading">
        Analysing your resume against this job...
      </div>
    );
  }

  const matched = normalizeSkills(matchedSkills);
  const missing = normalizeSkills(missingSkills);
  const recommended = normalizeSkills(recommendedSkills);

  const score = typeof matchScore === "number" ? Math.round(matchScore) : null;

  if (!matched.length && !missing.length && !recommended.length) {
    return (
      <EmptyState
        title="No skill analysis available"
        message="Analyze your resume against this job to see your skill match."
      />
    );
  }

  return (
    <section className="job-skill-gap">
      <div className="job-skill-gap-header">
        <div>
          <h2>Skill Match</h2>
          <p>See how your profile matches this job.</p>
        </div>

        {score !== null && (
          <div className="job-match-score">
            <strong>{score}%</strong>
            <span>Match</span>
          </div>
        )}
      </div>

      <div className="job-skill-sections">
        <div className="skill-section skill-section-matched">
          <div className="skill-section-title">
            <CheckCircle2 size={20} />
            <h3>Matched Skills</h3>
            <Badge variant="success">{matched.length}</Badge>
          </div>

          {matched.length ? (
            <div className="skill-list">
              {matched.map((skill) => (
                <span className="skill-item" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="skill-empty">No matching skills found.</p>
          )}
        </div>

        <div className="skill-section skill-section-missing">
          <div className="skill-section-title">
            <AlertCircle size={20} />
            <h3>Missing Skills</h3>
            <Badge variant="danger">{missing.length}</Badge>
          </div>

          {missing.length ? (
            <div className="skill-list">
              {missing.map((skill) => (
                <span className="skill-item" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="skill-empty">You have all the required skills.</p>
          )}
        </div>

        <div className="skill-section skill-section-recommended">
          <div className="skill-section-title">
            <Sparkles size={20} />
            <h3>Recommended Skills</h3>
            <Badge variant="warning">{recommended.length}</Badge>
          </div>

          {recommended.length ? (
            <div className="skill-list">
              {recommended.map((skill) => (
                <span className="skill-item" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="skill-empty">
              No additional recommendations available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobSkillGap;
