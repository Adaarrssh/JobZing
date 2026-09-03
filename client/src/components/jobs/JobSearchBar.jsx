import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const JobSearchBar = ({
  value = "",
  onSearch,
  placeholder = "Search jobs, skills, or companies...",
}) => {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <form className="job-search-bar" onSubmit={handleSubmit}>
      <Search size={20} />

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label="Search jobs"
      />

      {query && (
        <button
          type="button"
          className="job-search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}

      <button type="submit" className="job-search-submit">
        Search
      </button>
    </form>
  );
};

export default JobSearchBar;
