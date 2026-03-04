import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Send,
  Clock,
  AlertCircle,
  RefreshCw,
  User,
  Calendar,
} from "lucide-react";

export default function PayoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payoutData, setPayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    fetchPayoutDetails();
  }, [id]);

  const fetchPayoutDetails = async () => {
    try {
      const { data } = await api.get(`/payouts/${id}`);
      setPayoutData(data);
    } catch (err) {
      setError("Failed to fetch payout details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionUrl, payload = {}) => {
    setActionLoading(true);
    try {
      await api.post(`/payouts/${id}/${actionUrl}`, payload);
      await fetchPayoutDetails();
      if (actionUrl === "reject") {
        setShowRejectInput(false);
        setRejectReason("");
      }
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${actionUrl}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500 font-medium">
            Loading payout details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !payoutData) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Error Loading Payout
        </h3>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    );
  }

  const { payout, audits } = payoutData;

  const getStatusStyles = (status) => {
    const styles = {
      Draft: "bg-gray-100 text-gray-800 ring-gray-200",
      Submitted: "bg-yellow-50 text-yellow-800 ring-yellow-200",
      Approved: "bg-green-50 text-green-800 ring-green-200",
      Rejected: "bg-red-50 text-red-800 ring-red-200",
    };
    return styles[status] || "bg-gray-100 text-gray-800 ring-gray-200";
  };

  const renderActionButtons = () => {
    if (showRejectInput) {
      return (
        <div className="flex flex-col gap-3 w-full lg:w-auto">
          <textarea
            required
            rows={2}
            placeholder="Reason for rejection (mandatory)..."
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border resize-none transition-all"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowRejectInput(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAction("reject", { reason: rejectReason })}
              disabled={actionLoading || !rejectReason.trim()}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-bold shadow-sm transition-all shadow-red-200"
            >
              <XCircle size={18} />
              Confirm Reject
            </button>
          </div>
        </div>
      );
    }

    if (user.role === "OPS" && payout.status === "Draft") {
      return (
        <button
          onClick={() => handleAction("submit")}
          disabled={actionLoading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold transition-all shadow-lg shadow-blue-200 w-full sm:w-auto"
        >
          {actionLoading ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <Send size={18} />
          )}
          Submit Payout
        </button>
      );
    }

    if (user.role === "FINANCE" && payout.status === "Submitted") {
      return (
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleAction("approve")}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 font-bold transition-all shadow-lg shadow-green-200"
          >
            {actionLoading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            Approve
          </button>
          <button
            onClick={() => setShowRejectInput(true)}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 bg-white text-red-600 border-2 border-red-100 px-6 py-2.5 rounded-xl hover:bg-red-50 disabled:opacity-50 font-bold transition-all"
          >
            <XCircle size={18} />
            Reject
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Payout #{payout._id.slice(-6).toUpperCase()}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ring-1 ring-inset ${getStatusStyles(payout.status)}`}
              >
                {payout.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Calendar size={14} /> Created on{" "}
              {new Date(payout.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center w-full md:w-auto">
          {renderActionButtons()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Payout Amount
                  </p>
                  <div className="flex items-baseline gap-1 text-4xl font-black text-blue-900">
                    <span className="text-2xl font-bold">₹</span>
                    {payout.amount?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="space-y-1 sm:text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Transfer Mode
                  </p>
                  <div className="inline-flex items-center px-4 py-1.5 bg-white rounded-lg border border-gray-100 text-sm font-black text-gray-800 shadow-sm">
                    {payout.mode}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2.5">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <User size={18} className="text-gray-600" />
                  </div>
                  Vendor Information
                </h3>

                {payout.vendor_id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                        Account Holder
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {payout.vendor_id.name}
                      </p>
                    </div>
                    {payout.vendor_id.upi_id && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          UPI ADDRESS
                        </p>
                        <p className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 inline-block">
                          {payout.vendor_id.upi_id}
                        </p>
                      </div>
                    )}
                    {payout.vendor_id.bank_account && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          Bank Account Number
                        </p>
                        <p className="text-sm font-bold text-gray-900 tracking-widest font-mono">
                          {payout.vendor_id.bank_account || "•••• •••• ••••"}
                        </p>
                      </div>
                    )}
                    {payout.vendor_id.ifsc && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          IFSC CODE
                        </p>
                        <p className="text-sm font-bold text-gray-900 tracking-wider uppercase">
                          {payout.vendor_id.ifsc}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 italic text-sm">
                    <AlertCircle size={18} />
                    Vendor information unavailable
                  </div>
                )}
              </div>

              {(payout.note ||
                (payout.decision_reason && payout.status === "Rejected")) && (
                <div className="grid grid-cols-1 gap-6 pt-8 border-t border-gray-100">
                  {payout.note && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                        Internal Reference Note
                      </p>
                      <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 text-sm text-yellow-900 leading-relaxed italic">
                        "{payout.note}"
                      </div>
                    </div>
                  )}
                  {payout.decision_reason && payout.status === "Rejected" && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                        Reason for Rejection
                      </p>
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 font-bold">
                        {payout.decision_reason}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Audit Trail */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2.5 mb-8">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Clock size={18} className="text-gray-600" />
              </div>
              Audit Trail
            </h3>

            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100" />

              <ul className="space-y-10 relative">
                {audits.map((audit) => {
                  let Icon = RefreshCw;
                  let iconBg = "bg-gray-100 text-gray-500 shadow-gray-100";
                  let borderCol = "border-gray-100";

                  if (audit.action === "CREATED") {
                    Icon = FileText;
                    iconBg = "bg-blue-100 text-blue-600 shadow-blue-100";
                    borderCol = "border-blue-50";
                  }
                  if (audit.action === "SUBMITTED") {
                    Icon = Send;
                    iconBg = "bg-yellow-100 text-yellow-600 shadow-yellow-100";
                    borderCol = "border-yellow-50";
                  }
                  if (audit.action === "APPROVED") {
                    Icon = CheckCircle;
                    iconBg = "bg-green-100 text-green-600 shadow-green-100";
                    borderCol = "border-green-50";
                  }
                  if (audit.action === "REJECTED") {
                    Icon = XCircle;
                    iconBg = "bg-red-100 text-red-600 shadow-red-100";
                    borderCol = "border-red-50";
                  }

                  return (
                    <li key={audit._id} className="relative pl-10">
                      <div
                        className={`absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center z-10 shadow-lg ${iconBg} ring-4 ring-white`}
                      >
                        <Icon size={14} />
                      </div>

                      <div
                        className={`p-4 rounded-2xl border ${borderCol} bg-white shadow-sm space-y-2`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs font-black uppercase text-gray-900 tracking-wider">
                            {audit.action}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                            {new Date(audit.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 rounded-full p-1 border border-gray-200">
                            <User size={10} className="text-gray-500" />
                          </div>
                          <p className="text-[11px] font-bold text-gray-600 truncate">
                            {audit.user_id?.email || "Unknown User"}
                          </p>
                        </div>

                        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">
                          {new Date(audit.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </p>
                      </div>
                    </li>
                  );
                })}

                {audits.length === 0 && (
                  <div className="text-center py-10 space-y-2 opacity-30">
                    <Clock size={40} className="mx-auto text-gray-300" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      No History Found
                    </p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
