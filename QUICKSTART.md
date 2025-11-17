# Quick Start Guide

Get your AI-powered journaling app running in 5 minutes!

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier is fine)
- Python 3.9+ (for AI backend)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your Project URL and anon key from Settings > API

### Run Database Schema
1. Open SQL Editor in Supabase dashboard
2. Copy contents from `backend/database-schema.sql`
3. Paste and run it

## 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_AI_API_URL=http://localhost:8000
EXPO_PUBLIC_AI_API_KEY=dev-key-123
```

## 4. Run the App

```bash
# Start Expo dev server
npm start

# Or run directly on iOS
npm run ios
```

## 5. (Optional) Set Up AI Backend

The app works with fallback prompts without the AI backend. To enable AI features:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create backend/.env with your OpenAI key
echo "OPENAI_API_KEY=your-key" > .env

# Run backend
uvicorn main:app --reload
```

## Test the App

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Create Entry**: Tap the "+" button
4. **View Stats**: Check your streak on the home screen
5. **Get Insights**: Write 3+ entries, then visit the Insights tab

## Troubleshooting

### Metro bundler won't start
```bash
npx expo start --clear
```

### TypeScript errors
These are normal before `npm install`. Run `npm install` first.

### Can't connect to Supabase
- Check your `.env` file
- Verify credentials in Supabase dashboard
- Make sure database schema is created

## Next Steps

- Read `SETUP.md` for detailed configuration
- Check `backend/README.md` for AI model fine-tuning
- Customize theme in `tailwind.config.js`
- Add your app icons in `assets/`

## Quick Commands

```bash
npm start          # Start development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run on web browser

# Backend
cd backend
uvicorn main:app --reload
```

Happy journaling! 📝
