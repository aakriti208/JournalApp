import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { supabase } from '@/services/supabase';
import * as Haptics from 'expo-haptics';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-8">
        <Text className="text-4xl font-bold mb-2">Welcome Back</Text>
        <Text className="text-gray-600 text-lg">Sign in to continue</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium mb-2 text-gray-700">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View>
          <Text className="text-sm font-medium mb-2 text-gray-700">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <Pressable
          className="bg-blue-600 rounded-xl py-4 mt-4 active:opacity-80"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-base">
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
