import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Bot,
  Sparkles,
  Briefcase,
  FileText,
  ShieldCheck,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  Building2,
  Globe,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { saveRegisteredUser } from "@/utils/mockData";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student"); // "student" (Seeker) or "recruiter"

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    skills: "React, JavaScript, Tailwind CSS",
    file: null,
    resume: null,
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files?.[0] || null,
    });
  };

  const changeResumeHandler = (e) => {
    setInput({
      ...input,
      resume: e.target.files?.[0] || null,
    });
  };

  // Quick fill sample data helper
  const handleQuickFill = () => {
    if (role === "student") {
      setInput({
        fullname: "Aarav Gupta",
        email: `aarav.${Date.now().toString().slice(-4)}@example.com`,
        phoneNumber: "+91 98765 12345",
        password: "password123",
        companyName: "",
        companyWebsite: "",
        companyLocation: "",
        skills: "React.js, Next.js, TypeScript, Tailwind CSS, Redux",
        file: null,
        resume: null,
      });
    } else {
      setInput({
        fullname: "Siddharth Verma",
        email: `siddharth.${Date.now().toString().slice(-4)}@techcorp.io`,
        phoneNumber: "+91 91234 98765",
        password: "password123",
        companyName: "HyperCloud Systems",
        companyWebsite: "https://hypercloud.io",
        companyLocation: "Bangalore, India",
        skills: "",
        file: null,
        resume: null,
      });
    }
    toast.success("Sample fields populated! Click 'Create Account' to proceed.");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      dispatch(setLoading(true));

      let backendRegistered = false;

      // Try Backend Registration if active
      try {
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", role);

        if (input.file) {
          formData.append("file", input.file);
        }

        const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (res.data.success) {
          backendRegistered = true;
          toast.success(res.data.message || "Account created successfully!");
          navigate("/login");
        }
      } catch (backendError) {
        console.log("Backend not active, storing user locally:", backendError?.message);
      }

      // Local Registration Fallback
      if (!backendRegistered) {
        const newUser = {
          _id: `user_${Date.now()}`,
          fullname: input.fullname,
          email: input.email,
          phoneNumber: input.phoneNumber || "+91 98765 00000",
          role: role,
          profile: {
            bio: role === "recruiter"
              ? `Hiring Manager at ${input.companyName || "Tech Firm"}`
              : "Software Engineer & Job Seeker",
            skills: input.skills ? input.skills.split(",").map((s) => s.trim()) : ["React", "JavaScript"],
            companyName: input.companyName || "",
            companyWebsite: input.companyWebsite || "",
            companyLocation: input.companyLocation || "",
            resume: input.resume ? URL.createObjectURL(input.resume) : "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            resumeOriginalName: input.resume?.name || (role === "student" ? `${input.fullname.replace(/\s+/g, "_")}_Resume.pdf` : ""),
            profilePhoto: input.file ? URL.createObjectURL(input.file) : `https://ui-avatars.com/api/?name=${encodeURIComponent(input.fullname)}&background=7c3aed&color=fff`,
          },
        };

        saveRegisteredUser(newUser);
        dispatch(setUser(newUser));
        toast.success(`Account created for ${newUser.fullname}! Welcome to JobZing.`);
        if (role === "recruiter") {
          navigate("/admin/jobs");
        } else {
          navigate("/jobs");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
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

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-violet-50 via-white to-orange-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* LEFT SIDE: Value Proposition */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6 lg:sticky lg:top-28"
            >
              <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-200 text-violet-700 px-4 py-1.5 rounded-full font-semibold text-sm shadow-sm">
                <Sparkles size={16} />
                <span>Join India's Smartest Job Platform</span>
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  Start Your Journey With{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-orange-500">
                    JobZing
                  </span>
                </h1>
                <p className="text-gray-600 mt-3 text-base leading-relaxed">
                  Whether you're searching for your dream job across top aggregated portals or hiring exceptional talent for your team, JobZing connects you seamlessly.
                </p>
              </div>

              {/* Dynamic Benefits based on Role */}
              <div className="space-y-3.5">
                {role === "student" ? (
                  <>
                    <div className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm flex items-start gap-3.5">
                      <div className="p-2 bg-violet-100 rounded-xl text-violet-600">
                        <Bot size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Aggregated Jobs in One Place</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Browse jobs pulled from LinkedIn, Indeed, Naukri, Glassdoor, and direct recruiters.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm flex items-start gap-3.5">
                      <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">AI Resume Compatibility Match</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Check ATS match percentage with job descriptions before applying.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm flex items-start gap-3.5">
                      <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Live Application Tracker</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Track real-time status: Applied, Reviewing, Shortlisted, or Accepted.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm flex items-start gap-3.5">
                      <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Post Jobs Instantly</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Publish detailed job openings visible to thousands of job seekers immediately.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm flex items-start gap-3.5">
                      <div className="p-2 bg-violet-100 rounded-xl text-violet-600">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Manage Company Profiles</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Showcase your brand, logo, perks, and hiring culture.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm flex items-start gap-3.5">
                      <div className="p-2 bg-green-100 rounded-xl text-green-600">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Review & Shortlist Applicants</h4>
                        <p className="text-xs text-gray-500 mt-0.5">View candidate resumes, contact details, and update status in 1 click.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* RIGHT SIDE: Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Create Your ID 🚀
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Choose your role to customize your experience
                    </p>
                  </div>

                  {/* Auto-fill Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleQuickFill}
                    className="flex items-center gap-1.5 text-xs text-violet-700 bg-violet-50 border-violet-200 hover:bg-violet-100 self-start sm:self-center rounded-xl"
                  >
                    <Zap size={14} className="text-violet-600" />
                    Quick Fill Sample
                  </Button>
                </div>

                {/* ROLE SWITCH TABS */}
                <div className="mb-6">
                  <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    I want to register as:
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-semibold text-sm transition-all ${
                        role === "student"
                          ? "border-violet-600 bg-violet-50/80 text-violet-800 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-violet-200"
                      }`}
                    >
                      <Bot size={20} className={role === "student" ? "text-violet-600" : "text-gray-400"} />
                      <div className="text-left">
                        <div className="font-bold text-sm">Job Seeker</div>
                        <div className="text-[11px] font-normal text-gray-500">I want to find a job</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("recruiter")}
                      className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-semibold text-sm transition-all ${
                        role === "recruiter"
                          ? "border-orange-500 bg-orange-50/80 text-orange-800 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-orange-200"
                      }`}
                    >
                      <Building2 size={20} className={role === "recruiter" ? "text-orange-500" : "text-gray-400"} />
                      <div className="text-left">
                        <div className="font-bold text-sm">Recruiter</div>
                        <div className="text-[11px] font-normal text-gray-500">I want to hire talent</div>
                      </div>
                    </button>
                  </div>
                </div>

                <form onSubmit={submitHandler} className="space-y-4">
                  {/* FULL NAME & EMAIL */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Full Name *</Label>
                      <Input
                        type="text"
                        name="fullname"
                        value={input.fullname}
                        onChange={changeEventHandler}
                        placeholder={role === "recruiter" ? "Priya Patel" : "Rahul Sharma"}
                        className="mt-1.5 h-11 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-700">
                        {role === "recruiter" ? "Work Email Address *" : "Email Address *"}
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder={role === "recruiter" ? "recruiter@company.com" : "rahul@example.com"}
                        className="mt-1.5 h-11 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* PHONE NUMBER & PASSWORD */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Phone Number *</Label>
                      <Input
                        type="text"
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeEventHandler}
                        placeholder="+91 98765 43210"
                        className="mt-1.5 h-11 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Password *</Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={input.password}
                          onChange={changeEventHandler}
                          placeholder="Create a strong password"
                          className="h-11 rounded-xl pr-11"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ROLE SPECIFIC FIELDS */}
                  {role === "student" ? (
                    <>
                      {/* SKILLS */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Key Skills (Comma separated)</Label>
                        <Input
                          type="text"
                          name="skills"
                          value={input.skills}
                          onChange={changeEventHandler}
                          placeholder="e.g. React.js, TypeScript, Node.js, Python, Tailwind"
                          className="mt-1.5 h-11 rounded-xl"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                          Skills are used by our AI to calculate match scores on aggregated jobs.
                        </p>
                      </div>

                      {/* RESUME UPLOAD */}
                      <div className="p-4 bg-slate-50 border border-dashed border-gray-300 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                            <FileText size={20} />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-semibold text-gray-800">Upload Resume (Optional)</Label>
                            <p className="text-xs text-gray-500">PDF, DOC, or DOCX format</p>
                          </div>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={changeResumeHandler}
                            className="w-auto text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* RECRUITER COMPANY FIELDS */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Company Name *</Label>
                          <Input
                            type="text"
                            name="companyName"
                            value={input.companyName}
                            onChange={changeEventHandler}
                            placeholder="e.g. Microsoft, InnoTech Corp"
                            className="mt-1.5 h-11 rounded-xl"
                            required={role === "recruiter"}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Company Website</Label>
                          <Input
                            type="url"
                            name="companyWebsite"
                            value={input.companyWebsite}
                            onChange={changeEventHandler}
                            placeholder="https://company.com"
                            className="mt-1.5 h-11 rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Company Location</Label>
                        <Input
                          type="text"
                          name="companyLocation"
                          value={input.companyLocation}
                          onChange={changeEventHandler}
                          placeholder="e.g. Bangalore, Hyderabad, Remote"
                          className="mt-1.5 h-11 rounded-xl"
                        />
                      </div>
                    </>
                  )}

                  {/* PROFILE PICTURE */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Profile Photo (Optional)</Label>
                    <div className="mt-1.5 flex items-center gap-3 border rounded-xl p-2.5 bg-white">
                      <Upload className="text-violet-600 ml-2" size={18} />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="border-0 shadow-none text-xs cursor-pointer p-0 h-auto"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 rounded-xl text-base font-semibold shadow-lg mt-3 ${
                      role === "recruiter"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Setting Up Account...
                      </>
                    ) : (
                      <>
                        Create {role === "recruiter" ? "Recruiter" : "Job Seeker"} Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600">
                      Already registered on JobZing?{" "}
                      <Link to="/login" className="text-violet-600 font-bold hover:underline">
                        Sign In
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

export default Signup;
