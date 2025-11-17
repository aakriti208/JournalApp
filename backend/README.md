# JournalApp AI Backend

This backend service provides AI-powered features for the JournalApp including:
- Entry analysis and insights generation
- Personalized prompt generation
- Topic suggestions based on user patterns

## Setup

### Requirements
- Python 3.9+
- FastAPI
- OpenAI API (or custom fine-tuned model)
- PyTorch/TensorFlow (if using custom model)

### Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
MODEL_NAME=your_fine_tuned_model_name
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

### Running the Server

```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

### 1. Analyze Entries
**POST** `/api/analyze-entries`

Analyzes journal entries and returns insights about themes, emotions, and suggestions.

**Request Body:**
```json
{
  "entries": [
    {
      "id": "uuid",
      "title": "Entry title",
      "content": "Entry content...",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "themes": ["gratitude", "personal growth", "relationships"],
  "emotions": ["happy", "reflective", "hopeful"],
  "suggestions": [
    "Consider exploring your relationships theme more deeply",
    "Your gratitude practice shows consistency - keep it up!"
  ],
  "generated_at": "2025-01-01T00:00:00Z"
}
```

### 2. Generate Prompt
**POST** `/api/generate-prompt`

Generates a personalized writing prompt based on user history.

**Request Body:**
```json
{
  "userHistory": [...],
  "category": "gratitude"  // optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "category": "gratitude",
  "text": "What small moment of kindness did you experience today?",
  "is_ai_generated": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### 3. Suggest Topics
**POST** `/api/suggest-topics`

Suggests topics based on user's writing patterns.

**Request Body:**
```json
{
  "entries": [...]
}
```

**Response:**
```json
{
  "topics": [
    "Career aspirations",
    "Family relationships",
    "Personal wellness",
    "Creative pursuits"
  ]
}
```

## Fine-Tuning Your Model

### Data Preparation

1. Export user entries (anonymized)
2. Format training data:

```json
{
  "prompt": "Analyze the following journal entry and identify key themes:",
  "completion": "Themes: gratitude, personal growth. Emotions: hopeful, content."
}
```

### Training

For OpenAI fine-tuning:
```bash
openai api fine_tunes.create -t train.jsonl -m gpt-3.5-turbo
```

For custom models, see `train_model.py` in the backend directory.

## Security

- All endpoints require Bearer token authentication
- User data is never stored on AI provider servers
- Requests are encrypted in transit
- Model runs locally for maximum privacy (if using custom model)

## Privacy Considerations

This app is designed with privacy in mind:
- All journal data remains in your Supabase database
- AI processing happens on your backend server
- No third-party AI services required (when using custom model)
- Users have full control over their data
