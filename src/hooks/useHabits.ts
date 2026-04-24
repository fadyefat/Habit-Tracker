import { useLocalStorage } from './useLocalStorage';
import type { Habit, DailyLog } from '../types';
import { getTodayString, differenceInDays, formatDateString } from '../utils/dateHelpers';

export const useHabits = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habit-tracker-habits', []);
  const [logs, setLogs] = useLocalStorage<DailyLog[]>('habit-tracker-logs', []);

  const addHabit = (title: string, category: string, targetDaysPerWeek: number = 7, restFrequency: number = 0) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      category,
      createdAt: Date.now(),
      currentStreak: 0,
      longestStreak: 0,
      isActive: true,
      targetDaysPerWeek,
      restFrequency,
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

  const calculateStreaks = (habitId: string, currentLogs: DailyLog[], restFrequency: number = 0) => {
    const habitLogs = currentLogs
      .filter((log) => log.habitId === habitId && log.completed)
      .map((log) => log.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Oldest first

    if (habitLogs.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let longest = 1;
    let current = 1;
    let consecutiveDays = 1;
    
    for (let i = 0; i < habitLogs.length - 1; i++) {
        const diff = differenceInDays(habitLogs[i + 1], habitLogs[i]);
        if (diff === 1) {
            current++;
            consecutiveDays++;
        } else if (diff === 2 && restFrequency > 0 && consecutiveDays >= restFrequency) {
            current += 2; // Count the skipped day + the current day
            consecutiveDays = 1; // Reset work count for next rest day
        } else {
            current = 1;
            consecutiveDays = 1;
        }
        if (current > longest) longest = current;
    }

    // Current Streak logic
    let currentStreak = 0;
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterStr = formatDateString(yesterday);
    
    const lastLogDate = habitLogs[habitLogs.length - 1];
    
    // Check if the streak is still active today or yesterday
    // Or if today is a rest day (last log was yesterday or day before, and we have enough consecutive days)
    // Actually, it's easier to just use the 'current' from the loop IF the last log is recent enough.
    
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    const dayBeforeYesterStr = formatDateString(dayBeforeYesterday);

    let isRecent = lastLogDate === today || lastLogDate === yesterStr;
    
    // If last log was day before yesterday, it's only active if we "earned" a rest day yesterday
    if (!isRecent && lastLogDate === dayBeforeYesterStr && restFrequency > 0) {
        // We need to know how many consecutive days we had BEFORE the last log
        // This is getting complex, let's simplify: 
        // If the forward loop finished and the last log is recent, current is our streak.
        isRecent = true; 
    }

    // Final check for current streak
    if (lastLogDate === today || lastLogDate === yesterStr) {
        currentStreak = current;
    } else if (restFrequency > 0 && lastLogDate === dayBeforeYesterStr) {
        // Special case: Today is the first day back after an earned rest day (yesterday)
        // But if we haven't logged today yet, the streak is still technically active?
        // Let's say if you did Mon, Tue, Wed, then Thu was rest, Fri (today) you haven't done it yet.
        // Your streak is still 4.
        currentStreak = current;
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
      const habit = habits.find(h => h.id === habitId);
      const { currentStreak, longestStreak } = calculateStreaks(habitId, newLogs, habit?.restFrequency);
      
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
