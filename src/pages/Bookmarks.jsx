import {
  Bookmark,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import api, { getErrorMessage, unwrap } from "../services/api";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

export default function Bookmarks() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookmarks");
      const data = unwrap(response);

      const bookmarks = Array.isArray(data) ? data : data?.bookmarks || [];

      setList(bookmarks);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load saved jobs."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    if (!id || removingId) {
      return;
    }

    try {
      setRemovingId(id);
      setError("");

      await api.delete(`/bookmarks/${id}`);

      setList((current) => current.filter((bookmark) => bookmark._id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not remove saved job."));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-intro">
          <div>
            <span className="eyebrow">YOUR SAVED ROLES</span>

            <h1>Bookmarks.</h1>

            <p>
              Your saved jobs are stored securely in your JobZing account. Open
              a job to review the opportunity again.
            </p>
          </div>
        </div>

        {error && <div className="inline-error">{error}</div>}

        {loading ? (
          <div className="panel">
            <Spinner label="Loading saved jobs…" />
          </div>
        ) : list.length ? (
          <div className="bookmark-list">
            {list.map((bookmark) => {
              const isExternal =
                bookmark.source && bookmark.source !== "internal";

              return (
                <div className="bookmark-row" key={bookmark._id}>
                  <div className="company-logo">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <div className="bookmark-copy">
                    <strong>{bookmark.title || "Saved job"}</strong>

                    <span>{bookmark.company || "Company not listed"}</span>

                    <small>
                      <MapPin size={13} />
                      {bookmark.location || "Location not listed"}
                    </small>

                    <small>
                      {bookmark.jobType || "Job type not specified"}
                      {" • "}
                      {bookmark.experience || "Experience not specified"}
                    </small>

                    <small>Source: {bookmark.source || "internal"}</small>
                  </div>

                  <div className="bookmark-actions">
                    {isExternal && bookmark.applyLink ? (
                      <a
                        className="btn btn-outline"
                        href={bookmark.applyLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open job
                        <ExternalLink size={15} />
                      </a>
                    ) : (
                      <a
                        className="btn btn-outline"
                        href={`/jobs/${bookmark.jobId}`}
                      >
                        Open job
                      </a>
                    )}

                    <button
                      className="danger-icon"
                      onClick={() => remove(bookmark._id)}
                      disabled={removingId === bookmark._id}
                      title="Remove saved job"
                      type="button"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No saved jobs"
            text="Save a role from the Find Jobs page and it will appear here."
          />
        )}

        <div className="security-note">
          <Bookmark size={18} />

          <div>
            <strong>Your saved jobs</strong>

            <p>
              Your bookmarks are linked to your authenticated JobZing account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
