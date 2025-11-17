import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/auth';
import { journalService } from '../../services/journal';
import { calculateUserStats } from '../../utils/stats';
import { UserStats } from '../../types';

export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState<UserStats>({
    total_entries: 0,
    current_streak: 0,
    longest_streak: 0,
    total_words: 0,
    days_journaled: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const user = await authService.getCurrentUser();
      setUserName(user?.user_metadata?.full_name || 'User');
      setUserEmail(user?.email || '');

      const entries = await journalService.getUserEntries(user!.id);
      const userStats = calculateUserStats(entries);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.signOut();
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-3xl font-bold text-gray-900">Profile</Text>
      </View>

      <ScrollView className="flex-1">
        {/* User Info */}
        <View className="px-6 py-6 border-b border-gray-200">
          <View className="items-center">
            <View className="bg-primary-100 rounded-full w-20 h-20 items-center justify-center mb-4">
              <Text className="text-3xl font-bold text-primary-600">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{userName}</Text>
            <Text className="text-gray-600 mt-1">{userEmail}</Text>
          </View>
        </View>

        {/* Statistics */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Your Statistics
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center gap-3">
                <Ionicons name="book" size={24} color="#0ea5e9" />
                <Text className="text-gray-700 font-medium">Total Entries</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {stats.total_entries}
              </Text>
            </View>

            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center gap-3">
                <Ionicons name="flame" size={24} color="#f97316" />
                <Text className="text-gray-700 font-medium">Current Streak</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {stats.current_streak} days
              </Text>
            </View>

            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center gap-3">
                <Ionicons name="trophy" size={24} color="#eab308" />
                <Text className="text-gray-700 font-medium">Longest Streak</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {stats.longest_streak} days
              </Text>
            </View>

            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center gap-3">
                <Ionicons name="text" size={24} color="#22c55e" />
                <Text className="text-gray-700 font-medium">Total Words</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {stats.total_words.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center gap-3">
                <Ionicons name="calendar" size={24} color="#a855f7" />
                <Text className="text-gray-700 font-medium">Days Journaled</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {stats.days_journaled}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Settings
          </Text>
          <View className="gap-2">
            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="notifications-outline" size={24} color="#6b7280" />
                <Text className="text-gray-700 font-medium">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="lock-closed-outline" size={24} color="#6b7280" />
                <Text className="text-gray-700 font-medium">Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="color-palette-outline" size={24} color="#6b7280" />
                <Text className="text-gray-700 font-medium">Appearance</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">About</Text>
          <View className="gap-2">
            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
                <Text className="text-gray-700 font-medium">Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="document-text-outline" size={24} color="#6b7280" />
                <Text className="text-gray-700 font-medium">Terms & Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
                <Text className="text-gray-700 font-medium">About JournalApp</Text>
              </View>
              <Text className="text-gray-500">v1.0.0</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View className="px-6 py-6">
          <TouchableOpacity
            className="bg-red-50 rounded-xl py-4 items-center"
            onPress={handleSignOut}
          >
            <Text className="text-red-600 font-semibold text-base">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
