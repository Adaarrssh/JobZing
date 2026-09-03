import JobCard from "./JobCard";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";

const JobList = ({
  jobs = [],
  loading = false,
  error = "",
  bookmarkedJobs = [],
  onBookmark,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="job-list-loading">
        <Loader size="medium" text="Loading jobs..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to load jobs"
        message={error}
        onClose={onRetry}
      />
    );
  }

  if (!jobs.length) {
    return (
      <EmptyState
        title="No jobs found"
        message="Try changing your search or filters."
      />
    );
  }

  const bookmarkedIds = new Set(
    bookmarkedJobs.map((job) => job?._id || job?.id || job),
  );

  return (
    <div className="job-list">
      {jobs.map((job) => {
        const jobId = job?._id || job?.id;

        return (
          <JobCard
            key={jobId}
            job={job}
            isBookmarked={bookmarkedIds.has(jobId)}
            onBookmark={onBookmark}
          />
        );
      })}
    </div>
  );
};

export default JobList;
