import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aiService } from './aiService';

// Mock the GoogleGenAI library using vi.hoisted to avoid reference errors
const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(function() {
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
    // Clear mocks before each test
    mockGenerateContent.mockClear();
    // Since aiService is a singleton and we can't easily reset its private state,
    // we rely on the fact that getClient() checks for existing instance.
    // However, since we mock the constructor, the instance returned is our mock.
    // If the service caches the client, it will use the same mock instance across tests,
    // which is fine because we reset mockGenerateContent.
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('polishText', () => {
    it('should return the original text if input is empty or whitespace', async () => {
      const result = await aiService.polishText('   ');
      expect(result).toBe('   ');
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it('should return polished text on successful API response', async () => {
      const inputText = 'hello world';
      const polishedText = 'Hello, world!';

      mockGenerateContent.mockResolvedValue({
        text: () => polishedText
      });

      const result = await aiService.polishText(inputText);

      expect(result).toBe(polishedText);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gemini-1.5-flash',
        contents: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            parts: expect.arrayContaining([
              expect.objectContaining({
                text: expect.stringContaining(inputText)
              })
            ])
          })
        ])
      }));
    });

    it('should return original text if API call throws an error', async () => {
      const inputText = 'hello world';
      const error = new Error('API Error');

      mockGenerateContent.mockRejectedValue(error);

      // Spy on console.error to suppress the output during test and verify it
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await aiService.polishText(inputText);

      expect(result).toBe(inputText);
      expect(consoleSpy).toHaveBeenCalledWith('AI Polish error:', error);
    });

    it('should return original text if API response object is null', async () => {
       const inputText = 'hello world';

       mockGenerateContent.mockResolvedValue(null);

       const result = await aiService.polishText(inputText);
       expect(result).toBe(inputText);
    });

    it('should return original text if API response has no text method', async () => {
       const inputText = 'hello world';

       mockGenerateContent.mockResolvedValue({});

       const result = await aiService.polishText(inputText);
       expect(result).toBe(inputText);
    });
  });
});
