/**
 * @file test/utils/random-source.node.spec.ts
 * @module @lenguados/math2d/utils
 * @description Tests for random source implementations.
 */

import { describe, expect, it } from '@jest/globals';

import {
 MathRandomSource,
 SeededRandomSource,
 getDefaultRandomSource,
 setDefaultRandomSource,
} from '../../src/utils/random-source';

describe('utils/random-source', () => {
 describe('MathRandomSource', () => {
  it('returns values in range [0, 1)', () => {
   const source = MathRandomSource.create();
   for (let index = 0; index < 100; index++) {
    const value = source.next();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
   }
  });

  it('nextInt returns integers in range [0, max)', () => {
   const source = MathRandomSource.create();
   const max = 10;
   for (let index = 0; index < 100; index++) {
    const value = source.nextInt(max);
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(max);
   }
  });

  it('nextInt throws RangeError for invalid max', () => {
   const source = MathRandomSource.create();
   expect(() => source.nextInt(0)).toThrow(RangeError);
   expect(() => source.nextInt(-1)).toThrow(RangeError);
   expect(() => source.nextInt(Number.NaN)).toThrow(RangeError);
   expect(() => source.nextInt(1.5)).toThrow(RangeError);
   expect(() => source.nextInt(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
  });
 });

 describe('SeededRandomSource', () => {
  it('produces same sequence with same seed', () => {
   const seed = 12345;
   const source1 = new SeededRandomSource(seed);
   const source2 = new SeededRandomSource(seed);

   for (let index = 0; index < 100; index++) {
    expect(source1.next()).toBe(source2.next());
   }
  });

  it('produces different sequence with different seed', () => {
   const source1 = new SeededRandomSource(12345);
   const source2 = new SeededRandomSource(54321);

   // At least some values should differ
   let differenceCount = 0;
   for (let index = 0; index < 100; index++) {
    if (source1.next() !== source2.next()) {
     differenceCount++;
    }
   }
   expect(differenceCount).toBeGreaterThan(90);
  });

  it('returns values in range [0, 1)', () => {
   const source = new SeededRandomSource(42);
   for (let index = 0; index < 1000; index++) {
    const value = source.next();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
   }
  });

  it('nextInt returns integers in range [0, max)', () => {
   const source = new SeededRandomSource(42);
   const max = 100;
   for (let index = 0; index < 1000; index++) {
    const value = source.nextInt(max);
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(max);
   }
  });

  it('nextInt throws RangeError for invalid max', () => {
   const source = new SeededRandomSource(42);
   expect(() => source.nextInt(0)).toThrow(RangeError);
   expect(() => source.nextInt(-5)).toThrow(RangeError);
   expect(() => source.nextInt(Number.NaN)).toThrow(RangeError);
   expect(() => source.nextInt(Number.POSITIVE_INFINITY)).toThrow(RangeError);
   expect(() => source.nextInt(Number.NEGATIVE_INFINITY)).toThrow(RangeError);
   expect(() => source.nextInt(1.5)).toThrow(RangeError);
   expect(() => source.nextInt(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
   expect(() => source.nextInt(2 ** 60)).toThrow(RangeError);
  });

  // V9-Random-01: max > 2^32 must terminate (previously caused infinite loop)
  it('nextInt terminates for max = 2^32 + 1', () => {
   const source = new SeededRandomSource(42);
   const max = 4_294_967_297; // 2^32 + 1
   const value = source.nextInt(max);
   expect(Number.isInteger(value)).toBe(true);
   expect(value).toBeGreaterThanOrEqual(0);
   expect(value).toBeLessThan(max);
  });

  it('nextInt terminates for max = Number.MAX_SAFE_INTEGER', () => {
   const source = new SeededRandomSource(42);
   const value = source.nextInt(Number.MAX_SAFE_INTEGER);
   expect(Number.isInteger(value)).toBe(true);
   expect(value).toBeGreaterThanOrEqual(0);
   expect(value).toBeLessThan(Number.MAX_SAFE_INTEGER);
  });

  it('nextInt terminates for max = 2^32 (boundary)', () => {
   const source = new SeededRandomSource(42);
   const max = 2 ** 32; // 4_294_967_296
   const value = source.nextInt(max);
   expect(Number.isInteger(value)).toBe(true);
   expect(value).toBeGreaterThanOrEqual(0);
   expect(value).toBeLessThan(max);
  });

  it('nextInt terminates for max = 2^32 - 1 (unchanged boundary)', () => {
   const source = new SeededRandomSource(42);
   const max = 2 ** 32 - 1;
   const value = source.nextInt(max);
   expect(Number.isInteger(value)).toBe(true);
   expect(value).toBeGreaterThanOrEqual(0);
   expect(value).toBeLessThan(max);
  });

  it('nextInt returns 0 for max = 1', () => {
   const source = new SeededRandomSource(42);
   // With max = 1, only valid result is 0
   for (let index = 0; index < 10; index++) {
    expect(source.nextInt(1)).toBe(0);
   }
  });

  // V9-Random-01: determinism preserved after 53-bit composition change
  it('nextInt reproduces the same stream after restoreState', () => {
   const source = new SeededRandomSource(12345);
   const max = 10_000_000_000; // > 2^32 to exercise composed path
   source.nextInt(max);
   source.nextInt(max);
   const checkpoint = source.getState();
   const afterCheckpoint = [source.nextInt(max), source.nextInt(max), source.nextInt(max)];
   source.restoreState(checkpoint);
   const replayed = [source.nextInt(max), source.nextInt(max), source.nextInt(max)];
   expect(replayed).toEqual(afterCheckpoint);
  });

  it('seed() resets the generator', () => {
   const source = new SeededRandomSource(12345);
   const firstValues = [source.next(), source.next(), source.next()];

   source.seed(12345);
   const resetValues = [source.next(), source.next(), source.next()];

   expect(resetValues).toEqual(firstValues);
  });

  it('getState/restoreState allows save/restore', () => {
   const source = new SeededRandomSource(12345);

   // Generate some values
   source.next();
   source.next();
   source.next();

   // Save state
   const savedState = source.getState();
   expect(savedState).toHaveLength(4);

   // Generate more values
   const afterSaveValues = [source.next(), source.next(), source.next()];

   // Restore state
   source.restoreState(savedState);

   // Values should be the same as after save
   const restoredValues = [source.next(), source.next(), source.next()];
   expect(restoredValues).toEqual(afterSaveValues);
  });

  it('restoreState throws for invalid state', () => {
   const source = new SeededRandomSource(12345);

   expect(() => source.restoreState([0, 0, 0, 0])).toThrow(RangeError);
   expect(() => source.restoreState([] as unknown as [number, number, number, number])).toThrow(
    RangeError,
   );
  });

  it('restoreState rejects non-integer components', () => {
   const source = new SeededRandomSource(12345);

   expect(() => source.restoreState([NaN, 0, 0, 0])).toThrow(/finite integer/);
   expect(() => source.restoreState([NaN, NaN, NaN, NaN])).toThrow(/finite integer/);
   expect(() => source.restoreState([0.5, 0, 0, 0])).toThrow(/finite integer/);
   expect(() => source.restoreState([Infinity, 0, 0, 0])).toThrow(/finite integer/);
   expect(() => source.restoreState([0, -Infinity, 0, 0])).toThrow(/finite integer/);
  });

  it('restoreState rejects the all-zero absorbing state', () => {
   const source = new SeededRandomSource(12345);
   expect(() => source.restoreState([0, 0, 0, 0])).toThrow(/absorbing fixed point/);
  });

  it('handles edge case seeds', () => {
   // Seed of 0 should work
   const source0 = new SeededRandomSource(0);
   expect(source0.next()).toBeGreaterThanOrEqual(0);

   // Negative seed should work
   const sourceNeg = new SeededRandomSource(-12345);
   expect(sourceNeg.next()).toBeGreaterThanOrEqual(0);

   // Very large seed should be wrapped
   const sourceLarge = new SeededRandomSource(Number.MAX_SAFE_INTEGER);
   expect(sourceLarge.next()).toBeGreaterThanOrEqual(0);
  });

  it('uses current time as default seed', () => {
   const source1 = new SeededRandomSource();
   const source2 = new SeededRandomSource();

   // Different instantiation times = different seeds (usually)
   // Just verify they work
   expect(source1.next()).toBeGreaterThanOrEqual(0);
   expect(source2.next()).toBeGreaterThanOrEqual(0);
  });

  it('determinism: two instances with same seed produce identical sequences', () => {
   const seed = 42;
   const source1 = new SeededRandomSource(seed);
   const source2 = new SeededRandomSource(seed);

   for (let index = 0; index < 10000; index++) {
    expect(source1.next()).toBe(source2.next());
   }
  });

  it('nextInt is unbiased (chi-squared test for small max)', () => {
   const source = new SeededRandomSource(42);
   const max = 3;
   const samples = 100000;
   const counts = new Array<number>(max).fill(0);

   for (let index = 0; index < samples; index++) {
    counts[source.nextInt(max)]!++;
   }

   // Expected count per bucket
   const expected = samples / max;
   let chiSquared = 0;
   for (let bucket = 0; bucket < max; bucket++) {
    const diff = counts[bucket]! - expected;
    chiSquared += (diff * diff) / expected;
   }
   // With 2 degrees of freedom, chi-squared < 9.21 is p > 0.01
   expect(chiSquared).toBeLessThan(9.21);
  });

  it('nextInt is unbiased (chi-squared test for max=256)', () => {
   const source = new SeededRandomSource(123);
   const max = 256;
   const samples = 100000;
   const counts = new Array<number>(max).fill(0);

   for (let index = 0; index < samples; index++) {
    counts[source.nextInt(max)]!++;
   }

   const expected = samples / max;
   let chiSquared = 0;
   for (let bucket = 0; bucket < max; bucket++) {
    const diff = counts[bucket]! - expected;
    chiSquared += (diff * diff) / expected;
   }
   // With 255 degrees of freedom, chi-squared < 310.46 is p > 0.01
   expect(chiSquared).toBeLessThan(310.46);
  });
 });

 describe('getDefaultRandomSource / setDefaultRandomSource', () => {
  it('returns a working random source', () => {
   const source = getDefaultRandomSource();
   expect(source).toBeDefined();
   expect(source.next()).toBeGreaterThanOrEqual(0);
  });

  it('can be changed globally', () => {
   const original = getDefaultRandomSource();
   const seeded = new SeededRandomSource(42);

   setDefaultRandomSource(seeded);
   expect(getDefaultRandomSource()).toBe(seeded);

   // Restore original
   setDefaultRandomSource(original);
   expect(getDefaultRandomSource()).toBe(original);
  });
 });
});
