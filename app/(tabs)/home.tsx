import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/auth';
import { journalService } from '../../services/journal';
import { aiService } from '../../services/ai';
import { calculateUserStats, getGreeting } from '../../utils/stats';
import { getRandomPrompt } from '../../utils/prompts';
import { JournalEntry, UserStats, Prompt } from '../../types';

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<UserStats>({
    total_entries: 0,
    current_streak: 0,
    longest_streak: 0,
    total_words: 0,
    days_journaled: 0,
  });
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const user = await authService.getCurrentUser();
      const fullName = user?.user_metadata?.full_name || 'Friend';
      setUserName(fullName.split(' ')[0]); // First name only

      const entries = await journalService.getUserEntries(user!.id);
      const userStats = calculateUserStats(entries);
      setStats(userStats);

      // Try to get AI-generated prompt, fallback to random prompt
      try {
        const aiPrompt = await aiService.generatePrompt(entries);
        setPrompt(aiPrompt);
      } catch (error) {
        // Use fallback prompt if AI fails
        const fallbackPrompt = getRandomPrompt();
        setPrompt(fallbackPrompt);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  function shufflePrompt() {
    const newPrompt = getRandomPrompt();
    setPrompt(newPrompt);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900">
            {getGreeting(userName)}
          </Text>
          <Text className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 py-4">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-primary-50 rounded-2xl p-4">
              <Ionicons name="flame" size={24} color="#0ea5e9" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">
                {stats.current_streak}
              </Text>
              <Text className="text-sm text-gray-600">Day Streak</Text>
            </View>

            <View className="flex-1 bg-purple-50 rounded-2xl p-4">
              <Ionicons name="book" size={24} color="#a855f7" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total_entries}
              </Text>
              <Text className="text-sm text-gray-600">Entries</Text>
            </View>

            <View className="flex-1 bg-green-50 rounded-2xl p-4">
              <Ionicons name="calendar" size={24} color="#22c55e" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">
                {stats.days_journaled}
              </Text>
              <Text className="text-sm text-gray-600">Days</Text>
            </View>
          </View>
        </View>

        {/* Reflection Prompt */}
        {prompt && (
          <View className="mx-6 my-4 bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles" size={20} color="#0ea5e9" />
                <Text className="text-sm font-semibold text-primary-700">
                  {prompt.is_ai_generated ? 'AI Prompt' : 'Writing Prompt'}
                </Text>
              </View>
              <TouchableOpacity onPress={shufflePrompt}>
                <Ionicons name="shuffle" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text className="text-lg text-gray-900 leading-6">{prompt.text}</Text>
          </View>
        )}

        {/* New Entry Button */}
        <View className="px-6 py-4">
          <TouchableOpacity
            className="bg-primary-600 rounded-2xl py-4 items-center flex-row justify-center gap-2"
            onPress={() => router.push('/new-entry')}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white text-lg font-semibold">New Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</Text>
          <View className="gap-3">
            <TouchableOpacity
              className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between"
              onPress={() => router.push('/(tabs)/entries')}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-primary-100 rounded-full p-2">
                  <Ionicons name="search" size={20} color="#0ea5e9" />
                </View>
                <Text className="text-base font-medium text-gray-900">
                  Search Entries
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between"
              onPress={() => router.push('/(tabs)/insights')}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-purple-100 rounded-full p-2">
                  <Ionicons name="analytics" size={20} color="#a855f7" />
                </View>
                <Text className="text-base font-medium text-gray-900">
                  View Insights
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
