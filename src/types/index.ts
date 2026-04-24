export interface Habit {
  id: string;
  title: string;
  category: string;
  createdAt: number;
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  targetDaysPerWeek: number;
  workPeriod?: number; // Days to work
  restPeriod?: number; // Days to rest
}

export interface DailyLog {
  id: string;
  habitId: string;
  date: string; // Format: 'YYYY-MM-DD'
  completed: boolean;
}

export interface UserStats {
  totalPoints: number;
  completedTasksCount: number;
}

export type MascotState = 'idle' | 'happy' | 'encouraging' | 'celebrating' | 'warning';
