import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Compass,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="pill">
              <Sparkles size={14} />
              AI-powered career discovery
            </div>

            <h1>
              Stop searching for jobs.
              <br />
              <span>Start finding your fit.</span>
            </h1>

            <p>
              JobZing combines job search, resume intelligence, skill-gap
              analysis and personalized recommendations in one career workspace.
            </p>

            <div className="hero-actions">
              <Link
                className="btn btn-primary btn-lg"
                to={isAuthenticated ? "/jobs" : "/register"}
              >
                {isAuthenticated ? "Explore jobs" : "Get started free"}

                <ArrowRight size={18} />
              </Link>

              <Link className="btn btn-white btn-lg" to="/jobs">
                <Search size={18} />
                Browse jobs
              </Link>
            </div>

            <div className="trust-row">
              <div>
                <CheckCircle2 size={17} />
                Personalized matches
              </div>

              <div>
                <CheckCircle2 size={17} />
                Resume AI
              </div>

              <div>
                <CheckCircle2 size={17} />
                Real job discovery
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orb orb-a" />
            <div className="orb orb-b" />

            <div className="dashboard-preview">
              <div className="preview-top">
                <span className="preview-brand">JobZing</span>

                <span className="preview-status">
                  Career pulse <span />
                </span>
              </div>

              <div className="preview-greeting">Good morning, Adarsh</div>

              <div className="preview-stat-row">
                <div>
                  <small>Profile score</small>

                  <strong>
                    86<span>%</span>
                  </strong>

                  <div className="mini-bar">
                    <i style={{ width: "86%" }} />
                  </div>
                </div>

                <div>
                  <small>Best match</small>

                  <strong>
                    94<span>%</span>
                  </strong>

                  <div className="mini-bar blue">
                    <i style={{ width: "94%" }} />
                  </div>
                </div>
              </div>

              <div className="preview-job">
                <div className="tiny-logo">AI</div>

                <div>
                  <strong>Frontend Developer</strong>

                  <small>Fintech Labs · Remote</small>

                  <div className="tiny-tags">
                    <span>React</span>
                    <span>JavaScript</span>
                    <span>CSS</span>
                  </div>
                </div>

                <b>94%</b>
              </div>

              <div className="preview-job">
                <div className="tiny-logo alt">JS</div>

                <div>
                  <strong>Full Stack Engineer</strong>

                  <small>Product Studio · Noida</small>

                  <div className="tiny-tags">
                    <span>Node.js</span>
                    <span>MongoDB</span>
                  </div>
                </div>

                <b>88%</b>
              </div>
            </div>

            <div className="floating-card floating-a">
              <BrainCircuit size={18} />

              <span>AI analyzed your resume</span>

              <b>92</b>
            </div>

            <div className="floating-card floating-b">
              <Target size={17} />

              <span>18 jobs matched</span>
            </div>
          </div>
        </div>
      </section>

      <section className="logo-strip">
        <div className="container logo-inner">
          <span>Built for the modern job hunt</span>

          <span>DISCOVER</span>
          <span>MATCH</span>
          <span>ANALYZE</span>
          <span>APPLY</span>
        </div>
      </section>

      <section className="features section">
        <div className="container">
          <div className="center-heading">
            <span className="eyebrow">THE JOBZING EDGE</span>

            <h2>Everything you need to move from browsing to applying.</h2>

            <p>
              Most job boards help you find listings. JobZing helps you
              understand where you fit and what to improve next.
            </p>
          </div>

          <div className="feature-grid">
            <Feature
              icon={<Compass />}
              number="01"
              title="Smart job discovery"
              text="Search internal and external opportunities with practical filters for location, job type and experience."
            />

            <Feature
              icon={<BrainCircuit />}
              number="02"
              title="AI resume analysis"
              text="Upload your PDF and get a score, extracted skills, recommended roles and concrete improvement suggestions."
            />

            <Feature
              icon={<Target />}
              number="03"
              title="Skill-gap matching"
              text="Compare your resume against a job's skills to see your matched, missing and critical capabilities."
            />

            <Feature
              icon={<BarChart3 />}
              number="04"
              title="Career dashboard"
              text="Keep saved jobs, profile signals, notifications and search history in one focused workspace."
            />
          </div>
        </div>
      </section>

      <section className="dark-cta">
        <div className="container dark-cta-inner">
          <div>
            <span className="eyebrow light">YOUR NEXT MOVE</span>

            <h2>Make the next application a smarter one.</h2>

            <p>
              Build your profile once. Let JobZing turn it into better job
              discovery and clearer career actions.
            </p>
          </div>

          <Link
            className="btn btn-primary btn-lg"
            to={isAuthenticated ? "/dashboard" : "/register"}
          >
            Open JobZing
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function Feature({ icon, number, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-num">{number}</div>

      <div className="feature-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>

      <ChevronRight className="feature-arrow" size={18} />
    </div>
  );
}
