/**
 * @file tests/auxiliary/numeric/wrapping.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Tests for wrapping helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 euclideanMod,
 flooredMod,
 mirror,
 repeat,
 truncatedMod,
 wrap,
} from '../../../src/auxiliary/numeric/wrapping';

describe('numeric/wrapping', () => {
 describe('wrap', () => {
  test('wraps values into the [min, max) interval', () => {
   expect(wrap(10, 0, 5)).toBe(0);
   expect(wrap(-1, 0, 5)).toBe(4);
   expect(wrap(12, 10, 20)).toBe(12);
  });

  test('returns the lower bound when the interval collapses', () => {
   expect(wrap(5, 2, 2)).toBe(2);
   expect(wrap(-5, 3, 3)).toBe(3);
  });

  test('handles inverted ranges by clamping to min', () => {
   expect(wrap(5, 10, 0)).toBe(10);
  });
 });

 describe('euclideanMod', () => {
  test('always returns positive remainder for positive divisors', () => {
   expect(euclideanMod(7, 3)).toBe(1);
   expect(euclideanMod(-7, 3)).toBe(2);
   // Implementation returns 0 for non-positive divisors (safeguard)
   expect(euclideanMod(7, -3)).toBe(0);
  });
 });

 describe('flooredMod', () => {
  test('follows floor-division semantics', () => {
   expect(flooredMod(7, 3)).toBe(1);
   expect(flooredMod(-7, 3)).toBe(2);
   expect(flooredMod(7, -3)).toBe(-2);
   expect(flooredMod(-7, -3)).toBe(-1);
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
   // mirror(3, 0, 2): distribution=3, cycles=1 (odd), phase=1, value>center → center - phase = -1
   expect(mirror(3, 0, 2)).toBe(-1);
   // mirror(5, 0, 2): distribution=5, cycles=2 (even), phase=1, value>center → center + phase = 1
   expect(mirror(5, 0, 2)).toBe(1);
   // mirror(-3, 0, 2): distribution=3, cycles=1 (odd), phase=1, value<center → center + phase = 1
   expect(mirror(-3, 0, 2)).toBe(1);
  });

  test('correctly reflects across multiple cycles', () => {
   // mirror(9, 0, 2): distribution=9, cycles=4 (even), phase=1, value>center → center + phase = 1
   expect(mirror(9, 0, 2)).toBe(1);
   // mirror(-9, 0, 2): distribution=9, cycles=4 (even), phase=1, value<center → center - phase = -1
   expect(mirror(-9, 0, 2)).toBe(-1);
  });
 });

 describe('repeat', () => {
  test('creates repeating pattern', () => {
   expect(repeat(3, 2)).toBe(1);
   expect(repeat(5, 2)).toBe(1);
   expect(repeat(-1, 2)).toBe(1);
  });

  test('falls back to zero for non-positive lengths', () => {
   expect(repeat(5, 0)).toBe(0);
   expect(repeat(5, -2)).toBe(0);
  });
 });
});
