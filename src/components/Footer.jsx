import {
  ArrowRight,
  BriefcaseBusiness,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">
              <BriefcaseBusiness size={18} />
            </span>

            <span>
              Job<span>Zing</span>
            </span>
          </Link>

          <p>
            Smarter job discovery, stronger applications, better career moves.
          </p>

          <div className="socials">
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>

            <a href="#" aria-label="GitHub">
              <Github size={17} />
            </a>

            <a href="mailto:hello@jobzing.app" aria-label="Email">
              <Mail size={17} />
            </a>
          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <Link to="/jobs">Find jobs</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/recommendations">AI recommendations</Link>
        </div>

        <div>
          <h4>Career tools</h4>
          <Link to="/resume">Resume AI</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/search-history">Search history</Link>
        </div>

        <div>
          <h4>JobZing</h4>

          <p>
            Built around your profile, skills and goals—not just a keyword
            search.
          </p>

          <Link className="text-link" to="/register">
            Create your account
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} JobZing</span>

        <span>Built with React · Node.js · MongoDB · Gemini</span>
      </div>
    </footer>
  );
}
