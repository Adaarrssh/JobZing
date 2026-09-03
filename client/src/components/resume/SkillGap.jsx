import { CheckCircle2, CircleAlert, Plus } from "lucide-react";

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") return skill;

      return skill?.name || skill?.skill || skill?.title || skill?.label || "";
    })
    .filter(Boolean);
};

const SkillGap = ({ analysis, job }) => {
  if (!analysis) return null;

  const recommendedSkills = normalizeSkills(
    analysis.recommendedSkills ||
      analysis.skillsRecommended ||
      analysis.recommended ||
      [],
  );

  const missingSkills = normalizeSkills(
    analysis.missingSkills || analysis.skillsMissing || analysis.missing || [],
  );

  const matchedSkills = normalizeSkills(
    analysis.matchedSkills || analysis.skillsMatched || analysis.matched || [],
  );

  const jobSkills = normalizeSkills(job?.skills || job?.requiredSkills || []);

  const finalMissingSkills =
    missingSkills.length > 0
      ? missingSkills
      : jobSkills.filter(
          (skill) =>
            !matchedSkills.some(
              (matched) => matched.toLowerCase() === skill.toLowerCase(),
            ),
        );

  return (
    <section className="skill-gap">
      <div className="skill-gap-header">
        <div>
          <h3>Skill Gap Analysis</h3>

          <p>
            {job?.title
              ? `Skills required for ${job.title}`
              : "Understand your strengths and the skills you should improve."}
          </p>
        </div>
      </div>

      <div className="skill-gap-grid">
        <div className="skill-group matched-skills">
          <div className="skill-group-header">
            <CheckCircle2 size={21} />
            <div>
              <h4>Matched Skills</h4>
              <span>{matchedSkills.length} skills</span>
            </div>
          </div>

          <div className="skill-list">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No matched skills available.</p>
            )}
          </div>
        </div>

        <div className="skill-group missing-skills">
          <div className="skill-group-header">
            <CircleAlert size={21} />
            <div>
              <h4>Missing Skills</h4>
              <span>{finalMissingSkills.length} skills</span>
            </div>
          </div>

          <div className="skill-list">
            {finalMissingSkills.length > 0 ? (
              finalMissingSkills.map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No missing skills identified.</p>
            )}
          </div>
        </div>

        <div className="skill-group recommended-skills">
          <div className="skill-group-header">
            <Plus size={21} />
            <div>
              <h4>Recommended Skills</h4>
              <span>{recommendedSkills.length} skills</span>
            </div>
          </div>

          <div className="skill-list">
            {recommendedSkills.length > 0 ? (
              recommendedSkills.map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No additional recommendations available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillGap;
