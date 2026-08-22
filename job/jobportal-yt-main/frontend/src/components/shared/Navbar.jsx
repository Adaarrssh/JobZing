import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  LogOut,
  User2,
  Briefcase,
  PlusCircle,
  Building2,
  Bot,
  Search,
  Sparkles,
  Layers,
  ArrowRightLeft,
  BookmarkCheck,
  FileCheck2,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { DEMO_USERS } from "@/utils/mockData";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      try {
        await axios.get(`${USER_API_END_POINT}/logout`, {
          withCredentials: true,
        });
      } catch (err) {
        console.log("Backend offline, cleared session locally");
      }
      dispatch(setUser(null));
      navigate("/");
      toast.success("Successfully logged out.");
    } catch (error) {
      console.log(error);
      dispatch(setUser(null));
      navigate("/");
    }
  };

  const switchRoleHandler = () => {
    if (user?.role === "recruiter") {
      dispatch(setUser(DEMO_USERS.seeker));
      toast.success("Switched to Job Seeker mode (Rahul Sharma)");
      navigate("/jobs");
    } else {
      dispatch(setUser(DEMO_USERS.recruiter));
      toast.success("Switched to Recruiter mode (Priya Patel)");
      navigate("/admin/jobs");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* FAR LEFT: LOGO */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-700 via-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              JZ
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none">
                <span className="text-violet-700">Job</span>
                <span className="text-orange-500">Zing</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <Sparkles size={9} className="text-violet-600" /> Multi-Portal Hub
              </span>
            </div>
          </Link>

          {/* NAVIGATION LINKS (CENTER-LEFT) */}
          <nav className="hidden lg:flex items-center gap-1">
            {user && user.role === "recruiter" ? (
              <>
                <Link
                  to="/admin/jobs"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/admin/jobs")
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  <Briefcase size={14} />
                  Posted Jobs
                </Link>

                <Link
                  to="/admin/jobs/create"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/admin/jobs/create")
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  <PlusCircle size={14} />
                  Post a Job
                </Link>

                <Link
                  to="/admin/companies"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/admin/companies")
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  <Building2 size={14} />
                  Companies
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive("/")
                      ? "bg-violet-50 text-violet-700"
                      : "text-gray-600 hover:text-violet-700 hover:bg-gray-50"
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/jobs"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/jobs")
                      ? "bg-violet-50 text-violet-700"
                      : "text-gray-600 hover:text-violet-700 hover:bg-gray-50"
                  }`}
                >
                  <Search size={14} />
                  Find Jobs
                </Link>

                <Link
                  to="/browse"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/browse")
                      ? "bg-violet-50 text-violet-700"
                      : "text-gray-600 hover:text-violet-700 hover:bg-gray-50"
                  }`}
                >
                  <Layers size={14} />
                  Aggregated Portals
                </Link>

                <Link
                  to="/ai-resume-checker"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/ai-resume-checker")
                      ? "bg-violet-100 text-violet-800"
                      : "text-violet-700 bg-violet-50/70 hover:bg-violet-100"
                  }`}
                >
                  <FileCheck2 size={14} className="text-violet-600" />
                  AI Resume Review
                </Link>

                {user && (
                  <Link
                    to="/profile"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive("/profile")
                        ? "bg-violet-50 text-violet-700"
                        : "text-gray-600 hover:text-violet-700 hover:bg-gray-50"
                    }`}
                  >
                    <BookmarkCheck size={14} />
                    My Applications
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* FAR RIGHT: POST JOB CTA + ROLE SWITCHER + LOGIN / SIGNUP / PROFILE */}
        <div className="flex items-center gap-3">
          {/* Quick Post a Job Shortcut */}
          <Link to="/admin/jobs/create" className="hidden sm:inline-block">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs font-bold gap-1.5 border-orange-200 bg-orange-50/60 text-orange-700 hover:bg-orange-100"
            >
              <PlusCircle size={13} />
              Post Job
            </Button>
          </Link>

          {/* Quick Switch Role Demo Pill */}
          <button
            onClick={switchRoleHandler}
            title="Toggle between Job Seeker and Recruiter perspective"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all bg-slate-50 hover:bg-violet-50 border-gray-200 text-gray-700 hover:text-violet-700 hover:border-violet-300 shadow-2xs"
          >
            <ArrowRightLeft size={12} className="text-violet-600" />
            <span>
              {user?.role === "recruiter" ? "Seeker View" : "Recruiter View"}
            </span>
          </button>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="rounded-xl text-xs font-bold px-4 py-2 border-gray-300 hover:border-violet-600 hover:text-violet-700"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-xl text-xs font-bold px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white shadow-xs">
                  Create ID
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-2xl hover:bg-gray-100 transition border border-gray-100 shadow-2xs">
                  <Avatar className="h-9 w-9 border-2 border-violet-500">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.fullname || "User"
                        )}&background=7c3aed&color=fff`
                      }
                      alt={user?.fullname || "User"}
                    />
                    <AvatarFallback>{user?.fullname?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col text-left pr-1">
                    <span className="text-xs font-bold text-gray-900 leading-tight">
                      {user?.fullname || "User"}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        user?.role === "recruiter" ? "text-orange-600" : "text-violet-600"
                      }`}
                    >
                      {user?.role === "recruiter" ? "Recruiter" : "Job Seeker"}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-5 rounded-2xl shadow-xl border border-gray-100" align="end">
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <Avatar className="h-12 w-12 border-2 border-violet-500">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.fullname || "User"
                          )}&background=7c3aed&color=fff`
                        }
                        alt={user?.fullname || "User"}
                      />
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{user?.fullname}</h4>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          user?.role === "recruiter"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {user?.role === "recruiter" ? "Recruiter Account" : "Job Seeker Account"}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1 text-xs font-semibold">
                    {user?.role === "recruiter" ? (
                      <>
                        <Link
                          to="/admin/jobs"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <Briefcase size={15} />
                          <span>Manage Posted Jobs</span>
                        </Link>
                        <Link
                          to="/admin/jobs/create"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <PlusCircle size={15} />
                          <span>Post a New Job</span>
                        </Link>
                        <Link
                          to="/admin/companies"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <Building2 size={15} />
                          <span>Company Profiles</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
                        >
                          <User2 size={15} />
                          <span>Profile & Resume</span>
                        </Link>
                        <Link
                          to="/ai-resume-checker"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
                        >
                          <FileCheck2 size={15} />
                          <span>AI Resume Reviewer</span>
                        </Link>
                        <Link
                          to="/jobs"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
                        >
                          <Search size={15} />
                          <span>Search All Jobs</span>
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={switchRoleHandler}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition text-left"
                    >
                      <ArrowRightLeft size={15} className="text-violet-600" />
                      <span>
                        Switch to {user?.role === "recruiter" ? "Job Seeker" : "Recruiter"}
                      </span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition font-bold text-xs"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
