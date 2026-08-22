import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Eye,
  MoreHorizontal,
  Users,
  BriefcaseBusiness,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const AdminJobsTable = () => {
  const { allJobs, searchJobByText } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const recruiterId = user?._id || "user_recruiter_1";
  const userCompanyName = user?.profile?.companyName?.toLowerCase() || "";

  // A recruiter only sees jobs created by their account / company
  const myJobs = allJobs.filter((job) => {
    const isOwner = job?.created_by === recruiterId;
    const isCompOwner = userCompanyName && job?.company?.name?.toLowerCase().includes(userCompanyName);
    return isOwner || isCompOwner;
  });

  const [filterJobs, setFilterJobs] = useState(myJobs);

  useEffect(() => {
    const filtered = myJobs.filter((job) => {
      if (!searchJobByText) return true;
      const q = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(q) ||
        job?.company?.name?.toLowerCase().includes(q) ||
        job?.location?.toLowerCase().includes(q)
      );
    });
    setFilterJobs(filtered);
  }, [allJobs, searchJobByText, recruiterId, userCompanyName]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50 rounded-2xl">
          <TableRow>
            <TableHead className="font-bold text-gray-700">Company</TableHead>
            <TableHead className="font-bold text-gray-700">Job Title</TableHead>
            <TableHead className="font-bold text-gray-700">Location & Type</TableHead>
            <TableHead className="font-bold text-gray-700">Salary</TableHead>
            <TableHead className="font-bold text-gray-700">Applicants</TableHead>
            <TableHead className="font-bold text-gray-700">Posted Date</TableHead>
            <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <BriefcaseBusiness className="h-10 w-10 text-gray-300" />
                  <p className="font-semibold text-gray-700">You haven't posted any jobs yet</p>
                  <p className="text-xs text-gray-400">
                    Jobs posted by you will appear here along with candidate applications.
                  </p>
                  <Link to="/admin/jobs/create" className="mt-2">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold gap-1.5">
                      <PlusCircle size={14} /> Post Your First Job
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => {
              const applicantCount = job?.applications?.length || 0;
              return (
                <TableRow key={job._id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl border border-gray-200 bg-violet-50">
                        {job?.company?.logo ? (
                          <AvatarImage src={job.company.logo} className="object-contain p-1" />
                        ) : (
                          <AvatarFallback className="font-bold text-violet-700 text-xs">
                            {job?.company?.name?.[0] || "C"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{job?.company?.name || "My Company"}</div>
                        <div className="text-[11px] text-gray-400 font-medium">{job?.source || "JobZing Direct"}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div
                      className="font-semibold text-gray-900 text-sm hover:text-orange-600 transition cursor-pointer"
                      onClick={() => navigate(`/description/${job._id}`)}
                    >
                      {job?.title}
                    </div>
                    <div className="text-xs text-gray-500">{job?.position || 1} open position(s)</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-medium text-gray-700">{job?.location || "India"}</div>
                    <Badge variant="outline" className="mt-0.5 text-[10px] bg-slate-100 text-slate-700 border-0">
                      {job?.jobType || "Full-Time"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹ {job?.salary} LPA
                    </span>
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className={`rounded-xl text-xs font-bold gap-1.5 ${
                        applicantCount > 0
                          ? "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
                          : "text-gray-500"
                      }`}
                    >
                      <Users size={13} />
                      {applicantCount} {applicantCount === 1 ? "Applicant" : "Applicants"}
                    </Button>
                  </TableCell>

                  <TableCell className="text-xs text-gray-500">
                    {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition">
                          <MoreHorizontal size={18} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-44 p-2 rounded-2xl shadow-lg border border-gray-100" align="end">
                        <div
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl cursor-pointer transition"
                        >
                          <Eye size={14} />
                          <span>View Applicants ({applicantCount})</span>
                        </div>
                        <div
                          onClick={() => navigate(`/description/${job._id}`)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl cursor-pointer transition mt-1"
                        >
                          <ExternalLink size={14} />
                          <span>Preview Job Page</span>
                        </div>
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

export default AdminJobsTable;