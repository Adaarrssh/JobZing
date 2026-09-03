import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Smart Job Matching",
    description:
      "Discover jobs that match your skills, experience and career preferences.",
    icon: "🎯",
    path: "/jobs",
  },
  {
    title: "Resume Analysis",
    description:
      "Analyze your resume and identify skills that can improve your job prospects.",
    icon: "📄",
    path: "/resume",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Understand which skills you are missing for the roles you want.",
    icon: "📊",
    path: "/resume",
  },
  {
    title: "AI Recommendations",
    description:
      "Get personalized job and skill recommendations powered by AI.",
    icon: "🤖",
    path: "/dashboard",
  },
];

const HomeFeatureCards = () => {
  return (
    <section className="home-features">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-label">Why JobZing</span>
            <h2>Everything you need for your job search</h2>
            <p>
              JobZing combines job discovery, resume analysis and AI-powered
              recommendations in one platform.
            </p>
          </div>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <Link
              to={feature.path}
              className="feature-card"
              key={feature.title}
            >
              <div className="feature-icon">{feature.icon}</div>

              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>

              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatureCards;
