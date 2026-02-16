
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
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: {}, error: null }),
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

describe('Functional Verification: communityService Optimization', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('getGlobalFeed should return mock posts correctly', async () => {
    // Setup mock posts
    const posts = [{ id: 'p1', content: 'hello', communityId: 'c1', created_at: new Date().toISOString() }];
    localStorage.setItem('mock_posts_c1', JSON.stringify(posts));
    localStorage.setItem('floc_mock_community_index', JSON.stringify(['c1']));

    const feed = await communityService.getGlobalFeed();
    expect(feed.length).toBe(1);
    expect(feed[0].id).toBe('p1');
  });

  it('getGlobalFeed should fallback to scan and create index if index is missing', async () => {
    // Setup mock posts BUT NO INDEX
    const posts = [{ id: 'p2', content: 'world', communityId: 'c2', created_at: new Date().toISOString() }];
    localStorage.setItem('mock_posts_c2', JSON.stringify(posts));
    // localStorage.setItem('floc_mock_community_index', ...); // MISSING

    // This call should trigger the fallback scan
    const feed = await communityService.getGlobalFeed();
    expect(feed.length).toBe(1);
    expect(feed[0].id).toBe('p2');

    // Verify index was created
    const index = JSON.parse(localStorage.getItem('floc_mock_community_index') || '[]');
    expect(index).toContain('c2');
    expect(index.length).toBe(1);
  });

  it('createPost should update the index', async () => {
    // Start with empty storage
    const newPost = await communityService.createPost('c3', 'Test post', 'u1', 'User', 'avatar');

    // Verify post created
    expect(newPost).not.toBeNull();
    const posts = JSON.parse(localStorage.getItem('mock_posts_c3') || '[]');
    expect(posts.length).toBe(1);

    // Verify index updated
    const index = JSON.parse(localStorage.getItem('floc_mock_community_index') || '[]');
    expect(index).toContain('c3');
  });

  it('createPost should migrate existing mock posts to index if index is missing', async () => {
    // Setup legacy mock posts (no index)
    const existingPosts = [{ id: 'old_p', content: 'legacy', communityId: 'old_c', created_at: new Date().toISOString() }];
    localStorage.setItem('mock_posts_old_c', JSON.stringify(existingPosts));

    // Create a NEW post in a NEW community
    await communityService.createPost('new_c', 'New post', 'u1', 'User', 'avatar');

    // Verify index contains BOTH
    const index = JSON.parse(localStorage.getItem('floc_mock_community_index') || '[]');
    expect(index).toContain('old_c');
    expect(index).toContain('new_c');
    expect(index.length).toBe(2);

    // Verify getGlobalFeed returns BOTH
    const feed = await communityService.getGlobalFeed();
    const feedIds = feed.map(p => p.id);
    expect(feedIds).toContain('old_p');
    // new post id starts with post-...
    expect(feedIds.some(id => id.startsWith('post-'))).toBe(true);
  });
});
