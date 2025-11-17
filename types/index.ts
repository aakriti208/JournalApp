export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  mood?: string;
  tags?: string[];
}

export interface Prompt {
  id: string;
  category: 'gratitude' | 'relationships' | 'achievements' | 'memory' | 'general';
  text: string;
  is_ai_generated: boolean;
  created_at: string;
}

export interface UserStats {
  total_entries: number;
  current_streak: number;
  longest_streak: number;
  total_words: number;
  days_journaled: number;
}

export interface AIInsight {
  id: string;
  user_id: string;
  themes: string[];
  emotions: string[];
  suggestions: string[];
  generated_at: string;
}

export interface CalendarDay {
  date: Date;
  hasEntry: boolean;
  entryCount: number;
}

export type PromptCategory = 'gratitude' | 'relationships' | 'achievements' | 'memory' | 'general' | 'all';
