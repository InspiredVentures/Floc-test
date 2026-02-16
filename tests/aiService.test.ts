import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from '../services/aiService';

describe('AIService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it('polishText calls the API correctly', async () => {
    const mockResponse = { polishedText: 'Polished text' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await aiService.polishText('Raw text');

    expect(global.fetch).toHaveBeenCalledWith('/api/polish-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'Raw text' }),
    });
    expect(result).toBe('Polished text');
  });

  it('polishText returns original text on error', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await aiService.polishText('Raw text');

    expect(result).toBe('Raw text');
    consoleSpy.mockRestore();
  });

  it('polishText returns original text on non-ok response', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    // Suppress console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await aiService.polishText('Raw text');

    expect(result).toBe('Raw text');
    consoleSpy.mockRestore();
  });
});
