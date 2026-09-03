import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) return;

    navigate(`/jobs?search=${encodeURIComponent(value)}`);
  };

  return (
    <section className="home-hero">
      <div className="home-hero-content">
        <span className="home-hero-badge">Smart Job Discovery</span>

        <h1>Find jobs that actually match you.</h1>

        <p>
          Search jobs, analyze your resume, discover skill gaps, and find
          opportunities that fit your profile.
        </p>

        <form className="home-search" onSubmit={handleSearch}>
          <Search size={20} />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search jobs, skills, companies..."
            aria-label="Search jobs"
          />

          <button type="submit">Search</button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
