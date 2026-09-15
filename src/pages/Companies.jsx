import {
  Building2,
  MapPin,
  Search,
  SlidersHorizontal,
  SortAsc,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import api, { getErrorMessage, unwrap } from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const companySuggestions = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Adobe",
  "IBM",
  "Oracle",
  "Accenture",
  "Deloitte",
  "TCS",
  "Infosys",
  "Wipro",
  "HCLTech",
  "Cognizant",
  "Capgemini",
  "Tech Mahindra",
  "Genpact",
  "Zoho",
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

export default function Companies() {
  const [params, setParams] = useSearchParams();

  const [form, setForm] = useState({
    company: params.get("company") || "",
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

  const [companyOpen, setCompanyOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const companyRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setCompanyOpen(false);
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
      company: params.get("company") || "",
      location: params.get("location") || "India",
      jobType: params.get("jobType") || "",
      experience: params.get("experience") || "",
      sort: params.get("sort") || "latest",
    };

    setForm(nextForm);
    setLoading(true);
    setError("");

    const company = params.get("company") || "";

    if (!company.trim()) {
      setJobs([]);
      setMeta({
        totalJobs: 0,
        currentPage: 1,
        totalPages: 1,
        isGuest: true,
        visibleJobs: 0,
      });
      setLoading(false);
      return;
    }

    const query = Object.fromEntries([...params.entries()]);

    query.company = company;
    query.location = query.location || "India";
    query.limit = 8;
    query.page = query.page || 1;
    query._t = Date.now();

    api
      .get("/companies/jobs", {
        params: query,
      })
      .then((response) => {
        const data = unwrap(response);

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
        setJobs([]);
        setMeta({
          totalJobs: 0,
          currentPage: 1,
          totalPages: 1,
          isGuest: true,
          visibleJobs: 0,
        });
        setError(getErrorMessage(err, "Could not load company jobs."));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const filteredCompanies = companySuggestions.filter((item) =>
    item.toLowerCase().includes(form.company.trim().toLowerCase()),
  );

  const filteredLocations = locationSuggestions.filter((item) =>
    item.toLowerCase().includes(form.location.trim().toLowerCase()),
  );

  const selectCompany = (value) => {
    setForm({
      ...form,
      company: value,
    });

    setCompanyOpen(false);
  };

  const selectLocation = (value) => {
    setForm({
      ...form,
      location: value,
    });

    setLocationOpen(false);
  };

  const submit = (event) => {
    event.preventDefault();

    setCompanyOpen(false);
    setLocationOpen(false);

    const next = {};

    Object.entries(form).forEach(([key, value]) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        next[key] = trimmedValue;
      }
    });

    if (!next.location) {
      next.location = "India";
    }

    next.page = 1;

    setParams(next);
  };

  const updatePage = (newPage) => {
    const next = Object.fromEntries([...params.entries()]);

    next.page = newPage;

    setParams(next);
  };

  const page = Number(meta.currentPage || 1);
  const totalPages = Number(meta.totalPages || 1);

  const hasSearch = Boolean(params.get("company")?.trim());

  return (
    <div className="page">
      <div className="container">
        <div className="page-intro">
          <div>
            <span className="eyebrow">COMPANY JOB SEARCH</span>

            <h1>Find jobs at companies you want.</h1>

            <p>
              Search current opportunities from multiple job sources by company
              and location.
            </p>
          </div>
        </div>

        <form className="search-panel" onSubmit={submit}>
          <div className="search-main">
            <Building2 size={20} />

            <div
              ref={companyRef}
              style={{
                position: "relative",
                flex: 1,
              }}
            >
              <input
                value={form.company}
                onFocus={() => setCompanyOpen(true)}
                onChange={(event) => {
                  setForm({
                    ...form,
                    company: event.target.value,
                  });

                  setCompanyOpen(true);
                }}
                placeholder="Company name…"
                aria-label="Company name"
                autoComplete="off"
              />

              {companyOpen && filteredCompanies.length > 0 && (
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
                  {filteredCompanies.slice(0, 8).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectCompany(item)}
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
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background = "#f7f8fa";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = "transparent";
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-primary" type="submit">
              <Search size={16} />
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
                onChange={(event) => {
                  setForm({
                    ...form,
                    location: event.target.value,
                  });

                  setLocationOpen(true);
                }}
                placeholder="Location"
                aria-label="Location"
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
                    maxHeight: "260px",
                    overflowY: "auto",
                  }}
                >
                  {filteredLocations.slice(0, 8).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectLocation(item)}
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
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background = "#f7f8fa";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = "transparent";
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
              onChange={(event) =>
                setForm({
                  ...form,
                  jobType: event.target.value,
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
              onChange={(event) =>
                setForm({
                  ...form,
                  experience: event.target.value,
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
              onChange={(event) =>
                setForm({
                  ...form,
                  sort: event.target.value,
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
            title="Search a company"
            text="Choose a company and location to discover its current job opportunities."
          />
        ) : (
          <>
            <div className="results-toolbar">
              <span>{meta.totalJobs} jobs found</span>

              <div className="results-tools">
                <SlidersHorizontal size={16} />

                <span>Jobs at {params.get("company")}</span>

                <SortAsc size={16} />
              </div>
            </div>

            {error && <div className="inline-error">{error}</div>}

            {loading ? (
              <div className="panel">
                <Spinner label="Loading company jobs…" />
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
                text={`No current jobs were found for ${params.get(
                  "company",
                )} in ${
                  params.get("location") || "India"
                }. Try another location or job type.`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
