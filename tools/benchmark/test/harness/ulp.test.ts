import { describe, expect, it } from '@jest/globals';

import {
 cancellationBits,
 computeReference,
 float64ToHex,
 hexToFloat64,
 ulpDistance,
} from '../../src/harness/ulp.ts';

describe('ulpDistance', () => {
 it('ULP(1.0, 1.0 + EPSILON) = 1', () => {
  const result = ulpDistance(1.0, 1.0 + Number.EPSILON);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   expect(result.distance).toBe(1);
  }
 });

 it('ULP(x, x) = 0 for any finite value', () => {
  for (const v of [0, 1, -1, Math.PI, 1e100, 1e-100]) {
   const result = ulpDistance(v, v);
   expect(result.kind).toBe('ulp');
   if (result.kind === 'ulp') {
    expect(result.distance).toBe(0);
   }
  }
 });

 it('ULP(+0, -0) = 0', () => {
  const result = ulpDistance(+0, -0);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   expect(result.distance).toBe(0);
  }
 });

 it('NaN vs NaN = 0 ULP', () => {
  const result = ulpDistance(NaN, NaN);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   expect(result.distance).toBe(0);
  }
 });

 it('NaN vs number = special mismatch', () => {
  const result = ulpDistance(NaN, 1.0);
  expect(result.kind).toBe('special');
  if (result.kind === 'special') {
   expect(result.description).toContain('NaN');
  }
 });

 it('Infinity vs finite = special mismatch', () => {
  const result = ulpDistance(Infinity, 1.0);
  expect(result.kind).toBe('special');
  if (result.kind === 'special') {
   expect(result.description).toContain('Infinity');
  }
 });

 it('+Infinity vs +Infinity = 0 ULP', () => {
  const result = ulpDistance(Infinity, Infinity);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   expect(result.distance).toBe(0);
  }
 });

 it('small distance for close values', () => {
  // Two adjacent doubles near 1.0
  const a = 1.0;
  const b = 1.0 + 2 * Number.EPSILON;
  const result = ulpDistance(a, b);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   expect(result.distance).toBe(2);
  }
 });

 it('cross-sign: smallest positive vs smallest negative denormal = 2 ULP', () => {
  // 5e-324 is the smallest positive denormal (1 ULP from +0)
  // -5e-324 is the smallest negative denormal (1 ULP from -0)
  // Distance through zero: 1 + 1 = 2 ULP
  const result = ulpDistance(5e-324, -5e-324);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   expect(result.distance).toBe(2);
  }
 });

 it('cross-sign: 1.0 vs -1.0 produces correct large ULP distance', () => {
  const result = ulpDistance(1.0, -1.0);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   // 1.0 = 0x3FF0000000000000, -1.0 = 0xBFF0000000000000
   // Distance = 2 * (0x3FF0000000000000 - 0) = 2 * 4607182418800017408
   // which is 9214364837600034816
   expect(result.distance).toBeGreaterThan(9e18);
   expect(result.distance).toBeLessThan(1e19);
  }
 });

 it('cross-sign: small positive vs small negative', () => {
  // 1e-300 vs -1e-300 should have reasonable ULP distance
  const result = ulpDistance(1e-300, -1e-300);
  expect(result.kind).toBe('ulp');
  if (result.kind === 'ulp') {
   expect(result.distance).toBeGreaterThan(0);
  }
 });
});

describe('float64ToHex / hexToFloat64', () => {
 it('round-trips 1.0 correctly', () => {
  const hex = float64ToHex(1.0);
  expect(hex).toBe('3ff0000000000000');
  expect(hexToFloat64(hex)).toBe(1.0);
 });

 it('round-trips -1.0 correctly', () => {
  const hex = float64ToHex(-1.0);
  expect(hex).toBe('bff0000000000000');
  expect(hexToFloat64(hex)).toBe(-1.0);
 });

 it('round-trips +0 correctly', () => {
  const hex = float64ToHex(+0);
  expect(hex).toBe('0000000000000000');
  expect(hexToFloat64(hex)).toBe(0);
  expect(Object.is(hexToFloat64(hex), +0)).toBe(true);
 });

 it('round-trips -0 correctly (preserves signed zero)', () => {
  const hex = float64ToHex(-0);
  expect(hex).toBe('8000000000000000');
  const result = hexToFloat64(hex);
  expect(Object.is(result, -0)).toBe(true);
 });

 it('round-trips NaN', () => {
  const hex = float64ToHex(NaN);
  expect(Number.isNaN(hexToFloat64(hex))).toBe(true);
 });

 it('round-trips Infinity', () => {
  expect(hexToFloat64(float64ToHex(Infinity))).toBe(Infinity);
  expect(hexToFloat64(float64ToHex(-Infinity))).toBe(-Infinity);
 });

 it('round-trips arbitrary values', () => {
  const values = [Math.PI, Math.E, 1e-300, 1e300, Number.MIN_VALUE, Number.MAX_VALUE];
  for (const v of values) {
   expect(hexToFloat64(float64ToHex(v))).toBe(v);
  }
 });

 it('throws on invalid hex length', () => {
  expect(() => hexToFloat64('abc')).toThrow('16-character');
 });
});

describe('cancellationBits', () => {
 it('detects catastrophic cancellation', () => {
  // Subtracting nearly equal large numbers
  const a = 1e15;
  const b = 1e15 + 1;
  const result = b - a; // = 1, but many bits lost
  const bits = cancellationBits(a, b, result);
  expect(bits).toBeGreaterThan(40);
 });

 it('reports 0 for non-cancelling operations', () => {
  const bits = cancellationBits(100, 1, 99);
  expect(bits).toBeLessThan(5);
 });

 it('handles zero inputs', () => {
  expect(cancellationBits(0, 0, 0)).toBe(0);
 });

 it('handles infinite inputs', () => {
  expect(cancellationBits(Infinity, 1, Infinity)).toBe(0);
 });
});

describe('computeReference (decimal.js oracle)', () => {
 it('sin(0) = 0', () => {
  expect(computeReference('sin', 0)).toBe(0);
 });

 it('cos(0) = 1', () => {
  expect(computeReference('cos', 0)).toBe(1);
 });

 it('exp(0) = 1', () => {
  expect(computeReference('exp', 0)).toBe(1);
 });

 it('log(1) = 0', () => {
  expect(computeReference('log', 1)).toBe(0);
 });

 it('sin(pi/2) ≈ 1', () => {
  const result = computeReference('sin', Math.PI / 2);
  expect(result).toBeCloseTo(1, 15);
 });

 it('atan2(1, 1) ≈ pi/4', () => {
  const result = computeReference('atan2', 1, 1);
  expect(result).toBeCloseTo(Math.PI / 4, 14);
 });

 it('hypot(3, 4) = 5', () => {
  expect(computeReference('hypot', 3, 4)).toBe(5);
 });

 it('throws for unknown function', () => {
  expect(() => computeReference('nonexistent', 1)).toThrow('Unknown oracle function');
 });
});
