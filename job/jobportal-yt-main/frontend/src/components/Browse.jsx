import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, BriefcaseBusiness, Globe2, Layers, Sparkles, Filter } from "lucide-react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { setSearchedQuery, setSelectedPortal } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Input } from "./ui/input";

const portals = [
  { id: "All", name: "All Sources", icon: "🌐", badge: "Live Feed" },
  { id: "JobZing", name: "JobZing Direct", icon: "⚡", badge: "Direct" },
  { id: "LinkedIn", name: "LinkedIn", icon: "💼", badge: "Aggregated" },
  { id: "Indeed", name: "Indeed", icon: "🎯", badge: "Aggregated" },
  { id: "Naukri", name: "Naukri.com", icon: "🚀", badge: "Aggregated" },
  { id: "Glassdoor", name: "Glassdoor", icon: "🏢", badge: "Aggregated" },
  { id: "Wellfound", name: "Wellfound", icon: "🦄", badge: "Aggregated" },
];

const Browse = () => {
  useGetAllJobs();

  const { allJobs, searchedQuery, selectedPortal } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(selectedPortal || "All");
  const [localSearch, setLocalSearch] = useState(searchedQuery || "");

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    dispatch(setSelectedPortal(tabId));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(localSearch));
  };

  const filteredJobs = allJobs.filter((job) => {
    // Portal Match
    const matchesPortal =
      activeTab === "All" ||
      (job?.source || "").toLowerCase().includes(activeTab.toLowerCase()) ||
      (job?.sourcePortal || "").toLowerCase().includes(activeTab.toLowerCase());

    // Search Query Match
    const matchesQuery =
      !searchedQuery ||
      job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
      job?.company?.name?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
      job?.location?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
      (job?.requirements || []).some((r) => r.toLowerCase().includes(searchedQuery.toLowerCase()));

    return matchesPortal && matchesQuery;
  });

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-lg mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white mb-3">
              <Layers size={14} /> Multi-Portal Aggregated Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Aggregated Job Feeds
            </h1>
            <p className="mt-2 text-violet-100 text-sm sm:text-base max-w-2xl">
              JobZing continuously crawls and indexes openings from major job portals and direct recruiters so you never miss a match.
            </p>

            {/* Search Box inside Header */}
            <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-xl bg-white rounded-2xl p-1.5 shadow-md">
              <Search className="h-5 w-5 text-gray-400 ml-3 self-center" />
              <input
                type="text"
                placeholder="Search jobs across all portals..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="flex-1 px-3 py-2 text-gray-800 placeholder-gray-400 outline-none text-sm font-medium bg-transparent"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* PORTAL TABS TICKER */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
            {portals.map((portal) => {
              const isCurrent = activeTab === portal.id;
              const count =
                portal.id === "All"
                  ? allJobs.length
                  : allJobs.filter(
                      (j) =>
                        (j?.source || "").toLowerCase().includes(portal.id.toLowerCase()) ||
                        (j?.sourcePortal || "").toLowerCase().includes(portal.id.toLowerCase())
                    ).length;

              return (
                <button
                  key={portal.id}
                  onClick={() => handleTabChange(portal.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap shadow-2xs ${
                    isCurrent
                      ? "bg-violet-600 text-white border-violet-600 shadow-md scale-102"
                      : "bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:bg-violet-50/50"
                  }`}
                >
                  <span className="text-base">{portal.icon}</span>
                  <span>{portal.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isCurrent ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RESULTS HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>{activeTab === "All" ? "All Aggregated Jobs" : `Jobs from ${activeTab}`}</span>
              <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full font-bold">
                {filteredJobs.length} Available
              </span>
            </h2>

            {searchedQuery && (
              <button
                onClick={() => {
                  dispatch(setSearchedQuery(""));
                  setLocalSearch("");
                }}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Clear Search: "{searchedQuery}"
              </button>
            )}
          </div>

          {/* JOBS GRID */}
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center p-6">
              <BriefcaseBusiness className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-700">No Jobs Found in this Portal</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Try switching to "All Sources" or modifying your search keywords.
              </p>
              <button
                onClick={() => handleTabChange("All")}
                className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
              >
                Show All Sources
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <Job key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Browse;
