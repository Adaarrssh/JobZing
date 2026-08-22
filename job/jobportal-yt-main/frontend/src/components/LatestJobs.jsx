import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useSelector } from "react-redux";

import LatestJobCards from "./LatestJobCards";
import { Button } from "./ui/button";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Latest &<span className="text-violet-600"> Featured Jobs</span>
            </h2>

            <p className="mt-3 text-gray-500">
              Explore the newest opportunities from top companies across India.
            </p>
          </div>

          <Button
            onClick={() => navigate("/jobs")}
            className="mt-6 md:mt-0 bg-violet-600 hover:bg-violet-700"
          >
            View All Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Jobs */}

        {allJobs.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
            <BriefcaseBusiness className="h-16 w-16 text-gray-400" />

            <h3 className="mt-5 text-2xl font-semibold text-gray-700">
              No Jobs Available
            </h3>

            <p className="mt-2 text-gray-500">
              New opportunities will appear here soon.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {allJobs.slice(0, 6).map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
