import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MOCK_TRIPS } from '../constants';

describe('WeTravelService', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('should return mock trips by default (USE_MOCK=true)', async () => {
        // Ensure default environment (VITE_USE_MOCK is undefined, so USE_MOCK defaults to true)
        const { WeTravelService } = await import('./WeTravelService');

        const trips = await WeTravelService.getAllTrips();
        expect(trips).toEqual(MOCK_TRIPS);
    });

    it('should return mock trips if API key is missing even if USE_MOCK=false', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'false');
        vi.stubEnv('VITE_WETRAVEL_API_KEY', ''); // Empty or undefined

        const { WeTravelService } = await import('./WeTravelService');

        const trips = await WeTravelService.getAllTrips();
        expect(trips).toEqual(MOCK_TRIPS);
    });

    it('should fall back to mock trips if API call fails', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'false');
        vi.stubEnv('VITE_WETRAVEL_API_KEY', 'dummy-key');

        // Mock fetch to fail
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const { WeTravelService } = await import('./WeTravelService');

        // Suppress console.error/warn for this test as we expect errors
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const trips = await WeTravelService.getAllTrips();

        expect(trips).toEqual(MOCK_TRIPS);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalledWith('[WeTravel] Falling back to mock data');
    });

    it('should return API data if API call succeeds', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'false');
        vi.stubEnv('VITE_WETRAVEL_API_KEY', 'dummy-key');

        const mockApiResponse = {
            trips: [
                {
                    id: 123,
                    title: 'Test Trip',
                    location: 'Test Destination',
                    start_date: '2023-01-01',
                    end_date: '2023-01-10',
                    price: { currency: 'USD', amount: 1000 },
                    image_url: 'http://example.com/image.jpg',
                    status: 'published',
                    spots_taken: 5
                }
            ]
        };

        // Mock fetch to succeed
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
            destination: 'Test Destination',
            dates: '2023-01-01 - 2023-01-10',
            price: 'USD 1000',
            image: 'http://example.com/image.jpg',
            status: 'CONFIRMED',
            membersCount: 5,
            wetravelId: '123'
        });
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});
