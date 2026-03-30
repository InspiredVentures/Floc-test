import { describe, it, expect, vi } from 'vitest';
import { filterCommunities } from './discovery';
import { Community } from '../types';

// Helper to create minimal community objects
const createCommunity = (overrides: Partial<Community>): Community => ({
  id: '1',
  title: 'Test Community',
  description: 'Test Description',
  category: 'Global',
  memberCount: '10',
  image: 'image.jpg',
  meta: 'meta',
  upcomingTrips: [],
  accessType: 'free',
  ...overrides,
});

describe('filterCommunities', () => {
  const communities: Community[] = [
    createCommunity({ id: '1', title: 'Global Group', category: 'Global', description: 'A global group' }),
    createCommunity({ id: '2', title: 'Planning Trip', category: 'Planning', description: 'Planning a trip to Bali' }),
    createCommunity({ id: '3', title: 'Confirmed Squad', category: 'Confirmed', description: 'Confirmed trip to Japan' }),
    createCommunity({ id: '4', title: 'My Tribe', category: 'Planning', description: 'Another planning group' }),
  ];

  const isMemberFn = vi.fn();

  it('should return all communities when filter is "all" and search is empty', () => {
    const result = filterCommunities(communities, 'all', '', isMemberFn);
    expect(result).toHaveLength(4);
    expect(result).toEqual(communities);
  });

  it('should filter by category', () => {
    const result = filterCommunities(communities, 'Planning', '', isMemberFn);
    expect(result).toHaveLength(2);
    expect(result.map(c => c.id)).toContain('2');
    expect(result.map(c => c.id)).toContain('4');
  });

  it('should filter by "my-tribes"', () => {
    // Mock isMemberFn to return true for id '4'
    isMemberFn.mockImplementation((id) => id === '4');

    const result = filterCommunities(communities, 'my-tribes', '', isMemberFn);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('should filter by search query (title)', () => {
    const result = filterCommunities(communities, 'all', 'Squad', isMemberFn);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('should filter by search query (description)', () => {
    const result = filterCommunities(communities, 'all', 'Bali', isMemberFn);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter by search query (case insensitive)', () => {
    const result = filterCommunities(communities, 'all', 'bali', isMemberFn);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should combine category filter and search query', () => {
    const result = filterCommunities(communities, 'Planning', 'Bali', isMemberFn);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should return empty array if no matches', () => {
    const result = filterCommunities(communities, 'Global', 'Mars', isMemberFn);
    expect(result).toHaveLength(0);
  });

  it('should handle empty communities list', () => {
      const result = filterCommunities([], 'all', '', isMemberFn);
      expect(result).toHaveLength(0);
  });
});
