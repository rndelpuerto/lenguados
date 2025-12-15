/**
 * @file test/auxiliary/numeric/wrapping.node.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Tests for wrapping helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 flooredMod,
 flooredModSafe,
 flooredModUnchecked,
 mirror,
 mirrorSafe,
 mirrorUnchecked,
 repeat,
 repeatSafe,
 repeatUnchecked,
 truncatedMod,
} from '../../../src/auxiliary/numeric/wrapping';
import { loop, mod as module_ } from '../../../src/auxiliary/scalar/arithmetic';

describe('numeric/wrapping', () => {
 describe('loop (formerly wrap)', () => {
  test('wraps values into the [min, max) interval', () => {
   expect(loop(10, 0, 5)).toBe(0);
   expect(loop(-1, 0, 5)).toBe(4);
   expect(loop(12, 10, 20)).toBe(12);
  });

  test('throws for collapsed interval', () => {
   expect(() => loop(5, 2, 2)).toThrow(RangeError);
   expect(() => loop(-5, 3, 3)).toThrow(RangeError);
  });

  test('throws for inverted ranges', () => {
   expect(() => loop(5, 10, 0)).toThrow(RangeError);
  });
 });

 describe('mod (formerly euclideanMod)', () => {
  test('always returns positive remainder for positive divisors', () => {
   expect(module_(7, 3)).toBe(1);
   expect(module_(-7, 3)).toBe(2);
   // Strict version throws for non-positive divisors
   expect(() => module_(7, -3)).toThrow(RangeError);
  });
 });

 describe('flooredMod', () => {
  test('follows floor-division semantics', () => {
   expect(flooredMod(7, 3)).toBe(1);
   expect(flooredMod(-7, 3)).toBe(2);
   expect(flooredMod(7, -3)).toBe(-2);
   expect(flooredMod(-7, -3)).toBe(-1);
  });

  test('throws for zero divisor (strict)', () => {
   expect(() => flooredMod(5, 0)).toThrow(RangeError);
  });
 });

 describe('flooredModSafe', () => {
  test('returns 0 for zero divisor', () => {
   expect(flooredModSafe(5, 0)).toBe(0);
   expect(flooredModSafe(-5, 0)).toBe(0);
  });

  test('works like flooredMod for valid inputs', () => {
   expect(flooredModSafe(7, 3)).toBe(1);
   expect(flooredModSafe(-7, 3)).toBe(2);
  });
 });

 describe('flooredModUnchecked', () => {
  test('follows floor-division semantics without validation', () => {
   expect(flooredModUnchecked(7, 3)).toBe(1);
   expect(flooredModUnchecked(-7, 3)).toBe(2);
   expect(flooredModUnchecked(7, -3)).toBe(-2);
  });
 });

 describe('truncatedMod', () => {
  test('matches JavaScript % behavior', () => {
   expect(truncatedMod(7, 3)).toBe(1);
   expect(truncatedMod(-7, 3)).toBe(-1);
   expect(truncatedMod(7, -3)).toBe(1);
   expect(truncatedMod(-7, -3)).toBe(-1);
  });
 });

 describe('mirror', () => {
  test('mirrors values across the specified center', () => {
   expect(mirror(3, 0, 2)).toBe(-1);
   expect(mirror(5, 0, 2)).toBe(1);
   expect(mirror(-3, 0, 2)).toBe(1);
  });

  test('correctly reflects across multiple cycles', () => {
   expect(mirror(9, 0, 2)).toBe(1);
   expect(mirror(-9, 0, 2)).toBe(-1);
  });

  test('throws for non-positive amplitude (strict)', () => {
   expect(() => mirror(5, 0, 0)).toThrow(RangeError);
   expect(() => mirror(5, 0, -2)).toThrow(RangeError);
  });
 });

 describe('mirrorSafe', () => {
  test('returns center for non-positive amplitude', () => {
   expect(mirrorSafe(5, 3, 0)).toBe(3);
   expect(mirrorSafe(5, 3, -2)).toBe(3);
  });

  test('works like mirror for valid inputs', () => {
   expect(mirrorSafe(3, 0, 2)).toBe(-1);
   expect(mirrorSafe(5, 0, 2)).toBe(1);
  });
 });

 describe('mirrorUnchecked', () => {
  test('mirrors without validation', () => {
   expect(mirrorUnchecked(3, 0, 2)).toBe(-1);
   expect(mirrorUnchecked(5, 0, 2)).toBe(1);
  });
 });

 describe('repeat', () => {
  test('creates repeating pattern', () => {
   expect(repeat(3, 2)).toBe(1);
   expect(repeat(5, 2)).toBe(1);
  });

  test('throws for non-positive lengths (strict)', () => {
   expect(() => repeat(5, 0)).toThrow(RangeError);
   expect(() => repeat(5, -2)).toThrow(RangeError);
  });
 });

 describe('repeatSafe', () => {
  test('falls back to zero for non-positive lengths', () => {
   expect(repeatSafe(5, 0)).toBe(0);
   expect(repeatSafe(5, -2)).toBe(0);
  });

  test('works like repeat for valid inputs', () => {
   expect(repeatSafe(-1, 2)).toBe(1);
   expect(repeatSafe(3, 2)).toBe(1);
  });
 });

 describe('repeatUnchecked', () => {
  test('creates repeating pattern without validation', () => {
   expect(repeatUnchecked(3, 2)).toBe(1);
   expect(repeatUnchecked(5, 2)).toBe(1);
   expect(repeatUnchecked(-1, 2)).toBe(1);
  });
 });
});
