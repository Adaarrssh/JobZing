import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addCompany, setSingleCompany } from "@/redux/companySlice";
import { Building2, ArrowLeft, Sparkles, ArrowRight } from "lucide-react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a company name.");
      return;
    }

    const newCompanyObj = {
      _id: `comp_${Date.now()}`,
      name: companyName,
      description: "Fast-growing organization empowering talented builders.",
      website: `https://${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      location: "Bangalore, India",
      logo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString(),
    };

    dispatch(addCompany(newCompanyObj));
    dispatch(setSingleCompany(newCompanyObj));

    // Try backend API if available
    try {
      await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log("Backend offline, company created in local demo state");
    }

    toast.success(`Company "${companyName}" registered! Now add details.`);
    navigate(`/admin/companies/${newCompanyObj._id}`);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/admin/companies")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-orange-600 mb-6 transition"
          >
            <ArrowLeft size={16} /> Back to Companies
          </button>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Name Your Company</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  What is the name of your organization or startup? You can update this later.
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Company Name *</Label>
              <Input
                type="text"
                className="mt-1.5 h-12 rounded-xl text-base"
                placeholder="e.g. Acme Technologies, Flipkart, Zeta"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && registerNewCompany()}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/companies")}
                className="rounded-xl font-semibold px-5"
              >
                Cancel
              </Button>
              <Button
                onClick={registerNewCompany}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold px-6 shadow-md"
              >
                Continue <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyCreate;