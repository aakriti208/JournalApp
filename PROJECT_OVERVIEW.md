# JournalApp - Complete Project Overview

## What is JournalApp?

JournalApp is a mobile journaling application inspired by Apple's Journal app, built with modern React Native technologies and enhanced with AI-powered features. It provides users with a beautiful, privacy-first journaling experience with personalized insights and writing prompts.

## Key Features Implemented

### 1. Authentication & Security
- ✅ User registration with email/password
- ✅ Secure login flow
- ✅ Session management with Supabase
- ✅ Secure token storage using expo-secure-store (iOS Keychain)
- ✅ Row-level security (RLS) in database
- ✅ Account creation with profile data

### 2. Home Dashboard
- ✅ Time-based personalized greeting ("Good morning John")
- ✅ Journal entry count display
- ✅ Streak statistics (current streak, longest streak)
- ✅ Days journaled counter
- ✅ Total words written
- ✅ AI-generated or fallback prompts display
- ✅ Shuffle prompt button
- ✅ Quick action buttons

### 3. Journal Entry Management
- ✅ Create new entries with title and body
- ✅ Rich text editor interface
- ✅ Date/timestamp for each entry
- ✅ Save and edit functionality
- ✅ Delete entries
- ✅ Word count tracking
- ✅ View entry history
- ✅ Edit existing entries

### 4. AI Integration
- ✅ Custom fine-tuned model support
- ✅ FastAPI backend for AI processing
- ✅ Analyze entries for themes
- ✅ Identify emotional patterns
- ✅ Generate personalized prompts based on history
- ✅ Suggest writing topics aligned with interests
- ✅ Daily/weekly inspiring questions
- ✅ Recurring theme identification
- ✅ Privacy-focused (all data stays in your database)

### 5. Reflection Prompts
- ✅ AI-generated prompts on home screen
- ✅ Pre-loaded fallback prompts (15+ prompts)
- ✅ Prompt categories: gratitude, relationships, achievements, memory, general
- ✅ Shuffle/refresh for new prompts
- ✅ Contextual prompts based on user patterns

### 6. Search & Discovery
- ✅ Search entries by title and content
- ✅ Real-time search filtering
- ✅ Entry history sorted by date
- ✅ Entry preview cards
- ✅ Quick entry access

### 7. Insights & Analytics
- ✅ AI-powered theme identification
- ✅ Emotional pattern analysis
- ✅ Personalized writing suggestions
- ✅ Word count statistics
- ✅ Journaling streak tracking
- ✅ Visual insights presentation

### 8. User Profile
- ✅ Profile display with statistics
- ✅ Total entries count
- ✅ Current and longest streak
- ✅ Total words written
- ✅ Days journaled
- ✅ Sign out functionality

## Technology Stack

### Frontend
- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Hooks
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: expo-secure-store
- **Haptics**: expo-haptics (iOS feedback)
- **Icons**: @expo/vector-icons (Ionicons)
- **Date Handling**: date-fns

### Backend
- **Framework**: FastAPI (Python)
- **AI Model**: OpenAI API / Custom fine-tuned model
- **Environment**: Python 3.9+
- **Dependencies**: transformers, torch, openai

### Database
- **Service**: Supabase
- **Type**: PostgreSQL
- **Features**: Row-level security, real-time subscriptions
- **Tables**: profiles, journal_entries, prompts, user_insights

## Project Structure

```
JournalApp/
├── app/                          # Expo Router pages
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                  # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── home.tsx            # Dashboard
│   │   ├── entries.tsx         # Entry list
│   │   ├── insights.tsx        # AI insights
│   │   └── profile.tsx         # User profile
│   ├── entry/
│   │   └── [id].tsx            # Entry detail/edit
│   ├── new-entry.tsx           # New entry screen
│   ├── _layout.tsx             # Root layout
│   └── index.tsx               # Auth check
│
├── backend/                     # AI Backend API
│   ├── main.py                 # FastAPI app
│   ├── requirements.txt        # Python deps
│   ├── database-schema.sql     # DB schema
│   └── README.md               # Backend docs
│
├── components/                  # Reusable components
│   └── (future components)
│
├── services/                    # API services
│   ├── auth.ts                 # Authentication
│   ├── journal.ts              # Journal CRUD
│   ├── ai.ts                   # AI integration
│   └── supabase.ts             # Supabase client
│
├── types/                       # TypeScript types
│   └── index.ts                # Shared interfaces
│
├── utils/                       # Utility functions
│   ├── prompts.ts              # Fallback prompts
│   └── stats.ts                # Statistics calculations
│
├── assets/                      # Images and assets
│   └── README.md               # Asset guidelines
│
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── app.json                    # Expo configuration
├── babel.config.js             # Babel config
├── global.css                  # Global styles
├── nativewind-env.d.ts         # NativeWind types
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind config
├── tsconfig.json               # TypeScript config
├── README.md                   # Main documentation
├── SETUP.md                    # Detailed setup guide
├── QUICKSTART.md               # Quick start guide
└── PROJECT_OVERVIEW.md         # This file
```

