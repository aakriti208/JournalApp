/**
 * Chat Service
 * Handles AI interactions and streaming responses
 */

import { Message } from '@/types/chat.types';

class ChatService {
  /**
   * Get AI response to user message
   * @param userMessage - User's message content
   * @param conversationHistory - Previous messages for context
   * @param userName - User's name for personalization
   * @returns AI response message
   */
  async getAIResponse(
    userMessage: string,
    conversationHistory: Message[],
    userName: string
  ): Promise<string> {
    // Mock implementation - replace with actual AI API call
    // For production, integrate with OpenAI, Anthropic Claude, or similar

    await this.delay(500); // Simulate API delay

    // Generate contextual response based on user input
    const response = this.generateMockResponse(userMessage, userName);
    return response;
  }

  /**
   * Stream AI response word by word
   * @param response - Full AI response text
   * @param onWord - Callback function called for each word
   * @param delayMs - Delay between words in milliseconds
   */
  async streamResponse(
    response: string,
    onWord: (word: string, isComplete: boolean) => void,
    delayMs: number = 50
  ): Promise<void> {
    const words = response.split(' ');

    for (let i = 0; i < words.length; i++) {
      await this.delay(delayMs);
      const isLastWord = i === words.length - 1;
      onWord(words[i], isLastWord);
    }
  }

  /**
   * Generate AI greeting message
   * @param userName - User's name
   * @returns Greeting message
   */
  getGreeting(userName: string): string {
    const greetings = [
      `Hey ${userName}! How's your day going?`,
      `Hi ${userName}! What's on your mind today?`,
      `Hello ${userName}! How are you feeling today?`,
      `Hey there ${userName}! Ready to reflect on your day?`,
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Generate mock AI responses based on user input
   * This should be replaced with actual AI API integration
   */
  private generateMockResponse(userMessage: string, userName: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Pattern matching for different types of inputs
    if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('happy')) {
      return `That's wonderful to hear, ${userName}! What made today so good? I'd love to hear more about the highlights.`;
    }

    if (lowerMessage.includes('bad') || lowerMessage.includes('sad') || lowerMessage.includes('difficult')) {
      return `I'm sorry you're going through a tough time, ${userName}. Would you like to talk about what's been challenging? Sometimes writing it out can help.`;
    }

    if (lowerMessage.includes('work') || lowerMessage.includes('job')) {
      return `Work can definitely be a big part of our day. How did things go at work today? Any wins or challenges you'd like to reflect on?`;
    }

    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return `It sounds like you've had a draining day. What's been taking up most of your energy? Remember, rest is important too.`;
    }

    if (lowerMessage.includes('excited') || lowerMessage.includes('looking forward')) {
      return `I can sense your excitement! What's got you feeling this way? Tell me more about what you're looking forward to.`;
    }

    if (lowerMessage.includes('stressed') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return `I hear you, ${userName}. Stress can be overwhelming. What's been weighing on your mind? Breaking it down in your journal might help you see things more clearly.`;
    }

    if (lowerMessage.includes('thank')) {
      return `You're very welcome, ${userName}! I'm here whenever you need to reflect or just talk through your day. Is there anything else on your mind?`;
    }

    // Default empathetic responses
    const defaultResponses = [
      `Thanks for sharing that, ${userName}. How does that make you feel?`,
      `Interesting! Can you tell me more about that?`,
      `I appreciate you opening up. What else happened today?`,
      `That's valuable to reflect on. How are you processing all of this?`,
      `I'm listening. What would you like to explore about that?`,
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  /**
   * Utility function to simulate delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const chatService = new ChatService();
