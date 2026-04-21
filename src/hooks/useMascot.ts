import { useState, useEffect } from 'react';
import { useHabits } from './useHabits';
import { getMascotStatus } from '../utils/mascotBrain';
import type { MascotStatus } from '../utils/mascotBrain';
import { getTodayString } from '../utils/dateHelpers';

export const useMascot = () => {
  const { habits, logs } = useHabits();
  const [mascotStatus, setMascotStatus] = useState<MascotStatus>({ state: 'idle', text: "Ready to crush today's goals?" });

  useEffect(() => {
    const today = getTodayString();
    
    const activeHabits = habits.filter(h => h.isActive);
    const totalActiveToday = activeHabits.length;

    const completedToday = logs.filter(
      l => l.date === today && l.completed && activeHabits.some(h => h.id === l.habitId)
    ).length;

    const longestCurrentStreak = habits.reduce((max, habit) => {
      if (habit.isActive && habit.currentStreak > max) {
        return habit.currentStreak;
      }
      return max;
    }, 0);

    const currentHour = new Date().getHours();

    const newStatus = getMascotStatus(
      completedToday,
      totalActiveToday,
      longestCurrentStreak,
      currentHour
    );

    setMascotStatus(newStatus);
  }, [habits, logs]);

  return mascotStatus;
};
