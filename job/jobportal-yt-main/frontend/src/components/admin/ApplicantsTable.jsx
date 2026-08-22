import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import {
  MoreHorizontal,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { updateJobApplicationStatus } from "@/redux/jobSlice";
import { updateApplicantStatus } from "@/redux/applicationSlice";

const shortlistingStatus = [
  { label: "Shortlist / Accept", value: "accepted", icon: CheckCircle2, color: "text-green-600 hover:bg-green-50" },
  { label: "Reject Candidate", value: "rejected", icon: XCircle, color: "text-red-600 hover:bg-red-50" },
  { label: "Mark Pending", value: "pending", icon: Clock, color: "text-amber-600 hover:bg-amber-50" },
];

const ApplicantsTable = ({ jobId }) => {
  const { applicants } = useSelector((store) => store.application);
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  // Find job applications from application store or current job in job store
  const matchedJob = allJobs.find((j) => j._id === jobId);
  const applications = applicants?.applications || matchedJob?.applications || [];

  const statusHandler = async (status, applicationId) => {
    // 1. Update Redux store immediately
    dispatch(updateJobApplicationStatus({ applicationId, status }));
    dispatch(updateApplicantStatus({ applicationId, status }));

    const statusLabel = status === "accepted" ? "Accepted / Shortlisted" : status === "rejected" ? "Rejected" : "Pending";
    toast.success(`Candidate status updated to: ${statusLabel}!`);

    // 2. Attempt backend API update
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status });
    } catch (error) {
      console.log("Backend offline, candidate status updated in local demo state");
    }
  };

  const getStatusBadge = (status = "pending") => {
    const s = status.toLowerCase();
    if (s === "accepted" || s === "shortlisted") {
      return <Badge className="bg-green-100 text-green-800 border border-green-200 font-bold">SHORTLISTED / ACCEPTED</Badge>;
    }
    if (s === "rejected") {
      return <Badge className="bg-red-100 text-red-800 border border-red-200 font-bold">REJECTED</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800 border border-amber-200 font-bold">PENDING REVIEW</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50 rounded-2xl">
          <TableRow>
            <TableHead className="font-bold text-gray-700">Candidate Name</TableHead>
            <TableHead className="font-bold text-gray-700">Contact Details</TableHead>
            <TableHead className="font-bold text-gray-700">Skills</TableHead>
            <TableHead className="font-bold text-gray-700">Resume</TableHead>
            <TableHead className="font-bold text-gray-700">Applied Date</TableHead>
            <TableHead className="font-bold text-gray-700">Status</TableHead>
            <TableHead className="font-bold text-gray-700 text-right">Decision</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-10 w-10 text-gray-300" />
                  <p className="font-semibold text-gray-700">No applicants yet</p>
                  <p className="text-xs text-gray-400">
                    Switch to Job Seeker view to submit an application and see it appear here in real-time!
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            applications.map((item) => {
              const applicant = item?.applicant || {};
              const skills = applicant?.profile?.skills || [];
              const resumeUrl = applicant?.profile?.resume;
              const resumeName = applicant?.profile?.resumeOriginalName || "Candidate_Resume.pdf";

              return (
                <TableRow key={item._id} className="hover:bg-slate-50/80 transition-colors">
                  {/* CANDIDATE */}
                  <TableCell>
                    <div className="font-bold text-gray-900 text-sm">
                      {applicant.fullname || "Anonymous Candidate"}
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">
                      {applicant?.profile?.bio || "Job Seeker"}
                    </div>
                  </TableCell>

                  {/* CONTACT */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <Mail size={12} className="text-violet-600" />
                      <span>{applicant.email || "N/A"}</span>
                    </div>
                    {applicant.phoneNumber && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <Phone size={12} className="text-emerald-600" />
                        <span>{applicant.phoneNumber}</span>
                      </div>
                    )}
                  </TableCell>

                  {/* SKILLS */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {skills.length > 0 ? (
                        skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-violet-50 text-violet-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Not specified</span>
                      )}
                    </div>
                  </TableCell>

                  {/* RESUME */}
                  <TableCell>
                    {resumeUrl ? (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl border border-violet-200 transition"
                      >
                        <FileText size={13} />
                        <span>View Resume</span>
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No Resume</span>
                    )}
                  </TableCell>

                  {/* DATE */}
                  <TableCell className="text-xs text-gray-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently"}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>{getStatusBadge(item.status)}</TableCell>

                  {/* ACTION DECISION */}
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition">
                          <MoreHorizontal size={18} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2 rounded-2xl shadow-xl border border-gray-100" align="end">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1 mb-1">
                          Update Candidate Status:
                        </div>
                        {shortlistingStatus.map((action, idx) => {
                          const Icon = action.icon;
                          return (
                            <div
                              key={idx}
                              onClick={() => statusHandler(action.value, item._id)}
                              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer transition ${action.color}`}
                            >
                              <Icon size={15} />
                              <span>{action.label}</span>
                            </div>
                          );
                        })}
                      </PopoverContent>
                    </Popover>
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

export default ApplicantsTable;