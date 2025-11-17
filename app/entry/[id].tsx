import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { journalService } from '../../services/journal';
import { JournalEntry } from '../../types';

export default function EntryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [id]);

  async function loadEntry() {
    try {
      const data = await journalService.getEntry(id as string);
      setEntry(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error('Error loading entry:', error);
      Alert.alert('Error', 'Failed to load entry');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setSaving(true);
    try {
      const updatedEntry = await journalService.updateEntry(id as string, {
        title: title.trim(),
        content: content.trim(),
      });

      setEntry(updatedEntry);
      setIsEditing(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Entry updated successfully');
    } catch (error: any) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', error.message || 'Failed to update entry');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle(entry?.title || '');
    setContent(entry?.content || '');
    setIsEditing(false);
  }

  async function handleDelete() {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await journalService.deleteEntry(id as string);
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#374151" />
          </TouchableOpacity>
          <View className="flex-row gap-4">
            {isEditing ? (
              <>
                <TouchableOpacity onPress={handleCancel}>
                  <Text className="text-lg font-semibold text-gray-600">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={saving || !title.trim() || !content.trim()}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#0ea5e9" />
                  ) : (
                    <Text
                      className={`text-lg font-semibold ${
                        title.trim() && content.trim()
                          ? 'text-primary-600'
                          : 'text-gray-400'
                      }`}
                    >
                      Save
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={24} color="#374151" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Date */}
          <Text className="text-sm text-gray-500 mb-4">
            {format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy • h:mm a')}
          </Text>

          {/* Title */}
          {isEditing ? (
            <TextInput
              className="text-2xl font-bold text-gray-900 mb-4"
              value={title}
              onChangeText={setTitle}
              placeholder="Entry title..."
              placeholderTextColor="#9ca3af"
              maxLength={100}
            />
          ) : (
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              {entry.title}
            </Text>
          )}

          {/* Content */}
          {isEditing ? (
            <TextInput
              className="text-base text-gray-900 leading-6"
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              multiline
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
              style={{ minHeight: 400 }}
            />
          ) : (
            <Text className="text-base text-gray-900 leading-6">
              {entry.content}
            </Text>
          )}
        </ScrollView>

        {/* Footer */}
        {!isEditing && (
          <View className="border-t border-gray-200 px-6 py-3 bg-gray-50">
            <Text className="text-sm text-gray-600">
              {content.trim().split(/\s+/).filter(Boolean).length} words
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
