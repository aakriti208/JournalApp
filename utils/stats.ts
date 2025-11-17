import { JournalEntry } from "@/types";

export const calculateStreak = (entries: JournalEntry[]): number => {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let streak = 1;
  let currentDate = new Date(sortedEntries[0].created_at);

  for (let i = 1; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].created_at);
    const dayDifference = Math.floor(
      (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDifference === 1) {
      streak++;
      currentDate = entryDate;
    } else if (dayDifference > 1) {
      break;
    }
  }

  return streak;
};

export const getTotalWordCount = (entries: JournalEntry[]): number => {
  return entries.reduce((total, entry) => {
    const words = entry.content.trim().split(/\s+/).length;
    return total + words;
  }, 0);
};

export const getEntriesByMonth = (
  entries: JournalEntry[],
  month: number,
  year: number
): JournalEntry[] => {
  return entries.filter((entry) => {
    const date = new Date(entry.created_at);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};
