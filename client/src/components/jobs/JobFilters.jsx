import { RotateCcw } from "lucide-react";

const JobFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange?.({
      ...filters,
      [name]: value,
    });
  };

  return (
    <aside className="job-filters">
      <div className="job-filters-header">
        <div>
          <h3>Filters</h3>
          <p>Refine your job search</p>
        </div>

        <button type="button" onClick={onReset}>
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="location">Location</label>

        <input
          id="location"
          name="location"
          type="text"
          value={filters?.location || ""}
          onChange={handleChange}
          placeholder="e.g. Bangalore"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="jobType">Job Type</label>

        <select
          id="jobType"
          name="jobType"
          value={filters?.jobType || ""}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="experience">Experience</label>

        <select
          id="experience"
          name="experience"
          value={filters?.experience || ""}
          onChange={handleChange}
        >
          <option value="">Any Experience</option>
          <option value="fresher">Fresher</option>
          <option value="0-1">0-1 Years</option>
          <option value="1-3">1-3 Years</option>
          <option value="3-5">3-5 Years</option>
          <option value="5+">5+ Years</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>

        <select
          id="sort"
          name="sort"
          value={filters?.sort || "latest"}
          onChange={handleChange}
        >
          <option value="latest">Latest</option>
          <option value="relevance">Relevance</option>
          <option value="salary-high">Salary: High to Low</option>
          <option value="salary-low">Salary: Low to High</option>
        </select>
      </div>
    </aside>
  );
};

export default JobFilters;
