import {
  Bookmark,
  MapPin,
  BriefcaseBusiness,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, isBookmarked = false, onBookmark }) => {
  const navigate = useNavigate();

  if (!job) return null;

  const {
    _id,
    id,
    title = "Untitled Position",
    company,
    companyName,
    location,
    jobType,
    employmentType,
    experience,
    salary,
    skills = [],
    description,
  } = job;

  const jobId = _id || id;
  const companyLabel =
    typeof company === "string" ? company : company?.name || companyName;

  const handleView = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div className="job-card-company">
          <div className="job-company-logo">
            {companyLabel?.charAt(0)?.toUpperCase() || "J"}
          </div>

          <div>
            <h3>{title}</h3>
            {companyLabel && <p>{companyLabel}</p>}
          </div>
        </div>

        <button
          type="button"
          className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
          onClick={() => onBookmark?.(job)}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark job"}
        >
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="job-card-meta">
        {location && (
          <span>
            <MapPin size={16} />
            {location}
          </span>
        )}

        {(jobType || employmentType) && (
          <span>
            <BriefcaseBusiness size={16} />
            {jobType || employmentType}
          </span>
        )}

        {experience && <span>{experience}</span>}

        {salary && <span>{salary}</span>}
      </div>

      {description && (
        <p className="job-card-description">
          {description.length > 180
            ? `${description.slice(0, 180)}...`
            : description}
        </p>
      )}

      {skills.length > 0 && (
        <div className="job-card-skills">
          {skills.slice(0, 6).map((skill) => (
            <span key={typeof skill === "string" ? skill : skill.name}>
              {typeof skill === "string" ? skill : skill.name}
            </span>
          ))}
        </div>
      )}

      <div className="job-card-footer">
        <button type="button" onClick={handleView}>
          View Details
          <ExternalLink size={16} />
        </button>
      </div>
    </article>
  );
};

export default JobCard;
