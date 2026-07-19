import React from 'react';
import { 
  Zap, 
  Target, 
  Clock, 
  Trophy, 
  RefreshCw, 
  Flame, 
  Sparkles, 
  Keyboard 
} from 'lucide-react';
import { TypingStats } from '../types';

interface StatsPanelProps {
  stats: TypingStats;
  streak: number;
  xp: number;
  timerMode: 'up' | 'down';
  setTimerMode: (mode: 'up' | 'down') => void;
  timeLimit: number;
  setTimeLimit: (limit: number) => void;
  isFinished: boolean;
  onReset: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  streak,
  xp,
  timerMode,
  setTimerMode,
  timeLimit,
  setTimeLimit,
  isFinished,
  onReset,
}) => {
  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeTime = timerMode === 'up' 
    ? stats.elapsedSeconds 
    : Math.max(0, timeLimit - stats.elapsedSeconds);

  return (
    <div id="stats-panel-root" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 bg-white/90 dark:bg-dracula-card p-5 rounded-2xl border border-[#D0D4FC]/60 dark:border-dracula-selection shadow-xs backdrop-blur-md transition-all duration-200">
      
      {/* Words Per Minute */}
      <div id="stat-wpm" className="flex flex-col bg-slate-50/50 dark:bg-[#21222c] rounded-xl p-3 border border-slate-200/60 dark:border-dracula-selection/60 relative overflow-hidden group hover:border-yellow-400/60 dark:hover:border-dracula-yellow/60 transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full blur-xl group-hover:bg-yellow-500/10 transition-all pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5C7A] dark:text-[#a5afc8] font-display">
          <Zap size={14} className="text-yellow-500" />
          <span>Raw WPM</span>
        </div>
        <div className="text-2xl font-black text-[#1E1E2E] dark:text-dracula-foreground font-display mt-1 flex items-baseline gap-1">
          {stats.wpm}
          <span className="text-[10px] text-[#7C7C9A] dark:text-dracula-comment font-sans">wpm</span>
        </div>
      </div>

      {/* Net WPM */}
      <div id="stat-net-wpm" className="flex flex-col bg-slate-50/50 dark:bg-[#21222c] rounded-xl p-3 border border-slate-200/60 dark:border-dracula-selection/60 relative overflow-hidden group hover:border-indigo-400/60 dark:hover:border-dracula-purple/60 transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5C7A] dark:text-[#a5afc8] font-display">
          <Sparkles size={14} className="text-indigo-500 dark:text-dracula-purple animate-pulse" />
          <span>Net WPM</span>
        </div>
        <div className="text-2xl font-black text-indigo-600 dark:text-dracula-purple font-display mt-1 flex items-baseline gap-1">
          {stats.netWpm}
          <span className="text-[10px] text-[#7C7C9A] dark:text-dracula-comment font-sans">net</span>
        </div>
      </div>

      {/* Accuracy */}
      <div id="stat-accuracy" className={`flex flex-col bg-slate-50/50 dark:bg-[#21222c] rounded-xl p-3 border border-slate-200/60 dark:border-dracula-selection/60 relative overflow-hidden group transition-all ${
        stats.accuracy < 95 ? 'hover:border-red-400/60 dark:hover:border-dracula-red/60' : 'hover:border-emerald-400/60 dark:hover:border-dracula-green/60'
      }`}>
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5C7A] dark:text-[#a5afc8] font-display">
            <Target size={14} className={stats.accuracy < 95 ? 'text-red-500 dark:text-dracula-red' : 'text-emerald-500 dark:text-dracula-green'} />
            <span>Accuracy</span>
          </div>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
            stats.accuracy < 95 
              ? 'bg-red-50 dark:bg-dracula-red/15 text-red-600 dark:text-dracula-red border border-red-100 dark:border-dracula-red/30' 
              : 'bg-emerald-50 dark:bg-dracula-green/15 text-emerald-600 dark:text-dracula-green border border-emerald-100 dark:border-dracula-green/30'
          }`}>
            {stats.accuracy < 95 ? 'Gate: 95%' : 'Passing'}
          </span>
        </div>
        <div className={`text-2xl font-black font-display mt-1 ${
          stats.accuracy < 95 ? 'text-red-500 dark:text-dracula-red' : 'text-emerald-600 dark:text-dracula-green'
        }`}>
          {stats.accuracy}%
        </div>
      </div>

      {/* Flexible Interactive Timer */}
      <div id="stat-timer" className="flex flex-col bg-slate-50/50 dark:bg-[#21222c] rounded-xl p-3 border border-slate-200/60 dark:border-dracula-selection/60 relative overflow-hidden group hover:border-emerald-500/40 dark:hover:border-dracula-green/40 transition-all col-span-2 md:col-span-1 lg:col-span-1">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5C5C7A] dark:text-[#a5afc8] font-display">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-emerald-500 dark:text-dracula-green" />
            <span>Timer</span>
          </div>
          {/* Toggle buttons for timer mode */}
          <div className="flex bg-slate-100 dark:bg-dracula-bg rounded-md p-0.5 border border-slate-200 dark:border-dracula-selection">
            <button
              onClick={() => { setTimerMode('up'); onReset(); }}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                timerMode === 'up' ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs' : 'text-[#7C7C9A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground'
              }`}
              title="Count up stopwatch"
            >
              Up
            </button>
            <button
              onClick={() => { setTimerMode('down'); onReset(); }}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                timerMode === 'down' ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs' : 'text-[#7C7C9A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground'
              }`}
              title="Count down timer"
            >
              Down
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-black font-display text-[#1E1E2E] dark:text-dracula-foreground">
            {formatTime(activeTime)}
          </div>
          {timerMode === 'down' && !isFinished && (
            <select
              value={timeLimit}
              onChange={(e) => { setTimeLimit(Number(e.target.value)); onReset(); }}
              className="text-[10px] bg-white dark:bg-dracula-bg border border-slate-200 dark:border-dracula-selection rounded px-1.5 py-0.5 text-slate-700 dark:text-dracula-foreground focus:outline-none cursor-pointer"
            >
              <option value={60}>1m</option>
              <option value={120}>2m</option>
              <option value={180}>3m</option>
              <option value={300}>5m</option>
            </select>
          )}
        </div>
      </div>

      {/* Streak Tracker */}
      <div id="stat-streak" className="flex flex-col bg-slate-50/50 dark:bg-[#21222c] rounded-xl p-3 border border-slate-200/60 dark:border-dracula-selection/60 relative overflow-hidden group hover:border-orange-500/40 dark:hover:border-dracula-orange/40 transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-all pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5C7A] dark:text-[#a5afc8] font-display">
          <Flame size={14} className="text-orange-500 animate-bounce" />
          <span>Daily Streak</span>
        </div>
        <div className="text-2xl font-black font-display text-orange-600 dark:text-dracula-orange mt-1 flex items-baseline gap-1">
          {streak}
          <span className="text-[10px] text-[#7C7C9A] dark:text-dracula-comment font-sans">days</span>
        </div>
      </div>

      {/* Experience Points (XP) */}
      <div id="stat-xp" className="flex flex-col bg-slate-50/50 dark:bg-[#21222c] rounded-xl p-3 border border-slate-200/60 dark:border-dracula-selection/60 relative overflow-hidden group hover:border-purple-500/40 dark:hover:border-dracula-purple/40 transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5C7A] dark:text-[#a5afc8] font-display">
          <Trophy size={14} className="text-purple-500" />
          <span>Total XP</span>
        </div>
        <div className="text-2xl font-black font-display text-purple-600 dark:text-dracula-purple mt-1 flex items-baseline gap-1">
          {xp}
          <span className="text-[10px] text-[#7C7C9A] dark:text-dracula-comment font-sans">pts</span>
        </div>
      </div>

      {/* Backspace Count & Error count */}
      <div id="stat-precision" className="flex flex-col bg-slate-50/50 dark:bg-[#21222c] rounded-xl p-3 border border-slate-200/60 dark:border-dracula-selection/60 relative overflow-hidden group hover:border-rose-500/40 dark:hover:border-dracula-pink/40 transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5C7A] dark:text-[#a5afc8] font-display">
          <Keyboard size={14} className="text-rose-500 dark:text-dracula-pink" />
          <span>Retries</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-lg font-black font-display text-rose-500 dark:text-dracula-pink" title="Backspace count">
            ⌫ {stats.backspaceCount}
          </div>
          <button
            onClick={onReset}
            className="p-1 hover:bg-slate-100 dark:hover:bg-dracula-selection rounded text-slate-400 dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground transition-all cursor-pointer"
            title="Restart current test"
          >
            <RefreshCw size={12} className="hover:rotate-180 transition-all duration-300" />
          </button>
        </div>
      </div>

    </div>
  );
};
