import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="journal/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}
