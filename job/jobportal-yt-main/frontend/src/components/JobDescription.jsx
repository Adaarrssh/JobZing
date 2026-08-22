import React, { useEffect, useState } from "react";
import {
  MapPin,
  BriefcaseBusiness,
  IndianRupee,
  CalendarDays,
  Users,
  Building2,
  Clock3,
  CheckCircle,
  Sparkles,
  Globe2,
  ExternalLink,
  Bot,
  ArrowLeft,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Navbar from "./shared/Navbar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob, applyToJobAction } from "@/redux/jobSlice";

const getSourceBadgeStyle = (source = "JobZing Direct") => {
  if (source.includes("LinkedIn")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (source.includes("Indeed")) return "bg-indigo-100 text-indigo-800 border-indigo-200";
  if (source.includes("Naukri")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (source.includes("Glassdoor")) return "bg-teal-100 text-teal-800 border-teal-200";
  if (source.includes("Wellfound")) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-violet-100 text-violet-800 border-violet-200 font-bold";
};

const JobDescription = () => {
  const { allJobs, singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const jobId = params.id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Find job from store or state
  const currentJob = singleJob?._id === jobId ? singleJob : allJobs.find((j) => j._id === jobId);

  const isInitiallyApplied =
    currentJob?.applications?.some(
      (application) =>
        application.applicant?._id === user?._id || application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  useEffect(() => {
    if (currentJob) {
      dispatch(setSingleJob(currentJob));
      const applied = currentJob.applications?.some(
        (app) => app.applicant?._id === user?._id || app.applicant === user?._id
      );
      setIsApplied(!!applied);
    } else {
      // Attempt to fetch from API if not found in memory
      const fetchJob = async () => {
        try {
          const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            dispatch(setSingleJob(res.data.job));
            setIsApplied(
              res.data.job.applications?.some(
                (app) => app.applicant?._id === user?._id || app.applicant === user?._id
              )
            );
          }
        } catch (error) {
          console.log("Backend offline, job loaded from store");
        }
      };
      fetchJob();
    }
  }, [dispatch, jobId, user?._id, allJobs]);

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login as a Job Seeker to apply.");
      navigate("/login");
      return;
    }

    if (user.role === "recruiter") {
      toast.error("Recruiter accounts cannot apply to jobs. Switch to Job Seeker mode.");
      return;
    }

    const newApplication = {
      _id: `app_${Date.now()}`,
      applicant: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        createdAt: new Date().toISOString(),
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Update Redux Store & LocalStorage
    dispatch(applyToJobAction({ jobId, application: newApplication }));
    setIsApplied(true);
    toast.success("Application submitted successfully! Track it in your Profile.");

    // Attempt backend API apply
    try {
      await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log("Backend offline, application saved in local demo state");
    }
  };

  if (!currentJob) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[70vh] text-center p-6">
          <Building2 className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
          <p className="text-gray-500 text-sm mt-1">This job opening may have expired or been removed.</p>
          <Button onClick={() => navigate("/jobs")} className="mt-4 bg-violet-600">
            Browse All Jobs
          </Button>
        </div>
      </>
    );
  }

  // Calculate AI Match Score with Candidate's Profile Skills
  const candidateSkills = user?.profile?.skills || ["React", "JavaScript", "HTML", "CSS"];
  const jobRequirements = currentJob.requirements || [];
  
  const matchedSkills = jobRequirements.filter((req) =>
    candidateSkills.some((skill) =>
      skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const missingSkills = jobRequirements.filter((req) => !matchedSkills.includes(req));

  const matchPercentage =
    jobRequirements.length > 0
      ? Math.min(Math.round((matchedSkills.length / jobRequirements.length) * 100) + 20, 98)
      : 85;

  const source = currentJob?.source || "JobZing Direct";

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* BACK LINK */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-violet-700 transition"
            >
              <ArrowLeft size={16} /> Back to Jobs
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Job link copied to clipboard!");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border px-3 py-1.5 rounded-xl hover:bg-gray-50 shadow-2xs"
            >
              <Share2 size={14} /> Share Opening
            </button>
          </div>

          {/* MAIN CARD */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200/80 p-6 sm:p-10 space-y-8">
            {/* TOP HERO BANNER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-gray-100">
              <div className="flex items-start sm:items-center gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center p-2 shrink-0">
                  {currentJob?.company?.logo ? (
                    <img
                      src={currentJob.company.logo}
                      alt={currentJob.company.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Building2 className="text-violet-600 w-8 h-8" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getSourceBadgeStyle(
                        source
                      )}`}
                    >
                      <Globe2 size={12} />
                      {source}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Posted on {currentJob.createdAt ? new Date(currentJob.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                    {currentJob.title}
                  </h1>

                  <p className="text-gray-600 font-medium text-sm mt-1 flex items-center gap-2">
                    <span className="text-violet-700 font-bold">{currentJob.company?.name}</span>
                    <span>•</span>
                    <span className="flex items-center text-gray-500">
                      <MapPin size={14} className="mr-1 text-orange-500" />
                      {currentJob.location}
                    </span>
                  </p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                {currentJob.externalUrl ? (
                  <a
                    href={currentJob.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full lg:w-auto"
                  >
                    <Button
                      variant="outline"
                      className="w-full lg:w-auto px-6 py-6 text-sm font-bold rounded-2xl border-violet-300 text-violet-700 hover:bg-violet-50 flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Open on {currentJob.sourcePortal || "Original Site"}
                    </Button>
                  </a>
                ) : null}

                <Button
                  disabled={isApplied}
                  onClick={isApplied ? undefined : applyJobHandler}
                  className={`w-full lg:w-auto px-8 py-6 text-base font-bold rounded-2xl shadow-md transition-all ${
                    isApplied
                      ? "bg-green-600 hover:bg-green-600 text-white cursor-default"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                >
                  {isApplied ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" /> Applied to Job
                    </span>
                  ) : (
                    "Apply Directly with Resume"
                  )}
                </Button>
              </div>
            </div>

            {/* KEY STATS PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-violet-600 text-xs font-semibold mb-1">
                  <IndianRupee size={15} /> Expected Salary
                </div>
                <div className="text-base font-bold text-gray-900">{currentJob.salary} LPA</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-semibold mb-1">
                  <BriefcaseBusiness size={15} /> Job Type
                </div>
                <div className="text-base font-bold text-gray-900">{currentJob.jobType || "Full-Time"}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-1">
                  <Clock3 size={15} /> Experience
                </div>
                <div className="text-base font-bold text-gray-900">{currentJob.experienceLevel || "2-4 Years"}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold mb-1">
                  <Users size={15} /> Active Applicants
                </div>
                <div className="text-base font-bold text-gray-900">
                  {currentJob.applications?.length || 0} Candidates
                </div>
              </div>
            </div>

            {/* AI ATS MATCH REPORT */}
            <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border border-violet-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-violet-600 text-white rounded-xl shadow-xs">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">
                      JobZing AI Resume Match Score
                    </h3>
                    <p className="text-xs text-gray-600">
                      Calculated against requirements for: <strong>{user ? user.fullname : "Guest Profile"}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-violet-700">{matchPercentage}%</div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Profile Match</div>
                  </div>
                </div>
              </div>

              {/* Matched & Missing Skills tags */}
              <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-violet-200/60 text-xs">
                <div>
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-2">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Matched Skills ({matchedSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map((s, i) => (
                        <span key={i} className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-semibold">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">None matched yet. Update skills in profile.</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-amber-800 flex items-center gap-1 mb-2">
                    <AlertCircle size={14} className="text-amber-600" /> Recommended to Add ({missingSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((s, i) => (
                        <span key={i} className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold">
                          + {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-700 font-bold">100% skills covered!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* JOB DESCRIPTION SECTION */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About the Role</h2>
              <div className="bg-slate-50 rounded-2xl p-6 text-gray-700 text-sm leading-relaxed border border-gray-100">
                {currentJob.description}
              </div>
            </div>

            {/* REQUIREMENTS SECTION */}
            {currentJob.requirements && currentJob.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Key Requirements & Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {currentJob.requirements.map((req, index) => (
                    <Badge
                      key={index}
                      className="bg-violet-100 text-violet-800 hover:bg-violet-200 text-sm px-4 py-2 rounded-xl"
                    >
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ABOUT COMPANY SECTION */}
            {currentJob.company && (
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About {currentJob.company.name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {currentJob.company.description || "Leading innovator in technology solutions."}
                </p>
                {currentJob.company.website && (
                  <a
                    href={currentJob.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-violet-700 font-bold hover:underline"
                  >
                    Visit Company Website <ExternalLink size={13} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
