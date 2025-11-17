from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Journal App AI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    content: str


class AnalysisRequest(BaseModel):
    content: str


@app.get("/")
async def root():
    return {"message": "Journal App AI Backend is running"}


@app.post("/api/generate-prompt")
async def generate_prompt(request: PromptRequest):
    """
    Generate AI prompts based on journal entry content
    """
    try:
        # TODO: Implement AI prompt generation logic
        # This is where you'd integrate your fine-tuned model

        prompt = f"Reflect on: {request.content[:100]}..."

        return {
            "prompt": prompt,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze")
async def analyze_entry(request: AnalysisRequest):
    """
    Analyze journal entry for mood, themes, and insights
    """
    try:
        # TODO: Implement AI analysis logic
        # This is where you'd integrate sentiment analysis, mood detection, etc.

        analysis = {
            "mood": "neutral",
            "themes": [],
            "word_count": len(request.content.split()),
            "sentiment_score": 0.5
        }

        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
