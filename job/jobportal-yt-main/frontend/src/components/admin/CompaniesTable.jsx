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
import { Edit2, MoreHorizontal, Building2, Globe, MapPin, ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      const q = searchCompanyByText.toLowerCase();
      return (
        company?.name?.toLowerCase().includes(q) ||
        company?.location?.toLowerCase().includes(q)
      );
    });
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50 rounded-2xl">
          <TableRow>
            <TableHead className="font-bold text-gray-700">Company</TableHead>
            <TableHead className="font-bold text-gray-700">Location</TableHead>
            <TableHead className="font-bold text-gray-700">Website</TableHead>
            <TableHead className="font-bold text-gray-700">Registered Date</TableHead>
            <TableHead className="font-bold text-gray-700 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Building2 className="h-10 w-10 text-gray-300" />
                  <p className="font-semibold text-gray-700">No companies found</p>
                  <p className="text-xs text-gray-400">Click "Register New Company" to add an organization.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map((company) => (
              <TableRow key={company._id} className="hover:bg-slate-50/80 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 rounded-xl border border-gray-200 bg-violet-50">
                      {company.logo ? (
                        <AvatarImage src={company.logo} className="object-contain p-1" />
                      ) : (
                        <AvatarFallback className="font-bold text-violet-700 text-xs">
                          {company.name?.[0] || "C"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{company.name}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">{company.description}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <MapPin size={13} className="text-orange-500" />
                    <span>{company.location || "India"}</span>
                  </div>
                </TableCell>

                <TableCell>
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold hover:underline"
                    >
                      <Globe size={12} />
                      <span>{company.website.replace("https://", "")}</span>
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </TableCell>

                <TableCell className="text-xs text-gray-500">
                  {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "Recently"}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition">
                        <MoreHorizontal size={18} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-2 rounded-2xl shadow-lg border border-gray-100" align="end">
                      <div
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl cursor-pointer transition"
                      >
                        <Edit2 size={14} />
                        <span>Edit Details</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;