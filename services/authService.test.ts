import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import { supabase } from '../lib/supabase';

// Mock supabase client
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn(),
    },
}));

describe('authService.getCurrentUser', () => {
    const mockSingle = vi.fn();
    const mockEq = vi.fn();
    const mockSelect = vi.fn();
    const mockInsert = vi.fn();
    const mockFrom = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockSingle.mockReset();
        mockEq.mockReset();
        mockSelect.mockReset();
        mockInsert.mockReset();
        mockFrom.mockReset();

        // Setup the chain
        // chain 1: from -> select -> eq -> single
        // chain 2: from -> insert -> select -> single

        mockEq.mockReturnValue({ single: mockSingle });

        // select returns object with eq (for chain 1) and single (for chain 2)
        mockSelect.mockReturnValue({
            eq: mockEq,
            single: mockSingle
        });

        mockInsert.mockReturnValue({ select: mockSelect });

        mockFrom.mockReturnValue({
            select: mockSelect,
            insert: mockInsert
        });

        vi.mocked(supabase.from).mockImplementation(mockFrom);
    });

    it('should return null when no user is logged in', async () => {
        vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: null }, error: null } as any);

        const result = await authService.getCurrentUser();

        expect(result).toBeNull();
        expect(supabase.auth.getUser).toHaveBeenCalled();
        expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should return user and existing profile', async () => {
        const mockUser = { id: 'user-123', email: 'test@example.com' };
        const mockProfile = { id: 'user-123', username: 'testuser' };

        vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null } as any);

        // Mock single to return profile
        mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

        const result = await authService.getCurrentUser();

        expect(result).toEqual({ user: mockUser, profile: mockProfile });
        expect(supabase.from).toHaveBeenCalledWith('profiles');
        expect(mockSelect).toHaveBeenCalledWith('*');
        expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
        expect(mockSingle).toHaveBeenCalledTimes(1);
    });

    it('should create new profile if one does not exist (PGRST116 error)', async () => {
        const mockUser = {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' }
        };
        // The profile that will be returned by insert
        const createdProfile = {
            id: 'user-123',
            username: 'test',
            full_name: 'Test User',
            avatar_url: 'http://avatar',
            updated_at: '2023-01-01'
        };

        vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null } as any);

        // First call (fetch) -> error
        mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

        // Second call (insert) -> success
        mockSingle.mockResolvedValueOnce({ data: createdProfile, error: null });

        const result = await authService.getCurrentUser();

        expect(result).toEqual({ user: mockUser, profile: createdProfile });

        // Verify insert was called with correct default values
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
            id: 'user-123',
            username: 'test', // derived from email test@example.com
            full_name: 'Test User'
        }));
    });

    it('should handle profile creation error gracefully', async () => {
        const mockUser = { id: 'user-123', email: 'test@example.com' };

        vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null } as any);

        // First call -> error
        mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

        // Second call -> error
        mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Insert failed' } });

        const result = await authService.getCurrentUser();

        // Expect profile to be null (initial fetch returned null data)
        expect(result).toEqual({ user: mockUser, profile: null });

        // Ensure insert was attempted
        expect(mockInsert).toHaveBeenCalled();
    });
});
