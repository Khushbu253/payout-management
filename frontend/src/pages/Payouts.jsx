import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  Banknote,
} from "lucide-react";

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const fetchPayouts = React.useCallback(async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/payouts?status=${statusFilter}` : "/payouts";
      const { data } = await api.get(url);
      setPayouts(data);
    } catch (error) {
      console.error("Failed to fetch payouts:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const getStatusStyles = (status) => {
    const styles = {
      Draft: "bg-gray-100 text-gray-700 ring-gray-200",
      Submitted: "bg-yellow-50 text-yellow-800 ring-yellow-200",
      Approved: "bg-green-50 text-green-800 ring-green-200",
      Rejected: "bg-red-50 text-red-800 ring-red-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700 ring-gray-200";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredPayouts = payouts.filter(
    (p) =>
      p.vendor_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header section with responsive alignment */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <CreditCard size={24} />
            </div>
            Payout Request History
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Track, manage and audit all outgoing fund transfers.
          </p>
        </div>

        {user.role === "OPS" && (
          <Link
            to="/payouts/new"
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            Create Payout
          </Link>
        )}
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col lg:row sm:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by vendor name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 font-medium text-sm outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto min-w-[200px]">
          <div className="bg-gray-50 p-3 rounded-2xl text-gray-400">
            <Filter size={18} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer flex-1"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Table / Mobile Card Grid */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Vendor / ID
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Amount & Mode
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Creation Date
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5)
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
                      <td className="px-8 py-6 text-right">
                        <div className="h-4 w-12 bg-gray-100 rounded ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-3 opacity-40">
                      <Banknote size={48} className="mx-auto text-gray-300" />
                      <p className="text-sm font-black text-gray-500 uppercase tracking-widest leading-tight">
                        No match found <br /> for the current filter
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr
                    key={payout._id}
                    className="group hover:bg-blue-50/30 transition-all cursor-default"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 leading-none mb-1">
                          {payout.vendor_id?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          ID: {payout._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-blue-900 leading-none mb-1">
                          {formatCurrency(payout.amount)}
                        </span>
                        <span className="inline-flex text-[9px] font-black text-blue-400 uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 rounded-md w-fit">
                          {payout.mode}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                        <Calendar size={14} className="opacity-40" />
                        {new Date(payout.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ring-1 ring-inset ${getStatusStyles(payout.status)}`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        to={`/payouts/${payout._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
                      >
                        Open <ChevronRight size={14} />
                      </Link>
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
                  <div className="h-6 w-1/3 bg-gray-100 rounded"></div>
                </div>
              ))
          ) : filteredPayouts.length === 0 ? (
            <div className="p-12 text-center opacity-40">
              <Banknote size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Nothing Found
              </p>
            </div>
          ) : (
            filteredPayouts.map((payout) => (
              <Link
                key={payout._id}
                to={`/payouts/${payout._id}`}
                className="p-6 space-y-4 active:bg-blue-50 transition-colors block"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Vendor Name
                    </span>
                    <span className="font-black text-lg text-gray-900 leading-tight">
                      {payout.vendor_id?.name || "Unknown"}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ring-1 ring-inset ${getStatusStyles(payout.status)}`}
                  >
                    {payout.status}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-dashed border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Amount
                    </span>
                    <span className="font-black text-blue-900">
                      {formatCurrency(payout.amount)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Mode
                    </span>
                    <span className="font-black text-gray-700 text-xs">
                      {payout.mode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-bold flex items-center gap-1">
                    <Calendar size={12} />{" "}
                    {new Date(payout.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 font-black flex items-center gap-1">
                    VIEW DETAILS <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
