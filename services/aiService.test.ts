import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from './aiService';

// Mock the GoogleGenAI class
const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn(function() {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    })
  };
});

describe('AIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('polishText', () => {
    it('should return original text if input is empty or whitespace', async () => {
      expect(await aiService.polishText('')).toBe('');
      expect(await aiService.polishText('   ')).toBe('   ');
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it('should return polished text on success', async () => {
      const originalText = 'hello world';
      const polishedText = 'Hello, World!';

      mockGenerateContent.mockResolvedValue({
        text: () => polishedText
      });

      const result = await aiService.polishText(originalText);

      expect(result).toBe(polishedText);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      // Check if called with correct model and prompt structure
      // We check specifically for the structure used in aiService.ts
      expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gemini-1.5-flash',
        contents: expect.arrayContaining([
            expect.objectContaining({
                role: 'user',
                parts: expect.arrayContaining([
                    expect.objectContaining({
                        text: expect.stringContaining(originalText)
                    })
                ])
            })
        ])
      }));
    });

    it('should return original text on error', async () => {
      const originalText = 'hello world';

      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await aiService.polishText(originalText);

      expect(result).toBe(originalText);
      expect(consoleSpy).toHaveBeenCalledWith("AI Polish error:", expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should return original text if response is invalid', async () => {
        const originalText = 'hello world';

        // Mock response without text method
        mockGenerateContent.mockResolvedValue({});

        const result = await aiService.polishText(originalText);

        expect(result).toBe(originalText);
    });
  });
});
