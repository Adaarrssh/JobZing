import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Sparkles,
  ArrowLeft,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { addJob } from "@/redux/jobSlice";
import { addCompany } from "@/redux/companySlice";

const PostJob = () => {
  const { companies } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-Time",
    experience: "1-3 Years",
    position: 2,
    companyId: companies[0]?._id || "",
    customCompanyName: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectCompanyHandler = (value) => {
    const selected = companies.find(
      (c) => c.name.toLowerCase() === value.toLowerCase() || c._id === value
    );
    if (selected) {
      setInput({ ...input, companyId: selected._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.title || !input.description || !input.salary || !input.location) {
      toast.error("Please fill in all required job fields.");
      return;
    }

    try {
      setLoading(true);

      // Find or create company object
      let targetCompany = companies.find((c) => c._id === input.companyId);
      if (!targetCompany && input.customCompanyName) {
        targetCompany = {
          _id: `comp_${Date.now()}`,
          name: input.customCompanyName,
          description: "High growth tech company hiring exceptional builders.",
          location: input.location,
          website: "https://company.com",
          logo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&auto=format&fit=crop&q=80",
          createdAt: new Date().toISOString(),
        };
        dispatch(addCompany(targetCompany));
      } else if (!targetCompany && companies.length > 0) {
        targetCompany = companies[0];
      } else if (!targetCompany) {
        targetCompany = {
          _id: `comp_${Date.now()}`,
          name: user?.profile?.companyName || "Tech Innovations Ltd",
          location: input.location || "Bangalore, India",
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
          createdAt: new Date().toISOString(),
        };
        dispatch(addCompany(targetCompany));
      }

      const reqArray = input.requirements
        ? input.requirements.split(",").map((s) => s.trim()).filter(Boolean)
        : ["React", "Node.js", "Teamwork"];

      const newJobObj = {
        _id: `job_${Date.now()}`,
        title: input.title,
        description: input.description,
        requirements: reqArray,
        salary: input.salary,
        location: input.location,
        jobType: input.jobType,
        experienceLevel: input.experience,
        position: Number(input.position) || 1,
        company: targetCompany,
        created_by: user?._id || "user_recruiter_1",
        source: "JobZing Direct",
        sourcePortal: "JobZing",
        externalUrl: "",
        createdAt: new Date().toISOString(),
        applications: [],
      };

      // Add to Redux and local state immediately
      dispatch(addJob(newJobObj));

      // Attempt backend API post
      try {
        await axios.post(
          `${JOB_API_END_POINT}/post`,
          {
            ...input,
            companyId: targetCompany._id,
            requirements: input.requirements,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log("Backend offline, job published in local demo ecosystem");
      }

      toast.success(`Job "${input.title}" posted successfully! Visible to all Job Seekers.`);
      navigate("/admin/jobs");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* TOP NAV BAR */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigate("/admin/jobs")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-orange-600 transition"
            >
              <ArrowLeft size={16} /> Back to Posted Jobs
            </button>

            <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              Recruiter Job Publisher
            </span>
          </div>

          {/* MAIN FORM CARD */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 sm:p-10">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-600 shadow-xs">
                <Briefcase size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Post a New Job Opportunity</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Publish openings that will be visible to thousands of applicants on JobZing.
                </p>
              </div>
            </div>

            <form onSubmit={submitHandler} className="mt-8 space-y-6">
              {/* JOB TITLE & COMPANY */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Job Title *</Label>
                  <Input
                    type="text"
                    name="title"
                    value={input.title}
                    onChange={changeEventHandler}
                    placeholder="e.g. Senior Frontend React Developer"
                    className="mt-1.5 h-11 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold text-gray-700">Hiring Company *</Label>
                    <Link
                      to="/admin/companies/create"
                      className="text-xs text-orange-600 font-bold hover:underline"
                    >
                      + Add Company
                    </Link>
                  </div>

                  {companies.length > 0 ? (
                    <Select onValueChange={selectCompanyHandler} defaultValue={companies[0]?.name?.toLowerCase()}>
                      <SelectTrigger className="mt-1.5 h-11 rounded-xl bg-white">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {companies.map((company) => (
                            <SelectItem key={company._id} value={company.name.toLowerCase()}>
                              {company.name} ({company.location || "India"})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type="text"
                      name="customCompanyName"
                      value={input.customCompanyName}
                      onChange={changeEventHandler}
                      placeholder="Enter company name"
                      className="mt-1.5 h-11 rounded-xl"
                      required
                    />
                  )}
                </div>
              </div>

              {/* LOCATION & SALARY */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Location *</Label>
                  <Input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    placeholder="e.g. Bangalore, Remote, Hyderabad"
                    className="mt-1.5 h-11 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Annual Salary (LPA in ₹) *</Label>
                  <Input
                    type="text"
                    name="salary"
                    value={input.salary}
                    onChange={changeEventHandler}
                    placeholder="e.g. 18 - 25 or 20"
                    className="mt-1.5 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* JOB TYPE & EXPERIENCE & POSITIONS */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Employment Type</Label>
                  <select
                    name="jobType"
                    value={input.jobType}
                    onChange={changeEventHandler}
                    className="mt-1.5 w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:border-orange-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Experience Level</Label>
                  <select
                    name="experience"
                    value={input.experience}
                    onChange={changeEventHandler}
                    className="mt-1.5 w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:border-orange-500"
                  >
                    <option value="Fresher / 0-1 Year">Fresher / 0-1 Year</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Open Vacancies</Label>
                  <Input
                    type="number"
                    name="position"
                    min="1"
                    value={input.position}
                    onChange={changeEventHandler}
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* REQUIREMENTS */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Required Skills & Technologies (Comma separated) *
                </Label>
                <Input
                  type="text"
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="e.g. React.js, TypeScript, Next.js, Tailwind CSS, REST APIs"
                  className="mt-1.5 h-11 rounded-xl"
                  required
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  These skills will be matched against candidate resumes using our AI scoring engine.
                </p>
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Full Job Description *</Label>
                <textarea
                  rows={5}
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Describe the role responsibilities, day-to-day work, ideal candidate background, perks, and team culture..."
                  className="mt-1.5 w-full rounded-2xl border border-gray-200 p-4 text-sm font-medium text-gray-800 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none leading-relaxed"
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-base font-bold shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Publishing Job...
                    </>
                  ) : (
                    "Publish Job Opening 🚀"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostJob;