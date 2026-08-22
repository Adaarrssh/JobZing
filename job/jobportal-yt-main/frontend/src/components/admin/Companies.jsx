import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { Building2, PlusCircle, Search, Sparkles } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* HEADER HERO */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Employer Company Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Registered Companies
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your organization profiles, logos, websites, and hiring locations.
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/companies/create")}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 py-6 font-bold text-sm shadow-md flex items-center gap-2 self-start sm:self-center shrink-0"
            >
              <PlusCircle size={18} />
              Register New Company
            </Button>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 h-10 rounded-xl border-gray-200 focus:border-orange-500"
                  placeholder="Filter by company name..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <span className="text-xs text-gray-500 font-medium">
                {companies.length} Registered Companies
              </span>
            </div>

            <CompaniesTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Companies;