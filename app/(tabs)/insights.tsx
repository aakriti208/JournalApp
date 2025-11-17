import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/auth';
import { journalService } from '../../services/journal';
import { aiService } from '../../services/ai';
import { AIInsight, JournalEntry } from '../../types';

export default function Insights() {
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const user = await authService.getCurrentUser();
      const userEntries = await journalService.getUserEntries(user!.id);
      setEntries(userEntries);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateInsights() {
    if (entries.length < 3) {
      return;
    }

    setGeneratingInsights(true);
    try {
      const aiInsights = await aiService.analyzeEntries(entries);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setGeneratingInsights(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-3xl font-bold text-gray-900">Insights</Text>
        <Text className="text-gray-600 mt-1">AI-powered analysis of your journal</Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {entries.length < 3 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="bulb-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center px-8">
              Keep journaling! You need at least 3 entries to generate AI insights.
            </Text>
            <Text className="text-gray-400 mt-2 text-center">
              {entries.length} / 3 entries
            </Text>
          </View>
        ) : !insights ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="sparkles" size={64} color="#a855f7" />
            <Text className="text-gray-900 font-semibold text-lg mt-4">
              Ready for Insights
            </Text>
            <Text className="text-gray-600 mt-2 text-center px-8">
              Generate personalized insights based on your journal entries
            </Text>
            <TouchableOpacity
              className="bg-primary-600 rounded-xl px-6 py-3 mt-6"
              onPress={generateInsights}
              disabled={generatingInsights}
            >
              {generatingInsights ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Generate Insights</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="pb-6 gap-4">
            {/* Themes */}
            {insights.themes && insights.themes.length > 0 && (
              <View className="bg-purple-50 rounded-2xl p-5">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="prism" size={20} color="#a855f7" />
                  <Text className="text-lg font-semibold text-gray-900">
                    Common Themes
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {insights.themes.map((theme, index) => (
                    <View
                      key={index}
                      className="bg-purple-100 px-3 py-2 rounded-full"
                    >
                      <Text className="text-purple-700 font-medium">{theme}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Emotions */}
            {insights.emotions && insights.emotions.length > 0 && (
              <View className="bg-blue-50 rounded-2xl p-5">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="happy" size={20} color="#0ea5e9" />
                  <Text className="text-lg font-semibold text-gray-900">
                    Emotional Patterns
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {insights.emotions.map((emotion, index) => (
                    <View
                      key={index}
                      className="bg-blue-100 px-3 py-2 rounded-full"
                    >
                      <Text className="text-blue-700 font-medium">{emotion}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Suggestions */}
            {insights.suggestions && insights.suggestions.length > 0 && (
              <View className="bg-green-50 rounded-2xl p-5">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="leaf" size={20} color="#22c55e" />
                  <Text className="text-lg font-semibold text-gray-900">
                    Suggestions
                  </Text>
                </View>
                <View className="gap-3">
                  {insights.suggestions.map((suggestion, index) => (
                    <View key={index} className="flex-row gap-2">
                      <Text className="text-green-700">•</Text>
                      <Text className="text-gray-700 flex-1">{suggestion}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Refresh Button */}
            <TouchableOpacity
              className="bg-gray-100 rounded-xl py-4 items-center mt-2"
              onPress={generateInsights}
              disabled={generatingInsights}
            >
              {generatingInsights ? (
                <ActivityIndicator color="#6b7280" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="refresh" size={20} color="#6b7280" />
                  <Text className="text-gray-700 font-semibold">
                    Refresh Insights
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
