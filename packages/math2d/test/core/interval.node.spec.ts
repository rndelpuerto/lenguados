import { describe, expect, it } from '@jest/globals';

import { Interval } from '../../src/core/interval';
import { setAssertionsEnabled } from '../../src/validation/assert';

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
   expect(result.min).toBeCloseTo(2, 10);
   expect(result.max).toBeCloseTo(3, 10);
  });

  it('reciprocal computes reciprocal interval', () => {
   expect.hasAssertions();
   const index = new Interval(2, 4);
   const result = index.reciprocal();
   expect(result.min).toBeCloseTo(0.25, 10);
   expect(result.max).toBeCloseTo(0.5, 10);
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
});
