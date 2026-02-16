
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { communityService } from '../services/communityService';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({ data: [], error: null }),
          }),
        }),
      }),
    }),
  },
  isSupabaseConfigured: false,
}));

// Mock LocalStorage
const mockStorage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => mockStorage.get(key) || null,
  setItem: (key: string, value: string) => mockStorage.set(key, value),
  removeItem: (key: string) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
  key: (index: number) => Array.from(mockStorage.keys())[index] || null,
  get length() { return mockStorage.size; },
};
global.localStorage = localStorageMock as any;

describe('Performance Benchmark: getGlobalFeed', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('measures getGlobalFeed performance with many keys', async () => {
    // Populate with 10,000 dummy keys
    for (let i = 0; i < 10000; i++) {
      localStorage.setItem(`dummy_key_${i}`, JSON.stringify({ data: 'junk'.repeat(100) }));
    }

    // Populate with 50 mock community posts
    const mockCommunities = [];
    for (let i = 0; i < 50; i++) {
      const commId = `c${i}`;
      mockCommunities.push(commId);
      const posts = Array.from({ length: 5 }, (_, j) => ({
        id: `post-${commId}-${j}`,
        content: `Post content for ${commId}-${j}`,
        community_id: commId,
        created_at: new Date().toISOString()
      }));
      localStorage.setItem(`mock_posts_${commId}`, JSON.stringify(posts));
    }

    // Also populate the index to simulate optimized state (though not used yet by code)
    localStorage.setItem('floc_mock_community_index', JSON.stringify(mockCommunities));

    const start = performance.now();
    await communityService.getGlobalFeed();
    const end = performance.now();

    const duration = end - start;
    console.log(`[Benchmark] getGlobalFeed execution time: ${duration.toFixed(2)}ms with ${localStorage.length} keys`);

    // Simple assertion to ensure it runs
    expect(duration).toBeGreaterThan(0);
  });
});
