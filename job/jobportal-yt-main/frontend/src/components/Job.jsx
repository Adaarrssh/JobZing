import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Building2,
  BriefcaseBusiness,
  IndianRupee,
  CalendarDays,
  ArrowRight,
  Globe2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "@/redux/jobSlice";
import { toast } from "sonner";

const getSourceBadgeStyle = (source = "JobZing Direct") => {
  if (source.includes("LinkedIn")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (source.includes("Indeed")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (source.includes("Naukri")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (source.includes("Glassdoor")) return "bg-teal-50 text-teal-700 border-teal-200";
  if (source.includes("Wellfound")) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-violet-50 text-violet-700 border-violet-200 font-bold";
};

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobIds } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isSaved = savedJobIds?.includes(job?._id);

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "Recently";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const difference = currentTime - createdAt;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days}d ago`;
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    dispatch(toggleSaveJob(job?._id));
    toast.success(isSaved ? "Removed from saved jobs" : "Saved job to bookmarks!");
  };

  const source = job?.source || "JobZing Direct";

  return (
    <div className="group rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between">
      <div>
        {/* Header: Portal Source & Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${getSourceBadgeStyle(
              source
            )}`}
          >
            <Globe2 size={12} />
            <span>{source}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 font-medium">
              {daysAgoFunction(job?.createdAt)}
            </span>
            <button
              type="button"
              onClick={handleBookmark}
              className={`p-2 rounded-full border transition-all ${
                isSaved
                  ? "bg-violet-100 border-violet-300 text-violet-700"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:text-violet-600 hover:bg-violet-50"
              }`}
              title={isSaved ? "Saved" : "Save Job"}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          </div>
        </div>

        {/* Company Header */}
        <div className="mt-4 flex items-center gap-3.5">
          <Avatar className="h-12 w-12 rounded-2xl border border-gray-100 shadow-2xs overflow-hidden shrink-0 bg-violet-50">
            {job?.company?.logo ? (
              <AvatarImage
                src={job.company.logo}
                alt={job?.company?.name}
                className="object-contain p-1"
              />
            ) : (
              <AvatarFallback className="bg-violet-100 text-violet-700 font-bold">
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0 flex-1">
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
          <h1
            onClick={() => navigate(`/description/${job?._id}`)}
            className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition cursor-pointer line-clamp-1"
          >
            {job?.title}
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">
            {job?.description}
          </p>
        </div>

        {/* Skill tags */}
        {job?.requirements && job.requirements.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {job.requirements.slice(0, 3).map((req, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-0.5 rounded-lg"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="text-[11px] text-gray-400 font-medium self-center">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 text-xs">
            {job?.position || 1} Openings
          </Badge>

          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-100 text-xs">
            {job?.jobType || "Full-Time"}
          </Badge>

          <Badge variant="secondary" className="bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
            ₹ {job?.salary} LPA
          </Badge>
        </div>
      </div>

      {/* Footer / CTA buttons */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2.5">
        <Button
          variant="outline"
          className="flex-1 rounded-xl text-xs font-semibold border-gray-300 hover:border-violet-600 hover:text-violet-700"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          View Details
        </Button>

        <Button
          className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          Apply Now
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Job;
