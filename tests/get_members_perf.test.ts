import { describe, it, expect, vi, beforeEach } from 'vitest';
import { communityService } from '../services/communityService';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('communityService.getMembers Performance', () => {
  const mockCommunityId = '12345678-1234-1234-1234-123456789012';

  // Data simulating the JOIN result
  const mockMembersWithProfiles = [
    {
      user_id: 'u1',
      role: 'Member',
      joined_at: '2023-01-01',
      status: 'approved',
      user: { full_name: 'User One', avatar_url: 'avatar1.png', location: 'Loc1' }
    },
    {
      user_id: 'u2',
      role: 'Admin',
      joined_at: '2023-01-02',
      status: 'approved',
      user: { full_name: 'User Two', avatar_url: 'avatar2.png', location: 'Loc2' }
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make 1 query with join in the optimized version', async () => {
    // Setup mock chain for optimized query
    const queryMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: mockMembersWithProfiles, error: null }),
    };

    // Mock supabase.from
    (supabase.from as any).mockReturnValue(queryMock);

    const members = await communityService.getMembers(mockCommunityId);

    // Verify calls
    expect(supabase.from).toHaveBeenCalledWith('community_members');
    // It should NOT call profiles separately
    expect(supabase.from).not.toHaveBeenCalledWith('profiles');
    expect(supabase.from).toHaveBeenCalledTimes(1);

    // Verify data mapping
    expect(members).toHaveLength(2);
    expect(members[0].name).toBe('User One');
    expect(members[0].avatar).toBe('avatar1.png');
    expect(members[1].name).toBe('User Two');

    // Verify select arguments
    expect(queryMock.select).toHaveBeenCalledWith(expect.stringContaining('user:profiles!user_id'));
  });
});
