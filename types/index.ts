// Common types for the app
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  updated_at: string;
}

export interface AIResponse {
  prompt: string;
  response: string;
  timestamp: string;
}
