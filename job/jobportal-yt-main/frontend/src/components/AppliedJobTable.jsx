import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Briefcase,
  CalendarDays,
  Sparkles,
  Building2,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Globe2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  const getStatusBadge = (status = "pending") => {
    const s = status?.toLowerCase();
    switch (s) {
      case "accepted":
      case "shortlisted":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-lg text-xs font-bold">
            <CheckCircle2 size={13} /> ACCEPTED / SHORTLISTED
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-lg text-xs font-bold">
            <XCircle size={13} /> REJECTED
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold">
            <Clock size={13} /> UNDER REVIEW
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-x-auto shadow-2xs">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-gray-700">Company</TableHead>
            <TableHead className="font-bold text-gray-700">Job Role</TableHead>
            <TableHead className="font-bold text-gray-700">Source</TableHead>
            <TableHead className="font-bold text-gray-700">Applied On</TableHead>
            <TableHead className="font-bold text-gray-700">Live Status</TableHead>
            <TableHead className="font-bold text-gray-700 text-right">Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-14 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">No Job Applications Yet</h3>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Browse aggregated jobs across portals and apply to track your interview statuses here!
                  </p>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="mt-3 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition"
                  >
                    Find Jobs
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((item, index) => {
              const job = item?.job || {};
              const company = job?.company || {};

              return (
                <TableRow key={item._id || index} className="hover:bg-slate-50/80 transition-colors">
                  {/* COMPANY */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl border bg-violet-50">
                        {company.logo ? (
                          <AvatarImage src={company.logo} className="object-contain p-1" />
                        ) : (
                          <AvatarFallback className="font-bold text-violet-700 text-xs">
                            {company.name?.[0] || "C"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">
                          {company.name || "Hiring Company"}
                        </div>
                        <div className="text-xs text-gray-400">{job.location || "India"}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* ROLE */}
                  <TableCell>
                    <div
                      onClick={() => job._id && navigate(`/description/${job._id}`)}
                      className="font-bold text-gray-900 text-sm hover:text-violet-600 transition cursor-pointer"
                    >
                      {job.title || "Software Engineer"}
                    </div>
                    <div className="text-xs text-gray-500">
                      ₹ {job.salary ? `${job.salary} LPA` : "Competitive"} • {job.jobType || "Full-Time"}
                    </div>
                  </TableCell>

                  {/* SOURCE */}
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                      <Globe2 size={11} className="text-violet-600" />
                      {job.source || "JobZing Direct"}
                    </span>
                  </TableCell>

                  {/* APPLIED DATE */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays size={13} className="text-violet-600" />
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently"}</span>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>{getStatusBadge(item.status)}</TableCell>

                  {/* ACTION LINK */}
                  <TableCell className="text-right">
                    {job._id && (
                      <button
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="text-xs font-bold text-violet-600 hover:text-violet-800 hover:underline inline-flex items-center gap-1"
                      >
                        View Job <ExternalLink size={12} />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
