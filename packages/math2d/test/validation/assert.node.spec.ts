/**
 * @file test/validation/assert.node.spec.ts
 * @module @lenguados/math2d/validation
 * @description Tests for the assertion system.
 */

import { performance } from 'node:perf_hooks';

import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';

import {
 assert,
 assertComplex,
 assertComplexLike,
 assertFinite,
 assertInterval,
 assertIntervalLike,
 assertMatrix2,
 assertMatrix2Like,
 assertMatrix3,
 assertMatrix3Like,
 assertNonNegative,
 assertNonZero,
 assertPositive,
 assertRange,
 assertRotation2,
 assertRotation2Like,
 assertSafeInteger,
 assertTransform2,
 assertTransform2Like,
 assertVector2,
 assertVector2Like,
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
   // Allow 200ms to account for system load variability
   expect(elapsed).toBeLessThan(200);
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

 describe('Coverage - assertMatrix3', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('passes for valid Matrix3 values', () => {
   expect(() => assertMatrix3(1, 0, 0, 0, 1, 0, 0, 0, 1)).not.toThrow();
  });

  it('throws for NaN in m00', () => {
   expect(() => assertMatrix3(NaN, 0, 0, 0, 1, 0, 0, 0, 1)).toThrow('[0,0]');
  });

  it('throws for NaN in m01', () => {
   expect(() => assertMatrix3(1, NaN, 0, 0, 1, 0, 0, 0, 1)).toThrow('[0,1]');
  });

  it('throws for NaN in m02', () => {
   expect(() => assertMatrix3(1, 0, NaN, 0, 1, 0, 0, 0, 1)).toThrow('[0,2]');
  });

  it('throws for NaN in m10', () => {
   expect(() => assertMatrix3(1, 0, 0, NaN, 1, 0, 0, 0, 1)).toThrow('[1,0]');
  });

  it('throws for NaN in m11', () => {
   expect(() => assertMatrix3(1, 0, 0, 0, NaN, 0, 0, 0, 1)).toThrow('[1,1]');
  });

  it('throws for NaN in m12', () => {
   expect(() => assertMatrix3(1, 0, 0, 0, 1, NaN, 0, 0, 1)).toThrow('[1,2]');
  });

  it('throws for NaN in m20', () => {
   expect(() => assertMatrix3(1, 0, 0, 0, 1, 0, NaN, 0, 1)).toThrow('[2,0]');
  });

  it('throws for NaN in m21', () => {
   expect(() => assertMatrix3(1, 0, 0, 0, 1, 0, 0, NaN, 1)).toThrow('[2,1]');
  });

  it('throws for NaN in m22', () => {
   expect(() => assertMatrix3(1, 0, 0, 0, 1, 0, 0, 0, NaN)).toThrow('[2,2]');
  });

  it('uses custom name in error', () => {
   expect(() => assertMatrix3(NaN, 0, 0, 0, 1, 0, 0, 0, 1, 'myMatrix')).toThrow('myMatrix');
  });
 });

 describe('Coverage - assertMatrix2 all branches', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('throws for NaN in m01', () => {
   expect(() => assertMatrix2(1, NaN, 0, 1)).toThrow('[0,1]');
  });

  it('throws for NaN in m10', () => {
   expect(() => assertMatrix2(1, 0, NaN, 1)).toThrow('[1,0]');
  });

  it('throws for NaN in m11', () => {
   expect(() => assertMatrix2(1, 0, 0, NaN)).toThrow('[1,1]');
  });
 });

 describe('assertVector2Like', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid Vector2Like object', () => {
   expect(() => assertVector2Like({ x: 1, y: 2 })).not.toThrow();
   expect(() => assertVector2Like({ x: 0, y: 0 })).not.toThrow();
   expect(() => assertVector2Like({ x: -100, y: 100 })).not.toThrow();
  });

  it('throws for null', () => {
   expect(() => assertVector2Like(null)).toThrow();
  });

  it('throws for non-object', () => {
   expect(() => assertVector2Like('string' as unknown)).toThrow();
   expect(() => assertVector2Like(123 as unknown)).toThrow();
  });

  it('throws for missing x', () => {
   expect(() => assertVector2Like({ y: 2 } as unknown)).toThrow();
  });

  it('throws for missing y', () => {
   expect(() => assertVector2Like({ x: 1 } as unknown)).toThrow();
  });

  it('throws for non-numeric x', () => {
   expect(() => assertVector2Like({ x: 'bad', y: 2 } as unknown)).toThrow();
  });

  it('uses custom name in error', () => {
   expect(() => assertVector2Like(null, 'myVec')).toThrow('myVec');
  });
 });

 describe('assertMatrix2Like', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid Matrix2Like object', () => {
   expect(() => assertMatrix2Like({ m00: 1, m01: 0, m10: 0, m11: 1 })).not.toThrow();
  });

  it('throws for null', () => {
   expect(() => assertMatrix2Like(null)).toThrow();
  });

  it('throws for missing elements', () => {
   expect(() => assertMatrix2Like({ m00: 1, m01: 0, m10: 0 } as unknown)).toThrow();
  });

  it('throws for non-numeric elements', () => {
   expect(() => assertMatrix2Like({ m00: 'bad', m01: 0, m10: 0, m11: 1 } as unknown)).toThrow();
  });

  it('uses custom name in error', () => {
   expect(() => assertMatrix2Like(null, 'myMatrix')).toThrow('myMatrix');
  });
 });

 describe('assertComplexLike', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid ComplexLike object', () => {
   expect(() => assertComplexLike({ real: 1, imag: 2 })).not.toThrow();
   expect(() => assertComplexLike({ real: 0, imag: 0 })).not.toThrow();
  });

  it('throws for null', () => {
   expect(() => assertComplexLike(null)).toThrow();
  });

  it('throws for missing real', () => {
   expect(() => assertComplexLike({ imag: 2 } as unknown)).toThrow();
  });

  it('throws for missing imag', () => {
   expect(() => assertComplexLike({ real: 1 } as unknown)).toThrow();
  });

  it('uses custom name in error', () => {
   expect(() => assertComplexLike(null, 'myComplex')).toThrow('myComplex');
  });
 });

 describe('assertIntervalLike', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid IntervalLike object', () => {
   expect(() => assertIntervalLike({ min: 0, max: 10 })).not.toThrow();
  });

  it('throws for null', () => {
   expect(() => assertIntervalLike(null)).toThrow();
  });

  it('throws for missing min', () => {
   expect(() => assertIntervalLike({ max: 10 } as unknown)).toThrow();
  });

  it('throws for missing max', () => {
   expect(() => assertIntervalLike({ min: 0 } as unknown)).toThrow();
  });

  it('uses custom name in error', () => {
   expect(() => assertIntervalLike(null, 'myInterval')).toThrow('myInterval');
  });
 });

 describe('assertTransform2Like', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid Transform2Like object', () => {
   expect(() =>
    assertTransform2Like({
     position: { x: 0, y: 0 },
     rotation: { cos: 1, sin: 0 },
     scale: { x: 1, y: 1 },
    }),
   ).not.toThrow();
  });

  it('throws for null', () => {
   expect(() => assertTransform2Like(null)).toThrow();
  });

  it('throws for invalid position', () => {
   expect(() =>
    assertTransform2Like({
     position: null,
     rotation: 0,
     scale: { x: 1, y: 1 },
    } as unknown),
   ).toThrow();
  });

  it('throws for invalid rotation', () => {
   expect(() =>
    assertTransform2Like({
     position: { x: 0, y: 0 },
     rotation: 'bad',
     scale: { x: 1, y: 1 },
    } as unknown),
   ).toThrow();
  });

  it('throws for invalid scale', () => {
   expect(() =>
    assertTransform2Like({
     position: { x: 0, y: 0 },
     rotation: 0,
     scale: null,
    } as unknown),
   ).toThrow();
  });

  it('uses custom name in error', () => {
   expect(() => assertTransform2Like(null, 'myTransform')).toThrow('myTransform');
  });
 });

 describe('assertComplex', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid components', () => {
   expect(() => assertComplex(0, 0)).not.toThrow();
   expect(() => assertComplex(1, -1)).not.toThrow();
   expect(() => assertComplex(-1e10, 1e10)).not.toThrow();
  });

  it('rejects invalid real', () => {
   expect(() => assertComplex(NaN, 0)).toThrow(/real must be finite/);
   expect(() => assertComplex(Infinity, 0)).toThrow(/real must be finite/);
  });

  it('rejects invalid imag', () => {
   expect(() => assertComplex(0, NaN)).toThrow(/imag must be finite/);
   expect(() => assertComplex(0, -Infinity)).toThrow(/imag must be finite/);
  });

  it('includes name in error', () => {
   expect(() => assertComplex(NaN, 0, 'z')).toThrow(/z\.real/);
   expect(() => assertComplex(0, NaN, 'z')).toThrow(/z\.imag/);
  });

  it('uses default prefix when no name provided', () => {
   expect(() => assertComplex(NaN, 0)).toThrow(/real must be finite/);
  });
 });

 describe('assertInterval', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid interval', () => {
   expect(() => assertInterval(0, 10)).not.toThrow();
   expect(() => assertInterval(-5, 5)).not.toThrow();
   expect(() => assertInterval(3, 3)).not.toThrow(); // degenerate but valid
  });

  it('rejects non-finite min', () => {
   expect(() => assertInterval(NaN, 10)).toThrow(/min must be finite/);
   expect(() => assertInterval(Infinity, 10)).toThrow(/min must be finite/);
  });

  it('rejects non-finite max', () => {
   expect(() => assertInterval(0, NaN)).toThrow(/max must be finite/);
   expect(() => assertInterval(0, -Infinity)).toThrow(/max must be finite/);
  });

  it('rejects min > max', () => {
   expect(() => assertInterval(10, 5)).toThrow(/must not exceed/);
  });

  it('includes name in error', () => {
   expect(() => assertInterval(NaN, 10, 'bounds')).toThrow(/bounds\.min/);
   expect(() => assertInterval(0, NaN, 'bounds')).toThrow(/bounds\.max/);
   expect(() => assertInterval(10, 5, 'bounds')).toThrow(/bounds\.min/);
  });

  it('uses default name when not provided', () => {
   expect(() => assertInterval(NaN, 10)).toThrow(/interval/);
  });
 });

 describe('assertTransform2', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid components', () => {
   expect(() => assertTransform2(0, 0, 1, 0, 1, 1)).not.toThrow();
   expect(() => assertTransform2(100, -50, 0.707, 0.707, 2, 2)).not.toThrow();
  });

  it('rejects non-finite px', () => {
   expect(() => assertTransform2(NaN, 0, 1, 0, 1, 1)).toThrow(/position\.x must be finite/);
  });

  it('rejects non-finite py', () => {
   expect(() => assertTransform2(0, Infinity, 1, 0, 1, 1)).toThrow(/position\.y must be finite/);
  });

  it('rejects non-finite cos', () => {
   expect(() => assertTransform2(0, 0, NaN, 0, 1, 1)).toThrow(/rotation\.cos must be finite/);
  });

  it('rejects non-finite sin', () => {
   expect(() => assertTransform2(0, 0, 1, NaN, 1, 1)).toThrow(/rotation\.sin must be finite/);
  });

  it('rejects non-finite sx', () => {
   expect(() => assertTransform2(0, 0, 1, 0, Infinity, 1)).toThrow(/scale\.x must be finite/);
  });

  it('rejects non-finite sy', () => {
   expect(() => assertTransform2(0, 0, 1, 0, 1, -Infinity)).toThrow(/scale\.y must be finite/);
  });

  it('includes name in error', () => {
   expect(() => assertTransform2(NaN, 0, 1, 0, 1, 1, 'xf')).toThrow(/xf\.position\.x/);
   expect(() => assertTransform2(0, 0, 1, 0, 1, NaN, 'xf')).toThrow(/xf\.scale\.y/);
  });

  it('uses default prefix when no name provided', () => {
   expect(() => assertTransform2(NaN, 0, 1, 0, 1, 1)).toThrow(/position\.x must be finite/);
  });
 });

 describe('assertMatrix3Like', () => {
  beforeEach(() => {
   setAssertionsEnabled(true);
  });

  it('accepts valid Matrix3Like object', () => {
   expect(() =>
    assertMatrix3Like({
     m00: 1,
     m01: 0,
     m02: 0,
     m10: 0,
     m11: 1,
     m12: 0,
     m20: 0,
     m21: 0,
     m22: 1,
    }),
   ).not.toThrow();
  });

  it('throws for null', () => {
   expect(() => assertMatrix3Like(null)).toThrow();
  });

  it('throws for non-object', () => {
   expect(() => assertMatrix3Like('string' as unknown)).toThrow();
   expect(() => assertMatrix3Like(123 as unknown)).toThrow();
  });

  it('throws for missing properties', () => {
   expect(() => assertMatrix3Like({ m00: 1, m01: 0, m02: 0 } as unknown)).toThrow();
  });

  it('throws for non-numeric properties', () => {
   expect(() =>
    assertMatrix3Like({
     m00: 'bad',
     m01: 0,
     m02: 0,
     m10: 0,
     m11: 1,
     m12: 0,
     m20: 0,
     m21: 0,
     m22: 1,
    } as unknown),
   ).toThrow();
  });

  it('uses custom name in error', () => {
   expect(() => assertMatrix3Like(null, 'myMat3')).toThrow('myMat3');
  });
 });

 describe('assertXLike error messages include type information', () => {
  it('assertVector2Like includes type name on structural failure', () => {
   expect(() => assertVector2Like('bad')).toThrow(/Vector2Like/);
   expect(() => assertVector2Like('bad')).toThrow(TypeError);
  });

  it('assertMatrix2Like includes type name on structural failure', () => {
   expect(() => assertMatrix2Like(42)).toThrow(/Matrix2Like/);
   expect(() => assertMatrix2Like(42)).toThrow(TypeError);
  });

  it('assertComplexLike includes type name on structural failure', () => {
   expect(() => assertComplexLike(null)).toThrow(/ComplexLike/);
   expect(() => assertComplexLike(null)).toThrow(TypeError);
  });

  it('assertRotation2Like includes type name on structural failure', () => {
   expect(() => assertRotation2Like(undefined)).toThrow(/Rotation2Like/);
   expect(() => assertRotation2Like(undefined)).toThrow(TypeError);
  });

  it('assertIntervalLike includes type name on structural failure', () => {
   expect(() => assertIntervalLike([])).toThrow(/IntervalLike/);
   expect(() => assertIntervalLike([])).toThrow(TypeError);
  });

  it('assertTransform2Like includes type name on structural failure', () => {
   expect(() => assertTransform2Like(null)).toThrow(/Transform2Like/);
   expect(() => assertTransform2Like(null)).toThrow(TypeError);
  });

  it('assertMatrix3Like includes type name on structural failure', () => {
   expect(() => assertMatrix3Like('abc')).toThrow(/Matrix3Like/);
   expect(() => assertMatrix3Like('abc')).toThrow(TypeError);
  });
 });

 describe('Safe variant suggestions in error messages', () => {
  it('assertFinite suggests ensureFinite()', () => {
   expect(() => assertFinite(NaN)).toThrow(/ensureFinite\(\)/);
  });

  it('assertNonZero suggests divideSafe()', () => {
   expect(() => assertNonZero(0)).toThrow(/divideSafe\(\)/);
  });

  it('assertPositive suggests clamp() or saturate()', () => {
   expect(() => assertPositive(-1)).toThrow(/clamp\(\)|saturate\(\)/);
  });

  it('assertNonNegative suggests clamp() or saturate()', () => {
   expect(() => assertNonNegative(-1)).toThrow(/clamp\(\)|saturate\(\)/);
  });

  it('assertRange includes range and value', () => {
   expect(() => assertRange(5, 0, 1)).toThrow(/\[0, 1\].*got 5/);
  });
 });
});
