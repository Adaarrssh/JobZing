import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import {
  Briefcase,
  PlusCircle,
  Search,
  Users,
  Building2,
  Sparkles,
} from "lucide-react";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const { companies } = useSelector((store) => store.company);

  // A recruiter only sees jobs created by their own ID / company
  const recruiterId = user?._id || "user_recruiter_1";
  const userCompanyName = user?.profile?.companyName?.toLowerCase() || "";

  const myPostedJobs = allJobs.filter((job) => {
    const isOwner = job?.created_by === recruiterId;
    const isCompOwner = userCompanyName && job?.company?.name?.toLowerCase().includes(userCompanyName);
    return isOwner || isCompOwner;
  });

  const totalApplicants = myPostedJobs.reduce(
    (acc, job) => acc + (job?.applications?.length || 0),
    0
  );

  const myCompanies = companies.filter((c) => c.created_by === recruiterId || c.name.toLowerCase().includes(userCompanyName));

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER HERO */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Private Recruiter Console
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                {user?.profile?.companyName || user?.fullname || "My Company"} Jobs & Pipeline
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing only openings and applicants belonging to your recruiter account.
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 py-6 font-bold text-sm shadow-md flex items-center gap-2 self-start sm:self-center shrink-0"
            >
              <PlusCircle size={18} />
              Post New Job
            </Button>
          </div>

          {/* STATS METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-orange-100 text-orange-600 rounded-2xl">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Active Postings</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{myPostedJobs.length}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-violet-100 text-violet-600 rounded-2xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Job Applicants</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalApplicants}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Company Profile</p>
                <h3 className="text-base font-extrabold text-gray-900 mt-0.5 truncate max-w-xs">
                  {user?.profile?.companyName || "Google Tech Hub"}
                </h3>
              </div>
            </div>
          </div>

          {/* SEARCH & TABLE SECTION */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 h-10 rounded-xl border-gray-200 focus:border-orange-500"
                  placeholder="Search in your posted jobs..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <span className="text-xs text-gray-500 font-medium self-start sm:self-center">
                Showing {myPostedJobs.length} job(s) posted by you
              </span>
            </div>

            <AdminJobsTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminJobs;