/**
 * @file test/validation/assert.node.spec.ts
 * @description Tests for the assertion system
 */

import { performance } from 'node:perf_hooks';

import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';

import {
 assert,
 assertFinite,
 assertMatrix2,
 assertNonNegative,
 assertNonZero,
 assertPositive,
 assertRange,
 assertRotation2,
 assertSafeInteger,
 assertVector2,
 areAssertionsEnabled,
 setAssertionsEnabled,
} from '../../src/validation/assert';

describe('Validation Assert Module', () => {
 let originalState: boolean;

 beforeEach(() => {
  originalState = areAssertionsEnabled();
  setAssertionsEnabled(true);
 });

 afterAll(() => {
  setAssertionsEnabled(originalState);
 });

 describe('setAssertionsEnabled / areAssertionsEnabled', () => {
  it('disables assertions', () => {
   setAssertionsEnabled(false);
   expect(areAssertionsEnabled()).toBe(false);
  });

  it('enables assertions', () => {
   setAssertionsEnabled(false);
   setAssertionsEnabled(true);
   expect(areAssertionsEnabled()).toBe(true);
  });

  it('makes all assertions no-ops when disabled', () => {
   setAssertionsEnabled(false);
   expect(() => assertFinite(NaN)).not.toThrow();
   expect(() => assertFinite(Infinity)).not.toThrow();
   expect(() => assertNonZero(0)).not.toThrow();
   expect(() => assertPositive(-1)).not.toThrow();
   expect(() => assertRange(10, 0, 1)).not.toThrow();
   expect(() => assert(false)).not.toThrow();
  });

  it('throws for invalid values when enabled', () => {
   setAssertionsEnabled(true);
   expect(() => assertFinite(NaN)).toThrow(/must be finite/);
   expect(() => assertFinite(Infinity)).toThrow(/must be finite/);
  });
 });

 describe('assertFinite', () => {
  it('accepts finite values', () => {
   expect(() => assertFinite(0)).not.toThrow();
   expect(() => assertFinite(42)).not.toThrow();
   expect(() => assertFinite(-1e10)).not.toThrow();
   expect(() => assertFinite(Number.MAX_VALUE)).not.toThrow();
   expect(() => assertFinite(Number.MIN_VALUE)).not.toThrow();
  });

  it('rejects NaN', () => {
   expect(() => assertFinite(NaN)).toThrow(/must be finite/);
   expect(() => assertFinite(NaN)).toThrow(/NaN/);
  });

  it('rejects Infinity', () => {
   expect(() => assertFinite(Infinity)).toThrow(/must be finite/);
   expect(() => assertFinite(-Infinity)).toThrow(/must be finite/);
  });

  it('includes parameter name in error', () => {
   expect(() => assertFinite(NaN, 'myParam')).toThrow(/myParam/);
   expect(() => assertFinite(Infinity, 'velocity.x')).toThrow(/velocity\.x/);
  });

  it('uses default name when not provided', () => {
   expect(() => assertFinite(NaN)).toThrow(/value must be finite/);
  });
 });

 describe('assertNonZero', () => {
  it('accepts non-zero values', () => {
   expect(() => assertNonZero(1)).not.toThrow();
   expect(() => assertNonZero(-1)).not.toThrow();
   expect(() => assertNonZero(0.001)).not.toThrow();
   expect(() => assertNonZero(-0.001)).not.toThrow();
   expect(() => assertNonZero(Number.MIN_VALUE)).not.toThrow();
  });

  it('rejects zero', () => {
   expect(() => assertNonZero(0)).toThrow(/must not be zero/);
  });

  it('includes parameter name in error', () => {
   expect(() => assertNonZero(0, 'divisor')).toThrow(/divisor/);
  });
 });

 describe('assertRange', () => {
  it('accepts values in range (inclusive)', () => {
   expect(() => assertRange(0.5, 0, 1)).not.toThrow();
   expect(() => assertRange(0, 0, 1)).not.toThrow();
   expect(() => assertRange(1, 0, 1)).not.toThrow();
   expect(() => assertRange(-5, -10, 10)).not.toThrow();
  });

  it('rejects values below range', () => {
   expect(() => assertRange(-0.1, 0, 1)).toThrow(/must be in \[0, 1\]/);
   expect(() => assertRange(-11, -10, 10)).toThrow();
  });

  it('rejects values above range', () => {
   expect(() => assertRange(1.1, 0, 1)).toThrow(/must be in \[0, 1\]/);
   expect(() => assertRange(11, -10, 10)).toThrow();
  });

  it('includes value in error message', () => {
   expect(() => assertRange(5, 0, 1, 't')).toThrow(/got 5/);
  });
 });

 describe('assertPositive', () => {
  it('accepts positive values', () => {
   expect(() => assertPositive(1)).not.toThrow();
   expect(() => assertPositive(0.001)).not.toThrow();
   expect(() => assertPositive(Number.MAX_VALUE)).not.toThrow();
  });

  it('rejects zero', () => {
   expect(() => assertPositive(0)).toThrow(/must be positive/);
  });

  it('rejects negative values', () => {
   expect(() => assertPositive(-1)).toThrow(/must be positive/);
   expect(() => assertPositive(-0.001)).toThrow(/must be positive/);
  });
 });

 describe('assertNonNegative', () => {
  it('accepts non-negative values', () => {
   expect(() => assertNonNegative(0)).not.toThrow();
   expect(() => assertNonNegative(1)).not.toThrow();
   expect(() => assertNonNegative(0.001)).not.toThrow();
  });

  it('rejects negative values', () => {
   expect(() => assertNonNegative(-1)).toThrow(/must be non-negative/);
   expect(() => assertNonNegative(-0.001)).toThrow(/must be non-negative/);
  });
 });

 describe('assert (generic)', () => {
  it('accepts truthy conditions', () => {
   expect(() => assert(true)).not.toThrow();
   expect(() => assert(1 > 0)).not.toThrow();
   expect(() => assert(1 === 1)).not.toThrow();
  });

  it('rejects falsy conditions', () => {
   expect(() => assert(false)).toThrow(/Assertion failed/);
   expect(() => assert(1 > 2)).toThrow();
  });

  it('uses custom message', () => {
   expect(() => assert(false, 'custom error message')).toThrow(/custom error message/);
  });
 });

 describe('assertVector2', () => {
  it('accepts valid components', () => {
   expect(() => assertVector2(0, 0)).not.toThrow();
   expect(() => assertVector2(1, 2)).not.toThrow();
   expect(() => assertVector2(-1e10, 1e10)).not.toThrow();
  });

  it('rejects invalid x', () => {
   expect(() => assertVector2(NaN, 0)).toThrow(/x must be finite/);
   expect(() => assertVector2(Infinity, 0)).toThrow(/x must be finite/);
  });

  it('rejects invalid y', () => {
   expect(() => assertVector2(0, NaN)).toThrow(/y must be finite/);
   expect(() => assertVector2(0, -Infinity)).toThrow(/y must be finite/);
  });

  it('includes vector name in error', () => {
   expect(() => assertVector2(NaN, 0, 'velocity')).toThrow(/velocity\.x/);
   expect(() => assertVector2(0, NaN, 'position')).toThrow(/position\.y/);
  });
 });

 describe('assertMatrix2', () => {
  it('accepts valid elements', () => {
   expect(() => assertMatrix2(1, 0, 0, 1)).not.toThrow();
   expect(() => assertMatrix2(0, 0, 0, 0)).not.toThrow();
  });

  it('rejects invalid elements', () => {
   expect(() => assertMatrix2(NaN, 0, 0, 1)).toThrow(/\[0,0\] must be finite/);
   expect(() => assertMatrix2(1, NaN, 0, 1)).toThrow(/\[0,1\] must be finite/);
   expect(() => assertMatrix2(1, 0, NaN, 1)).toThrow(/\[1,0\] must be finite/);
   expect(() => assertMatrix2(1, 0, 0, NaN)).toThrow(/\[1,1\] must be finite/);
  });

  it('includes matrix name in error', () => {
   expect(() => assertMatrix2(NaN, 0, 0, 1, 'transform')).toThrow(/transform\[0,0\]/);
  });
 });

 describe('assertRotation2', () => {
  it('accepts valid components', () => {
   expect(() => assertRotation2(1, 0)).not.toThrow();
   expect(() => assertRotation2(0, 1)).not.toThrow();
   expect(() => assertRotation2(0.707, 0.707)).not.toThrow();
  });

  it('rejects invalid cos', () => {
   expect(() => assertRotation2(NaN, 0)).toThrow(/cos must be finite/);
  });

  it('rejects invalid sin', () => {
   expect(() => assertRotation2(1, NaN)).toThrow(/sin must be finite/);
  });

  it('includes rotation name in error', () => {
   expect(() => assertRotation2(NaN, 0, 'rot')).toThrow(/rot\.cos/);
  });
 });

 describe('assertSafeInteger', () => {
  it('accepts safe integers', () => {
   expect(() => assertSafeInteger(0)).not.toThrow();
   expect(() => assertSafeInteger(42)).not.toThrow();
   expect(() => assertSafeInteger(-1000)).not.toThrow();
   expect(() => assertSafeInteger(Number.MAX_SAFE_INTEGER)).not.toThrow();
   expect(() => assertSafeInteger(Number.MIN_SAFE_INTEGER)).not.toThrow();
  });

  it('rejects non-integers', () => {
   expect(() => assertSafeInteger(1.5)).toThrow(/must be a safe integer/);
   expect(() => assertSafeInteger(0.1)).toThrow();
  });

  it('rejects unsafe integers', () => {
   expect(() => assertSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toThrow();
   expect(() => assertSafeInteger(Number.MIN_SAFE_INTEGER - 1)).toThrow();
  });

  it('rejects NaN and Infinity', () => {
   expect(() => assertSafeInteger(NaN)).toThrow();
   expect(() => assertSafeInteger(Infinity)).toThrow();
  });
 });

 describe('Performance', () => {
  it('has negligible overhead when disabled', () => {
   setAssertionsEnabled(false);
   const iterations = 100000;
   const start = performance.now();

   for (let index = 0; index < iterations; index++) {
    assertFinite(index);
    assertNonZero(index + 1);
    assertRange(0.5, 0, 1);
    assertVector2(index, index);
   }

   const elapsed = performance.now() - start;
   // Allow 100ms to account for system load variability
   expect(elapsed).toBeLessThan(100);
  });
 });

 describe('Coverage - Default Names', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('assertMatrix2 uses default name when not provided', () => {
   expect(() => assertMatrix2(NaN, 0, 0, 0)).toThrow('matrix');
  });

  it('assertRotation2 uses default prefix when not provided', () => {
   expect(() => assertRotation2(NaN, 0)).toThrow('cos');
  });

  it('assertSafeInteger uses default name when not provided', () => {
   expect(() => assertSafeInteger(1.5)).toThrow('value');
  });
 });
});
