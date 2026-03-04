import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  Search,
  Plus,
  User,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await api.get("/vendors");
      setVendors(data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.upi_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Building2 size={24} />
            </div>
            Vendor Directory
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manage your registered merchants and bank payment details.
          </p>
        </div>

        {user.role === "OPS" && (
          <Link
            to="/vendors/new"
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            Add New Vendor
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by vendor name or UPI ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 font-medium text-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* Main List / Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Merchant Name
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  UPI Address
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Bank Details
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6">
                        <div className="h-4 w-32 bg-gray-100 rounded"></div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-4 w-24 bg-gray-100 rounded"></div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-4 w-24 bg-gray-100 rounded"></div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-4 w-16 bg-gray-100 rounded"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto space-y-3 opacity-40">
                      <Building2 size={48} className="mx-auto text-gray-300" />
                      <p className="text-sm font-black text-gray-500 uppercase tracking-widest leading-tight">
                        No vendors found <br /> matching your search
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="hover:bg-blue-50/30 transition-all cursor-default"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-400">
                          <User size={16} />
                        </div>
                        <span className="font-black text-gray-900">
                          {vendor.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {vendor.upi_id || "No UPI Provided"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 tracking-widest font-mono uppercase">
                          {vendor.bank_account || "—"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                          IFSC: {vendor.ifsc || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {vendor.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase ring-1 ring-inset ring-green-100">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase ring-1 ring-inset ring-red-100">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden grid grid-cols-1 divide-y divide-gray-50">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-6 space-y-4 animate-pulse">
                  <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                  <div className="h-4 w-1/3 bg-gray-100 rounded"></div>
                </div>
              ))
          ) : filteredVendors.length === 0 ? (
            <div className="p-12 text-center opacity-40">
              <Building2 size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                No Vendors Found
              </p>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div key={vendor._id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-xl text-gray-400">
                      <User size={20} />
                    </div>
                    <span className="font-black text-lg text-gray-900">
                      {vendor.name}
                    </span>
                  </div>
                  {vendor.is_active ? (
                    <div className="bg-green-500 h-2 w-2 rounded-full ring-4 ring-green-50"></div>
                  ) : (
                    <div className="bg-red-500 h-2 w-2 rounded-full ring-4 ring-red-50"></div>
                  )}
                </div>

                <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                      Payment Destination
                    </span>
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {vendor.upi_id || "No UPI ID Registered"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                        Account Number
                      </span>
                      <span className="text-sm font-black text-gray-900 tracking-tighter uppercase">
                        {vendor.bank_account || "—"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                        IFSC Code
                      </span>
                      <span className="text-sm font-black text-gray-900 tracking-tighter uppercase">
                        {vendor.ifsc || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest ${vendor.is_active ? "text-green-600" : "text-red-600"}`}
                  >
                    {vendor.is_active
                      ? "Active Verification"
                      : "Suspended Account"}
                  </span>
                  <button className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 opacity-50 cursor-not-allowed">
                    Manage <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
