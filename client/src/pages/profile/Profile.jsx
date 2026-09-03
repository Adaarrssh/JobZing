import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/profile.api";

const Profile = () => {
  const [formData, setFormData] = useState({
    phone: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    skills: "",
    preferredRole: "",
    preferredLocation: "",
    experienceLevel: "",
    bio: "",
    profileImage: "",
    resume: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        const user = response?.user || response?.data || response;

        setFormData({
          phone: user?.phone || "",
          college: user?.college || "",
          degree: user?.degree || "",
          branch: user?.branch || "",
          graduationYear: user?.graduationYear || "",
          skills: Array.isArray(user?.skills)
            ? user.skills.join(", ")
            : user?.skills || "",
          preferredRole: user?.preferredRole || "",
          preferredLocation: user?.preferredLocation || "",
          experienceLevel: user?.experienceLevel || "",
          bio: user?.bio || "",
          profileImage: user?.profileImage || "",
          resume: user?.resume || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await updateProfile(payload);

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <section className="profile-page">
          <h1>Profile</h1>
          <p>Loading profile...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="profile-page">
        <div className="section-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your professional information.</p>
          </div>
        </div>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="college">College</label>
              <input
                id="college"
                name="college"
                type="text"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="degree">Degree</label>
              <input
                id="degree"
                name="degree"
                type="text"
                value={formData.degree}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <input
                id="branch"
                name="branch"
                type="text"
                value={formData.branch}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="graduationYear">Graduation Year</label>
              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferredRole">Preferred Role</label>
              <input
                id="preferredRole"
                name="preferredRole"
                type="text"
                value={formData.preferredRole}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferredLocation">Preferred Location</label>
              <input
                id="preferredLocation"
                name="preferredLocation"
                type="text"
                value={formData.preferredLocation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Select experience level</option>
                <option value="fresher">Fresher</option>
                <option value="intern">Intern</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="5"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell recruiters about yourself..."
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Profile;
