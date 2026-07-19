import React from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Terminal, 
  Play, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Language, Level, UserProgress } from '../types';

interface SidebarProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  levels: Level[];
  activeLevelId: number;
  setActiveLevelId: (id: number) => void;
  progress: UserProgress;
  onResetTest: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentLanguage,
  setLanguage,
  levels,
  activeLevelId,
  setActiveLevelId,
  progress,
  onResetTest,
}) => {
  // Check if a level is unlocked
  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    const completedList = progress.completedLevels[currentLanguage] || [];
    return completedList.includes(levelId - 1);
  };

  // Check if a level is completed
  const isLevelCompleted = (levelId: number) => {
    const completedList = progress.completedLevels[currentLanguage] || [];
    return completedList.includes(levelId);
  };

  // Calculate percentage of levels completed
  const completedCount = progress.completedLevels[currentLanguage]?.length || 0;
  const progressPercent = Math.min(100, Math.round((completedCount / levels.length) * 100));

  return (
    <div id="sidebar-root" className="flex flex-col gap-5 w-full h-full lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pr-0 lg:pr-1">
      
      {/* Language Selector Card */}
      <div id="language-selector" className="bg-white/90 dark:bg-dracula-card rounded-2xl border border-[#D0D4FC]/60 dark:border-dracula-selection p-4 shadow-xs backdrop-blur-md transition-all duration-200">
        <h3 className="text-xs font-bold text-[#4F4F6A] dark:text-dracula-purple tracking-wider uppercase mb-3 flex items-center gap-1.5 font-display">
          <Terminal size={14} className="text-indigo-600 dark:text-dracula-purple" />
          <span>Select Language</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Go Lang Option */}
          <button
            onClick={() => {
              if (currentLanguage !== 'go') {
                setLanguage('go');
                onResetTest();
              }
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 relative cursor-pointer font-display ${
              currentLanguage === 'go'
                ? 'bg-indigo-50/80 dark:bg-dracula-purple/15 border-indigo-500 dark:border-dracula-purple text-indigo-700 dark:text-dracula-purple shadow-xs'
                : 'bg-slate-50/50 dark:bg-[#21222c]/50 border-slate-200 dark:border-dracula-selection text-[#5C5C7A] dark:text-[#a5afc8] hover:bg-slate-50 dark:hover:bg-dracula-selection hover:text-[#1E1E2E] dark:hover:text-dracula-foreground'
            }`}
          >
            <span className="text-lg font-bold tracking-tight">Go</span>
            <span className="text-[9px] text-[#7C7C9A] dark:text-dracula-comment mt-0.5 font-sans">Golang Path</span>
            {currentLanguage === 'go' && (
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 dark:bg-dracula-purple rounded-full animate-ping" />
            )}
          </button>

          {/* Python Option */}
          <button
            onClick={() => {
              if (currentLanguage !== 'python') {
                setLanguage('python');
                onResetTest();
              }
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 relative cursor-pointer font-display ${
              currentLanguage === 'python'
                ? 'bg-yellow-50/60 dark:bg-dracula-yellow/15 border-yellow-500 dark:border-dracula-yellow text-yellow-800 dark:text-dracula-yellow shadow-xs'
                : 'bg-slate-50/50 dark:bg-[#21222c]/50 border-slate-200 dark:border-dracula-selection text-[#5C5C7A] dark:text-[#a5afc8] hover:bg-slate-50 dark:hover:bg-dracula-selection hover:text-[#1E1E2E] dark:hover:text-dracula-foreground'
            }`}
          >
            <span className="text-lg font-bold tracking-tight">Python</span>
            <span className="text-[9px] text-[#7C7C9A] dark:text-dracula-comment mt-0.5 font-sans">Scripting Path</span>
            {currentLanguage === 'python' && (
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-500 dark:bg-dracula-yellow rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div id="sidebar-progress" className="bg-white/90 dark:bg-dracula-card rounded-2xl border border-[#D0D4FC]/60 dark:border-dracula-selection p-4 shadow-xs relative overflow-hidden backdrop-blur-md transition-all duration-200">
        <div className="absolute top-0 right-0 p-2 text-indigo-100 dark:text-dracula-comment">
          <Award size={48} className="opacity-40 dark:opacity-20" />
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-[#4F4E75] dark:text-dracula-purple font-sans">Overall Path Progress</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-dracula-green font-display">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-[#21222c] rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-dracula-selection">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 dark:from-dracula-purple dark:to-dracula-green h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2.5 text-[10px] text-[#7C7C9A] dark:text-dracula-comment font-sans">
          <span>{completedCount} of {levels.length} Complete</span>
          <span className="flex items-center gap-1">
            <Sparkles size={10} className="text-yellow-500 dark:text-dracula-yellow" />
            Level Gated &gt;95% Acc
          </span>
        </div>
      </div>

      {/* Levels List Container */}
      <div id="sidebar-levels-list" className="bg-white/90 dark:bg-dracula-card rounded-2xl border border-[#D0D4FC]/60 dark:border-dracula-selection p-4 shadow-xs flex-1 flex flex-col min-h-0 backdrop-blur-md transition-all duration-200">
        <h3 className="text-xs font-bold text-[#4F4F6A] dark:text-dracula-purple tracking-wider uppercase mb-3 flex items-center gap-1.5 font-display">
          <Terminal size={14} className="text-emerald-600 dark:text-dracula-green" />
          <span>Curriculum Path ({levels.length} Levels)</span>
        </h3>
        
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] lg:max-h-none pr-1 custom-scrollbar">
          {levels.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.id);
            const completed = isLevelCompleted(lvl.id);
            const isActive = activeLevelId === lvl.id;

            return (
              <button
                key={lvl.id}
                disabled={!unlocked}
                onClick={() => {
                  if (unlocked) {
                    setActiveLevelId(lvl.id);
                    onResetTest();
                  }
                }}
                className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 dark:bg-dracula-purple border-indigo-600 dark:border-dracula-purple text-white dark:text-dracula-card shadow-xs font-black'
                    : unlocked
                      ? 'bg-white/75 dark:bg-[#21222c] border-[#D0D4FC]/40 dark:border-dracula-selection/60 text-[#1E1E2E] dark:text-dracula-foreground hover:bg-white dark:hover:bg-dracula-selection hover:border-indigo-400 dark:hover:border-dracula-purple cursor-pointer font-sans'
                      : 'bg-slate-100/50 dark:bg-[#1a1b22] border-slate-200 dark:border-dracula-selection text-slate-400 dark:text-dracula-comment cursor-not-allowed opacity-40 font-sans'
                }`}
              >
                {/* Check / Lock / Play status circle */}
                <div className="mt-0.5">
                  {completed ? (
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isActive 
                        ? 'bg-white/20 dark:bg-dracula-card/20 text-white dark:text-dracula-green border-white/40 dark:border-dracula-green/40' 
                        : 'bg-emerald-50 dark:bg-dracula-green/15 text-emerald-600 dark:text-dracula-green border-emerald-200 dark:border-dracula-green/30'
                    }`}>
                      <CheckCircle2 size={12} />
                    </div>
                  ) : !unlocked ? (
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#21222c] text-slate-400 dark:text-dracula-comment flex items-center justify-center border border-slate-200 dark:border-dracula-selection">
                      <Lock size={10} />
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isActive 
                        ? 'bg-white dark:bg-dracula-foreground text-indigo-700 dark:text-dracula-purple border-white dark:border-dracula-foreground' 
                        : 'bg-indigo-50 dark:bg-dracula-purple/15 text-indigo-600 dark:text-dracula-purple border-indigo-200 dark:border-dracula-purple/30'
                    }`}>
                      <Play size={8} fill="currentColor" className="ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Level info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${
                      isActive ? 'text-indigo-200 dark:text-dracula-comment' : 'text-[#7C7C9A] dark:text-dracula-comment'
                    }`}>
                      Level {lvl.id}
                    </span>
                    <span className={`text-[9px] font-medium ${
                      isActive ? 'text-indigo-200 dark:text-dracula-comment' : 'text-[#5C5C7A] dark:text-dracula-comment'
                    }`}>
                      {lvl.estimatedWpmGoal} WPM Goal
                    </span>
                  </div>
                  <h4 className={`text-xs font-semibold mt-0.5 truncate font-display ${
                    isActive ? 'text-white dark:text-dracula-card' : unlocked ? 'text-[#1E1E2E] dark:text-dracula-foreground' : 'text-slate-400 dark:text-dracula-comment'
                  }`}>
                    {lvl.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                  <p className={`text-[10px] mt-1 line-clamp-1 leading-relaxed font-sans ${
                    isActive ? 'text-indigo-100 dark:text-dracula-card/80' : 'text-[#5C5C7A] dark:text-[#a5afc8]'
                  }`}>
                    {lvl.concept}
                  </p>
                </div>

                <div className={`self-center ${isActive ? 'text-indigo-200 dark:text-dracula-card' : 'text-[#7C7C9A] dark:text-[#a5afc8]'}`}>
                  {unlocked && <ChevronRight size={14} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
