import { JournalEntry, UserStats, CalendarDay } from '../types';
import { startOfDay, differenceInDays, parseISO, isSameDay } from 'date-fns';

export function calculateUserStats(entries: JournalEntry[]): UserStats {
  if (entries.length === 0) {
    return {
      total_entries: 0,
      current_streak: 0,
      longest_streak: 0,
      total_words: 0,
      days_journaled: 0,
    };
  }

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Calculate total words
  const total_words = entries.reduce((sum, entry) => {
    const words = entry.content.trim().split(/\s+/).length;
    return sum + words;
  }, 0);

  // Get unique days
  const uniqueDays = new Set(
    sortedEntries.map(entry =>
      startOfDay(parseISO(entry.created_at)).toISOString()
    )
  );
  const days_journaled = uniqueDays.size;

  // Calculate streaks
  const { current_streak, longest_streak } = calculateStreaks(sortedEntries);

  return {
    total_entries: entries.length,
    current_streak,
    longest_streak,
    total_words,
    days_journaled,
  };
}

function calculateStreaks(sortedEntries: JournalEntry[]): { current_streak: number; longest_streak: number } {
  if (sortedEntries.length === 0) {
    return { current_streak: 0, longest_streak: 0 };
  }

  const today = startOfDay(new Date());
  const entryDates = sortedEntries.map(entry => startOfDay(parseISO(entry.created_at)));

  // Get unique dates
  const uniqueDates = Array.from(new Set(entryDates.map(d => d.toISOString())))
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

  // Calculate current streak
  let current_streak = 0;
  let checkDate = today;

  for (const entryDate of uniqueDates) {
    const diff = differenceInDays(checkDate, entryDate);

    if (diff === 0) {
      current_streak++;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000); // Previous day
    } else if (diff === 1) {
      current_streak++;
      checkDate = entryDate;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longest_streak = 0;
  let tempStreak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const diff = differenceInDays(uniqueDates[i], uniqueDates[i + 1]);

    if (diff === 1) {
      tempStreak++;
      longest_streak = Math.max(longest_streak, tempStreak);
    } else {
      longest_streak = Math.max(longest_streak, tempStreak);
      tempStreak = 1;
    }
  }

  longest_streak = Math.max(longest_streak, tempStreak, current_streak);

  return { current_streak, longest_streak };
}

export function getCalendarDays(entries: JournalEntry[], month: Date): CalendarDay[] {
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const calendarDays: CalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const entriesOnDay = entries.filter(entry =>
      isSameDay(parseISO(entry.created_at), date)
    );

    calendarDays.push({
      date,
      hasEntry: entriesOnDay.length > 0,
      entryCount: entriesOnDay.length,
    });
  }

  return calendarDays;
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return `Good morning, ${name}`;
  } else if (hour < 17) {
    return `Good afternoon, ${name}`;
  } else {
    return `Good evening, ${name}`;
  }
}
