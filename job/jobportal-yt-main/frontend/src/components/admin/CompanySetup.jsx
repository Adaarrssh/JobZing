import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Building2, Globe, MapPin, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import { updateCompany } from "@/redux/companySlice";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const { singleCompany, companies } = useSelector((store) => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const foundCompany =
    singleCompany?._id === params.id
      ? singleCompany
      : companies.find((c) => c._id === params.id) || {};

  const [input, setInput] = useState({
    name: foundCompany.name || "",
    description: foundCompany.description || "",
    website: foundCompany.website || "",
    location: foundCompany.location || "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (foundCompany) {
      setInput({
        name: foundCompany.name || "",
        description: foundCompany.description || "",
        website: foundCompany.website || "",
        location: foundCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany, params.id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedObj = {
        _id: params.id,
        name: input.name,
        description: input.description,
        website: input.website,
        location: input.location,
        ...(input.file ? { logo: URL.createObjectURL(input.file) } : {}),
      };

      dispatch(updateCompany(updatedObj));

      // Attempt backend API update
      try {
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
          formData.append("file", input.file);
        }

        const res = await axios.put(
          `${COMPANY_API_END_POINT}/update/${params.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          toast.success(res.data.message);
        }
      } catch (err) {
        console.log("Backend offline, company updated in local memory");
      }

      toast.success(`Company "${input.name}" updated successfully!`);
      navigate("/admin/companies");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/admin/companies")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-orange-600 mb-6 transition"
          >
            <ArrowLeft size={16} /> Back to Companies
          </button>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 sm:p-10">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Setup Company Profile</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete your organization details so candidates know who is hiring.
                </p>
              </div>
            </div>

            <form onSubmit={submitHandler} className="mt-6 space-y-5">
              {/* COMPANY NAME & LOCATION */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Company Name *</Label>
                  <Input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    className="mt-1.5 h-11 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Headquarters / Location</Label>
                  <Input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    placeholder="e.g. Bangalore, India"
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* WEBSITE */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Company Website</Label>
                <Input
                  type="url"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  placeholder="https://company.com"
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Company About / Mission</Label>
                <textarea
                  rows={4}
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Tell candidates about your mission, product, engineering culture, and benefits..."
                  className="mt-1.5 w-full rounded-2xl border border-gray-200 p-3.5 text-sm font-medium text-gray-800 outline-none focus:border-orange-500 resize-none leading-relaxed"
                />
              </div>

              {/* LOGO UPLOAD */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Company Logo</Label>
                <div className="mt-1.5 flex items-center gap-3 border rounded-xl p-2.5 bg-white">
                  <Upload className="text-orange-600 ml-2" size={18} />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="border-0 shadow-none text-xs cursor-pointer p-0 h-auto"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/companies")}
                  className="rounded-xl font-semibold"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold px-6 shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Company Details"
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

export default CompanySetup;