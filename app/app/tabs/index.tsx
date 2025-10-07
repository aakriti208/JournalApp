/**
 * ChatScreen - Main conversational interface for journal entries
 *
 * Features:
 * - Loads user info and today's conversation on mount
 * - Shows AI greeting if no conversation exists
 * - Handles message sending with optimistic UI
 * - Streams AI responses word-by-word
 * - Auto-scrolls to bottom
 * - iOS-optimized keyboard handling
 * - Haptic feedback on send
 */

import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  Keyboard,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Message, ChatState } from '@/types/chat.types';
import { supabase } from '@/services/supabase';
import { chatService } from '@/services/chat.service';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import CustomHeader from '@/components/CustomHeader';

export default function ChatScreen() {
  // State management
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: true,
    isStreaming: false,
    currentEntryId: null,
    userName: '',
    error: null,
  });

  // Ref for FlatList to handle auto-scroll
  const flatListRef = useRef<FlatList>(null);

  // Ref to accumulate streaming response
  const streamingMessageRef = useRef<string>('');

  /**
   * Initial load: Get user info and today's conversation
   */
  useEffect(() => {
    loadConversation();
  }, []);

  /**
   * Auto-scroll when new messages arrive
   */
  useEffect(() => {
    if (state.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [state.messages.length]);

  /**
   * Auto-scroll when keyboard shows
   */
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardWillShow.remove();
    };
  }, []);

  /**
   * Load user information and today's conversation
   */
  const loadConversation = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Get current user
      const user = await supabase.getCurrentUser();

      // Get or create today's entry
      let entry = await supabase.getTodayEntry(user.id);

      if (!entry) {
        entry = await supabase.createTodayEntry(user.id);
      }

      // Load existing messages or create greeting
      const messages: Message[] = entry.messages.length > 0
        ? entry.messages
        : [{
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: chatService.getGreeting(user.name),
            timestamp: new Date(),
            entryId: entry.id,
          }];

      // If greeting was created, save it
      if (entry.messages.length === 0) {
        await supabase.saveMessage(entry.id, messages[0]);
      }

      setState(prev => ({
        ...prev,
        messages,
        userName: user.name,
        currentEntryId: entry.id,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading conversation:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load conversation. Please try again.',
        isLoading: false,
      }));
    }
  };

  /**
   * Handle sending a user message
   */
  const handleSendMessage = async (content: string) => {
    if (!state.currentEntryId || state.isStreaming) return;

    // Haptic feedback on send (iOS)
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      entryId: state.currentEntryId,
    };

    // Optimistic UI update - add user message immediately
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    try {
      // Save user message to database
      await supabase.saveMessage(state.currentEntryId, userMessage);

      // Start streaming AI response
      setState(prev => ({ ...prev, isStreaming: true }));

      // Get AI response
      const aiResponse = await chatService.getAIResponse(
        content,
        state.messages,
        state.userName
      );

      // Create AI message placeholder
      const aiMessageId = `msg-${Date.now()}-ai`;
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '', // Will be filled during streaming
        timestamp: new Date(),
        entryId: state.currentEntryId,
      };

      // Add empty AI message
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
      }));

      // Stream the response word by word
      streamingMessageRef.current = '';

      await chatService.streamResponse(
        aiResponse,
        (word, isComplete) => {
          streamingMessageRef.current += (streamingMessageRef.current ? ' ' : '') + word;

          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, content: streamingMessageRef.current }
                : msg
            ),
          }));

          // When complete, save to database and reset streaming state
          if (isComplete) {
            const finalMessage: Message = {
              ...aiMessage,
              content: streamingMessageRef.current,
            };

            supabase.saveMessage(state.currentEntryId!, finalMessage);

            setState(prev => ({
              ...prev,
              isStreaming: false,
            }));

            streamingMessageRef.current = '';
          }
        },
        50 // 50ms delay between words
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to send message. Please try again.',
        isStreaming: false,
      }));
    }
  };

  /**
   * Render individual message
   */
  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble message={item} />
  );

  /**
   * Render loading state
   */
  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <CustomHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ffd33d" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </View>
    );
  }

  /**
   * Render error state
   */
  if (state.error) {
    return (
      <View style={styles.container}>
        <CustomHeader />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      </View>
    );
  }

  /**
   * Main render
   */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <CustomHeader />

      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={state.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      />

      {/* Streaming indicator */}
      {state.isStreaming && (
        <View style={styles.streamingIndicator}>
          <ActivityIndicator size="small" color="#ffd33d" />
          <Text style={styles.streamingText}>AI is typing...</Text>
        </View>
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={state.isStreaming}
        placeholder={state.isStreaming ? "AI is responding..." : "Type your message..."}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  streamingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  streamingText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
