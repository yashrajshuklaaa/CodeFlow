import React, { useState } from "react";
import { Shield, Lock, User, Sparkles, LogOut, ArrowRight, Star, Award, ShieldAlert, BadgeCheck } from "lucide-react";

interface AuthPageProps {
  currentUser: { username: string; xp: number; completedCount?: number } | null;
  onLoginSuccess: (token: string, user: { username: string; xp: number; completedCount?: number }) => void;
  onLogout: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ currentUser, onLoginSuccess, onLogout }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const endpoint = activeTab === "register" ? "/api/register" : "/api/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Success
      onLoginSuccess(data.token, data.user);
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    // Authenticated Profile View
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#D0D4FC]/60 p-6 md:p-8 shadow-xl text-[#1E1E2E] font-sans">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D0D4FC]/40 pb-6 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md shadow-indigo-100">
              <BadgeCheck size={26} />
            </div>
            <div>
              <p className="text-[10px] text-[#7C7C9A] uppercase font-black tracking-wider">SECURE SESSION ENCRYPTED</p>
              <h2 className="text-xl font-black font-display tracking-tight text-[#1E1E2E] flex items-center gap-2">
                {currentUser.username}
              </h2>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all rounded-lg border border-red-200 cursor-pointer font-display"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-6">
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] text-[#7C7C9A] uppercase font-black tracking-wider">Account Rank Experience</p>
              <p className="text-xl font-black font-display text-indigo-600 mt-0.5">{currentUser.xp} XP</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#7C7C9A] uppercase font-black tracking-wider">Completed Drills Submitted</p>
              <p className="text-xl font-black font-display text-emerald-600 mt-0.5">
                {currentUser.completedCount ?? 0} runs
              </p>
            </div>
          </div>
        </div>

        {/* Security & cloud storage explanation */}
        <div className="bg-slate-50 border border-[#D0D4FC]/40 rounded-xl p-4.5 text-xs text-[#5C5C7A] flex gap-3 leading-relaxed font-sans">
          <Shield className="shrink-0 text-indigo-500 mt-0.5" size={16} />
          <div>
            <strong className="text-[#1E1E2E] block mb-1 font-display">Cloud Persistence Activated</strong>
            All future high-speed typing sessions completed under this profile will automatically commit and stream to the global speed leaderboard. You can log in on any device to view, monitor, and compare your progression stats!
          </div>
        </div>
      </div>
    );
  }

  // Login / Register Form View
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#D0D4FC]/60 p-6 md:p-8 shadow-xl text-[#1E1E2E] font-sans max-w-md mx-auto">
      
      {/* Title & icon */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield size={24} />
        </div>
        <h2 className="text-lg font-black font-display tracking-tight text-[#1E1E2E]">CodeFlow Authentication</h2>
        <p className="text-xs text-[#5C5C7A] mt-1 font-sans">
          Sign up to submit your touch-typing speeds to the global leaderboard.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 mb-6 text-xs font-bold font-display">
        <button
          onClick={() => {
            setActiveTab("login");
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === "login" ? "bg-white text-[#1E1E2E] shadow-sm" : "text-[#7C7C9A] hover:text-[#1E1E2E]"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setActiveTab("register");
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === "register" ? "bg-white text-[#1E1E2E] shadow-sm" : "text-[#7C7C9A] hover:text-[#1E1E2E]"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Alert Error Box */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex gap-2 text-xs font-sans items-start">
          <ShieldAlert size={16} className="shrink-0 mt-0.5 text-red-500" />
          <div>{error}</div>
        </div>
      )}

      {/* Form submission */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div>
          <label className="block text-[#5C5C7A] font-black uppercase tracking-wider mb-1.5 font-display text-[9px]">
            Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User size={14} />
            </span>
            <input
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. SpeedCoder"
              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg py-2.5 pl-9 pr-3 transition outline-none font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#5C5C7A] font-black uppercase tracking-wider mb-1.5 font-display text-[9px]">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock size={14} />
            </span>
            <input
              type="password"
              required
              minLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg py-2.5 pl-9 pr-3 transition outline-none font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-black py-3 rounded-xl transition shadow-lg shadow-indigo-500/15 text-xs cursor-pointer flex items-center justify-center gap-1.5 font-display mt-2"
        >
          {loading ? (
            <span>Signing you in...</span>
          ) : (
            <>
              <span>{activeTab === "login" ? "Sign In" : "Register and Let's Go"}</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
