/**
 * @file test/core/boundary-guards.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Contracts restored by the boundary-guard fixes: Interval
 * instance setFromArray bounds validation (the fifth sibling, ratified by the
 * 2026-03-08 expert-review spec but dropped by its implementing task) and the
 * Complex division zero-detection threshold aligned with the reciprocal
 * family (squared-magnitude epsilon).
 */

import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Interval } from '../../src/core/interval';

describe('Interval.prototype.setFromArray bounds validation', () => {
 it('throws RangeError when offset leaves fewer than two elements', () => {
  expect(() => new Interval().setFromArray([1, 2, 3], 2)).toThrow(RangeError);
 });

 it('throws RangeError for a negative offset', () => {
  expect(() => new Interval().setFromArray([1, 2], -1)).toThrow(RangeError);
 });

 it('throws RangeError for an empty array', () => {
  expect(() => new Interval().setFromArray([], 0)).toThrow(RangeError);
 });

 it('sets min and max for a valid offset', () => {
  const interval = new Interval().setFromArray([9, 1, 5], 1);
  expect(interval.min).toBe(1);
  expect(interval.max).toBe(5);
 });

 it('matches the static fromArray guard behavior', () => {
  expect(() => Interval.fromArray([1, 2, 3], 2)).toThrow(RangeError);
  expect(() => new Interval().setFromArray([1, 2, 3], 2)).toThrow(RangeError);
 });
});

describe('Complex division zero-detection threshold (reciprocal-family parity)', () => {
 it('divides by small-but-valid divisors instead of throwing', () => {
  // |b| = 1e-6 is five orders of magnitude above the EPSILON threshold; the
  // previous default-epsilon-on-magSq guard rejected every |b| < 1e-5.
  const q = Complex.divide(new Complex(1, 0), new Complex(1e-6, 0));
  expect(q.real).toBeCloseTo(1e6, 0);
  expect(q.imag).toBe(0);
 });

 it('still throws for divisors at or below the epsilon magnitude', () => {
  expect(() => Complex.divide(new Complex(1, 0), new Complex(1e-11, 0))).toThrow(RangeError);
  expect(() => Complex.divide(new Complex(1, 0), new Complex(0, 0))).toThrow(RangeError);
 });

 it('divideSafe uses the same threshold with the fallback response', () => {
  const small = Complex.divideSafe(new Complex(1, 0), new Complex(1e-6, 0));
  expect(small.real).toBeCloseTo(1e6, 0);
  const zeroish = Complex.divideSafe(new Complex(1, 0), new Complex(1e-11, 0));
  expect(zeroish.real).toBe(0);
  expect(zeroish.imag).toBe(0);
 });

 it('agrees with the reciprocal family threshold on the same input', () => {
  // reciprocal(5e-6) works (|z| above EPSILON); divide by the same magnitude
  // must also work — the historical asymmetry rejected it.
  const viaReciprocal = Complex.reciprocal(new Complex(5e-6, 0));
  const viaDivide = Complex.divide(new Complex(1, 0), new Complex(5e-6, 0));
  expect(viaDivide.real).toBeCloseTo(viaReciprocal.real, 5);
 });
});
