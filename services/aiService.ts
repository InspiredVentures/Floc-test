class AIService {
  async polishText(text: string): Promise<string> {
    if (!text.trim()) return text;
    try {
      const response = await fetch('/api/polish-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.polishedText || text;
    } catch (error) {
      console.error("AI Polish error:", error);
      return text;
    }
  }
}

export const aiService = new AIService();
