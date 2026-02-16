import { Community } from '../types';

/**
 * Helper to calculate community metrics to avoid cluttering the component.
 * This also centralizes the "mock" logic for activity data until a real API is available.
 */
export const calculateCommunityMetrics = (activeCommunity: Community | undefined) => {
  const memberCount = parseInt(activeCommunity?.memberCount || '0');

  // Hardcoded Logic / Mock Estimation for Prototype
  const healthScore = activeCommunity ? Math.min(98, 50 + Math.floor(memberCount * 1.5)) : 0;
  const weeklyGrowth = (memberCount > 0 ? (2 / memberCount) * 100 : 0).toFixed(1);

  // Mock Data for Area Chart derived from member count
  const activityData = [
    { name: 'Mon', active: Math.floor(memberCount * 0.2) },
    { name: 'Tue', active: Math.floor(memberCount * 0.25) },
    { name: 'Wed', active: Math.floor(memberCount * 0.15) },
    { name: 'Thu', active: Math.floor(memberCount * 0.35) },
    { name: 'Fri', active: Math.floor(memberCount * 0.5) },
    { name: 'Sat', active: Math.floor(memberCount * 0.7) },
    { name: 'Sun', active: Math.floor(memberCount * 0.6) },
  ];

  return { memberCount, healthScore, weeklyGrowth, activityData };
};
