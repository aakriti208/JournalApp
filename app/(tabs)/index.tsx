import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function Journal() {
  const [entries, setEntries] = useState<any[]>([]);

  const handleNewEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to new entry screen
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">My Journal</Text>
          <Text className="text-gray-600">Your thoughts and reflections</Text>
        </View>

        {entries.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Ionicons name="book-outline" size={64} color="#cbd5e1" />
            <Text className="text-gray-400 mt-4 text-lg">No entries yet</Text>
            <Text className="text-gray-400 text-center px-8 mt-2">
              Tap the + button to create your first journal entry
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {entries.map((entry) => (
              <Pressable
                key={entry.id}
                className="bg-white rounded-xl p-4 border border-gray-200 active:opacity-70"
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Text className="font-semibold text-lg mb-1">{entry.title}</Text>
                <Text className="text-gray-600" numberOfLines={2}>
                  {entry.content}
                </Text>
                <Text className="text-gray-400 text-sm mt-2">{entry.date}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg active:opacity-80"
        onPress={handleNewEntry}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </View>
  );
}
