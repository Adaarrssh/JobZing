import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api, { getErrorMessage, unwrap } from "../services/api";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import JobCard from "../components/JobCard";
import { scoreTone } from "../utils/helpers";

export default function Recommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/recommendations");

        const data = unwrap(response);

        const recommendations = Array.isArray(data)
          ? data
          : data?.recommendations || [];

        setItems(recommendations);
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Complete a resume analysis to generate recommendations.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-intro">
          <div>
            <span className="eyebrow">AI CAREER MATCHING</span>

            <h1>Jobs that fit your profile.</h1>

            <p>
              JobZing compares your latest resume skills against each internal
              job and ranks the closest fits.
            </p>
          </div>

          <Link className="btn btn-outline" to="/resume">
            <BrainCircuit size={17} />
            Update resume
          </Link>
        </div>

        {loading ? (
          <div className="panel">
            <Spinner label="Calculating matches…" />
          </div>
        ) : error ? (
          <div className="panel">
            <div className="empty-state">
              <div className="empty-icon">
                <BrainCircuit />
              </div>

              <h3>No recommendations yet</h3>

              <p>{error}</p>

              <Link className="btn btn-primary" to="/resume">
                Analyze a resume
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : !items.length ? (
          <EmptyState
            title="No recommendation candidates"
            text="Add internal jobs to your backend database, then run a resume analysis."
          />
        ) : (
          <div className="recommendation-list">
            {items.slice(0, 20).map((item, index) => {
              const job = item?.job;
              const matchedSkills = item?.matchedSkills || [];
              const missingSkills = item?.missingSkills || [];
              const criticalSkills = item?.criticalSkills || [];

              return (
                <div
                  key={job?._id || job?.jobId || `recommendation-${index}`}
                  className="recommendation-wrap"
                >
                  <div
                    className={`match-banner ${scoreTone(item?.matchScore)}`}
                  >
                    <div className="match-score">
                      <Sparkles size={15} />

                      <strong>{item?.matchScore ?? 0}%</strong>

                      <span>match</span>
                    </div>

                    <div className="match-detail">
                      <span>
                        <CheckCircle2 />
                        {matchedSkills.length} matched
                      </span>

                      <span>
                        <XCircle />
                        {missingSkills.length} missing
                      </span>

                      <span>
                        <AlertTriangle />
                        {criticalSkills.length} critical
                      </span>
                    </div>
                  </div>

                  {job ? (
                    <JobCard job={job} recommendation={item} />
                  ) : (
                    <EmptyState
                      title="Job unavailable"
                      text="This recommendation no longer points to an available job."
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
