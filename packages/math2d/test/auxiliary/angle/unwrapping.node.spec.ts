/**
 * @file test/auxiliary/angle/unwrapping.node.spec.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Tests for angle unwrapping functions and AngleUnwrapper class.
 */

import { describe, expect, test } from '@jest/globals';

import {
 unwrapAngles,
 unwrapAnglesInPlace,
 AngleUnwrapper,
} from '../../../src/auxiliary/angle/unwrapping';

describe('unwrapAngles', () => {
 test('returns empty array for empty input', () => {
  expect(unwrapAngles([])).toEqual([]);
 });

 test('returns single element unchanged', () => {
  expect(unwrapAngles([1.5])).toEqual([1.5]);
 });

 test('unwraps forward-wrapping sequence', () => {
  // 0 → 3 → -3 (really ~3.28) → 0 (really ~6.28)
  const result = unwrapAngles([0, 3, -3, 0]);
  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeCloseTo(3);
  expect(result[2]).toBeCloseTo(3.2831853, 4);
  expect(result[3]).toBeCloseTo(2 * Math.PI, 4);
 });

 test('unwraps with reference', () => {
  const result = unwrapAngles([0, Math.PI], -Math.PI);
  // First element: normalizeRadians(0 - (-PI)) + (-PI) = normalizeRadians(PI) + (-PI)
  // normalizeRadians(PI) = PI ((-PI, PI] convention), so first = PI + (-PI) = 0
  expect(result[0]).toBeCloseTo(0, 4);
 });

 test('keeps already continuous sequence unchanged', () => {
  const result = unwrapAngles([0, 0.1, 0.2, 0.3]);
  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeCloseTo(0.1);
  expect(result[2]).toBeCloseTo(0.2);
  expect(result[3]).toBeCloseTo(0.3);
 });

 test('does not mutate input', () => {
  const input = [0, 3, -3];
  const copy = [...input];
  unwrapAngles(input);
  expect(input).toEqual(copy);
 });

 test('produces continuous output (no jumps > PI)', () => {
  const angles = [0, 2.5, 5, -1, 2];
  const result = unwrapAngles(angles);
  for (let index = 1; index < result.length; index++) {
   const delta = Math.abs(result[index]! - result[index - 1]!);
   expect(delta).toBeLessThanOrEqual(Math.PI + 1e-10);
  }
 });
});

describe('unwrapAnglesInPlace', () => {
 test('returns empty array for empty input', () => {
  const array: number[] = [];
  const result = unwrapAnglesInPlace(array);
  expect(result).toBe(array);
  expect(result).toEqual([]);
 });

 test('modifies array in place', () => {
  const angles = [0, 3, -3, 0];
  const result = unwrapAnglesInPlace(angles);
  expect(result).toBe(angles);
  expect(angles[0]).toBeCloseTo(0);
  expect(angles[1]).toBeCloseTo(3);
  expect(angles[2]).toBeCloseTo(3.2831853, 4);
  expect(angles[3]).toBeCloseTo(2 * Math.PI, 4);
 });

 test('produces same output as unwrapAngles', () => {
  const input = [0, 2.5, -2.5, 1, -1];
  const copy = [...input];
  const newArray = unwrapAngles(copy);
  unwrapAnglesInPlace(input);
  for (let index = 0; index < input.length; index++) {
   expect(input[index]).toBeCloseTo(newArray[index]!, 10);
  }
 });
});

describe('AngleUnwrapper', () => {
 test('initializes on first next() call', () => {
  const uw = new AngleUnwrapper();
  expect(uw.value).toBe(0);
  expect(uw.next(1.5)).toBe(1.5);
  expect(uw.value).toBe(1.5);
 });

 test('can be constructed with initial angle', () => {
  const uw = new AngleUnwrapper(Math.PI);
  expect(uw.value).toBe(Math.PI);
 });

 test('unwraps streaming sequence', () => {
  const uw = new AngleUnwrapper();
  expect(uw.next(0)).toBeCloseTo(0);
  expect(uw.next(2)).toBeCloseTo(2);
  // -2 is close to 2 via the short arc (delta ≈ -4 wraps to ≈ +2.28)
  const third = uw.next(-2);
  // Consecutive steps never jump more than PI
  expect(Math.abs(third - 2)).toBeLessThanOrEqual(Math.PI + 1e-10);
  expect(uw.value).toBe(third);
 });

 test('consecutive steps are always <= PI apart', () => {
  const uw = new AngleUnwrapper();
  const inputs = [0, 2.5, 5, -1, 2, -2];
  let previous = uw.next(inputs[0]!);
  for (let index = 1; index < inputs.length; index++) {
   const current = uw.next(inputs[index]!);
   expect(Math.abs(current - previous)).toBeLessThanOrEqual(Math.PI + 1e-10);
   previous = current;
  }
 });

 test('reset without argument clears state', () => {
  const uw = new AngleUnwrapper(5);
  uw.next(6);
  uw.reset();
  expect(uw.value).toBe(0);
  // After reset, next call re-initializes
  expect(uw.next(1)).toBe(1);
 });

 test('reset with argument sets new starting angle', () => {
  const uw = new AngleUnwrapper();
  uw.next(0);
  uw.next(3);
  uw.reset(Math.PI);
  expect(uw.value).toBe(Math.PI);
  // With (-PI, PI] convention, angleDifference(PI, 0) = PI (CCW),
  // so unwrapping continues: PI + PI = 2*PI
  expect(uw.next(0)).toBeCloseTo(2 * Math.PI, 4);
 });

 describe('NaN/Infinity handling', () => {
  test('unwrapAngles with NaN produces NaN', () => {
   const result = unwrapAngles([0, NaN, 1]);
   expect(result[1]).toBeNaN();
  });

  test('unwrapAnglesInPlace with NaN produces NaN', () => {
   const angles = [0, NaN, 1];
   unwrapAnglesInPlace(angles);
   expect(angles[1]).toBeNaN();
  });

  test('AngleUnwrapper with NaN produces NaN', () => {
   const uw = new AngleUnwrapper();
   uw.next(0);
   expect(uw.next(NaN)).toBeNaN();
  });
 });
});
