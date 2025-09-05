import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(JournalApp)" options={{ headerShown: false }} />
    </Stack>
  );
}
