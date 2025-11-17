import { supabase } from './supabase';
import { JournalEntry } from '../types';

export const journalService = {
  async createEntry(entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEntry(id: string, updates: Partial<JournalEntry>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEntry(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getEntry(id: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserEntries(userId: string, limit?: number) {
    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async searchEntries(userId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getEntriesByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
