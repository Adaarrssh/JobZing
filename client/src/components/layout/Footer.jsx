import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              JobZing
            </Link>

            <p>
              Find better jobs, understand your skill gaps, and build a stronger
              career profile.
            </p>

            <div className="footer-socials">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github size={19} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={19} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={19} />
              </a>

              <a href="mailto:support@jobzing.com" aria-label="Email">
                <Mail size={19} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>

            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/resume">Resume</Link>
          </div>

          <div className="footer-column">
            <h3>Account</h3>

            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
          </div>

          <div className="footer-column">
            <h3>Features</h3>

            <Link to="/jobs">Job Search</Link>
            <Link to="/resume">Resume Analysis</Link>
            <Link to="/jobs">Skill Matching</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} JobZing. All rights reserved.</p>

          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
