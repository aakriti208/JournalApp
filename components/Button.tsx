/**
 * Custom Button Component
 */

import { Pressable, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const variantStyles = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    outline: 'bg-transparent border-2 border-blue-600',
  };

  const textStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-blue-600',
  };

  const baseStyles = 'rounded-xl py-4 px-6 items-center justify-center active:opacity-80';
  const disabledStyles = disabled || loading ? 'opacity-50' : '';

  return (
    <Pressable
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3b82f6' : '#ffffff'} />
      ) : (
        <Text className={`font-semibold text-base ${textStyles[variant]}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
