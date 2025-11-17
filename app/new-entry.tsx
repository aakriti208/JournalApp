import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { authService } from '../services/auth';
import { journalService } from '../services/journal';

export default function NewEntry() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setSaving(true);
    try {
      const user = await authService.getCurrentUser();

      await journalService.createEntry({
        user_id: user!.id,
        title: title.trim(),
        content: content.trim(),
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert('Success', 'Entry saved successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', error.message || 'Failed to save entry');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Discard Entry?',
        'Are you sure you want to discard this entry?',
        [
          { text: 'Keep Writing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={handleCancel}>
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">New Entry</Text>
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
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Date */}
          <Text className="text-sm text-gray-500 mb-4">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>

          {/* Title Input */}
          <TextInput
            className="text-2xl font-bold text-gray-900 mb-4"
            placeholder="Entry title..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
            maxLength={100}
          />

          {/* Content Input */}
          <TextInput
            className="text-base text-gray-900 leading-6"
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
            style={{ minHeight: 400 }}
          />
        </ScrollView>

        {/* Formatting Toolbar */}
        <View className="border-t border-gray-200 px-6 py-3 flex-row items-center gap-4 bg-gray-50">
          <Text className="text-sm text-gray-600">
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
