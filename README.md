# Journal App

AI-powered journal app built with React Native, Expo, and Supabase.

## Features

- 📝 Create and manage journal entries
- 🤖 AI-powered prompts and insights
- 📊 Track writing streaks and stats
- 🎨 Modern UI with NativeWind (Tailwind CSS)
- 🔐 Secure authentication with Supabase
- ☁️ Cloud storage and sync

## Tech Stack

### Frontend
- **React Native** with **Expo**
- **Expo Router** for navigation
- **NativeWind** for styling
- **TypeScript** for type safety
- **Supabase** for backend and auth

### Backend
- **Python** with **FastAPI**
- AI integration for journal insights
- **Supabase** for database

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Python 3.9+
- Expo CLI
- Supabase account

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

### Backend Setup

See [backend/README.md](backend/README.md) for Python backend setup instructions.

## Project Structure

```
├── app/                 # App screens (Expo Router)
├── components/          # Reusable React components
├── services/           # API and service integrations
│   ├── supabase.ts    # Supabase client
│   ├── auth.ts        # Authentication service
│   ├── journal.ts     # Journal CRUD operations
│   └── ai.ts          # AI backend integration
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── assets/             # Images, fonts, etc.
├── backend/            # Python FastAPI backend
└── global.css          # Global Tailwind styles
```

## Environment Variables

### Frontend (.env)
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `EXPO_PUBLIC_AI_BACKEND_URL` - AI backend URL (default: http://localhost:8000)

### Backend (backend/.env)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase service role key
- `OPENAI_API_KEY` - OpenAI API key (if using)

## Database Schema

You'll need to create the following table in Supabase:

```sql
create table journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text,
  content text not null,
  mood text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table journal_entries enable row level security;

-- Create policies
create policy "Users can view their own entries"
  on journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can create their own entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on journal_entries for delete
  using (auth.uid() = user_id);
```

## Development

- Run linter: `npm run lint`
- Start Expo: `npm start`
- Clear cache: `npx expo start -c`

## License

MIT
