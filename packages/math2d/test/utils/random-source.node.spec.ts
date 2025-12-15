/**
 * @file test/utils/random-source.node.spec.ts
 * @module @lenguados/math2d/utils
 * @description Tests for random source implementations.
 */

import { describe, expect, it } from '@jest/globals';

import {
 MathRandomSource,
 SeededRandomSource,
 defaultRandomSource,
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

  it('seed() resets the generator', () => {
   const source = new SeededRandomSource(12345);
   const firstValues = [source.next(), source.next(), source.next()];

   source.seed(12345);
   const resetValues = [source.next(), source.next(), source.next()];

   expect(resetValues).toEqual(firstValues);
  });

  it('getState/setState allows save/restore', () => {
   const source = new SeededRandomSource(12345);

   // Generate some values
   source.next();
   source.next();
   source.next();

   // Save state
   const savedState = source.getState();

   // Generate more values
   const afterSaveValues = [source.next(), source.next(), source.next()];

   // Restore state
   source.setState(savedState);

   // Values should be the same as after save
   const restoredValues = [source.next(), source.next(), source.next()];
   expect(restoredValues).toEqual(afterSaveValues);
  });

  it('setState throws for invalid state', () => {
   const source = new SeededRandomSource(12345);

   expect(() => source.setState(0)).toThrow(RangeError);
   expect(() => source.setState(-1)).toThrow(RangeError);
   expect(() => source.setState(2147483647)).toThrow(RangeError);
  });

  it('handles edge case seeds', () => {
   // Seed of 0 should be treated as 1
   const source0 = new SeededRandomSource(0);
   expect(source0.next()).toBeGreaterThanOrEqual(0);

   // Negative seed should work (absolute value used)
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
 });

 describe('defaultRandomSource', () => {
  it('exists and works', () => {
   expect(defaultRandomSource).toBeDefined();
   expect(defaultRandomSource.next()).toBeGreaterThanOrEqual(0);
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
