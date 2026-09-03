import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Recruiter = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/jobs?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <main className="page-container">
      <section className="recruiter-page">
        <div className="section-header">
          <div>
            <h1>Recruiter</h1>
            <p>Find the right talent for your organization.</p>
          </div>
        </div>

        <div className="recruiter-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates or skills"
            />
            <button type="submit" className="button button-primary">
              Search
            </button>
          </form>
        </div>

        <div className="empty-state">
          <h2>Recruiter Dashboard</h2>
          <p>Candidate management and recruiter features will appear here.</p>
        </div>
      </section>
    </main>
  );
};

export default Recruiter;
