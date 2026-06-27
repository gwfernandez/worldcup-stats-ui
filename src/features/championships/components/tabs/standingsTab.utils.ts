export const pointsPerWinForYear = (year: number): 2 | 3 => (year < 1994 ? 2 : 3);

export const calcPerformance = (points: number, played: number, year: number): number => {
  if (played === 0) return 0;
  return Math.round((points / (played * pointsPerWinForYear(year))) * 100);
};
