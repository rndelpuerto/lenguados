/**
 * @file test/core/interval.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Tests for Interval core behavior.
 */

import { describe, expect, it } from '@jest/globals';

import { Interval } from '../../src/core/interval';
import { setAssertionsEnabled } from '../../src/validation/assert';

const DIGITS = 8; // toBeCloseTo decimal digits (8 for float tolerance)

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
   if (!intersection) {
    throw new Error('Expected intersection to be defined');
   }
   expect(intersection.min).toBe(3);
   expect(intersection.max).toBe(5);
  });
 });

 describe('Interpolation helpers', () => {
  it('sample clamps t', () => {
   const interval = new Interval(0, 10);
   expect(interval.sample(1.5)).toBe(10);
   expect(interval.sample(-1)).toBe(0);
  });

  it('inverseLerp returns normalized value', () => {
   const interval = new Interval(2, 6);
   expect(interval.inverseLerp(4)).toBeCloseTo(0.5, DIGITS);
  });
 });

 describe('Properties', () => {
  it('center returns midpoint', () => {
   const interval = new Interval(0, 10);
   expect(interval.center()).toBe(5);
  });

  it('radius returns half-width', () => {
   const interval = new Interval(2, 8);
   expect(interval.radius()).toBe(3);
  });

  it('width returns length', () => {
   const interval = new Interval(3, 7);
   expect(interval.width()).toBe(4);
  });

  it('isDegenerate checks for zero-width interval', () => {
   expect(new Interval(5, 5).isDegenerate()).toBe(true);
   expect(new Interval(5, 5).isDegenerate(0.1)).toBe(true);
   expect(new Interval(5, 6).isDegenerate()).toBe(false);
  });
 });

 describe('Containment', () => {
  it('contains checks if value is in interval', () => {
   const interval = new Interval(0, 10);
   expect(interval.contains(5)).toBe(true);
   expect(interval.contains(0)).toBe(true);
   expect(interval.contains(10)).toBe(true);
   expect(interval.contains(-1)).toBe(false);
   expect(interval.contains(11)).toBe(false);
  });

  it('strictlyContains checks exclusive bounds', () => {
   const interval = new Interval(0, 10);
   expect(interval.strictlyContains(5)).toBe(true);
   expect(interval.strictlyContains(0)).toBe(false);
   expect(interval.strictlyContains(10)).toBe(false);
  });

  it('isSubsetOf checks if inside other interval', () => {
   const outer = new Interval(0, 10);
   const inner = new Interval(2, 8);
   expect(inner.isSubsetOf(outer)).toBe(true);
   expect(outer.isSubsetOf(inner)).toBe(false);
  });

  it('overlaps checks intersection existence', () => {
   const a = new Interval(0, 5);
   const b = new Interval(3, 8);
   const c = new Interval(6, 10);
   expect(a.overlaps(b)).toBe(true);
   expect(a.overlaps(c)).toBe(false);
  });
 });

 describe('Manipulation', () => {
  it('clampValue restricts value to interval', () => {
   const interval = new Interval(0, 10);
   expect(interval.clampValue(5)).toBe(5);
   expect(interval.clampValue(-5)).toBe(0);
   expect(interval.clampValue(15)).toBe(10);
  });

  it('negate flips interval', () => {
   const interval = new Interval(2, 5);
   const negated = interval.negate();
   expect(negated.min).toBe(-5);
   expect(negated.max).toBe(-2);
  });

  it('scale multiplies interval', () => {
   const interval = new Interval(2, 4);
   const scaled = interval.scale(3);
   expect(scaled.min).toBe(6);
   expect(scaled.max).toBe(12);
  });

  it('union combines intervals', () => {
   const a = new Interval(0, 5);
   const b = new Interval(3, 10);
   const united = a.union(b);
   expect(united.min).toBe(0);
   expect(united.max).toBe(10);
  });

  it('lerpInterval interpolates between intervals', () => {
   const a = new Interval(0, 10);
   const b = new Interval(20, 30);
   const mid = a.lerpInterval(b, 0.5);
   expect(mid.min).toBe(10);
   expect(mid.max).toBe(20);
  });
 });

 describe('Clone and copy', () => {
  it('clone creates independent copy', () => {
   const original = new Interval(1, 5);
   const cloned = original.clone();
   expect(cloned.min).toBe(1);
   expect(cloned.max).toBe(5);
   expect(cloned).not.toBe(original);
  });

  it('copy copies from source', () => {
   const source = new Interval(2, 8);
   const target = new Interval();
   target.copy(source);
   expect(target.min).toBe(2);
   expect(target.max).toBe(8);
  });
 });

 describe('Conversion', () => {
  it('toArray returns [min, max]', () => {
   const interval = new Interval(3, 7);
   expect(interval.toArray()).toEqual([3, 7]);
  });

  it('toObject returns plain object', () => {
   const interval = new Interval(3, 7);
   expect(interval.toObject()).toEqual({ min: 3, max: 7 });
  });

  it('toString returns formatted string', () => {
   const interval = new Interval(1, 5);
   const string_ = interval.toString();
   expect(string_).toContain('1');
   expect(string_).toContain('5');
  });
 });

 describe('Static factories', () => {
  it('fromArray creates from tuple', () => {
   const interval = Interval.fromArray([2, 8]);
   expect(interval.min).toBe(2);
   expect(interval.max).toBe(8);
  });

  it('fromObject creates from plain object', () => {
   const interval = Interval.fromObject({ min: 1, max: 9 });
   expect(interval.min).toBe(1);
   expect(interval.max).toBe(9);
  });
 });

 describe('Comparison', () => {
  it('equals checks equality', () => {
   const a = new Interval(1, 5);
   const b = new Interval(1, 5);
   const c = new Interval(1, 6);
   expect(a.exactEquals(b)).toBe(true);
   expect(a.exactEquals(c)).toBe(false);
  });

  it('equals is strict comparison', () => {
   const a = new Interval(1, 5);
   const b = new Interval(1, 5);
   const c = new Interval(1 + 1e-11, 5);
   expect(a.exactEquals(b)).toBe(true);
   expect(a.exactEquals(c)).toBe(false);
  });

  it('nearEquals with tolerance', () => {
   const a = new Interval(1, 5);
   const b = new Interval(1 + 1e-11, 5);
   expect(a.nearEquals(b, 1e-10)).toBe(true);
  });
 });

 describe('Additional operations', () => {
  it('add adds intervals', () => {
   const a = new Interval(1, 5);
   const b = new Interval(2, 3);
   const result = a.add(b);
   expect(result.min).toBe(3);
   expect(result.max).toBe(8);
  });

  it('subtract subtracts intervals', () => {
   const a = new Interval(5, 10);
   const b = new Interval(1, 2);
   const result = a.subtract(b);
   expect(result.min).toBe(3);
   expect(result.max).toBe(9);
  });

  it('multiply multiplies intervals', () => {
   const a = new Interval(2, 3);
   const b = new Interval(4, 5);
   const result = a.multiply(b);
   expect(result.min).toBe(8);
   expect(result.max).toBe(15);
  });

  it('divide divides intervals', () => {
   const a = new Interval(10, 20);
   const b = new Interval(2, 5);
   const result = a.divide(b);
   expect(result.min).toBe(2);
   expect(result.max).toBe(10);
  });

  it('scale scales interval', () => {
   const a = new Interval(2, 4);
   const result = a.scale(3);
   expect(result.min).toBe(6);
   expect(result.max).toBe(12);
  });

  it('negate negates interval', () => {
   const a = new Interval(2, 5);
   const result = a.negate();
   expect(result.min).toBe(-5);
   expect(result.max).toBe(-2);
  });

  it('square computes square', () => {
   const a = new Interval(2, 3);
   const result = a.square();
   expect(result.min).toBe(4);
   expect(result.max).toBe(9);
  });

  it('sqrt computes square root', () => {
   const a = new Interval(4, 9);
   const result = a.sqrt();
   expect(result.min).toBeCloseTo(2);
   expect(result.max).toBeCloseTo(3);
  });

  it('reciprocal computes reciprocal', () => {
   const a = new Interval(2, 4);
   const result = a.reciprocal();
   expect(result.min).toBeCloseTo(0.25);
   expect(result.max).toBeCloseTo(0.5);
  });
 });

 describe('Additional Static Methods', () => {
  it('add static adds two intervals', () => {
   const result = Interval.add(new Interval(1, 2), new Interval(3, 4));
   expect(result.min).toBe(4);
   expect(result.max).toBe(6);
  });

  it('subtract static subtracts intervals', () => {
   const result = Interval.subtract(new Interval(5, 10), new Interval(1, 2));
   expect(result.min).toBe(3); // 5 - 2
   expect(result.max).toBe(9); // 10 - 1
  });

  it('multiply static multiplies intervals', () => {
   const result = Interval.multiply(new Interval(2, 3), new Interval(4, 5));
   expect(result.min).toBe(8);
   expect(result.max).toBe(15);
  });

  it('scale static scales interval', () => {
   const result = Interval.scale(new Interval(2, 4), 3);
   expect(result.min).toBe(6);
   expect(result.max).toBe(12);
  });

  it('scale static handles negative scalar', () => {
   const result = Interval.scale(new Interval(2, 4), -1);
   expect(result.min).toBe(-4);
   expect(result.max).toBe(-2);
  });

  it('negate static negates interval', () => {
   const result = Interval.negate(new Interval(2, 5));
   expect(result.min).toBe(-5);
   expect(result.max).toBe(-2);
  });

  it('fromArray creates interval from array', () => {
   const array = [1, 5, 10, 20];
   const result = Interval.fromArray(array, 1); // starts at index 1
   expect(result.min).toBe(5);
   expect(result.max).toBe(10);
  });

  it('fromArray throws on invalid offset', () => {
   // Disable assertions to test production throws (assertions throw Error, production throws RangeError)
   setAssertionsEnabled(false);
   try {
    expect(() => Interval.fromArray([1, 2], 5)).toThrow(RangeError);
    expect(() => Interval.fromArray([1, 2], -1)).toThrow(RangeError);
   } finally {
    setAssertionsEnabled(true);
   }
  });

  it('fromObject creates interval from object', () => {
   const result = Interval.fromObject({ min: 3, max: 7 });
   expect(result.min).toBe(3);
   expect(result.max).toBe(7);
  });

  it('fromCenterRadius throws on negative radius', () => {
   // Disable assertions to test production throws
   setAssertionsEnabled(false);
   try {
    expect(() => Interval.fromCenterRadius(5, -1)).toThrow(RangeError);
   } finally {
    setAssertionsEnabled(true);
   }
  });
 });

 describe('Comparison Methods', () => {
  it('overlaps detects overlapping intervals', () => {
   expect(Interval.overlaps(new Interval(0, 5), new Interval(3, 10))).toBe(true);
   expect(Interval.overlaps(new Interval(0, 5), new Interval(6, 10))).toBe(false);
  });

  it('equals checks strict equality', () => {
   expect(Interval.exactEquals(new Interval(1, 2), new Interval(1, 2))).toBe(true);
   expect(Interval.exactEquals(new Interval(1, 2), new Interval(1, 3))).toBe(false);
  });

  it('contains checks if value is in interval', () => {
   const interval = new Interval(0, 10);
   expect(Interval.contains(interval, 5)).toBe(true);
   expect(Interval.contains(interval, 15)).toBe(false);
  });
 });

 describe('Static Math Operations', () => {
  it('sqrt static computes square root', () => {
   const result = Interval.sqrt(new Interval(4, 9));
   expect(result.min).toBeCloseTo(2);
   expect(result.max).toBeCloseTo(3);
  });

  it('square static computes square', () => {
   const result = Interval.square(new Interval(2, 3));
   expect(result.min).toBeCloseTo(4);
   expect(result.max).toBeCloseTo(9);
  });

  it('reciprocal static throws when spanning zero', () => {
   expect(() => Interval.reciprocal(new Interval(-1, 1))).toThrow();
  });

  it('reciprocal static computes for positive interval', () => {
   const result = Interval.reciprocal(new Interval(2, 4));
   expect(result.min).toBeCloseTo(0.25);
   expect(result.max).toBeCloseTo(0.5);
  });

  it('hull creates enclosing interval', () => {
   const result = Interval.hull(new Interval(0, 5), new Interval(3, 10));
   expect(result.min).toBe(0);
   expect(result.max).toBe(10);
  });

  it('intersect finds common interval', () => {
   const result = Interval.intersect(new Interval(0, 5), new Interval(3, 10));
   if (!result) throw new Error('Expected intersection');
   expect(result.min).toBe(3);
   expect(result.max).toBe(5);
  });
 });

 describe('Instance Copy and Clone', () => {
  it('clone creates independent copy', () => {
   const a = new Interval(1, 5);
   const b = a.clone();
   b.set(10, 20);
   expect(a.min).toBe(1);
   expect(b.min).toBe(10);
  });

  it('copy copies from another interval', () => {
   const a = new Interval(1, 5);
   const b = new Interval(10, 20);
   a.copy(b);
   expect(a.min).toBe(10);
   expect(a.max).toBe(20);
  });
 });

 describe('Static Operations Extended', () => {
  it('scale with positive scalar', () => {
   const result = Interval.scale(new Interval(1, 2), 3);
   expect(result.min).toBe(3);
   expect(result.max).toBe(6);
  });

  it('scale with negative scalar flips bounds', () => {
   const result = Interval.scale(new Interval(1, 2), -2);
   expect(result.min).toBe(-4);
   expect(result.max).toBe(-2);
  });

  it('negate reverses sign and flips bounds', () => {
   const result = Interval.negate(new Interval(1, 3));
   expect(result.min).toBe(-3);
   expect(result.max).toBe(-1);
  });

  it('lerp interpolates between intervals', () => {
   const a = new Interval(0, 10);
   const b = new Interval(10, 20);
   const result = Interval.lerp(a, b, 0.5);
   expect(result.min).toBe(5);
   expect(result.max).toBe(15);
  });

  it('equals compares intervals with tolerance', () => {
   expect(Interval.exactEquals(new Interval(1, 2), new Interval(1, 2))).toBe(true);
   expect(Interval.exactEquals(new Interval(1, 2), new Interval(1, 3))).toBe(false);
  });

  it('isDegenerate checks zero width', () => {
   expect(Interval.isDegenerate(new Interval(5, 5))).toBe(true);
   expect(Interval.isDegenerate(new Interval(1, 5))).toBe(false);
  });

  it('width returns interval length', () => {
   expect(Interval.width(new Interval(3, 10))).toBe(7);
  });
 });

 describe('Instance Methods Extended', () => {
  it('center returns midpoint', () => {
   const index = new Interval(0, 10);
   expect(index.center()).toBe(5);
  });

  it('width returns interval length', () => {
   const index = new Interval(3, 10);
   expect(index.width()).toBe(7);
  });

  it('contains checks if value is in interval', () => {
   const index = new Interval(0, 10);
   expect(index.contains(5)).toBe(true);
   expect(index.contains(15)).toBe(false);
  });
 });

 describe('Coverage - Instance Math Operations', () => {
  it('scale with positive scalar', () => {
   const index = new Interval(2, 4);
   const result = index.scale(2);
   expect(result.min).toBe(4);
   expect(result.max).toBe(8);
  });

  it('scale with negative scalar flips min/max', () => {
   const index = new Interval(2, 4);
   const result = index.scale(-1);
   expect(result.min).toBe(-4);
   expect(result.max).toBe(-2);
  });

  it('negate flips and negates', () => {
   const index = new Interval(2, 4);
   const result = index.negate();
   expect(result.min).toBe(-4);
   expect(result.max).toBe(-2);
  });

  it('square computes squared interval', () => {
   const index = new Interval(2, 3);
   const result = index.square();
   expect(result.min).toBe(4);
   expect(result.max).toBe(9);
  });

  it('sqrt computes square root interval', () => {
   const index = new Interval(4, 9);
   const result = index.sqrt();
   expect(result.min).toBeCloseTo(2);
   expect(result.max).toBeCloseTo(3);
  });
 });

 describe('Coverage - Static Constants', () => {
  it('FULL covers all real numbers', () => {
   expect(Interval.FULL.min).toBe(Number.NEGATIVE_INFINITY);
   expect(Interval.FULL.max).toBe(Number.POSITIVE_INFINITY);
  });

  it('UNIT is [0, 1]', () => {
   expect(Interval.UNIT.min).toBe(0);
   expect(Interval.UNIT.max).toBe(1);
  });

  it('PERCENT is [0, 100]', () => {
   expect(Interval.PERCENT.min).toBe(0);
   expect(Interval.PERCENT.max).toBe(100);
  });
 });

 describe('Coverage - Static Methods', () => {
  it('width computes interval width', () => {
   expect(Interval.width({ min: 2, max: 5 })).toBe(3);
  });

  it('center computes interval center', () => {
   expect(Interval.center({ min: 2, max: 6 })).toBe(4);
  });

  it('hull creates smallest enclosing interval', () => {
   const result = Interval.hull([1, 5, 3]);
   expect(result.min).toBe(1);
   expect(result.max).toBe(5);
  });
 });

 describe('Coverage - Instance Scale and Transform', () => {
  it('scale with positive scalar', () => {
   expect.hasAssertions();
   const index = new Interval(2, 4);
   const result = index.scale(2);
   expect(result.min).toBe(4);
   expect(result.max).toBe(8);
  });

  it('scale with negative scalar swaps bounds', () => {
   expect.hasAssertions();
   const index = new Interval(2, 4);
   const result = index.scale(-2);
   expect(result.min).toBe(-8);
   expect(result.max).toBe(-4);
  });

  it('negate swaps and negates bounds', () => {
   expect.hasAssertions();
   const index = new Interval(2, 4);
   const result = index.negate();
   expect(result.min).toBe(-4);
   expect(result.max).toBe(-2);
  });

  it('square computes squared interval', () => {
   expect.hasAssertions();
   const index = new Interval(2, 3);
   const result = index.square();
   expect(result.min).toBe(4);
   expect(result.max).toBe(9);
  });

  it('sqrt computes square root interval', () => {
   expect.hasAssertions();
   const index = new Interval(4, 9);
   const result = index.sqrt();
   expect(result.min).toBeCloseTo(2, 6);
   expect(result.max).toBeCloseTo(3, 6);
  });

  it('reciprocal computes reciprocal interval', () => {
   expect.hasAssertions();
   const index = new Interval(2, 4);
   const result = index.reciprocal();
   expect(result.min).toBeCloseTo(0.25, 8);
   expect(result.max).toBeCloseTo(0.5, 8);
  });

  it('reciprocal throws when interval contains zero', () => {
   expect.hasAssertions();
   const index = new Interval(-1, 1);
   expect(() => index.reciprocal()).toThrow('Interval.reciprocal: interval contains zero');
  });
 });

 describe('Coverage - Additional Static Constants', () => {
  it('FULL covers entire real line', () => {
   expect.hasAssertions();
   expect(Interval.FULL.min).toBe(Number.NEGATIVE_INFINITY);
   expect(Interval.FULL.max).toBe(Number.POSITIVE_INFINITY);
  });

  it('EPSILON_INTERVAL is symmetric around zero', () => {
   expect.hasAssertions();
   expect(Interval.EPSILON_INTERVAL.min).toBeLessThan(0);
   expect(Interval.EPSILON_INTERVAL.max).toBeGreaterThan(0);
  });

  it('DEGREES is [0, 360]', () => {
   expect.hasAssertions();
   expect(Interval.DEGREES.min).toBe(0);
   expect(Interval.DEGREES.max).toBe(360);
  });

  it('RADIANS is [0, 2π]', () => {
   expect.hasAssertions();
   expect(Interval.RADIANS.min).toBe(0);
   expect(Interval.RADIANS.max).toBeCloseTo(Math.PI * 2);
  });
 });

 describe('Coverage - Static Comparison', () => {
  it('equals is strict comparison', () => {
   expect.hasAssertions();
   const a = new Interval(1, 2);
   const b = new Interval(1, 2);
   const c = new Interval(1.0000001, 2.0000001);
   expect(Interval.exactEquals(a, b)).toBe(true);
   expect(Interval.exactEquals(a, c)).toBe(false);
  });

  it('nearEquals checks approximate equality with relative tolerance', () => {
   expect.hasAssertions();
   const a = new Interval(1, 2);
   const b = new Interval(1.0000001, 2.0000001);
   // With relative tolerance, threshold = epsilon * max(1, |a|, |b|)
   // For values ~1-2, this is approximately epsilon * 2
   expect(Interval.nearEquals(a, b, 0.001)).toBe(true);
   // Use smaller epsilon to ensure false (diff ~1e-7, need threshold < 1e-7)
   expect(Interval.nearEquals(a, b, 1e-9)).toBe(false);
  });

  it('isDegenerate checks zero width', () => {
   expect.hasAssertions();
   const degenerate = new Interval(5, 5);
   const normal = new Interval(1, 2);
   expect(Interval.isDegenerate(degenerate)).toBe(true);
   expect(Interval.isDegenerate(normal)).toBe(false);
  });

  it('overlaps detects intersection', () => {
   expect.hasAssertions();
   const a = new Interval(0, 5);
   const b = new Interval(3, 8);
   const c = new Interval(10, 15);
   expect(Interval.overlaps(a, b)).toBe(true);
   expect(Interval.overlaps(a, c)).toBe(false);
  });
 });

 describe('Coverage - Instance Arithmetic Extended', () => {
  it('add without out returns new interval', () => {
   expect.hasAssertions();
   const a = new Interval(1, 2);
   const b = new Interval(3, 4);
   const result = a.add(b);
   expect(result.min).toBe(4);
   expect(result.max).toBe(6);
  });

  it('subtract returns difference interval', () => {
   expect.hasAssertions();
   const a = new Interval(5, 10);
   const b = new Interval(1, 2);
   const result = a.subtract(b);
   expect(result.min).toBe(3);
   expect(result.max).toBe(9);
  });

  it('multiply handles negative intervals', () => {
   expect.hasAssertions();
   const a = new Interval(-2, 3);
   const b = new Interval(1, 2);
   const result = a.multiply(b);
   expect(result.min).toBe(-4);
   expect(result.max).toBe(6);
  });

  it('divide by positive interval', () => {
   expect.hasAssertions();
   const a = new Interval(4, 8);
   const b = new Interval(2, 4);
   const result = a.divide(b);
   expect(result.min).toBe(1);
   expect(result.max).toBe(4);
  });
 });

 describe('Coverage - Instance Methods Extended', () => {
  it('intersect returns overlap', () => {
   expect.hasAssertions();
   const a = new Interval(0, 5);
   const b = new Interval(3, 8);
   const result = a.intersect(b);
   if (!result) throw new Error('Expected intersection');
   expect(result.min).toBe(3);
   expect(result.max).toBe(5);
  });

  it('union returns enclosing interval', () => {
   expect.hasAssertions();
   const a = new Interval(0, 5);
   const b = new Interval(3, 8);
   const result = a.union(b);
   expect(result.min).toBe(0);
   expect(result.max).toBe(8);
  });

  it('contains checks value inclusion', () => {
   expect.hasAssertions();
   const interval = new Interval(0, 10);
   expect(interval.contains(5)).toBe(true);
   expect(interval.contains(15)).toBe(false);
  });

  it('width returns interval width', () => {
   expect.hasAssertions();
   const interval = new Interval(3, 7);
   expect(interval.width()).toBe(4);
  });

  it('center returns interval center', () => {
   expect.hasAssertions();
   const interval = new Interval(2, 8);
   expect(interval.center()).toBe(5);
  });
 });

 describe('Iterator', () => {
  it('supports array destructuring', () => {
   const index = new Interval(2, 10);
   const [min, max] = index;
   expect(min).toBe(2);
   expect(max).toBe(10);
  });

  it('supports spread operator', () => {
   const index = new Interval(5, 15);
   const array = [...index];
   expect(array).toEqual([5, 15]);
  });

  it('works with for...of', () => {
   const index = new Interval(1, 3);
   const values: number[] = [];
   for (const v of index) {
    values.push(v);
   }
   expect(values).toEqual([1, 3]);
  });
 });

 describe('Utility Methods', () => {
  it('isFinite returns true for finite interval', () => {
   const index = new Interval(1, 10);
   expect(index.isFinite()).toBe(true);
  });

  it('isFinite returns false for infinite interval', () => {
   // Use static method since constructor validates
   expect(Interval.isFinite({ min: 0, max: Infinity })).toBe(false);
  });

  it('hasNaN returns false for normal interval', () => {
   const index = new Interval(1, 10);
   expect(index.hasNaN()).toBe(false);
  });

  it('hasNaN returns true for NaN interval', () => {
   // Use static method since constructor validates
   expect(Interval.hasNaN({ min: NaN, max: 10 })).toBe(true);
  });

  it('zero() resets to [0, 0]', () => {
   const index = new Interval(5, 15);
   const result = index.zero();
   expect(result).toBe(index);
   expect(index.min).toBe(0);
   expect(index.max).toBe(0);
  });
 });

 describe('Coverage - Static Arithmetic Operations', () => {
  it('static square handles positive interval', () => {
   const result = Interval.square({ min: 2, max: 4 });
   expect(result.min).toBe(4);
   expect(result.max).toBe(16);
  });

  it('static square handles negative interval', () => {
   const result = Interval.square({ min: -4, max: -2 });
   expect(result.min).toBe(4);
   expect(result.max).toBe(16);
  });

  it('static square handles crossing zero', () => {
   const result = Interval.square({ min: -2, max: 3 });
   expect(result.min).toBe(0);
   expect(result.max).toBe(9);
  });

  it('static sqrt works for non-negative intervals', () => {
   const result = Interval.sqrt({ min: 4, max: 16 });
   expect(result.min).toBeCloseTo(2, DIGITS);
   expect(result.max).toBeCloseTo(4, DIGITS);
  });

  it('static sqrt throws for negative intervals', () => {
   expect(() => Interval.sqrt({ min: -4, max: 4 })).toThrow(RangeError);
  });

  it('static reciprocal works for positive intervals', () => {
   const result = Interval.reciprocal({ min: 2, max: 4 });
   expect(result.min).toBeCloseTo(0.25, DIGITS);
   expect(result.max).toBeCloseTo(0.5, DIGITS);
  });

  it('static reciprocal throws when interval contains zero', () => {
   expect(() => Interval.reciprocal({ min: -1, max: 1 })).toThrow(RangeError);
  });
 });

 describe('Coverage - Static exactEquals and nearEquals', () => {
  it('static exactEquals compares exact values', () => {
   expect(Interval.exactEquals({ min: 1, max: 2 }, { min: 1, max: 2 })).toBe(true);
   expect(Interval.exactEquals({ min: 1, max: 2 }, { min: 1, max: 3 })).toBe(false);
  });

  it('static nearEquals compares with tolerance', () => {
   expect(Interval.nearEquals({ min: 1, max: 2 }, { min: 1.0000001, max: 2.0000001 }, 1e-5)).toBe(
    true,
   );
   expect(Interval.nearEquals({ min: 1, max: 2 }, { min: 2, max: 3 })).toBe(false);
  });
 });

 describe('Coverage - Instance Comparison Methods', () => {
  it('overlaps detects overlapping intervals', () => {
   const a = new Interval(0, 5);
   const b = new Interval(3, 10);
   const c = new Interval(6, 8);
   expect(a.overlaps(b)).toBe(true);
   expect(a.overlaps(c)).toBe(false);
  });

  it('isSubsetOf checks if interval is contained', () => {
   const small = new Interval(2, 4);
   const large = new Interval(0, 10);
   expect(small.isSubsetOf(large)).toBe(true);
   expect(large.isSubsetOf(small)).toBe(false);
  });
 });

 describe('Coverage - Static strictlyContains and isSubsetOf', () => {
  it('static strictlyContains returns true for interior points', () => {
   expect(Interval.strictlyContains({ min: 0, max: 10 }, 5)).toBe(true);
  });

  it('static strictlyContains returns false for boundary points', () => {
   expect(Interval.strictlyContains({ min: 0, max: 10 }, 0)).toBe(false);
   expect(Interval.strictlyContains({ min: 0, max: 10 }, 10)).toBe(false);
  });

  it('static isSubsetOf checks subset relationship', () => {
   expect(Interval.isSubsetOf({ min: 2, max: 8 }, { min: 0, max: 10 })).toBe(true);
   expect(Interval.isSubsetOf({ min: 0, max: 10 }, { min: 2, max: 8 })).toBe(false);
  });
 });

 describe('Coverage - Static inverseLerp and clampValue', () => {
  it('static inverseLerp returns normalized position', () => {
   expect(Interval.inverseLerp({ min: 0, max: 10 }, 5)).toBeCloseTo(0.5, DIGITS);
   expect(Interval.inverseLerp({ min: 0, max: 10 }, 0)).toBeCloseTo(0, DIGITS);
   expect(Interval.inverseLerp({ min: 0, max: 10 }, 10)).toBeCloseTo(1, DIGITS);
  });

  it('static inverseLerp handles zero-width interval', () => {
   expect(Interval.inverseLerp({ min: 5, max: 5 }, 5)).toBe(0);
  });

  it('static clampValue clamps to interval bounds', () => {
   expect(Interval.clampValue({ min: 0, max: 10 }, 5)).toBe(5);
   expect(Interval.clampValue({ min: 0, max: 10 }, -5)).toBe(0);
   expect(Interval.clampValue({ min: 0, max: 10 }, 15)).toBe(10);
  });
 });

 describe('Coverage - Instance Arithmetic Operations', () => {
  it('square instance method', () => {
   const interval = new Interval(2, 4);
   const result = interval.square();
   expect(result).toBe(interval);
   expect(interval.min).toBe(4);
   expect(interval.max).toBe(16);
  });

  it('sqrt instance method', () => {
   const interval = new Interval(4, 16);
   const result = interval.sqrt();
   expect(result).toBe(interval);
   expect(interval.min).toBeCloseTo(2, DIGITS);
   expect(interval.max).toBeCloseTo(4, DIGITS);
  });

  it('reciprocal instance method', () => {
   const interval = new Interval(2, 4);
   const result = interval.reciprocal();
   expect(result).toBe(interval);
   expect(interval.min).toBeCloseTo(0.25, DIGITS);
   expect(interval.max).toBeCloseTo(0.5, DIGITS);
  });
 });

 describe('Coverage - fromArray with offset', () => {
  it('fromArray with offset reads correct values', () => {
   const array = [1, 2, 3, 10, 5];
   const interval = Interval.fromArray(array, 2);
   expect(interval.min).toBe(3);
   expect(interval.max).toBe(10);
  });

  it('fromArray throws for out of bounds offset', () => {
   expect(() => Interval.fromArray([1, 2], 2)).toThrow(RangeError);
  });
 });

 describe('Coverage - Static lerp and smoothStep', () => {
  it('static lerp interpolates between intervals', () => {
   const a = { min: 0, max: 10 };
   const b = { min: 10, max: 20 };
   const mid = Interval.lerp(a, b, 0.5);
   expect(mid.min).toBe(5);
   expect(mid.max).toBe(15);
  });

  it('static lerpClamped clamps t', () => {
   const a = { min: 0, max: 10 };
   const b = { min: 10, max: 20 };
   const result = Interval.lerpClamped(a, b, 2);
   expect(result.min).toBe(10);
   expect(result.max).toBe(20);
  });

  it('static lerp with midpoint', () => {
   const a = { min: 0, max: 10 };
   const b = { min: 10, max: 20 };
   const mid = Interval.lerp(a, b, 0.5);
   expect(mid.min).toBe(5);
   expect(mid.max).toBe(15);
  });
 });

 describe('Coverage - Instance strictlyContains', () => {
  it('strictlyContains returns true for interior', () => {
   const interval = new Interval(0, 10);
   expect(interval.strictlyContains(5)).toBe(true);
  });

  it('strictlyContains returns false for boundaries', () => {
   const interval = new Interval(0, 10);
   expect(interval.strictlyContains(0)).toBe(false);
   expect(interval.strictlyContains(10)).toBe(false);
  });
 });

 describe('Coverage - Static width, center, radius', () => {
  it('static width returns interval width', () => {
   expect(Interval.width({ min: 2, max: 8 })).toBe(6);
  });

  it('static center returns interval center', () => {
   expect(Interval.center({ min: 2, max: 8 })).toBe(5);
  });

  it('static radius returns half width', () => {
   expect(Interval.radius({ min: 2, max: 8 })).toBe(3);
  });
 });

 describe('Coverage - Static arithmetic', () => {
  it('static add adds intervals', () => {
   const result = Interval.add({ min: 1, max: 2 }, { min: 3, max: 4 });
   expect(result.min).toBe(4);
   expect(result.max).toBe(6);
  });

  it('static subtract subtracts intervals', () => {
   const result = Interval.subtract({ min: 5, max: 10 }, { min: 1, max: 2 });
   expect(result.min).toBe(3);
   expect(result.max).toBe(9);
  });

  it('static multiply multiplies intervals', () => {
   const result = Interval.multiply({ min: 2, max: 3 }, { min: 4, max: 5 });
   expect(result.min).toBe(8);
   expect(result.max).toBe(15);
  });

  it('static scale scales interval', () => {
   const result = Interval.scale({ min: 1, max: 3 }, 2);
   expect(result.min).toBe(2);
   expect(result.max).toBe(6);
  });
 });

 describe('Coverage - Static containment', () => {
  it('static union returns bounding interval', () => {
   const result = Interval.union({ min: 0, max: 5 }, { min: 3, max: 8 });
   expect(result.min).toBe(0);
   expect(result.max).toBe(8);
  });

  it('static intersect returns overlapping interval', () => {
   const result = Interval.intersect({ min: 0, max: 5 }, { min: 3, max: 8 });
   if (!result) throw new Error('Expected intersection');
   expect(result.min).toBe(3);
   expect(result.max).toBe(5);
  });

  it('static overlaps checks overlap', () => {
   expect(Interval.overlaps({ min: 0, max: 5 }, { min: 4, max: 8 })).toBe(true);
   expect(Interval.overlaps({ min: 0, max: 3 }, { min: 5, max: 8 })).toBe(false);
  });

  it('instance contains checks value containment', () => {
   const interval = new Interval(0, 10);
   expect(interval.contains(5)).toBe(true);
   expect(interval.contains(15)).toBe(false);
  });
 });

 describe('Coverage - Static lerp', () => {
  it('static lerp interpolates', () => {
   expect(Interval.lerp({ min: 0, max: 10 }, { min: 0, max: 10 }, 0.5).min).toBe(0);
  });
 });

 describe('Coverage - Invalid interval handling', () => {
  it('fromCenterRadius throws for negative radius', () => {
   expect(() => Interval.fromCenterRadius(5, -1)).toThrow();
  });

  it('divide throws for divisor spanning zero', () => {
   const a = new Interval(1, 2);
   const b = new Interval(-1, 1);
   expect(() => a.divide(b)).toThrow();
  });
 });

 describe('Coverage - Static negate', () => {
  it('negate negates interval', () => {
   const result = Interval.negate(new Interval(1, 3));
   expect(result.min).toBe(-3);
   expect(result.max).toBe(-1);
  });

  it('negate with out parameter', () => {
   const out = new Interval();
   const result = Interval.negate(new Interval(1, 3), out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - Static clone', () => {
  it('clone clones interval', () => {
   const source = new Interval(5, 10);
   const cloned = Interval.clone(source);
   expect(cloned.min).toBe(5);
   expect(cloned.max).toBe(10);
   expect(cloned).not.toBe(source);
  });
 });

 describe('Coverage - Static copy', () => {
  it('copy copies to destination', () => {
   const source = new Interval(5, 10);
   const destination = new Interval();
   const result = Interval.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.min).toBe(5);
   expect(destination.max).toBe(10);
  });
 });

 describe('Coverage - Instance negate', () => {
  it('negate negates in place', () => {
   const interval = new Interval(1, 3);
   interval.negate();
   expect(interval.min).toBe(-3);
   expect(interval.max).toBe(-1);
  });
 });

 describe('Coverage - Instance clone', () => {
  it('clone returns new instance', () => {
   const interval = new Interval(5, 10);
   const cloned = interval.clone();
   expect(cloned.min).toBe(5);
   expect(cloned.max).toBe(10);
   expect(cloned).not.toBe(interval);
  });
 });

 describe('Coverage - Instance copy', () => {
  it('copy copies from source', () => {
   const source = new Interval(5, 10);
   const target = new Interval();
   target.copy(source);
   expect(target.min).toBe(5);
   expect(target.max).toBe(10);
  });
 });

 describe('Coverage - Static scale', () => {
  it('scale scales interval', () => {
   const result = Interval.scale(new Interval(5, 10), 2);
   expect(result.min).toBe(10);
   expect(result.max).toBe(20);
  });
 });

 describe('Coverage - Instance scale', () => {
  it('scale scales in place', () => {
   const interval = new Interval(5, 10);
   interval.scale(2);
   expect(interval.min).toBe(10);
   expect(interval.max).toBe(20);
  });
 });

 describe('Coverage - contains', () => {
  it('contains checks value containment', () => {
   const interval = new Interval(5, 10);
   expect(interval.contains(7)).toBe(true);
   expect(interval.contains(11)).toBe(false);
  });
 });

 describe('Coverage - Instance add/subtract', () => {
  it('add adds interval', () => {
   const a = new Interval(1, 2);
   a.add(new Interval(3, 4));
   expect(a.min).toBe(4);
   expect(a.max).toBe(6);
  });

  it('subtract subtracts interval', () => {
   const a = new Interval(5, 10);
   a.subtract(new Interval(1, 2));
   expect(a.min).toBe(3);
   expect(a.max).toBe(9);
  });
 });

 describe('Coverage - Instance multiply', () => {
  it('multiply multiplies intervals', () => {
   const a = new Interval(2, 3);
   a.multiply(new Interval(2, 4));
   expect(a.min).toBe(4);
   expect(a.max).toBe(12);
  });
 });

 // === BRANCH COVERAGE: L320-339 - static add/subtract with out param ===
 describe('Coverage - Static add with out', () => {
  it('add uses out parameter', () => {
   const a = new Interval(1, 2);
   const b = new Interval(3, 4);
   const out = new Interval();
   const result = Interval.add(a, b, out);
   expect(result).toBe(out);
   expect(result.min).toBe(4);
   expect(result.max).toBe(6);
  });
 });

 describe('Coverage - Static subtract with out', () => {
  it('subtract uses out parameter', () => {
   const a = new Interval(5, 10);
   const b = new Interval(1, 2);
   const out = new Interval();
   const result = Interval.subtract(a, b, out);
   expect(result).toBe(out);
   expect(result.min).toBe(3);
   expect(result.max).toBe(9);
  });
 });

 describe('Coverage - Static multiply with out', () => {
  it('multiply uses out parameter', () => {
   const a = new Interval(2, 3);
   const b = new Interval(2, 4);
   const out = new Interval();
   const result = Interval.multiply(a, b, out);
   expect(result).toBe(out);
   expect(result.min).toBe(4);
   expect(result.max).toBe(12);
  });
 });

 describe('Coverage - Static scale with out', () => {
  it('scale uses out parameter', () => {
   const interval = new Interval(2, 4);
   const out = new Interval();
   const result = Interval.scale(interval, 2, out);
   expect(result).toBe(out);
   expect(result.min).toBe(4);
   expect(result.max).toBe(8);
  });
 });

 describe('Coverage - Static union with out', () => {
  it('union uses out parameter', () => {
   const a = new Interval(1, 5);
   const b = new Interval(3, 7);
   const out = new Interval();
   const result = Interval.union(a, b, out);
   expect(result).toBe(out);
   expect(result.min).toBe(1);
   expect(result.max).toBe(7);
  });
 });

 describe('Coverage - Static intersect with out', () => {
  it('intersect uses out parameter', () => {
   const a = new Interval(1, 5);
   const b = new Interval(3, 7);
   const out = new Interval();
   const result = Interval.intersect(a, b, out);
   if (!result) throw new Error('Expected intersection');
   expect(result).toBe(out);
   expect(result.min).toBe(3);
   expect(result.max).toBe(5);
  });
 });

 describe('Coverage - Static lerp with out', () => {
  it('lerp uses out parameter', () => {
   const a = new Interval(0, 10);
   const b = new Interval(10, 20);
   const out = new Interval();
   const result = Interval.lerp(a, b, 0.5, out);
   expect(result).toBe(out);
   expect(result.min).toBe(5);
   expect(result.max).toBe(15);
  });
 });

 describe('fromValues factory', () => {
  it('creates interval from min and max values', () => {
   const index = Interval.fromValues(2, 8);
   expect(index.min).toBe(2);
   expect(index.max).toBe(8);
  });

  it('creates unit interval', () => {
   const index = Interval.fromValues(0, 1);
   expect(index.min).toBe(0);
   expect(index.max).toBe(1);
  });

  it('uses out parameter', () => {
   const out = new Interval();
   const result = Interval.fromValues(3, 7, out);
   expect(result).toBe(out);
   expect(out.min).toBe(3);
   expect(out.max).toBe(7);
  });

  it('throws on NaN min', () => {
   expect(() => Interval.fromValues(NaN, 5)).toThrow();
  });

  it('throws on NaN max', () => {
   expect(() => Interval.fromValues(0, NaN)).toThrow();
  });

  it('throws on min > max', () => {
   expect(() => Interval.fromValues(10, 5)).toThrow();
  });
 });

 describe('divideUnchecked', () => {
  it('static divideUnchecked divides interval by scalar', () => {
   const a = new Interval(10, 20);
   const result = Interval.divideUnchecked(a, 2);
   expect(result.min).toBe(5);
   expect(result.max).toBe(10);
  });

  it('static divideUnchecked uses out parameter', () => {
   const a = new Interval(4, 8);
   const out = new Interval();
   const result = Interval.divideUnchecked(a, 2, out);
   expect(result).toBe(out);
   expect(result.min).toBe(2);
   expect(result.max).toBe(4);
  });

  it('divideUnchecked returns Infinity when divisor is zero', () => {
   const a = new Interval(4, 8);
   const result = Interval.divideUnchecked(a, 0);
   expect(result.min).toBe(Infinity);
   expect(result.max).toBe(Infinity);
  });

  it('divideUnchecked handles negative scalar', () => {
   const a = new Interval(4, 8);
   const result = Interval.divideUnchecked(a, -2);
   expect(result.min).toBe(-4);
   expect(result.max).toBe(-2);
  });
 });

 describe('reciprocalSafe', () => {
  it('static reciprocalSafe returns zero for interval containing zero', () => {
   const result = Interval.reciprocalSafe({ min: -1, max: 1 });
   expect(result.min).toBe(0);
   expect(result.max).toBe(0);
  });

  it('static reciprocalSafe computes reciprocal for positive interval', () => {
   const result = Interval.reciprocalSafe({ min: 2, max: 4 });
   expect(result.min).toBeCloseTo(0.25);
   expect(result.max).toBeCloseTo(0.5);
  });

  it('static reciprocalSafe computes reciprocal for negative interval', () => {
   const result = Interval.reciprocalSafe({ min: -4, max: -2 });
   expect(result.min).toBeCloseTo(-0.5);
   expect(result.max).toBeCloseTo(-0.25);
  });

  it('static reciprocalSafe uses out parameter', () => {
   const out = new Interval();
   const result = Interval.reciprocalSafe({ min: 2, max: 4 }, out);
   expect(result).toBe(out);
   expect(result.min).toBeCloseTo(0.25);
   expect(result.max).toBeCloseTo(0.5);
  });

  it('instance reciprocalSafe sets to zero for interval containing zero', () => {
   const interval = new Interval(-1, 1);
   const result = interval.reciprocalSafe();
   expect(result.min).toBe(0);
   expect(result.max).toBe(0);
  });

  it('instance reciprocalSafe computes reciprocal for valid interval', () => {
   const interval = new Interval(2, 4);
   const result = interval.reciprocalSafe();
   expect(result.min).toBeCloseTo(0.25);
   expect(result.max).toBeCloseTo(0.5);
  });

  it('instance reciprocalSafe returns this', () => {
   const interval = new Interval(2, 4);
   const result = interval.reciprocalSafe();
   expect(result).toBe(interval);
  });
 });

 describe('reciprocalUnchecked', () => {
  it('static reciprocalUnchecked computes reciprocal for positive interval', () => {
   const result = Interval.reciprocalUnchecked({ min: 2, max: 4 });
   expect(result.min).toBeCloseTo(0.25);
   expect(result.max).toBeCloseTo(0.5);
  });

  it('static reciprocalUnchecked computes reciprocal for negative interval', () => {
   const result = Interval.reciprocalUnchecked({ min: -4, max: -2 });
   expect(result.min).toBeCloseTo(-0.5);
   expect(result.max).toBeCloseTo(-0.25);
  });

  it('static reciprocalUnchecked uses out parameter', () => {
   const out = new Interval();
   const result = Interval.reciprocalUnchecked({ min: 2, max: 4 }, out);
   expect(result).toBe(out);
   expect(result.min).toBeCloseTo(0.25);
   expect(result.max).toBeCloseTo(0.5);
  });

  it('static reciprocalUnchecked returns Infinity for interval containing zero', () => {
   const result = Interval.reciprocalUnchecked({ min: 0, max: 1 });
   expect(result.max).toBe(Infinity);
  });

  it('instance reciprocalUnchecked computes reciprocal', () => {
   const interval = new Interval(2, 4);
   interval.reciprocalUnchecked();
   expect(interval.min).toBeCloseTo(0.25);
   expect(interval.max).toBeCloseTo(0.5);
  });

  it('instance reciprocalUnchecked returns this', () => {
   const interval = new Interval(2, 4);
   const result = interval.reciprocalUnchecked();
   expect(result).toBe(interval);
  });

  it('instance reciprocalUnchecked handles negative interval', () => {
   const interval = new Interval(-4, -2);
   interval.reciprocalUnchecked();
   expect(interval.min).toBeCloseTo(-0.5);
   expect(interval.max).toBeCloseTo(-0.25);
  });
 });

 describe('Instance validation methods', () => {
  it('isFinite returns true for finite interval', () => {
   const interval = new Interval(1, 10);
   expect(interval.isFinite()).toBe(true);
  });

  it('isFinite returns false for Infinity', () => {
   const interval = new Interval(0, Infinity);
   expect(interval.isFinite()).toBe(false);
  });

  it('hasNaN returns false for valid interval', () => {
   const interval = new Interval(1, 10);
   expect(interval.hasNaN()).toBe(false);
  });

  it('hasNaN returns true for NaN min', () => {
   const interval = new Interval();
   (interval as { min: number }).min = NaN;
   expect(interval.hasNaN()).toBe(true);
  });

  it('exactEquals returns true for identical intervals', () => {
   const a = new Interval(1, 5);
   const b = new Interval(1, 5);
   expect(a.exactEquals(b)).toBe(true);
  });

  it('exactEquals returns false for different intervals', () => {
   const a = new Interval(1, 5);
   const b = new Interval(1, 6);
   expect(a.exactEquals(b)).toBe(false);
  });

  it('nearEquals returns true for close intervals', () => {
   const a = new Interval(1, 5);
   const b = new Interval(1 + 1e-11, 5 + 1e-11);
   expect(a.nearEquals(b, 1e-10)).toBe(true);
  });
 });

 describe('Static divide method', () => {
  it('divide throws on zero scalar', () => {
   const interval = new Interval(1, 10);
   expect(() => Interval.divide(interval, 0)).toThrow(RangeError);
  });

  it('divideSafe returns zero for zero scalar', () => {
   const interval = new Interval(1, 10);
   const result = Interval.divideSafe(interval, 0);
   expect(result.min).toBe(0);
   expect(result.max).toBe(0);
  });

  it('divide divides interval by scalar', () => {
   const result = Interval.divide({ min: 10, max: 20 }, 2);
   expect(result.min).toBe(5);
   expect(result.max).toBe(10);
  });
 });

 describe('Static isFinite/hasNaN', () => {
  it('static isFinite returns true for finite interval', () => {
   expect(Interval.isFinite({ min: 1, max: 10 })).toBe(true);
  });

  it('static isFinite returns false for Infinity', () => {
   expect(Interval.isFinite({ min: 0, max: Infinity })).toBe(false);
  });

  it('static hasNaN returns false for valid interval', () => {
   expect(Interval.hasNaN({ min: 1, max: 10 })).toBe(false);
  });

  it('static hasNaN returns true for NaN', () => {
   expect(Interval.hasNaN({ min: NaN, max: 10 })).toBe(true);
  });
 });

 describe('Coverage - Static hasInfinity', () => {
  it('hasInfinity returns false for finite interval', () => {
   expect(Interval.hasInfinity({ min: 1, max: 10 })).toBe(false);
  });

  it('hasInfinity returns true for Infinity max', () => {
   expect(Interval.hasInfinity({ min: 0, max: Infinity })).toBe(true);
  });

  it('hasInfinity returns true for -Infinity min', () => {
   expect(Interval.hasInfinity({ min: -Infinity, max: 10 })).toBe(true);
  });

  it('hasInfinity returns false for NaN (not infinity)', () => {
   expect(Interval.hasInfinity({ min: NaN, max: 10 })).toBe(false);
  });
 });

 describe('Coverage - Static isZero', () => {
  it('isZero returns true for [0, 0]', () => {
   expect(Interval.isZero({ min: 0, max: 0 })).toBe(true);
  });

  it('isZero returns false for [0, 1]', () => {
   expect(Interval.isZero({ min: 0, max: 1 })).toBe(false);
  });

  it('isZero returns false for [1, 1]', () => {
   expect(Interval.isZero({ min: 1, max: 1 })).toBe(false);
  });
 });

 describe('Coverage - Static isNearZero', () => {
  it('isNearZero returns true for [0, 0]', () => {
   expect(Interval.isNearZero({ min: 0, max: 0 })).toBe(true);
  });

  it('isNearZero returns true for near-zero interval', () => {
   expect(Interval.isNearZero({ min: 1e-10, max: 1e-10 })).toBe(true);
  });

  it('isNearZero returns false for non-zero interval', () => {
   expect(Interval.isNearZero({ min: 0, max: 1 })).toBe(false);
  });
 });

 describe('Coverage - Instance hasInfinity', () => {
  it('instance hasInfinity returns false for finite', () => {
   const interval = new Interval(1, 10);
   expect(interval.hasInfinity()).toBe(false);
  });

  it('instance hasInfinity returns true for infinite', () => {
   const interval = new Interval(0, Infinity);
   expect(interval.hasInfinity()).toBe(true);
  });
 });

 describe('Coverage - Instance isZero', () => {
  it('instance isZero returns true for zero interval', () => {
   const interval = new Interval(0, 0);
   expect(interval.isZero()).toBe(true);
  });

  it('instance isZero returns false for non-zero', () => {
   const interval = new Interval(0, 1);
   expect(interval.isZero()).toBe(false);
  });
 });

 describe('Coverage - Instance isNearZero', () => {
  it('instance isNearZero returns true for near-zero', () => {
   const interval = new Interval(1e-10, 1e-10);
   expect(interval.isNearZero()).toBe(true);
  });

  it('instance isNearZero returns false for non-zero', () => {
   const interval = new Interval(1, 2);
   expect(interval.isNearZero()).toBe(false);
  });
 });

 describe('Coverage - Instance isFinite', () => {
  it('instance isFinite returns true for finite interval', () => {
   const interval = new Interval(1, 10);
   expect(interval.isFinite()).toBe(true);
  });

  it('instance isFinite returns false for infinite interval', () => {
   expect(Interval.POSITIVE.isFinite()).toBe(false);
  });
 });

 describe('Coverage - Instance hasNaN', () => {
  it('instance hasNaN returns false for valid interval', () => {
   const interval = new Interval(1, 10);
   expect(interval.hasNaN()).toBe(false);
  });
 });

 describe('Coverage - Instance isZero method', () => {
  it('instance isZero returns true for [0, 0]', () => {
   expect(Interval.ZERO.isZero()).toBe(true);
  });

  it('instance isZero returns false for non-zero', () => {
   const interval = new Interval(1, 2);
   expect(interval.isZero()).toBe(false);
  });
 });

 describe('Coverage - Static reciprocalSafe', () => {
  it('reciprocalSafe returns ZERO when containing zero', () => {
   const result = Interval.reciprocalSafe(new Interval(-1, 1));
   expect(result.min).toBe(0);
   expect(result.max).toBe(0);
  });

  it('reciprocalSafe computes reciprocal for valid interval', () => {
   const result = Interval.reciprocalSafe(new Interval(2, 4));
   expect(result.min).toBeCloseTo(0.25, DIGITS);
   expect(result.max).toBeCloseTo(0.5, DIGITS);
  });
 });

 describe('Coverage - Instance reciprocalSafe', () => {
  it('instance reciprocalSafe returns ZERO when containing zero', () => {
   const interval = new Interval(0, 5);
   interval.reciprocalSafe();
   expect(interval.min).toBe(0);
   expect(interval.max).toBe(0);
  });
 });

 describe('Coverage - Instance reciprocalUnchecked', () => {
  it('instance reciprocalUnchecked computes reciprocal', () => {
   const interval = new Interval(2, 4);
   interval.reciprocalUnchecked();
   expect(interval.min).toBeCloseTo(0.25, DIGITS);
   expect(interval.max).toBeCloseTo(0.5, DIGITS);
  });
 });

 describe('Coverage - Static divideSafe', () => {
  it('divideSafe returns ZERO when scalar is near zero', () => {
   const result = Interval.divideSafe(new Interval(10, 20), 0);
   expect(result.min).toBe(0);
   expect(result.max).toBe(0);
  });

  it('divideSafe divides when scalar is valid', () => {
   const result = Interval.divideSafe(new Interval(10, 20), 2);
   expect(result.min).toBe(5);
   expect(result.max).toBe(10);
  });
 });

 describe('Coverage - Static divideUnchecked', () => {
  it('divideUnchecked divides interval', () => {
   const result = Interval.divideUnchecked(new Interval(10, 20), 2);
   expect(result.min).toBe(5);
   expect(result.max).toBe(10);
  });
 });

 describe('Coverage - Instance intersect degenerate', () => {
  it('intersect creates degenerate interval when no overlap', () => {
   const a = new Interval(0, 5);
   const b = new Interval(10, 15);
   const result = a.intersect(b);
   // When no overlap, creates degenerate interval at newMin
   expect(result).toBeDefined();
   expect(a.min).toBe(10);
   expect(a.max).toBe(10);
  });
 });

 describe('Coverage - Instance sample edge cases', () => {
  it('sample at t=0 returns min', () => {
   const interval = new Interval(10, 20);
   expect(interval.sample(0)).toBe(10);
  });

  it('sample at t=1 returns max', () => {
   const interval = new Interval(10, 20);
   expect(interval.sample(1)).toBe(20);
  });
 });

 describe('Coverage - Static hasInfinity bounds', () => {
  it('hasInfinity returns true for infinite min', () => {
   expect(Interval.hasInfinity(new Interval(-Infinity, 5))).toBe(true);
  });

  it('hasInfinity returns true for infinite max', () => {
   expect(Interval.hasInfinity(new Interval(0, Infinity))).toBe(true);
  });

  it('hasInfinity returns false for finite interval', () => {
   expect(Interval.hasInfinity(new Interval(1, 10))).toBe(false);
  });
 });

 describe('Coverage - Static union', () => {
  it('union combines two intervals', () => {
   const a = new Interval(0, 5);
   const b = new Interval(10, 15);
   const result = Interval.union(a, b);
   expect(result.min).toBe(0);
   expect(result.max).toBe(15);
  });
 });
});
