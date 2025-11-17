# JournalApp - AI-Powered Journaling App

A modern, AI-powered journal application inspired by Apple's Journal app, built with Expo, React Native, TypeScript, and Supabase. Features custom fine-tuned AI model for personalized prompts and insights.

## Features

### Core Features
- **Smart Authentication** - Secure user registration and login with Supabase
- **AI-Powered Insights** - Custom fine-tuned model analyzes your entries for themes, emotions, and patterns
- **Personalized Prompts** - AI-generated writing prompts based on your journal history
- **Streak Tracking** - Track your daily journaling streak and statistics
- **Rich Text Editor** - Beautiful, distraction-free writing experience
- **Smart Search** - Quickly find entries by title or content
- **Privacy-First** - All your data stays private in your Supabase database

### Technical Features
- **File-based routing** with expo-router
- **Authentication** with Supabase
- **Secure token storage** using expo-secure-store
- **Modern styling** with NativeWind (Tailwind CSS for React Native)
- **iOS haptic feedback** for enhanced user experience
- **TypeScript** for type safety
- **AI Backend** - FastAPI backend for custom AI model integration

---

## Table of Contents

1. [Creating a New Expo Project from Scratch](#creating-a-new-expo-project-from-scratch)
2. [Prerequisites](#prerequisites)
3. [Quick Start (Existing Project)](#quick-start-existing-project)
4. [Project Structure](#project-structure)
5. [Technologies Used](#technologies-used)
6. [Troubleshooting](#troubleshooting)

---

## Creating a New Expo Project from Scratch

This section explains how to create a brand new React Native Expo project with all the modern features from the ground up.

### Step 1: Initialize Expo Project

First, ensure you have Node.js (v18+) installed, then create a new Expo project:

```bash
# Create a new Expo project with TypeScript template
npx create-expo-app@latest my-app --template blank-typescript

# Navigate into the project
cd my-app
```

### Step 2: Install Core Dependencies

Install expo-router and required dependencies:

```bash
# Install expo-router for file-based routing
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Install Supabase and authentication dependencies
npm install @supabase/supabase-js react-native-url-polyfill

# Install secure storage
npx expo install expo-secure-store

# Install async storage
npx expo install @react-native-async-storage/async-storage

# Install haptics for iOS feedback
npx expo install expo-haptics

# Install NativeWind for Tailwind CSS styling
npm install nativewind tailwindcss
```

### Step 3: Configure package.json

Update your `package.json` to use expo-router as the entry point:

```json
{
  "name": "my-app",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "web": "expo start --web",
    "lint": "expo lint"
  }
}
```

### Step 4: Set Up Expo Router

Create the `app` directory structure:

```bash
# Create app directory and subdirectories
mkdir -p app/{,\(auth\),\(tabs\)}

# Create root layout
touch app/_layout.tsx

# Create entry point
touch app/index.tsx

# Create auth screens
touch app/\(auth\)/_layout.tsx
touch app/\(auth\)/login.tsx
touch app/\(auth\)/register.tsx

# Create tab screens
touch app/\(tabs\)/_layout.tsx
touch app/\(tabs\)/index.tsx
touch app/\(tabs\)/profile.tsx
```

### Step 5: Configure TypeScript

Update `tsconfig.json` with path aliases:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/services/*": ["./services/*"],
      "@/types/*": ["./types/*"],
      "@/utils/*": ["./utils/*"],
      "@/app/*": ["./app/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "nativewind-env.d.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Step 6: Configure NativeWind

1. **Create `tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
    },
  },
  plugins: [],
};
```

2. **Create `global.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. **Create `nativewind-env.d.ts`:**

```typescript
/// <reference types="nativewind/types" />
```

4. **Update `babel.config.js`:**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: { '@': './' },
          extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        },
      ],
    ],
  };
};
```

### Step 7: Configure app.json for iOS

Update `app.json` with iOS-specific settings:

```json
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "my-app",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.myapp",
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"],
        "NSFaceIDUsageDescription": "We use Face ID to secure your data."
      },
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      ["expo-splash-screen", { "backgroundColor": "#ffffff", "imageWidth": 200 }]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Step 8: Create Folder Structure

```bash
# Create additional directories
mkdir -p components services types utils assets

# Create initial files
touch services/supabase.ts
touch types/index.ts
touch utils/helpers.ts
touch components/Button.tsx
```

### Step 9: Set Up Environment Variables

1. **Create `.env.example`:**

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url-here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

2. **Create `.env` (not committed to git):**

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

3. **Update `.gitignore`:**

```gitignore
# Environment variables
.env
.env.local
.env*.local
```

### Step 10: Create Supabase Client

Create `services/supabase.ts`:

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Step 11: Install Dependencies and Start

```bash
# Install all dependencies
npm install

# Start the development server
npm start

# Or run directly on iOS
npm run ios
```

### Key Differences from Standard React Native

1. **Expo Router vs React Navigation**: File-based routing instead of programmatic navigation
2. **NativeWind vs StyleSheet**: Tailwind classes instead of StyleSheet.create()
3. **Expo Modules**: Pre-configured native modules (haptics, secure store, etc.)
4. **TypeScript First**: Full type safety out of the box
5. **Fast Refresh**: Hot reloading for instant feedback

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (will be installed with dependencies)
- **Xcode** (for iOS development)
- **iOS Simulator** or a physical iOS device

---

## Quick Start (Existing Project)

If you've cloned this repository, follow these steps to get started:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**To get your Supabase credentials:**
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **Settings** > **API**
4. Copy your **Project URL** and **anon/public key**

### 3. Set Up Supabase Database

Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create journal_entries table
create table journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table journal_entries enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can view their own journal entries"
  on journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can create their own journal entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on journal_entries for delete
  using (auth.uid() = user_id);
```

### 4. Start Development Server

```bash
npm start
```

Or directly for iOS:

```bash
npm run ios
```

### 5. Open in iOS Simulator

- Press `i` in the terminal to open in iOS Simulator
- Or scan the QR code with the Expo Go app on your physical device

## Project Structure

```
JournalApp/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication group
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Register screen
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Journal list
│   │   └── profile.tsx    # User profile
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── components/            # Reusable UI components
│   └── Button.tsx         # Custom button component
├── services/              # Business logic
│   └── supabase.ts        # Supabase client setup
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared types
├── utils/                 # Helper functions
│   └── helpers.ts         # Utility functions
├── assets/                # Images, fonts, etc.
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies
```

## Available Scripts

- `npm start` - Start the development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint

## iOS Best Practices Implemented

1. **Haptic Feedback** - Using `expo-haptics` for tactile feedback on user interactions
2. **Secure Storage** - Using `expo-secure-store` for storing authentication tokens securely
3. **Face ID/Touch ID** - Configured in `app.json` (implement in authentication flow)
4. **Safe Area Handling** - Using `react-native-safe-area-context`
5. **iOS-specific configurations** in `app.json`

## Technologies Used

- **Expo** - React Native framework
- **expo-router** - File-based routing
- **TypeScript** - Type safety
- **Supabase** - Backend as a service
- **NativeWind** - Tailwind CSS for React Native
- **expo-haptics** - iOS haptic feedback
- **expo-secure-store** - Secure token storage

---

## Architecture Overview

### Authentication Flow

```
┌─────────────────┐
│   app/index.tsx │  ← Entry point, checks auth state
└────────┬────────┘
         │
    ┌────▼────┐
    │ Session │
    │ Check   │
    └────┬────┘
         │
    ┌────▼────────────────────┐
    │                         │
    │ Authenticated?          │
    │                         │
    └────┬────────────────┬───┘
         │                │
    ┌────▼────┐      ┌────▼─────┐
    │  (tabs) │      │  (auth)  │
    │         │      │          │
    │ Main    │      │ Login/   │
    │ App     │      │ Register │
    └─────────┘      └──────────┘
```

### Data Flow

```
┌──────────────┐
│  React       │
│  Components  │
└──────┬───────┘
       │
       │ Uses
       ▼
┌──────────────┐
│  Services    │  ← Supabase client, API calls
│  Layer       │
└──────┬───────┘
       │
       │ Stores/Fetches
       ▼
┌──────────────┐
│  Supabase    │  ← Authentication + Database
│  Backend     │
└──────────────┘
       │
       │ Persists
       ▼
┌──────────────┐
│ expo-secure- │  ← iOS Keychain (secure)
│ store        │
└──────────────┘
```

### Folder Responsibilities

```
├── app/                # ROUTING - File-based routes
│   ├── _layout.tsx     # Root layout, providers, global config
│   ├── index.tsx       # Auth check and navigation
│   ├── (auth)/         # Authentication screens
│   └── (tabs)/         # Main application screens
│
├── components/         # UI - Reusable components
│   └── Button.tsx      # Stateless, presentational
│
├── services/           # BUSINESS LOGIC - API calls
│   └── supabase.ts     # Supabase client, auth methods
│
├── types/              # TYPE DEFINITIONS
│   └── index.ts        # Shared TypeScript interfaces
│
└── utils/              # HELPERS - Pure functions
    └── helpers.ts      # Date formatting, validation, etc.
```

### Component Hierarchy

```
_layout.tsx (Root)
    │
    ├── StatusBar
    │
    └── Stack (expo-router)
        │
        ├── index.tsx (Auth Check)
        │
        ├── (auth)/_layout.tsx
        │   ├── login.tsx
        │   └── register.tsx
        │
        └── (tabs)/_layout.tsx
            ├── Tabs (Bottom Navigation)
            │   ├── index.tsx (Journal)
            │   └── profile.tsx
            │
            └── Tab Icons & Styling
```

### State Management

This project uses React's built-in state management:

```typescript
// Local component state
const [email, setEmail] = useState('');

// Supabase auth state (global)
supabase.auth.onAuthStateChange((event, session) => {
  // Session automatically managed
});

// Async Storage (if needed)
import AsyncStorage from '@react-native-async-storage/async-storage';
```

**For larger apps, consider:**
- **Zustand** - Lightweight state management
- **React Query** - Server state & caching
- **Context API** - Global app state

---

## Next Steps

1. Implement journal entry creation and editing
2. Add rich text editing capabilities
3. Implement search and filtering
4. Add data export functionality
5. Implement push notifications
6. Add biometric authentication

---

## Best Practices & Patterns Used

### 1. File-Based Routing with Route Groups

This project uses expo-router's route groups (folders with parentheses) to organize related routes:

```
app/
├── (auth)/          # Auth routes - not visible in URL
│   ├── login.tsx    # /login
│   └── register.tsx # /register
├── (tabs)/          # Tab routes
│   ├── index.tsx    # Main tab
│   └── profile.tsx  # Profile tab
```

**Benefits:**
- Clean URL structure
- Logical organization
- Shared layouts per group

### 2. Secure Token Storage

Authentication tokens are stored using `expo-secure-store` which uses:
- **iOS**: Keychain Services
- **Android**: EncryptedSharedPreferences

```typescript
// Example from services/supabase.ts
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => await SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string) => await SecureStore.setItemAsync(key, value),
  removeItem: async (key: string) => await SecureStore.deleteItemAsync(key),
};
```

### 3. NativeWind Styling

Use Tailwind CSS classes directly in your components:

```tsx
// Good - Using NativeWind
<View className="flex-1 bg-white px-4 py-6">
  <Text className="text-2xl font-bold text-gray-900">Hello</Text>
</View>

// Avoid - StyleSheet (unless necessary for specific cases)
<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>
```

### 4. Haptic Feedback on iOS

Add tactile feedback for better user experience:

```typescript
import * as Haptics from 'expo-haptics';

// On button press
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// On success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// On error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

### 5. Environment Variables

Always use `EXPO_PUBLIC_` prefix for client-side environment variables:

```env
# ✅ Correct - Accessible in client code
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# ❌ Incorrect - Not accessible in client
SUPABASE_URL=https://xxx.supabase.co
```

### 6. Type Safety with TypeScript

Define interfaces for all data structures:

```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
}
```

### 7. Component Organization

Keep components small and focused:

```
components/
├── Button.tsx           # Reusable button with variants
├── Input.tsx            # Form input component
├── Card.tsx             # Card container
└── JournalEntryCard.tsx # Domain-specific component
```

### 8. Path Aliases

Use TypeScript path aliases for cleaner imports:

```typescript
// ✅ Good
import { supabase } from '@/services/supabase';
import { formatDate } from '@/utils/helpers';
import Button from '@/components/Button';

// ❌ Avoid
import { supabase } from '../../../services/supabase';
import { formatDate } from '../../utils/helpers';
import Button from '../components/Button';
```

### 9. Error Handling

Always handle errors gracefully with user feedback:

```typescript
try {
  const { error } = await supabase.auth.signIn({ email, password });
  if (error) throw error;

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  router.replace('/(tabs)');
} catch (error: any) {
  Alert.alert('Error', error.message);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
```

### 10. iOS-Specific Optimizations

- Use `expo-haptics` for tactile feedback
- Configure Face ID/Touch ID in `app.json`
- Handle safe areas with `react-native-safe-area-context`
- Test on both iPhone and iPad
- Use iOS Human Interface Guidelines for design

---

## Troubleshooting

### Environment variables not loading
Make sure your `.env` file is in the root directory and restart the development server.

### iOS build issues
- Clear the cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npm install expo@latest`

### Supabase connection issues
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Ensure Row Level Security policies are properly configured

## License

MIT
