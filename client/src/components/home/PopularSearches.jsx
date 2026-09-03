import React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const popularSearches = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "DevOps Engineer",
];

const PopularSearches = () => {
  const navigate = useNavigate();

  const handleSearch = (search) => {
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <section className="popular-searches">
      <div className="section-header">
        <div>
          <h2>Popular Searches</h2>
          <p>Explore jobs people are searching for.</p>
        </div>
      </div>

      <div className="popular-search-list">
        {popularSearches.map((search) => (
          <button
            type="button"
            className="popular-search-item"
            key={search}
            onClick={() => handleSearch(search)}
          >
            <Search size={16} />
            {search}
          </button>
        ))}
      </div>
    </section>
  );
};

export default PopularSearches;
