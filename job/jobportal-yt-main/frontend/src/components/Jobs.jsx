import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Search,
  Globe2,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  PlusCircle,
  RefreshCw,
  Zap,
} from "lucide-react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import {
  setSearchedQuery,
  resetAllFilters,
  addFetchedApiJobs,
  setIsFetchingApiJobs,
} from "@/redux/jobSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Jobs = () => {
  useGetAllJobs();

  const {
    allJobs,
    searchedQuery,
    selectedPortal,
    filterLocation,
    filterRole,
    filterSalary,
    filterExperience,
    isFetchingApiJobs,
  } = useSelector((store) => store.job);

  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [sortBy, setSortBy] = useState("newest");
  const [localSearch, setLocalSearch] = useState(searchedQuery || "");

  // Multi-Faceted Combined Filter Logic
  useEffect(() => {
    let result = [...allJobs];

    // 1. Portal Filter
    if (selectedPortal && selectedPortal !== "All") {
      const target = selectedPortal.toLowerCase();
      result = result.filter((job) => {
        const src = (job?.source || "").toLowerCase();
        const ptl = (job?.sourcePortal || "").toLowerCase();
        return src.includes(target) || ptl.includes(target);
      });
    }

    // 2. City / Location Filter
    if (filterLocation && filterLocation !== "All") {
      const locTarget = filterLocation.toLowerCase();
      result = result.filter((job) =>
        (job?.location || "").toLowerCase().includes(locTarget)
      );
    }

    // 3. Domain / Role Filter
    if (filterRole && filterRole !== "All") {
      const roleTarget = filterRole.toLowerCase();
      result = result.filter((job) => {
        const inTitle = (job?.title || "").toLowerCase().includes(roleTarget);
        const inDesc = (job?.description || "").toLowerCase().includes(roleTarget);
        const inReq = (job?.requirements || []).some((r) =>
          r.toLowerCase().includes(roleTarget)
        );
        return inTitle || inDesc || inReq;
      });
    }

    // 4. Salary Range Filter
    if (filterSalary && filterSalary !== "All") {
      result = result.filter((job) => {
        const salStr = job?.salary || "";
        const nums = salStr.match(/\d+(\.\d+)?/g)?.map(Number) || [0];
        const minSal = nums[0] || 0;
        const maxSal = nums[1] || nums[0] || 0;

        if (filterSalary === "under_15") {
          return minSal < 15 || maxSal <= 15;
        } else if (filterSalary === "15_to_25") {
          return (maxSal >= 15 && minSal <= 25) || (minSal >= 15 && minSal <= 25);
        } else if (filterSalary === "above_25") {
          return maxSal >= 24 || minSal >= 24;
        }
        return true;
      });
    }

    // 5. Experience Filter
    if (filterExperience && filterExperience !== "All") {
      const expTarget = filterExperience.toLowerCase();
      result = result.filter((job) =>
        (job?.experienceLevel || "").toLowerCase().includes(expTarget)
      );
    }

    // 6. Search Query Filter
    if (searchedQuery) {
      const q = searchedQuery.toLowerCase();
      result = result.filter((job) => {
        const titleMatch = job?.title?.toLowerCase().includes(q);
        const descMatch = job?.description?.toLowerCase().includes(q);
        const locMatch = job?.location?.toLowerCase().includes(q);
        const compMatch = job?.company?.name?.toLowerCase().includes(q);
        const reqMatch = (job?.requirements || []).some((r) =>
          r.toLowerCase().includes(q)
        );
        return titleMatch || descMatch || locMatch || compMatch || reqMatch;
      });
    }

    // Sorting
    if (sortBy === "salary_high") {
      result.sort((a, b) => {
        const salA = parseFloat(a.salary) || 0;
        const salB = parseFloat(b.salary) || 0;
        return salB - salA;
      });
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilterJobs(result);
  }, [
    allJobs,
    searchedQuery,
    selectedPortal,
    filterLocation,
    filterRole,
    filterSalary,
    filterExperience,
    sortBy,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(localSearch));
  };

  // Device Job API Aggregator Sync Simulation
  const handleFetchExternalApiJobs = () => {
    dispatch(setIsFetchingApiJobs(true));
    toast.info("Connecting to Multi-Portal Aggregator API feeds...");

    setTimeout(() => {
      const liveFeeds = [
        {
          _id: `live_job_${Date.now()}_1`,
          title: "Senior Next.js & TypeScript Architect",
          description: "Stripe is seeking a Next.js engineer to build world-class merchant checkout dashboards. High emphasis on edge rendering, TypeScript strictness, and telemetry.",
          requirements: ["Next.js", "TypeScript", "React", "GraphQL", "Tailwind CSS", "Web Vitals"],
          salary: "35 - 50",
          location: "Bangalore (Remote Friendly)",
          jobType: "Full-Time",
          experienceLevel: "4-7 Years",
          position: 2,
          company: {
            _id: `comp_stripe`,
            name: "Stripe",
            description: "Financial infrastructure for the internet.",
            website: "https://stripe.com/jobs",
            location: "Bangalore, India",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
            createdAt: new Date().toISOString(),
          },
          created_by: "api_aggregator",
          source: "LinkedIn",
          sourcePortal: "LinkedIn",
          externalUrl: "https://www.linkedin.com/jobs",
          createdAt: new Date().toISOString(),
          applications: [],
        },
        {
          _id: `live_job_${Date.now()}_2`,
          title: "AI Agent & Multimodal Systems Engineer",
          description: "Anthropic / Cloud Partners hiring an AI specialist to design autonomous agent systems, tool calling, and RAG architectures.",
          requirements: ["Python", "LLMs", "LangChain", "Vector DBs", "FastAPI", "Docker"],
          salary: "32 - 48",
          location: "Hyderabad",
          jobType: "Full-Time",
          experienceLevel: "3-5 Years",
          position: 3,
          company: {
            _id: `comp_anthropic`,
            name: "Anthropic AI Labs",
            description: "AI research and safety company.",
            website: "https://anthropic.com",
            location: "Hyderabad, India",
            logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
            createdAt: new Date().toISOString(),
          },
          created_by: "api_aggregator",
          source: "Indeed",
          sourcePortal: "Indeed",
          externalUrl: "https://www.indeed.com",
          createdAt: new Date().toISOString(),
          applications: [],
        },
      ];

      dispatch(addFetchedApiJobs(liveFeeds));
      dispatch(setIsFetchingApiJobs(false));
      toast.success("Successfully fetched 2 new live jobs from LinkedIn & Indeed APIs!");
    }, 800);
  };

  const hasAnyFilterActive =
    (selectedPortal && selectedPortal !== "All") ||
    (filterLocation && filterLocation !== "All") ||
    (filterRole && filterRole !== "All") ||
    (filterSalary && filterSalary !== "All") ||
    (filterExperience && filterExperience !== "All") ||
    !!searchedQuery;

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* TOP SEARCH & CONTROLS BANNER */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles size={14} /> Multi-Portal Job Engine
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Search & Explore Opportunities
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Showing <strong>{filterJobs.length}</strong> jobs
                  {filterLocation !== "All" && ` in ${filterLocation}`}
                  {filterRole !== "All" && ` for ${filterRole}`}
                  {selectedPortal !== "All" && ` on ${selectedPortal}`}
                </p>
              </div>

              {/* ACTION BUTTONS & SYNC */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Device API Aggregator Fetch Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFetchExternalApiJobs}
                  disabled={isFetchingApiJobs}
                  className="rounded-xl text-xs font-bold gap-1.5 border-violet-200 bg-violet-50/60 text-violet-700 hover:bg-violet-100"
                >
                  <RefreshCw size={13} className={isFetchingApiJobs ? "animate-spin" : ""} />
                  Fetch Latest API Feeds
                </Button>

                {/* Direct Post a Job Button for all users */}
                <Link to="/admin/jobs/create">
                  <Button
                    size="sm"
                    className="rounded-xl text-xs font-bold gap-1.5 bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
                  >
                    <PlusCircle size={14} /> Post a Job
                  </Button>
                </Link>
              </div>
            </div>

            {/* SEARCH INPUT & SORT */}
            <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Filter by keyword, tech, title, or company..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl text-xs sm:text-sm border-gray-200 focus:border-violet-600"
                />
              </form>

              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                {hasAnyFilterActive && (
                  <button
                    onClick={() => {
                      dispatch(resetAllFilters());
                      setLocalSearch("");
                    }}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition"
                  >
                    <RotateCcw size={12} /> Clear All Filters
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  <ArrowUpDown size={14} className="text-gray-400 hidden sm:inline" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 outline-none cursor-pointer focus:border-violet-600"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="salary_high">Sort: Highest Salary</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: FILTER SIDEBAR */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-28">
                <FilterCard />
              </div>
            </div>

            {/* RIGHT: JOB CARDS GRID */}
            <div className="lg:col-span-8 xl:col-span-9">
              {filterJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-dashed border-gray-300 py-20 text-center p-6 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                    <BriefcaseBusiness className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    No Jobs Found For This Combination
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-md">
                    No openings matched the specific city, salary, and domain filter. Try relaxing one of the filter options.
                  </p>
                  <button
                    onClick={() => {
                      dispatch(resetAllFilters());
                      setLocalSearch("");
                    }}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-xs shadow-md hover:bg-violet-700 transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                  {filterJobs.map((job) => (
                    <motion.div
                      key={job?._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
