import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileSearch,
  MapPin,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage, unwrap } from "../services/api";
import Spinner from "../components/Spinner";
import JobCard from "../components/JobCard";
import { normalizeSkills } from "../utils/helpers";

export default function Dashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        api.get("/jobs?limit=4"),
        api.get("/recommendations"),
        api.get("/notifications"),
        api.get("/search-history"),
        api.get("/bookmarks"),
      ]);

      const [
        jobsResult,
        recommendationsResult,
        notificationsResult,
        historyResult,
        bookmarksResult,
      ] = results;

      let hasError = false;

      let jobList = [];
      let recommendationList = [];

      if (jobsResult.status === "fulfilled") {
        const data = unwrap(jobsResult.value);

        jobList = Array.isArray(data) ? data : data?.jobs || [];
      } else {
        hasError = true;
      }

      if (recommendationsResult.status === "fulfilled") {
        const data = unwrap(recommendationsResult.value);

        recommendationList = Array.isArray(data)
          ? data
          : data?.recommendations || [];

        setRecommendations(recommendationList);
      } else {
        hasError = true;
      }

      if (jobList.length) {
        setJobs(jobList);
      } else {
        const recommendedJobs = recommendationList
          .map((item) => item?.job)
          .filter(Boolean)
          .slice(0, 4);

        setJobs(recommendedJobs);
      }

      if (notificationsResult.status === "fulfilled") {
        const data = unwrap(notificationsResult.value);

        const notificationList = Array.isArray(data)
          ? data
          : data?.notifications || [];

        setNotifications(notificationList);
      } else {
        hasError = true;
      }

      if (historyResult.status === "fulfilled") {
        const data = unwrap(historyResult.value);

        const historyList = Array.isArray(data)
          ? data
          : data?.history || data?.searchHistory || [];

        setHistory(historyList);
      } else {
        hasError = true;
      }

      if (bookmarksResult.status === "fulfilled") {
        const data = unwrap(bookmarksResult.value);

        const count =
          typeof data?.count === "number"
            ? data.count
            : Array.isArray(data)
              ? data.length
              : Array.isArray(data?.bookmarks)
                ? data.bookmarks.length
                : 0;

        setSavedCount(count);
      } else {
        hasError = true;
      }

      if (hasError) {
        setError("Some dashboard data could not be loaded.");
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const skills = normalizeSkills(user?.skills);

  const profileStrength = Math.min(100, 55 + skills.length * 6);

  const firstRecommendation = recommendations[0];

  return (
    <div className="page">
      <div className="container dashboard-page">
        <section className="welcome-banner">
          <div>
            <span className="eyebrow">YOUR CAREER WORKSPACE</span>

            <h1>Good morning, {user?.fullName?.split(" ")[0] || "there"}.</h1>

            <p>
              Keep your profile sharp, discover relevant roles and make your
              next application count.
            </p>
          </div>

          <Link className="btn btn-white" to="/jobs">
            <Search size={17} />
            Find jobs
          </Link>
        </section>

        <div className="stats-grid">
          <Stat
            icon={<Target />}
            label="Profile strength"
            value={`${profileStrength}%`}
            link="/profile"
            note={
              skills.length
                ? `${skills.length} skills added`
                : "Complete your profile"
            }
          />

          <Stat
            icon={<Bookmark />}
            label="Saved opportunities"
            value={savedCount}
            link="/bookmarks"
            note="Open saved jobs"
          />

          <Stat
            icon={<Sparkles />}
            label="AI recommendations"
            value={recommendations.length || "—"}
            link="/recommendations"
            note="Based on your resume"
          />

          <Stat
            icon={<TrendingUp />}
            label="Job searches"
            value={history.length || "—"}
            link="/search-history"
            note="Your recent searches"
          />
        </div>

        {error && <div className="inline-error">{error}</div>}

        <section className="dashboard-grid">
          <div className="main-column">
            <div className="section-heading compact">
              <div>
                <span className="eyebrow">LATEST OPPORTUNITIES</span>

                <h2>Jobs worth a look</h2>
              </div>

              <Link className="text-link" to="/jobs">
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="panel">
                <Spinner label="Finding roles…" />
              </div>
            ) : jobs.length ? (
              <div className="job-list">
                {jobs.slice(0, 2).map((job, index) => (
                  <JobCard key={job._id || job.jobId || index} job={job} />
                ))}
              </div>
            ) : (
              <div className="panel">
                <EmptyDashboard text="No job opportunities are available right now. Try exploring Find Jobs for more roles." />
              </div>
            )}

            <div className="section-heading compact">
              <div>
                <span className="eyebrow">YOUR PROFILE SIGNALS</span>

                <h2>What employers can see</h2>
              </div>

              <Link className="text-link" to="/profile">
                Edit profile
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="profile-signal-grid">
              <Signal
                icon={<UserRound />}
                title="Experience"
                value={user?.experienceLevel || "Fresher"}
              />

              <Signal
                icon={<BriefcaseBusiness />}
                title="Preferred role"
                value={user?.preferredRole || "Not set"}
              />

              <Signal
                icon={<MapPin />}
                title="Preferred location"
                value={user?.preferredLocation || "Not set"}
              />

              <Signal
                icon={<FileSearch />}
                title="Skills"
                value={
                  skills.length ? skills.slice(0, 4).join(" · ") : "Add skills"
                }
              />
            </div>
          </div>

          <aside className="side-column">
            <div className="side-panel ai-panel">
              <div className="ai-badge">
                <Sparkles size={17} />
                AI CAREER SIGNAL
              </div>

              <h3>
                {firstRecommendation?.matchScore
                  ? `${firstRecommendation.matchScore}% match available`
                  : "Unlock your job match score"}
              </h3>

              <p>
                {firstRecommendation
                  ? `Your strongest match is ${
                      firstRecommendation.job?.title || "this opportunity"
                    } at ${
                      firstRecommendation.job?.company ||
                      "the recommended company"
                    }.`
                  : "Upload a resume to generate personalized job recommendations and skill-gap insights."}
              </p>

              <Link
                className="btn btn-primary full"
                to={firstRecommendation ? "/recommendations" : "/resume"}
              >
                {firstRecommendation ? "See my matches" : "Analyze my resume"}

                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="side-panel">
              <div className="side-title">
                <h3>Recent activity</h3>
                <Clock3 size={17} />
              </div>

              {notifications.slice(0, 4).map((notification) => (
                <div className="activity-row" key={notification._id}>
                  <span className={`activity-dot ${notification.type || ""}`} />

                  <div>
                    <strong>{notification.title || "Notification"}</strong>

                    <p>{notification.message || ""}</p>
                  </div>
                </div>
              ))}

              {!notifications.length && (
                <div className="mini-empty">
                  <CalendarDays size={18} />

                  <span>No recent notifications.</span>
                </div>
              )}

              <Link className="text-link" to="/notifications">
                Open notifications
                <ArrowRight size={15} />
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, link, note }) {
  return (
    <Link to={link} className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>

      <ChevronRight className="stat-arrow" size={17} />
    </Link>
  );
}

function Signal({ icon, title, value }) {
  return (
    <div className="signal">
      <div>{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyDashboard({ text }) {
  return (
    <div className="empty-inline">
      <CheckCircle2 size={20} />
      <p>{text}</p>
    </div>
  );
}
