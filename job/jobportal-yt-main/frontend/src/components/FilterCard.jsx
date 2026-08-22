import React from "react";
import {
  Filter,
  MapPin,
  Briefcase,
  IndianRupee,
  Globe2,
  X,
  Clock3,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterLocation,
  setFilterRole,
  setFilterSalary,
  setFilterExperience,
  setSelectedPortal,
  resetAllFilters,
} from "@/redux/jobSlice";

const portalOptions = [
  { id: "All", label: "All Portals" },
  { id: "JobZing", label: "JobZing Direct" },
  { id: "LinkedIn", label: "LinkedIn" },
  { id: "Indeed", label: "Indeed" },
  { id: "Naukri", label: "Naukri.com" },
  { id: "Glassdoor", label: "Glassdoor" },
  { id: "Wellfound", label: "Wellfound" },
];

const locationOptions = ["All", "Bangalore", "Hyderabad", "Pune", "Gurugram", "Remote", "Noida"];

const roleOptions = [
  { id: "All", label: "All Domains" },
  { id: "React", label: "React / Frontend" },
  { id: "Backend", label: "Backend (Node/Go/Java)" },
  { id: "Full Stack", label: "Full Stack" },
  { id: "AI", label: "AI / Machine Learning" },
  { id: "Designer", label: "UI/UX & Product Design" },
  { id: "DevOps", label: "DevOps & Cloud" },
];

const salaryOptions = [
  { id: "All", label: "All Salaries" },
  { id: "under_15", label: "Under ₹15 LPA" },
  { id: "15_to_25", label: "₹15 - ₹25 LPA" },
  { id: "above_25", label: "₹25+ LPA" },
];

const experienceOptions = [
  { id: "All", label: "All Experience" },
  { id: "Fresher", label: "Fresher / 0-1 Yr" },
  { id: "1-3", label: "1-3 Years" },
  { id: "3-5", label: "3-5 Years" },
  { id: "4-7", label: "4+ Years" },
];

const FilterCard = () => {
  const {
    filterLocation,
    filterRole,
    filterSalary,
    filterExperience,
    selectedPortal,
    searchedQuery,
  } = useSelector((store) => store.job);

  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetAllFilters());
  };

  const hasActiveFilters =
    (selectedPortal && selectedPortal !== "All") ||
    (filterLocation && filterLocation !== "All") ||
    (filterRole && filterRole !== "All") ||
    (filterSalary && filterSalary !== "All") ||
    (filterExperience && filterExperience !== "All") ||
    !!searchedQuery;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-5 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="text-violet-600 h-5 w-5" />
          <h2 className="text-base font-bold text-gray-900">Independent Filters</h2>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-xl transition"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* 1. AGGREGATED PORTAL FILTER */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Globe2 size={13} className="text-violet-600" />
          1. Aggregated Source
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {portalOptions.map((opt) => {
            const isSelected = (selectedPortal || "All") === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => dispatch(setSelectedPortal(opt.id))}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-violet-600 text-white border-violet-600 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-violet-300 hover:bg-violet-50/60"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CITY / LOCATION FILTER */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <MapPin size={13} className="text-orange-500" />
          2. City / Location
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {locationOptions.map((loc) => {
            const isSelected = (filterLocation || "All") === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => dispatch(setFilterLocation(loc))}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/60"
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SALARY RANGE FILTER */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <IndianRupee size={13} className="text-emerald-600" />
          3. Annual Salary (LPA)
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {salaryOptions.map((sal) => {
            const isSelected = (filterSalary || "All") === sal.id;
            return (
              <button
                key={sal.id}
                type="button"
                onClick={() => dispatch(setFilterSalary(sal.id))}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/60"
                }`}
              >
                {sal.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DOMAIN / ROLE FILTER */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Briefcase size={13} className="text-blue-600" />
          4. Job Domain / Role
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {roleOptions.map((role) => {
            const isSelected = (filterRole || "All") === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => dispatch(setFilterRole(role.id))}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/60"
                }`}
              >
                {role.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. EXPERIENCE LEVEL FILTER */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock3 size={13} className="text-purple-600" />
          5. Experience Level
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {experienceOptions.map((exp) => {
            const isSelected = (filterExperience || "All") === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => dispatch(setFilterExperience(exp.id))}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50/60"
                }`}
              >
                {exp.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterCard;
