import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { aiService } from './aiService';
import { GoogleGenAI } from '@google/genai';

// Mock the GoogleGenAI module
vi.mock('@google/genai');

describe('AIService', () => {
  let mockGenerateContent: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockGenerateContent = vi.fn();

    // Mock the GoogleGenAI constructor implementation
    (GoogleGenAI as unknown as Mock).mockImplementation(function() {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    });

    // Reset the internal genAI instance to ensure new mock is used
    (aiService as any).genAI = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should polish text successfully', async () => {
    const originalText = 'hello world';
    const polishedText = 'Hello, world!';

    mockGenerateContent.mockResolvedValue({
      text: () => polishedText
    });

    const result = await aiService.polishText(originalText);

    expect(result).toBe(polishedText);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gemini-1.5-flash'
    }));
  });

  it('should return original text if input is empty', async () => {
      const result = await aiService.polishText('   ');
      expect(result).toBe('   ');
      expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('should handle error gracefully and return original text', async () => {
    const originalText = 'hello world';
    const error = new Error('API Error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockGenerateContent.mockRejectedValue(error);

    const result = await aiService.polishText(originalText);

    expect(result).toBe(originalText);
    expect(consoleSpy).toHaveBeenCalledWith('AI Polish error:', error);
  });
});
