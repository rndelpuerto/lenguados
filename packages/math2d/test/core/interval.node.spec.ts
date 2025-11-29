import { describe, expect, it } from '@jest/globals';

import { Interval } from '../../src/core/interval';

const DIGITS = 10;

describe('Interval', () => {
 describe('Factories and setters', () => {
  it('validates order in constructor and set', () => {
   expect(() => new Interval(2, 1)).toThrow(RangeError);
   const interval = new Interval().set(0, 5);
   expect(interval.min).toBe(0);
   expect(interval.max).toBe(5);
  });

  it('fromCenterRadius builds symmetric ranges', () => {
   const interval = Interval.fromCenterRadius(2, 1);
   expect(interval.min).toBeCloseTo(1, DIGITS);
   expect(interval.max).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Arithmetic', () => {
  it('adds and multiplies intervals', () => {
   const a = new Interval(1, 2);
   const b = new Interval(3, 4);
   const sum = a.add(b);
   expect(sum.min).toBe(4);
   expect(sum.max).toBe(6);

   const product = new Interval(1, 2).multiply(b);
   expect(product.min).toBe(3);
   expect(product.max).toBe(8);
  });

  it('divide throws when divisor spans zero', () => {
   const a = new Interval(1, 2);
   const b = new Interval(-1, 1);
   expect(() => a.divide(b)).toThrow();
  });
 });

 describe('Functions', () => {
  it('square handles sign cases', () => {
   const positive = new Interval(2, 4).square();
   expect(positive.min).toBe(4);
   expect(positive.max).toBe(16);

   const crossing = new Interval(-2, 3).square();
   expect(crossing.min).toBe(0);
   expect(crossing.max).toBe(9);
  });

  it('reciprocal rejects zero and respects order', () => {
   const negative = new Interval(-4, -2).reciprocal();
   expect(negative.min).toBeCloseTo(-0.5, DIGITS);
   expect(negative.max).toBeCloseTo(-0.25, DIGITS);
   expect(() => new Interval(-1, 1).reciprocal()).toThrow();
  });

  it('hull and intersect combine intervals appropriately', () => {
   const a = new Interval(0, 5);
   const b = new Interval(3, 10);
   const hull = Interval.hull(a, b);
   expect(hull.min).toBe(0);
   expect(hull.max).toBe(10);

   const intersection = a.clone().intersect(b);
   expect(intersection.min).toBe(3);
   expect(intersection.max).toBe(5);
  });
 });

 describe('Interpolation helpers', () => {
  it('lerp clamps t', () => {
   const interval = new Interval(0, 10);
   expect(interval.lerp(1.5)).toBe(10);
   expect(interval.lerp(-1)).toBe(0);
  });

  it('inverseLerp returns normalized value', () => {
   const interval = new Interval(2, 6);
   expect(interval.inverseLerp(4)).toBeCloseTo(0.5, DIGITS);
  });
 });
});
