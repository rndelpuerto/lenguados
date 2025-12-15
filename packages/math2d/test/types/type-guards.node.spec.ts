/**
 * @file test/types/type-guards.node.spec.ts
 * @description Tests for type guards in types/index.ts
 */

import { describe, expect, test } from '@jest/globals';

import {
 isComplexLike,
 isIntervalLike,
 isMatrix2Like,
 isMatrix3Like,
 isRotation2Like,
 isTransform2Like,
 isVector2Like,
} from '../../src/types';

describe('Type Guards', () => {
 describe('isVector2Like', () => {
  test('returns true for valid Vector2Like objects', () => {
   expect(isVector2Like({ x: 1, y: 2 })).toBe(true);
   expect(isVector2Like({ x: 0, y: 0 })).toBe(true);
   expect(isVector2Like({ x: -1.5, y: 3.14 })).toBe(true);
   expect(isVector2Like({ x: Infinity, y: -Infinity })).toBe(true);
   expect(isVector2Like({ x: NaN, y: NaN })).toBe(true);
  });

  test('returns true for objects with extra properties', () => {
   expect(isVector2Like({ x: 1, y: 2, z: 3 })).toBe(true);
   expect(isVector2Like({ x: 1, y: 2, name: 'point' })).toBe(true);
  });

  test('returns false for null and undefined', () => {
   expect(isVector2Like(null)).toBe(false);
   expect(isVector2Like(undefined)).toBe(false);
  });

  test('returns false for primitives', () => {
   expect(isVector2Like(42)).toBe(false);
   expect(isVector2Like('string')).toBe(false);
   expect(isVector2Like(true)).toBe(false);
  });

  test('returns false for objects missing properties', () => {
   expect(isVector2Like({ x: 1 })).toBe(false);
   expect(isVector2Like({ y: 2 })).toBe(false);
   expect(isVector2Like({})).toBe(false);
  });

  test('returns false for objects with wrong property types', () => {
   expect(isVector2Like({ x: '1', y: 2 })).toBe(false);
   expect(isVector2Like({ x: 1, y: '2' })).toBe(false);
   expect(isVector2Like({ x: null, y: 2 })).toBe(false);
  });

  test('returns false for arrays', () => {
   expect(isVector2Like([1, 2])).toBe(false);
  });
 });

 describe('isMatrix2Like', () => {
  test('returns true for valid Matrix2Like objects', () => {
   expect(isMatrix2Like({ m00: 1, m01: 0, m10: 0, m11: 1 })).toBe(true);
   expect(isMatrix2Like({ m00: 0, m01: 0, m10: 0, m11: 0 })).toBe(true);
  });

  test('returns false for null and undefined', () => {
   expect(isMatrix2Like(null)).toBe(false);
   expect(isMatrix2Like(undefined)).toBe(false);
  });

  test('returns false for objects missing properties', () => {
   expect(isMatrix2Like({ m00: 1, m01: 0, m10: 0 })).toBe(false);
   expect(isMatrix2Like({ m00: 1 })).toBe(false);
   expect(isMatrix2Like({})).toBe(false);
  });

  test('returns false for objects with wrong property types', () => {
   expect(isMatrix2Like({ m00: '1', m01: 0, m10: 0, m11: 1 })).toBe(false);
  });
 });

 describe('isMatrix3Like', () => {
  test('returns true for valid Matrix3Like objects', () => {
   const identity = {
    m00: 1,
    m01: 0,
    m02: 0,
    m10: 0,
    m11: 1,
    m12: 0,
    m20: 0,
    m21: 0,
    m22: 1,
   };
   expect(isMatrix3Like(identity)).toBe(true);
  });

  test('returns false for null and undefined', () => {
   expect(isMatrix3Like(null)).toBe(false);
   expect(isMatrix3Like(undefined)).toBe(false);
  });

  test('returns false for objects missing properties', () => {
   expect(isMatrix3Like({ m00: 1, m01: 0, m02: 0 })).toBe(false);
   expect(isMatrix3Like({})).toBe(false);
  });

  test('returns false for objects with wrong property types', () => {
   const withString = {
    m00: '1',
    m01: 0,
    m02: 0,
    m10: 0,
    m11: 1,
    m12: 0,
    m20: 0,
    m21: 0,
    m22: 1,
   };
   expect(isMatrix3Like(withString)).toBe(false);
  });
 });

 describe('isRotation2Like', () => {
  test('returns true for valid Rotation2Like objects', () => {
   expect(isRotation2Like({ cos: 1, sin: 0 })).toBe(true);
   expect(isRotation2Like({ cos: 0, sin: 1 })).toBe(true);
   expect(isRotation2Like({ cos: Math.SQRT1_2, sin: Math.SQRT1_2 })).toBe(true);
  });

  test('returns false for null and undefined', () => {
   expect(isRotation2Like(null)).toBe(false);
   expect(isRotation2Like(undefined)).toBe(false);
  });

  test('returns false for objects missing properties', () => {
   expect(isRotation2Like({ cos: 1 })).toBe(false);
   expect(isRotation2Like({ sin: 1 })).toBe(false);
   expect(isRotation2Like({})).toBe(false);
  });

  test('returns false for objects with wrong property types', () => {
   expect(isRotation2Like({ cos: '1', sin: 0 })).toBe(false);
   expect(isRotation2Like({ cos: 1, sin: null })).toBe(false);
  });
 });

 describe('isComplexLike', () => {
  test('returns true for valid ComplexLike objects', () => {
   expect(isComplexLike({ real: 1, imag: 2 })).toBe(true);
   expect(isComplexLike({ real: 0, imag: 0 })).toBe(true);
   expect(isComplexLike({ real: -1, imag: -1 })).toBe(true);
  });

  test('returns false for null and undefined', () => {
   expect(isComplexLike(null)).toBe(false);
   expect(isComplexLike(undefined)).toBe(false);
  });

  test('returns false for objects missing properties', () => {
   expect(isComplexLike({ real: 1 })).toBe(false);
   expect(isComplexLike({ imag: 2 })).toBe(false);
   expect(isComplexLike({})).toBe(false);
  });

  test('returns false for objects with wrong property types', () => {
   expect(isComplexLike({ real: '1', imag: 2 })).toBe(false);
  });
 });

 describe('isIntervalLike', () => {
  test('returns true for valid IntervalLike objects', () => {
   expect(isIntervalLike({ min: 0, max: 10 })).toBe(true);
   expect(isIntervalLike({ min: -5, max: 5 })).toBe(true);
   expect(isIntervalLike({ min: 0, max: 0 })).toBe(true);
  });

  test('returns false for null and undefined', () => {
   expect(isIntervalLike(null)).toBe(false);
   expect(isIntervalLike(undefined)).toBe(false);
  });

  test('returns false for objects missing properties', () => {
   expect(isIntervalLike({ min: 0 })).toBe(false);
   expect(isIntervalLike({ max: 10 })).toBe(false);
   expect(isIntervalLike({})).toBe(false);
  });

  test('returns false for objects with wrong property types', () => {
   expect(isIntervalLike({ min: '0', max: 10 })).toBe(false);
  });
 });

 describe('isTransform2Like', () => {
  test('returns true for valid Transform2Like objects', () => {
   expect(
    isTransform2Like({
     position: { x: 0, y: 0 },
     rotation: 0,
     scale: { x: 1, y: 1 },
    }),
   ).toBe(true);

   expect(
    isTransform2Like({
     position: { x: 100, y: 50 },
     rotation: Math.PI / 4,
     scale: { x: 2, y: 2 },
    }),
   ).toBe(true);
  });

  test('returns false for null and undefined', () => {
   expect(isTransform2Like(null)).toBe(false);
   expect(isTransform2Like(undefined)).toBe(false);
  });

  test('returns false for objects missing properties', () => {
   expect(isTransform2Like({ position: { x: 0, y: 0 } })).toBe(false);
   expect(isTransform2Like({ rotation: 0 })).toBe(false);
   expect(isTransform2Like({})).toBe(false);
  });

  test('returns false when nested properties are invalid', () => {
   expect(
    isTransform2Like({
     position: { x: 0 }, // missing y
     rotation: 0,
     scale: { x: 1, y: 1 },
    }),
   ).toBe(false);

   expect(
    isTransform2Like({
     position: { x: 0, y: 0 },
     rotation: '0', // wrong type
     scale: { x: 1, y: 1 },
    }),
   ).toBe(false);

   expect(
    isTransform2Like({
     position: { x: 0, y: 0 },
     rotation: 0,
     scale: null, // not Vector2Like
    }),
   ).toBe(false);
  });
 });
});
