
import { describe, it, expect, mock, beforeEach } from "bun:test";

// Mock supabase
const mockEq = mock();
const mockSelect = mock(() => ({ eq: mockEq }));
const mockFrom = mock(() => ({
    select: mockSelect,
}));

mock.module("../lib/supabase", () => ({
    supabase: {
        from: mockFrom,
        auth: { getUser: mock() },
        storage: { from: mock() }
    }
}));

import { communityService } from "./communityService";

describe("getUserCommunityIds", () => {
    beforeEach(() => {
        mockSelect.mockClear();
        mockEq.mockClear();

        // Mock chainable eq
        mockEq.mockImplementation(() => {
            return {
                eq: mockEq,
                then: (resolve: any) => resolve({ data: [], error: null })
            };
        });
    });

    it("should filter by status 'approved' in the database query", async () => {
        const userId = "user-123";

        await communityService.getUserCommunityIds(userId);

        // Verify .eq('status', 'approved') was called
        const calls = mockEq.mock.calls;
        const statusCall = calls.find(call => call[0] === 'status' && call[1] === 'approved');

        expect(statusCall).toBeTruthy();
    });
});
