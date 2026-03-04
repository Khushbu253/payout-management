import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import {
  ArrowLeft,
  Save,
  IndianRupee,
  CreditCard,
  Send,
  Wallet,
  Tag,
  Info,
  ShieldCheck,
} from "lucide-react";

export default function CreatePayout() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    vendor_id: "",
    amount: "",
    mode: "UPI",
    note: "",
  });

  const [errors, setErrors] = useState({});

  // 🔹 Fetch Vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data } = await api.get("/vendors");
        setVendors(data.filter((v) => v.is_active));
      } catch (err) {
        console.error("Failed to load vendors", err);
      }
    };
    fetchVendors();
  }, []);

  // 🔹 Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.vendor_id) {
      newErrors.vendor_id = "Please select a vendor";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amountNum = Number(formData.amount);
      if (isNaN(amountNum)) {
        newErrors.amount = "Amount must be a number";
      } else if (amountNum <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
        newErrors.amount = "Maximum 2 decimal places allowed";
      }
    }

    if (!formData.mode) {
      newErrors.mode = "Please select transfer mode";
    }

    if (formData.note && formData.note.length > 200) {
      newErrors.note = "Note cannot exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post("/payouts", {
        ...formData,
        amount: Number(formData.amount),
      });
      navigate("/payouts");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to create payout");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Initiate New Payout
          </h1>
          <p className="text-sm text-gray-500 font-medium tracking-tight">
            Draft a secure transfer request for a registered merchant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow-xl shadow-gray-200/50 rounded-[2.5rem] border border-gray-100 p-8 md:p-12">
            {serverError && (
              <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100 uppercase tracking-widest text-center">
                <ShieldCheck size={18} /> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Select Vendor Section */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <CreditCard size={14} /> 1. Distribution Account
                </label>
                <div className="relative">
                  <select
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 text-sm font-bold transition-all focus:outline-none focus:bg-white cursor-pointer appearance-none ${
                      errors.vendor_id
                        ? "border-red-100 focus:border-red-500 text-red-900"
                        : "border-gray-50 focus:border-blue-600 text-gray-900"
                    }`}
                  >
                    <option value="" hidden>
                      Select Destination Vendor...
                    </option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  {errors.vendor_id && (
                    <p className="text-[10px] font-black text-red-500 mt-2 ml-2 uppercase tracking-wider">
                      {errors.vendor_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount & Mode Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                {/* Amount */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                    <IndianRupee size={14} /> 2. Transaction Volume
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                      ₹
                    </span>
                    <input
                      type="text"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-5 py-5 rounded-2xl bg-gray-50 border-2 text-2xl font-black transition-all focus:outline-none focus:bg-white ${
                        errors.amount
                          ? "border-red-100 focus:border-red-500 text-red-900"
                          : "border-gray-50 focus:border-blue-600 text-blue-900"
                      }`}
                    />
                    {errors.amount && (
                      <p className="text-[10px] font-black text-red-500 mt-2 ml-2 uppercase tracking-wider">
                        {errors.amount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mode */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                    <Send size={14} /> 3. Transfer Protocol
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["UPI", "IMPS", "NEFT"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "mode", value: mode },
                          })
                        }
                        className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          formData.mode === mode
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.05]"
                            : "bg-gray-50 border-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="space-y-4 pt-8 border-t border-gray-50">
                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <Tag size={14} /> 4. Internal Audit Reference
                </label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Enter a brief note about this transfer... (optional)"
                  value={formData.note}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 text-sm font-bold transition-all focus:outline-none focus:bg-white resize-none ${
                    errors.note
                      ? "border-red-100 focus:border-red-500 text-red-900"
                      : "border-gray-50 focus:border-blue-600 text-gray-900"
                  }`}
                />
                {errors.note && (
                  <p className="text-[10px] font-black text-red-500 mt-2 ml-2 uppercase tracking-wider">
                    {errors.note}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-5 rounded-3xl font-black text-sm hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-gray-200"
                >
                  <Save size={18} />
                  {loading ? "PROCESSING..." : "REGISTER DRAFT REQUEST"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-5 rounded-3xl font-black text-sm text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info / Summary Column */}
        <div className="space-y-8">
          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest">
                Selected Mode
              </p>
              <h3 className="text-3xl font-black tracking-tighter uppercase">
                {formData.mode} TRANSFER
              </h3>
            </div>
            <p className="text-sm text-blue-100 font-medium font-mono border-t border-blue-400/30 pt-4 relative z-10 leading-loose">
              {formData.mode === "UPI" &&
                "Processing typically happens within seconds. Maximum verified limit is ₹1,00,000 per request."}
              {formData.mode === "IMPS" &&
                "Instant real-time payment service. Available 24x7 including bank holidays."}
              {formData.mode === "NEFT" &&
                "Batch-based settlements. Typically takes 30 mins to 2 hours during banking hours."}
            </p>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full" />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-xl text-gray-400">
                <Info size={16} />
              </div>
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Workflow Policy
              </h4>
            </div>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              This request will be created in{" "}
              <span className="text-gray-900 font-black">DRAFT</span> status.
              You must explicitly click 'Submit for Approval' from the payout
              details page to notify the Finance department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
