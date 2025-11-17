# JournalApp - Complete Setup Guide

## Overview

This is a complete mobile journaling app inspired by Apple's Journal app with AI-powered insights using a custom fine-tuned model.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (free tier works)
- Python 3.9+ (for AI backend)
- iOS Simulator (Mac) or Android Emulator or Physical Device

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

### 2.2 Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `backend/database-schema.sql`
3. Run the SQL script

### 2.3 Get Your API Credentials

1. Go to Project Settings > API
2. Copy your project URL and anon key

### 2.4 Create Environment File

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_AI_API_URL=http://localhost:8000
EXPO_PUBLIC_AI_API_KEY=your-ai-api-key
```

## Step 3: AI Backend Setup

### 3.1 Install Python Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3.2 Configure AI Backend

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
MODEL_NAME=gpt-3.5-turbo
SECRET_KEY=your_secret_key_here
```

### 3.3 Run the Backend

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## Step 4: Create App Assets

You need to create the following assets in the `assets/` directory:

1. **icon.png** (1024x1024) - App icon
2. **splash.png** (1284x2778) - Splash screen
3. **adaptive-icon.png** (1024x1024) - Android adaptive icon
4. **favicon.png** (48x48) - Web favicon

For now, you can use placeholder images or generate them with:

```bash
npx @expo/image-utils generate-assets
```

## Step 5: Run the App

### iOS (Mac only)

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web

```bash
npm run web
```

### Development Server

```bash
npm start
```

Then scan the QR code with Expo Go app on your phone.

## Features Implemented

### ✅ Core Features

- **Authentication**
  - User registration with email/password
  - Secure login
  - Session management
  - Account creation

- **Home Dashboard**
  - Time-based greeting (Good morning/afternoon/evening)
  - Entry count and streak statistics
  - Daily journaling streak tracking
  - AI-generated or fallback prompts
  - Quick action buttons

- **Journal Entry Management**
  - Create new entries with title and content
  - Edit existing entries
  - Delete entries
  - Rich text editor
  - Word count tracking
  - Date/timestamp for each entry

- **AI Integration**
  - Custom fine-tuned model support
  - Entry analysis (themes, emotions, patterns)
  - Personalized prompt generation
  - Topic suggestions
  - Fallback prompts when AI unavailable

- **Search & Discovery**
  - Search entries by title and content
  - Filter by date
  - Entry history view

- **Insights**
  - AI-powered theme identification
  - Emotional pattern analysis
  - Personalized suggestions
  - Writing statistics

- **Profile & Stats**
  - Total entries
  - Current streak
  - Longest streak
  - Total words written
  - Days journaled

### 🔐 Privacy Features

- All data stored in your Supabase database
- Row-level security (RLS) enabled
- AI processing on your backend
- No third-party data sharing
- Secure authentication

## Project Structure

```
JournalApp/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   ├── entry/             # Entry detail
│   ├── new-entry.tsx      # New entry screen
│   ├── index.tsx          # Landing page
│   └── _layout.tsx        # Root layout
├── backend/               # AI backend API
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── database-schema.sql
├── components/            # Reusable components
├── services/             # API services
│   ├── auth.ts          # Authentication
│   ├── journal.ts       # Journal operations
│   ├── ai.ts            # AI integration
│   └── supabase.ts      # Supabase client
├── types/               # TypeScript types
├── utils/               # Utility functions
│   ├── prompts.ts      # Fallback prompts
│   └── stats.ts        # Statistics calculations
└── assets/             # Images and assets
```

## Customization

### Adding New Prompts

Edit `utils/prompts.ts` to add more fallback prompts:

```typescript
export const fallbackPrompts: Prompt[] = [
  {
    id: 'custom-1',
    category: 'gratitude',
    text: 'Your custom prompt here',
    is_ai_generated: false,
    created_at: new Date().toISOString(),
  },
  // ... more prompts
];
```

### Customizing Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

## Fine-Tuning Your AI Model

See `backend/README.md` for detailed instructions on:
- Preparing training data
- Fine-tuning with OpenAI
- Using custom models
- Deployment options

## Troubleshooting

### TypeScript Errors

The project is using TypeScript. Some IDE diagnostics about missing modules are expected before running `npm install`.

### Supabase Connection Issues

1. Check your `.env` file has correct credentials
2. Verify Supabase project is active
3. Check RLS policies are enabled

### AI Backend Not Working

1. Make sure backend server is running
2. Check `EXPO_PUBLIC_AI_API_URL` in `.env`
3. App will use fallback prompts if AI fails

### Metro Bundler Issues

```bash
npx expo start --clear
```

## Next Steps

1. **Deploy Backend**: Deploy your AI backend to a cloud provider
2. **Customize UI**: Add your branding and colors
3. **Add Features**: Implement additional features like:
   - Photo attachments
   - Voice memos
   - Mood tracking
   - Export entries
   - Backup functionality
4. **App Store Submission**: Build and submit to App Store/Play Store

## Support

For issues and questions:
- Check the README.md
- Review Expo documentation: https://docs.expo.dev
- Supabase docs: https://supabase.com/docs

## License

MIT
