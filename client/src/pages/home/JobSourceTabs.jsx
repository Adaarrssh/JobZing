import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const sources = [
  {
    id: "all",
    label: "All Jobs",
    description: "Explore opportunities collected from multiple job sources.",
    path: "/jobs",
  },
  {
    id: "external",
    label: "External Jobs",
    description: "Find jobs from external platforms through JobZing.",
    path: "/jobs?source=external",
  },
  {
    id: "recommended",
    label: "Recommended",
    description: "View opportunities personalized according to your profile.",
    path: "/dashboard",
  },
];

const JobSourceTabs = () => {
  const [activeSource, setActiveSource] = useState("all");

  const active = sources.find((source) => source.id === activeSource);

  return (
    <section className="job-source-tabs">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-label">Job Discovery</span>
            <h2>Explore opportunities your way</h2>
            <p>
              Search jobs from different sources and discover the right
              opportunity for you.
            </p>
          </div>
        </div>

        <div className="source-tabs">
          {sources.map((source) => (
            <button
              key={source.id}
              type="button"
              className={`source-tab ${
                activeSource === source.id ? "active" : ""
              }`}
              onClick={() => setActiveSource(source.id)}
            >
              {source.label}
            </button>
          ))}
        </div>

        <div className="source-tab-content">
          <div>
            <h3>{active.label}</h3>
            <p>{active.description}</p>
          </div>

          <Link to={active.path} className="btn btn-primary">
            Explore Jobs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobSourceTabs;
