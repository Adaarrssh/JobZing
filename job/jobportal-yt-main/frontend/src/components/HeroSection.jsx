import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Search,
  Sparkles,
  MapPin,
  Globe2,
  Building2,
  ArrowRight,
  Zap,
  Layers,
  FileCheck2,
  PlusCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery, setSelectedPortal } from "@/redux/jobSlice";
import { useNavigate, Link } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (searchKeyword = query) => {
    const combined = [searchKeyword.trim(), location.trim()].filter(Boolean).join(" ");
    dispatch(setSearchedQuery(combined));
    navigate("/jobs");
  };

  const handlePortalQuickFilter = (portal) => {
    dispatch(setSelectedPortal(portal));
    dispatch(setSearchedQuery(""));
    navigate("/browse");
  };

  const trendingTags = [
    "React Developer",
    "AI / ML Engineer",
    "Full Stack",
    "Node.js",
    "Remote",
    "Bangalore",
    "DevOps",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/80 via-white to-slate-50/50 py-16 md:py-24">
      {/* Background soft glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP BADGE */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 border border-violet-200/70 px-5 py-2 text-violet-800 font-semibold text-sm shadow-xs backdrop-blur-xs">
            <Sparkles size={16} className="text-violet-600 animate-pulse" />
            <span>India's Smart Multi-Portal Job Aggregator & AI Hiring Platform</span>
          </div>
        </div>

        {/* HERO TITLE & SUBTITLE */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-gray-900">
            Jobs From <span className="text-violet-600 underline decoration-violet-300 decoration-wavy decoration-2">Every Portal</span> <br className="hidden sm:inline" />
            In One Single <span className="text-orange-500">Dashboard</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg sm:text-xl leading-relaxed">
            Search thousands of aggregated opportunities from <strong>LinkedIn, Indeed, Naukri, Glassdoor, Wellfound</strong> and connect directly with hiring recruiters.
          </p>
        </div>

        {/* SEARCH BAR COMPONENT */}
        <div className="mt-10 flex justify-center">
          <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl md:rounded-full border border-gray-200 shadow-xl p-2.5 gap-2">
            {/* Keyword Input */}
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="h-5 w-5 text-violet-600 mr-3 shrink-0" />
              <input
                type="text"
                value={query}
                placeholder="Job title, skill, or company (e.g. React, Google)..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
                className="w-full text-gray-800 placeholder-gray-400 outline-none text-sm sm:text-base font-medium bg-transparent"
              />
            </div>

            {/* Location Input */}
            <div className="flex items-center px-4 py-2 md:w-64">
              <MapPin className="h-5 w-5 text-orange-500 mr-2 shrink-0" />
              <input
                type="text"
                value={location}
                placeholder="City or Remote..."
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
                className="w-full text-gray-800 placeholder-gray-400 outline-none text-sm sm:text-base font-medium bg-transparent"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={() => searchJobHandler()}
              className="rounded-2xl md:rounded-full bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-base font-bold shadow-md transition-all shrink-0"
            >
              Search Jobs
            </Button>
          </div>
        </div>

        {/* TRENDING SEARCH TAGS */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-gray-500 font-semibold flex items-center gap-1">
            <Zap size={13} className="text-amber-500" /> Popular:
          </span>
          {trendingTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => searchJobHandler(tag)}
              className="bg-white hover:bg-violet-50 text-gray-700 hover:text-violet-700 px-3 py-1.5 rounded-full border border-gray-200 transition font-medium shadow-2xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ACTION CARDS: AI RESUME REVIEW & POST A JOB */}
        <div className="mt-12 max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
          <Link
            to="/ai-resume-checker"
            className="group bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-violet-200 text-xs font-bold uppercase">
                <Sparkles size={14} /> AI Powered
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-violet-200 transition">
                Check Resume ATS Score
              </h3>
              <p className="text-xs text-violet-100 max-w-xs">
                Scan your resume, find missing keywords, and get an ATS-ready resume.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition">
              <FileCheck2 size={24} />
            </div>
          </Link>

          <Link
            to="/admin/jobs/create"
            className="group bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-orange-200 text-xs font-bold uppercase">
                <Building2 size={14} /> Employers & Recruiters
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-orange-200 transition">
                Post a Job Opening
              </h3>
              <p className="text-xs text-orange-100 max-w-xs">
                Publish opportunities directly to thousands of active candidates.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition">
              <PlusCircle size={24} />
            </div>
          </Link>
        </div>

        {/* MULTI-PORTAL AGGREGATOR BADGES */}
        <div className="mt-10 max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl border border-violet-100 p-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Layers className="text-violet-600" size={20} />
              <span className="font-bold text-gray-900 text-sm">
                Explore Jobs by Aggregated Source:
              </span>
            </div>
            <Link
              to="/browse"
              className="text-xs text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1"
            >
              View All Aggregated Portals <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            {[
              { name: "All Sources", portal: "All", badge: "Live Feed", color: "border-violet-300 bg-violet-50/70 text-violet-700" },
              { name: "JobZing Direct", portal: "JobZing", badge: "Verified", color: "border-orange-200 bg-orange-50/70 text-orange-700" },
              { name: "LinkedIn", portal: "LinkedIn", badge: "Aggregated", color: "border-blue-200 bg-blue-50/70 text-blue-700" },
              { name: "Indeed", portal: "Indeed", badge: "Aggregated", color: "border-indigo-200 bg-indigo-50/70 text-indigo-700" },
              { name: "Naukri.com", portal: "Naukri", badge: "Aggregated", color: "border-emerald-200 bg-emerald-50/70 text-emerald-700" },
              { name: "Glassdoor", portal: "Glassdoor", badge: "Aggregated", color: "border-teal-200 bg-teal-50/70 text-teal-700" },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePortalQuickFilter(p.portal)}
                className={`p-3 rounded-2xl border text-center transition-all hover:scale-105 shadow-2xs ${p.color}`}
              >
                <div className="text-xs font-bold truncate">{p.name}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{p.badge}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
