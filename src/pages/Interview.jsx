import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Mic2,
  Sparkles,
  Target,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const navigate = useNavigate();

  return (
    <div className="page interview-page">
      <div className="container">
        <button
          className="back-link"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <section className="interview-hero">
          <div className="interview-hero-glow" />

          <div className="interview-hero-content">
            <span className="eyebrow">JOBZING INTERVIEW STUDIO</span>

            <div className="interview-status">
              <Sparkles size={14} />
              COMING SOON
            </div>

            <h1>
              Your next interview
              <br />
              <span>starts here.</span>
            </h1>

            <p>
              Practice smarter with AI-powered interviews designed around your
              role, resume and skill level.
            </p>

            <div className="interview-trust">
              <span>
                <CheckCircle2 size={15} />
                Adaptive questions
              </span>

              <span>
                <CheckCircle2 size={15} />
                Resume-based practice
              </span>

              <span>
                <CheckCircle2 size={15} />
                Personalized feedback
              </span>
            </div>
          </div>
        </section>

        <section className="interview-section">
          <div className="center-heading interview-heading">
            <span className="eyebrow">WHAT'S COMING</span>

            <h2>Everything you need to prepare with confidence.</h2>

            <p>
              JobZing Interview Studio will bring realistic AI-powered interview
              practice directly into your career workspace.
            </p>
          </div>

          <div className="interview-feature-grid">
            <InterviewFeature
              icon={<Target />}
              title="AI Mock Interviews"
              text="Practice role-specific interviews with adaptive questions that become more challenging as you improve."
            />

            <InterviewFeature
              icon={<BrainCircuit />}
              title="Resume-Based Interviews"
              text="Get questions tailored to your resume, projects, skills and experience."
            />

            <InterviewFeature
              icon={<Mic2 />}
              title="Voice Interviews"
              text="Answer questions naturally using your voice and practice communicating like a real interview."
            />

            <InterviewFeature
              icon={<Video />}
              title="Video Interviews"
              text="Experience a realistic interview environment with camera-based practice."
            />
          </div>
        </section>

        <section className="interview-bottom-card">
          <div className="interview-bottom-icon">
            <Sparkles size={24} />
          </div>

          <div>
            <span className="eyebrow">BUILT FOR YOUR NEXT OPPORTUNITY</span>

            <h2>We are building more than just question practice.</h2>

            <p>
              Practice, evaluate and improve your interview performance before
              the real conversation begins.
            </p>
          </div>

          <div className="coming-soon-large">COMING SOON</div>
        </section>
      </div>
    </div>
  );
}

function InterviewFeature({ icon, title, text }) {
  return (
    <div className="interview-feature-card">
      <div className="interview-feature-icon">{icon}</div>

      <span className="feature-coming">COMING SOON</span>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}
