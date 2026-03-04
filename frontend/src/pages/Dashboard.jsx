import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Activity,
  ShieldCheck,
  Zap,
  ArrowRight,
  Wallet,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const actions = [
    {
      title: "Manage Payouts",
      desc: "View payout requests, check their statuses, and track detailed audit trails.",
      icon: Wallet,
      to: "/payouts",
      color: "blue",
      roles: ["OPS", "FINANCE"],
    },
    {
      title: "Vendor Directory",
      desc:
        user.role === "OPS"
          ? "Add new vendors and access their banking information."
          : "Access vendor directory and banking information securely.",
      icon: Users,
      to: "/vendors",
      color: "indigo",
      roles: ["OPS", "FINANCE"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl shadow-gray-200">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm border border-white/10">
            <Zap size={14} className="text-yellow-400" /> System Online &
            Verified
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {getGreeting()}, <br /> {user.email?.split("@")[0]}
          </h1>
          <p className="text-gray-400 font-medium text-lg leading-relaxed">
            Logged in as{" "}
            <span className="text-blue-400 font-black">#{user.role}</span>.
            {user.role === "OPS"
              ? " You have permission to draft vendor payments and manage merchant profiles."
              : " You have the authority to verify, approve or reject pending fund transfers."}
          </p>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shadow-blue-100">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Authentication Level
              </p>
              <p className="text-2xl font-black text-gray-900">
                {user.role} ACCESS
              </p>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[100%]" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
            <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
              <Activity size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Global System Connectivity
              </p>
              <p className="text-2xl font-black text-gray-900 uppercase">
                Operational
              </p>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[100%]" />
            </div>
          </div>
        </div>

        {/* Action Sidebar / Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 flex flex-col justify-center">
          <div className="space-y-2">
            <h4 className="text-lg font-black text-gray-900">Security Note</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              All actions on this dashboard are logged into the permanent audit
              trail. Ensure all vendor details are verified before submission.
            </p>
          </div>
          <div className="h-px w-full bg-gray-100" />
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} /> Real-time Updates Enabled
          </p>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className="group relative bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-100 transition-all overflow-hidden"
          >
            <div
              className={`bg-${action.color}-50 w-16 h-16 rounded-2xl flex items-center justify-center text-${action.color}-600 mb-8 border border-${action.color}-100 shadow-lg shadow-${action.color}-50 transition-all group-hover:scale-110`}
            >
              <action.icon size={32} />
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                {action.title}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                {action.desc}
              </p>
            </div>

            <div className="mt-10 flex items-center gap-2 text-sm font-black text-blue-600 uppercase tracking-widest">
              Access Module{" "}
              <ArrowRight
                size={18}
                className="translate-x-0 group-hover:translate-x-2 transition-transform"
              />
            </div>

            {/* Decorative arrow decoration */}
            <ArrowRight className="absolute -top-10 -right-10 w-40 h-40 text-blue-50/50 -rotate-45 group-hover:rotate-0 transition-all duration-700" />
          </Link>
        ))}
      </div>
    </div>
  );
}
