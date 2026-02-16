import { describe, expect, it } from "bun:test";
import { calculateCommunityMetrics } from "./dashboardUtils";
import { Community } from "../types";

describe("calculateCommunityMetrics", () => {
  it("should handle undefined input", () => {
    const metrics = calculateCommunityMetrics(undefined);
    expect(metrics.memberCount).toBe(0);
    expect(metrics.healthScore).toBe(0);
    expect(metrics.weeklyGrowth).toBe("0.0");
    expect(metrics.activityData).toHaveLength(7);
    metrics.activityData.forEach(day => {
      expect(day.active).toBe(0);
    });
  });

  it("should calculate metrics for a community with members", () => {
    const mockCommunity = {
      memberCount: "10"
    } as Community;
    const metrics = calculateCommunityMetrics(mockCommunity);

    expect(metrics.memberCount).toBe(10);
    // healthScore: 50 + floor(10 * 1.5) = 50 + 15 = 65
    expect(metrics.healthScore).toBe(65);
    // weeklyGrowth: (2 / 10) * 100 = 20.0
    expect(metrics.weeklyGrowth).toBe("20.0");
    expect(metrics.activityData[0].active).toBe(2); // floor(10 * 0.2)
  });

  it("should cap healthScore at 98", () => {
    const mockCommunity = {
      memberCount: "100"
    } as Community;
    const metrics = calculateCommunityMetrics(mockCommunity);

    // healthScore: 50 + floor(100 * 1.5) = 50 + 150 = 200 -> capped at 98
    expect(metrics.healthScore).toBe(98);
  });

  it("should handle zero member count", () => {
    const mockCommunity = {
      memberCount: "0"
    } as Community;
    const metrics = calculateCommunityMetrics(mockCommunity);

    expect(metrics.memberCount).toBe(0);
    expect(metrics.healthScore).toBe(50); // activeCommunity is defined, so 50 + 0
    expect(metrics.weeklyGrowth).toBe("0.0");
  });

  it("should handle non-numeric memberCount string", () => {
    const mockCommunity = {
      memberCount: "invalid"
    } as Community;
    const metrics = calculateCommunityMetrics(mockCommunity);

    // parseInt("invalid") is NaN
    expect(metrics.memberCount).toBeNaN();
    expect(metrics.healthScore).toBeNaN();
    expect(metrics.weeklyGrowth).toBe("0.0");
  });
});
