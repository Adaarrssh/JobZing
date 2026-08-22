import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  MapPin,
  Building2,
  BriefcaseBusiness,
  ArrowRight,
  Globe2,
} from "lucide-react";

const getSourceBadgeStyle = (source = "JobZing Direct") => {
  if (source.includes("LinkedIn")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (source.includes("Indeed")) return "bg-indigo-100 text-indigo-800 border-indigo-200";
  if (source.includes("Naukri")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (source.includes("Glassdoor")) return "bg-teal-100 text-teal-800 border-teal-200";
  if (source.includes("Wellfound")) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-violet-100 text-violet-800 border-violet-200 font-bold";
};

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const source = job?.source || "JobZing Direct";

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Top Aggregated Source Banner */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getSourceBadgeStyle(
              source
            )}`}
          >
            <Globe2 size={12} />
            {source}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {job?.jobType || "Full-Time"}
          </span>
        </div>

        {/* Company Header */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 border border-violet-100 overflow-hidden shrink-0">
            {job?.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-9 w-9 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="h-6 w-6 text-violet-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">
              {job?.company?.name}
            </h2>
            <div className="flex items-center text-xs text-gray-500 mt-0.5 truncate">
              <MapPin className="mr-1 h-3.5 w-3.5 text-orange-500 shrink-0" />
              <span className="truncate">{job?.location || "India"}</span>
            </div>
          </div>
        </div>

        {/* Job Title */}
        <div className="mt-4">
          <h1 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1">
            {job?.title}
          </h1>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {job?.description}
          </p>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs border border-blue-100">
            {job?.position || 1} Openings
          </Badge>

          <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs border border-green-100 font-bold">
            ₹ {job?.salary} LPA
          </Badge>
        </div>
      </div>

      {/* Bottom info */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-gray-500 text-xs">
          <BriefcaseBusiness className="mr-1.5 h-4 w-4 text-violet-600" />
          <span>{job?.experienceLevel || "Fresher"}</span>
        </div>

        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold px-3 py-1.5">
          View Details
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default LatestJobCards;
