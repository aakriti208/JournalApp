import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { authService } from '../../services/auth';
import { journalService } from '../../services/journal';
import { JournalEntry } from '../../types';

export default function Entries() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [searchQuery, entries]);

  async function loadEntries() {
    try {
      const user = await authService.getCurrentUser();
      const data = await journalService.getUserEntries(user!.id);
      setEntries(data);
      setFilteredEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  }

  function filterEntries() {
    if (!searchQuery.trim()) {
      setFilteredEntries(entries);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query)
    );
    setFilteredEntries(filtered);
  }

  function getEntryPreview(content: string): string {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
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
        <Text className="text-3xl font-bold text-gray-900">My Entries</Text>
        <Text className="text-gray-600 mt-1">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search entries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Entries List */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEntries.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="book-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">
              {searchQuery
                ? 'No entries found'
                : 'No entries yet.\nStart journaling today!'}
            </Text>
          </View>
        ) : (
          <View className="pb-6 gap-3">
            {filteredEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
                onPress={() => router.push(`/entry/${entry.id}`)}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="text-lg font-semibold text-gray-900 flex-1">
                    {entry.title}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-2">
                    {format(new Date(entry.created_at), 'MMM d')}
                  </Text>
                </View>
                <Text className="text-gray-600 leading-5">
                  {getEntryPreview(entry.content)}
                </Text>
                <View className="flex-row items-center mt-3">
                  <Ionicons name="time-outline" size={14} color="#9ca3af" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {format(new Date(entry.created_at), 'h:mm a')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary-600 rounded-full w-14 h-14 items-center justify-center shadow-lg"
        onPress={() => router.push('/new-entry')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
