
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { communityService } from '../services/communityService';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: () => ({
            select: () => ({
                eq: () => ({
                    order: () => ({
                        data: [],
                        error: null
                    })
                }),
                order: () => ({
                    limit: () => Promise.resolve({ data: [], error: null })
                })
            })
        })
    }
}));

// Mock LocalStorage
const store = new Map<string, string>();
const mockLocalStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] || null,
    get length() { return store.size; }
};

Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true
});

describe('getGlobalFeed Performance', () => {
    beforeEach(() => {
        store.clear();

        // Setup 100 communities with 10 posts each
        const NUM_COMMUNITIES = 100;
        const POSTS_PER_COMMUNITY = 10;

        for (let i = 0; i < NUM_COMMUNITIES; i++) {
            const communityId = `c-${i}`;
            const posts = [];
            for (let j = 0; j < POSTS_PER_COMMUNITY; j++) {
                posts.push({
                    id: `post-${i}-${j}`,
                    author: `User ${j}`,
                    content: `Post content ${j} in community ${i}`,
                    likes: 0,
                    comments: [],
                    created_at: new Date().toISOString(),
                    communityId: communityId
                });
            }
            localStorage.setItem(`mock_posts_${communityId}`, JSON.stringify(posts));
        }

        // Add noise
        for (let i = 0; i < 500; i++) {
            localStorage.setItem(`noise_${i}`, 'random data');
        }

        // Clear index and store to force scan on first run
        localStorage.removeItem('floc_mock_community_index');
        localStorage.removeItem('floc_mock_posts_store');
    });

    it('measures execution time of getGlobalFeed (First Run / Migration)', async () => {
        const start = performance.now();
        const feed = await communityService.getGlobalFeed();
        const end = performance.now();

        console.log(`\n\n[First Run] getGlobalFeed took ${(end - start).toFixed(2)}ms for ${feed.length} posts\n`);

        // Verify we got posts
        expect(feed.length).toBeGreaterThan(0);

        // Verify migration cleanup
        expect(localStorage.getItem('mock_posts_c-0')).toBeNull();
    });

    it('measures execution time of getGlobalFeed (Second Run / Cached)', async () => {
        // First run to populate cache
        await communityService.getGlobalFeed();

        const start = performance.now();
        const feed = await communityService.getGlobalFeed();
        const end = performance.now();

        console.log(`\n\n[Second Run] getGlobalFeed took ${(end - start).toFixed(2)}ms for ${feed.length} posts\n`);

        // Verify we got posts
        expect(feed.length).toBeGreaterThan(0);
    });
});
