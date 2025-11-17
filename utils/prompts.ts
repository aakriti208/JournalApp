import { Prompt, PromptCategory } from '../types';

// Fallback prompts when AI is unavailable
export const fallbackPrompts: Prompt[] = [
  // Gratitude
  {
    id: '1',
    category: 'gratitude',
    text: 'What are three things you are grateful for today?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    category: 'gratitude',
    text: 'Who made a positive impact on your life recently?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    category: 'gratitude',
    text: 'What simple pleasure brought you joy today?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },

  // Relationships
  {
    id: '4',
    category: 'relationships',
    text: 'Describe a meaningful conversation you had this week.',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    category: 'relationships',
    text: 'How can you strengthen a relationship that matters to you?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    category: 'relationships',
    text: 'What quality do you appreciate most in your closest friend?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },

  // Achievements
  {
    id: '7',
    category: 'achievements',
    text: 'What progress have you made toward your goals this week?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    category: 'achievements',
    text: 'What challenge did you overcome recently?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    category: 'achievements',
    text: 'What skill or knowledge have you developed lately?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },

  // Memory
  {
    id: '10',
    category: 'memory',
    text: 'What moment from today do you want to remember?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    category: 'memory',
    text: 'Describe a place that holds special meaning for you.',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    category: 'memory',
    text: 'What memory made you smile recently?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },

  // General
  {
    id: '13',
    category: 'general',
    text: 'How are you feeling right now, and why?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '14',
    category: 'general',
    text: 'What lesson did you learn today?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '15',
    category: 'general',
    text: 'What are you looking forward to?',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
];

export function getRandomPrompt(category: PromptCategory = 'all'): Prompt {
  const filtered = category === 'all'
    ? fallbackPrompts
    : fallbackPrompts.filter(p => p.category === category);

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getPromptsByCategory(category: PromptCategory): Prompt[] {
  if (category === 'all') return fallbackPrompts;
  return fallbackPrompts.filter(p => p.category === category);
}
