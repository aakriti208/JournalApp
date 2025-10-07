/**
 * Chat Types for Journal App
 * Defines all TypeScript interfaces for the conversational chat interface
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  entryId?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  currentEntryId: string | null;
  userName: string;
  error: string | null;
}