## API Endpoints (Backend)

### POST /api/analyze-entries
Analyzes journal entries and returns insights.

**Request:**
```json
{
  "entries": [
    {
      "id": "uuid",
      "title": "My Day",
      "content": "Today was great...",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "themes": ["gratitude", "personal growth"],
  "emotions": ["happy", "reflective"],
  "suggestions": ["Continue your gratitude practice"]
}
```

### POST /api/generate-prompt
Generates personalized writing prompt.

**Request:**
```json
{
  "userHistory": [...],
  "category": "gratitude"
}
```

**Response:**
```json
{
  "category": "gratitude",
  "text": "What small act of kindness touched you today?",
  "is_ai_generated": true
}
```

### POST /api/suggest-topics
Suggests topics based on patterns.

**Request:**
```json
{
  "entries": [...]
}
```

**Response:**
```json
{
  "topics": ["Career growth", "Family relationships", "Wellness"]
}
```

## Database Schema

### Tables

**profiles**
- id (UUID, PK, references auth.users)
- email (TEXT, unique)
- full_name (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**journal_entries**
- id (UUID, PK)
- user_id (UUID, FK)
- title (TEXT)
- content (TEXT)
- mood (TEXT, optional)
- tags (TEXT[], optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**prompts**
- id (UUID, PK)
- user_id (UUID, FK, nullable for global prompts)
- category (TEXT: gratitude|relationships|achievements|memory|general)
- text (TEXT)
- is_ai_generated (BOOLEAN)
- created_at (TIMESTAMP)

**user_insights**
- id (UUID, PK)
- user_id (UUID, FK)
- themes (TEXT[])
- emotions (TEXT[])
- suggestions (TEXT[])
- generated_at (TIMESTAMP)

## Privacy & Security

### Data Privacy
- All journal data stored in user's Supabase database
- Row-level security (RLS) ensures users only see their data
- AI processing on your backend (no third-party sharing)
- Optional: Use local AI model for complete privacy

### Security Features
- Passwords hashed with Supabase Auth
- Tokens stored in iOS Keychain (expo-secure-store)
- HTTPS for all API communications
- Environment variables for sensitive data
- No analytics or tracking by default

## Getting Started

See these guides for setup:

1. **QUICKSTART.md** - Get running in 5 minutes
2. **SETUP.md** - Detailed setup instructions
3. **backend/README.md** - AI backend setup and fine-tuning

## Development Workflow

### Running the App
```bash
npm install           # Install dependencies
npm start            # Start Expo dev server
npm run ios          # Run on iOS simulator
```

### Running the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Common Commands
```bash
npx expo start --clear    # Clear cache
npm run lint              # Run linter
npm install expo@latest   # Update Expo
```

## Future Enhancements

### Potential Features
- [ ] Photo attachments to entries
- [ ] Voice memo recording
- [ ] Advanced mood tracking
- [ ] Data export (PDF, JSON)
- [ ] Cloud backup
- [ ] Tags and categories
- [ ] Calendar heatmap view
- [ ] Share entries (selective)
- [ ] Reminders/notifications
- [ ] Markdown support
- [ ] Dark mode
- [ ] iPad optimization
- [ ] Widget support

### AI Improvements
- [ ] Fine-tune custom model on user data
- [ ] Sentiment analysis over time
- [ ] Goal tracking and progress
- [ ] Writing style analysis
- [ ] Topic clustering
- [ ] Mood prediction
- [ ] Weekly/monthly summaries

## Performance Considerations

### Optimizations Implemented
- Lazy loading of entries
- Pagination support in database queries
- Efficient state management
- Image optimization (for future photo feature)
- Database indexes on frequently queried fields

### Best Practices
- Use React.memo for expensive components
- Implement virtualized lists for large datasets
- Cache AI responses when possible
- Optimize images before uploading
- Use database indexes

## Deployment

### Mobile App
1. Build with EAS Build
2. Submit to App Store / Play Store
3. Configure app icons and splash screens

### Backend
1. Deploy to cloud provider (AWS, GCP, Heroku)
2. Set up environment variables
3. Configure CORS for production
4. Set up monitoring and logging

## Support & Contribution

### Getting Help
- Check documentation in README.md and SETUP.md
- Review Expo docs: https://docs.expo.dev
- Supabase docs: https://supabase.com/docs

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - See LICENSE file for details

---

Built with ❤️ using Expo, React Native, TypeScript, and Supabase
