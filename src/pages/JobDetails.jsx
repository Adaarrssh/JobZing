import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Sparkles,
  Target,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import api, { getErrorMessage, unwrap } from "../services/api";
import Spinner from "../components/Spinner";
import {
  normalizeSkills,
  formatDate,
  scoreTone,
  normalizeExternalJob,
} from "../utils/helpers";

function MatchGroup({ label, values = [] }) {
  return (
    <div>
      <small>{label}</small>

      <div className="mini-skill-list">
        {(values || []).slice(0, 8).map((value, index) => (
          <span key={`${value}-${index}`}>{value}</span>
        ))}
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(
    location.state?.job ? normalizeExternalJob(location.state.job) : null,
  );
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(!location.state?.job);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.job) {
      setJob(normalizeExternalJob(location.state.job));
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${id}`);
        const data = unwrap(response);

        setJob(normalizeExternalJob(data));
      } catch (err) {
        setError(getErrorMessage(err, "Job not found."));
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, location.state]);

  const analyze = async () => {
    if (!job) {
      return;
    }

    try {
      setMatching(true);
      setError("");
      setMatch(null);

      const response = await api.post("/job-match", {
        jobTitle: job.title || "",
        jobDescription: job.description || "",
        jobSkills: normalizeSkills(job.skills),
      });

      setMatch(unwrap(response));
    } catch (err) {
      setError(
        getErrorMessage(err, "Upload a completed resume analysis first."),
      );
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="panel">
            <Spinner label="Opening role…" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page">
        <div className="container">
          <div className="panel">
            <div className="empty-inline">
              <p>{error || "Job not found."}</p>

              <Link className="text-link" to="/jobs">
                Back to jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const jobSkills = normalizeSkills(
    match?.requiredSkills?.length ? match.requiredSkills : job.skills,
  );

  return (
    <div className="page">
      <div className="container">
        <button
          className="back-link"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft size={17} />
          Back to jobs
        </button>

        <div className="detail-grid">
          <main className="detail-main">
            <div className="detail-hero">
              <div className="company-logo large">
                <BriefcaseBusiness size={30} />
              </div>

              <div>
                <span className="eyebrow">JOBZING OPPORTUNITY</span>

                <h1>{job.title}</h1>

                <p className="detail-company">{job.company}</p>

                <div className="detail-meta">
                  <span>
                    <MapPin size={15} />
                    {job.location}
                  </span>

                  <span>
                    <BriefcaseBusiness size={15} />
                    {job.jobType}
                  </span>

                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <section className="content-card">
              <h2>About the role</h2>

              <p className="long-copy">
                {job.description || "No description available."}
              </p>
            </section>

            <section className="content-card">
              <h2>Required skills</h2>

              {jobSkills.length ? (
                <div className="skill-cloud">
                  {jobSkills.map((skill, index) => (
                    <span key={`${skill}-${index}`}>{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="long-copy">Skills not listed for this role.</p>
              )}
            </section>
          </main>

          <aside className="detail-side">
            <div className="action-card">
              <div className="salary-label">Compensation</div>

              <h3>{job.salary || "Not disclosed"}</h3>

              <div className="detail-side-meta">
                <span>
                  <BriefcaseBusiness size={15} />
                  {job.experience || "Fresher"}
                </span>
              </div>

              <button
                className="btn btn-primary full"
                onClick={analyze}
                disabled={matching}
                type="button"
              >
                <Sparkles size={16} />
                {matching ? "Analyzing…" : "Check my job match"}
              </button>

              {job.applyLink && (
                <a
                  className="btn btn-outline full"
                  href={job.applyLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Apply now
                  <ExternalLink size={16} />
                </a>
              )}

              <button className="btn btn-outline full" type="button">
                <Bookmark size={16} />
                Save this job
              </button>
            </div>

            {match && (
              <div className="match-card">
                <div className={`score-ring ${scoreTone(match.matchScore)}`}>
                  <strong>{match.matchScore}%</strong>
                  <span>match</span>
                </div>

                <h3>Your skill fit</h3>

                <p>Based on your latest completed resume analysis.</p>

                <div className="match-groups">
                  <MatchGroup label="Matched" values={match.matchedSkills} />

                  <MatchGroup label="Missing" values={match.missingSkills} />

                  <MatchGroup label="Critical" values={match.criticalSkills} />
                </div>

                <Link className="text-link" to="/resume">
                  Improve your profile
                  <Target size={15} />
                </Link>
              </div>
            )}

            {error && <div className="inline-error">{error}</div>}
          </aside>
        </div>
      </div>
    </div>
  );
}
