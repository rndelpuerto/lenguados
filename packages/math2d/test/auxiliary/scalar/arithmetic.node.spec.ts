/**
 * @file tests/auxiliary/scalar/arithmetic.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Focused tests for remap, loop, and pingPong helpers
 */

import { describe, expect, test } from '@jest/globals';

import {
 loop,
 pingPong,
 remap,
 clamp,
 sign,
 abs,
 min,
 max,
 saturate,
 saturateSigned,
 step,
 mod as module_,
 floorDivide,
 roundAwayFromZero,
} from '../../../src/auxiliary/scalar/arithmetic';

describe('scalar/arithmetic – focused behaviors', () => {
 describe('remap', () => {
  test('maps values from one range to another', () => {
   expect(remap(5, 0, 10, 0, 100)).toBe(50);
   expect(remap(0, 0, 10, 0, 100)).toBe(0);
   expect(remap(10, 0, 10, 0, 100)).toBe(100);
  });

  test('supports extrapolation outside the input range', () => {
   expect(remap(15, 0, 10, 0, 100)).toBe(150);
   expect(remap(-5, 0, 10, 0, 100)).toBe(-50);
  });

  test('handles reversed input and output ranges', () => {
   // remap(5, 10, 0, 0, 100): normalized = (5-10)/(0-10) = 0.5, result = 0 + 0.5*100 = 50
   expect(remap(5, 10, 0, 0, 100)).toBe(50);
   // remap(5, 10, 0, 100, 0): normalized = 0.5, result = 100 + 0.5*(-100) = 50
   expect(remap(5, 10, 0, 100, 0)).toBe(50);
   // remap(8, 10, 0, 100, 0): normalized = (8-10)/(0-10) = 0.2, result = 100 + 0.2*(-100) = 80
   expect(remap(8, 10, 0, 100, 0)).toBe(80);
  });

  test('preserves endpoints exactly to avoid drift', () => {
   expect(remap(10, 10, 20, -5, 5)).toBe(-5);
   expect(remap(20, 10, 20, -5, 5)).toBe(5);
  });
 });

 describe('loop', () => {
  test('wraps values within the specified bounds', () => {
   expect(loop(5, 0, 10)).toBe(5);
   expect(loop(-1, 0, 10)).toBe(9);
   expect(loop(10, 0, 10)).toBe(0);
   expect(loop(15, 0, 10)).toBe(5);
  });

  test('handles ranges that cross zero', () => {
   expect(loop(0, -5, 5)).toBe(0);
   expect(loop(7, -5, 5)).toBe(-3);
   expect(loop(-7, -5, 5)).toBe(3);
  });

  test('returns the lower bound when range collapses', () => {
   expect(loop(42, 5, 5)).toBe(5);
   expect(loop(-10, 2, -3)).toBe(2);
  });

  test('keeps results stable for very large magnitudes', () => {
   const huge = 1e9 + 0.25;
   expect(loop(huge, -1, 1)).toBeCloseTo(0.25, 12);
   expect(loop(-huge, -1, 1)).toBeCloseTo(-0.25, 12);
  });
 });

 describe('pingPong', () => {
  test('bounces values between min and max', () => {
   expect(pingPong(1, 0, 2)).toBe(1);
   expect(pingPong(3, 0, 2)).toBe(1);
   expect(pingPong(4, 0, 2)).toBe(0);
   expect(pingPong(5, 0, 2)).toBe(1);
  });

  test('correctly handles negative values', () => {
   // phase = (-1 % 4) + 4 = 3, > range, reflected = 1, result = 2 - 1 = 1
   expect(pingPong(-1, 0, 2)).toBe(1);
   // phase = (-2 % 4) + 4 = 2, <= range, result = 0 + 2 = 2
   expect(pingPong(-2, 0, 2)).toBe(2);
   // phase = (-3 % 4) + 4 = 1, <= range, result = 0 + 1 = 1
   expect(pingPong(-3, 0, 2)).toBe(1);
   // phase = (-4 % 4) = 0, <= range, result = 0 + 0 = 0
   expect(pingPong(-4, 0, 2)).toBe(0);
  });

  test('returns lower bound when range collapses', () => {
   expect(pingPong(10, 5, 5)).toBe(5);
  });

  test('remains deterministic under many cycles', () => {
   // range = 4, doubleRange = 8
   // phase = (32 - (-1)) % 8 = 33 % 8 = 1, <= range, result = -1 + 1 = 0
   expect(pingPong(32, -1, 3)).toBe(0);
   // phase = (33.5 - (-1)) % 8 = 34.5 % 8 = 2.5, <= range, result = -1 + 2.5 = 1.5
   expect(pingPong(33.5, -1, 3)).toBeCloseTo(1.5, 12);
  });
 });

 describe('clamp', () => {
  test('clamps values to range', () => {
   expect(clamp(5, 0, 10)).toBe(5);
   expect(clamp(-5, 0, 10)).toBe(0);
   expect(clamp(15, 0, 10)).toBe(10);
  });
 });

 describe('sign', () => {
  test('returns sign of value', () => {
   expect(sign(5)).toBe(1);
   expect(sign(-5)).toBe(-1);
   expect(sign(0)).toBe(0);
  });
 });

 describe('abs', () => {
  test('returns absolute value', () => {
   expect(abs(-5)).toBe(5);
   expect(abs(5)).toBe(5);
   expect(abs(0)).toBe(0);
  });
 });

 describe('min and max', () => {
  test('return smaller/larger value', () => {
   expect(min(3, 7)).toBe(3);
   expect(max(3, 7)).toBe(7);
   expect(min(-3, 7)).toBe(-3);
   expect(max(-3, 7)).toBe(7);
  });
 });

 describe('saturate', () => {
  test('clamps to [0, 1]', () => {
   expect(saturate(0.5)).toBe(0.5);
   expect(saturate(-0.5)).toBe(0);
   expect(saturate(1.5)).toBe(1);
  });
 });

 describe('saturateSigned', () => {
  test('clamps to [-1, 1]', () => {
   expect(saturateSigned(0.5)).toBe(0.5);
   expect(saturateSigned(-0.5)).toBe(-0.5);
   expect(saturateSigned(-1.5)).toBe(-1);
   expect(saturateSigned(1.5)).toBe(1);
  });
 });

 describe('step', () => {
  test('returns 0 or 1 based on edge', () => {
   expect(step(0.5, 0.3)).toBe(0);
   expect(step(0.5, 0.5)).toBe(1);
   expect(step(0.5, 0.7)).toBe(1);
  });
 });

 // mix() was removed - it was a redundant alias for lerp()
 // See MATH2D_DEEP_AUDIT.md Section 9.1 for details

 describe('mod', () => {
  test('returns positive modulo', () => {
   expect(module_(5, 3)).toBe(2);
   expect(module_(-5, 3)).toBe(1);
  });

  test('returns 0 for non-positive divisor', () => {
   expect(module_(5, -3)).toBe(0);
   expect(module_(5, 0)).toBe(0);
  });
 });

 describe('floorDivide', () => {
  test('returns floor of division', () => {
   expect(floorDivide(7, 3)).toBe(2);
   expect(floorDivide(-7, 3)).toBe(-3);
  });
 });

 describe('roundAwayFromZero', () => {
  test('rounds away from zero at halfway', () => {
   expect(roundAwayFromZero(1.5)).toBe(2);
   expect(roundAwayFromZero(-1.5)).toBe(-2);
  });

  test('rounds normally for non-halfway values', () => {
   expect(roundAwayFromZero(1.4)).toBe(1);
   expect(roundAwayFromZero(-1.4)).toBe(-1);
   expect(roundAwayFromZero(1.6)).toBe(2);
   expect(roundAwayFromZero(-1.6)).toBe(-2);
  });
 });
});
