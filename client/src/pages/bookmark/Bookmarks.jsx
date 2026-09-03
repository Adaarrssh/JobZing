import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookmarks, removeBookmark } from "../../api/bookmark.api";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookmarks();

      const data = response?.data || response;

      setBookmarks(
        data?.bookmarks || data?.data || (Array.isArray(data) ? data : []),
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load bookmarks",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeBookmark(id);

      setBookmarks((prev) => prev.filter((bookmark) => bookmark._id !== id));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to remove bookmark",
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="page-section bookmarks-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Saved Jobs</h1>
            <p>Jobs you have bookmarked for later.</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {!bookmarks.length ? (
          <EmptyState
            title="No saved jobs"
            message="You haven't bookmarked any jobs yet."
          />
        ) : (
          <div className="bookmarks-list">
            {bookmarks.map((bookmark) => {
              const job = bookmark.job || bookmark;

              return (
                <article key={bookmark._id} className="bookmark-card">
                  <div className="bookmark-content">
                    <div className="bookmark-main">
                      <h2>{job.title || "Untitled Job"}</h2>

                      <p className="bookmark-company">
                        {job.company?.name ||
                          job.companyName ||
                          "Company not specified"}
                      </p>

                      {job.location && (
                        <p className="bookmark-location">{job.location}</p>
                      )}

                      {job.description && (
                        <p className="bookmark-description">
                          {job.description.length > 180
                            ? `${job.description.slice(0, 180)}...`
                            : job.description}
                        </p>
                      )}
                    </div>

                    <div className="bookmark-actions">
                      {job._id && (
                        <Link
                          to={`/jobs/${job._id}`}
                          className="btn btn-primary"
                        >
                          View Job
                        </Link>
                      )}

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleRemove(bookmark._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bookmarks;
