import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { ArrowLeft, Users, Briefcase, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { applicants } = useSelector((store) => store.application);
  const { allJobs, allAdminJobs } = useSelector((store) => store.job);

  const currentJob =
    allAdminJobs.find((j) => j._id === params.id) ||
    allJobs.find((j) => j._id === params.id);

  useEffect(() => {
    if (currentJob) {
      dispatch(setAllApplicants(currentJob));
    }

    // Also attempt backend API if available
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.log("Backend offline, loaded applicants from local memory");
      }
    };
    fetchAllApplicants();
  }, [dispatch, params.id, currentJob]);

  const applicantList = applicants?.applications || currentJob?.applications || [];

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-4">
              <button
                type="button"
                onClick={() => navigate("/admin/jobs")}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-orange-600 transition"
              >
                <ArrowLeft size={16} /> Back to Posted Jobs
              </button>

              <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={12} /> Candidate Review Portal
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Applicants for "{currentJob?.title || "Job Opening"}"
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {currentJob?.company?.name} • {currentJob?.location || "India"} •{" "}
                  <strong>{applicantList.length} Total Candidate(s)</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-2xl">
                <Users className="text-violet-600 h-5 w-5" />
                <span className="text-sm font-bold text-gray-800">
                  {applicantList.length} Applied
                </span>
              </div>
            </div>
          </div>

          {/* APPLICANTS TABLE CARD */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
            <ApplicantsTable jobId={params.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Applicants;