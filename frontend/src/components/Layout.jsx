import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  ShieldCheck,
} from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Payout Requests", href: "/payouts", icon: CreditCard },
    { name: "Vendor Directory", href: "/vendors", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 p-6 bg-gray-50">
        <div className="flex-1 flex flex-col bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/10 overflow-hidden relative">
          {/* Logo Section */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-blue-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              PAYMASTER
            </span>
          </div>

          {/* User Profile Card */}
          <div className="mt-12 mb-10 relative z-10">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-0.5">
                    Verified Account
                  </p>
                  <p className="text-sm font-bold text-white truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-wider border border-white/10">
                  <ShieldCheck size={12} className="text-blue-400" />
                  {user?.role} ACCESS
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-3 relative z-10">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-4 mb-4">
              Operations
            </p>
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                    isActive
                      ? "bg-white text-gray-900 shadow-xl shadow-white/5 border border-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-colors ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-300"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer / Logout */}
          <div className="mt-auto relative z-10 pt-8 border-t border-white/5">
            <button
              onClick={() => logout()}
              className="group flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all outline-none"
            >
              <LogOut
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              SECURE LOGOUT
            </button>
          </div>

          {/* Background Highlight Decoration */}
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />
        </div>
      </aside>

      {/* MOBILE BAR - TOP */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 h-20">
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 p-2 rounded-xl text-white">
            <CreditCard size={20} />
          </div>
          <span className="font-black text-gray-900 tracking-tighter">
            PAYMASTER
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Navigation Indicator Bar (Visible on mobile dashboard) */}
          <div className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 text-[10px] font-black text-blue-600 uppercase tracking-wider">
            {user?.role}
          </div>

          <button
            onClick={() => logout()}
            className="text-gray-400 hover:text-red-600 transition-colors bg-gray-50 p-2 rounded-xl border border-gray-100"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION BAR (Bottom fixed) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 bg-gray-900 border border-white/10 rounded-[2rem] h-20 px-4 flex items-center justify-around shadow-2xl shadow-blue-900/30 backdrop-blur-sm">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${isActive ? "text-white translate-y-[-4px]" : "text-gray-500"}`}
            >
              <item.icon
                size={20}
                className={isActive ? "text-blue-400" : "text-gray-500"}
              />
              {isActive && (
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:pl-80 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-32 md:pb-16 md:pt-16 lg:px-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
