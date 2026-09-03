import { FileSearch, Sparkles, Target, TrendingUp } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Resume Analysis",
    description:
      "Upload your resume and understand your skills, experience, and profile.",
  },
  {
    icon: Target,
    title: "Job Matching",
    description:
      "Compare your profile with jobs and identify how well you match.",
  },
  {
    icon: Sparkles,
    title: "Skill Gap Detection",
    description:
      "Find missing skills and discover what you should learn for a target job.",
  },
  {
    icon: TrendingUp,
    title: "Smart Recommendations",
    description: "Get job recommendations based on your profile and skills.",
  },
];

const FeatureCards = () => {
  return (
    <section className="home-features">
      <div className="feature-grid">
        {features.map(({ icon: Icon, title, description }) => (
          <article className="feature-card" key={title}>
            <div className="feature-card-icon">
              <Icon size={24} />
            </div>

            <h3>{title}</h3>

            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
