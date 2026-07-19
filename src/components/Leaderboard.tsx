import React, { useState, useEffect } from "react";
import { Trophy, Award, Activity, Calendar, RefreshCw, Star, ArrowUpRight, ShieldCheck, Cpu } from "lucide-react";

interface LeaderboardRecord {
  id: string;
  username: string;
  wpm: number;
  netWpm: number;
  accuracy: number;
  lang: string;
  levelTitle: string;
  timestamp: string;
}

interface LeaderboardProps {
  currentUser: { username: string; xp: number } | null;
  onNavigateToAuth: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, onNavigateToAuth }) => {
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to load leaderboard data");
      }
      const data = await response.json();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#D0D4FC]/60 p-6 md:p-8 shadow-xl font-sans text-[#1E1E2E]">
      
      {/* Header and Sync controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D0D4FC]/40 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-yellow-50 text-yellow-600 rounded-xl border border-yellow-200">
              <Trophy size={20} className="animate-pulse" />
            </span>
            <h2 className="text-xl font-black font-display tracking-tight text-[#1E1E2E]">Global Speed Leaderboard</h2>
          </div>
          <p className="text-xs text-[#5C5C7A] mt-1 font-sans">
            Real-time touch-typing metrics across all compiled curriculum paths.
          </p>
        </div>
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 active:scale-95 transition-all rounded-lg border border-[#D0D4FC]/50 cursor-pointer font-display shadow-xs disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Refreshing..." : "Refresh Scores"}</span>
        </button>
      </div>

      {/* Guest notice / auth callout */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border border-[#D0D4FC]/60 rounded-xl p-4.5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3">
            <span className="shrink-0 text-indigo-600 mt-0.5">
              <Cpu size={18} />
            </span>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-800 font-display">Unauthenticated Guest</h4>
              <p className="text-xs text-[#5C5C7A] mt-0.5">
                Log in or sign up to secure your high-precision WPM records on the global leaderboard!
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToAuth}
            className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-all active:scale-95 font-display"
          >
            Claim Your Identity
          </button>
        </div>
      )}

      {/* Leaderboard list or skeleton */}
      {loading ? (
        <div className="flex flex-col gap-2.5 py-8 items-center justify-center text-[#5C5C7A]">
          <RefreshCw size={24} className="animate-spin text-indigo-500" />
          <p className="text-xs font-semibold font-display">Retrieving master leaderboard...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-dashed border-red-200 bg-red-50/50 rounded-xl">
          <p className="text-xs font-bold text-red-600">Error: {error}</p>
          <button
            onClick={fetchLeaderboard}
            className="mt-3 px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded-lg text-xs"
          >
            Retry Fetch
          </button>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 border border-slate-200">
            <Award size={22} />
          </div>
          <h3 className="text-xs font-bold text-[#1E1E2E] font-display">No high scores recorded yet</h3>
          <p className="text-xs text-[#5C5C7A] max-w-sm mx-auto mt-1 font-sans">
            Be the first to complete a practice module and secure a spot on the global leaderboards!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D0D4FC]/40 text-[10px] uppercase font-black tracking-wider text-[#7C7C9A]">
                <th className="py-3 pl-3 w-12 text-center">Rank</th>
                <th className="py-3 pl-4">Typist</th>
                <th className="py-3 text-right">Net WPM</th>
                <th className="py-3 text-right">Accuracy</th>
                <th className="py-3 text-center">Language</th>
                <th className="py-3 pl-6">Module / Drill</th>
                <th className="py-3 text-right pr-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {records.map((record, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;
                const isCurrentUser = currentUser?.username === record.username;

                return (
                  <tr
                    key={record.id}
                    className={`transition-colors ${
                      isCurrentUser 
                        ? "bg-indigo-50/50 hover:bg-indigo-50 border-l-2 border-indigo-500 font-medium" 
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 pl-3 text-center font-display">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-400 text-white font-extrabold rounded-lg shadow-sm text-[11px]">
                          1st
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-300 text-slate-800 font-extrabold rounded-lg shadow-xs text-[11px]">
                          2nd
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-600 text-white font-extrabold rounded-lg shadow-xs text-[11px]">
                          3rd
                        </span>
                      ) : (
                        <span className="text-[#7C7C9A] font-bold">#{index + 1}</span>
                      )}
                    </td>

                    {/* Typist Name */}
                    <td className="py-3.5 pl-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold font-display ${isCurrentUser ? "text-indigo-700" : "text-[#1E1E2E]"}`}>
                          {record.username}
                        </span>
                        {isCurrentUser && (
                          <span className="bg-indigo-100 text-indigo-700 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider flex items-center gap-0.5">
                            <ShieldCheck size={8} /> You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Net WPM */}
                    <td className="py-3.5 text-right font-display">
                      <span className="text-[13px] font-black text-[#1E1E2E]">
                        {record.netWpm}
                      </span>
                      <span className="text-[10px] text-[#7C7C9A] ml-0.5">WPM</span>
                    </td>

                    {/* Accuracy */}
                    <td className="py-3.5 text-right font-sans">
                      <span className={`font-bold ${record.accuracy >= 98 ? "text-emerald-600" : "text-[#1E1E2E]"}`}>
                        {record.accuracy}%
                      </span>
                    </td>

                    {/* Language Badge */}
                    <td className="py-3.5 text-center font-display">
                      <span
                        className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          record.lang.toLowerCase() === "go"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200/50"
                            : "bg-yellow-50 text-yellow-800 border border-yellow-200/50"
                        }`}
                      >
                        {record.lang}
                      </span>
                    </td>

                    {/* Module Title */}
                    <td className="py-3.5 pl-6 text-[#5C5C7A] max-w-xs truncate font-sans">
                      {record.levelTitle}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 text-right pr-3 text-[#7C7C9A] font-sans text-[10px]">
                      {new Date(record.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
