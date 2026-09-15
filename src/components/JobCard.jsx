import {
  Bookmark,
  ExternalLink,
  MapPin,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import api, { getErrorMessage, unwrap } from "../services/api";
import {
  formatRelative,
  normalizeSkills,
  normalizeExternalJob,
} from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

export default function JobCard({
  job: rawJob,
  onBookmarkChange,
  recommendation,
}) {
  const job = normalizeExternalJob(rawJob || {});
  const { isAuthenticated } = useAuth();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(Boolean(job?.__bookmarked));
  const [bookmarkId, setBookmarkId] = useState(job?.__bookmarkId || null);

  const skills = normalizeSkills(job?.skills).slice(0, 5);
  const id = job?._id || job?.jobId;
  const source = job?.source || "internal";

  const bookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated || !id || saving) {
      return;
    }

    setSaving(true);

    try {
      if (saved) {
        if (bookmarkId) {
          await api.delete(`/bookmarks/${bookmarkId}`);
        }

        setSaved(false);
        setBookmarkId(null);
        onBookmarkChange?.(false);
      } else {
        const response = await api.post("/bookmarks", {
          jobId: String(id),
          source,
          title: job?.title || "",
          company: job?.company || "",
          location: job?.location || "",
          salary: job?.salary || "",
          jobType: job?.jobType || "",
          experience: job?.experience || "",
          description: job?.description || "",
          skills: Array.isArray(job?.skills) ? job.skills : [],
          applyLink: job?.applyLink || "",
        });

        const data = unwrap(response);

        setBookmarkId(data?._id || null);
        setSaved(true);
        onBookmarkChange?.(true);
      }
    } catch (error) {
      alert(getErrorMessage(error, "Could not update saved jobs."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="job-card">
      <div className="company-logo">
        <BriefcaseBusiness size={22} />
      </div>

      <div className="job-card-body">
        <div className="job-topline">
          <div>
            <Link to={`/jobs/${id}`} state={{ job }} className="job-title">
              {job?.title || "Untitled role"}
            </Link>

            <div className="company-name">{job?.company || "Company"}</div>
          </div>

          <button
            className={`save-btn ${saved ? "saved" : ""}`}
            onClick={bookmark}
            disabled={saving}
            title={saved ? "Remove saved job" : "Save job"}
            type="button"
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="job-meta">
          <span>
            <MapPin size={15} />
            {job?.location || "Location not listed"}
          </span>

          <span>
            <BriefcaseBusiness size={15} />
            {job?.jobType || "Full-Time"}
          </span>

          <span>{job?.experience || "Fresher"}</span>
        </div>

        <p className="job-desc">
          {job?.description
            ? job.description.slice(0, 170)
            : "Explore this opportunity and see whether it fits your skills and career goals."}

          {job?.description?.length > 170 ? "…" : ""}
        </p>

        <div className="job-footer">
          <div className="skill-tags">
            {skills.length ? (
              skills.map((skill, index) => (
                <span key={`${skill}-${index}`}>{skill}</span>
              ))
            ) : (
              <span>{job?.salary || "Salary not disclosed"}</span>
            )}
          </div>

          {recommendation?.matchScore != null && (
            <span className="match-pill">
              <Sparkles size={13} />
              {recommendation.matchScore}% match
            </span>
          )}

          <span className="posted-time">{formatRelative(job?.createdAt)}</span>
        </div>

        {source !== "internal" && job?.applyLink && (
          <a
            className="external-mini"
            href={job.applyLink}
            target="_blank"
            rel="noreferrer"
          >
            Apply externally
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </article>
  );
}
