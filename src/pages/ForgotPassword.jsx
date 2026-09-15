import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { getErrorMessage } from "../services/api";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!normalizedEmail.endsWith("@gmail.com")) {
      setError("Please use a valid Gmail address.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email: normalizedEmail,
      });

      setEmail(normalizedEmail);
      setSent(true);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to send the reset link. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <section className="auth-page">
        <div className="auth-panel">
          <Link className="brand auth-brand" to="/">
            <span className="brand-mark">
              <BriefcaseBusiness size={19} />
            </span>

            <span>
              Job<span>Zing</span>
            </span>
          </Link>

          <div className="auth-heading">
            <span className="eyebrow">PASSWORD RESET</span>

            <h1>Check your email</h1>

            <p>
              We’ve sent a password reset link to <strong>{email}</strong>.
            </p>
          </div>

          <div className="password-reset-success">
            <CheckCircle2 size={24} />

            <div>
              <strong>Reset link sent successfully.</strong>

              <p>
                Please check your inbox. If you can’t find the email, check your{" "}
                <strong>Spam, Promotions, or Updates</strong> folder and search
                for <strong>JobZing</strong>.
              </p>

              <p>
                The reset link will expire in <strong>15 minutes</strong>.
              </p>
            </div>
          </div>

          <Link className="btn btn-primary btn-lg full" to="/login">
            Back to sign in
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="auth-side">
          <div className="auth-side-inner">
            <span className="pill light">
              <span className="tiny-brain">✦</span>
              Career intelligence, simplified
            </span>

            <h2>
              Get back to your career journey <span>securely.</span>
            </h2>

            <p>
              Your password reset link is temporary and can only be used once.
            </p>

            <div className="side-points">
              <span>
                <CheckCircle2 />
                Secure password reset
              </span>

              <span>
                <CheckCircle2 />
                15-minute link expiry
              </span>

              <span>
                <CheckCircle2 />
                One-time reset link
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <Link className="brand auth-brand" to="/">
          <span className="brand-mark">
            <BriefcaseBusiness size={19} />
          </span>

          <span>
            Job<span>Zing</span>
          </span>
        </Link>

        <div className="auth-heading">
          <span className="eyebrow">PASSWORD RESET</span>

          <h1>Forgot your password?</h1>

          <p>
            Enter your Gmail address and we’ll send you a secure password reset
            link.
          </p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <label className="field">
            <span>Email</span>

            <div className="input-wrap">
              <Mail size={18} />

              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@gmail.com"
                autoComplete="email"
              />
            </div>
          </label>

          <div className="password-note">
            <CheckCircle2 size={15} />
            Only Gmail addresses registered with JobZing can be used.
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            className="btn btn-primary btn-lg full"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              "Sending reset link…"
            ) : (
              <>
                Send reset link
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="auth-switch">
            <Link to="/login">
              <ArrowLeft size={15} />
              Back to sign in
            </Link>
          </p>
        </form>
      </div>

      <div className="auth-side">
        <div className="auth-side-inner">
          <span className="pill light">
            <span className="tiny-brain">✦</span>
            Career intelligence, simplified
          </span>

          <h2>
            Your next opportunity is still <span>waiting.</span>
          </h2>

          <p>
            Reset your password and get back to smarter job discovery with
            JobZing.
          </p>

          <div className="side-points">
            <span>
              <CheckCircle2 />
              Secure reset process
            </span>

            <span>
              <CheckCircle2 />
              Temporary reset link
            </span>

            <span>
              <CheckCircle2 />
              Get back to your saved opportunities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
