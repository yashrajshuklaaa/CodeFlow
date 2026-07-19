import React from 'react';

interface KeyboardMapProps {
  nextChar: string | null;
}

export const KeyboardMap: React.FC<KeyboardMapProps> = ({ nextChar }) => {
  // Normalize next char for keyboard mapping
  const getActiveKeyAndFinger = (char: string | null): { key: string; finger: string; hand: 'left' | 'right' | 'thumb'; isShift: boolean } => {
    if (!char) return { key: '', finger: '', hand: 'thumb', isShift: false };

    // Spaces
    if (char === ' ' || char === '\n' || char === '\t') {
      return { key: 'SPACE', finger: 'Thumb', hand: 'thumb', isShift: false };
    }

    const c = char.toLowerCase();
    let key = c;
    let isShift = char !== c && char.toUpperCase() === char && /[A-Z]/.test(char);
    let finger = 'Pinky';
    let hand: 'left' | 'right' | 'thumb' = 'left';

    // Handle symbols and their shifts
    const shiftSymbols: Record<string, { key: string; isShift: boolean }> = {
      '!': { key: '1', isShift: true },
      '@': { key: '2', isShift: true },
      '#': { key: '3', isShift: true },
      '$': { key: '4', isShift: true },
      '%': { key: '5', isShift: true },
      '^': { key: '6', isShift: true },
      '&': { key: '7', isShift: true },
      '*': { key: '8', isShift: true },
      '(': { key: '9', isShift: true },
      ')': { key: '0', isShift: true },
      '_': { key: '-', isShift: true },
      '+': { key: '=', isShift: true },
      '{': { key: '[', isShift: true },
      '}': { key: ']', isShift: true },
      ':': { key: ';', isShift: true },
      '"': { key: "'", isShift: true },
      '<': { key: ',', isShift: true },
      '>': { key: '.', isShift: true },
      '?': { key: '/', isShift: true },
      '|': { key: '\\', isShift: true },
      '~': { key: '`', isShift: true },
    };

    if (shiftSymbols[char]) {
      key = shiftSymbols[char].key;
      isShift = shiftSymbols[char].isShift;
    }

    // Map finger and hand
    const leftPinky = ['1', 'q', 'a', 'z', '`', 'tab', 'caps', 'shift', 'ctrl'];
    const leftRing = ['2', 'w', 's', 'x'];
    const leftMiddle = ['3', 'e', 'd', 'c'];
    const leftIndex = ['4', '5', 'r', 't', 'f', 'g', 'v', 'b'];

    const rightIndex = ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'];
    const rightMiddle = ['8', 'i', 'k', ','];
    const rightRing = ['9', 'o', 'l', '.'];
    const rightPinky = ['0', '-', '=', 'p', '[', ']', ';', "'", '\\', '/', 'enter', 'backspace'];

    if (leftPinky.includes(key)) {
      finger = 'Pinky';
      hand = 'left';
    } else if (leftRing.includes(key)) {
      finger = 'Ring';
      hand = 'left';
    } else if (leftMiddle.includes(key)) {
      finger = 'Middle';
      hand = 'left';
    } else if (leftIndex.includes(key)) {
      finger = 'Index';
      hand = 'left';
    } else if (rightIndex.includes(key)) {
      finger = 'Index';
      hand = 'right';
    } else if (rightMiddle.includes(key)) {
      finger = 'Middle';
      hand = 'right';
    } else if (rightRing.includes(key)) {
      finger = 'Ring';
      hand = 'right';
    } else if (rightPinky.includes(key)) {
      finger = 'Pinky';
      hand = 'right';
    }

    return { key: key.toUpperCase(), finger, hand, isShift };
  };

  const { key: activeKey, finger, hand, isShift } = getActiveKeyAndFinger(nextChar);

  // Keyboard Rows definition
  const row1 = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACKSPACE'];
  const row2 = ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'];
  const row3 = ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'];
  const row4 = ['LSHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'RSHIFT'];
  const row5 = ['SPACE'];

  const getKeyLabel = (k: string) => {
    if (k === 'LSHIFT' || k === 'RSHIFT') return 'Shift';
    if (k === 'BACKSPACE') return 'Backspace';
    return k;
  };

  const isKeyActive = (k: string) => {
    if (activeKey === 'SPACE' && k === 'SPACE') return true;
    if (activeKey === k) return true;
    if (isShift && (k === 'LSHIFT' || k === 'RSHIFT')) return true;
    return false;
  };

  const getFingerColorClass = (f: string, h: string) => {
    if (h === 'thumb') return 'bg-yellow-50 dark:bg-dracula-yellow/15 text-yellow-700 dark:text-dracula-yellow border-yellow-200 dark:border-dracula-yellow/30';
    if (h === 'left') {
      if (f === 'Index') return 'bg-indigo-50 dark:bg-dracula-purple/15 text-indigo-700 dark:text-dracula-purple border-indigo-200 dark:border-dracula-purple/30';
      if (f === 'Middle') return 'bg-purple-50 dark:bg-dracula-pink/15 text-purple-700 dark:text-dracula-pink border-purple-200 dark:border-dracula-pink/30';
      if (f === 'Ring') return 'bg-pink-50 dark:bg-dracula-pink/15 text-pink-700 dark:text-dracula-pink border-pink-200 dark:border-dracula-pink/30';
      return 'bg-rose-50 dark:bg-dracula-red/15 text-rose-700 dark:text-dracula-red border-rose-200 dark:border-dracula-red/30';
    } else {
      if (f === 'Index') return 'bg-emerald-50 dark:bg-dracula-green/15 text-emerald-700 dark:text-dracula-green border-emerald-200 dark:border-dracula-green/30';
      if (f === 'Middle') return 'bg-teal-50 dark:bg-dracula-cyan/15 text-teal-700 dark:text-dracula-cyan border-teal-200 dark:border-dracula-cyan/30';
      if (f === 'Ring') return 'bg-cyan-50 dark:bg-dracula-cyan/15 text-cyan-700 dark:text-dracula-cyan border-cyan-200 dark:border-dracula-cyan/30';
      return 'bg-orange-50 dark:bg-dracula-orange/15 text-orange-700 dark:text-dracula-orange border-orange-200 dark:border-dracula-orange/30';
    }
  };

  const activeFingerLabel = nextChar 
    ? `${hand === 'thumb' ? '' : hand.toUpperCase() + ' '}${finger}` 
    : 'None';

  return (
    <div id="keyboard-map-root" className="bg-white/90 dark:bg-dracula-card rounded-2xl border border-[#D0D4FC]/60 dark:border-dracula-selection p-5 shadow-xs flex flex-col gap-4 backdrop-blur-md transition-all duration-200">
      
      {/* Target Coaching Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D0D4FC]/40 dark:border-dracula-selection pb-3">
        <div>
          <h4 className="text-xs font-bold text-[#4F4F6A] dark:text-dracula-purple tracking-wider uppercase font-display">Touch-Typing Finger Guide</h4>
          <p className="text-[11px] text-[#7C7C9A] dark:text-dracula-comment mt-0.5 font-sans">Learn muscle memory by using the recommended hand and finger.</p>
        </div>
        {nextChar ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-dracula-comment font-medium font-sans">Next key:</span>
            <span className="font-mono bg-indigo-50 dark:bg-dracula-purple/15 text-indigo-700 dark:text-dracula-purple px-2.5 py-0.5 rounded border border-indigo-200 dark:border-dracula-purple/30 font-bold text-sm">
              {nextChar === ' ' ? 'Spacebar' : nextChar === '\n' ? 'Enter' : nextChar === '\t' ? 'Tab' : nextChar}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border font-sans ${getFingerColorClass(finger, hand)}`}>
              👉 {activeFingerLabel}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-dracula-comment italic font-sans">No key expected (Completed or Idle)</span>
        )}
      </div>

      {/* Visual QWERTY Layout */}
      <div className="flex flex-col gap-1.5 select-none font-mono">
        
        {/* Row 1 */}
        <div className="flex gap-1 justify-center w-full">
          {row1.map((k) => (
            <div
              key={k}
              className={`h-9 text-[10px] font-bold rounded flex items-center justify-center border transition-all ${
                k === 'BACKSPACE' ? 'w-16' : 'w-8'
              } ${
                isKeyActive(k)
                  ? 'bg-indigo-600 dark:bg-dracula-purple border-indigo-600 dark:border-dracula-purple text-white dark:text-dracula-card shadow-xs scale-95'
                  : 'bg-slate-100/70 dark:bg-[#21222c] border-slate-200/80 dark:border-dracula-selection text-slate-500 dark:text-[#a5afc8]'
              }`}
            >
              {getKeyLabel(k)}
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-1 justify-center w-full">
          {row2.map((k) => (
            <div
              key={k}
              className={`h-9 text-[10px] font-bold rounded flex items-center justify-center border transition-all ${
                k === 'TAB' ? 'w-12' : 'w-8'
              } ${
                isKeyActive(k)
                  ? 'bg-indigo-600 dark:bg-dracula-purple border-indigo-600 dark:border-dracula-purple text-white dark:text-dracula-card shadow-xs scale-95'
                  : 'bg-slate-100/70 dark:bg-[#21222c] border-slate-200/80 dark:border-dracula-selection text-slate-500 dark:text-[#a5afc8]'
              }`}
            >
              {getKeyLabel(k)}
            </div>
          ))}
        </div>

        {/* Row 3 with F/J Bump highlights */}
        <div className="flex gap-1 justify-center w-full">
          {row3.map((k) => {
            const hasBump = k === 'F' || k === 'J';
            return (
              <div
                key={k}
                className={`h-9 text-[10px] font-bold rounded flex items-center justify-center border transition-all relative ${
                  k === 'CAPS' ? 'w-14' : k === 'ENTER' ? 'w-14' : 'w-8'
                } ${
                  isKeyActive(k)
                    ? 'bg-indigo-600 dark:bg-dracula-purple border-indigo-600 dark:border-dracula-purple text-white dark:text-dracula-card shadow-xs scale-95'
                    : 'bg-slate-100/70 dark:bg-[#21222c] border-slate-200/80 dark:border-dracula-selection text-slate-500 dark:text-[#a5afc8]'
                }`}
              >
                {getKeyLabel(k)}
                {/* Physical Bump Indicator on Home Row F & J */}
                {hasBump && (
                  <div className="absolute bottom-1 w-2.5 h-0.5 bg-slate-400 dark:bg-dracula-comment rounded" />
                )}
              </div>
            );
          })}
        </div>

        {/* Row 4 */}
        <div className="flex gap-1 justify-center w-full">
          {row4.map((k) => (
            <div
              key={k}
              className={`h-9 text-[10px] font-bold rounded flex items-center justify-center border transition-all ${
                k === 'LSHIFT' || k === 'RSHIFT' ? 'w-16' : 'w-8'
              } ${
                isKeyActive(k)
                  ? 'bg-indigo-600 dark:bg-dracula-purple border-indigo-600 dark:border-dracula-purple text-white dark:text-dracula-card shadow-xs scale-95'
                  : 'bg-slate-100/70 dark:bg-[#21222c] border-slate-200/80 dark:border-dracula-selection text-slate-500 dark:text-[#a5afc8]'
              }`}
            >
              {getKeyLabel(k)}
            </div>
          ))}
        </div>

        {/* Row 5 - Spacebar */}
        <div className="flex gap-1 justify-center w-full">
          <div
            className={`h-9 text-[10px] font-bold rounded flex items-center justify-center border transition-all w-64 ${
              isKeyActive('SPACE')
                ? 'bg-indigo-600 dark:bg-dracula-purple border-indigo-600 dark:border-dracula-purple text-white dark:text-dracula-card shadow-xs scale-95'
                : 'bg-slate-100/70 dark:bg-[#21222c] border-slate-200/80 dark:border-dracula-selection text-slate-500 dark:text-[#a5afc8]'
            }`}
          >
            Spacebar
          </div>
        </div>

      </div>

      {/* Ergonomic Finger Placement Legends */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[10px] text-slate-500 dark:text-dracula-comment border-t border-[#D0D4FC]/40 dark:border-dracula-selection pt-2.5 font-sans">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-pink-100 dark:bg-dracula-pink/20 border border-pink-300 dark:border-dracula-pink/40" />
          <span>Left Pinky / Ring / Mid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-indigo-100 dark:bg-dracula-purple/20 border border-indigo-300 dark:border-dracula-purple/40" />
          <span>Left Index / Thumbs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-dracula-green/20 border border-emerald-300 dark:border-dracula-green/40" />
          <span>Right Index / Mid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-orange-100 dark:bg-dracula-orange/20 border border-orange-300 dark:border-dracula-orange/40" />
          <span>Right Ring / Pinky</span>
        </div>
      </div>

    </div>
  );
};
