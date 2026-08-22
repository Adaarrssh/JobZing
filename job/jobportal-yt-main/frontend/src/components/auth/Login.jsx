import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  Globe2,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser } from "@/redux/authSlice";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DEMO_USERS, getRegisteredUsers } from "@/utils/mockData";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "recruiter" ? "recruiter" : "student";

  const { user, loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activePortal, setActivePortal] = useState(initialRole); // "student" or "recruiter"
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handlePortalSwitch = (portalType) => {
    setActivePortal(portalType);
    setSearchParams(portalType === "recruiter" ? { role: "recruiter" } : {});
    setInput({ email: "", password: "" });
  };

  // 1-Click Quick Demo Login for the active portal
  const handleQuickDemoLogin = () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      const demoUser = activePortal === "recruiter" ? DEMO_USERS.recruiter : DEMO_USERS.seeker;
      dispatch(setUser(demoUser));
      dispatch(setLoading(false));
      toast.success(
        `Signed in as Demo ${
          activePortal === "recruiter" ? "Recruiter (Priya Patel @ Google Tech Hub)" : "Job Seeker (Rahul Sharma)"
        }!`
      );
      if (activePortal === "recruiter") {
        navigate("/admin/jobs");
      } else {
        navigate("/jobs");
      }
    }, 400);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      dispatch(setLoading(true));

      // Attempt backend API login if available
      let backendSuccess = false;
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          {
            email: input.email,
            password: input.password,
            role: activePortal,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          backendSuccess = true;
          dispatch(setUser(res.data.user));
          toast.success(res.data.message || "Login successful!");
          if (res.data.user.role === "recruiter") {
            navigate("/admin/jobs");
          } else {
            navigate("/jobs");
          }
        }
      } catch (backendError) {
        console.log("Backend API not reachable, checking local accounts");
      }

      // Local mock login fallback
      if (!backendSuccess) {
        const allUsers = getRegisteredUsers();
        const found = allUsers.find(
          (u) => u.email.toLowerCase() === input.email.toLowerCase()
        );

        if (found) {
          const userObj = { ...found, role: activePortal };
          dispatch(setUser(userObj));
          toast.success(`Welcome back, ${userObj.fullname}!`);
          if (userObj.role === "recruiter") {
            navigate("/admin/jobs");
          } else {
            navigate("/jobs");
          }
        } else {
          // Dynamic simulated user creation on login
          const simulatedUser = {
            _id: `user_${activePortal}_${Date.now()}`,
            fullname: input.email.split("@")[0] || (activePortal === "recruiter" ? "Recruiter" : "Candidate"),
            email: input.email,
            phoneNumber: "+91 98765 00000",
            role: activePortal,
            profile: {
              bio: activePortal === "recruiter" ? "Hiring Manager & Talent Acquisition" : "Full Stack Developer",
              skills: ["React", "JavaScript", "Node.js"],
              companyName: activePortal === "recruiter" ? "Hiring Firm" : "",
              profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(input.email)}&background=${activePortal === "recruiter" ? "ea580c" : "7c3aed"}&color=fff`,
            },
          };
          dispatch(setUser(simulatedUser));
          toast.success(`Welcome to JobZing, ${simulatedUser.fullname}!`);
          if (simulatedUser.role === "recruiter") {
            navigate("/admin/jobs");
          } else {
            navigate("/jobs");
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "recruiter") {
        navigate("/admin/jobs");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const isRecruiter = activePortal === "recruiter";

  return (
    <>
      <Navbar />

      <div className={`min-h-[calc(100vh-80px)] py-10 px-4 flex items-center transition-colors duration-500 ${
        isRecruiter
          ? "bg-gradient-to-br from-orange-50/80 via-slate-50 to-amber-50/60"
          : "bg-gradient-to-br from-violet-50/80 via-slate-50 to-blue-50/60"
      }`}>
        <div className="max-w-6xl mx-auto w-full">
          {/* SEPARATE PORTAL SELECTOR TABS AT TOP */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePortalSwitch("student")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  !isRecruiter
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-violet-600 hover:bg-gray-50"
                }`}
              >
                <Bot size={16} />
                Job Seeker Portal
              </button>

              <button
                type="button"
                onClick={() => handlePortalSwitch("recruiter")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isRecruiter
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                }`}
              >
                <Building2 size={16} />
                Employer / Recruiter Portal
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* LEFT SIDE: Tailored messaging according to portal */}
            <motion.div
              key={activePortal}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-6 space-y-6"
            >
              {!isRecruiter ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-200 text-violet-700 px-4 py-1.5 rounded-full font-semibold text-xs shadow-xs">
                    <Sparkles size={14} className="text-violet-600 animate-pulse" />
                    <span>Candidate Job Discovery</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                    Find Your Next Career Move on <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-600">
                      JobZing Multi-Portal
                    </span>
                  </h1>

                  <p className="text-gray-600 text-base leading-relaxed">
                    Search and apply to thousands of verified jobs aggregated from <strong>LinkedIn, Indeed, Naukri, Glassdoor</strong> and direct recruiters.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-violet-100 flex items-center gap-3">
                      <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
                        <Globe2 size={18} />
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Unified applications across major job portals with ATS compatibility scores.
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-violet-100 flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                        <CheckCircle2 size={18} />
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Real-time interview and application tracking in your personal dashboard.
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 px-4 py-1.5 rounded-full font-semibold text-xs shadow-xs">
                    <Building2 size={14} className="text-orange-600" />
                    <span>Employer Hiring Suite</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                    Hire Top Talent For <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                      Your Organization
                    </span>
                  </h1>

                  <p className="text-gray-600 text-base leading-relaxed">
                    Publish job listings, manage company profiles, review applicant resumes, and shortlist candidates from a private recruiter dashboard.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 flex items-center gap-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                        <Briefcase size={18} />
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Only your company's posted jobs and applicants will be displayed in your private recruiter console.
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-700 rounded-xl">
                        <Users size={18} />
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Direct access to candidate resumes, contact details, and one-click status shortlisting.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* RIGHT SIDE: Dedicated Login Form */}
            <motion.div
              key={`form-${activePortal}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-6"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-2xl mb-3 ${
                    isRecruiter ? "bg-orange-100 text-orange-600" : "bg-violet-100 text-violet-600"
                  }`}>
                    {isRecruiter ? <Building2 size={26} /> : <Bot size={26} />}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {isRecruiter ? "Employer Portal Login" : "Job Seeker Sign In"}
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    {isRecruiter
                      ? "Access your company dashboard and posted jobs"
                      : "Access your job applications and saved openings"}
                  </p>
                </div>

                {/* 1-Click Demo Login for the Selected Role */}
                <div className="mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleQuickDemoLogin}
                    className={`w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                      isRecruiter
                        ? "border-orange-200 bg-orange-50/60 text-orange-700 hover:bg-orange-100 hover:border-orange-300"
                        : "border-violet-200 bg-violet-50/60 text-violet-700 hover:bg-violet-100 hover:border-violet-300"
                    }`}
                  >
                    <Sparkles size={14} />
                    1-Click Demo Sign In ({isRecruiter ? "Priya Patel @ Google" : "Rahul Sharma"})
                  </Button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-400 font-semibold">Or with credentials</span>
                  </div>
                </div>

                <form onSubmit={submitHandler} className="space-y-4">
                  {/* EMAIL */}
                  <div>
                    <Label className="text-gray-700 font-semibold text-xs">
                      {isRecruiter ? "Work Email Address *" : "Email Address *"}
                    </Label>
                    <Input
                      required
                      type="email"
                      name="email"
                      placeholder={isRecruiter ? "recruiter@company.com" : "you@example.com"}
                      value={input.email}
                      onChange={changeHandler}
                      className="mt-1.5 h-11 rounded-xl border-gray-300 focus:border-violet-600"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <div className="flex justify-between items-center">
                      <Label className="text-gray-700 font-semibold text-xs">Password *</Label>
                      <button
                        type="button"
                        onClick={() => toast.info("Use the 1-Click Demo button or enter your password.")}
                        className="text-[11px] text-violet-600 hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative mt-1.5">
                      <Input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={input.password}
                        onChange={changeHandler}
                        className="h-11 rounded-xl border-gray-300 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-violet-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-11 rounded-xl text-sm font-bold shadow-md transition-all mt-2 ${
                      isRecruiter
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In as {isRecruiter ? "Recruiter" : "Job Seeker"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* SIGNUP LINK */}
                  <div className="text-center pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to={isRecruiter ? "/signup?role=recruiter" : "/signup"}
                        className="text-violet-600 font-bold hover:underline"
                      >
                        Create {isRecruiter ? "Recruiter ID" : "Candidate Account"}
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
