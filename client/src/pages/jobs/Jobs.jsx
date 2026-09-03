import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllJobs, searchJobs, getExternalJobs } from "../../api/jobs.api";
import JobSearchBar from "../../components/jobs/JobSearchBar";
import JobFilters from "../../components/jobs/JobFilters";
import JobList from "../../components/jobs/JobList";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    jobType: searchParams.get("jobType") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    source: searchParams.get("source") || "",
  });

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      const hasSearch = filters.keyword.trim() || filters.location.trim();

      if (filters.source === "external") {
        response = await getExternalJobs({
          keyword: filters.keyword,
          location: filters.location,
          jobType: filters.jobType,
          experienceLevel: filters.experienceLevel,
        });
      } else if (hasSearch) {
        response = await searchJobs({
          keyword: filters.keyword,
          location: filters.location,
          jobType: filters.jobType,
          experienceLevel: filters.experienceLevel,
        });
      } else {
        response = await getAllJobs({
          jobType: filters.jobType,
          experienceLevel: filters.experienceLevel,
        });
      }

      const data = response?.data || response;

      const jobData =
        data?.jobs ||
        data?.results ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setJobs(jobData);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load jobs",
      );
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (values) => {
    const updatedFilters = {
      ...filters,
      ...values,
    };

    setFilters(updatedFilters);

    const params = {};

    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });

    setSearchParams(params);
  };

  const handleFilterChange = (values) => {
    const updatedFilters = {
      ...filters,
      ...values,
    };

    setFilters(updatedFilters);

    const params = {};

    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });

    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      keyword: "",
      location: "",
      jobType: "",
      experienceLevel: "",
      source: "",
    };

    setFilters(clearedFilters);
    setSearchParams({});
  };

  return (
    <section className="page-section jobs-page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="section-label">Job Search</span>
            <h1>Find Your Next Job</h1>
            <p>
              Search and discover opportunities that match your career goals.
            </p>
          </div>
        </div>

        <JobSearchBar
          initialKeyword={filters.keyword}
          initialLocation={filters.location}
          onSearch={handleSearch}
        />

        <div className="jobs-layout">
          <aside className="jobs-sidebar">
            <JobFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
            />
          </aside>

          <main className="jobs-results">
            <div className="jobs-results-header">
              <div>
                <h2>Available Jobs</h2>
                {!loading && (
                  <p>
                    {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                  </p>
                )}
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : jobs.length === 0 ? (
              <EmptyState
                title="No jobs found"
                message="Try changing your search or filters to find more opportunities."
              />
            ) : (
              <JobList jobs={jobs} />
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default Jobs;
