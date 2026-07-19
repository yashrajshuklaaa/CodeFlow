import React, { useState } from 'react';
import { 
  Smile, 
  Flame, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  RefreshCw, 
  Keyboard
} from 'lucide-react';

interface ErgonomicsPanelProps {
  onSelectWarmup: (code: string, title: string) => void;
}

export const ErgonomicsPanel: React.FC<ErgonomicsPanelProps> = ({ onSelectWarmup }) => {
  const [activeTab, setActiveTab] = useState<'ergonomics' | 'drills' | 'warmups'>('ergonomics');

  const drills = [
    {
      title: "Left-Hand Bracket Drill",
      code: "[[{(([{(([{((",
      description: "Practice pinky/ring reaches for code grouping brackets."
    },
    {
      title: "Right-Hand Braces & Colons",
      code: "}}::}}::}}::}}",
      description: "Master standard object declarations and python colon blocks."
    },
    {
      title: "Variable Assignment Flow",
      code: "err != nil; val := 12",
      description: "Build muscle memory for syntax comparisons and assignments."
    },
    {
      title: "Pythonic Function Signatures",
      code: "def main(argv: list):",
      description: "Reinforce dynamic argument definition with type hints."
    },
    {
      title: "Go Pointer Constructors",
      code: "ptr := &Struct{ID: 1}",
      description: "Fluid pointer references combined with inline struct constructors."
    }
  ];

  const warmups = [
    {
      title: "Standard Go Bootloader",
      code: `package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("System Online")\n}`,
      description: "The classic hello world entry point, loaded with key symbols."
    },
    {
      title: "Standard Python Entrypoint",
      code: `import os\nimport sys\n\ndef main():\n    print(f"System: {os.name}")\n\nif __name__ == "__main__":\n    main()`,
      description: "Classic python layout, reinforcing functions, spaces, and formatting."
    },
    {
      title: "Dense Code Symbol Storm",
      code: "for i, v := range arr { if v != nil { res = append(res, &v) } }",
      description: "Very high density of brackets, variables, pointers, and assignments."
    }
  ];

  return (
    <div id="ergo-panel-root" className="bg-white/90 dark:bg-dracula-card rounded-2xl border border-[#D0D4FC]/60 dark:border-dracula-selection p-5 shadow-xs flex flex-col gap-4 backdrop-blur-md transition-colors duration-200">
      
      {/* Tab Navigation */}
      <div className="flex border border-slate-200/60 dark:border-dracula-selection p-0.5 bg-slate-100 dark:bg-dracula-bg rounded-lg transition-colors duration-200">
        <button
          onClick={() => setActiveTab('ergonomics')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer font-display ${
            activeTab === 'ergonomics'
              ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs'
              : 'text-[#5C5C7A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground'
          }`}
        >
          Posture & Techniques
        </button>
        <button
          onClick={() => setActiveTab('drills')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer font-display ${
            activeTab === 'drills'
              ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs'
              : 'text-[#5C5C7A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground'
          }`}
        >
          Muscle Drills
        </button>
        <button
          onClick={() => setActiveTab('warmups')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer font-display ${
            activeTab === 'warmups'
              ? 'bg-indigo-600 dark:bg-dracula-purple text-white dark:text-dracula-card shadow-xs'
              : 'text-[#5C5C7A] dark:text-dracula-comment hover:text-[#1E1E2E] dark:hover:text-dracula-foreground'
          }`}
        >
          Daily Warm-ups
        </button>
      </div>

      {/* Tab Contents: Postures & Techniques */}
      {activeTab === 'ergonomics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: F & J Bumps */}
          <div className="bg-slate-50/50 dark:bg-[#1a1b22] border border-slate-200/60 dark:border-dracula-selection/50 rounded-xl p-3.5 flex gap-3 transition-colors duration-200">
            <div className="p-2 bg-indigo-50 dark:bg-dracula-purple/15 text-indigo-700 dark:text-dracula-purple rounded-lg h-fit">
              <Keyboard size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1E1E2E] dark:text-dracula-foreground font-display">The F & J Home Row Trick</h5>
              <p className="text-[11px] text-[#5C5C7A] dark:text-dracula-comment mt-1 leading-relaxed font-sans">
                Your index fingers have a dedicated spot: look for the small raised tactile bumps on 
                the <strong className="text-indigo-600 dark:text-dracula-pink font-bold">F</strong> and <strong className="text-indigo-600 dark:text-dracula-pink font-bold">J</strong> keys. Use them to calibrate hand placement without glancing down.
              </p>
            </div>
          </div>

          {/* Card 2: Read Ahead */}
          <div className="bg-slate-50/50 dark:bg-[#1a1b22] border border-slate-200/60 dark:border-dracula-selection/50 rounded-xl p-3.5 flex gap-3 transition-colors duration-200">
            <div className="p-2 bg-purple-50 dark:bg-dracula-pink/15 text-purple-700 dark:text-dracula-pink rounded-lg h-fit">
              <BookOpen size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1E1E2E] dark:text-dracula-foreground font-display">The Read-Ahead Technique</h5>
              <p className="text-[11px] text-[#5C5C7A] dark:text-dracula-comment mt-1 leading-relaxed font-sans">
                Expert coders scan ahead. While your fingers are finishing the current word, your eyes 
                should already be reading the next block. This eliminates stuttering and micro-pauses.
              </p>
            </div>
          </div>

          {/* Card 3: Elevated Wrists */}
          <div className="bg-slate-50/50 dark:bg-[#1a1b22] border border-slate-200/60 dark:border-dracula-selection/50 rounded-xl p-3.5 flex gap-3 transition-colors duration-200">
            <div className="p-2 bg-emerald-50 dark:bg-dracula-green/15 text-emerald-700 dark:text-dracula-green rounded-lg h-fit">
              <Flame size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1E1E2E] dark:text-dracula-foreground font-display">Elevate Your Wrists</h5>
              <p className="text-[11px] text-[#5C5C7A] dark:text-dracula-comment mt-1 leading-relaxed font-sans">
                Hover your wrists slightly above the keyboard or palm rest. Resting your wrists puts 
                strain on carpal tunnels. Keep your elbows at an optimal <strong className="text-emerald-600 dark:text-dracula-green font-bold">90-degree angle</strong>.
              </p>
            </div>
          </div>

          {/* Card 4: Daily Habit */}
          <div className="bg-slate-50/50 dark:bg-[#1a1b22] border border-slate-200/60 dark:border-dracula-selection/50 rounded-xl p-3.5 flex gap-3 transition-colors duration-200">
            <div className="p-2 bg-yellow-50 dark:bg-dracula-yellow/15 text-yellow-700 dark:text-dracula-yellow rounded-lg h-fit">
              <Sparkles size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1E1E2E] dark:text-dracula-foreground font-display">15-Min Daily Streaks</h5>
              <p className="text-[11px] text-[#5C5C7A] dark:text-dracula-comment mt-1 leading-relaxed font-sans">
                Consistency is key. Do not type for hours in a single session. Practicing just 15 minutes 
                daily builds muscle memory faster and prevents hand fatigue.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab Contents: Muscle Drills */}
      {activeTab === 'drills' && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] text-[#7C7C9A] dark:text-dracula-comment leading-normal italic font-sans">
            These dynamic symbol drills isolate difficult code character patterns, helping you type special syntax seamlessly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
            {drills.map((drill, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/50 dark:bg-[#1a1b22] border border-slate-200/60 dark:border-dracula-selection/50 rounded-xl p-3 flex flex-col justify-between hover:border-indigo-400/60 dark:hover:border-dracula-purple transition-all duration-200"
              >
                <div>
                  <h5 className="text-xs font-bold text-[#1E1E2E] dark:text-dracula-foreground font-display">{drill.title}</h5>
                  <p className="text-[10px] text-[#5C5C7A] dark:text-dracula-comment mt-0.5">{drill.description}</p>
                </div>
                <div className="flex items-center justify-between gap-3 mt-2.5">
                  <code className="text-xs font-mono text-indigo-700 dark:text-dracula-purple bg-indigo-50/50 dark:bg-[#21222c] border border-indigo-100 dark:border-dracula-selection px-2 py-1 rounded select-all truncate max-w-[150px]">
                    {drill.code}
                  </code>
                  <button
                    onClick={() => onSelectWarmup(drill.code, `Drill: ${drill.title}`)}
                    className="text-[10px] font-bold text-indigo-600 dark:text-dracula-purple hover:text-white bg-indigo-50 dark:bg-dracula-purple/10 hover:bg-indigo-600 dark:hover:bg-dracula-purple px-2.5 py-1 rounded transition-all flex items-center gap-1 shrink-0 cursor-pointer font-display"
                  >
                    <RefreshCw size={10} /> Load Drill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Contents: Daily Warmups */}
      {activeTab === 'warmups' && (
        <div className="flex flex-col gap-2.5 font-sans">
          <p className="text-[11px] text-[#7C7C9A] dark:text-dracula-comment leading-normal italic">
            Run these simple, standard syntax code warmups to stretch your fingers before attempting the curriculum levels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {warmups.map((wu, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/50 dark:bg-[#1a1b22] border border-slate-200/60 dark:border-dracula-selection/50 rounded-xl p-3.5 flex flex-col justify-between hover:border-[#D0D4FC] dark:hover:border-dracula-selection transition-all duration-200"
              >
                <div>
                  <h5 className="text-xs font-bold text-[#1E1E2E] dark:text-dracula-foreground truncate font-display">{wu.title}</h5>
                  <p className="text-[10px] text-[#5C5C7A] dark:text-dracula-comment mt-1 leading-normal line-clamp-2">
                    {wu.description}
                  </p>
                </div>
                <button
                  onClick={() => onSelectWarmup(wu.code, `Warmup: ${wu.title}`)}
                  className="w-full text-center text-[10px] font-bold text-purple-700 dark:text-dracula-pink hover:text-white bg-purple-50 dark:bg-dracula-pink/10 hover:bg-purple-600 dark:hover:bg-dracula-pink py-1.5 rounded mt-3 transition-all flex items-center justify-center gap-1 cursor-pointer font-display"
                >
                  <RefreshCw size={10} /> Start Warmup
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
