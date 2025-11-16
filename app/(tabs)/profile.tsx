import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function Profile() {
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace('/(auth)/login');
            } catch (error: any) {
              Alert.alert('Error', error.message);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <View className="bg-white rounded-xl p-6 mb-4 items-center">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="#3b82f6" />
          </View>
          <Text className="text-2xl font-bold mb-1">Welcome</Text>
          <Text className="text-gray-600">Manage your account</Text>
        </View>

        <View className="bg-white rounded-xl overflow-hidden">
          <Pressable
            className="flex-row items-center px-4 py-4 border-b border-gray-100 active:bg-gray-50"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="settings-outline" size={24} color="#6b7280" />
            <Text className="flex-1 ml-3 text-base">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable
            className="flex-row items-center px-4 py-4 border-b border-gray-100 active:bg-gray-50"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
            <Text className="flex-1 ml-3 text-base">Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable
            className="flex-row items-center px-4 py-4 active:bg-gray-50"
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text className="flex-1 ml-3 text-base text-red-500">Sign Out</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
