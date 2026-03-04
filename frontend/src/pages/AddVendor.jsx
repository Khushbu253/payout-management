import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import {
  ArrowLeft,
  Save,
  Building2,
  Globe,
  CreditCard,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export default function AddVendor() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    upi_id: "",
    bank_account: "",
    ifsc: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Regex Patterns
  const patterns = {
    name: /^[A-Za-z\s]{2,50}$/,
    upi: /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/,
    bankAccount: /^[0-9]{9,18}$/,
    ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  };

  // ✅ Full Form Validation
  const validateForm = () => {
    const newErrors = {};

    const trimmedData = {
      name: formData.name.trim(),
      upi_id: formData.upi_id.trim(),
      bank_account: formData.bank_account.trim(),
      ifsc: formData.ifsc.trim(),
    };

    if (!trimmedData.name) {
      newErrors.name = "Vendor name is required";
    } else if (!patterns.name.test(trimmedData.name)) {
      newErrors.name =
        "Name must contain only letters and spaces (2-50 characters)";
    }

    if (trimmedData.upi_id) {
      if (!patterns.upi.test(trimmedData.upi_id)) {
        newErrors.upi_id = "Invalid UPI ID format (example@upi)";
      }
    }

    if (trimmedData.bank_account) {
      if (!patterns.bankAccount.test(trimmedData.bank_account)) {
        newErrors.bank_account = "Bank account must be 9-18 digits only";
      }
    }

    if (trimmedData.ifsc) {
      if (!patterns.ifsc.test(trimmedData.ifsc)) {
        newErrors.ifsc = "Invalid IFSC format (e.g. HDFC0001234)";
      }
    }

    if (
      !trimmedData.upi_id &&
      (!trimmedData.bank_account || !trimmedData.ifsc)
    ) {
      newErrors.payment = "Provide either UPI OR Bank Account + IFSC";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "ifsc") updatedValue = value.toUpperCase();

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: "", payment: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post("/vendors", { ...formData, name: formData.name.trim() });
      navigate("/vendors");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to add vendor");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
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
            Register New Vendor
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Onboard a merchant to the central payout system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-xl shadow-gray-200/50 rounded-[2.5rem] border border-gray-100 p-8 md:p-12">
            {serverError && (
              <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100">
                <ShieldCheck size={18} /> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Section */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <Building2 size={14} /> Basic Information
                </label>
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Merchant / Vendor Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 text-sm font-bold transition-all focus:outline-none focus:bg-white ${
                      errors.name
                        ? "border-red-100 focus:border-red-500 text-red-900"
                        : "border-gray-50 focus:border-blue-600 text-gray-900"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[10px] font-black text-red-500 mt-2 ml-2 uppercase tracking-wider">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="space-y-6 pt-8 border-t border-gray-50">
                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <Globe size={14} /> Payment Destination
                </label>

                {/* UPI Option */}
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <span className="text-sm font-black italic">@</span>
                  </div>
                  <input
                    type="text"
                    name="upi_id"
                    placeholder="UPI ID (e.g., username@bank)"
                    value={formData.upi_id}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-2 text-sm font-bold transition-all focus:outline-none focus:bg-white ${
                      errors.upi_id
                        ? "border-red-100 focus:border-red-500"
                        : "border-gray-50 focus:border-blue-600"
                    }`}
                  />
                  {errors.upi_id && (
                    <p className="text-[10px] font-black text-red-500 mt-2 ml-2 uppercase tracking-wider">
                      {errors.upi_id}
                    </p>
                  )}
                </div>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="h-px bg-gray-100 flex-1"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    OR BANK TRANSFER
                  </span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                {/* Bank Details Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <CreditCard
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="bank_account"
                      placeholder="Account Number"
                      value={formData.bank_account}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-2 text-sm font-bold transition-all focus:outline-none focus:bg-white ${
                        errors.bank_account
                          ? "border-red-100 focus:border-red-500"
                          : "border-gray-50 focus:border-blue-600"
                      }`}
                    />
                    {errors.bank_account && (
                      <p className="text-[10px] font-black text-red-500 mt-2 ml-2 uppercase tracking-wider">
                        {errors.bank_account}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Landmark
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="ifsc"
                      placeholder="IFSC Code"
                      value={formData.ifsc}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-2 text-sm font-bold transition-all focus:outline-none focus:bg-white ${
                        errors.ifsc
                          ? "border-red-100 focus:border-red-500"
                          : "border-gray-50 focus:border-blue-600"
                      }`}
                    />
                    {errors.ifsc && (
                      <p className="text-[10px] font-black text-red-500 mt-2 ml-2 uppercase tracking-wider">
                        {errors.ifsc}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {errors.payment && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-[11px] font-black text-red-600 uppercase tracking-widest text-center">
                  ⚠️ {errors.payment}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-200"
                >
                  <Save size={18} />
                  {loading ? "PROCESSING..." : "REGISTER VENDOR"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 rounded-3xl font-black text-sm text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-gray-200">
            <h3 className="text-xl font-black tracking-tight">
              Onboarding Guide
            </h3>
            <ul className="space-y-4">
              {[
                "Ensure the account name matches the bank records.",
                "Double-check the IFSC for RTGS/NEFT eligibility.",
                "UPI IDs are preferred for instant settlements.",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-gray-400 font-medium"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-full text-blue-600">
              <ShieldCheck size={32} />
            </div>
            <p className="text-xs font-black text-gray-900 uppercase tracking-widest leading-relaxed">
              Security Policy <br />{" "}
              <span className="text-gray-400 lowercase font-bold tracking-normal">
                All financial credentials are encrypted.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
