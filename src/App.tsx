import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  ShieldAlert, 
  Play, 
  RefreshCw, 
  Sparkles, 
  Award, 
  Info,
  CheckCircle,
  HelpCircle,
  GraduationCap,
  User,
  ShieldCheck,
  Clock,
  Keyboard,
  Sun,
  Moon
} from 'lucide-react';
import { LEVEL_DATA } from './data';
import { Language, Level, TypingStats, UserProgress } from './types';
import { Sidebar } from './components/Sidebar';
import { StatsPanel } from './components/StatsPanel';
import { EditorArea } from './components/EditorArea';
import { KeyboardMap } from './components/KeyboardMap';
import { ErgonomicsPanel } from './components/ErgonomicsPanel';
import { SyntaxAcademy } from './components/SyntaxAcademy';
import { Leaderboard } from './components/Leaderboard';
import { AuthPage } from './components/AuthPage';

export default function App() {
  // Navigation & Core States
  const [lang, setLang] = useState<Language>('go');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [userInput, setUserInput] = useState<string>('');
  const [viewMode, setViewMode] = useState<'arena' | 'academy' | 'leaderboard' | 'auth'>('arena');

  // Authentication State
  interface AuthState {
    token: string;
    user: {
      username: string;
      xp: number;
      completedCount?: number;
    };
  }
  const [auth, setAuth] = useState<AuthState | null>(null);

  const handleLoginSuccess = (token: string, user: { username: string; xp: number; completedCount?: number }) => {
    const newAuth = { token, user };
    setAuth(newAuth);
    try {
      localStorage.setItem('codeflow_auth', JSON.stringify(newAuth));
    } catch (e) {
      console.error('Error saving auth to local storage:', e);
    }
    setViewMode('arena');
  };

  const handleLogout = () => {
    setAuth(null);
    try {
      localStorage.removeItem('codeflow_auth');
    } catch (e) {
      console.error('Error removing auth from local storage:', e);
    }
    setViewMode('arena');
  };
  
  // Custom practice drill states
  const [customTest, setCustomTest] = useState<{
    title: string;
    code: string;
    concept: string;
  } | null>(null);

  // Time & Metrics tracking
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isTimesUp, setIsTimesUp] = useState<boolean>(false);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [exactFinalStats, setExactFinalStats] = useState<TypingStats | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(1);

  // Theme states: Light vs Dracula (High-Contrast Dark Theme)
  const [theme, setTheme] = useState<'light' | 'dracula'>(() => {
    try {
      const saved = localStorage.getItem('codeflow_theme');
      return (saved === 'dracula') ? 'dracula' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Apply class on documentElement
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dracula') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dracula' : 'light';
      try {
        localStorage.setItem('codeflow_theme', next);
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Timer configurations
  const [timerMode, setTimerMode] = useState<'up' | 'down'>('up');
  const [timeLimit, setTimeLimit] = useState<number>(180); // Default countdown 3 mins

  // Gamification & Progress persistence
  const [progress, setProgress] = useState<UserProgress>({
    completedLevels: { go: [], python: [] },
    streak: 0,
    lastCompletedDate: null,
    xp: 0
  });

  const nextCharRef = useRef<string | null>(null);

  // Retrieve current active level data
  const currentLevel: Level = useMemo(() => {
    if (customTest) {
      return {
        id: 0,
        title: customTest.title,
        concept: customTest.concept,
        project: "Custom Drill Practice",
        code: customTest.code,
        description: "Practice custom symbols and lines to optimize hand posture.",
        estimatedWpmGoal: 40
      };
    }
    const lvl = LEVEL_DATA[lang].find((l) => l.id === activeLevelId);
    return lvl || LEVEL_DATA[lang][0];
  }, [lang, activeLevelId, customTest]);

  // Reset attempts count to 1 when currentLevel changes
  useEffect(() => {
    setAttemptsCount(1);
  }, [currentLevel]);

  // Load persistent user achievements
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('codeflow_user_progress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        // Fallback for schema structures
        if (!parsed.completedLevels) parsed.completedLevels = { go: [], python: [] };
        if (!parsed.streak) parsed.streak = 0;
        if (!parsed.xp) parsed.xp = 0;
        setProgress(parsed);
      }
      
      const savedAuth = localStorage.getItem('codeflow_auth');
      if (savedAuth) {
        setAuth(JSON.parse(savedAuth));
      }

      const welcomeSeen = localStorage.getItem('codeflow_welcome_seen');
      if (!welcomeSeen) {
        setShowWelcome(true);
      }
    } catch (e) {
      console.error('Error loading local storage:', e);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    try {
      localStorage.setItem('codeflow_welcome_seen', 'true');
    } catch (e) {
      console.error('Error setting welcome seen in local storage:', e);
    }
  };

  // Save progress changes
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('codeflow_user_progress', JSON.stringify(newProgress));
  };

  // Timer tracking side effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (startTime !== null && !isFinished && !isTimesUp) {
      interval = setInterval(() => {
        const secondsPassed = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(secondsPassed);

        // Check for Countdown time-out
        if (timerMode === 'down' && secondsPassed >= timeLimit) {
          setIsTimesUp(true);
          setIsFinished(true);
          if (interval) clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isFinished, isTimesUp, timerMode, timeLimit]);

  // Real-time calculation of all performance variables
  const computedStats: TypingStats = useMemo(() => {
    // If the test is already finished with precision stats, lock onto those
    if (isFinished && exactFinalStats) {
      return exactFinalStats;
    }

    const totalTyped = userInput.length;
    const targetCode = currentLevel.code;

    // Count character differences up to typed index
    let errors = 0;
    for (let i = 0; i < totalTyped; i++) {
      if (userInput[i] !== targetCode[i]) {
        errors++;
      }
    }

    const elapsedMins = elapsed > 0 ? elapsed / 60 : 1 / 60; // prevent divide-by-zero
    
    // Standard typing WPM: (chars / 5) / minutes
    const rawWpm = Math.max(0, Math.round((totalTyped / 5) / elapsedMins));
    
    // Net WPM: (correct chars / 5) / minutes
    const correctChars = Math.max(0, totalTyped - errors);
    const netWpm = Math.max(0, Math.round((correctChars / 5) / elapsedMins));
    
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

    return {
      wpm: rawWpm,
      netWpm,
      accuracy,
      elapsedSeconds: elapsed,
      backspaceCount,
      errorCount: errors,
    };
  }, [userInput, elapsed, backspaceCount, currentLevel, isFinished, exactFinalStats]);

  // Input triggers
  const handleKeyPress = (char: string, isCorrect: boolean) => {
    // Start stopwatch on first keypress
    if (startTime === null) {
      setStartTime(Date.now());
    }
  };

  const handleBackspace = () => {
    setBackspaceCount((prev) => prev + 1);
  };

  // Listen for the end of typing
  useEffect(() => {
    if (userInput.length === currentLevel.code.length && currentLevel.code.length > 0 && !isFinished) {
      triggerCompletion();
    }
  }, [userInput, currentLevel]);

  // Complete level logic - captures exact time stamp instantly
  const triggerCompletion = () => {
    const finishTime = Date.now();
    setIsFinished(true);
    
    // Calculate millisecond-accurate elapsed time immediately
    const totalMs = startTime ? (finishTime - startTime) : 0;
    const exactSeconds = Math.max(0.1, totalMs / 1000);
    const roundedSeconds = Math.round(exactSeconds);
    
    // Set elapsed immediately to prevent further ticking updates
    setElapsed(roundedSeconds);

    const totalTyped = userInput.length;
    const targetCode = currentLevel.code;

    // Calculate final errors precisely
    let errors = 0;
    for (let i = 0; i < totalTyped; i++) {
      if (userInput[i] !== targetCode[i]) {
        errors++;
      }
    }

    const elapsedMins = exactSeconds / 60;
    
    // Standard typing WPM: (chars / 5) / minutes
    const rawWpm = Math.max(0, Math.round((totalTyped / 5) / elapsedMins));
    
    // Net WPM: (correct chars / 5) / minutes
    const correctChars = Math.max(0, totalTyped - errors);
    const netWpm = Math.max(0, Math.round((correctChars / 5) / elapsedMins));
    
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

    const finalStats: TypingStats = {
      wpm: rawWpm,
      netWpm,
      accuracy,
      elapsedSeconds: roundedSeconds,
      backspaceCount,
      errorCount: errors,
    };

    // Commit high-precision final stats
    setExactFinalStats(finalStats);

    // Gated Progression check: Must be at least 95% accuracy
    let earnedXp = 0;
    if (accuracy >= 95 && !customTest) {
      const isAlreadyCompleted = progress.completedLevels[lang].includes(currentLevel.id);
      
      let updatedCompleted = [...progress.completedLevels[lang]];
      if (!isAlreadyCompleted) {
        updatedCompleted.push(currentLevel.id);
      }

      // Calculate XP score: (WPM * LevelId * accuracy_fraction) - penalty for backspaces
      const levelFactor = currentLevel.id;
      const accuracyMultiplier = accuracy / 100;
      const backspacePenalty = backspaceCount * 0.2;
      earnedXp = Math.max(50, Math.round((netWpm * levelFactor * accuracyMultiplier) - backspacePenalty) + 100);

      // Verify and increment streak calendar
      const todayDate = new Date().toISOString().split('T')[0];
      let newStreak = progress.streak;
      
      if (progress.lastCompletedDate !== todayDate) {
        if (progress.lastCompletedDate) {
          const lastDateObj = new Date(progress.lastCompletedDate);
          const todayDateObj = new Date(todayDate);
          const diffDays = Math.floor((todayDateObj.getTime() - lastDateObj.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1; // broken streak restarted
          }
        } else {
          newStreak = 1; // first streak
        }
      }

      saveProgress({
        completedLevels: {
          ...progress.completedLevels,
          [lang]: updatedCompleted,
        },
        streak: newStreak || 1,
        lastCompletedDate: todayDate,
        xp: progress.xp + earnedXp,
      });
    }

    // Submit to database leaderboard if authenticated
    if (auth && auth.token) {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          wpm: rawWpm,
          netWpm,
          accuracy,
          lang: lang.toUpperCase(),
          levelTitle: currentLevel.title,
          xpAwarded: earnedXp
        })
      })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(data => {
        if (data && data.updatedUser) {
          // Sync authenticated state user's XP/completed count with API results
          setAuth(prev => prev ? {
            ...prev,
            user: {
              ...prev.user,
              xp: data.updatedUser.xp,
              completedCount: data.updatedUser.completedCount
            }
          } : null);
        }
      })
      .catch(err => console.error("Leaderboard submit error:", err));
    }
  };

  // Restart current level
  const handleResetLevel = () => {
    setUserInput('');
    setStartTime(null);
    setElapsed(0);
    setIsFinished(false);
    setIsTimesUp(false);
    setBackspaceCount(0);
    setExactFinalStats(null);
    setAttemptsCount((prev) => prev + 1);
  };

  // Advance level button click
  const handleNextLevel = () => {
    if (activeLevelId < 10) {
      setActiveLevelId((prev) => prev + 1);
    }
    handleResetLevel();
  };

  // Select custom warm-up from training section
  const handleSelectWarmup = (warmupCode: string, warmupTitle: string) => {
    setCustomTest({
      title: warmupTitle,
      code: warmupCode,
      concept: "Practice custom syntax groupings to establish muscle memory."
    });
    handleResetLevel();
  };

  // Exit custom drill mode back to regular level
  const handleExitCustomDrill = () => {
    setCustomTest(null);
    handleResetLevel();
  };

  // Select custom drill from Syntax Academy
  const handleSelectAcademyDrill = (code: string, title: string, concept: string) => {
    setCustomTest({
      title,
      code,
      concept
    });
    setViewMode('arena');
    handleResetLevel();
  };

  // Award Rank XP for successful quiz submissions
  const handleAwardXP = (amount: number) => {
    saveProgress({
      ...progress,
      xp: progress.xp + amount
    });
  };

  // Feedback based on performance
  const performanceFeedback = useMemo(() => {
    if (isTimesUp) {
      return {
        title: "Pacing Tip",
        desc: "You ran out of time. Focus on parsing entire code blocks visually first, then type with continuous flow instead of pausing.",
        bgColor: "bg-red-50 dark:bg-dracula-red/10 border-red-200 dark:border-dracula-red/30 text-red-700 dark:text-dracula-red",
        iconColor: "text-red-500 dark:text-dracula-red"
      };
    }
    if (computedStats.accuracy < 95) {
      return {
        title: "Focus on Precision",
        desc: "Your accuracy fell below the 95% pass gate. Prioritize slow, rhythmic key strikes to eliminate backspacing and lock in muscle memory.",
        bgColor: "bg-yellow-50 dark:bg-dracula-yellow/10 border-yellow-200 dark:border-dracula-yellow/30 text-yellow-800 dark:text-dracula-yellow",
        iconColor: "text-yellow-600 dark:text-dracula-yellow"
      };
    }
    if (computedStats.accuracy >= 98 && computedStats.netWpm >= 50) {
      return {
        title: "Elite Execution!",
        desc: "Incredible mastery! High-speed typing paired with near-perfect accuracy demonstrates supreme professional-grade mechanics.",
        bgColor: "bg-emerald-50 dark:bg-dracula-green/10 border-emerald-200 dark:border-dracula-green/30 text-emerald-800 dark:text-dracula-green",
        iconColor: "text-emerald-600 dark:text-dracula-green"
      };
    }
    if (computedStats.backspaceCount > 15) {
      return {
        title: "Reduce Backspace Friction",
        desc: `You corrected ${computedStats.backspaceCount} characters. Frequent erasing disrupts your typing rhythm and slows down net WPM. Try slowing down by 10% to type without corrections.`,
        bgColor: "bg-indigo-50 dark:bg-dracula-purple/10 border-[#D0D4FC]/60 dark:border-dracula-purple/30 text-indigo-800 dark:text-dracula-purple",
        iconColor: "text-indigo-600 dark:text-dracula-purple"
      };
    }
    return {
      title: "Module Passed!",
      desc: "Outstanding execution! Your muscle memory is precise and your rhythm is consistent. Ready to advance to the next syntax level.",
      bgColor: "bg-indigo-50/50 dark:bg-[#1a1b22] border-[#D0D4FC]/40 dark:border-dracula-selection text-[#1E1E2E] dark:text-dracula-foreground",
      iconColor: "text-indigo-600 dark:text-dracula-purple"
    };
  }, [isTimesUp, computedStats.accuracy, computedStats.backspaceCount, computedStats.netWpm]);

  return (
    <div id="codeflow-app-container" className="min-h-screen bg-gradient-to-br from-[#E6E6FA] via-[#F4F4FC] to-[#FFFFFF] text-[#1E1E2E] dark:from-dracula-bg dark:via-[#1e1f29] dark:to-dracula-card dark:text-dracula-foreground flex flex-col justify-between font-sans transition-colors duration-200">
      
      {/* Visual Header Grid Banner */}
      <header id="codeflow-header" className="border-b border-[#C5CAFC]/50 dark:border-dracula-selection bg-white/70 dark:bg-dracula-bg/85 backdrop-blur-md sticky top-0 z-10 py-4 px-6 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-dracula-purple dark:to-dracula-pink rounded-xl shadow-lg shadow-indigo-500/20 text-white flex items-center justify-center">
              <Zap size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#1E1E2E] dark:text-dracula-pink tracking-tight font-display transition-colors duration-200">CodeFlow</h1>
                <span className="text-[10px] bg-indigo-100 dark:bg-dracula-purple/20 text-indigo-700 dark:text-dracula-purple font-extrabold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-dracula-purple/30">v1.1</span>
              </div>
              <p className="text-xs text-[#5C5C7A] dark:text-dracula-comment font-medium font-sans">Syntax Touch-Typing & Production-Grade Code Mastery</p>
            </div>
          </div>

          {/* Core XP & Streak Counter Header Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-dracula-card px-4 py-2 rounded-xl border border-[#D0D4FC]/60 dark:border-dracula-selection shadow-xs transition-colors duration-200">
              <Flame size={16} className="text-orange-500 animate-bounce" />
              <div className="text-left">
                <p className="text-[9px] text-[#7C7C9A] dark:text-dracula-comment uppercase font-black tracking-wider leading-none font-sans">Day Streak</p>
                <p className="text-sm font-extrabold text-orange-600 dark:text-dracula-orange leading-none mt-1 font-display">{progress.streak} days</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/90 dark:bg-dracula-card px-4 py-2 rounded-xl border border-[#D0D4FC]/60 dark:border-dracula-selection shadow-xs transition-colors duration-200">
              <Award size={16} className="text-indigo-500 dark:text-dracula-purple" />
              <div className="text-left">
                <p className="text-[9px] text-[#7C7C9A] dark:text-dracula-comment uppercase font-black tracking-wider leading-none font-sans">Rank Experience</p>
                <p className="text-sm font-extrabold text-indigo-600 dark:text-dracula-purple leading-none mt-1 font-display">{progress.xp} XP</p>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[#D0D4FC]/60 dark:border-dracula-selection bg-white/90 dark:bg-dracula-card text-indigo-600 dark:text-dracula-yellow hover:bg-slate-100 dark:hover:bg-dracula-selection transition-all shadow-xs flex items-center justify-center cursor-pointer"
              title={theme === 'light' ? "Switch to Dracula Theme" : "Switch to Light Theme"}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Dashboard layout */}
      <main id="codeflow-main" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Navigation Sidebar & Statistics Progress */}
        <section id="sidebar-section" className="lg:col-span-1">
          <Sidebar
            currentLanguage={lang}
            setLanguage={(l) => {
              setLang(l);
              setCustomTest(null); // Reset custom test when language switches
              setViewMode('arena'); // Focus back to typing playground
            }}
            levels={LEVEL_DATA[lang]}
            activeLevelId={activeLevelId}
            setActiveLevelId={(id) => {
              setActiveLevelId(id);
              setCustomTest(null); // Cancel custom test when user chooses standard level
              setViewMode('arena'); // Focus back to typing playground
            }}
            progress={progress}
            onResetTest={handleResetLevel}
          />
        </section>

        {/* Right Side: Primary interactive canvas & touch-typing keyboard */}
        <section id="canvas-section" className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Main Visual Arena/Academy Toggle Switcher Tabs */}
          <div className="flex flex-wrap bg-white/70 dark:bg-dracula-bg backdrop-blur-md p-1 rounded-2xl border border-[#D0D4FC]/60 dark:border-dracula-selection shadow-xs max-w-xl gap-1 transition-colors duration-200">
            <button
              onClick={() => setViewMode('arena')}
              className={`flex-grow sm:flex-1 min-w-[110px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-display ${
                viewMode === 'arena'
                  ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs'
                  : 'text-[#5C5C7A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground hover:bg-slate-50 dark:hover:bg-dracula-selection'
              }`}
            >
              <Zap size={14} className={viewMode === 'arena' ? 'animate-pulse' : ''} />
              <span>Arena</span>
            </button>
            <button
              onClick={() => setViewMode('academy')}
              className={`flex-grow sm:flex-1 min-w-[110px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-display ${
                viewMode === 'academy'
                  ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs'
                  : 'text-[#5C5C7A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground hover:bg-slate-50 dark:hover:bg-dracula-selection'
              }`}
            >
              <GraduationCap size={15} />
              <span>Academy</span>
            </button>
            <button
              onClick={() => setViewMode('leaderboard')}
              className={`flex-grow sm:flex-1 min-w-[110px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-display ${
                viewMode === 'leaderboard'
                  ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs'
                  : 'text-[#5C5C7A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground hover:bg-slate-50 dark:hover:bg-dracula-selection'
              }`}
            >
              <Trophy size={14} />
              <span>Leaderboard</span>
            </button>
            <button
              onClick={() => setViewMode('auth')}
              className={`flex-grow sm:flex-1 min-w-[110px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-display ${
                viewMode === 'auth'
                  ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs'
                  : 'text-[#5C5C7A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground hover:bg-slate-50 dark:hover:bg-dracula-selection'
              }`}
            >
              <User size={14} />
              <span className="truncate">{auth ? auth.user.username : "Sign In"}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'arena' && (
              <motion.div
                key="arena"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-6"
              >
                {/* Realtime stats dashboard panel */}
                <StatsPanel
                  stats={computedStats}
                  streak={progress.streak}
                  xp={progress.xp}
                  timerMode={timerMode}
                  setTimerMode={setTimerMode}
                  timeLimit={timeLimit}
                  setTimeLimit={setTimeLimit}
                  isFinished={isFinished}
                  onReset={handleResetLevel}
                />

                {/* Custom Practice banner alert */}
                {customTest && (
                  <div id="custom-drill-banner" className="bg-indigo-50/80 border border-[#C5CAFC]/60 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm font-sans">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 font-extrabold text-xs font-display">DRILL</div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1E1E2E] font-display">Custom Training Module Active: {customTest.title}</h4>
                        <p className="text-[11px] text-[#5C5C7A] mt-0.5 font-sans">This drill doesn't affect standard level gating. Practice freely!</p>
                      </div>
                    </div>
                    <button
                      onClick={handleExitCustomDrill}
                      className="text-xs font-bold bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-indigo-700 transition-all border border-[#D0D4FC] cursor-pointer font-display shadow-xs"
                    >
                      Exit Practice
                    </button>
                  </div>
                )}

                {/* Core Interactive Typing Editor Canvas */}
                <EditorArea
                  title={currentLevel.title}
                  project={currentLevel.project}
                  concept={currentLevel.concept}
                  code={currentLevel.code}
                  userInput={userInput}
                  setUserInput={setUserInput}
                  onKeyPress={handleKeyPress}
                  onBackspace={handleBackspace}
                  isFinished={isFinished}
                  nextCharRef={nextCharRef}
                />

                {/* QWERTY Keyboard Map coaching assistant */}
                <KeyboardMap nextChar={nextCharRef.current} />

                {/* Posture, ergonomics, muscle drills instruction panel */}
                <ErgonomicsPanel onSelectWarmup={handleSelectWarmup} />
              </motion.div>
            )}

            {viewMode === 'academy' && (
              <motion.div
                key="academy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
              >
                {/* Dedicated Programming Lessons, Comparison Display & Quiz Engine */}
                <SyntaxAcademy 
                  onSelectDrill={handleSelectAcademyDrill} 
                  onAwardXP={handleAwardXP}
                />
              </motion.div>
            )}

            {viewMode === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
              >
                <Leaderboard
                  currentUser={auth ? auth.user : null}
                  onNavigateToAuth={() => setViewMode('auth')}
                />
              </motion.div>
            )}

            {viewMode === 'auth' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
              >
                <AuthPage
                  currentUser={auth ? auth.user : null}
                  onLoginSuccess={handleLoginSuccess}
                  onLogout={handleLogout}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </section>

      </main>

      {/* Footer System labels */}
      <footer id="codeflow-footer" className="border-t border-[#D0D4FC]/40 dark:border-dracula-selection bg-white/60 dark:bg-dracula-card py-4 px-6 text-center select-none text-[11px] text-[#5C5C7A] dark:text-dracula-comment font-sans transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CodeFlow Speed Typing. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="font-semibold text-[#4F4E75] dark:text-dracula-foreground">Gated levels (&gt;95% Acc)</span>
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={12} className="text-indigo-500 dark:text-dracula-purple" />
              <span className="font-semibold text-[#4F4E75] dark:text-dracula-foreground">Real-time WPM calibration</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Completion Modal Layer overlay */}
      <AnimatePresence>
        {isFinished && (
          <div className="fixed inset-0 bg-[#0F101E]/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="bg-white dark:bg-dracula-card border border-[#D0D4FC] dark:border-dracula-selection p-8 rounded-2xl max-w-xl w-full text-center shadow-2xl relative overflow-hidden text-[#1E1E2E] dark:text-dracula-foreground font-sans transition-colors duration-200"
            >
              {/* Glow accent */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 dark:bg-dracula-purple/10 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header Icon */}
              {isTimesUp ? (
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-5 border border-red-500/20 dark:border-dracula-red/30">
                  <ShieldAlert size={36} className="text-red-500 dark:text-dracula-red" />
                </div>
              ) : computedStats.accuracy >= 95 ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20 dark:border-dracula-green/30 animate-bounce">
                  <Trophy size={36} className="text-emerald-500 dark:text-dracula-green" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-5 border border-yellow-500/20 dark:border-dracula-yellow/30">
                  <ShieldAlert size={36} className="text-yellow-500 dark:text-dracula-yellow" />
                </div>
              )}

              {/* Completion Title text */}
              <h3 className="text-2xl font-black text-[#1E1E2E] dark:text-dracula-foreground font-display">
                {isTimesUp 
                  ? "Time is Up!" 
                  : computedStats.accuracy >= 95 
                    ? "Concept Mastered!" 
                    : "Accuracy Blocked"}
              </h3>

              <p className="text-xs text-[#5C5C7A] dark:text-dracula-comment mt-2 leading-relaxed font-sans">
                {isTimesUp 
                  ? "You ran out of time. Try counting up or pace yourself better to complete the script."
                  : computedStats.accuracy >= 95 
                    ? `Outstanding typing rhythm! You completed "${currentLevel.title}" with clean fingers and high accuracy.`
                    : "You finished typing the script, but failed to cross the accuracy barrier. Touch typing requires high precision!"
                }
              </p>

              {/* Detailed Performance Dashboard (6-Tile Bento Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 font-mono text-left">
                
                {/* 1. Net WPM */}
                <div className="bg-indigo-50/70 dark:bg-[#1a1b22] border border-indigo-200/50 dark:border-dracula-selection rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-[#7C7C9A] dark:text-dracula-comment">
                    <span className="text-[10px] font-bold uppercase font-sans">Net WPM</span>
                    <Trophy size={14} className="text-indigo-600 dark:text-dracula-purple animate-pulse" />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-xl font-black text-indigo-700 dark:text-dracula-purple font-display">{computedStats.netWpm}</p>
                    <span className="text-[9px] text-[#5C5C7A] dark:text-dracula-comment font-sans font-medium">Correct speed</span>
                  </div>
                </div>

                {/* 2. Raw WPM */}
                <div className="bg-[#F3F3FA] dark:bg-[#1a1b22] border border-[#D0D4FC]/40 dark:border-dracula-selection rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#7C7C9A] dark:text-dracula-comment">
                    <span className="text-[10px] font-bold uppercase font-sans">Raw WPM</span>
                    <Zap size={14} className="text-yellow-500 dark:text-dracula-yellow" />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-xl font-black text-[#1E1E2E] dark:text-dracula-foreground font-display">{computedStats.wpm}</p>
                    <span className="text-[9px] text-[#5C5C7A] dark:text-dracula-comment font-sans font-medium">Total speed</span>
                  </div>
                </div>

                {/* 3. Accuracy */}
                <div className={`border rounded-xl p-3 flex flex-col justify-between ${
                  computedStats.accuracy >= 95 
                    ? 'bg-emerald-50/50 dark:bg-dracula-green/10 border-emerald-200/50 dark:border-dracula-green/30' 
                    : 'bg-red-50/50 dark:bg-dracula-red/10 border-red-200/50 dark:border-dracula-red/30'
                }`}>
                  <div className="flex items-center justify-between text-[#7C7C9A] dark:text-dracula-comment">
                    <span className="text-[10px] font-bold uppercase font-sans">Accuracy</span>
                    <Target size={14} className={computedStats.accuracy >= 95 ? 'text-emerald-600 dark:text-dracula-green' : 'text-red-500 dark:text-dracula-red'} />
                  </div>
                  <div className="mt-2.5">
                    <p className={`text-xl font-black font-display ${
                      computedStats.accuracy >= 95 ? 'text-emerald-700 dark:text-dracula-green' : 'text-red-600 dark:text-dracula-red'
                    }`}>{computedStats.accuracy}%</p>
                    <span className="text-[9px] text-[#5C5C7A] dark:text-dracula-comment font-sans font-medium">
                      {computedStats.accuracy >= 95 ? 'Passing (Gate: 95%)' : 'Locked (<95%)'}
                    </span>
                  </div>
                </div>

                {/* 4. Retries/Attempts */}
                <div className="bg-[#F3F3FA] dark:bg-[#1a1b22] border border-[#D0D4FC]/40 dark:border-dracula-selection rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#7C7C9A] dark:text-dracula-comment">
                    <span className="text-[10px] font-bold uppercase font-sans">Drill Attempt</span>
                    <RefreshCw size={12} className="text-rose-500 dark:text-dracula-pink" />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-xl font-black text-[#1E1E2E] dark:text-dracula-foreground font-display">
                      #{attemptsCount}
                    </p>
                    <span className="text-[9px] text-[#5C5C7A] dark:text-dracula-comment font-sans font-medium">
                      {attemptsCount === 1 ? 'First try!' : `Attempt count`}
                    </span>
                  </div>
                </div>

                {/* 5. Time Elapsed */}
                <div className="bg-[#F3F3FA] dark:bg-[#1a1b22] border border-[#D0D4FC]/40 dark:border-dracula-selection rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#7C7C9A] dark:text-dracula-comment">
                    <span className="text-[10px] font-bold uppercase font-sans">Elapsed Time</span>
                    <Clock size={14} className="text-emerald-500 dark:text-dracula-green" />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-xl font-black text-[#1E1E2E] dark:text-dracula-foreground font-display">
                      {computedStats.elapsedSeconds}s
                    </p>
                    <span className="text-[9px] text-[#5C5C7A] dark:text-dracula-comment font-sans font-medium">
                      {Math.floor(computedStats.elapsedSeconds / 60) > 0 
                        ? `${Math.floor(computedStats.elapsedSeconds / 60)}m ${computedStats.elapsedSeconds % 60}s`
                        : 'Active time'
                      }
                    </span>
                  </div>
                </div>

                {/* 6. Erase / Typos friction */}
                <div className="bg-[#F3F3FA] dark:bg-[#1a1b22] border border-[#D0D4FC]/40 dark:border-dracula-selection rounded-xl p-3 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-[#7C7C9A] dark:text-dracula-comment">
                    <span className="text-[10px] font-bold uppercase font-sans">Friction</span>
                    <Keyboard size={14} className="text-slate-600 dark:text-dracula-comment" />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-base font-black text-[#1E1E2E] dark:text-dracula-foreground font-display">
                      ⌫ {computedStats.backspaceCount} <span className="text-xs text-[#7C7C9A] dark:text-dracula-comment font-normal">/</span> ✗ {computedStats.errorCount}
                    </p>
                    <span className="text-[9px] text-[#5C5C7A] dark:text-dracula-comment font-sans font-medium">
                      Backspaces / Typos
                    </span>
                  </div>
                </div>

              </div>

              {/* Dynamic Analytical Diagnostic & Feedback Panel */}
              <div className={`border rounded-xl p-4 flex gap-3 shadow-xs text-left mb-6 ${performanceFeedback.bgColor}`}>
                <span className={`shrink-0 mt-0.5 ${performanceFeedback.iconColor}`}>
                  {computedStats.accuracy >= 95 ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                </span>
                <div>
                  <h4 className="font-extrabold uppercase tracking-wider text-[10px] font-display mb-1">{performanceFeedback.title}</h4>
                  <p className="font-sans font-medium text-xs opacity-95 leading-relaxed">{performanceFeedback.desc}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleResetLevel}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-dracula-purple dark:hover:bg-dracula-purple/80 text-white dark:text-dracula-card font-extrabold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 dark:shadow-none text-xs cursor-pointer font-display"
                >
                  {computedStats.accuracy >= 95 ? 'Type Again' : 'Retry Level'}
                </button>

                {computedStats.accuracy >= 95 && !customTest && activeLevelId < 10 && (
                  <button
                    onClick={handleNextLevel}
                    className="w-full bg-[#1E1E2E] dark:bg-dracula-selection hover:bg-[#2D2D3E] dark:hover:bg-dracula-selection/75 text-white dark:text-dracula-foreground font-extrabold py-3 rounded-xl transition border border-transparent text-xs cursor-pointer font-display"
                  >
                    Unlock & Load Level {activeLevelId + 1}
                  </button>
                )}

                {customTest && (
                  <button
                    onClick={handleExitCustomDrill}
                    className="w-full bg-white dark:bg-dracula-card hover:bg-slate-50 dark:hover:bg-dracula-selection text-[#1E1E2E] dark:text-dracula-foreground font-extrabold py-3 rounded-xl transition border border-[#D0D4FC] dark:border-dracula-selection text-xs cursor-pointer font-display shadow-xs"
                  >
                    Return to Level {activeLevelId}
                  </button>
                )}
              </div>

              <p className="mt-5 text-[10px] font-semibold tracking-wide text-[#7C7C9A] dark:text-dracula-comment uppercase">
                Made by YRS
              </p>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* First-time Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 bg-[#0F101E]/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 180 }}
              className="bg-white dark:bg-dracula-card border border-[#D0D4FC] dark:border-dracula-selection p-8 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden text-[#1E1E2E] dark:text-dracula-foreground font-sans transition-colors duration-200"
            >
              {/* Radial gradient background accent */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 dark:bg-dracula-purple/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 dark:bg-dracula-pink/10 rounded-full blur-3xl pointer-events-none" />

              {/* Title Section */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 dark:from-dracula-purple dark:to-dracula-pink rounded-xl text-white shadow-md shadow-indigo-100">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1E1E2E] dark:text-dracula-pink tracking-tight font-display flex items-center gap-2">
                    Welcome to CodeFlow!
                  </h3>
                  <p className="text-xs text-[#5C5C7A] dark:text-dracula-comment mt-0.5">The ultimate comparative touch-typing workspace for Go & Python.</p>
                </div>
              </div>

              {/* Critical Core Concept Highlight requested by the user */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-dracula-bg dark:to-dracula-bg/95 border border-[#D0D4FC]/60 dark:border-dracula-selection rounded-xl p-4.5 mb-6 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-100 dark:bg-dracula-selection text-indigo-700 dark:text-dracula-purple font-extrabold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-bl border-l border-b border-[#D0D4FC]/60 dark:border-dracula-selection font-sans">
                  PRO TIP
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 text-indigo-600 dark:text-dracula-purple mt-0.5">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-800 dark:text-dracula-purple font-display">Mindful Touch Typing</h4>
                    <p className="text-xs text-[#1E1E2E] dark:text-dracula-foreground font-bold mt-1 leading-relaxed">
                      "Read before writing code: keep the content in your mind, then start typing."
                    </p>
                    <p className="text-[11px] text-[#5C5C7A] dark:text-dracula-comment mt-1.5 leading-relaxed font-sans">
                      Don't look back and forth at individual characters. Internalize entire syntax blocks or expressions first, then let your fingers build physical muscle memory smoothly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-3.5 mb-6 text-xs">
                <h5 className="text-[10px] font-black uppercase text-[#7C7C9A] dark:text-dracula-comment tracking-wider">WORKSPACE CAPABILITIES</h5>
                
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-slate-50 dark:bg-dracula-selection border border-slate-200/50 dark:border-dracula-selection/50 rounded-lg text-[#1E1E2E] dark:text-dracula-foreground">
                    <Zap size={14} className="dark:text-dracula-yellow" />
                  </div>
                  <div>
                    <strong className="text-[#1E1E2E] dark:text-dracula-foreground font-display">Dual-Track Typing Arena</strong>
                    <p className="text-xs text-[#5C5C7A] dark:text-dracula-comment mt-0.5">Toggle between strict static Golang layouts and flexible dynamic Python syntax on the fly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-slate-50 dark:bg-dracula-selection border border-slate-200/50 dark:border-dracula-selection/50 rounded-lg text-[#1E1E2E] dark:text-dracula-foreground">
                    <GraduationCap size={14} className="dark:text-dracula-purple" />
                  </div>
                  <div>
                    <strong className="text-[#1E1E2E] dark:text-dracula-foreground font-display">Interactive Syntax Academy</strong>
                    <p className="text-xs text-[#5C5C7A] dark:text-dracula-comment mt-0.5">Compare module-by-module differences, load snippets directly as custom drills, and challenge yourself in the Diagnostic Quiz.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-slate-50 dark:bg-dracula-selection border border-slate-200/50 dark:border-dracula-selection/50 rounded-lg text-[#1E1E2E] dark:text-dracula-foreground">
                    <Trophy size={14} className="dark:text-dracula-green" />
                  </div>
                  <div>
                    <strong className="text-[#1E1E2E] dark:text-dracula-foreground font-display">Real-time Stats Calibration</strong>
                    <p className="text-xs text-[#5C5C7A] dark:text-dracula-comment mt-0.5">Track your net speed (WPM) and accuracy down to the exact millisecond as soon as you finish writing the last character.</p>
                  </div>
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={handleCloseWelcome}
                className="w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-dracula-purple dark:hover:bg-dracula-purple/80 text-white dark:text-dracula-card font-black py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 dark:shadow-none text-xs cursor-pointer font-display text-center"
              >
                Let's Start Coding!
              </button>

              <p className="mt-5 text-center text-[10px] font-semibold tracking-wide text-[#7C7C9A] dark:text-dracula-comment uppercase">
                Made by YRS
              </p>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
