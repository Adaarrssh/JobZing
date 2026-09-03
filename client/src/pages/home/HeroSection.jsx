import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    navigate(`/jobs${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Find your next opportunity</span>

            <h1>
              Find a job that
              <span> matches your future.</span>
            </h1>

            <p>
              Search thousands of opportunities from multiple job sources and
              discover roles that match your skills, experience and career
              goals.
            </p>
          </div>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-field">
              <label htmlFor="hero-keyword">What</label>

              <input
                id="hero-keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill or keyword"
              />
            </div>

            <div className="search-field">
              <label htmlFor="hero-location">Where</label>

              <input
                id="hero-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state or remote"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary hero-search-button"
            >
              Search Jobs
            </button>
          </form>

          <div className="hero-links">
            <span>Popular:</span>

            <button
              type="button"
              onClick={() => {
                setKeyword("Software Engineer");
                navigate("/jobs?keyword=Software%20Engineer");
              }}
            >
              Software Engineer
            </button>

            <button
              type="button"
              onClick={() => {
                setKeyword("Frontend Developer");
                navigate("/jobs?keyword=Frontend%20Developer");
              }}
            >
              Frontend Developer
            </button>

            <button
              type="button"
              onClick={() => {
                setKeyword("Data Analyst");
                navigate("/jobs?keyword=Data%20Analyst");
              }}
            >
              Data Analyst
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
