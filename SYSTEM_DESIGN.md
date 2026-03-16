# JournalApp - System Design Report

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [High-Level Architecture](#high-level-architecture)
4. [Component Design](#component-design)
5. [Data Flow](#data-flow)
6. [Database Design](#database-design)
7. [API Design](#api-design)
8. [Security Architecture](#security-architecture)
9. [Scalability & Performance](#scalability--performance)
10. [Technology Stack Justification](#technology-stack-justification)
11. [Deployment Architecture](#deployment-architecture)
12. [Future Considerations](#future-considerations)

---

## Executive Summary

**JournalApp** is an AI-powered, cross-platform mobile journaling application that enables users to create, manage, and gain insights from their personal journal entries. The system leverages a modern tech stack with React Native/Expo for the frontend, Supabase for backend services, and a custom Python/FastAPI service for AI-powered features.

**Key Characteristics:**
- **Architecture Pattern**: Three-tier architecture (Client → Backend Services → Database)
- **Deployment Model**: Hybrid (BaaS + Custom API)
- **Scalability**: Horizontal scaling for AI backend, managed scaling for Supabase
- **Security**: JWT-based authentication, Row-Level Security (RLS), encrypted storage
- **Target Platforms**: iOS, Android, Web

---

## System Overview

### 2.1 System Purpose
JournalApp serves as a personal journaling platform with AI-enhanced features including:
- Secure journal entry creation and management
- AI-generated writing prompts based on entry content
- Mood and sentiment analysis
- Writing streak tracking and statistics
- Cross-device synchronization

### 2.2 Key Requirements

**Functional Requirements:**
- User authentication and authorization
- CRUD operations for journal entries
- AI-powered prompt generation
- Sentiment and mood analysis
- Writing statistics and streak calculation
- Real-time data synchronization across devices

**Non-Functional Requirements:**
- **Availability**: 99.9% uptime
- **Performance**: < 200ms response time for CRUD operations
- **Security**: End-to-end encryption for sensitive data
- **Scalability**: Support 100K+ concurrent users
- **Privacy**: User data isolation with RLS
- **Compliance**: GDPR-compliant data handling

---

## High-Level Architecture

### 3.1 Architecture Diagram (Textual Representation)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         React Native App (iOS, Android, Web)             │   │
│  │                                                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │  Screens │  │Components│  │ Services │  │  Utils  │ │   │
│  │  │ (Routes) │  │   (UI)   │  │ (Logic)  │  │ (Helpers)│   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  │                                                           │   │
│  │  Local State: AsyncStorage + SecureStore                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
┌──────────────────────────────┐  ┌──────────────────────┐
│    SUPABASE (BaaS)           │  │   AI BACKEND         │
│                              │  │   (FastAPI/Python)   │
│  ┌────────────────────────┐ │  │                      │
│  │  Authentication        │ │  │  ┌────────────────┐  │
│  │  - JWT tokens          │ │  │  │ /generate-     │  │
│  │  - Session management  │ │  │  │  prompt        │  │
│  └────────────────────────┘ │  │  └────────────────┘  │
│                              │  │                      │
│  ┌────────────────────────┐ │  │  ┌────────────────┐  │
│  │  Database              │ │  │  │ /analyze       │  │
│  │  - PostgreSQL          │ │  │  │                │  │
│  │  - Row-Level Security  │ │  │  └────────────────┘  │
│  └────────────────────────┘ │  │                      │
│                              │  │  AI Integration:     │
│  ┌────────────────────────┐ │  │  - OpenAI API        │
│  │  Real-time             │ │  │  - Custom models     │
│  │  - WebSocket           │ │  │                      │
│  └────────────────────────┘ │  │                      │
│                              │  │                      │
│  ┌────────────────────────┐ │  └──────────────────────┘
│  │  Storage               │ │
│  │  - File uploads        │ │
│  └────────────────────────┘ │
└──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│    DATA PERSISTENCE LAYER    │
│                              │
│  PostgreSQL Database         │
│  - journal_entries table     │
│  - auth.users (Supabase)     │
└──────────────────────────────┘
```

### 3.2 Architecture Pattern

**Three-Tier Architecture:**

1. **Presentation Layer** (Client)
   - React Native application
   - Expo framework for cross-platform support
   - NativeWind for styling
   - Expo Router for navigation

2. **Application Layer** (Services)
   - **Supabase BaaS**: Authentication, database, real-time subscriptions
   - **FastAPI Backend**: AI processing, custom business logic

3. **Data Layer**
   - PostgreSQL database (managed by Supabase)
   - Local storage (AsyncStorage, SecureStore)

### 3.3 Architecture Style

**Microservices-Oriented with BaaS:**
- Supabase handles commodity features (auth, database, storage)
- Custom FastAPI service handles specialized AI workloads
- Client communicates with both services independently
- Services are loosely coupled

**Benefits:**
- Separation of concerns
- Independent scaling of AI workloads
- Faster development with BaaS
- Reduced operational overhead

---

## Component Design

### 4.1 Frontend Components

#### 4.1.1 Application Layer
```
app/
├── _layout.tsx          # Root layout with navigation setup
└── index.tsx            # Main screen/entry point
```

**Routing Strategy:**
- File-based routing via Expo Router
- Stack navigation pattern
- Deep linking support with custom scheme

#### 4.1.2 Service Layer
```
services/
├── supabase.ts         # Supabase client initialization
├── auth.ts             # Authentication operations
├── journal.ts          # Journal CRUD operations
└── ai.ts               # AI backend communication
```

**Design Pattern**: Service Repository Pattern
- Abstraction layer over backend APIs
- Single responsibility per service
- Type-safe interfaces
- Error handling centralized

**Key Services:**

1. **Authentication Service** (auth.ts)
   - `signUp()`: User registration
   - `signIn()`: Email/password login
   - `signOut()`: Session termination
   - `getCurrentUser()`: Fetch authenticated user
   - `onAuthStateChange()`: Auth event listener

2. **Journal Service** (journal.ts)
   - `getEntries()`: Fetch all entries for user
   - `getEntry()`: Fetch single entry
   - `createEntry()`: Create new entry
   - `updateEntry()`: Modify existing entry
   - `deleteEntry()`: Remove entry

3. **AI Service** (ai.ts)
   - `generatePrompt()`: AI prompt generation
   - `analyzeEntry()`: Sentiment/mood analysis

4. **Supabase Client** (supabase.ts)
   - Custom SecureStore adapter for token persistence
   - Auto-refresh token configuration
   - Session management

#### 4.1.3 Utility Layer
```
utils/
├── stats.ts            # Analytics calculations
└── prompts.ts          # AI prompt templates
```

**Utility Functions:**
- `calculateStreak()`: Writing streak computation
- `getTotalWordCount()`: Aggregate word count
- `getEntriesByMonth()`: Date-based filtering
- Prompt templates for AI interactions

#### 4.1.4 Type Definitions
```
types/
└── index.ts            # TypeScript interfaces
```

**Core Types:**
- `User`: User profile structure
- `JournalEntry`: Entry schema
- `AIResponse`: AI service responses

### 4.2 Backend Components

#### 4.2.1 FastAPI Application (backend/main.py)

**Endpoints:**
- `GET /`: Health check
- `POST /api/generate-prompt`: AI prompt generation
- `POST /api/analyze`: Entry analysis

**Middleware:**
- CORS configuration for cross-origin requests
- Request/response logging (implicit)

**Request/Response Models:**
- `PromptRequest`: { content: string }
- `AnalysisRequest`: { content: string }
- Pydantic validation for type safety

#### 4.2.2 AI Integration Layer
- OpenAI API integration (planned)
- Custom model endpoints (configurable)
- Sentiment analysis algorithms

### 4.3 Database Layer (Supabase)

**Managed Services:**
- PostgreSQL database
- Authentication service
- Real-time subscriptions
- File storage
- Row-Level Security policies

---

## Data Flow

### 5.1 Authentication Flow

```
┌──────────┐                ┌──────────┐               ┌──────────┐
│  Client  │                │ Supabase │               │   DB     │
└────┬─────┘                └────┬─────┘               └────┬─────┘
     │                           │                          │
     │  1. signUp(email, pass)   │                          │
     ├──────────────────────────>│                          │
     │                           │  2. Create user          │
     │                           ├─────────────────────────>│
     │                           │                          │
     │                           │  3. User created         │
     │                           │<─────────────────────────┤
     │  4. JWT + Session         │                          │
     │<──────────────────────────┤                          │
     │                           │                          │
     │  5. Store in SecureStore  │                          │
     ├───────────┐               │                          │
     │           │               │                          │
     │<──────────┘               │                          │
     │                           │                          │
     │  6. Auto-refresh enabled  │                          │
     │<─────────────────────────>│                          │
```

**Key Points:**
- JWT tokens stored in Expo SecureStore (encrypted)
- Auto-refresh maintains session continuity
- Auth state changes trigger app-wide updates
- Session persists across app restarts

### 5.2 Journal Entry Creation Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │ Journal  │         │ Supabase │         │   DB     │
│          │         │ Service  │         │          │         │          │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │  1. Create Entry   │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │  2. Validate data  │                    │
     │                    ├──────┐             │                    │
     │                    │      │             │                    │
     │                    │<─────┘             │                    │
     │                    │                    │                    │
     │                    │  3. INSERT query   │                    │
     │                    │   (with user_id)   │                    │
     │                    ├───────────────────>│                    │
     │                    │                    │  4. Check RLS      │
     │                    │                    ├──────┐             │
     │                    │                    │      │             │
     │                    │                    │<─────┘             │
     │                    │                    │                    │
     │                    │                    │  5. Insert row     │
     │                    │                    ├───────────────────>│
     │                    │                    │                    │
     │                    │                    │  6. Return entry   │
     │                    │                    │<───────────────────┤
     │                    │  7. Entry created  │                    │
     │                    │<───────────────────┤                    │
     │  8. Return entry   │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │  9. Update UI      │                    │                    │
     ├──────┐             │                    │                    │
     │      │             │                    │                    │
     │<─────┘             │                    │                    │
```

**Key Points:**
- User ID automatically attached from auth context
- RLS policies verify user owns the entry
- Validation at both client and database levels
- Optimistic UI updates possible

### 5.3 AI Analysis Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Client  │      │   AI     │      │  FastAPI │      │  OpenAI  │
│          │      │ Service  │      │  Backend │      │   API    │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │  1. Analyze     │                 │                 │
     │    Entry        │                 │                 │
     ├────────────────>│                 │                 │
     │                 │  2. POST        │                 │
     │                 │    /api/analyze │                 │
     │                 ├────────────────>│                 │
     │                 │                 │  3. Process     │
     │                 │                 │     content     │
     │                 │                 ├────┐            │
     │                 │                 │    │            │
     │                 │                 │<───┘            │
     │                 │                 │                 │
     │                 │                 │  4. Call AI API │
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │                 │  5. Analysis    │
     │                 │                 │<────────────────┤
     │                 │                 │                 │
     │                 │                 │  6. Format      │
     │                 │                 │     response    │
     │                 │                 ├────┐            │
     │                 │                 │    │            │
     │                 │                 │<───┘            │
     │                 │  7. Return      │                 │
     │                 │     analysis    │                 │
     │                 │<────────────────┤                 │
     │  8. Display     │                 │                 │
     │     insights    │                 │                 │
     │<────────────────┤                 │                 │
```

**Key Points:**
- Asynchronous processing for better UX
- Client-side loading states during analysis
- Error handling for AI service failures
- Potential for caching frequent analyses

### 5.4 Real-Time Sync Flow (Future)

```
┌──────────┐              ┌──────────┐              ┌──────────┐
│ Client A │              │ Supabase │              │ Client B │
└────┬─────┘              └────┬─────┘              └────┬─────┘
     │                         │                         │
     │  1. Subscribe to        │                         │
     │     changes             │                         │
     ├────────────────────────>│                         │
     │                         │  2. WebSocket opened    │
     │                         │                         │
     │                         │  3. Subscribe to        │
     │                         │     changes             │
     │                         │<────────────────────────┤
     │                         │                         │
     │  4. Update entry        │                         │
     ├────────────────────────>│                         │
     │                         │  5. Broadcast change    │
     │                         ├────────────────────────>│
     │                         │                         │
     │                         │  6. Update local state  │
     │                         │                         ├───┐
     │                         │                         │   │
     │                         │                         │<──┘
```

---

## Database Design

### 6.1 Schema Design

#### 6.1.1 Tables

**journal_entries**
```sql
CREATE TABLE journal_entries (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users NOT NULL,
  title             TEXT,
  content           TEXT NOT NULL,
  mood              TEXT,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Indexes
  INDEX idx_user_created (user_id, created_at DESC),
  INDEX idx_created_at (created_at DESC)
);
```

**auth.users** (Managed by Supabase)
```sql
-- Supabase managed table
-- Contains: id, email, encrypted_password, email_confirmed_at, etc.
```

#### 6.1.2 Relationships

```
auth.users (1) ──────< (N) journal_entries
   └─ id                      └─ user_id
```

**Cardinality:**
- One user has many journal entries
- One journal entry belongs to one user

#### 6.1.3 Indexes

1. **Primary Indexes:**
   - `journal_entries.id` (UUID, clustered)
   - `auth.users.id` (UUID, clustered)

2. **Secondary Indexes:**
   - `idx_user_created`: Composite index on (user_id, created_at DESC)
     - Purpose: Fast retrieval of user's entries ordered by date
   - `idx_created_at`: Index on created_at
     - Purpose: Global queries by date (analytics)

### 6.2 Data Model

**Entity: JournalEntry**
```typescript
interface JournalEntry {
  id: string;              // UUID
  user_id: string;         // UUID, FK to auth.users
  title: string | null;    // Optional title
  content: string;         // Entry text (required)
  mood: string | null;     // Mood tag (optional)
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

**Entity: User**
```typescript
interface User {
  id: string;              // UUID
  email: string;           // Unique email
  created_at: string;      // ISO timestamp
}
```

### 6.3 Row-Level Security (RLS)

**Security Model:**
```sql
-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own entries
CREATE POLICY "Users can view their own entries"
  ON journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can create their own entries
CREATE POLICY "Users can create their own entries"
  ON journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own entries
CREATE POLICY "Users can update their own entries"
  ON journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy 4: Users can delete their own entries
CREATE POLICY "Users can delete their own entries"
  ON journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Benefits:**
- Database-level security enforcement
- No data leakage between users
- Protection against compromised client code
- Simplified authorization logic

### 6.4 Data Integrity

**Constraints:**
1. **NOT NULL constraints**:
   - user_id (every entry must belong to a user)
   - content (entries must have content)

2. **Foreign Key constraints**:
   - user_id references auth.users(id)
   - Cascade behavior: Configurable (recommend SET NULL or CASCADE DELETE)

3. **Default values**:
   - id: Auto-generated UUID
   - created_at: Current timestamp
   - updated_at: Current timestamp

### 6.5 Database Scaling Considerations

**Current Design Supports:**
- Vertical scaling (Supabase managed)
- Read replicas for analytics queries
- Connection pooling (Supabase PgBouncer)

**Future Optimizations:**
- Partitioning by user_id or created_at for large datasets
- Archive old entries to cold storage
- Full-text search indexes for content searching

---

## API Design

### 7.1 REST API Conventions

**Base URLs:**
- Supabase API: `https://<project-id>.supabase.co`
- AI Backend: `http://localhost:8000` (development)

**Common Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
apikey: <supabase-anon-key>
```

### 7.2 Supabase API Endpoints

#### 7.2.1 Authentication

**POST /auth/v1/signup**
```json
Request:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (200):
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "v1-Abc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**POST /auth/v1/token?grant_type=password**
```json
Request:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (200):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "v1-Abc...",
  "user": { ... }
}
```

**POST /auth/v1/logout**
```json
Request: {}
Response (204): No content
```

#### 7.2.2 Journal Entries (via PostgREST)

**GET /rest/v1/journal_entries**
```
Query params:
  - select=*
  - user_id=eq.<uuid>
  - order=created_at.desc
  - limit=<number>

Response (200):
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "My Day",
    "content": "Today was...",
    "mood": "happy",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**POST /rest/v1/journal_entries**
```json
Request:
{
  "user_id": "uuid",
  "title": "My Day",
  "content": "Today was great!",
  "mood": "happy"
}

Response (201):
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "My Day",
  "content": "Today was great!",
  "mood": "happy",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**PATCH /rest/v1/journal_entries?id=eq.<uuid>**
```json
Request:
{
  "content": "Updated content",
  "updated_at": "2024-01-01T12:00:00Z"
}

Response (200):
{
  "id": "uuid",
  "user_id": "uuid",
  "content": "Updated content",
  ...
}
```

**DELETE /rest/v1/journal_entries?id=eq.<uuid>**
```
Response (204): No content
```

### 7.3 AI Backend API Endpoints

#### 7.3.1 Generate Prompt

**POST /api/generate-prompt**
```json
Request:
{
  "content": "Today I felt overwhelmed with work..."
}

Response (200):
{
  "prompt": "Reflect on: What specific task overwhelmed you most?",
  "status": "success"
}

Error (500):
{
  "detail": "Error message"
}
```

#### 7.3.2 Analyze Entry

**POST /api/analyze**
```json
Request:
{
  "content": "Today was amazing! I completed my project..."
}

Response (200):
{
  "mood": "positive",
  "themes": ["achievement", "productivity"],
  "word_count": 45,
  "sentiment_score": 0.85
}

Error (500):
{
  "detail": "Error message"
}
```

### 7.4 API Error Handling

**Standard Error Response:**
```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "status": 400,
    "details": {}
  }
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 204: No content (delete success)
- 400: Bad request (validation error)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (RLS policy violation)
- 404: Not found
- 429: Too many requests (rate limit)
- 500: Internal server error

---

## Security Architecture

### 8.1 Authentication & Authorization

#### 8.1.1 Authentication Flow
- **Method**: JWT (JSON Web Tokens)
- **Provider**: Supabase Auth
- **Token Storage**: Expo SecureStore (encrypted)
- **Token Refresh**: Automatic via Supabase client

**Security Features:**
- Bcrypt password hashing (managed by Supabase)
- JWT signature verification
- Token expiration (configurable, default 1 hour)
- Refresh token rotation
- Session management

#### 8.1.2 Authorization Strategy
- **Database Level**: Row-Level Security (RLS) policies
- **Application Level**: User ID verification in services
- **Principle**: Defense in depth

**RLS Benefits:**
- Cannot be bypassed by compromised client
- Enforced at database query time
- Automatic with all database operations

### 8.2 Data Security

#### 8.2.1 Data at Rest
- **Database**: PostgreSQL encryption (Supabase managed)
- **Local Storage**:
  - SecureStore for tokens (encrypted with device keychain)
  - AsyncStorage for non-sensitive cache

#### 8.2.2 Data in Transit
- **HTTPS/TLS**: All API communication encrypted
- **Certificate Pinning**: Recommended for production

#### 8.2.3 Data Privacy
- **User Isolation**: RLS ensures complete data segregation
- **No Cross-User Queries**: Database policies prevent data leakage
- **GDPR Compliance**:
  - Data export capability (via Supabase)
  - Right to deletion (cascade delete)
  - Data minimization (only essential fields)

### 8.3 API Security

#### 8.3.1 CORS Configuration
```javascript
// Current: Allow all origins (development)
allow_origins=["*"]

// Production recommendation:
allow_origins=[
  "https://app.journalapp.com",
  "journalapp://*"  // Mobile deep links
]
```

#### 8.3.2 Rate Limiting
**Recommendations:**
- Auth endpoints: 5 requests/minute per IP
- CRUD endpoints: 100 requests/minute per user
- AI endpoints: 20 requests/minute per user (AI costs)

**Implementation**: Supabase built-in + custom middleware

#### 8.3.3 Input Validation
- **Client**: TypeScript type checking
- **Backend**: Pydantic models (FastAPI)
- **Database**: Schema constraints + RLS

**Validation Rules:**
- Content length limits (prevent DoS)
- SQL injection prevention (parameterized queries)
- XSS prevention (content sanitization if rendering HTML)

### 8.4 Secrets Management

**Current Configuration:**
```
Frontend (.env):
- EXPO_PUBLIC_SUPABASE_URL (public)
- EXPO_PUBLIC_SUPABASE_ANON_KEY (public, safe)
- EXPO_PUBLIC_AI_BACKEND_URL (public)

Backend (.env):
- SUPABASE_URL (private)
- SUPABASE_KEY (private, service role)
- OPENAI_API_KEY (private)
```

**Best Practices:**
- Never commit .env files (in .gitignore)
- Use environment-specific secrets
- Rotate API keys periodically
- Use service role keys only on backend

### 8.5 Security Checklist

- [x] JWT authentication
- [x] Encrypted token storage
- [x] Row-Level Security
- [x] HTTPS for all requests
- [ ] Rate limiting (recommended)
- [ ] CORS hardening for production
- [ ] Certificate pinning (recommended)
- [ ] Security headers (CSP, HSTS)
- [ ] Audit logging (recommended)
- [ ] Penetration testing

---

## Scalability & Performance

### 9.1 Scalability Strategy

#### 9.1.1 Horizontal Scalability

**AI Backend (FastAPI):**
- Stateless design enables easy horizontal scaling
- Load balancer distribution (e.g., AWS ALB, Nginx)
- Auto-scaling based on CPU/memory metrics
- Container orchestration (Kubernetes, ECS)

**Supabase:**
- Managed scaling (automatic)
- Read replicas for analytics
- Connection pooling (PgBouncer)

#### 9.1.2 Vertical Scalability

**Database:**
- Upgrade instance size as needed
- Supabase provides scaling options
- Monitor query performance

### 9.2 Performance Optimization

#### 9.2.1 Database Optimization

**Indexing Strategy:**
```sql
-- Composite index for user queries
CREATE INDEX idx_user_created ON journal_entries (user_id, created_at DESC);

-- Full-text search (future)
CREATE INDEX idx_content_fts ON journal_entries
  USING GIN (to_tsvector('english', content));
```

**Query Optimization:**
- Use `.select()` to fetch only needed columns
- Implement pagination (limit + offset)
- Cache frequently accessed data

**Estimated Performance:**
- Simple SELECT: < 50ms
- INSERT/UPDATE: < 100ms
- Complex analytics: < 500ms

#### 9.2.2 Client-Side Optimization

**Caching Strategy:**
```
┌─────────────────────────────────────────┐
│         Client Caching Layers           │
├─────────────────────────────────────────┤
│  1. Memory Cache (React State)          │
│     - Current screen data                │
│     - Lifetime: Session                  │
│                                          │
│  2. AsyncStorage (Persistent)            │
│     - Recent entries (last 30 days)      │
│     - Lifetime: Until invalidated        │
│                                          │
│  3. SecureStore (Auth Tokens)            │
│     - JWT & refresh tokens               │
│     - Lifetime: Until logout             │
└─────────────────────────────────────────┘
```

**Optimizations:**
- Lazy loading of old entries
- Image/asset optimization
- Code splitting (dynamic imports)
- Bundle size reduction

#### 9.2.3 Network Optimization

**Strategies:**
- Request batching (combine multiple queries)
- Compression (gzip, brotli)
- CDN for static assets
- WebSocket for real-time (reduce polling)

**Example Optimization:**
```javascript
// Instead of multiple queries
const user = await getUser();
const entries = await getEntries(user.id);
const stats = await getStats(user.id);

// Single optimized query
const { data } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### 9.3 Caching Architecture

```
┌─────────────────────────────────────────────────┐
│                    Client                        │
│  ┌───────────────────────────────────────────┐  │
│  │  React State (in-memory)                  │  │
│  │  - Active screen data                     │  │
│  │  - TTL: Session duration                  │  │
│  └───────────────────────────────────────────┘  │
│                      │                           │
│  ┌───────────────────────────────────────────┐  │
│  │  AsyncStorage (persistent)                │  │
│  │  - Offline entries, user preferences      │  │
│  │  - TTL: Manual invalidation                │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              API Layer (Future)                  │
│  ┌───────────────────────────────────────────┐  │
│  │  Redis Cache                               │  │
│  │  - Frequent queries (user stats)           │  │
│  │  - TTL: 5-15 minutes                       │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 9.4 Load Estimates

**Assumptions:**
- 100,000 active users
- Average 1 entry per user per day
- Average entry: 500 words (2.5KB)
- Peak load: 20% of daily users in 1 hour

**Database Load:**
- Daily writes: 100K entries = 250MB data
- Monthly storage: ~7.5GB
- Peak writes: 20K writes/hour = ~5-6 writes/second
- Read queries: ~10-20x write volume

**AI Backend Load:**
- AI requests: ~20% of entries (20K/day)
- Peak load: 4K requests/hour = ~1 request/second
- Each request: ~5-10 seconds (AI processing)
- Concurrent workers needed: 5-10

### 9.5 Monitoring & Metrics

**Key Performance Indicators:**
- Response time (p50, p95, p99)
- Error rate
- Database query performance
- AI request latency
- Active user count
- Storage usage

**Tools:**
- Supabase Dashboard (built-in metrics)
- Application Performance Monitoring (APM)
  - Sentry for error tracking
  - DataDog/New Relic for performance
- Custom analytics dashboard

---

## Technology Stack Justification

### 10.1 Frontend Stack

#### React Native + Expo
**Chosen for:**
- Cross-platform development (iOS, Android, Web)
- Large ecosystem and community
- Hot reload for fast development
- Native performance
- Expo managed workflow reduces complexity

**Alternatives Considered:**
- Flutter: Dart learning curve, smaller ecosystem
- Native (Swift/Kotlin): Higher development cost, separate codebases

#### TypeScript
**Chosen for:**
- Static type checking reduces bugs
- Better IDE support and autocomplete
- Improved code maintainability
- Industry standard for large applications

#### NativeWind (Tailwind CSS)
**Chosen for:**
- Utility-first approach speeds development
- Consistent design system
- Smaller bundle size than traditional CSS
- Familiar to web developers

**Alternatives Considered:**
- Styled Components: More verbose, performance overhead
- Native StyleSheet: Less productive, no design system

#### Expo Router
**Chosen for:**
- File-based routing (similar to Next.js)
- Deep linking support
- Type-safe navigation
- Modern routing patterns

### 10.2 Backend Stack

#### Supabase (BaaS)
**Chosen for:**
- Rapid development (auth, DB, storage out-of-the-box)
- PostgreSQL (robust, mature RDBMS)
- Row-Level Security
- Real-time subscriptions
- Generous free tier
- Reduced operational overhead

**Alternatives Considered:**
- Firebase: NoSQL limitations, vendor lock-in concerns
- Custom backend: Higher development time, operational complexity
- AWS Amplify: More complex setup, AWS ecosystem lock-in

**Trade-offs:**
- Vendor dependency (mitigated by PostgreSQL standard)
- Less customization than full custom backend
- Pricing at scale (competitive for this use case)

#### FastAPI (Python)
**Chosen for:**
- Modern async framework
- Automatic OpenAPI documentation
- Fast performance (ASGI)
- Excellent for ML/AI integration (Python ecosystem)
- Type hints (Pydantic validation)

**Alternatives Considered:**
- Django: Heavier, more opinionated
- Flask: Less modern, no async support
- Node.js/Express: Less ideal for AI/ML workloads

#### OpenAI API
**Chosen for:**
- State-of-the-art language models
- Easy integration
- Pay-per-use pricing
- Rapid prototyping

**Future Consideration:**
- Custom fine-tuned models for cost optimization
- On-premise models for data privacy

### 10.3 Infrastructure

#### Cloud Provider (Recommended: AWS/Vercel/Fly.io)
**For FastAPI Backend:**
- AWS ECS/Fargate: Container orchestration
- Vercel: Easy deployment, good DX
- Fly.io: Edge deployment, low latency

**For Supabase:**
- Managed cloud (supabase.com)
- Self-hosted option available

### 10.4 Stack Summary

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Mobile Client** | React Native + Expo | Cross-platform, fast development |
| **Language** | TypeScript | Type safety, maintainability |
| **Styling** | NativeWind | Productivity, consistency |
| **State Management** | React Hooks | Built-in, sufficient for app size |
| **Navigation** | Expo Router | Modern, type-safe routing |
| **Backend (BaaS)** | Supabase | Rapid dev, managed services |
| **Database** | PostgreSQL | Robust, mature, great for structured data |
| **AI Backend** | FastAPI + Python | Async, ML ecosystem, performance |
| **AI Provider** | OpenAI | State-of-the-art models |
| **Authentication** | Supabase Auth | Integrated, secure, JWT-based |
| **Storage (local)** | SecureStore + AsyncStorage | Native encryption, persistence |

---

## Deployment Architecture

### 11.1 Development Environment

```
┌─────────────────────────────────────────────────┐
│           Developer Machine                      │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │  Mobile App (Expo)                     │    │
│  │  - npm start                            │    │
│  │  - Runs on device/simulator             │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │  AI Backend (FastAPI)                   │    │
│  │  - python main.py                       │    │
│  │  - localhost:8000                       │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  Environment: .env files                        │
└─────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│         Supabase Cloud (Development)             │
│  - Database                                      │
│  - Authentication                                │
│  - Storage                                       │
└─────────────────────────────────────────────────┘
```

### 11.2 Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                    User Devices                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   iOS App   │  │ Android App │  │   Web App   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│         │                 │                 │           │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌───────────────────────────┐  ┌──────────────────────┐
│   Supabase Production     │  │   AI Backend         │
│   (supabase.com)          │  │   (AWS/Vercel/Fly)   │
│                           │  │                      │
│  ┌─────────────────────┐ │  │  ┌────────────────┐  │
│  │  Auth Service       │ │  │  │  FastAPI App   │  │
│  │  - JWT management   │ │  │  │  - /api/*      │  │
│  └─────────────────────┘ │  │  └────────────────┘  │
│                           │  │                      │
│  ┌─────────────────────┐ │  │  ┌────────────────┐  │
│  │  PostgreSQL DB      │ │  │  │  Load Balancer │  │
│  │  - RLS enabled      │ │  │  │  (ALB/Nginx)   │  │
│  └─────────────────────┘ │  │  └────────────────┘  │
│                           │  │                      │
│  ┌─────────────────────┐ │  │  ┌────────────────┐  │
│  │  Real-time          │ │  │  │  Auto-scaling  │  │
│  │  - WebSocket        │ │  │  │  (2-10 inst.)  │  │
│  └─────────────────────┘ │  │  └────────────────┘  │
│                           │  │                      │
│  ┌─────────────────────┐ │  │  Environment:        │
│  │  Storage            │ │  │  - Env vars          │
│  │  - File uploads     │ │  │  - Secrets manager   │
│  └─────────────────────┘ │  └──────────────────────┘
└───────────────────────────┘            │
                                         ▼
                              ┌──────────────────────┐
                              │   External Services  │
                              │  ┌────────────────┐  │
                              │  │  OpenAI API    │  │
                              │  └────────────────┘  │
                              └──────────────────────┘
```

### 11.3 Deployment Pipeline

#### 11.3.1 Mobile App (Expo)

**Development:**
```bash
npm start                # Expo development server
npm run ios              # iOS simulator
npm run android          # Android emulator
```

**Production Build:**
```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android

# Web
npm run build:web
# Deploy to Vercel/Netlify
```

**CI/CD Pipeline:**
```yaml
# Example: GitHub Actions
name: Build Mobile App
on: [push]
jobs:
  build:
    - Run tests
    - Build app (EAS Build)
    - Submit to stores (if main branch)
```

#### 11.3.2 AI Backend (FastAPI)

**Containerization:**
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deployment Options:**

**Option 1: AWS ECS/Fargate**
```bash
# Build and push image
docker build -t journal-ai-backend .
docker tag journal-ai-backend:latest <ecr-url>
docker push <ecr-url>

# Deploy with ECS
aws ecs update-service --cluster journal --service ai-backend
```

**Option 2: Fly.io**
```bash
fly launch                # Initial setup
fly deploy                # Deploy updates
fly scale count 2         # Scale to 2 instances
```

**Option 3: Vercel (Serverless)**
```bash
vercel deploy --prod
```

### 11.4 Environment Configuration

#### Production Environment Variables

**Mobile App:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_AI_BACKEND_URL=https://api.journalapp.com
```

**AI Backend:**
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...(service_role)
OPENAI_API_KEY=sk-...
ENVIRONMENT=production
LOG_LEVEL=info
```

### 11.5 Monitoring & Logging

**Application Monitoring:**
- Sentry: Error tracking and performance monitoring
- LogRocket: Session replay for debugging
- Custom analytics: User behavior tracking

**Infrastructure Monitoring:**
- CloudWatch (AWS): Metrics, logs, alarms
- Fly.io Metrics: Built-in monitoring
- Supabase Dashboard: Database performance

**Logging Strategy:**
```
INFO: Normal operations
WARN: Degraded performance, retries
ERROR: Operation failures, exceptions
CRITICAL: System failures, immediate attention
```

### 11.6 Disaster Recovery

**Backup Strategy:**
- Supabase automated daily backups
- Point-in-time recovery (PITR) available
- Backup retention: 30 days

**Recovery Procedures:**
1. Database restore from Supabase backup
2. Redeploy AI backend from git commit
3. Mobile app: Previous version available in stores

**RTO/RPO:**
- Recovery Time Objective (RTO): < 1 hour
- Recovery Point Objective (RPO): < 24 hours

---

## Future Considerations

### 12.1 Feature Roadmap

#### Phase 1: MVP (Current)
- [x] User authentication
- [x] Journal entry CRUD
- [x] Basic AI prompts
- [x] Writing statistics
- [ ] Mobile app UI completion
- [ ] AI analysis implementation

#### Phase 2: Enhancement (3-6 months)
- [ ] Rich text editor
- [ ] Image attachments
- [ ] Voice-to-text entries
- [ ] Advanced mood tracking
- [ ] Customizable themes
- [ ] Export functionality (PDF, JSON)

#### Phase 3: Social & Insights (6-12 months)
- [ ] Sharing selected entries
- [ ] AI-generated weekly/monthly summaries
- [ ] Trend analysis over time
- [ ] Guided journaling programs
- [ ] Integration with wearables (mood correlation)

#### Phase 4: Premium Features (12+ months)
- [ ] Collaborative journals (shared with therapist/partner)
- [ ] Custom AI model fine-tuned on user's writing
- [ ] Advanced analytics dashboard
- [ ] Journal templates marketplace
- [ ] API for third-party integrations

### 12.2 Technical Improvements

#### 12.2.1 Performance
- [ ] Implement full caching strategy
- [ ] Add Redis for AI backend caching
- [ ] Optimize database queries with materialized views
- [ ] Implement CDN for static assets
- [ ] Add service worker for offline support (web)

#### 12.2.2 Scalability
- [ ] Implement horizontal scaling for AI backend
- [ ] Add database read replicas
- [ ] Partition large tables by date
- [ ] Implement background job queue (Celery/BullMQ)
- [ ] Add rate limiting and throttling

#### 12.2.3 Reliability
- [ ] Implement circuit breakers for AI API calls
- [ ] Add health check endpoints
- [ ] Implement graceful degradation
- [ ] Add comprehensive error monitoring
- [ ] Implement automated testing (unit, integration, e2e)

#### 12.2.4 Security
- [ ] Add rate limiting on all endpoints
- [ ] Implement CAPTCHA for signup
- [ ] Add certificate pinning
- [ ] Conduct security audit
- [ ] Implement 2FA for accounts
- [ ] Add content moderation for shared entries

### 12.3 Architecture Evolution

#### 12.3.1 Microservices Expansion
Consider splitting into focused services:
```
┌─────────────────────────────────────────┐
│         API Gateway / BFF                │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┼─────────┬──────────┐
        │         │         │          │
        ▼         ▼         ▼          ▼
    ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐
    │ Auth │ │Journal│ │AI/ML   │ │Analytics│
    │Service│ │Service│ │Service │ │Service  │
    └──────┘ └──────┘ └────────┘ └────────┘
```

**Benefits:**
- Independent scaling
- Technology diversity
- Fault isolation
- Team autonomy

**Challenges:**
- Increased complexity
- Distributed transactions
- Service discovery
- Monitoring overhead

#### 12.3.2 Event-Driven Architecture
Implement event bus for async processing:
```
Journal Entry Created Event
  ├─> AI Analysis Service (analyze sentiment)
  ├─> Statistics Service (update streak)
  ├─> Notification Service (achievement unlocked)
  └─> Search Index Service (update search index)
```

**Tools:**
- AWS EventBridge
- Apache Kafka
- RabbitMQ
- Supabase Real-time (WebSocket)

### 12.4 Data & Analytics

#### 12.4.1 Analytics Pipeline
```
App Events → Segment/Amplitude → Data Warehouse → BI Tools
                                     (BigQuery)    (Metabase)
```

**Key Metrics:**
- Daily/Monthly Active Users (DAU/MAU)
- Retention rate (Day 1, Day 7, Day 30)
- Writing frequency distribution
- Feature adoption rates
- AI feature usage
- User engagement score

#### 12.4.2 Machine Learning Opportunities
- **Personalized prompts**: Train on user's past entries
- **Mood prediction**: Predict mood from writing patterns
- **Anomaly detection**: Identify concerning patterns (mental health)
- **Smart suggestions**: Recommend journaling times based on habits
- **Content recommendations**: Suggest topics to write about

### 12.5 Compliance & Legal

#### 12.5.1 GDPR Compliance
- [x] Data minimization (only essential fields)
- [x] User data isolation (RLS)
- [ ] Data export functionality
- [ ] Right to be forgotten (account deletion)
- [ ] Privacy policy
- [ ] Cookie consent (web)
- [ ] Data processing agreement

#### 12.5.2 HIPAA Compliance (if offering mental health features)
- [ ] Business Associate Agreement with Supabase
- [ ] Encryption at rest and in transit
- [ ] Audit logging
- [ ] Access controls
- [ ] Breach notification procedures

#### 12.5.3 Accessibility (WCAG 2.1)
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Color contrast compliance
- [ ] Text scaling support
- [ ] Voice control compatibility

### 12.6 Cost Optimization

#### Current Estimated Costs (100K users)
```
Supabase: ~$25/month (free tier) → ~$100-500/month (scaled)
FastAPI Hosting: ~$20-100/month (Fly.io/AWS)
OpenAI API: ~$500-2000/month (usage-based)
Total: ~$620-2600/month
```

#### Optimization Strategies
1. **Caching**: Reduce database queries by 70%
2. **Custom AI models**: Replace OpenAI ($0.03/1K tokens) with fine-tuned model ($0.002/1K tokens)
3. **Compression**: Reduce bandwidth costs
4. **Reserved instances**: 30-50% savings on compute
5. **Data archival**: Move old entries to cheaper storage

### 12.7 Testing Strategy

#### 12.7.1 Test Pyramid
```
              ┌─────────┐
             /  E2E (5%) \
            /─────────────\
           /  Integration  \
          /    Tests (15%)  \
         /───────────────────\
        /    Unit Tests (80%)  \
       /───────────────────────\
```

**Unit Tests:**
- Service layer logic
- Utility functions
- Component logic

**Integration Tests:**
- API endpoint testing
- Database operations
- Service interactions

**End-to-End Tests:**
- Critical user flows (signup, create entry)
- Cross-platform testing (iOS, Android, Web)

**Tools:**
- Jest: Unit and integration tests
- Detox: E2E for React Native
- Pytest: Backend tests

#### 12.7.2 Test Coverage Goals
- Unit tests: > 80%
- Integration tests: Critical paths
- E2E tests: Core user journeys

---

## Conclusion

This system design provides a robust, scalable, and maintainable architecture for JournalApp. The design leverages modern technologies and best practices while maintaining flexibility for future growth.

**Key Strengths:**
1. **Rapid Development**: Expo + Supabase enables fast iteration
2. **Scalability**: Architecture supports growth to millions of users
3. **Security**: Multiple layers of protection (JWT, RLS, encryption)
4. **User Experience**: Cross-platform with native performance
5. **Flexibility**: Modular design allows independent service evolution

**Next Steps:**
1. Complete MVP features (mobile UI, AI integration)
2. Implement comprehensive testing
3. Deploy production environment
4. Launch beta program
5. Iterate based on user feedback

---

**Document Version**: 1.0
**Last Updated**: March 15, 2026
**Author**: System Architecture Team
