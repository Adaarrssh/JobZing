import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Globe2,
  MapPin,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import api, { getErrorMessage, unwrap } from "../services/api";
import Spinner from "../components/Spinner";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/companies/${id}`);

        setCompany(unwrap(response));
      } catch (err) {
        setError(getErrorMessage(err, "Company not found."));
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="panel">
            <Spinner label="Opening company…" />
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="page">
        <div className="container">
          <div className="panel">
            <p>{error || "Company not found."}</p>

            <Link className="text-link" to="/companies">
              Back to companies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <button
          className="back-link"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="company-detail">
          <div className="company-detail-head">
            <div className="company-logo xl">
              <Building2 size={40} />
            </div>

            <div>
              <span className="eyebrow">COMPANY PROFILE</span>

              <h1>{company.name}</h1>

              <p>
                <MapPin size={15} />
                {company.location || "Location not listed"}
              </p>

              {company.website && (
                <a
                  className="text-link"
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit website
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>

          <div className="content-card">
            <h2>About {company.name}</h2>

            <p className="long-copy">
              {company.description ||
                "No company description has been provided yet."}
            </p>
          </div>

          <div className="company-contact">
            <div>
              <small>Email</small>

              <strong>{company.email || "—"}</strong>
            </div>

            <div>
              <small>Location</small>

              <strong>{company.location || "—"}</strong>
            </div>

            <div>
              <small>Website</small>

              <strong>
                {company.website ? (
                  <>
                    <Globe2 size={14} />
                    Available
                  </>
                ) : (
                  "—"
                )}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
