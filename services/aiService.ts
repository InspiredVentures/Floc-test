import { GoogleGenAI } from "@google/genai";

export class AIService {
  private genAI: GoogleGenAI | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenAI({ apiKey });
      } catch (error) {
        console.warn("AI Service: Failed to initialize GoogleGenAI", error);
      }
    } else {
      console.warn("AI Service: Missing API Key");
    }
  }

  async generateCommunityImage(title: string, category: string): Promise<string> {
    // If no API key or client initialization failed, fallback to basic image
    if (!this.genAI) {
      return this.generateFallbackUrl(title, category);
    }

    try {
      // 1. Generate a rich image prompt using Gemini
      const prompt = `Create a detailed, descriptive prompt for an AI image generator to create a cover image for a travel community.
      Community Title: "${title}"
      Category: "${category}"

      The image should be cinematic, high-quality, photorealistic, and inspiring.
      Avoid text in the image.

      Output ONLY the prompt text, no explanations.`;

      // Use the new SDK API: client.models.generateContent
      const response = await (this.genAI as any).models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      let enhancedPrompt = '';
      if (typeof response.text === 'function') {
        enhancedPrompt = response.text();
      } else if (response.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        enhancedPrompt = response.response.candidates[0].content.parts[0].text;
      }

      if (!enhancedPrompt) {
        // If Gemini fails to give text, use basic prompt
        enhancedPrompt = `Cinematic travel photo of ${category} for ${title}, photorealistic, high quality, 4k`;
      }

      // Clean up prompt
      enhancedPrompt = enhancedPrompt.trim();

      // 2. Use Pollinations.ai to generate the image
      // Encode the prompt
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`;

    } catch (error) {
      console.error("AI Service Error:", error);
      // Fallback
      return this.generateFallbackUrl(title, category);
    }
  }

  private generateFallbackUrl(title: string, category: string): string {
    // Fallback to LoremFlickr which is more reliable than source.unsplash.com
    const keywords = `${category.split(' ')[0]},travel`;
    // Add a random seed to avoid caching same image for same category immediately
    const seed = Math.floor(Math.random() * 1000);
    return `https://loremflickr.com/800/600/${keywords}?lock=${seed}`;
  }
}

// Singleton instance
const getApiKey = () => {
  // Check both Vite env and process env (for compatibility)
  // process.env.API_KEY is defined in vite.config.ts
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  try {
    return import.meta.env.VITE_API_KEY || '';
  } catch (e) {
    return '';
  }
};

export const aiService = new AIService(getApiKey());
