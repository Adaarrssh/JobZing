import { Clock3, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api, { getErrorMessage, unwrap } from "../services/api";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { formatRelative } from "../utils/helpers";

export default function SearchHistory() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/search-history");

        const data = unwrap(response);

        const history = Array.isArray(data)
          ? data
          : data?.history || data?.searchHistory || [];

        setList(history);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load search history."));
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/search-history/${id}`);

      setList((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete search history."));
    }
  };

  const buildSearchUrl = (history) => {
    const searchParams = new URLSearchParams();

    if (history?.query) {
      searchParams.set("keyword", history.query);
    }

    const filters = history?.filters || {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });

    return `/jobs?${searchParams.toString()}`;
  };

  return (
    <div className="page">
      <div className="container narrow">
        <div className="page-intro">
          <div>
            <span className="eyebrow">SEARCH MEMORY</span>

            <h1>Your searches.</h1>

            <p>
              JobZing stores your authenticated search history so you can
              revisit what you were looking for.
            </p>
          </div>

          <Link className="btn btn-primary" to="/jobs">
            <Search size={17} />
            Search jobs
          </Link>
        </div>

        {error && <div className="inline-error">{error}</div>}

        {loading ? (
          <div className="panel">
            <Spinner label="Loading history…" />
          </div>
        ) : list.length ? (
          <div className="history-list">
            {list.map((history, index) => (
              <div
                className="history-row"
                key={history._id || `history-${index}`}
              >
                <div className="history-icon">
                  <Clock3 size={17} />
                </div>

                <div>
                  <strong>{history.query || "Untitled search"}</strong>

                  <span>{formatRelative(history.createdAt)}</span>

                  {history.filters && (
                    <small>
                      {Object.entries(history.filters)
                        .filter(([, value]) => value)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(" · ")}
                    </small>
                  )}
                </div>

                <div className="history-actions">
                  <Link to={buildSearchUrl(history)}>Run search</Link>

                  <button
                    className="danger-icon"
                    onClick={() => remove(history._id)}
                    type="button"
                    aria-label="Delete search"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No search history"
            text="Search for a role and JobZing will remember it here."
          />
        )}
      </div>
    </div>
  );
}
