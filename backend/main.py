from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import openai

load_dotenv()

app = FastAPI(title="JournalApp AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI configuration
openai.api_key = os.getenv("OPENAI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-3.5-turbo")

# Models
class JournalEntry(BaseModel):
    id: str
    title: str
    content: str
    created_at: str

class AnalyzeEntriesRequest(BaseModel):
    entries: List[JournalEntry]

class GeneratePromptRequest(BaseModel):
    userHistory: List[JournalEntry]
    category: Optional[str] = None

class SuggestTopicsRequest(BaseModel):
    entries: List[JournalEntry]

class AIInsight(BaseModel):
    themes: List[str]
    emotions: List[str]
    suggestions: List[str]

class Prompt(BaseModel):
    category: str
    text: str
    is_ai_generated: bool

# Authentication
async def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    scheme, token = authorization.split()
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authentication scheme")

    # Verify token against your backend
    # For now, just check if token exists
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    return token

# Endpoints
@app.get("/")
async def root():
    return {"message": "JournalApp AI API", "version": "1.0.0"}

@app.post("/api/analyze-entries", response_model=AIInsight)
async def analyze_entries(
    request: AnalyzeEntriesRequest,
    token: str = Depends(verify_token)
):
    """
    Analyze journal entries and return insights about themes, emotions, and suggestions.
    """
    try:
        # Prepare entries for analysis
        entries_text = "\n\n".join([
            f"Title: {entry.title}\nContent: {entry.content}"
            for entry in request.entries[-10:]  # Analyze last 10 entries
        ])

        # Call OpenAI API (or your custom model)
        response = openai.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": """You are an AI assistant that analyzes journal entries.
                    Identify common themes, emotional patterns, and provide constructive suggestions.
                    Return your analysis in JSON format with three fields:
                    - themes: array of 3-5 recurring themes
                    - emotions: array of 3-5 dominant emotions
                    - suggestions: array of 2-3 personalized suggestions"""
                },
                {
                    "role": "user",
                    "content": f"Analyze these journal entries:\n\n{entries_text}"
                }
            ],
            temperature=0.7,
            max_tokens=500
        )

        # Parse response
        analysis_text = response.choices[0].message.content

        # For demo purposes, return sample data
        # In production, parse the AI response properly
        return AIInsight(
            themes=["Personal Growth", "Gratitude", "Relationships"],
            emotions=["Hopeful", "Reflective", "Content"],
            suggestions=[
                "Your entries show consistent reflection on personal growth",
                "Consider exploring your relationship themes more deeply",
                "Continue your gratitude practice - it's showing positive patterns"
            ]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-prompt", response_model=Prompt)
async def generate_prompt(
    request: GeneratePromptRequest,
    token: str = Depends(verify_token)
):
    """
    Generate a personalized writing prompt based on user history.
    """
    try:
        # Analyze recent entries to understand user's interests
        recent_entries = "\n".join([
            entry.content[:200]  # First 200 chars of each entry
            for entry in request.userHistory[-5:]
        ])

        category_prompt = f"in the {request.category} category" if request.category else ""

        response = openai.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a thoughtful journaling prompt generator.
                    Create a personalized, meaningful writing prompt {category_prompt}
                    based on the user's recent journal entries. The prompt should be:
                    - Thought-provoking but not overwhelming
                    - Relevant to their recent themes
                    - Encouraging reflection and growth
                    Return only the prompt text, nothing else."""
                },
                {
                    "role": "user",
                    "content": f"Recent entries:\n{recent_entries}\n\nGenerate a prompt."
                }
            ],
            temperature=0.8,
            max_tokens=100
        )

        prompt_text = response.choices[0].message.content.strip()

        return Prompt(
            category=request.category or "general",
            text=prompt_text,
            is_ai_generated=True
        )

    except Exception as e:
        # Fallback to generic prompt
        return Prompt(
            category=request.category or "general",
            text="What emotions are you experiencing right now, and what might be causing them?",
            is_ai_generated=False
        )

@app.post("/api/suggest-topics")
async def suggest_topics(
    request: SuggestTopicsRequest,
    token: str = Depends(verify_token)
):
    """
    Suggest writing topics based on user's entry patterns.
    """
    try:
        # Analyze entries for topic patterns
        entries_text = "\n".join([
            f"{entry.title}: {entry.content[:150]}"
            for entry in request.entries[-15:]
        ])

        response = openai.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": """Analyze these journal entries and suggest 4-6 topics
                    the user might want to explore further. Return only a JSON array of topic strings."""
                },
                {
                    "role": "user",
                    "content": entries_text
                }
            ],
            temperature=0.7,
            max_tokens=200
        )

        # For demo, return sample topics
        return {
            "topics": [
                "Career aspirations",
                "Personal wellness",
                "Family relationships",
                "Creative pursuits"
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
