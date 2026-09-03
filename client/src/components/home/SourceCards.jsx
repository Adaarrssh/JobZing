import React from "react";
import { BriefcaseBusiness, Globe, Search } from "lucide-react";

const sources = [
  {
    icon: Search,
    title: "Job Search",
    description:
      "Search and explore available jobs using role, skill, and keyword filters.",
    action: "Explore Jobs",
    path: "/jobs",
  },
  {
    icon: Globe,
    title: "External Jobs",
    description:
      "Discover job opportunities collected from external job sources.",
    action: "Browse Jobs",
    path: "/jobs?source=external",
  },
  {
    icon: BriefcaseBusiness,
    title: "Recommended Jobs",
    description:
      "Get personalized job recommendations based on your profile and skills.",
    action: "View Recommendations",
    path: "/jobs/recommended",
  },
];

const SourceCards = () => {
  return (
    <section className="source-cards">
      <div className="source-card-grid">
        {sources.map(({ icon: Icon, title, description, action, path }) => (
          <article className="source-card" key={title}>
            <div className="source-card-icon">
              <Icon size={24} />
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

            <a href={path}>{action}</a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SourceCards;
