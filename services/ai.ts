import Constants from 'expo-constants';
import { JournalEntry, AIInsight, Prompt } from '../types';

const AI_API_URL = Constants.expoConfig?.extra?.aiApiUrl || process.env.EXPO_PUBLIC_AI_API_URL || '';
const AI_API_KEY = Constants.expoConfig?.extra?.aiApiKey || process.env.EXPO_PUBLIC_AI_API_KEY || '';

export const aiService = {
  async analyzeEntries(entries: JournalEntry[]): Promise<AIInsight> {
    try {
      const response = await fetch(`${AI_API_URL}/api/analyze-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze entries');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing entries:', error);
      throw error;
    }
  },

  async generatePrompt(userHistory: JournalEntry[], category?: string): Promise<Prompt> {
    try {
      const response = await fetch(`${AI_API_URL}/api/generate-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({ userHistory, category }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw error;
    }
  },

  async suggestTopics(entries: JournalEntry[]): Promise<string[]> {
    try {
      const response = await fetch(`${AI_API_URL}/api/suggest-topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) {
        throw new Error('Failed to suggest topics');
      }

      const data = await response.json();
      return data.topics;
    } catch (error) {
      console.error('Error suggesting topics:', error);
      throw error;
    }
  },
};
