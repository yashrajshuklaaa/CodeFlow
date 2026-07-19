import React, { useRef, useEffect, useState } from 'react';
import { Terminal, ShieldAlert, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import { keyboardAudio } from '../audio';

interface EditorAreaProps {
  title: string;
  project: string;
  concept: string;
  code: string;
  userInput: string;
  setUserInput: (input: string) => void;
  onKeyPress: (char: string, isCorrect: boolean) => void;
  onBackspace: () => void;
  isFinished: boolean;
  nextCharRef: React.MutableRefObject<string | null>;
}

export const EditorArea: React.FC<EditorAreaProps> = ({
  title,
  project,
  concept,
  code,
  userInput,
  setUserInput,
  onKeyPress,
  onBackspace,
  isFinished,
  nextCharRef,
}) => {
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(true);

  // Sound States loaded from the singleton sound controller
  const [isMuted, setIsMuted] = useState(keyboardAudio.getMuted());
  const [switchType, setSwitchType] = useState(keyboardAudio.getSwitchType());
  const [volume, setVolume] = useState(keyboardAudio.getVolume());

  const handleToggleMute = () => {
    const muted = keyboardAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleChangeSwitch = (type: 'blue' | 'brown' | 'red') => {
    keyboardAudio.setSwitchType(type);
    setSwitchType(type);
    // Play sound of selected switch as premium feedback
    keyboardAudio.playCorrect(' ');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    keyboardAudio.setVolume(val);
    setVolume(val);
  };

  // Force focus to hidden input on load or when clicking editor container
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [code]);

  const handleContainerClick = () => {
    if (hiddenInputRef.current && !isFinished) {
      hiddenInputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Split target code into lines to map character indices
  const lines = code.split('\n');

  // Map each character of the target code to its global character index
  // this helps us know exactly which line/column the cursor or each typed character belongs to.
  let charGlobalIndex = 0;
  const lineDetails = lines.map((lineText) => {
    const chars = lineText.split('');
    const lineCharsWithGlobalIndex = chars.map((char) => {
      const idx = charGlobalIndex;
      charGlobalIndex++; // increment for character
      return { char, globalIndex: idx };
    });
    
    // Add 1 for the newline character at the end of each line (except the last one)
    const newlineGlobalIndex = charGlobalIndex;
    charGlobalIndex++; 

    return {
      text: lineText,
      chars: lineCharsWithGlobalIndex,
      newlineGlobalIndex,
    };
  });

  const totalCharsCount = code.length;
  const currentTypedCount = userInput.length;

  // Determine next character expected
  const nextExpectedChar = currentTypedCount < totalCharsCount ? code[currentTypedCount] : null;
  nextCharRef.current = nextExpectedChar;

  // Auto-scrolling implementation:
  // Find the active character or active line and scroll it into the center of the viewport
  useEffect(() => {
    if (editorContainerRef.current) {
      const activeLineEl = editorContainerRef.current.querySelector('.active-typing-line');
      if (activeLineEl) {
        activeLineEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentTypedCount]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    if (e.key === 'Backspace') {
      keyboardAudio.playBackspace();
      onBackspace();
      // Delete last char from input
      setUserInput(userInput.slice(0, -1));
      e.preventDefault();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      // Handle tab key injection: usually code uses \t or spaces.
      // We will read what the target code expects. If it expects a '\t' or ' ', we type it.
      const expected = code[currentTypedCount];
      if (expected === '\t') {
        keyboardAudio.playCorrect('\t');
        const isCorrect = true;
        onKeyPress('\t', isCorrect);
        setUserInput(userInput + '\t');
      } else {
        // Fallback to inserting a tab character anyway if that's what user pressed
        const isCorrect = expected === '\t';
        if (isCorrect) {
          keyboardAudio.playCorrect('\t');
        } else {
          keyboardAudio.playIncorrect();
        }
        onKeyPress('\t', isCorrect);
        setUserInput(userInput + '\t');
      }
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    const val = e.target.value;
    const addedChar = val.charAt(val.length - 1);
    const expected = code[currentTypedCount];

    if (val.length > userInput.length) {
      // User typed a character
      const isCorrect = addedChar === expected;
      if (isCorrect) {
        keyboardAudio.playCorrect(addedChar);
      } else {
        keyboardAudio.playIncorrect();
      }
      onKeyPress(addedChar, isCorrect);
      setUserInput(userInput + addedChar); // Store the actual typed character so errors are visible and correctable
    }
  };

  // Find which line index is currently being typed
  let activeLineIndex = 0;
  let accumulatedIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + 1; // including newline
    if (currentTypedCount >= accumulatedIndex && currentTypedCount < accumulatedIndex + lineLength) {
      activeLineIndex = i;
      break;
    }
    accumulatedIndex += lineLength;
  }

  return (
    <div 
      id="editor-canvas-wrapper" 
      className="bg-[#0d111a] dark:bg-dracula-bg border-2 border-[#C5CAFC] dark:border-dracula-selection rounded-2xl shadow-xl shadow-indigo-100/40 dark:shadow-none relative flex flex-col overflow-hidden min-h-[460px] transition-colors duration-200"
    >
      
      {/* Editor Header / IDE simulation tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-[#07090e] dark:bg-dracula-card border-b border-[#1e293b]/70 dark:border-dracula-selection select-none transition-colors duration-200">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 block" />
          </div>
          <div className="h-4 w-px bg-[#1e293b] dark:bg-dracula-selection" />
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 dark:text-dracula-pink font-mono bg-[#161c28] dark:bg-dracula-bg px-3 py-1.5 rounded-lg border border-[#252f44] dark:border-dracula-selection">
            <Terminal size={12} />
            <span>{project}</span>
          </div>
        </div>

        {/* Mechanical Sound Settings Panel */}
        <div className="flex items-center justify-between sm:justify-center gap-2.5 bg-[#161c28] dark:bg-dracula-bg px-3 py-1.5 rounded-xl border border-[#252f44] dark:border-dracula-selection self-stretch sm:self-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMute}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isMuted ? 'text-[#6b7280] hover:text-[#9ca3af]' : 'text-indigo-400 dark:text-dracula-purple hover:text-indigo-300'
              }`}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            
            <div className="h-3 w-px bg-[#252f44] dark:bg-dracula-selection" />

            <div className="flex items-center gap-1">
              <span className="text-[9px] text-slate-500 dark:text-dracula-comment font-black uppercase font-mono mr-1">Switch:</span>
              {(['brown', 'blue', 'red'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleChangeSwitch(type)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono transition-all cursor-pointer ${
                    switchType === type 
                      ? 'bg-indigo-500/10 dark:bg-dracula-purple/10 text-indigo-400 dark:text-dracula-purple border border-indigo-500/30 dark:border-dracula-purple/30' 
                      : 'text-slate-500 dark:text-dracula-comment hover:text-slate-300 dark:hover:text-dracula-foreground hover:bg-slate-800 dark:hover:bg-dracula-selection border border-transparent'
                  }`}
                  title={`${type.charAt(0).toUpperCase() + type.slice(1)} Switch`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-3 w-px bg-[#252f44] dark:bg-dracula-selection hidden xs:block" />

          {/* Volume Control Slider */}
          <div className="items-center gap-1.5 hidden xs:flex">
            <span className="text-[9px] text-slate-500 dark:text-dracula-comment font-black uppercase font-mono">Vol:</span>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isMuted}
              className="w-12 h-1 bg-gray-800 dark:bg-[#1a1b22] rounded-lg appearance-none cursor-pointer accent-indigo-500 dark:accent-dracula-purple disabled:opacity-40 disabled:cursor-not-allowed"
              title="Keyboard volume"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-2 text-[11px] text-[#6b7280] dark:text-dracula-comment">
          <span>UTF-8</span>
          <span className="h-3 w-px bg-[#1e293b] dark:bg-dracula-selection" />
          <span className="text-emerald-400 dark:text-dracula-green font-bold bg-emerald-500/10 dark:bg-dracula-green/10 px-2 py-0.5 rounded-full border border-emerald-500/20 dark:border-dracula-green/20">
            {title}
          </span>
        </div>
      </div>

      {/* Editor Main Canvas with dynamic line numbers */}
      <div 
        ref={editorContainerRef}
        onClick={handleContainerClick}
        className="flex-1 overflow-y-auto p-5 font-mono text-sm sm:text-[15px] leading-relaxed relative max-h-[420px] custom-scrollbar cursor-text"
      >
        
        {/* Hidden textarea to capture keystrokes natively */}
        <textarea
          ref={hiddenInputRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />

        {/* Focus Lost Glassmorphic Blur Indicator */}
        {!isFocused && !isFinished && (
          <div className="absolute inset-0 bg-[#0f141ca0] dark:bg-[#12131aa0] backdrop-blur-xs flex flex-col items-center justify-center z-20 gap-3 transition-all duration-300">
            <div className="bg-[#1f2937]/90 dark:bg-dracula-card/95 border border-yellow-500/30 dark:border-dracula-yellow/30 p-5 rounded-2xl text-center max-w-xs shadow-xl animate-pulse">
              <ShieldAlert className="text-yellow-400 dark:text-dracula-yellow mx-auto mb-2" size={32} />
              <h4 className="text-sm font-bold text-white dark:text-dracula-foreground">Typing Test Paused</h4>
              <p className="text-xs text-gray-400 dark:text-dracula-comment mt-1">Click anywhere in this code editor window to resume typing.</p>
            </div>
          </div>
        )}

        {/* The beautiful lines of code */}
        <div className="flex flex-col">
          {lineDetails.map((line, lineIdx) => {
            const isActiveLine = lineIdx === activeLineIndex;

            return (
              <div 
                key={lineIdx} 
                className={`flex items-start group min-h-[24px] ${
                  isActiveLine ? 'bg-blue-500/5 dark:bg-dracula-purple/5 active-typing-line border-l-2 border-blue-500/50 dark:border-dracula-purple/50 pl-0' : 'pl-[2px]'
                }`}
              >
                {/* Line numbers gutter */}
                <span className={`w-8 text-right select-none pr-3 text-xs font-bold leading-normal mt-[3px] ${
                  isActiveLine ? 'text-blue-400 dark:text-dracula-pink font-black' : 'text-gray-600 dark:text-dracula-comment group-hover:text-gray-400 dark:group-hover:text-dracula-foreground'
                }`}>
                  {lineIdx + 1}
                </span>

                {/* Line characters container */}
                <div className="flex-1 whitespace-pre-wrap break-all relative">
                  {line.chars.map((charObj) => {
                    const isTyped = charObj.globalIndex < currentTypedCount;
                    const isCursor = charObj.globalIndex === currentTypedCount;
                    
                    let charColorClass = 'text-gray-500 dark:text-dracula-comment/60'; // Untyped default
                    if (isTyped) {
                      const typedChar = userInput[charObj.globalIndex];
                      const targetChar = charObj.char;
                      const isCorrect = typedChar === targetChar;
                      
                      charColorClass = isCorrect 
                        ? 'text-emerald-400 dark:text-dracula-green font-medium' 
                        : 'text-red-400 dark:text-dracula-red bg-red-500/10 dark:bg-dracula-red/10 underline decoration-wavy decoration-red-500 dark:decoration-dracula-red font-bold';
                    }

                    return (
                      <span key={charObj.globalIndex} className="relative inline">
                        {/* Cursor indicator */}
                        {isCursor && isFocused && (
                          <span className="absolute -top-[1px] left-0 w-[2px] h-[19px] bg-blue-400 dark:bg-dracula-pink animate-pulse shadow-sm shadow-blue-400 dark:shadow-dracula-pink" />
                        )}
                        <span className={charColorClass}>
                          {/* Render visual spaces and tabs for better touch feedback */}
                          {charObj.char === '\t' ? '    ' : charObj.char}
                        </span>
                      </span>
                    );
                  })}

                  {/* Handle cursor at the newline character (end of line) */}
                  {currentTypedCount === line.newlineGlobalIndex && (
                    <span className="relative inline">
                      {isFocused && (
                        <span className="absolute -top-[1px] left-0 w-[2px] h-[19px] bg-blue-400 dark:bg-dracula-pink animate-pulse shadow-sm shadow-blue-400 dark:shadow-dracula-pink" />
                      )}
                      <span className="text-gray-700 dark:text-dracula-comment font-mono text-[11px] select-none pl-1 opacity-40">⏎</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Editor Footer: Interactive Progress Indicator */}
      <div className="px-5 py-3 bg-[#07090e] dark:bg-dracula-card border-t border-[#1e293b]/70 dark:border-dracula-selection flex items-center justify-between text-xs select-none transition-colors duration-200">
        <div className="flex items-center gap-2 text-slate-500 dark:text-dracula-comment">
          <span>Concept:</span>
          <span className="text-slate-300 dark:text-dracula-foreground font-semibold">{concept}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-dracula-comment">Progress:</span>
          <span className="text-indigo-400 dark:text-dracula-purple font-bold font-mono">
            {currentTypedCount} / {totalCharsCount} chars
          </span>
          <div className="w-16 bg-[#161c28] dark:bg-[#21222c] rounded-full h-1.5 overflow-hidden border border-[#252f44]/50 dark:border-dracula-selection">
            <div 
              className="bg-indigo-500 dark:bg-dracula-purple h-full rounded-full transition-all"
              style={{ width: `${(currentTypedCount / totalCharsCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
