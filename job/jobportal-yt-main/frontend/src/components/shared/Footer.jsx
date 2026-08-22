import React from "react";
import {
  BriefcaseBusiness,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-violet-600 p-3 rounded-xl">
                <BriefcaseBusiness className="text-white h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Job<span className="text-violet-400">Zing</span>
                </h2>

                <p className="text-sm text-gray-400">Find • Apply • Grow</p>
              </div>
            </div>

            <p className="mt-6 text-gray-400 leading-7">
              JobZing helps students and professionals discover exciting career
              opportunities from top companies. Search smarter, apply faster,
              and grow your career with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Quick Links
            </h3>

            <ul className="space-y-4">
              <li>
                <Link to="/" className="hover:text-violet-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/jobs" className="hover:text-violet-400 transition">
                  Jobs
                </Link>
              </li>

              <li>
                <Link to="/browse" className="hover:text-violet-400 transition">
                  Browse Jobs
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-violet-400 transition">
                  Login
                </Link>
              </li>

              <li>
                <Link to="/signup" className="hover:text-violet-400 transition">
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-lg font-semibold text-white mb-5">Contact</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-violet-400" />
                <span>support@jobzing.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-violet-400" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-violet-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Social Links */}

          <div>
            <h3 className="text-lg font-semibold text-white mb-5">Follow Us</h3>

            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-violet-600 transition duration-300"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-violet-600 transition duration-300"
              >
                <Github className="h-5 w-5 text-white" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-violet-600 transition duration-300"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
            </div>

            <div className="mt-8 p-5 rounded-xl bg-slate-800 border border-slate-700">
              <h4 className="font-semibold text-white">Ready to Get Hired?</h4>

              <p className="text-sm text-gray-400 mt-2">
                Explore thousands of verified jobs and start your career today.
              </p>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 mt-4 text-violet-400 hover:text-violet-300"
              >
                Explore Jobs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="border-t border-slate-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {year} <span className="font-semibold text-white">JobZing</span>.
            All Rights Reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0 text-sm">
            <Link to="/" className="hover:text-violet-400 transition">
              Privacy Policy
            </Link>

            <Link to="/" className="hover:text-violet-400 transition">
              Terms & Conditions
            </Link>

            <Link to="/" className="hover:text-violet-400 transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
