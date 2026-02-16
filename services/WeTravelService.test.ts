import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MOCK_TRIPS } from '../constants';

describe('WeTravelService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should return mock data when USE_MOCK is true (default)', async () => {
    // Default env is effectively undefined, so USE_MOCK is true
    const { WeTravelService } = await import('./WeTravelService');

    const promise = WeTravelService.getAllTrips();

    // Advance time to bypass artificial delay
    await vi.advanceTimersByTimeAsync(1000);

    const trips = await promise;
    expect(trips).toEqual(MOCK_TRIPS);
  });

  it('should return mock data when VITE_WETRAVEL_API_KEY is missing, even if USE_MOCK is false', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.stubEnv('VITE_WETRAVEL_API_KEY', ''); // Missing key

    const { WeTravelService } = await import('./WeTravelService');

    const promise = WeTravelService.getAllTrips();

    // Advance time to bypass artificial delay
    await vi.advanceTimersByTimeAsync(1000);

    const trips = await promise;
    expect(trips).toEqual(MOCK_TRIPS);
  });

  it('should return mock data when API call fails (catch block fallback)', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.stubEnv('VITE_WETRAVEL_API_KEY', 'test-key');

    // Mock fetch to fail
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { WeTravelService } = await import('./WeTravelService');

    const trips = await WeTravelService.getAllTrips();

    expect(trips).toEqual(MOCK_TRIPS);
    expect(global.fetch).toHaveBeenCalledWith('/api/wetravel/trips', expect.objectContaining({
        headers: expect.objectContaining({
            'Authorization': 'Bearer test-key'
        })
    }));
  });

  it('should return parsed data when API call succeeds', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.stubEnv('VITE_WETRAVEL_API_KEY', 'test-key');

    const mockApiResponse = {
      trips: [
        {
          id: 123,
          title: 'Test Trip',
          location: 'Test Location',
          start_date: '2023-01-01',
          end_date: '2023-01-05',
          price: { currency: 'USD', amount: 100 },
          image_url: 'http://test.com/image.jpg',
          status: 'published',
          spots_taken: 5
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    const { WeTravelService } = await import('./WeTravelService');

    const trips = await WeTravelService.getAllTrips();

    expect(trips).toHaveLength(1);
    expect(trips[0]).toEqual({
      id: '123',
      title: 'Test Trip',
      destination: 'Test Location',
      dates: '2023-01-01 - 2023-01-05',
      price: 'USD 100',
      image: 'http://test.com/image.jpg',
      status: 'CONFIRMED',
      membersCount: 5,
      wetravelId: '123'
    });
  });
});
