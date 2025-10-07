/**
 * Supabase Service
 * Handles database operations for journal entries and messages
 */

import { JournalEntry, Message, User } from '@/types/chat.types';

// Mock implementation - replace with actual Supabase client
// To use real Supabase:
// 1. Install: npm install @supabase/supabase-js
// 2. Import: import { createClient } from '@supabase/supabase-js'
// 3. Initialize: const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

class SupabaseService {
  private mockUser: User = {
    id: 'user-123',
    name: 'Alex',
    email: 'alex@example.com',
  };

  private mockEntries: Map<string, JournalEntry> = new Map();

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    // Simulate API delay
    await this.delay(100);
    return this.mockUser;
  }

  /**
   * Get today's journal entry
   * @param userId - User ID
   * @returns Journal entry if exists, null otherwise
   */
  async getTodayEntry(userId: string): Promise<JournalEntry | null> {
    await this.delay(200);

    const today = new Date().toISOString().split('T')[0];
    const entryKey = `${userId}-${today}`;

    return this.mockEntries.get(entryKey) || null;
  }

  /**
   * Create a new journal entry for today
   * @param userId - User ID
   * @returns Newly created journal entry
   */
  async createTodayEntry(userId: string): Promise<JournalEntry> {
    await this.delay(150);

    const today = new Date().toISOString().split('T')[0];
    const entryKey = `${userId}-${today}`;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      userId,
      date: today,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockEntries.set(entryKey, newEntry);
    return newEntry;
  }

  /**
   * Save a message to the database
   * @param entryId - Journal entry ID
   * @param message - Message to save
   */
  async saveMessage(entryId: string, message: Message): Promise<void> {
    await this.delay(100);

    // In real implementation, this would insert into messages table
    // For mock: find entry and add message
    for (const [key, entry] of this.mockEntries.entries()) {
      if (entry.id === entryId) {
        entry.messages.push(message);
        entry.updatedAt = new Date();
        this.mockEntries.set(key, entry);
        break;
      }
    }
  }

  /**
   * Get messages for a specific entry
   * @param entryId - Journal entry ID
   * @returns Array of messages
   */
  async getMessages(entryId: string): Promise<Message[]> {
    await this.delay(150);

    for (const entry of this.mockEntries.values()) {
      if (entry.id === entryId) {
        return entry.messages;
      }
    }

    return [];
  }

  /**
   * Utility function to simulate API delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const supabase = new SupabaseService();
