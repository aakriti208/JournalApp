/**
 * TypeScript Type Definitions
 */

export interface User {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id'>>;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<JournalEntry, 'id' | 'user_id'>>;
      };
    };
  };
}
