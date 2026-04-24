import { useLocalStorage } from './useLocalStorage';
import type { Habit, DailyLog } from '../types';
import { getTodayString, differenceInDays, formatDateString } from '../utils/dateHelpers';

export const useHabits = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habit-tracker-habits', []);
  const [logs, setLogs] = useLocalStorage<DailyLog[]>('habit-tracker-logs', []);

  const addHabit = (title: string, category: string, targetDaysPerWeek: number = 7, workPeriod: number = 0, restPeriod: number = 0) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      category,
      createdAt: Date.now(),
      currentStreak: 0,
      longestStreak: 0,
      isActive: true,
      targetDaysPerWeek,
      workPeriod,
      restPeriod,
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

    const habitLogs = currentLogs
      .filter((log) => log.habitId === habit.id && log.completed)
      .map((log) => log.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Oldest first

    const firstLogDateStr = habitLogs.length > 0 ? habitLogs[0] : formatDateString(new Date(habit.createdAt));
    const startDateStr = firstLogDateStr;
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    // Iterate from start date to today
    const curr = parseDateString(startDateStr);
    const todayDate = new Date();
    todayDate.setHours(23, 59, 59, 999); // End of today

    while (curr <= todayDate) {
      const dateStr = formatDateString(curr);
      const isComplete = currentLogs.some(l => l.habitId === habit.id && l.date === dateStr && l.completed);
      
      const isRest = habit.workPeriod && habit.restPeriod ? 
        ((differenceInDays(dateStr, startDateStr) % (habit.workPeriod + habit.restPeriod)) >= habit.workPeriod) : 
        false;

      if (isRest) {
        // Rest day - streak continues (don't reset), but don't increment it
        // Unless you want it to count as a day of streak. 
        // User seems to expect 6 in his example, which means rest day isn't counted.
      } else {
        // Work day
        if (isComplete) {
          currentStreak++;
        } else {
          // If it's today and not yet complete, don't break the streak yet, but don't increment
          if (dateStr === today) {
            // Keep streak from yesterday
          } else {
            currentStreak = 0;
          }
        }
      }

      if (currentStreak > longestStreak) longestStreak = currentStreak;
      
      // Next day
      curr.setDate(curr.getDate() + 1);
    }

    return { currentStreak, longestStreak };
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
      if (!habit) return newLogs;
      const { currentStreak, longestStreak } = calculateStreaks(habit, newLogs);
      
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
