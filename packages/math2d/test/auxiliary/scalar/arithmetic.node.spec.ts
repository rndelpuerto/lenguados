/**
 * @file test/auxiliary/scalar/arithmetic.node.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Focused tests for remap, loop, and pingPong helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 loop,
 loopUnchecked,
 pingPong,
 pingPongUnchecked,
 remap,
 remapSafe,
 loopSafe,
 pingPongSafe,
 modSafe,
 clamp,
 sign,
 saturate,
 saturateSigned,
 step,
 mod as module_,
 modUnchecked,
 floorDivide,
 floorDivideSafe,
 floorDivideUnchecked,
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

  test('throws for zero input range (inMin === inMax) when value is not at endpoint', () => {
   expect(() => remap(5, 10, 10, 0, 100)).toThrow(RangeError);
  });

  test('returns exact endpoint for value at boundary of zero range', () => {
   // When value === inMin === inMax, endpoint guard returns outMin
   expect(remap(0, 0, 0, -1, 1)).toBe(-1);
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

  test('throws for collapsed range', () => {
   expect(() => loop(42, 5, 5)).toThrow(RangeError);
   expect(() => loop(-10, 2, -3)).toThrow(RangeError);
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

  test('throws for collapsed range', () => {
   expect(() => pingPong(10, 5, 5)).toThrow(RangeError);
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

  test('throws for non-positive divisor', () => {
   expect(() => module_(5, -3)).toThrow(RangeError);
   expect(() => module_(5, 0)).toThrow(RangeError);
  });
 });

 describe('floorDivide', () => {
  test('returns floor of division', () => {
   expect(floorDivide(7, 3)).toBe(2);
   expect(floorDivide(-7, 3)).toBe(-3);
  });

  test('throws for zero divisor', () => {
   expect(() => floorDivide(7, 0)).toThrow(RangeError);
  });
 });

 describe('floorDivideSafe', () => {
  test('returns floor of division for valid divisor', () => {
   expect(floorDivideSafe(7, 3)).toBe(2);
   expect(floorDivideSafe(-7, 3)).toBe(-3);
  });

  test('returns 0 for zero divisor', () => {
   expect(floorDivideSafe(7, 0)).toBe(0);
  });
 });

 describe('floorDivideUnchecked', () => {
  test('returns floor of division without validation', () => {
   expect(floorDivideUnchecked(7, 3)).toBe(2);
   expect(floorDivideUnchecked(-7, 3)).toBe(-3);
  });
 });

 describe('remapSafe', () => {
  test('returns outMin for collapsed input range (inMin equals inMax)', () => {
   expect(remapSafe(5, 3, 3, 0, 100)).toBe(0); // outMin = 0
   expect(remapSafe(5, 0, 0, 10, 20)).toBe(10); // outMin = 10
  });

  test('works like remap for valid ranges', () => {
   expect(remapSafe(5, 0, 10, 0, 100)).toBe(50);
   expect(remapSafe(0, 0, 10, 0, 100)).toBe(0);
   expect(remapSafe(10, 0, 10, 0, 100)).toBe(100);
  });

  test('handles extrapolation', () => {
   expect(remapSafe(15, 0, 10, 0, 100)).toBe(150);
   expect(remapSafe(-5, 0, 10, 0, 100)).toBe(-50);
  });
 });

 describe('modUnchecked', () => {
  test('returns positive modulo without validation', () => {
   expect(modUnchecked(7, 3)).toBe(1);
   expect(modUnchecked(-7, 3)).toBe(2);
   expect(modUnchecked(10, 4)).toBe(2);
  });
 });

 describe('loopUnchecked', () => {
  test('wraps value into range without validation', () => {
   expect(loopUnchecked(5, 0, 4)).toBe(1);
   expect(loopUnchecked(-1, 0, 4)).toBe(3);
   expect(loopUnchecked(8, 2, 5)).toBe(2);
  });
 });

 describe('pingPongUnchecked', () => {
  test('ping-pongs value without validation', () => {
   expect(pingPongUnchecked(0, 0, 2)).toBe(0);
   expect(pingPongUnchecked(2, 0, 2)).toBe(2);
   expect(pingPongUnchecked(3, 0, 2)).toBe(1);
   expect(pingPongUnchecked(4, 0, 2)).toBe(0);
  });
 });
 describe('loopSafe', () => {
  test('delegates to loop for valid range', () => {
   expect(loopSafe(5, 0, 10)).toBe(5);
   expect(loopSafe(15, 0, 10)).toBe(5);
  });

  test('returns min for invalid range (max <= min)', () => {
   expect(loopSafe(5, 5, 5)).toBe(5);
   expect(loopSafe(5, 10, 0)).toBe(10);
  });
 });

 describe('pingPongSafe', () => {
  test('delegates to pingPong for valid range', () => {
   expect(pingPongSafe(3, 0, 2)).toBe(1);
   expect(pingPongSafe(5, 0, 2)).toBe(1);
  });

  test('returns min for invalid range', () => {
   expect(pingPongSafe(5, 5, 5)).toBe(5);
   expect(pingPongSafe(5, 10, 0)).toBe(10);
  });
 });

 describe('modSafe', () => {
  test('returns positive modulo for positive divisor', () => {
   expect(modSafe(7, 3)).toBe(1);
   expect(modSafe(-7, 3)).toBe(2);
  });

  test('returns 0 for non-positive divisor', () => {
   expect(modSafe(7, 0)).toBe(0);
   expect(modSafe(7, -3)).toBe(0);
  });
 });

 /* ===== Section 8: NaN/Infinity edge case tests ===== */

 describe('NaN behavior for scalar functions', () => {
  test('clamp(5, NaN, 10) returns 5 (NaN comparisons are false)', () => {
   expect(clamp(5, NaN, 10)).toBe(5);
  });

  test('sign(NaN) returns 0', () => {
   expect(sign(NaN)).toBe(0);
  });

  test('step(NaN, 5) returns 1 (5 is not < NaN)', () => {
   expect(step(NaN, 5)).toBe(1);
  });

  test('loop(Infinity, 0, 10) returns NaN', () => {
   expect(loop(Infinity, 0, 10)).toBeNaN();
  });

  test('sign(-0) returns 0', () => {
   expect(sign(-0)).toBe(0);
  });
 });

 describe('degenerate range tests', () => {
  test('clamp with min > max returns min (5 < 10 is true)', () => {
   expect(clamp(5, 10, 0)).toBe(10);
  });
 });
});
