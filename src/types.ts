export type Language = 'go' | 'python';

export interface Level {
  id: number;
  title: string;
  concept: string;
  project: string;
  code: string;
  description: string;
  estimatedWpmGoal: number;
}

export interface TypingStats {
  wpm: number;
  netWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  backspaceCount: number;
  errorCount: number;
}

export interface UserProgress {
  completedLevels: Record<Language, number[]>; // Array of level IDs completed
  streak: number;
  lastCompletedDate: string | null; // ISO Date string
  xp: number;
}
