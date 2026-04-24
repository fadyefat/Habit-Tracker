/**
 * Returns the current date as a 'YYYY-MM-DD' string.
 */
export const getTodayString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns a 'YYYY-MM-DD' string for a given Date object.
 */
export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses a 'YYYY-MM-DD' string to a local Date at midnight.
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Calculates the difference in days between two 'YYYY-MM-DD' strings.
 */
export const differenceInDays = (dateStr1: string, dateStr2: string): number => {
  const d1 = parseDateString(dateStr1);
  const d2 = parseDateString(dateStr2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Checks if target is exactly one day before today (for streaks).
 */
export const isYesterday = (dateStr: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === formatDateString(yesterday);
};

/**
 * Checks if a date is a rest day based on work/rest periods.
 */
export const isRestDay = (workPeriod: number, restPeriod: number, startDateStr: string, targetDateStr: string): boolean => {
  if (!workPeriod || !restPeriod) return false;
  const diff = differenceInDays(targetDateStr, startDateStr);
  const cycleLength = workPeriod + restPeriod;
  const position = diff % cycleLength;
  return position >= workPeriod;
};
