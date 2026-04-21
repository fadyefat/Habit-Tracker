import type { MascotState } from '../types';

export interface MascotStatus {
  state: MascotState;
  text: string;
}

export const getMascotStatus = (
  completedToday: number,
  totalActiveToday: number,
  longestCurrentStreak: number,
  currentHour: number // 0-23
): MascotStatus => {
  if (totalActiveToday === 0) {
    return { state: 'idle', text: "Ready to crush today's goals? Add a habit!" };
  }

  if (completedToday === totalActiveToday) {
    return { state: 'celebrating', text: "All tasks completed! You are unstoppable today!" };
  }

  if (completedToday > 0 && completedToday < totalActiveToday) {
    return { state: 'happy', text: "Great progress! Let's finish the rest." };
  }

  if (completedToday === 0) {
    if (currentHour >= 20) {
      return { state: 'warning', text: "Careful, your streak is in danger! Do at least one task." };
    }
    if (longestCurrentStreak >= 7) {
      return { state: 'encouraging', text: `You have a ${longestCurrentStreak}-day streak! Don't let yesterday's hard work go to waste.` };
    }
  }

  return { state: 'idle', text: "Ready to crush today's goals?" };
};
