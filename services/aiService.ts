import { GoogleGenAI } from "@google/genai";

class AIService {
  private genAI: GoogleGenAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_API_KEY || '';
  }

  private getClient() {
    if (!this.genAI) {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    }
    return this.genAI;
  }

  async polishText(text: string): Promise<string> {
    if (!text.trim()) return text;
    try {
      const client = this.getClient();

      // Using gemini-1.5-flash as a stable default model
      const response = await client.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    { text: `Polish the following text for a social media post. Make it engaging, correct grammar, and keep it authentic: "${text}"` }
                ]
            }
        ]
      });

      // Handle the response
      if (response && response.text) {
          return response.text();
      }

      return text;
    } catch (error) {
      console.error("AI Polish error:", error);
      return text;
    }
  }
}

export const aiService = new AIService();
