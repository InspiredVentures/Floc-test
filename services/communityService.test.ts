import { describe, it, expect, vi, beforeEach } from 'vitest';
import { communityService } from './communityService';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
        storage: {
            from: vi.fn(() => ({
                upload: vi.fn(),
                getPublicUrl: vi.fn()
            }))
        },
        auth: {
            getUser: vi.fn()
        }
    }
}));

describe('CommunityService.getPosts', () => {
    // Mock localStorage
    const mockLocalStorage = (() => {
        let store: Record<string, string> = {};
        return {
            getItem: vi.fn((key: string) => store[key] || null),
            setItem: vi.fn((key: string, value: string) => {
                store[key] = value.toString();
            }),
            clear: vi.fn(() => {
                store = {};
            }),
            removeItem: vi.fn((key: string) => {
                delete store[key];
            }),
            length: 0,
            key: vi.fn(),
        };
    })();

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset localStorage mock
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });
        mockLocalStorage.clear();
    });

    it('should return mock posts from localStorage for non-UUID community ID', async () => {
        const communityId = 'test-community';
        const mockPosts = [
            {
                id: 'post-1',
                author: 'Test User',
                content: 'Hello World',
                communityId: 'test-community'
            }
        ];

        mockLocalStorage.setItem(`mock_posts_${communityId}`, JSON.stringify(mockPosts));

        const posts = await communityService.getPosts(communityId);

        expect(posts).toHaveLength(1);
        expect(posts[0].id).toBe('post-1');
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(`mock_posts_${communityId}`);
        expect(vi.mocked(supabase.from)).not.toHaveBeenCalled();
    });

    it('should return empty array if no mock posts exist for non-UUID community ID', async () => {
        const communityId = 'test-community';
        // No data in localStorage

        const posts = await communityService.getPosts(communityId);

        expect(posts).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(`mock_posts_${communityId}`);
    });

    it('should fetch posts from Supabase for valid UUID community ID', async () => {
        const communityId = '123e4567-e89b-12d3-a456-426614174000';
        const mockData = [
            {
                id: 'post-uuid-1',
                author_name: 'Supabase User',
                author_avatar: 'avatar.png',
                author_role: 'Admin',
                content: 'Supabase Content',
                image: 'image.png',
                likes: 5,
                community_id: communityId,
                created_at: new Date().toISOString(),
                post_comments: [],
                post_likes: []
            }
        ];

        // Mock chainable Supabase builder
        const mockBuilder = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            then: (resolve: any) => resolve({ data: mockData, error: null })
        };

        vi.mocked(supabase.from).mockReturnValue(mockBuilder as any);

        const posts = await communityService.getPosts(communityId);

        expect(posts).toHaveLength(1);
        expect(posts[0].id).toBe('post-uuid-1');
        expect(posts[0].author).toBe('Supabase User');

        expect(supabase.from).toHaveBeenCalledWith('posts');
        expect(mockBuilder.select).toHaveBeenCalled();
        expect(mockBuilder.eq).toHaveBeenCalledWith('community_id', communityId);
    });

    it('should handle Supabase errors gracefully by returning empty array', async () => {
        const communityId = '123e4567-e89b-12d3-a456-426614174000';

        // Mock chainable Supabase builder returning error
        const mockBuilder = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            then: (resolve: any) => resolve({ data: null, error: { message: 'Database error' } })
        };

        vi.mocked(supabase.from).mockReturnValue(mockBuilder as any);

        // Spy on console.error to suppress output during test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const posts = await communityService.getPosts(communityId);

        expect(posts).toEqual([]);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
