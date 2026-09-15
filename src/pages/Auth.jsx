import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!normalizedEmail.endsWith("@gmail.com")) {
      setError("Please use a valid Gmail address.");
      return;
    }

    setLoading(true);

    try {
      await login(normalizedEmail, password);

      const destination = location.state?.from?.pathname || "/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your career journey."
    >
      <form className="auth-form" onSubmit={submit}>
        <Field
          icon={<Mail size={18} />}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@gmail.com"
          autoComplete="email"
        />

        <Field
          icon={<LockKeyhole size={18} />}
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="Your password"
          autoComplete="current-password"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((previous) => !previous)}
        />

        <div className="forgot-password-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button
          className="btn btn-primary btn-lg full"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            "Signing in…"
          ) : (
            <>
              Sign in
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = form.email.trim().toLowerCase();
    const password = form.password;

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    if (!normalizedEmail.endsWith("@gmail.com")) {
      setError("Please use a valid Gmail address.");
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

    if (password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: form.fullName.trim(),
        email: normalizedEmail,
        password,
        confirmPassword: form.confirmPassword,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create your account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your JobZing account"
      subtitle="One profile. Smarter search. Better applications."
    >
      <form className="auth-form" onSubmit={submit}>
        <Field
          icon={<UserRound size={18} />}
          label="Full name"
          value={form.fullName}
          onChange={(value) => updateField("fullName", value)}
          placeholder="Write your name"
          autoComplete="name"
        />

        <Field
          icon={<Mail size={18} />}
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => updateField("email", value)}
          placeholder="you@gmail.com"
          autoComplete="email"
        />

        <div className="form-grid-2">
          <Field
            icon={<LockKeyhole size={18} />}
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(value) => updateField("password", value)}
            placeholder="Min. 10 chars"
            autoComplete="new-password"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((previous) => !previous)}
          />

          <Field
            icon={<LockKeyhole size={18} />}
            label="Confirm"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(value) => updateField("confirmPassword", value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword((previous) => !previous)
            }
          />
        </div>

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
            "Creating account…"
          ) : (
            <>
              Create account
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
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
          <span className="eyebrow">WELCOME TO JOBZING</span>

          <h1>{title}</h1>

          <p>{subtitle}</p>
        </div>

        {children}
      </div>

      <div className="auth-side">
        <div className="auth-side-inner">
          <span className="pill light">
            <BrainIcon />
            Career intelligence, simplified
          </span>

          <h2>
            Find opportunities that make sense for <span>you.</span>
          </h2>

          <p>
            Use your skills, goals and resume—not just a search box—to make
            better career decisions.
          </p>

          <div className="side-points">
            <span>
              <CheckCircle2 />
              AI-powered resume analysis
            </span>

            <span>
              <CheckCircle2 />
              Skill-fit job matching
            </span>

            <span>
              <CheckCircle2 />
              Saved jobs & career signals
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrainIcon() {
  return <span className="tiny-brain">✦</span>;
}

function Field({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  showPassword,
  onTogglePassword,
}) {
  const isPasswordField =
    type === "password" || (type === "text" && onTogglePassword);

  return (
    <label className="field">
      <span>{label}</span>

      <div className="input-wrap">
        {icon}

        <input
          required
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />

        {isPasswordField && (
          <button
            className="password-toggle"
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </label>
  );
}
