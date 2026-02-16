import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => {
    const mockEq = vi.fn();
    const mockSelect = vi.fn(() => ({ eq: mockEq }));
    const mockFrom = vi.fn(() => ({
        select: mockSelect,
    }));
    return {
        mockEq,
        mockSelect,
        mockFrom
    };
});

vi.mock("../lib/supabase", () => ({
    supabase: {
        from: mocks.mockFrom,
        auth: { getUser: vi.fn() },
        storage: { from: vi.fn() }
    }
}));

import { communityService } from "./communityService";

describe("getUserCommunityIds", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementation
        mocks.mockEq.mockImplementation(() => {
            return {
                eq: mocks.mockEq, // Allow chaining if needed
                then: (resolve: any) => resolve({ data: [], error: null })
            };
        });
    });

    it("should filter by status 'approved' in the database query", async () => {
        const userId = "user-123";

        await communityService.getUserCommunityIds(userId);

        // Verify .eq('status', 'approved') was called
        const calls = mocks.mockEq.mock.calls;
        const statusCall = calls.find((call: any[]) => call[0] === 'status' && call[1] === 'approved');

        expect(statusCall).toBeTruthy();
    });
});
