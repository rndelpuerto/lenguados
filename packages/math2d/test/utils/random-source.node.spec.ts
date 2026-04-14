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
   const source = new MathRandomSource();
   for (let index = 0; index < 100; index++) {
    const value = source.next();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
   }
  });

  it('nextInt returns integers in range [0, max)', () => {
   const source = new MathRandomSource();
   const max = 10;
   for (let index = 0; index < 100; index++) {
    const value = source.nextInt(max);
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(max);
   }
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

  it('nextInt throws for invalid max', () => {
   const source = new SeededRandomSource(42);
   expect(() => source.nextInt(0)).toThrow(TypeError);
   expect(() => source.nextInt(-5)).toThrow(TypeError);
   expect(() => source.nextInt(NaN)).toThrow(TypeError);
   expect(() => source.nextInt(1.5)).toThrow(TypeError);
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

  it('restoreState rejects NaN values that coerce to all-zero state', () => {
   const source = new SeededRandomSource(12345);

   expect(() => source.restoreState([NaN, 0, 0, 0])).toThrow(RangeError);
   expect(() => source.restoreState([NaN, NaN, NaN, NaN])).toThrow(RangeError);
   expect(() => source.restoreState([0.5, 0, 0, 0])).toThrow(RangeError);
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
