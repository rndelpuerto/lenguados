import { describe, expect, it } from '@jest/globals';

import { Vector2, type ReadonlyVector2 } from '../../src/core/vector2';
import { isVector2Like } from '../../src/types';

const DIGITS = 10; // toBeCloseTo decimal digits

function expectVecClose(v: ReadonlyVector2, x: number, y: number, digits = DIGITS) {
 expect(v.x).toBeCloseTo(x, digits);
 expect(v.y).toBeCloseTo(y, digits);
}

describe('Vector2', () => {
 describe('Static Constants', () => {
  it('ZERO, ONE and unit axes are correct', () => {
   expectVecClose(Vector2.ZERO, 0, 0);
   expectVecClose(Vector2.ONE, 1, 1);
   expectVecClose(Vector2.UNIT_X, 1, 0);
   expectVecClose(Vector2.UNIT_Y, 0, 1);
  });

  it('Negative unit axes', () => {
   expectVecClose(Vector2.NEGATIVE_UNIT_X, -1, 0);
   expectVecClose(Vector2.NEGATIVE_UNIT_Y, 0, -1);
  });

  it('Diagonal units', () => {
   expectVecClose(Vector2.UNIT_DIAGONAL, Math.SQRT1_2, Math.SQRT1_2);
  });

  it('Infinity constants', () => {
   expect(Vector2.POSITIVE_INFINITY.x).toBe(Number.POSITIVE_INFINITY);
   expect(Vector2.NEGATIVE_INFINITY.y).toBe(Number.NEGATIVE_INFINITY);
  });
 });

 describe('Constructors & Factories', () => {
  it('default constructor creates zero vector', () => {
   const v = new Vector2();
   expectVecClose(v, 0, 0);
  });

  it('constructor with values', () => {
   const v = new Vector2(3, 4);
   expectVecClose(v, 3, 4);
  });

  it('fromValues', () => {
   expectVecClose(Vector2.fromValues(1, 2), 1, 2);
  });

  it('fromArray', () => {
   expectVecClose(Vector2.fromArray([7, 8]), 7, 8);
   expectVecClose(Vector2.fromArray([0, 1, 2], 1), 1, 2);
   expect(() => Vector2.fromArray([1], 1)).toThrow(RangeError);
  });

  it('fromObject', () => {
   expectVecClose(Vector2.fromObject({ x: 3, y: 4 }), 3, 4);
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   expectVecClose(Vector2.fromObject({ x: 'a', y: 2 } as any), 0, 2);
  });

  it('fromAngle', () => {
   const v0 = Vector2.fromAngle(0);
   expectVecClose(v0, 1, 0);
   const v90 = Vector2.fromAngle(Math.PI / 2, 2);
   expectVecClose(v90, 0, 2);
  });

  it('clone and copy', () => {
   const original = new Vector2(1, 2);
   const clone = original.clone();
   expectVecClose(clone, 1, 2);
   expect(clone).not.toBe(original);

   const target = new Vector2();
   const returned = target.copy(original);
   expectVecClose(target, 1, 2);
   expect(returned).toBe(target);
  });
 });

 describe('Arithmetic Operations', () => {
  it('add mutates instance and static variant remains pure', () => {
   const a = new Vector2(3, 4);
   const b = new Vector2(1, 2);
   const result = a.add(b);
   expect(result).toBe(a);
   expectVecClose(a, 4, 6);
   const staticSum = Vector2.add(new Vector2(3, 4), b);
   expectVecClose(staticSum, 4, 6);
  });

  it('subtract', () => {
   const a = new Vector2(3, 4);
   const b = new Vector2(1, 2);
   a.subtract(b);
   expectVecClose(a, 2, 2);
   expectVecClose(Vector2.subtract(new Vector2(3, 4), b), 2, 2);
  });

  it('scale (multiply by scalar)', () => {
   const a = new Vector2(3, 4);
   a.scale(2);
   expectVecClose(a, 6, 8);
   expectVecClose(Vector2.scale(new Vector2(3, 4), 2), 6, 8);
  });

  it('divide scalar', () => {
   const a = new Vector2(3, 4);
   a.divideScalar(2);
   expectVecClose(a, 1.5, 2);
   expectVecClose(Vector2.divideScalar(new Vector2(3, 4), 2), 1.5, 2);
  });

  it('divide scalar safe returns zero when divisor is near zero', () => {
   const a = new Vector2(3, 4);
   a.divideScalarSafe(0);
   expectVecClose(a, 0, 0);
  });

  it('multiply and divide (component-wise)', () => {
   const a = new Vector2(3, 4);
   const b = new Vector2(1, 2);
   a.multiply(b);
   expectVecClose(a, 3, 8);
   expectVecClose(Vector2.multiply(new Vector2(3, 4), b), 3, 8);
   a.divide(b);
   expectVecClose(a, 3, 4);
   expectVecClose(Vector2.divide(new Vector2(3, 4), b), 3, 2);
  });

  it('negate updates instance and static variant allocates', () => {
   const a = new Vector2(3, 4);
   a.negate();
   expectVecClose(a, -3, -4);
   expectVecClose(Vector2.negate(new Vector2(3, 4)), -3, -4);
  });
 });

 describe('Geometric Methods', () => {
  it('length and lengthSquared', () => {
   const v = new Vector2(3, 4);
   expect(v.length()).toBeCloseTo(5);
   expect(v.lengthSquared()).toBe(25);
  });

  it('manhattanLength', () => {
   const v = new Vector2(3, 4);
   expect(v.manhattanLength()).toBe(7);
  });

  it('normalize', () => {
   const v = new Vector2(3, 4);
   const returned = v.normalize();
   expect(returned).toBe(v);
   expectVecClose(v, 0.6, 0.8);
   expect(v.length()).toBeCloseTo(1);
   expect(() => new Vector2(0, 0).normalize()).toThrow(RangeError);
   expectVecClose(new Vector2(0, 0).normalizeSafe(), 0, 0);
  });

  it('distanceTo and distanceSquaredTo', () => {
   const a = new Vector2(1, 2);
   const b = new Vector2(4, 6); // diff is (3, 4)

   expect(a.distanceTo(b)).toBeCloseTo(5);
   expect(a.distanceSquaredTo(b)).toBe(25);

   expect(Vector2.distance(a, b)).toBeCloseTo(5);
   expect(Vector2.distanceSquared(a, b)).toBe(25);
  });

  it('dot product', () => {
   const a = new Vector2(1, 0);
   const b = new Vector2(0, 1);
   expect(a.dot(b)).toBe(0);

   const c = new Vector2(2, 2);
   expect(c.dot(c)).toBe(8);
  });

  it('cross product', () => {
   const a = new Vector2(1, 0);
   const b = new Vector2(0, 1);
   expect(a.cross(b)).toBe(1);
   expect(b.cross(a)).toBe(-1);
  });

  it('angle', () => {
   const v = new Vector2(1, 1);
   expect(v.angle()).toBeCloseTo(Math.PI / 4);
  });

  it('rotate mutates and static rotate allocates', () => {
   const v = new Vector2(1, 0);
   v.rotate(Math.PI / 2);
   expectVecClose(v, 0, 1);
   expectVecClose(Vector2.rotate(new Vector2(1, 0), Math.PI / 2), 0, 1);
  });
 });

 describe('Interpolation', () => {
  it('lerp mutates and static lerp allocates', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(10, 20);
   const returned = a.lerp(b, 0.5);
   expect(returned).toBe(a);
   expectVecClose(a, 5, 10);
   expectVecClose(Vector2.lerp(new Vector2(0, 0), b, 0.5), 5, 10);
  });

  it('slerp keeps unit length', () => {
   const a = new Vector2(1, 0);
   const b = new Vector2(0, 1);
   a.slerp(b, 0.5);
   expectVecClose(a, Math.SQRT1_2, Math.SQRT1_2);
   expect(a.length()).toBeCloseTo(1);
  });
 });

 describe('Constraints & Components', () => {
  it('min/max/clamp mutate instance', () => {
   const v = new Vector2(5, -5);
   v.clamp(new Vector2(0, 0), new Vector2(10, 10));
   expectVecClose(v, 5, 0);

   const a = new Vector2(1, 10);
   const b = new Vector2(10, 1);
   a.min(b);
   expectVecClose(a, 1, 1);
   b.max(new Vector2(1, 10));
   expectVecClose(b, 10, 10);
  });

  it('abs/sign mutate components', () => {
   const v = new Vector2(-5, 5);
   v.abs();
   expectVecClose(v, 5, 5);
   v.sign();
   expectVecClose(v, 1, 1);
  });

  it('clampLength scales vector', () => {
   const v = new Vector2(10, 0);
   v.clampLength(0, 5);
   expectVecClose(v, 5, 0);
   v.set(10, 0).clampLength(12, 20);
   expectVecClose(v, 12, 0);
  });
 });

 describe('Comparison', () => {
  it('equals and nearEquals', () => {
   const a = new Vector2(1, 2);
   const b = new Vector2(1, 2);
   // Use a value strictly within EPSILON (1e-10)
   // 1e-11 is safe.
   const c = new Vector2(1 + 1e-11, 2);

   expect(a.equals(b)).toBe(true);
   expect(a.equals(c)).toBe(false);
   expect(a.nearEquals(c)).toBe(true);
  });

  it('isZero', () => {
   expect(Vector2.ZERO.isZero()).toBe(true);
   expect(new Vector2(1e-15, 0).isZero(1e-14)).toBe(true);
   expect(new Vector2(0.1, 0).isZero()).toBe(false);
  });
 });

 describe('Utilities', () => {
  it('isVector2Like', () => {
   expect(isVector2Like({ x: 1, y: 2 })).toBe(true);
   expect(isVector2Like({ x: 1 })).toBe(false);
  });

  it('toArray/toObject/toString', () => {
   const v = new Vector2(1, 2);
   expect(v.toArray()).toEqual([1, 2]);
   expect(v.toObject()).toEqual({ x: 1, y: 2 });
   expect(v.toString()).toBe('Vector2(1, 2)');
  });
 });
});
