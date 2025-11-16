import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { supabase } from '@/services/supabase';
import * as Haptics from 'expo-haptics';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
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
        <Text className="text-4xl font-bold mb-2">Create Account</Text>
        <Text className="text-gray-600 text-lg">Sign up to get started</Text>
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

        <View>
          <Text className="text-sm font-medium mb-2 text-gray-700">Confirm Password</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <Pressable
          className="bg-blue-600 rounded-xl py-4 mt-4 active:opacity-80"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-base">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
