import { MapPin, Search, SlidersHorizontal, SortAsc } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api, { getErrorMessage, unwrap } from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const keywordSuggestions = [
  "Software Engineer",
  "Software Developer",
  "Frontend Developer",
  "Frontend Engineer",
  "Backend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "Full Stack Engineer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "MERN Stack Developer",
  "Web Developer",
  "DevOps Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Android Developer",
  "iOS Developer",
  "UI UX Designer",
];

const locationSuggestions = [
  "India",
  "Delhi",
  "Noida",
  "Gurgaon",
  "Bangalore",
  "Hyderabad",
  "Mumbai",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Meerut",
  "Remote",
];

export default function Jobs() {
  const [params, setParams] = useSearchParams();

  const [form, setForm] = useState({
    keyword: params.get("keyword") || "",
    location: params.get("location") || "India",
    jobType: params.get("jobType") || "",
    experience: params.get("experience") || "",
    sort: params.get("sort") || "latest",
  });

  const [jobs, setJobs] = useState([]);

  const [meta, setMeta] = useState({
    totalJobs: 0,
    currentPage: 1,
    totalPages: 1,
    isGuest: true,
    visibleJobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keywordOpen, setKeywordOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const keywordRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (keywordRef.current && !keywordRef.current.contains(event.target)) {
        setKeywordOpen(false);
      }

      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const nextForm = {
      keyword: params.get("keyword") || "",
      location: params.get("location") || "India",
      jobType: params.get("jobType") || "",
      experience: params.get("experience") || "",
      sort: params.get("sort") || "latest",
    };

    setForm(nextForm);
    setLoading(true);
    setError("");

    const query = Object.fromEntries([...params.entries()]);

    query.location = query.location || "India";
    query.limit = 8;
    query.page = query.page || 1;
    query._t = Date.now();

    api
      .get("/jobs", {
        params: query,
      })
      .then((res) => {
        const data = unwrap(res);

        setJobs(Array.isArray(data?.jobs) ? data.jobs : []);

        setMeta({
          totalJobs: Number(data?.totalJobs || 0),
          currentPage: Number(data?.currentPage || 1),
          totalPages: Number(data?.totalPages || 1),
          isGuest: Boolean(data?.isGuest),
          visibleJobs: Number(data?.visibleJobs || 0),
        });
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Could not load jobs."));

        setJobs([]);

        setMeta({
          totalJobs: 0,
          currentPage: 1,
          totalPages: 1,
          isGuest: true,
          visibleJobs: 0,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const filteredKeywords = keywordSuggestions.filter((item) =>
    item.toLowerCase().includes(form.keyword.trim().toLowerCase()),
  );

  const filteredLocations = locationSuggestions.filter((item) =>
    item.toLowerCase().includes(form.location.trim().toLowerCase()),
  );

  const selectKeyword = (value) => {
    setForm({
      ...form,
      keyword: value,
    });

    setKeywordOpen(false);
  };

  const selectLocation = (value) => {
    setForm({
      ...form,
      location: value,
    });

    setLocationOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();

    setKeywordOpen(false);
    setLocationOpen(false);

    const next = {};

    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        next[key] = value;
      }
    });

    if (!next.location) {
      next.location = "India";
    }

    next.page = 1;

    setParams(next);

    if (form.keyword.trim()) {
      api
        .post("/search-history", {
          query: form.keyword.trim(),
          filters: {
            location: form.location || "India",
            jobType: form.jobType,
            experience: form.experience,
          },
        })
        .catch(() => {});
    }
  };

  const page = Number(meta.currentPage || 1);

  const totalPages = Number(meta.totalPages || 1);

  const updatePage = (newPage) => {
    const next = Object.fromEntries([...params.entries()]);

    next.page = newPage;

    setParams(next);
  };

  const hasSearch = Boolean(params.get("keyword")?.trim());

  return (
    <div className="page">
      <div className="container">
        <div className="page-intro">
          <div>
            <span className="eyebrow">OPPORTUNITY MARKETPLACE</span>

            <h1>Find your next role.</h1>

            <p>
              Search jobs by the things that actually matter: skills, location,
              role and experience.
            </p>
          </div>
        </div>

        <form className="search-panel" onSubmit={submit}>
          <div className="search-main">
            <Search size={20} />

            <div
              ref={keywordRef}
              style={{
                position: "relative",
                flex: 1,
              }}
            >
              <input
                value={form.keyword}
                onFocus={() => setKeywordOpen(true)}
                onChange={(e) => {
                  setForm({
                    ...form,
                    keyword: e.target.value,
                  });

                  setKeywordOpen(true);
                }}
                placeholder="Job title, skill, company…"
                autoComplete="off"
              />

              {keywordOpen && filteredKeywords.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: 0,
                    right: 0,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    padding: "6px",
                    zIndex: 1000,
                    maxHeight: "260px",
                    overflowY: "auto",
                  }}
                >
                  {filteredKeywords.slice(0, 7).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectKeyword(item)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "11px 13px",
                        border: "none",
                        background: "transparent",
                        borderRadius: "8px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#17233c",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f7f8fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>

          <div className="filter-row">
            <label
              ref={locationRef}
              style={{
                position: "relative",
              }}
            >
              <MapPin size={16} />

              <input
                value={form.location}
                onFocus={() => setLocationOpen(true)}
                onChange={(e) => {
                  setForm({
                    ...form,
                    location: e.target.value,
                  });

                  setLocationOpen(true);
                }}
                placeholder="Location"
                autoComplete="off"
              />

              {locationOpen && filteredLocations.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    padding: "6px",
                    zIndex: 1000,
                    maxHeight: "240px",
                    overflowY: "auto",
                  }}
                >
                  {filteredLocations.slice(0, 7).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectLocation(item)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 12px",
                        border: "none",
                        background: "transparent",
                        borderRadius: "8px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#17233c",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f7f8fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </label>

            <select
              value={form.jobType}
              onChange={(e) =>
                setForm({
                  ...form,
                  jobType: e.target.value,
                })
              }
            >
              <option value="">Any job type</option>

              <option value="Full-Time">Full-Time</option>

              <option value="Part-Time">Part-Time</option>

              <option value="Internship">Internship</option>

              <option value="Contract">Contract</option>
            </select>

            <select
              value={form.experience}
              onChange={(e) =>
                setForm({
                  ...form,
                  experience: e.target.value,
                })
              }
            >
              <option value="">Any experience</option>

              <option value="Fresher">Fresher</option>

              <option value="Intern">Intern</option>

              <option value="Experienced">Experienced</option>
            </select>

            <select
              value={form.sort}
              onChange={(e) =>
                setForm({
                  ...form,
                  sort: e.target.value,
                })
              }
            >
              <option value="latest">Newest first</option>

              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </form>

        {!hasSearch ? (
          <EmptyState
            title="Search for jobs"
            text="Enter a job title, skill or role to discover current opportunities."
          />
        ) : (
          <>
            <div className="results-toolbar">
              <span>
                {meta.isGuest
                  ? `${meta.visibleJobs} jobs shown`
                  : `${meta.totalJobs} jobs found`}
              </span>

              <div className="results-tools">
                <SlidersHorizontal size={16} />

                <span>All matching jobs</span>

                <SortAsc size={16} />
              </div>
            </div>

            {error && <div className="inline-error">{error}</div>}

            {loading ? (
              <div className="panel">
                <Spinner label="Loading jobs…" />
              </div>
            ) : jobs.length ? (
              <>
                <div className="job-list">
                  {jobs.map((job, index) => (
                    <JobCard
                      key={
                        job._id ||
                        job.jobId ||
                        job.job_id ||
                        `${job.title}-${job.company}-${index}`
                      }
                      job={job}
                    />
                  ))}
                </div>

                {meta.isGuest && (
                  <div
                    className="panel"
                    style={{
                      marginTop: "18px",
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 7px",
                        color: "#17233c",
                      }}
                    >
                      Want to see all matching jobs?
                    </h3>

                    <p
                      style={{
                        margin: "0 0 15px",
                        color: "#7b8799",
                        fontSize: "12px",
                      }}
                    >
                      Log in to JobZing to unlock all available opportunities
                      and pagination.
                    </p>

                    <Link to="/login" className="btn btn-primary">
                      Login to view all jobs
                    </Link>
                  </div>
                )}

                {!meta.isGuest && totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={page <= 1}
                      onClick={() => updatePage(page - 1)}
                    >
                      Previous
                    </button>

                    <span>
                      Page {page} of {totalPages}
                    </span>

                    <button
                      disabled={page >= totalPages}
                      onClick={() => updatePage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No jobs found"
                text="Try a broader keyword or a different location."
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
