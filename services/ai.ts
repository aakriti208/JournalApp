const AI_BACKEND_URL = process.env.EXPO_PUBLIC_AI_BACKEND_URL || "http://localhost:8000";

export const aiService = {
  async generatePrompt(entryContent: string): Promise<string> {
    try {
      const response = await fetch(`${AI_BACKEND_URL}/api/generate-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: entryContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI prompt");
      }

      const data = await response.json();
      return data.prompt;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async analyzeEntry(entryContent: string): Promise<any> {
    try {
      const response = await fetch(`${AI_BACKEND_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: entryContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze entry");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("AI Analysis Error:", error);
      throw error;
    }
  },
};
