import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import api, { getErrorMessage } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This password reset link is invalid.");
      return;
    }

    if (password.length < 10) {
      setError("Password must be at least 10 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "This password reset link is invalid or has expired.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
            <span className="eyebrow">PASSWORD UPDATED</span>

            <h1>Password reset successfully</h1>

            <p>
              Your JobZing password has been updated. You can now sign in with
              your new password.
            </p>
          </div>

          <div className="password-reset-success">
            <CheckCircle2 size={24} />

            <div>
              <strong>Your password has been changed.</strong>

              <p>
                Please sign in using your new password to continue your career
                journey.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg full"
            type="button"
            onClick={() => navigate("/login", { replace: true })}
          >
            Sign in
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="auth-side">
          <div className="auth-side-inner">
            <span className="pill light">
              <span className="tiny-brain">✦</span>
              Career intelligence, simplified
            </span>

            <h2>
              You're ready to get back to <span>JobZing.</span>
            </h2>

            <p>
              Sign in with your new password and continue discovering
              opportunities that fit you.
            </p>

            <div className="side-points">
              <span>
                <CheckCircle2 />
                Password successfully updated
              </span>

              <span>
                <CheckCircle2 />
                Reset link invalidated
              </span>

              <span>
                <CheckCircle2 />
                Secure account access
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

          <h1>Create a new password</h1>

          <p>Choose a strong password to secure your JobZing account.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            showPassword={showPassword}
            onToggle={() => setShowPassword((previous) => !previous)}
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <PasswordField
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((previous) => !previous)}
            placeholder="Repeat new password"
            autoComplete="new-password"
          />

          <div className="password-note">
            <CheckCircle2 size={15} />
            Minimum 10 characters with uppercase, lowercase, number and special
            character.
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            className="btn btn-primary btn-lg full"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              "Resetting password…"
            ) : (
              <>
                Reset password
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="auth-switch">
            <Link to="/login">Back to sign in</Link>
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
            Secure your account and get back to <span>your goals.</span>
          </h2>

          <p>Your reset link is temporary and can only be used once.</p>

          <div className="side-points">
            <span>
              <CheckCircle2 />
              Minimum 10-character password
            </span>

            <span>
              <CheckCircle2 />
              Strong password requirements
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

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  placeholder,
  autoComplete,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <div className="input-wrap">
        <LockKeyhole size={18} />

        <input
          required
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />

        <button
          className="password-toggle"
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  );
}
