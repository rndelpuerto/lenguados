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

 describe('NaN edge cases', () => {
  test('flooredMod(NaN, 3) returns NaN', () => {
   expect(flooredMod(NaN, 3)).toBeNaN();
  });
 });
});
