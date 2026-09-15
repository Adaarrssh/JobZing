import {
  BriefcaseBusiness,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import api, { getErrorMessage, unwrap } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getInitials, normalizeSkills } from "../utils/helpers";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    skills: "",
    preferredRole: "",
    preferredLocation: "",
    experienceLevel: "Fresher",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/user/profile");

        const data = unwrap(response);

        const profile = data?.user || data;

        setForm({
          fullName: profile?.fullName || "",
          phone: profile?.phone || "",
          college: profile?.college || "",
          degree: profile?.degree || "",
          branch: profile?.branch || "",
          graduationYear: profile?.graduationYear || "",
          skills: normalizeSkills(profile?.skills).join(", "),
          preferredRole: profile?.preferredRole || "",
          preferredLocation: profile?.preferredLocation || "",
          experienceLevel: profile?.experienceLevel || "Fresher",
          bio: profile?.bio || "",
        });
      } catch (err) {
        setError(getErrorMessage(err, "Could not load profile."));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      college: form.college.trim(),
      degree: form.degree.trim(),
      branch: form.branch.trim(),
      graduationYear: form.graduationYear
        ? Number(form.graduationYear)
        : undefined,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      preferredRole: form.preferredRole.trim(),
      preferredLocation: form.preferredLocation.trim(),
      experienceLevel: form.experienceLevel,
      bio: form.bio.trim(),
    };

    try {
      const response = await api.put("/user/profile", payload);

      const data = unwrap(response);

      const updatedUser = data?.user || data;

      setUser(updatedUser);

      localStorage.setItem("jobzing_user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not update profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="panel">
            <div className="spinner-wrap">
              <span className="spinner" />
              Loading profile…
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="profile-header">
          <div className="avatar-large">{getInitials(user?.fullName)}</div>

          <div>
            <span className="eyebrow">YOUR PROFILE</span>

            <h1>{user?.fullName || "Your profile"}</h1>

            <p>
              <Mail size={15} />
              {user?.email || "Email not available"}
            </p>
          </div>
        </div>

        <form className="profile-form" onSubmit={submit}>
          <section className="content-card">
            <div className="card-heading">
              <div>
                <h2>Personal details</h2>

                <p>
                  Keep your basics accurate so your career profile stays useful.
                </p>
              </div>

              <UserRound />
            </div>

            <div className="form-grid-2">
              <Field
                label="Full name"
                icon={<UserRound />}
                value={form.fullName}
                onChange={(value) => updateField("fullName", value)}
              />

              <Field
                label="Phone"
                icon={<Phone />}
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="10-digit Indian mobile"
              />
            </div>
          </section>

          <section className="content-card">
            <div className="card-heading">
              <div>
                <h2>Education & experience</h2>

                <p>These signals feed job relevance and recommendations.</p>
              </div>

              <GraduationCap />
            </div>

            <div className="form-grid-3">
              <Field
                label="College"
                value={form.college}
                onChange={(value) => updateField("college", value)}
              />

              <Field
                label="Degree"
                value={form.degree}
                onChange={(value) => updateField("degree", value)}
              />

              <Field
                label="Branch"
                value={form.branch}
                onChange={(value) => updateField("branch", value)}
              />

              <Field
                label="Graduation year"
                type="number"
                value={form.graduationYear}
                onChange={(value) => updateField("graduationYear", value)}
              />

              <label className="field">
                <span>Experience level</span>

                <select
                  value={form.experienceLevel}
                  onChange={(event) =>
                    updateField("experienceLevel", event.target.value)
                  }
                >
                  <option value="Fresher">Fresher</option>

                  <option value="Intern">Intern</option>

                  <option value="Experienced">Experienced</option>
                </select>
              </label>
            </div>
          </section>

          <section className="content-card">
            <div className="card-heading">
              <div>
                <h2>Career preferences</h2>

                <p>Tell JobZing what you're aiming for next.</p>
              </div>

              <BriefcaseBusiness />
            </div>

            <div className="form-grid-2">
              <Field
                label="Preferred role"
                icon={<BriefcaseBusiness />}
                value={form.preferredRole}
                onChange={(value) => updateField("preferredRole", value)}
                placeholder="Frontend Developer"
              />

              <Field
                label="Preferred location"
                icon={<MapPin />}
                value={form.preferredLocation}
                onChange={(value) => updateField("preferredLocation", value)}
                placeholder="Noida / Remote"
              />
            </div>

            <label className="field">
              <span>
                Skills <em>comma separated</em>
              </span>

              <input
                value={form.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                placeholder="React, JavaScript, Node.js, MongoDB"
              />
            </label>

            <label className="field">
              <span>
                Bio <em>max 500 characters</em>
              </span>

              <textarea
                maxLength={500}
                rows={5}
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="A short introduction about your work, interests and direction."
              />
            </label>
          </section>

          {(error || message) && (
            <div className={error ? "form-error" : "form-success"}>
              {error || message}
            </div>
          )}

          <div className="form-actions">
            <button
              className="btn btn-primary btn-lg"
              disabled={saving}
              type="submit"
            >
              <Save size={17} />

              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon, value, onChange, type = "text", placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>

      <div className={icon ? "input-wrap" : ""}>
        {icon}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}
