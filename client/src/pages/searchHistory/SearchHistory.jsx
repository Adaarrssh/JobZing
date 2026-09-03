import { useEffect, useState } from "react";
import {
  getSearchHistory,
  deleteSearchHistory,
} from "../../api/searchHistory.api";

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSearchHistory();

      setHistory(response?.history || response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load search history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSearchHistory(id);

      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to delete search history",
      );
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <section className="search-history-page">
          <h1>Search History</h1>
          <p>Loading search history...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="search-history-page">
        <div className="section-header">
          <div>
            <h1>Search History</h1>
            <p>View your previous job searches.</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {history.length === 0 ? (
          <div className="empty-state">
            <h2>No search history</h2>
            <p>Your previous searches will appear here.</p>
          </div>
        ) : (
          <div className="search-history-list">
            {history.map((item) => (
              <article className="search-history-item" key={item._id}>
                <div className="search-history-content">
                  <h3>{item.keyword || "Search"}</h3>

                  {item.location && <p>Location: {item.location}</p>}

                  {item.searchedAt && (
                    <span>{new Date(item.searchedAt).toLocaleString()}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchHistory;
