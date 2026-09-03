import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getRecommendedJobs } from "../../api/recommendation.api";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

const Dashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecommendedJobs();

      const data = response?.data || response;

      setJobs(
        data?.jobs ||
          data?.recommendations ||
          data?.data ||
          (Array.isArray(data) ? data : []),
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load recommended jobs",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  return (
    <section className="page-section dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <p className="dashboard-greeting">Welcome back</p>
            <h1>{user?.name || "Job Seeker"}</h1>
            <p>
              Discover opportunities that match your skills and career goals.
            </p>
          </div>

          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>

        <div className="dashboard-actions">
          <Link to="/profile" className="dashboard-action-card">
            <h3>My Profile</h3>
            <p>Update your professional information.</p>
          </Link>

          <Link to="/resume" className="dashboard-action-card">
            <h3>My Resume</h3>
            <p>Upload and analyze your resume.</p>
          </Link>

          <Link to="/bookmarks" className="dashboard-action-card">
            <h3>Saved Jobs</h3>
            <p>View jobs you saved for later.</p>
          </Link>

          <Link to="/search-history" className="dashboard-action-card">
            <h3>Search History</h3>
            <p>View your previous job searches.</p>
          </Link>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Recommended Jobs</h2>
              <p>Opportunities selected based on your profile.</p>
            </div>

            <Link to="/jobs" className="text-link">
              View all
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : !jobs.length ? (
            <EmptyState
              title="No recommendations yet"
              message="Complete your profile and resume to get better job recommendations."
            />
          ) : (
            <div className="job-grid">
              {jobs.map((job) => (
                <article key={job._id || job.id} className="dashboard-job-card">
                  <div className="job-card-header">
                    <div>
                      <h3>{job.title || "Untitled Job"}</h3>

                      <p>
                        {job.company?.name ||
                          job.companyName ||
                          "Company not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="job-card-details">
                    {job.location && <span>{job.location}</span>}

                    {job.jobType && <span>{job.jobType}</span>}

                    {job.experienceLevel && <span>{job.experienceLevel}</span>}
                  </div>

                  {job.description && (
                    <p className="job-card-description">
                      {job.description.length > 160
                        ? `${job.description.slice(0, 160)}...`
                        : job.description}
                    </p>
                  )}

                  <Link
                    to={`/jobs/${job._id || job.id}`}
                    className="btn btn-primary"
                  >
                    View Job
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
