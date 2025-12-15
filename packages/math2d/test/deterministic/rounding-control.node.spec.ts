/**
 * @file test/deterministic/rounding-control.node.spec.ts
 * @module @lenguados/math2d/deterministic
 * @description Tests for RoundingControl behaviors.
 */

import { describe, expect, it } from '@jest/globals';

import { RoundingControl, RoundingMode } from '../../src/deterministic/rounding-control';

const DIGITS = 6;

describe('RoundingControl', () => {
 it('round applies different modes deterministically', () => {
  expect(RoundingControl.round(2.5, RoundingMode.NEAREST_EVEN)).toBe(2);
  expect(RoundingControl.round(3.5, RoundingMode.NEAREST_EVEN)).toBe(4);
  expect(RoundingControl.round(2.5, RoundingMode.NEAREST_AWAY)).toBe(3);
  expect(RoundingControl.round(-2.5, RoundingMode.NEAREST_AWAY)).toBe(-3);
  expect(RoundingControl.round(1.2, RoundingMode.CEIL)).toBe(2);
  expect(RoundingControl.round(1.2, RoundingMode.FLOOR)).toBe(1);
  expect(RoundingControl.round(-1.2, RoundingMode.TRUNCATE)).toBe(-1);
 });

 it('roundToPlaces handles positive and negative places', () => {
  expect(RoundingControl.roundToPlaces(12.3456, 2)).toBeCloseTo(12.35, DIGITS);
  expect(RoundingControl.roundToPlaces(12.3456, -1)).toBeCloseTo(10, DIGITS);
 });

 it('roundToMultiple rejects negative multiples', () => {
  expect(() => RoundingControl.roundToMultiple(5, -2)).toThrow(RangeError);
  expect(RoundingControl.roundToMultiple(5.1, 0)).toBeCloseTo(5.1, DIGITS);
  expect(RoundingControl.roundToMultiple(5.1, 0.5)).toBeCloseTo(5, DIGITS);
 });

 it('quantizeToFixed clamps to specified fractional bits', () => {
  expect(RoundingControl.quantizeToFixed(Math.PI, 4)).toBeCloseTo(3.125, DIGITS);
  expect(() => RoundingControl.quantizeToFixed(1, 100)).toThrow(RangeError);
 });

 it('stochasticRound respects provided random value', () => {
  expect(RoundingControl.stochasticRound(2.3, 0.1)).toBe(3);
  expect(RoundingControl.stochasticRound(2.3, 0.9)).toBe(2);
  // Values outside [0,1) are clamped deterministically
  expect(RoundingControl.stochasticRound(2.3, -0.5)).toBe(2);
  expect(RoundingControl.stochasticRound(2.3, 1)).toBe(3);
 });

 it('rangeReduce wraps into [0, period)', () => {
  expect(RoundingControl.rangeReduce(13, 5)).toBeCloseTo(3, DIGITS);
  expect(RoundingControl.rangeReduce(-2, 5)).toBeCloseTo(3, DIGITS);
  expect(() => RoundingControl.rangeReduce(1, 0)).toThrow(RangeError);
 });

 it('floor rounds down', () => {
  expect(RoundingControl.round(2.7, RoundingMode.FLOOR)).toBe(2);
  expect(RoundingControl.round(-2.7, RoundingMode.FLOOR)).toBe(-3);
 });

 it('ceil rounds up', () => {
  expect(RoundingControl.round(2.3, RoundingMode.CEIL)).toBe(3);
  expect(RoundingControl.round(-2.3, RoundingMode.CEIL)).toBe(-2);
 });

 it('truncate rounds toward zero', () => {
  expect(RoundingControl.round(2.9, RoundingMode.TRUNCATE)).toBe(2);
  expect(RoundingControl.round(-2.9, RoundingMode.TRUNCATE)).toBe(-2);
 });

 it('roundToMultiple rounds to specified multiple', () => {
  expect(RoundingControl.roundToMultiple(7, 5)).toBe(5);
  expect(RoundingControl.roundToMultiple(8, 5)).toBe(10);
 });

 it('stochasticRound handles edge cases', () => {
  // Already tested that fractional values work
  expect(RoundingControl.stochasticRound(5.0, 0.5)).toBe(5);
 });
});
