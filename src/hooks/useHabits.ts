import { useLocalStorage } from './useLocalStorage';
import type { Habit, DailyLog } from '../types';
import { getTodayString, differenceInDays, formatDateString } from '../utils/dateHelpers';

export const useHabits = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habit-tracker-habits', []);
  const [logs, setLogs] = useLocalStorage<DailyLog[]>('habit-tracker-logs', []);

  const addHabit = (title: string, category: string, targetDaysPerWeek: number = 7) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      category,
      createdAt: Date.now(),
      currentStreak: 0,
      longestStreak: 0,
      isActive: true,
      targetDaysPerWeek,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const removeHabit = (id: string) => {
    setHabits((prev) => prev.filter(h => h.id !== id));
    setLogs((prev) => prev.filter(l => l.habitId !== id));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const calculateStreaks = (habitId: string, currentLogs: DailyLog[]) => {
    const habitLogs = currentLogs
      .filter((log) => log.habitId === habitId && log.completed)
      .map((log) => log.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (habitLogs.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let longest = 1;
    let current = 1;
    for (let i = 0; i < habitLogs.length - 1; i++) {
        const diff = differenceInDays(habitLogs[i], habitLogs[i + 1]);
        if (diff === 1) {
            current++;
            if (current > longest) longest = current;
        } else if (diff > 1) {
            current = 1;
        }
    }

    let currentStreak = 0;
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterStr = formatDateString(yesterday);

    if (habitLogs[0] === today || habitLogs[0] === yesterStr) {
      currentStreak = 1;
      for (let i = 0; i < habitLogs.length - 1; i++) {
        if (differenceInDays(habitLogs[i], habitLogs[i + 1]) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return { currentStreak, longestStreak: longest };
  };

  const toggleHabitComplete = (habitId: string, date: string) => {
    setLogs((prevLogs) => {
      let newLogs = [...prevLogs];
      const existingLogIndex = newLogs.findIndex(
        (l) => l.habitId === habitId && l.date === date
      );

      if (existingLogIndex >= 0) {
        // Toggle
        newLogs[existingLogIndex] = {
          ...newLogs[existingLogIndex],
          completed: !newLogs[existingLogIndex].completed,
        };
      } else {
        // Add
        newLogs.push({
          id: crypto.randomUUID(),
          habitId,
          date,
          completed: true,
        });
      }

      // Automatically recalculate streaks for this habit
      const { currentStreak, longestStreak } = calculateStreaks(habitId, newLogs);
      
      setHabits((prevHabits) => 
        prevHabits.map((h) => {
          if (h.id === habitId) {
            // keep the previous longest if we uncheck and it drops
            const maxLongest = Math.max(h.longestStreak, longestStreak);
            return { ...h, currentStreak, longestStreak: maxLongest };
          }
          return h;
        })
      );

      return newLogs;
    });
  };

  const reorderHabit = (draggedId: string, targetId: string) => {
    setHabits((prev) => {
      const result = Array.from(prev);
      const draggedIndex = result.findIndex(h => h.id === draggedId);
      const targetIndex = result.findIndex(h => h.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const [removed] = result.splice(draggedIndex, 1);
      result.splice(targetIndex, 0, removed);
      return result;
    });
  };

  return {
    habits,
    logs,
    addHabit,
    removeHabit,
    updateHabit,
    toggleHabitComplete,
    reorderHabit,
  };
};
