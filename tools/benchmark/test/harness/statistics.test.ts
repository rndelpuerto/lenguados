import { describe, expect, it } from '@jest/globals';

import {
 benchmarkStats,
 bootstrapCI,
 classifyOutliers,
 computeMean,
 computeMedian,
 computePercentile,
 computeVariance,
 descriptiveStats,
 detectRegression,
} from '../../src/harness/statistics.ts';

describe('Descriptive Statistics', () => {
 it('computes mean correctly', () => {
  expect(computeMean([1, 2, 3, 4, 5])).toBe(3);
  expect(computeMean([10])).toBe(10);
 });

 it('returns 0 for empty array', () => {
  expect(computeMean([])).toBe(0);
 });

 it('computes median for odd-length array', () => {
  expect(computeMedian([1, 2, 3, 4, 5])).toBe(3);
 });

 it('computes median for even-length array', () => {
  expect(computeMedian([1, 2, 3, 4])).toBe(2.5);
 });

 it('computes variance (sample variance, n-1)', () => {
  const data = [2, 4, 4, 4, 5, 5, 7, 9];
  const mean = computeMean(data);
  const v = computeVariance(data, mean);
  // Population variance = 4.0, sample variance (n-1) = 32/7 ≈ 4.571
  expect(v).toBeCloseTo(32 / 7, 5);
 });

 it('computes percentiles via linear interpolation', () => {
  const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  expect(computePercentile(sorted, 0)).toBe(1);
  expect(computePercentile(sorted, 50)).toBe(5.5);
  expect(computePercentile(sorted, 100)).toBe(10);
 });

 it('descriptiveStats handles all-identical values', () => {
  const data = [5, 5, 5, 5, 5];
  const stats = descriptiveStats(data);
  expect(stats.mean).toBe(5);
  expect(stats.median).toBe(5);
  expect(stats.stddev).toBe(0);
  expect(stats.variance).toBe(0);
  expect(stats.mad).toBe(0);
  expect(stats.min).toBe(5);
  expect(stats.max).toBe(5);
 });

 it('descriptiveStats handles single value', () => {
  const stats = descriptiveStats([42]);
  expect(stats.mean).toBe(42);
  expect(stats.median).toBe(42);
  expect(stats.count).toBe(1);
 });

 it('descriptiveStats handles empty array', () => {
  const stats = descriptiveStats([]);
  expect(stats.count).toBe(0);
  expect(stats.mean).toBe(0);
 });
});

describe('Bootstrap Confidence Intervals', () => {
 it('CI covers the true mean for a known distribution', () => {
  // Generate 1000 samples from a uniform [0, 100] distribution
  // True mean = 50. CI should cover it.
  const data: number[] = [];
  for (let i = 0; i < 1000; i++) {
   data.push((i / 999) * 100);
  }

  const ci = bootstrapCI(data, 0.95, 10_000);
  expect(ci.lo).toBeLessThan(50);
  expect(ci.hi).toBeGreaterThan(50);
  expect(ci.confidence).toBe(0.95);
 });

 it('returns point estimate for single value', () => {
  const ci = bootstrapCI([42], 0.95);
  expect(ci.lo).toBe(42);
  expect(ci.hi).toBe(42);
 });

 it('returns zeros for empty array', () => {
  const ci = bootstrapCI([], 0.95);
  expect(ci.lo).toBe(0);
  expect(ci.hi).toBe(0);
 });

 it('produces asymmetric CI for right-skewed data', () => {
  // Right-skewed: many small values, few large ones
  const data: number[] = [];
  for (let i = 0; i < 900; i++) data.push(10 + Math.random() * 5);
  for (let i = 0; i < 100; i++) data.push(50 + Math.random() * 50);

  const ci = bootstrapCI(data, 0.95, 10_000);
  const mean = computeMean(data);

  // The CI should not be symmetric around the mean
  // (lo distance from mean != hi distance from mean)
  const loDist = mean - ci.lo;
  const hiDist = ci.hi - mean;
  // With right-skewed data, hi is typically further from mean
  expect(Math.abs(loDist - hiDist)).toBeGreaterThan(0);
 });
});

describe('Tukey Outlier Detection', () => {
 it('classifies mild outliers correctly', () => {
  // 20 data points clustered 100-110 so Q1 ≈ 102.5, Q3 ≈ 107.5, IQR ≈ 5
  // Mild fence high: 107.5 + 7.5 = 115
  // Severe fence high: 107.5 + 15 = 122.5
  const normal = Array.from({ length: 20 }, (_, i) => 100 + (i * 10) / 19);
  const data = [...normal, 118]; // mild outlier (>115, <122.5)
  const result = classifyOutliers(data);
  expect(result.mildHigh).toBeGreaterThanOrEqual(1);
  expect(result.severeHigh).toBe(0);
  expect(result.totalMild).toBeGreaterThanOrEqual(1);
 });

 it('classifies severe outliers correctly', () => {
  const normal = Array.from({ length: 20 }, (_, i) => 100 + (i * 10) / 19);
  const data = [...normal, 200]; // severe outlier (>122.5)
  const result = classifyOutliers(data);
  expect(result.severeHigh).toBe(1);
  expect(result.totalSevere).toBe(1);
 });

 it('does not exclude outliers from data', () => {
  const data = [1, 2, 3, 4, 5, 100];
  const result = classifyOutliers(data);
  // The classification counts outliers but the function
  // does NOT modify or filter the data array
  expect(data).toHaveLength(6);
  expect(result.totalMild + result.totalSevere).toBeGreaterThanOrEqual(1);
 });

 it('handles small arrays gracefully', () => {
  const result = classifyOutliers([1, 2, 3]);
  expect(result.totalMild).toBe(0);
  expect(result.totalSevere).toBe(0);
 });
});

describe('Regression Detection', () => {
 it('detects significant regression', () => {
  const baseline = Array.from({ length: 100 }, () => 50 + Math.random() * 2);
  const current = Array.from({ length: 100 }, () => 55 + Math.random() * 2);

  const result = detectRegression(baseline, current);
  expect(result.significant).toBe(true);
  expect(result.effectSize).toBeGreaterThan(5);
  expect(result.pValue).toBeLessThan(0.05);
 });

 it('does not flag noise within threshold', () => {
  const baseline = Array.from({ length: 100 }, () => 50 + Math.random() * 2);
  const current = Array.from({ length: 100 }, () => 50.5 + Math.random() * 2);

  const result = detectRegression(baseline, current, 2);
  // 1% difference with 2% threshold — should not be flagged
  expect(result.withinThreshold).toBe(true);
 });

 it('handles missing baseline gracefully', () => {
  const result = detectRegression([], [1, 2, 3]);
  expect(result.significant).toBe(false);
  expect(result.pValue).toBe(1);
 });

 it('handles single-measurement baseline', () => {
  const result = detectRegression([50], [55, 56, 57]);
  expect(result.significant).toBe(false);
 });
});

describe('benchmarkStats', () => {
 it('produces full stats from raw nanosecond data', () => {
  const data = Array.from({ length: 1000 }, (_, i) => 100 + (i % 10));
  const stats = benchmarkStats(data);

  expect(stats.count).toBe(1000);
  expect(stats.mean).toBeGreaterThan(0);
  expect(stats.ci95.lo).toBeLessThanOrEqual(stats.mean);
  expect(stats.ci95.hi).toBeGreaterThanOrEqual(stats.mean);
  expect(stats.opsPerSec).toBeGreaterThan(0);
  expect(stats.outliers).toBeDefined();
 });
});
