export const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "—";

export const formatRelative = (date) => {
  if (!date) {
    return "";
  }

  const diff = Date.now() - new Date(date).getTime();

  const hours = Math.floor(diff / 3600000);

  if (hours < 1) {
    return "Just now";
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days}d ago`;
  }

  return formatDate(date);
};

export const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  const flattened = skills.flatMap((item) =>
    Array.isArray(item) ? item : [item],
  );

  return [...new Set(flattened.filter(Boolean).map(String))];
};

export const truncate = (text = "", n = 150) =>
  text.length > n ? `${text.slice(0, n).trim()}…` : text;

export const scoreTone = (score) =>
  score >= 80 ? "score-high" : score >= 60 ? "score-mid" : "score-low";

export const normalizeExternalJob = (job = {}) => {
  const location =
    job.location ||
    (job.job_is_remote
      ? "Remote"
      : [job.job_city, job.job_state, job.job_country]
          .filter(Boolean)
          .join(", "));

  const salary =
    job.salary ||
    (job.job_min_salary || job.job_max_salary
      ? `${job.job_min_salary || ""}${
          job.job_min_salary && job.job_max_salary ? " – " : ""
        }${job.job_max_salary || ""}`
      : "Not disclosed");

  return {
    ...job,
    _id: job._id || job.job_id || job.jobId,
    jobId: job.jobId || job.job_id,
    title: job.title || job.job_title || "Untitled role",
    company: job.company || job.employer_name || "Company",
    location: location || "India",
    salary,
    jobType: job.jobType || job.job_employment_type || "Full-Time",
    experience: job.experience || "Not specified",
    description: job.description || job.job_description || "",
    skills: job.skills || [],
    applyLink: job.applyLink || job.job_apply_link || "",
    source: job.source || "JSearch",
    createdAt: job.createdAt || job.job_posted_at_datetime_utc || null,
  };
};
