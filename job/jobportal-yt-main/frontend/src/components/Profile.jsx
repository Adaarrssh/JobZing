import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import {
  Mail,
  Phone,
  Pencil,
  FileText,
  Sparkles,
  Download,
  User,
  ExternalLink,
  Bot,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const isResume = !!user?.profile?.resume;
  const userRole = user?.role === "recruiter" ? "Employer / Recruiter" : "Job Seeker / Applicant";
  const skillsList = user?.profile?.skills || ["React.js", "JavaScript", "TypeScript", "Tailwind CSS"];

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-violet-500 shadow-md">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullname || "User"
                      )}&background=7c3aed&color=fff`
                    }
                    alt={user?.fullname || "User"}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-violet-100 text-violet-700">
                    {user?.fullname?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {user?.fullname || "Candidate Profile"}
                  </h1>

                  <p className="text-gray-500 text-sm mt-1.5 max-w-xl leading-relaxed">
                    {user?.profile?.bio ||
                      "Full Stack Engineer passionate about building modern web applications and AI workflows."}
                  </p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                    <Badge
                      className={
                        user?.role === "recruiter"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-violet-600 hover:bg-violet-700 text-white"
                      }
                    >
                      {userRole}
                    </Badge>

                    <Badge variant="secondary" className="bg-violet-50 text-violet-700 border border-violet-200">
                      <Sparkles className="h-3 w-3 mr-1 text-violet-600" />
                      AI ATS Ready
                    </Badge>

                    <Badge className={isResume ? "bg-emerald-600 text-white" : "bg-gray-400 text-white"}>
                      {isResume ? "Resume Active" : "No Resume"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setOpen(true)}
                className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs sm:text-sm px-5 py-5 shadow-xs self-center md:self-start"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* CONTACT DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="rounded-2xl border border-gray-200/80 p-4 bg-slate-50/50 flex items-center gap-3.5">
                <div className="p-3 bg-violet-100 rounded-xl text-violet-600">
                  <Mail size={18} />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</Label>
                  <p className="text-gray-900 font-semibold text-sm mt-0.5 break-all">
                    {user?.email || "seeker@jobzing.com"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/80 p-4 bg-slate-50/50 flex items-center gap-3.5">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                  <Phone size={18} />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</Label>
                  <p className="text-gray-900 font-semibold text-sm mt-0.5">
                    {user?.phoneNumber || "+91 98765 43210"}
                  </p>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-violet-600" />
                  Professional Skills & Expertise
                </h2>
                <button
                  onClick={() => setOpen(true)}
                  className="text-xs text-violet-600 font-bold hover:underline"
                >
                  + Add Skills
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-violet-50 text-violet-700 border border-violet-200 px-3.5 py-1.5 rounded-xl text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* RESUME MANAGEMENT */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-violet-600" />
                Resume Vault
              </h2>

              <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/50">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm break-all">
                      {isResume
                        ? user?.profile?.resumeOriginalName || "Rahul_Sharma_Resume.pdf"
                        : "No Resume Uploaded"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isResume
                        ? "Active resume automatically attached when applying to jobs on JobZing."
                        : "Upload your resume in Edit Profile to start applying directly."}
                    </p>
                  </div>
                </div>

                {isResume ? (
                  <a
                    href={user?.profile?.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0"
                  >
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold px-4 py-2">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      View & Download
                    </Button>
                  </a>
                ) : (
                  <Button
                    onClick={() => setOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold px-4 py-2 shrink-0"
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    Upload Resume
                  </Button>
                )}
              </div>
            </div>

            {/* AI ATS ANALYSIS CARD */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="text-violet-600" size={20} />
                <h2 className="text-base font-bold text-gray-900">
                  AI ATS Resume Health Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-200">Overall ATS Score</span>
                  <div className="text-3xl font-black mt-2">88 / 100</div>
                  <p className="text-[11px] text-violet-100 mt-2">Strong profile formatting and keyword density.</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Keyword Coverage</span>
                  <div className="text-3xl font-black text-emerald-600 mt-2">92%</div>
                  <p className="text-[11px] text-gray-500 mt-2">High match with modern Full Stack roles.</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Profile Readiness</span>
                  <div className="text-3xl font-black text-violet-600 mt-2">Ready</div>
                  <p className="text-[11px] text-gray-500 mt-2">Ready to apply to aggregated and direct job posts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* APPLIED JOBS SECTION */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-10 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Job Applications</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time tracking of jobs you've applied to and recruiter decisions.
              </p>
            </div>

            <AppliedJobTable />
          </div>
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default Profile;
