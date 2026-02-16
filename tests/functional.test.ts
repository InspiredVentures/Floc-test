
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

  it('getGlobalFeed should migrate legacy mock posts to store', async () => {
    // Setup legacy mock posts
    const posts = [{ id: 'p1', content: 'hello', communityId: 'c1', created_at: new Date().toISOString() }];
    localStorage.setItem('mock_posts_c1', JSON.stringify(posts));

    // Call getGlobalFeed (triggers migration)
    const feed = await communityService.getGlobalFeed();
    expect(feed.length).toBe(1);
    expect(feed[0].id).toBe('p1');

    // Verify store created
    const store = JSON.parse(localStorage.getItem('floc_mock_posts_store') || '{}');
    expect(store['c1']).toBeDefined();
    expect(store['c1'][0].id).toBe('p1');

    // Verify legacy key deleted
    expect(localStorage.getItem('mock_posts_c1')).toBeNull();
  });

  it('createPost should update the store', async () => {
    // Start with empty storage
    const newPost = await communityService.createPost('c3', 'Test post', 'u1', 'User', 'avatar');

    // Verify post created
    expect(newPost).not.toBeNull();

    // Verify store updated
    const store = JSON.parse(localStorage.getItem('floc_mock_posts_store') || '{}');
    expect(store['c3']).toBeDefined();
    expect(store['c3'].length).toBe(1);
    expect(store['c3'][0].id).toBe(newPost?.id);
  });

  it('createPost should migrate existing mock posts to store before adding new one', async () => {
    // Setup legacy mock posts
    const existingPosts = [{ id: 'old_p', content: 'legacy', communityId: 'old_c', created_at: new Date().toISOString() }];
    localStorage.setItem('mock_posts_old_c', JSON.stringify(existingPosts));

    // Create a NEW post in a NEW community
    await communityService.createPost('new_c', 'New post', 'u1', 'User', 'avatar');

    // Verify store contains BOTH
    const store = JSON.parse(localStorage.getItem('floc_mock_posts_store') || '{}');
    expect(store['old_c']).toBeDefined();
    expect(store['new_c']).toBeDefined();

    expect(store['old_c'][0].id).toBe('old_p');
    expect(store['new_c'][0].content).toBe('New post');

    // Verify legacy key deleted
    expect(localStorage.getItem('mock_posts_old_c')).toBeNull();
  });
});
