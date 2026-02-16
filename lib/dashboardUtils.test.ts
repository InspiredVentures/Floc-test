import { describe, it, expect } from 'vitest';
import { calculateCommunityMetrics } from './dashboardUtils';
import { Community } from '../types';

describe('calculateCommunityMetrics', () => {
  it('should return safe defaults when community is undefined', () => {
    const result = calculateCommunityMetrics(undefined);
    expect(result.memberCount).toBe(0);
    expect(result.healthScore).toBe(0);
    expect(result.weeklyGrowth).toBe('0.0');
    expect(result.activityData).toHaveLength(7);
    result.activityData.forEach(day => {
      expect(day.active).toBe(0);
    });
  });

  it('should return specific metrics for zero members', () => {
    const community = { memberCount: '0' } as Community;
    const result = calculateCommunityMetrics(community);
    expect(result.memberCount).toBe(0);
    // formula: min(98, 50 + floor(0*1.5)) = 50
    expect(result.healthScore).toBe(50);
    // formula: (2/0)*100 -> memberCount > 0 check handles this, returns 0
    expect(result.weeklyGrowth).toBe('0.0');
  });

  it('should calculate metrics correctly for standard input', () => {
    const community = { memberCount: '10' } as Community;
    const result = calculateCommunityMetrics(community);
    expect(result.memberCount).toBe(10);
    // formula: min(98, 50 + floor(10*1.5)) = 50 + 15 = 65
    expect(result.healthScore).toBe(65);
    // formula: (2/10)*100 = 20
    expect(result.weeklyGrowth).toBe('20.0');

    // Check activity data derived from member count
    // Mon: floor(10 * 0.2) = 2
    expect(result.activityData[0].active).toBe(2);
  });

  it('should cap health score at 98', () => {
    const community = { memberCount: '100' } as Community;
    const result = calculateCommunityMetrics(community);
    // formula: 50 + floor(100*1.5) = 200 -> capped at 98
    expect(result.healthScore).toBe(98);
  });

  it('should generate valid activity data structure', () => {
      const community = { memberCount: '10' } as Community;
      const result = calculateCommunityMetrics(community);
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      expect(result.activityData).toHaveLength(7);
      result.activityData.forEach((day, index) => {
          expect(day.name).toBe(days[index]);
          expect(typeof day.active).toBe('number');
      });
  });
});
