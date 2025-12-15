/**
 * @file test/auxiliary/angle/normalization.node.spec.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Tests for angle normalization functions.
 */

import { describe, expect, test } from '@jest/globals';

import {
 normalizeRadians,
 normalizeRadiansPositive,
 normalizeRadiansAround,
 normalizeDegrees,
 normalizeDegreesPositive,
 wrapAngle,
} from '../../../src/auxiliary/angle/normalization';

const TAU = Math.PI * 2;

describe('angle/normalization', () => {
 describe('normalizeRadians', () => {
  test('normalizes to [-π, π)', () => {
   expect(normalizeRadians(0)).toBeCloseTo(0);
   // Math.PI wraps to -Math.PI since range is [-π, π)
   expect(normalizeRadians(Math.PI)).toBeCloseTo(-Math.PI);
   expect(normalizeRadians(Math.PI + 0.1)).toBeCloseTo(-Math.PI + 0.1);
   expect(normalizeRadians(-Math.PI)).toBeCloseTo(-Math.PI);
  });

  test('handles large angles', () => {
   // 5π = 2*TAU + π, which wraps to -π
   expect(normalizeRadians(5 * Math.PI)).toBeCloseTo(-Math.PI);
   expect(normalizeRadians(-5 * Math.PI)).toBeCloseTo(-Math.PI);
  });
 });

 describe('normalizeRadiansPositive', () => {
  test('normalizes to [0, 2π)', () => {
   expect(normalizeRadiansPositive(0)).toBeCloseTo(0);
   expect(normalizeRadiansPositive(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2);
   expect(normalizeRadiansPositive(TAU)).toBeCloseTo(0);
  });

  test('handles large angles', () => {
   expect(normalizeRadiansPositive(5 * TAU + Math.PI)).toBeCloseTo(Math.PI);
  });
 });

 describe('normalizeRadiansAround', () => {
  test('normalizes around a center', () => {
   expect(normalizeRadiansAround(0, 0)).toBeCloseTo(0);
   expect(normalizeRadiansAround(TAU, 0)).toBeCloseTo(0);
   expect(normalizeRadiansAround(Math.PI, Math.PI)).toBeCloseTo(Math.PI);
  });
 });

 describe('normalizeDegrees', () => {
  test('normalizes to [-180, 180)', () => {
   expect(normalizeDegrees(0)).toBeCloseTo(0);
   // 180 wraps to -180 since range is [-180, 180)
   expect(normalizeDegrees(180)).toBeCloseTo(-180);
   expect(normalizeDegrees(181)).toBeCloseTo(-179);
   expect(normalizeDegrees(-180)).toBeCloseTo(-180);
  });

  test('handles large angles', () => {
   // 900 = 2*360 + 180, which wraps to -180
   expect(normalizeDegrees(900)).toBeCloseTo(-180);
   expect(normalizeDegrees(-900)).toBeCloseTo(-180);
  });
 });

 describe('normalizeDegreesPositive', () => {
  test('normalizes to [0, 360)', () => {
   expect(normalizeDegreesPositive(0)).toBeCloseTo(0);
   expect(normalizeDegreesPositive(-90)).toBeCloseTo(270);
   expect(normalizeDegreesPositive(360)).toBeCloseTo(0);
  });
 });

 describe('wrapAngle', () => {
  test('wraps to [0, period)', () => {
   expect(wrapAngle(0)).toBeCloseTo(0);
   expect(wrapAngle(TAU)).toBeCloseTo(0);
   expect(wrapAngle(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2);
  });

  test('custom period', () => {
   expect(wrapAngle(5, 3)).toBeCloseTo(2);
   expect(wrapAngle(-1, 3)).toBeCloseTo(2);
  });

  test('returns 0 for invalid period', () => {
   expect(wrapAngle(5, 0)).toBe(0);
   expect(wrapAngle(5, -1)).toBe(0);
  });
 });
});
