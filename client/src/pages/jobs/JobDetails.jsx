import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../../api/jobs.api";
import { addBookmark, removeBookmark } from "../../api/bookmark.api";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Badge from "../../components/common/Badge";
import JobSkillGap from "../../components/jobs/JobSkillGap";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobById(id);
        const data = response?.data || response;

        setJob(data?.job || data?.data || data);
        setBookmarked(
          Boolean(data?.job?.isBookmarked ?? data?.isBookmarked ?? false),
        );
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load job details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleBookmark = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setBookmarkLoading(true);

      if (bookmarked) {
        const bookmarkId =
          job?.bookmarkId || job?.bookmark?._id || job?.bookmark?._id;

        if (bookmarkId) {
          await removeBookmark(bookmarkId);
        }
      } else {
        await addBookmark({
          jobId: job._id,
        });
      }

      setBookmarked((prev) => !prev);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update bookmark",
      );
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !job) {
    return (
      <section className="page-section">
        <div className="container">
          <ErrorMessage message={error} />
        </div>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="page-section">
        <div className="container">
          <ErrorMessage message="Job not found" />
        </div>
      </section>
    );
  }

  const companyName =
    job.company?.name || job.companyName || "Company not specified";

  const skills = Array.isArray(job.skills)
    ? job.skills
    : Array.isArray(job.requiredSkills)
      ? job.requiredSkills
      : [];

  return (
    <section className="page-section job-details-page">
      <div className="container">
        <div className="job-details-header">
          <div className="job-details-heading">
            <Link to="/jobs" className="back-link">
              ← Back to Jobs
            </Link>

            <h1>{job.title || "Untitled Job"}</h1>

            <p className="job-company">{companyName}</p>

            <div className="job-meta">
              {job.location && <span>📍 {job.location}</span>}

              {job.jobType && <Badge text={job.jobType} />}

              {job.experienceLevel && <Badge text={job.experienceLevel} />}

              {job.source && <Badge text={job.source} />}
            </div>
          </div>

          <div className="job-details-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBookmark}
              disabled={bookmarkLoading}
            >
              {bookmarkLoading
                ? "Updating..."
                : bookmarked
                  ? "Remove Bookmark"
                  : "Save Job"}
            </button>

            {job.applyUrl ? (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Apply Now
              </a>
            ) : (
              <button type="button" className="btn btn-primary" disabled>
                Apply Now
              </button>
            )}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="job-details-layout">
          <main className="job-details-main">
            <section className="job-details-section">
              <h2>Job Description</h2>

              <div className="job-description">
                {job.description ? (
                  <p>{job.description}</p>
                ) : (
                  <p>No job description is available for this position.</p>
                )}
              </div>
            </section>

            {skills.length > 0 && (
              <section className="job-details-section">
                <h2>Required Skills</h2>

                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <Badge
                      key={`${skill}-${index}`}
                      text={
                        typeof skill === "string"
                          ? skill
                          : skill.name || skill.skill || ""
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {job.requirements && (
              <section className="job-details-section">
                <h2>Requirements</h2>
                <p>{job.requirements}</p>
              </section>
            )}

            {job.responsibilities && (
              <section className="job-details-section">
                <h2>Responsibilities</h2>
                <p>{job.responsibilities}</p>
              </section>
            )}

            {user && <JobSkillGap job={job} jobId={job._id} />}
          </main>

          <aside className="job-details-sidebar">
            <div className="job-info-card">
              <h3>Job Information</h3>

              {job.location && (
                <div className="job-info-item">
                  <span>Location</span>
                  <strong>{job.location}</strong>
                </div>
              )}

              {job.jobType && (
                <div className="job-info-item">
                  <span>Job Type</span>
                  <strong>{job.jobType}</strong>
                </div>
              )}

              {job.experienceLevel && (
                <div className="job-info-item">
                  <span>Experience</span>
                  <strong>{job.experienceLevel}</strong>
                </div>
              )}

              {job.salary && (
                <div className="job-info-item">
                  <span>Salary</span>
                  <strong>{job.salary}</strong>
                </div>
              )}

              {job.company?.website && (
                <div className="job-info-item">
                  <span>Company Website</span>
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
