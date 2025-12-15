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
   // Invalid values throw in development mode (assertions enabled)
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   expect(() => Vector2.fromObject({ x: 'a', y: 2 } as any)).toThrow(/must be finite/);
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

   expect(a.exactEquals(b)).toBe(true);
   expect(a.exactEquals(c)).toBe(false);
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
   expect(v.toString()).toBe('Vector2(1.0000, 2.0000)');
   expect(v.toString(2)).toBe('Vector2(1.00, 2.00)');
  });
 });

 describe('Perpendicular Operations', () => {
  it('perpendicular returns CCW rotation by default', () => {
   const v = new Vector2(1, 0);
   expectVecClose(v.clone().perpendicular(), 0, 1);
   expectVecClose(Vector2.perpendicular(v), 0, 1);
  });

  it('perpendicular(true) returns CW rotation', () => {
   const v = new Vector2(1, 0);
   expectVecClose(v.clone().perpendicular(true), 0, -1);
   expectVecClose(Vector2.perpendicular(v, true), 0, -1);
  });
 });

 describe('Projection and Reflection', () => {
  it('project onto another vector', () => {
   const v = new Vector2(3, 4);
   const axis = new Vector2(1, 0);
   const projected = Vector2.project(v, axis);
   expectVecClose(projected, 3, 0);
  });

  it('projectOnUnit with unit vector', () => {
   const v = new Vector2(3, 4);
   const unitAxis = new Vector2(1, 0);
   const projected = Vector2.projectOnUnit(v, unitAxis);
   expectVecClose(projected, 3, 0);
  });

  it('reflect across normal', () => {
   const v = new Vector2(1, -1);
   const normal = new Vector2(0, 1);
   const reflected = Vector2.reflect(v, normal);
   expectVecClose(reflected, 1, 1);
  });
 });

 describe('Length and Heading Setters', () => {
  it('setLength scales vector to target length', () => {
   const v = new Vector2(3, 4); // length = 5
   const result = Vector2.setLength(v, 10);
   expect(result.length()).toBeCloseTo(10);
   expectVecClose(result, 6, 8);
  });

  it('setHeading rotates vector to target angle', () => {
   const v = new Vector2(5, 0); // angle = 0
   const result = Vector2.setHeading(v, Math.PI / 2);
   expectVecClose(result, 0, 5);
  });
 });

 describe('Rotation Around Point', () => {
  it('rotateAround rotates around given center', () => {
   const v = new Vector2(2, 0);
   const center = new Vector2(1, 0);
   const rotated = Vector2.rotateAround(v, center, Math.PI);
   expectVecClose(rotated, 0, 0);
  });
 });

 describe('Rounding Operations', () => {
  it('round rounds components', () => {
   const v = new Vector2(1.6, 2.3);
   v.round();
   expectVecClose(v, 2, 2);
  });

  it('floor floors components', () => {
   const v = new Vector2(1.9, 2.9);
   v.floor();
   expectVecClose(v, 1, 2);
  });

  it('ceil ceils components', () => {
   const v = new Vector2(1.1, 2.1);
   v.ceil();
   expectVecClose(v, 2, 3);
  });

  it('static round/floor/ceil', () => {
   expectVecClose(Vector2.round(new Vector2(1.6, 2.3)), 2, 2);
   expectVecClose(Vector2.floor(new Vector2(1.9, 2.9)), 1, 2);
   expectVecClose(Vector2.ceil(new Vector2(1.1, 2.1)), 2, 3);
  });
 });

 describe('Scalar Operations', () => {
  it('addScalar adds to both components', () => {
   const v = new Vector2(1, 2);
   v.addScalar(5);
   expectVecClose(v, 6, 7);
  });

  it('subtractScalar subtracts from both components', () => {
   const v = new Vector2(10, 20);
   v.subtractScalar(5);
   expectVecClose(v, 5, 15);
  });
 });

 describe('Component Operations', () => {
  it('setX and setY update individual components', () => {
   const v = new Vector2(1, 2);
   v.setX(10);
   expectVecClose(v, 10, 2);
   v.setY(20);
   expectVecClose(v, 10, 20);
  });

  it('swap swaps x and y', () => {
   const v = new Vector2(3, 4);
   v.swap();
   expectVecClose(v, 4, 3);
  });

  it('sumComponents returns sum of x and y', () => {
   const v = new Vector2(3, 4);
   expect(v.sumComponents()).toBe(7);
  });
 });

 describe('Angle Operations', () => {
  it('angleTo returns angle to another vector', () => {
   const a = new Vector2(1, 0);
   const b = new Vector2(0, 1);
   expect(a.angleTo(b)).toBeCloseTo(Math.PI / 2);
  });
 });

 describe('State Queries', () => {
  it('isParallel checks parallelism', () => {
   expect(Vector2.isParallel(new Vector2(1, 0), new Vector2(2, 0))).toBe(true);
   expect(Vector2.isParallel(new Vector2(1, 0), new Vector2(0, 1))).toBe(false);
   expect(Vector2.isParallel(new Vector2(1, 1), new Vector2(-2, -2))).toBe(true);
  });
 });

 describe('Stepping', () => {
  it('step returns 0 or 1 based on edge', () => {
   const edge = new Vector2(5, 5);
   const v = new Vector2(3, 7);
   const stepped = Vector2.step(edge, v);
   expectVecClose(stepped, 0, 1);
  });
 });

 describe('Unchecked Variants (Hot Path)', () => {
  it('normalizeUnchecked normalizes without validation', () => {
   const v = new Vector2(3, 4);
   v.normalizeUnchecked();
   expectVecClose(v, 0.6, 0.8);
   expect(v.length()).toBeCloseTo(1);
  });

  it('divideScalarUnchecked divides without validation', () => {
   const v = new Vector2(10, 20);
   v.divideScalarUnchecked(2);
   expectVecClose(v, 5, 10);
  });
 });

 describe('lerpClamped', () => {
  it('clamps t to [0, 1]', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(10, 10);
   expectVecClose(Vector2.lerpClamped(a, b, -1), 0, 0);
   expectVecClose(Vector2.lerpClamped(a, b, 2), 10, 10);
   expectVecClose(Vector2.lerpClamped(a, b, 0.5), 5, 5);
  });
 });

 describe('reject', () => {
  it('rejects projection from vector', () => {
   const v = new Vector2(3, 4);
   const axis = new Vector2(1, 0);
   const rejected = Vector2.reject(v, axis);
   expectVecClose(rejected, 0, 4);
  });
 });

 describe('Static Methods', () => {
  it('mod computes component-wise modulo', () => {
   const result = Vector2.mod(new Vector2(7, 11), new Vector2(3, 4));
   expect(result.x).toBe(1); // 7 % 3
   expect(result.y).toBe(3); // 11 % 4
  });

  it('fma computes fused multiply-add', () => {
   // a * scale + b
   const result = Vector2.fma(new Vector2(2, 3), 4, new Vector2(1, 1));
   expectVecClose(result, 9, 13); // (2*4+1, 3*4+1)
  });

  it('inverse computes 1/component', () => {
   const result = Vector2.inverse(new Vector2(2, 4));
   expectVecClose(result, 0.5, 0.25);
  });

  it('swap exchanges x and y', () => {
   const result = Vector2.swap(new Vector2(3, 7));
   expectVecClose(result, 7, 3);
  });

  it('limit clamps length to max', () => {
   const v = new Vector2(6, 8); // length = 10
   const limited = Vector2.limit(v, 5);
   expect(limited.length()).toBeCloseTo(5, DIGITS);
   // Direction preserved
   expect(limited.x / limited.y).toBeCloseTo(6 / 8, DIGITS);
  });

  it('limit does not affect short vectors', () => {
   const v = new Vector2(1, 0);
   const limited = Vector2.limit(v, 5);
   expectVecClose(limited, 1, 0);
  });

  it('midpoint returns center of two vectors', () => {
   const mid = Vector2.midpoint(new Vector2(0, 0), new Vector2(10, 20));
   expectVecClose(mid, 5, 10);
  });

  it('direction returns unit vector from a to b', () => {
   const dir = Vector2.direction(new Vector2(0, 0), new Vector2(3, 4));
   expect(dir.length()).toBeCloseTo(1, DIGITS);
   expectVecClose(dir, 0.6, 0.8);
  });

  it('abs returns absolute values', () => {
   const result = Vector2.abs(new Vector2(-3, -4));
   expectVecClose(result, 3, 4);
  });

  it('sign returns sign of components', () => {
   const result = Vector2.sign(new Vector2(-5, 3));
   expectVecClose(result, -1, 1);
  });

  it('clamp restricts to min/max bounds', () => {
   const result = Vector2.clamp(new Vector2(-5, 15), new Vector2(0, 0), new Vector2(10, 10));
   expectVecClose(result, 0, 10);
  });

  it('min returns component-wise minimum', () => {
   const result = Vector2.min(new Vector2(3, 10), new Vector2(7, 2));
   expectVecClose(result, 3, 2);
  });

  it('max returns component-wise maximum', () => {
   const result = Vector2.max(new Vector2(3, 10), new Vector2(7, 2));
   expectVecClose(result, 7, 10);
  });

  it('clone creates copy', () => {
   const original = new Vector2(1, 2);
   const cloned = Vector2.clone(original);
   expectVecClose(cloned, 1, 2);
   expect(cloned).not.toBe(original);
  });

  it('copy copies to destination', () => {
   const source = new Vector2(5, 6);
   const dst = new Vector2(0, 0);
   Vector2.copy(source, dst);
   expectVecClose(dst, 5, 6);
  });

  it('equals checks equality', () => {
   expect(Vector2.exactEquals(new Vector2(1, 2), new Vector2(1, 2))).toBe(true);
   expect(Vector2.exactEquals(new Vector2(1, 2), new Vector2(1, 3))).toBe(false);
  });

  it('length computes vector length', () => {
   expect(Vector2.length(new Vector2(3, 4))).toBeCloseTo(5, DIGITS);
  });

  it('distance computes distance between vectors', () => {
   expect(Vector2.distance(new Vector2(0, 0), new Vector2(3, 4))).toBeCloseTo(5, DIGITS);
  });

  it('normalize creates unit vector', () => {
   const n = Vector2.normalize(new Vector2(3, 4));
   expect(n.length()).toBeCloseTo(1, DIGITS);
  });

  it('slerp spherically interpolates', () => {
   const a = new Vector2(1, 0);
   const b = new Vector2(0, 1);
   const mid = Vector2.slerp(a, b, 0.5);
   expect(mid.length()).toBeCloseTo(1, DIGITS);
   expect(mid.angle()).toBeCloseTo(Math.PI / 4, 5);
  });

  it('angleTo computes angle to another vector', () => {
   const angle = Vector2.angleTo(new Vector2(1, 0), new Vector2(0, 1));
   expect(angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('angleBetween computes absolute angle', () => {
   const angle = Vector2.angleBetween(new Vector2(1, 0), new Vector2(-1, 0));
   expect(angle).toBeCloseTo(Math.PI, DIGITS);
  });

  it('manhattanLength computes L1 norm', () => {
   expect(Vector2.manhattanLength(new Vector2(3, 4))).toBe(7);
  });

  it('manhattanDistance computes L1 distance', () => {
   expect(Vector2.manhattanDistance(new Vector2(0, 0), new Vector2(3, 4))).toBe(7);
  });

  it('distanceSquared computes squared distance', () => {
   expect(Vector2.distanceSquared(new Vector2(0, 0), new Vector2(3, 4))).toBe(25);
  });

  it('cross3 computes 3D cross product z', () => {
   expect(Vector2.cross3(new Vector2(1, 0), new Vector2(0, 1), new Vector2(0, 0))).toBe(1);
  });

  it('addScaledVector adds scaled vector', () => {
   const result = Vector2.addScaledVector(new Vector2(1, 1), new Vector2(2, 3), 2);
   expectVecClose(result, 5, 7); // (1 + 2*2, 1 + 3*2)
  });

  it('modScalar computes modulo with scalar', () => {
   const result = Vector2.modScalar(new Vector2(7, 11), 3);
   expect(result.x).toBe(1); // 7 % 3
   expect(result.y).toBe(2); // 11 % 3
  });

  it('addScalar adds scalar to components', () => {
   const result = Vector2.addScalar(new Vector2(1, 2), 5);
   expectVecClose(result, 6, 7);
  });

  it('subtractScalar subtracts scalar', () => {
   const result = Vector2.subtractScalar(new Vector2(10, 20), 5);
   expectVecClose(result, 5, 15);
  });

  it('divideScalar divides by scalar', () => {
   const result = Vector2.divideScalar(new Vector2(10, 20), 2);
   expectVecClose(result, 5, 10);
  });

  it('sumComponents sums x and y', () => {
   expect(Vector2.sumComponents(new Vector2(3, 4))).toBe(7);
  });

  it('lengthSquared computes squared length', () => {
   expect(Vector2.lengthSquared(new Vector2(3, 4))).toBe(25);
  });

  it('fromAngle creates vector from angle', () => {
   const v = Vector2.fromAngle(Math.PI / 2);
   expectVecClose(v, 0, 1);
  });

  it('fromAngle with radius', () => {
   const v = Vector2.fromAngle(0, 5);
   expectVecClose(v, 5, 0);
  });

  it('fromValues creates vector', () => {
   const v = Vector2.fromValues(3, 4);
   expectVecClose(v, 3, 4);
  });

  it('fromObject creates from object', () => {
   const v = Vector2.fromObject({ x: 5, y: 6 });
   expectVecClose(v, 5, 6);
  });

  it('fromArray creates from array', () => {
   const v = Vector2.fromArray([1, 2, 3, 4], 1);
   expectVecClose(v, 2, 3);
  });

  it('inverseSafe handles zero', () => {
   const result = Vector2.inverseSafe(new Vector2(0, 2));
   expect(result.x).toBe(0);
   expect(result.y).toBe(0.5);
  });

  it('normalizeSafe handles zero', () => {
   const result = Vector2.normalizeSafe(new Vector2(0, 0));
   expectVecClose(result, 0, 0);
  });

  it('setLength sets to specific length', () => {
   const result = Vector2.setLength(new Vector2(3, 4), 10);
   expect(result.length()).toBeCloseTo(10, DIGITS);
  });

  it('setLengthSafe handles zero vector', () => {
   // Zero vector gets set to (newLength, 0)
   const result = Vector2.setLengthSafe(new Vector2(0, 0), 5);
   expectVecClose(result, 5, 0);
  });

  it('setHeading rotates to angle', () => {
   const result = Vector2.setHeading(new Vector2(5, 0), Math.PI / 2);
   expect(result.angle()).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('projectOnUnit projects onto unit vector', () => {
   const result = Vector2.projectOnUnit(new Vector2(3, 4), new Vector2(1, 0));
   expectVecClose(result, 3, 0);
  });

  it('reflectSafe handles zero normal', () => {
   const result = Vector2.reflectSafe(new Vector2(1, 1), new Vector2(0, 0));
   expectVecClose(result, 1, 1);
  });

  it('unitPerpendicular returns normalized perpendicular', () => {
   const result = Vector2.unitPerpendicular(new Vector2(3, 4));
   expect(result.length()).toBeCloseTo(1, DIGITS);
  });

  it('unitPerpendicularSafe handles zero', () => {
   const result = Vector2.unitPerpendicularSafe(new Vector2(0, 0));
   expectVecClose(result, 0, 0);
  });

  it('rotateCS rotates by cos/sin', () => {
   const result = Vector2.rotateCS(new Vector2(1, 0), 0, 1);
   expectVecClose(result, 0, 1);
  });

  it('clampScalar clamps by scalar bounds', () => {
   const result = Vector2.clampScalar(new Vector2(-5, 15), 0, 10);
   expectVecClose(result, 0, 10);
  });

  it('clampLength clamps vector length', () => {
   const result = Vector2.clampLength(new Vector2(6, 8), 1, 5);
   expect(result.length()).toBeCloseTo(5, DIGITS);
  });

  it('step returns 0 or 1 per component', () => {
   const result = Vector2.step(new Vector2(5, 5), new Vector2(3, 7));
   expectVecClose(result, 0, 1);
  });
 });

 describe('Instance Methods - Additional', () => {
  it('zero sets to origin', () => {
   const v = new Vector2(5, 10);
   v.zero();
   expectVecClose(v, 0, 0);
  });

  it('inverse inverts components', () => {
   const v = new Vector2(2, 4);
   v.inverse();
   expectVecClose(v, 0.5, 0.25);
  });

  it('swap exchanges x and y', () => {
   const v = new Vector2(3, 7);
   v.swap();
   expectVecClose(v, 7, 3);
  });

  it('limit clamps length', () => {
   const v = new Vector2(6, 8);
   v.limit(5);
   expect(v.length()).toBeCloseTo(5, DIGITS);
  });

  it('fma fused multiply-add', () => {
   const v = new Vector2(2, 3);
   v.fma(2, new Vector2(1, 1));
   expectVecClose(v, 5, 7); // 2*2 + 1, 3*2 + 1
  });

  it('mod modulo operation', () => {
   const v = new Vector2(7, 11);
   v.mod(new Vector2(3, 4));
   expect(v.x).toBe(1);
   expect(v.y).toBe(3);
  });

  it('project projects onto axis', () => {
   const v = new Vector2(3, 4);
   v.project(new Vector2(1, 0));
   expectVecClose(v, 3, 0);
  });

  it('reject removes projection', () => {
   const v = new Vector2(3, 4);
   v.reject(new Vector2(1, 0));
   expectVecClose(v, 0, 4);
  });

  it('lerp interpolates', () => {
   const v = new Vector2(0, 0);
   v.lerp(new Vector2(10, 20), 0.5);
   expectVecClose(v, 5, 10);
  });

  it('slerp spherically interpolates', () => {
   const v = new Vector2(1, 0);
   v.slerp(new Vector2(0, 1), 0.5);
   expect(v.length()).toBeCloseTo(1, DIGITS);
  });

  it('toArray returns [x, y]', () => {
   const v = new Vector2(3, 4);
   expect(v.toArray()).toEqual([3, 4]);
  });

  it('toObject returns {x, y}', () => {
   const v = new Vector2(3, 4);
   expect(v.toObject()).toEqual({ x: 3, y: 4 });
  });

  it('toString returns formatted string', () => {
   const v = new Vector2(3, 4);
   expect(v.toString()).toContain('Vector2');
  });

  it('midpoint computes center', () => {
   const v = new Vector2(0, 0);
   v.midpoint(new Vector2(10, 20));
   expectVecClose(v, 5, 10);
  });

  it('clone creates copy', () => {
   const v = new Vector2(3, 4);
   const c = v.clone();
   expectVecClose(c, 3, 4);
   expect(c).not.toBe(v);
  });

  it('copy copies from source', () => {
   const v = new Vector2(0, 0);
   v.copy(new Vector2(5, 6));
   expectVecClose(v, 5, 6);
  });

  it('set updates values', () => {
   const v = new Vector2(0, 0);
   v.set(7, 8);
   expectVecClose(v, 7, 8);
  });

  it('add adds vector', () => {
   const v = new Vector2(1, 2);
   v.add(new Vector2(3, 4));
   expectVecClose(v, 4, 6);
  });

  it('subtract subtracts vector', () => {
   const v = new Vector2(5, 7);
   v.subtract(new Vector2(2, 3));
   expectVecClose(v, 3, 4);
  });

  it('multiply multiplies componentwise', () => {
   const v = new Vector2(2, 3);
   v.multiply(new Vector2(4, 5));
   expectVecClose(v, 8, 15);
  });

  it('divide divides componentwise', () => {
   const v = new Vector2(10, 20);
   v.divide(new Vector2(2, 4));
   expectVecClose(v, 5, 5);
  });

  it('negate negates', () => {
   const v = new Vector2(3, -4);
   v.negate();
   expectVecClose(v, -3, 4);
  });

  it('normalize normalizes', () => {
   const v = new Vector2(3, 4);
   v.normalize();
   expect(v.length()).toBeCloseTo(1, DIGITS);
  });

  it('scale scales by scalar', () => {
   const v = new Vector2(2, 3);
   v.scale(3);
   expectVecClose(v, 6, 9);
  });

  it('clamp clamps to bounds', () => {
   const v = new Vector2(-5, 15);
   v.clamp(new Vector2(0, 0), new Vector2(10, 10));
   expectVecClose(v, 0, 10);
  });

  it('min takes componentwise min', () => {
   const v = new Vector2(5, 10);
   v.min(new Vector2(3, 15));
   expectVecClose(v, 3, 10);
  });

  it('max takes componentwise max', () => {
   const v = new Vector2(5, 10);
   v.max(new Vector2(3, 15));
   expectVecClose(v, 5, 15);
  });

  it('abs takes absolute value', () => {
   const v = new Vector2(-3, -4);
   v.abs();
   expectVecClose(v, 3, 4);
  });

  it('sign takes sign of components', () => {
   const v = new Vector2(-5, 3);
   v.sign();
   expectVecClose(v, -1, 1);
  });

  it('floor floors components', () => {
   const v = new Vector2(1.7, 2.3);
   v.floor();
   expectVecClose(v, 1, 2);
  });

  it('ceil ceils components', () => {
   const v = new Vector2(1.1, 2.9);
   v.ceil();
   expectVecClose(v, 2, 3);
  });

  it('round rounds components', () => {
   const v = new Vector2(1.4, 2.6);
   v.round();
   expectVecClose(v, 1, 3);
  });

  it('reflect reflects around normal', () => {
   const v = new Vector2(1, -1);
   v.reflect(new Vector2(0, 1));
   expectVecClose(v, 1, 1);
  });

  it('perpendicular rotates 90 degrees', () => {
   const v = new Vector2(1, 0);
   v.perpendicular();
   expectVecClose(v, 0, 1);
  });

  it('rotate rotates by angle', () => {
   const v = new Vector2(1, 0);
   v.rotate(Math.PI / 2);
   expectVecClose(v, 0, 1);
  });

  it('equals checks equality', () => {
   const v = new Vector2(3, 4);
   expect(v.exactEquals(new Vector2(3, 4))).toBe(true);
   expect(v.exactEquals(new Vector2(3, 5))).toBe(false);
  });

  it('dot computes dot product', () => {
   const v = new Vector2(1, 2);
   expect(v.dot(new Vector2(3, 4))).toBe(11);
  });

  it('cross computes cross product', () => {
   const v = new Vector2(1, 0);
   expect(v.cross(new Vector2(0, 1))).toBe(1);
  });

  it('length computes length', () => {
   const v = new Vector2(3, 4);
   expect(v.length()).toBeCloseTo(5, DIGITS);
  });

  it('angle computes angle', () => {
   const v = new Vector2(1, 1);
   expect(v.angle()).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('lengthSquared returns squared length', () => {
   const v = new Vector2(3, 4);
   expect(v.lengthSquared()).toBe(25);
  });

  it('manhattanLength returns manhattan distance', () => {
   const v = new Vector2(3, 4);
   expect(v.manhattanLength()).toBe(7);
  });
 });

 describe('Static Methods - Edge Cases', () => {
  it('normalizeSafe handles near-zero gracefully', () => {
   const result = Vector2.normalizeSafe(new Vector2(0, 0));
   expectVecClose(result, 0, 0);
  });

  it('distance computes distance', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(3, 4);
   expect(Vector2.distance(a, b)).toBeCloseTo(5, DIGITS);
  });

  it('distanceSquared computes squared distance', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(3, 4);
   expect(Vector2.distanceSquared(a, b)).toBe(25);
  });

  it('manhattanDistance computes manhattan distance', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(3, 4);
   expect(Vector2.manhattanDistance(a, b)).toBe(7);
  });

  it('direction computes unit direction', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(3, 0);
   const dir = Vector2.direction(a, b);
   expectVecClose(dir, 1, 0);
  });

  it('lerpClamped clamps t', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(10, 10);
   expectVecClose(Vector2.lerpClamped(a, b, -1), 0, 0);
   expectVecClose(Vector2.lerpClamped(a, b, 2), 10, 10);
  });

  it('addScaledVector adds scaled vector', () => {
   const result = Vector2.addScaledVector(new Vector2(1, 1), new Vector2(2, 3), 2);
   expectVecClose(result, 5, 7);
  });

  it('midpoint computes midpoint', () => {
   const result = Vector2.midpoint(new Vector2(0, 0), new Vector2(10, 20));
   expectVecClose(result, 5, 10);
  });

  it('isZero checks for zero vector', () => {
   expect(Vector2.isZero(new Vector2(0, 0))).toBe(true);
   expect(Vector2.isZero(new Vector2(0.001, 0))).toBe(false);
  });

  it('isParallel checks parallelism', () => {
   expect(Vector2.isParallel(new Vector2(1, 0), new Vector2(2, 0))).toBe(true);
   expect(Vector2.isParallel(new Vector2(1, 0), new Vector2(0, 1))).toBe(false);
  });

  it('angle computes angle', () => {
   expect(Vector2.angle(new Vector2(1, 1))).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('angleTo computes angle to another vector', () => {
   expect(Vector2.angleTo(new Vector2(1, 0), new Vector2(0, 1))).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('angleBetween computes unsigned angle', () => {
   expect(Vector2.angleBetween(new Vector2(1, 0), new Vector2(-1, 0))).toBeCloseTo(Math.PI, DIGITS);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Transform Integration
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Transform Integration', () => {
  it('applyRotation applies rotation object', () => {
   const v = new Vector2(1, 0);
   const rotation = { cos: 0, sin: 1 }; // 90° CCW
   const result = Vector2.applyRotation(v, rotation);
   expectVecClose(result, 0, 1);
  });

  it('applyMatrix2 applies 2x2 matrix', () => {
   const v = new Vector2(1, 0);
   const matrix = { m00: 0, m01: 1, m10: -1, m11: 0 }; // 90° rotation
   const result = Vector2.applyMatrix2(v, matrix);
   expectVecClose(result, 0, 1);
  });

  it('applyMatrix2 scales correctly', () => {
   const v = new Vector2(1, 1);
   const matrix = { m00: 2, m01: 0, m10: 0, m11: 3 }; // scale x*2, y*3
   const result = Vector2.applyMatrix2(v, matrix);
   expectVecClose(result, 2, 3);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Physics Operations
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Physics Operations', () => {
  it('angularToLinearVelocity converts angular to linear', () => {
   const omega = Math.PI; // 180°/s
   const r = new Vector2(1, 0); // 1 unit from center
   const v = Vector2.angularToLinearVelocity(omega, r);
   expectVecClose(v, 0, Math.PI);
  });

  it('angularToLinearVelocity handles negative omega', () => {
   const omega = -Math.PI;
   const r = new Vector2(1, 0);
   const v = Vector2.angularToLinearVelocity(omega, r);
   expectVecClose(v, 0, -Math.PI);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Component Limiting and Clamping
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Component Limiting and Clamping', () => {
  it('limit caps magnitude', () => {
   const v = new Vector2(3, 4); // length 5
   v.limit(3);
   expect(v.length()).toBeCloseTo(3, DIGITS);
  });

  it('limit does not change vector under limit', () => {
   const v = new Vector2(1, 1);
   v.limit(10);
   expectVecClose(v, 1, 1);
  });

  it('min takes component-wise minimum', () => {
   const v = new Vector2(5, 2);
   v.min(new Vector2(3, 4));
   expectVecClose(v, 3, 2);
  });

  it('max takes component-wise maximum', () => {
   const v = new Vector2(5, 2);
   v.max(new Vector2(3, 4));
   expectVecClose(v, 5, 4);
  });

  it('abs takes absolute values', () => {
   const v = new Vector2(-3, -4);
   v.abs();
   expectVecClose(v, 3, 4);
  });

  it('sign returns component signs', () => {
   const v = new Vector2(-3, 4);
   v.sign();
   expectVecClose(v, -1, 1);
  });

  it('sign handles zero', () => {
   const v = new Vector2(0, 0);
   v.sign();
   expectVecClose(v, 0, 0);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Safe Division
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Safe Division', () => {
  it('divideScalarSafe handles zero divisor', () => {
   const v = new Vector2(10, 20);
   v.divideScalarSafe(0);
   expectVecClose(v, 0, 0);
  });

  it('divideScalarSafe handles normal division', () => {
   const v = new Vector2(10, 20);
   v.divideScalarSafe(2);
   expectVecClose(v, 5, 10);
  });

  it('divideScalarUnchecked divides without checks', () => {
   const v = new Vector2(10, 20);
   v.divideScalarUnchecked(2);
   expectVecClose(v, 5, 10);
  });

  it('divide component-wise', () => {
   const v = new Vector2(10, 20);
   v.divide(new Vector2(2, 4));
   expectVecClose(v, 5, 5);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Static reflect/perpendicular edge cases
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Reflect and Perpendicular Edge Cases', () => {
  it('reflectSafe normalizes non-unit normal', () => {
   const v = new Vector2(1, 1);
   const normal = new Vector2(0, 2); // non-unit
   const result = Vector2.reflectSafe(v, normal);
   expectVecClose(result, 1, -1);
  });

  it('unitPerpendicular returns unit length', () => {
   const v = new Vector2(3, 4); // length 5
   const perp = Vector2.unitPerpendicular(v);
   expect(perp.length()).toBeCloseTo(1, DIGITS);
  });

  it('unitPerpendicular clockwise', () => {
   const v = new Vector2(1, 0);
   const perp = Vector2.unitPerpendicular(v, true);
   expectVecClose(perp, 0, -1);
  });

  it('unitPerpendicularSafe handles zero vector', () => {
   const perp = Vector2.unitPerpendicularSafe(new Vector2(0, 0));
   expectVecClose(perp, 0, 0);
  });

  it('rotate by PI/2', () => {
   const v = new Vector2(1, 0);
   const result = Vector2.rotate(v, Math.PI / 2);
   expectVecClose(result, 0, 1);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Floor/Ceil/Round Operations
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Floor/Ceil/Round Operations', () => {
  it('floor rounds down', () => {
   const v = new Vector2(1.9, 2.1);
   v.floor();
   expectVecClose(v, 1, 2);
  });

  it('ceil rounds up', () => {
   const v = new Vector2(1.1, 2.9);
   v.ceil();
   expectVecClose(v, 2, 3);
  });

  it('round rounds to nearest', () => {
   const v = new Vector2(1.4, 2.6);
   v.round();
   expectVecClose(v, 1, 3);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Additional Static Methods
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Additional Static Methods', () => {
  it('clamp clamps vector components', () => {
   const v = new Vector2(5, -5);
   const result = Vector2.clamp(v, new Vector2(0, 0), new Vector2(2, 2));
   expectVecClose(result, 2, 0);
  });

  it('step returns 0 or 1 per component', () => {
   const edge = new Vector2(5, 5);
   const v = new Vector2(3, 7);
   const result = Vector2.step(edge, v);
   expectVecClose(result, 0, 1);
  });

  it('applyTransform applies full transform', () => {
   const v = new Vector2(1, 0);
   const transform = {
    position: { x: 10, y: 5 },
    rotation: 0,
    scale: { x: 2, y: 2 },
   };
   const result = Vector2.applyTransform(v, transform);
   expectVecClose(result, 12, 5); // (1*2, 0*2) + (10, 5)
  });

  it('applyTransform with rotation', () => {
   const v = new Vector2(1, 0);
   const transform = {
    position: { x: 0, y: 0 },
    rotation: Math.PI / 2, // 90° CCW
    scale: { x: 1, y: 1 },
   };
   const result = Vector2.applyTransform(v, transform);
   expectVecClose(result, 0, 1);
  });

  it('fromComplex creates vector from complex', () => {
   const complex = { real: 3, imag: 4 };
   const v = Vector2.fromComplex(complex);
   expectVecClose(v, 3, 4);
  });

  it('nearZero checks near-zero components', () => {
   // EPSILON is 1e-10, so 1e-11 should be near-zero
   expect(Vector2.nearZero(new Vector2(1e-11, 0))).toBe(true);
   expect(Vector2.nearZero(new Vector2(1, 0))).toBe(false);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Instance Methods - Lerp & Smooth
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Instance Lerp Methods', () => {
  it('lerp interpolates towards target', () => {
   const v = new Vector2(0, 0);
   v.lerp(new Vector2(10, 10), 0.5);
   expectVecClose(v, 5, 5);
  });

  it('slerp spherically interpolates', () => {
   const v = new Vector2(1, 0);
   v.slerp(new Vector2(0, 1), 0.5);
   const expected = Math.SQRT1_2;
   expectVecClose(v, expected, expected);
  });

  it('slerp handles parallel vectors', () => {
   const v = new Vector2(1, 0);
   v.slerp(new Vector2(2, 0), 0.5);
   expect(v.length()).toBeCloseTo(1.5, DIGITS);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Instance Transform Methods
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Instance Transform Methods', () => {
  it('applyRotation transforms by rotation', () => {
   const v = new Vector2(1, 0);
   v.applyRotation({ cos: 0, sin: 1 }); // 90° CCW
   expectVecClose(v, 0, 1);
  });

  it('applyMatrix2 transforms by matrix', () => {
   const v = new Vector2(1, 1);
   v.applyMatrix2({ m00: 2, m01: 0, m10: 0, m11: 3 });
   expectVecClose(v, 2, 3);
  });

  it('applyTransform applies full transform', () => {
   const v = new Vector2(1, 0);
   v.applyTransform({
    position: { x: 5, y: 3 },
    rotation: 0,
    scale: { x: 2, y: 2 },
   });
   expectVecClose(v, 7, 3);
  });

  it('rotateAround rotates around pivot', () => {
   const v = new Vector2(2, 0);
   v.rotateAround(new Vector2(1, 0), Math.PI); // 180°
   expectVecClose(v, 0, 0);
  });
 });

 // ═══════════════════════════════════════════════════════════════════════════
 // Setters and Copy
 // ═══════════════════════════════════════════════════════════════════════════

 describe('Setters and Copy', () => {
  it('setX sets x component', () => {
   const v = new Vector2(1, 2);
   v.setX(5);
   expectVecClose(v, 5, 2);
  });

  it('setY sets y component', () => {
   const v = new Vector2(1, 2);
   v.setY(5);
   expectVecClose(v, 1, 5);
  });

  it('copy copies from another vector', () => {
   const v = new Vector2(1, 2);
   v.copy(new Vector2(5, 6));
   expectVecClose(v, 5, 6);
  });

  it('setLength sets magnitude', () => {
   const v = new Vector2(3, 4); // length 5
   v.setLength(10);
   expect(v.length()).toBeCloseTo(10, DIGITS);
  });

  it('setLengthSafe handles zero vector', () => {
   const v = new Vector2(0, 0);
   v.setLengthSafe(10);
   // Zero vectors become (newLength, 0) per docs
   expectVecClose(v, 10, 0);
  });
 });

 describe('Static Transform Operations', () => {
  it('rotateAroundCS rotates around a center point', () => {
   const v = new Vector2(2, 0);
   const center = new Vector2(1, 0);
   // 90 degrees: cos=0, sin=1
   const result = Vector2.rotateAroundCS(v, center, 0, 1);
   expectVecClose(result, 1, 1);
  });

  it('midpoint returns center between two points', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(4, 6);
   const mid = Vector2.midpoint(a, b);
   expectVecClose(mid, 2, 3);
  });

  it('crossSV computes scalar × vector cross', () => {
   const v = new Vector2(1, 0);
   const result = Vector2.crossSV(2, v);
   expectVecClose(result, 0, 2);
  });

  it('crossVS computes vector × scalar cross', () => {
   const v = new Vector2(0, 1);
   const result = Vector2.crossVS(v, 2);
   expectVecClose(result, 2, 0);
  });

  it('angularToLinearVelocity converts angular to linear', () => {
   const r = new Vector2(1, 0);
   const result = Vector2.angularToLinearVelocity(Math.PI, r);
   expectVecClose(result, 0, Math.PI);
  });
 });

 describe('Static Transform Integration', () => {
  it('applyRotation rotates by Rotation2-like', () => {
   const v = new Vector2(1, 0);
   const rot = { cos: 0, sin: 1 }; // 90 degrees
   const result = Vector2.applyRotation(v, rot);
   expectVecClose(result, 0, 1);
  });

  it('applyMatrix2 transforms by Matrix2-like', () => {
   const v = new Vector2(1, 0);
   const matrix = { m00: 2, m01: 0, m10: 0, m11: 3 }; // scale (2, 3)
   const result = Vector2.applyMatrix2(v, matrix);
   expectVecClose(result, 2, 0);
  });

  it('applyTransform applies full transform', () => {
   const v = new Vector2(1, 0);
   const transform = {
    position: { x: 10, y: 20 },
    rotation: 0,
    scale: { x: 2, y: 2 },
   };
   const result = Vector2.applyTransform(v, transform);
   expectVecClose(result, 12, 20);
  });
 });

 describe('Instance Component Operations', () => {
  it('limit clamps length to maximum', () => {
   const v = new Vector2(6, 8); // length 10
   v.limit(5);
   expect(v.length()).toBeCloseTo(5, DIGITS);
  });

  it('limit does not affect vectors under max', () => {
   const v = new Vector2(3, 4); // length 5
   v.limit(10);
   expect(v.length()).toBeCloseTo(5, DIGITS);
  });

  it('min takes component-wise minimum', () => {
   const v = new Vector2(5, 2);
   v.min(new Vector2(3, 4));
   expectVecClose(v, 3, 2);
  });

  it('max takes component-wise maximum', () => {
   const v = new Vector2(1, 6);
   v.max(new Vector2(3, 4));
   expectVecClose(v, 3, 6);
  });

  it('abs makes components positive', () => {
   const v = new Vector2(-3, -4);
   v.abs();
   expectVecClose(v, 3, 4);
  });

  it('sign returns component signs', () => {
   const v = new Vector2(-5, 3);
   v.sign();
   expectVecClose(v, -1, 1);
  });

  it('floor floors components', () => {
   const v = new Vector2(2.7, -1.3);
   v.floor();
   expectVecClose(v, 2, -2);
  });

  it('ceil ceils components', () => {
   const v = new Vector2(2.1, -1.9);
   v.ceil();
   expectVecClose(v, 3, -1);
  });

  it('round rounds components', () => {
   const v = new Vector2(2.4, 2.6);
   v.round();
   expectVecClose(v, 2, 3);
  });

  it('mod applies component-wise modulo', () => {
   const v = new Vector2(5.5, 7.2);
   v.mod(new Vector2(3, 3));
   expectVecClose(v, 2.5, 1.2);
  });
 });

 describe('Comparison and Query', () => {
  it('isZero returns true for zero vector', () => {
   expect(new Vector2(0, 0).isZero()).toBe(true);
   expect(new Vector2(0.001, 0).isZero()).toBe(false);
  });

  it('isUnit returns true for unit vectors', () => {
   expect(new Vector2(1, 0).isUnit()).toBe(true);
   expect(new Vector2(0, 1).isUnit()).toBe(true);
   expect(new Vector2(2, 0).isUnit()).toBe(false);
  });

  it('isFinite returns true for finite vectors', () => {
   expect(new Vector2(1, 2).isFinite()).toBe(true);
   expect(new Vector2(Infinity, 1).isFinite()).toBe(false);
   expect(new Vector2(1, NaN).isFinite()).toBe(false);
  });

  it('manhattanLength returns sum of absolute components', () => {
   const v = new Vector2(-3, 4);
   expect(v.manhattanLength()).toBe(7);
  });

  it('angle returns angle from positive X axis', () => {
   expect(new Vector2(1, 0).angle()).toBeCloseTo(0, DIGITS);
   expect(new Vector2(0, 1).angle()).toBeCloseTo(Math.PI / 2, DIGITS);
   expect(new Vector2(-1, 0).angle()).toBeCloseTo(Math.PI, DIGITS);
  });
 });

 describe('Conversion Methods', () => {
  it('toArray returns [x, y]', () => {
   const array = new Vector2(3, 4).toArray();
   expect(array).toEqual([3, 4]);
  });

  it('toObject returns { x, y }', () => {
   const object = new Vector2(3, 4).toObject();
   expect(object).toEqual({ x: 3, y: 4 });
  });

  it('toString returns formatted string', () => {
   const string_ = new Vector2(1.5, 2.5).toString();
   expect(string_).toContain('1.5');
   expect(string_).toContain('2.5');
  });
 });

 describe('Edge Cases', () => {
  it('normalize handles near-zero vectors safely', () => {
   const v = new Vector2(1e-15, 0);
   v.normalizeSafe();
   expect(v.isFinite()).toBe(true);
  });

  it('project handles parallel vectors', () => {
   const v = new Vector2(3, 0);
   const onto = new Vector2(1, 0);
   const projected = Vector2.project(v, onto);
   expectVecClose(projected, 3, 0);
  });

  it('project handles perpendicular vectors', () => {
   const v = new Vector2(0, 3);
   const onto = new Vector2(1, 0);
   const projected = Vector2.project(v, onto);
   expectVecClose(projected, 0, 0);
  });

  it('reflect works correctly', () => {
   const v = new Vector2(1, -1);
   const normal = new Vector2(0, 1);
   const reflected = Vector2.reflect(v, normal);
   expectVecClose(reflected, 1, 1);
  });
 });

 describe('Angular Velocity', () => {
  it('angularToLinearVelocity computes tangential velocity', () => {
   const omega = 1;
   const r = { x: 1, y: 0 };
   const v = Vector2.angularToLinearVelocity(omega, r);
   expectVecClose(v, 0, 1);
  });
 });

 describe('Transform Application', () => {
  it('applyRotation rotates vector', () => {
   const v = { x: 1, y: 0 };
   const rotation = { cos: 0, sin: 1 };
   const result = Vector2.applyRotation(v, rotation);
   expectVecClose(result, 0, 1);
  });

  it('applyMatrix2 transforms by matrix', () => {
   const v = { x: 1, y: 0 };
   const matrix = { m00: 2, m01: 0, m10: 0, m11: 2 };
   const result = Vector2.applyMatrix2(v, matrix);
   expectVecClose(result, 2, 0);
  });
 });

 describe('Component Setters', () => {
  it('x setter modifies x component', () => {
   const v = new Vector2(1, 2);
   v.x = 10;
   expect(v.x).toBe(10);
   expect(v.y).toBe(2);
  });

  it('y setter modifies y component', () => {
   const v = new Vector2(1, 2);
   v.y = 20;
   expect(v.x).toBe(1);
   expect(v.y).toBe(20);
  });

  it('clampLength static limits magnitude', () => {
   const v = new Vector2(3, 4);
   const clamped = Vector2.clampLength(v, 0, 2.5);
   expect(clamped.length()).toBeCloseTo(2.5);
  });

  it('fromAngle creates vector from angle', () => {
   const v = Vector2.fromAngle(Math.PI / 2, 2);
   expectVecClose(v, 0, 2, 5);
  });
 });

 describe('Coverage - Transform Functions', () => {
  it('rotateAroundCS rotates around center using cos/sin', () => {
   const v = new Vector2(2, 0);
   const center = new Vector2(1, 0);
   // Rotate 90 degrees (cos=0, sin=1)
   const result = Vector2.rotateAroundCS(v, center, 0, 1);
   expectVecClose(result, 1, 1, 5);
  });

  it('angularToLinearVelocity converts angular to linear', () => {
   const omega = Math.PI; // 180 deg/s
   const r = new Vector2(1, 0);
   const v = Vector2.angularToLinearVelocity(omega, r);
   // v = omega × r = (0, omega * r.x) = (0, π)
   expectVecClose(v, 0, Math.PI, 5);
  });

  it('applyRotation applies Rotation2-like transform', () => {
   const v = new Vector2(1, 0);
   const rotation = { cos: 0, sin: 1 }; // 90 degrees
   const result = Vector2.applyRotation(v, rotation);
   expectVecClose(result, 0, 1, 5);
  });

  it('applyMatrix2 applies Matrix2-like transform', () => {
   const v = new Vector2(1, 0);
   const matrix = { m00: 2, m01: 0, m10: 0, m11: 3 }; // scale by (2, 3)
   const result = Vector2.applyMatrix2(v, matrix);
   expectVecClose(result, 2, 0, 5);
  });

  it('applyMatrix2 with rotation matrix', () => {
   const v = new Vector2(1, 0);
   // 90 degree rotation matrix
   const matrix = { m00: 0, m01: 1, m10: -1, m11: 0 };
   const result = Vector2.applyMatrix2(v, matrix);
   expectVecClose(result, 0, 1, 5);
  });
 });

 describe('Coverage - Instance Projection Methods', () => {
  it('project projects onto axis', () => {
   const v = new Vector2(3, 4);
   const axis = new Vector2(1, 0);
   v.project(axis);
   expectVecClose(v, 3, 0, 5);
  });

  it('project handles zero axis', () => {
   const v = new Vector2(3, 4);
   v.project({ x: 0, y: 0 });
   expectVecClose(v, 0, 0, 5);
  });

  it('projectOnUnit projects onto unit axis', () => {
   const v = new Vector2(3, 4);
   v.projectOnUnit({ x: 1, y: 0 });
   expectVecClose(v, 3, 0, 5);
  });

  it('reflect reflects about unit normal', () => {
   const v = new Vector2(1, -1);
   v.reflect({ x: 0, y: 1 }); // reflect off horizontal surface
   expectVecClose(v, 1, 1, 5);
  });

  it('reflectSafe reflects with non-unit normal', () => {
   const v = new Vector2(1, -1);
   v.reflectSafe({ x: 0, y: 2 }); // non-unit normal
   expectVecClose(v, 1, 1, 5);
  });

  it('reflectSafe handles zero normal', () => {
   const v = new Vector2(1, -1);
   const original = v.clone();
   v.reflectSafe({ x: 0, y: 0 });
   expectVecClose(v, original.x, original.y, 5);
  });

  it('perpendicular rotates 90 degrees CCW', () => {
   const v = new Vector2(1, 0);
   v.perpendicular(false);
   expectVecClose(v, 0, 1, 5);
  });

  it('perpendicular rotates 90 degrees CW', () => {
   const v = new Vector2(1, 0);
   v.perpendicular(true);
   expectVecClose(v, 0, -1, 5);
  });
 });

 describe('Coverage - Instance Distance and Query Methods', () => {
  it('manhattanDistanceTo computes L1 distance', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(3, 4);
   expect(a.manhattanDistanceTo(b)).toBe(7);
  });

  it('sumComponents returns sum of x + y', () => {
   const v = new Vector2(3, 4);
   expect(v.sumComponents()).toBe(7);
  });

  it('directionTo returns unit direction', () => {
   const a = new Vector2(0, 0);
   const b = new Vector2(3, 0);
   const dir = a.directionTo(b);
   expectVecClose(dir, 1, 0, 5);
  });
 });

 describe('Coverage - Instance Min/Max/Abs Methods', () => {
  it('min takes component-wise minimum', () => {
   const v = new Vector2(5, 2);
   v.min({ x: 3, y: 4 });
   expectVecClose(v, 3, 2, 5);
  });

  it('max takes component-wise maximum', () => {
   const v = new Vector2(5, 2);
   v.max({ x: 3, y: 4 });
   expectVecClose(v, 5, 4, 5);
  });

  it('abs takes absolute value of components', () => {
   const v = new Vector2(-3, -4);
   v.abs();
   expectVecClose(v, 3, 4, 5);
  });
 });

 describe('Coverage - Additional Static Methods', () => {
  it('rotateAroundCS rotates around center', () => {
   const v = { x: 2, y: 0 };
   const center = { x: 1, y: 0 };
   const result = Vector2.rotateAroundCS(v, center, 0, 1); // 90 degrees
   expectVecClose(result, 1, 1, DIGITS);
  });

  it('midpoint returns center between two points', () => {
   const a = { x: 0, y: 0 };
   const b = { x: 4, y: 4 };
   const result = Vector2.midpoint(a, b);
   expectVecClose(result, 2, 2, DIGITS);
  });

  it('angularToLinearVelocity computes tangent velocity', () => {
   const r = { x: 1, y: 0 }; // radius vector
   const result = Vector2.angularToLinearVelocity(1, r); // omega=1 rad/s
   expectVecClose(result, 0, 1, DIGITS); // perpendicular tangent
  });
 });

 describe('Coverage - Instance Projection and Reflection', () => {
  it('project onto non-unit axis', () => {
   const v = new Vector2(3, 4);
   v.project({ x: 2, y: 0 });
   expectVecClose(v, 3, 0, DIGITS);
  });

  it('project onto zero axis returns zero', () => {
   const v = new Vector2(3, 4);
   v.project({ x: 0, y: 0 });
   expectVecClose(v, 0, 0, DIGITS);
  });

  it('projectOnUnit projects onto unit vector', () => {
   const v = new Vector2(3, 4);
   v.projectOnUnit({ x: 1, y: 0 });
   expectVecClose(v, 3, 0, DIGITS);
  });

  it('reflect about unit normal', () => {
   const v = new Vector2(1, -1);
   v.reflect({ x: 0, y: 1 }); // Reflect about horizontal plane
   expectVecClose(v, 1, 1, DIGITS);
  });

  it('reflectSafe with zero normal returns unchanged', () => {
   const v = new Vector2(1, -1);
   v.reflectSafe({ x: 0, y: 0 });
   expectVecClose(v, 1, -1, DIGITS); // unchanged
  });
 });

 describe('Coverage - Instance Distance and Direction', () => {
  it('manhattanDistanceTo computes manhattan distance', () => {
   const v = new Vector2(0, 0);
   expect(v.manhattanDistanceTo({ x: 3, y: 4 })).toBe(7);
  });

  it('sumComponents returns sum of components', () => {
   const v = new Vector2(3, 4);
   expect(v.sumComponents()).toBe(7);
  });

  it('directionTo returns unit direction', () => {
   const v = new Vector2(0, 0);
   const dir = v.directionTo({ x: 3, y: 0 });
   expectVecClose(dir, 1, 0, DIGITS);
  });
 });

 describe('Coverage - Instance Scalar Methods', () => {
  it('scale multiplies vector by scalar', () => {
   const v = new Vector2(3, 4);
   v.scale(2);
   expectVecClose(v, 6, 8, DIGITS);
  });

  it('divideScalar divides vector', () => {
   const v = new Vector2(6, 8);
   v.divideScalar(2);
   expectVecClose(v, 3, 4, DIGITS);
  });
 });

 describe('Coverage - Static Factory Methods', () => {
  it('fromAngle creates from polar coordinates', () => {
   const v = Vector2.fromAngle(Math.PI / 2, 2);
   expectVecClose(v, 0, 2, DIGITS);
  });

  it('fromValues creates with values', () => {
   const v = Vector2.fromValues(3, 4);
   expectVecClose(v, 3, 4, DIGITS);
  });
 });

 describe('Coverage - Instance Rotation Methods', () => {
  it('perpendicular CCW rotates 90 degrees counter-clockwise', () => {
   const v = new Vector2(1, 0);
   v.perpendicular(false);
   expectVecClose(v, 0, 1, DIGITS);
  });

  it('perpendicular CW rotates 90 degrees clockwise', () => {
   const v = new Vector2(1, 0);
   v.perpendicular(true);
   expectVecClose(v, 0, -1, DIGITS);
  });

  it('angle returns heading angle', () => {
   const v = new Vector2(1, 1);
   expect(v.angle()).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });

 describe('Coverage - Static Transform Integration', () => {
  it('applyRotation applies Rotation2', () => {
   const v = { x: 1, y: 0 };
   const rot = { cos: 0, sin: 1 }; // 90 degrees
   const result = Vector2.applyRotation(v, rot);
   expectVecClose(result, 0, 1, DIGITS);
  });

  it('applyMatrix2 applies Matrix2', () => {
   const v = { x: 1, y: 0 };
   const m = { m00: 2, m01: 0, m10: 0, m11: 2 }; // scale 2x
   const result = Vector2.applyMatrix2(v, m);
   expectVecClose(result, 2, 0, DIGITS);
  });
 });

 describe('Coverage - Uncovered Static Methods', () => {
  it('rotateAroundCS rotates around center', () => {
   expect.hasAssertions();
   const v = { x: 2, y: 0 };
   const center = { x: 1, y: 0 };
   const result = Vector2.rotateAroundCS(v, center, 0, 1); // 90 degrees
   expectVecClose(result, 1, 1, DIGITS);
  });

  it('midpoint returns midpoint', () => {
   expect.hasAssertions();
   const a = { x: 0, y: 0 };
   const b = { x: 4, y: 6 };
   const result = Vector2.midpoint(a, b);
   expectVecClose(result, 2, 3, DIGITS);
  });

  it('crossVS returns cross product vector × scalar', () => {
   expect.hasAssertions();
   const v = { x: 1, y: 0 };
   const result = Vector2.crossVS(v, 1);
   expectVecClose(result, 0, -1, DIGITS);
  });

  it('crossSV returns cross product scalar × vector', () => {
   expect.hasAssertions();
   const v = { x: 1, y: 0 };
   const result = Vector2.crossSV(1, v);
   expectVecClose(result, 0, 1, DIGITS);
  });

  it('project projects onto direction', () => {
   expect.hasAssertions();
   const v = { x: 3, y: 4 };
   const onto = { x: 1, y: 0 };
   const result = Vector2.project(v, onto);
   expectVecClose(result, 3, 0, DIGITS);
  });

  it('reject rejects from direction', () => {
   expect.hasAssertions();
   const v = { x: 3, y: 4 };
   const from = { x: 1, y: 0 };
   const result = Vector2.reject(v, from);
   expectVecClose(result, 0, 4, DIGITS);
  });

  it('reflect reflects across normal', () => {
   expect.hasAssertions();
   const v = { x: 1, y: -1 };
   const normal = { x: 0, y: 1 };
   const result = Vector2.reflect(v, normal);
   expectVecClose(result, 1, 1, DIGITS);
  });

  it('perpendicular returns perpendicular (ccw)', () => {
   expect.hasAssertions();
   const v = { x: 1, y: 0 };
   const result = Vector2.perpendicular(v);
   expectVecClose(result, 0, 1, DIGITS);
  });

  it('perpendicular returns perpendicular (cw)', () => {
   expect.hasAssertions();
   const v = { x: 1, y: 0 };
   const result = Vector2.perpendicular(v, true);
   expectVecClose(result, 0, -1, DIGITS);
  });

  it('clampLength clamps to max length', () => {
   expect.hasAssertions();
   const v = { x: 10, y: 0 };
   const result = Vector2.clampLength(v, 0, 5);
   expectVecClose(result, 5, 0, DIGITS);
  });

  it('clampLength with min length', () => {
   expect.hasAssertions();
   const v = { x: 1, y: 0 };
   const result = Vector2.clampLength(v, 5, 10);
   expectVecClose(result, 5, 0, DIGITS);
  });

  it('setLength sets to specific length', () => {
   expect.hasAssertions();
   const v = { x: 3, y: 4 };
   const result = Vector2.setLength(v, 10);
   expectVecClose(result, 6, 8, DIGITS);
  });

  it('manhattanDistance returns manhattan distance', () => {
   expect.hasAssertions();
   const a = { x: 0, y: 0 };
   const b = { x: 3, y: 4 };
   expect(Vector2.manhattanDistance(a, b)).toBe(7);
  });
 });

 describe('Coverage - Uncovered Instance Methods', () => {
  it('copy copies from source', () => {
   expect.hasAssertions();
   const v = new Vector2();
   v.copy({ x: 5, y: 10 });
   expectVecClose(v, 5, 10, DIGITS);
  });

  it('rotateAround rotates around center', () => {
   expect.hasAssertions();
   const v = new Vector2(2, 0);
   v.rotateAround({ x: 1, y: 0 }, Math.PI / 2);
   expectVecClose(v, 1, 1, DIGITS);
  });

  it('project projects onto another vector', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.project({ x: 1, y: 0 });
   expectVecClose(v, 3, 0, DIGITS);
  });

  it('reject rejects from another vector', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.reject({ x: 1, y: 0 });
   expectVecClose(v, 0, 4, DIGITS);
  });

  it('reflect reflects across normal', () => {
   expect.hasAssertions();
   const v = new Vector2(1, -1);
   v.reflect({ x: 0, y: 1 });
   expectVecClose(v, 1, 1, DIGITS);
  });

  it('clampLength clamps length', () => {
   expect.hasAssertions();
   const v = new Vector2(10, 0);
   v.clampLength(0, 5);
   expectVecClose(v, 5, 0, DIGITS);
  });

  it('setLength sets specific length', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.setLength(10);
   expectVecClose(v, 6, 8, DIGITS);
  });

  it('floor floors components', () => {
   expect.hasAssertions();
   const v = new Vector2(1.7, 2.3);
   v.floor();
   expectVecClose(v, 1, 2, DIGITS);
  });

  it('ceil ceils components', () => {
   expect.hasAssertions();
   const v = new Vector2(1.3, 2.7);
   v.ceil();
   expectVecClose(v, 2, 3, DIGITS);
  });

  it('round rounds components', () => {
   expect.hasAssertions();
   const v = new Vector2(1.4, 2.6);
   v.round();
   expectVecClose(v, 1, 3, DIGITS);
  });
 });

 describe('Coverage - Static Comparison Methods', () => {
  it('nearZero detects near-zero vectors', () => {
   expect.hasAssertions();
   expect(Vector2.nearZero({ x: 0, y: 0 })).toBe(true);
   expect(Vector2.nearZero({ x: 1e-17, y: 0 })).toBe(true);
   expect(Vector2.nearZero({ x: 1, y: 0 })).toBe(false);
  });

  it('equals checks strict equality', () => {
   expect.hasAssertions();
   const a = { x: 1, y: 2 };
   const b = { x: 1, y: 2 };
   const c = { x: 1, y: 3 };
   expect(Vector2.exactEquals(a, b)).toBe(true);
   expect(Vector2.exactEquals(a, c)).toBe(false);
  });

  it('nearEquals checks approximate equality', () => {
   expect.hasAssertions();
   const a = { x: 1, y: 2 };
   const b = { x: 1.0001, y: 2.0001 };
   expect(Vector2.nearEquals(a, b, 0.001)).toBe(true);
   expect(Vector2.nearEquals(a, b, 0.00001)).toBe(false);
  });
 });

 describe('Coverage - Static Physics Methods', () => {
  it('angularToLinearVelocity computes tangential velocity', () => {
   expect.hasAssertions();
   const omega = 1;
   const r = { x: 1, y: 0 };
   const result = Vector2.angularToLinearVelocity(omega, r);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('crossVS computes vector x scalar', () => {
   expect.hasAssertions();
   const v = { x: 1, y: 0 };
   const result = Vector2.crossVS(v, 2);
   expectVecClose(result, 0, -2, DIGITS);
  });

  it('crossSV computes scalar x vector', () => {
   expect.hasAssertions();
   const v = { x: 1, y: 0 };
   const result = Vector2.crossSV(2, v);
   expectVecClose(result, 0, 2, DIGITS);
  });
 });

 describe('Coverage - Static Transform Extended', () => {
  it('rotateAroundCS rotates around point', () => {
   expect.hasAssertions();
   const v = { x: 2, y: 0 };
   const center = { x: 1, y: 0 };
   const cos = 0;
   const sin = 1;
   const result = Vector2.rotateAroundCS(v, center, cos, sin);
   expectVecClose(result, 1, 1, DIGITS);
  });

  it('midpoint computes center point', () => {
   expect.hasAssertions();
   const a = { x: 0, y: 0 };
   const b = { x: 10, y: 10 };
   const mid = Vector2.midpoint(a, b);
   expectVecClose(mid, 5, 5, DIGITS);
  });
 });

 describe('Coverage - Static Clamp and Length', () => {
  it('clampLength clamps to range', () => {
   expect.hasAssertions();
   const tooLong = { x: 10, y: 0 };
   const clamped = Vector2.clampLength(tooLong, 0, 5);
   expectVecClose(clamped, 5, 0, DIGITS);
  });

  it('clampLength extends to minimum', () => {
   expect.hasAssertions();
   const tooShort = { x: 1, y: 0 };
   const extended = Vector2.clampLength(tooShort, 5, 10);
   expectVecClose(extended, 5, 0, DIGITS);
  });

  it('setLength sets specific length', () => {
   expect.hasAssertions();
   const v = { x: 3, y: 4 };
   const result = Vector2.setLength(v, 10);
   expectVecClose(result, 6, 8, DIGITS);
  });

  it('setLengthSafe handles zero vector by returning (length, 0)', () => {
   expect.hasAssertions();
   const zero = { x: 0, y: 0 };
   const result = Vector2.setLengthSafe(zero, 10);
   // Zero vector returns (newLength, 0) as a fallback direction
   expectVecClose(result, 10, 0, DIGITS);
  });
 });

 describe('Coverage - Instance Angle Methods', () => {
  it('angleTo computes angle to another vector', () => {
   expect.hasAssertions();
   const a = new Vector2(1, 0);
   const angle = a.angleTo({ x: 0, y: 1 });
   expect(angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('angleTo computes angle to opposite vector', () => {
   expect.hasAssertions();
   const a = new Vector2(1, 0);
   const angle = a.angleTo({ x: -1, y: 0 });
   expect(angle).toBeCloseTo(Math.PI, DIGITS);
  });
 });

 describe('Coverage - Static Transform Methods', () => {
  it('midpoint computes midpoint', () => {
   expect.hasAssertions();
   const result = Vector2.midpoint({ x: 0, y: 0 }, { x: 4, y: 6 });
   expectVecClose(result, 2, 3, DIGITS);
  });

  it('crossVS computes cross product', () => {
   expect.hasAssertions();
   const result = Vector2.crossVS({ x: 1, y: 0 }, 2);
   expectVecClose(result, 0, -2, DIGITS);
  });

  it('crossSV computes cross product', () => {
   expect.hasAssertions();
   const result = Vector2.crossSV(2, { x: 1, y: 0 });
   expectVecClose(result, 0, 2, DIGITS);
  });

  it('angularToLinearVelocity computes linear velocity', () => {
   expect.hasAssertions();
   const result = Vector2.angularToLinearVelocity(1, { x: 1, y: 0 });
   expectVecClose(result, 0, 1, DIGITS);
  });

  it('rotateAroundCS rotates around center with cos/sin', () => {
   expect.hasAssertions();
   const result = Vector2.rotateAroundCS({ x: 2, y: 0 }, { x: 1, y: 0 }, 0, 1);
   expectVecClose(result, 1, 1, DIGITS);
  });

  it('setHeading sets the heading angle', () => {
   expect.hasAssertions();
   const result = Vector2.setHeading({ x: 1, y: 0 }, Math.PI / 2);
   expectVecClose(result, 0, 1, DIGITS);
  });
 });

 describe('Coverage - Static Transform with Types', () => {
  it('applyRotation applies rotation to vector', () => {
   expect.hasAssertions();
   const rotation = { cos: 0, sin: 1 };
   const result = Vector2.applyRotation({ x: 1, y: 0 }, rotation);
   expectVecClose(result, 0, 1, DIGITS);
  });

  it('applyMatrix2 applies matrix to vector', () => {
   expect.hasAssertions();
   const matrix = { m00: 2, m01: 0, m10: 0, m11: 3 };
   const result = Vector2.applyMatrix2({ x: 1, y: 1 }, matrix);
   expectVecClose(result, 2, 3, DIGITS);
  });

  it('applyTransform applies full transform', () => {
   expect.hasAssertions();
   const transform = {
    position: { x: 10, y: 20 },
    rotation: 0,
    scale: { x: 2, y: 3 },
   };
   const result = Vector2.applyTransform({ x: 1, y: 1 }, transform);
   expectVecClose(result, 12, 23, DIGITS);
  });

  it('fromComplex creates vector from complex', () => {
   expect.hasAssertions();
   const complex = { real: 3, imag: 4 };
   const result = Vector2.fromComplex(complex);
   expectVecClose(result, 3, 4, DIGITS);
  });
 });

 describe('Coverage - Instance Getters', () => {
  it('normalized getter returns unit vector', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.normalized, 0.6, 0.8, DIGITS);
  });

  it('negated getter returns negated vector', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.negated, -3, -4, DIGITS);
  });

  it('absolute getter returns absolute values', () => {
   expect.hasAssertions();
   const v = new Vector2(-3, -4);
   expectVecClose(v.absolute, 3, 4, DIGITS);
  });

  it('normalized getter handles zero vector', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 0);
   expectVecClose(v.normalized, 0, 0, DIGITS);
  });

  it('perpCW returns clockwise perpendicular', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 0);
   expectVecClose(v.perpCW, 0, -1, DIGITS);
  });

  it('perpCCW returns counter-clockwise perpendicular', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 0);
   expectVecClose(v.perpCCW, 0, 1, DIGITS);
  });

  it('flippedX returns x-flipped vector', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.flippedX, -3, 4, DIGITS);
  });

  it('flippedY returns y-flipped vector', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.flippedY, 3, -4, DIGITS);
  });
 });

 describe('Coverage - Instance Swizzle Getters', () => {
  it('xy returns copy', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.xy, 3, 4, DIGITS);
  });

  it('yx swaps components', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.yx, 4, 3, DIGITS);
  });

  it('xx duplicates x', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.xx, 3, 3, DIGITS);
  });

  it('yy duplicates y', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   expectVecClose(v.yy, 4, 4, DIGITS);
  });
 });

 describe('Coverage - Instance Transform Methods', () => {
  it('normalizeUnchecked normalizes without check', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.normalizeUnchecked();
   expectVecClose(v, 0.6, 0.8, DIGITS);
  });

  it('divideScalarUnchecked divides without check', () => {
   expect.hasAssertions();
   const v = new Vector2(6, 8);
   v.divideScalarUnchecked(2);
   expectVecClose(v, 3, 4, DIGITS);
  });

  it('unitPerpendicular returns unit perpendicular', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.unitPerpendicular();
   expect(v.length()).toBeCloseTo(1, DIGITS);
  });

  it('unitPerpendicularSafe handles zero vector', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 0);
   v.unitPerpendicularSafe();
   expectVecClose(v, 0, 0, DIGITS);
  });

  it('rotateAroundCS rotates around center', () => {
   expect.hasAssertions();
   const v = new Vector2(2, 0);
   v.rotateAroundCS({ x: 1, y: 0 }, 0, 1);
   expectVecClose(v, 1, 1, DIGITS);
  });

  it('reject removes projection onto axis', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.reject({ x: 1, y: 0 });
   expectVecClose(v, 0, 4, DIGITS);
  });

  it('crossScalarRight computes cross with scalar', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 0);
   v.crossScalarRight(2);
   expectVecClose(v, 0, -2, DIGITS);
  });

  it('crossScalarLeft computes scalar cross', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 0);
   v.crossScalarLeft(2);
   expectVecClose(v, 0, 2, DIGITS);
  });

  it('midpointTo returns midpoint', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 0);
   const result = v.midpointTo({ x: 4, y: 6 });
   expectVecClose(result, 2, 3, DIGITS);
  });

  it('midpoint modifies in place', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 0);
   v.midpoint({ x: 4, y: 6 });
   expectVecClose(v, 2, 3, DIGITS);
  });

  it('stepBy applies step function', () => {
   expect.hasAssertions();
   const v = new Vector2(0.5, 1.5);
   v.stepBy({ x: 1, y: 1 });
   expectVecClose(v, 0, 1, DIGITS);
  });
 });

 describe('Coverage - Instance Transform Integration', () => {
  it('applyRotation applies rotation in place', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 0);
   v.applyRotation({ cos: 0, sin: 1 });
   expectVecClose(v, 0, 1, DIGITS);
  });

  it('applyMatrix2 applies matrix in place', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 1);
   v.applyMatrix2({ m00: 2, m01: 0, m10: 0, m11: 3 });
   expectVecClose(v, 2, 3, DIGITS);
  });

  it('applyTransform applies transform in place', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 1);
   v.applyTransform({
    position: { x: 10, y: 20 },
    rotation: 0,
    scale: { x: 2, y: 3 },
   });
   expectVecClose(v, 12, 23, DIGITS);
  });
 });

 describe('Coverage - Instance Comparison Methods', () => {
  it('isZero with epsilon checks near-zero', () => {
   expect.hasAssertions();
   const v = new Vector2(1e-10, 1e-10);
   expect(v.isZero(1e-8)).toBe(true);
  });

  it('isNearZero checks near-zero', () => {
   expect.hasAssertions();
   const v = new Vector2(1e-10, 1e-10);
   expect(v.isNearZero()).toBe(true);
  });

  it('isParallelTo checks parallelism', () => {
   expect.hasAssertions();
   const v = new Vector2(2, 4);
   expect(v.isParallelTo({ x: 1, y: 2 })).toBe(true);
  });

  it('isPerpendicularTo checks perpendicularity', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 0);
   expect(v.isPerpendicularTo({ x: 0, y: 1 })).toBe(true);
  });
 });

 describe('Coverage - Instance Conversion Methods', () => {
  it('toComplexLike returns complex-like object', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   const complex = v.toComplexLike();
   expect(complex.real).toBe(3);
   expect(complex.imag).toBe(4);
  });

  it('toArray with out parameter writes to array', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   const out = new Float32Array(2);
   v.toArray(out);
   expect(out[0]).toBe(3);
   expect(out[1]).toBe(4);
  });

  it('toArray with offset writes at offset', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   const out = new Float32Array(4);
   v.toArray(out, 2);
   expect(out[2]).toBe(3);
   expect(out[3]).toBe(4);
  });

  it('iterator yields components', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   const elements = [...v];
   expect(elements).toEqual([3, 4]);
  });

  it('toString with precision formats correctly', () => {
   expect.hasAssertions();
   const v = new Vector2(3.14159, 2.71828);
   const string_ = v.toString(2);
   expect(string_).toContain('3.14');
   expect(string_).toContain('2.72');
  });
 });

 describe('Coverage - Static Comparison Extended', () => {
  it('hasNaN checks for NaN', () => {
   expect.hasAssertions();
   expect(Vector2.hasNaN({ x: NaN, y: 0 })).toBe(true);
   expect(Vector2.hasNaN({ x: 0, y: NaN })).toBe(true);
   expect(Vector2.hasNaN({ x: 1, y: 2 })).toBe(false);
  });
 });

 describe('Coverage - Static Constraints Extended', () => {
  it('clampScalar clamps between scalar bounds', () => {
   expect.hasAssertions();
   const v = { x: -5, y: 15 };
   const result = Vector2.clampScalar(v, 0, 10);
   expectVecClose(result, 0, 10, DIGITS);
  });

  it('limit limits vector length', () => {
   expect.hasAssertions();
   const v = { x: 10, y: 0 };
   const result = Vector2.limit(v, 5);
   expectVecClose(result, 5, 0, DIGITS);
  });

  it('limit keeps short vector unchanged', () => {
   expect.hasAssertions();
   const v = { x: 3, y: 0 };
   const result = Vector2.limit(v, 5);
   expectVecClose(result, 3, 0, DIGITS);
  });
 });

 describe('Coverage - Static Direction Extended', () => {
  it('angleBetween returns 0 for zero vector', () => {
   expect.hasAssertions();
   const result = Vector2.angleBetween({ x: 0, y: 0 }, { x: 1, y: 0 });
   expect(result).toBe(0);
  });
 });

 describe('Coverage - Instance Arithmetic Extended', () => {
  it('divideScalarSafe handles near-zero', () => {
   expect.hasAssertions();
   const v = new Vector2(6, 8);
   v.divideScalarSafe(0);
   expectVecClose(v, 0, 0, DIGITS);
  });

  it('inverseSafe handles near-zero components', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 2);
   v.inverseSafe();
   expect(v.x).toBe(0);
   expect(v.y).toBeCloseTo(0.5, DIGITS);
  });

  it('reflectSafe handles near-zero normal', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   const original = v.clone();
   v.reflectSafe({ x: 0, y: 0 });
   expectVecClose(v, original.x, original.y, DIGITS);
  });

  it('reject handles near-zero axis', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   const original = v.clone();
   v.reject({ x: 0, y: 0 });
   expectVecClose(v, original.x, original.y, DIGITS);
  });
 });

 describe('Coverage - Constructor Overloads', () => {
  it('constructor with array', () => {
   expect.hasAssertions();
   const v = new Vector2([5, 6]);
   expectVecClose(v, 5, 6, DIGITS);
  });

  it('constructor with object', () => {
   expect.hasAssertions();
   const v = new Vector2({ x: 7, y: 8 });
   expectVecClose(v, 7, 8, DIGITS);
  });

  it('constructor throws on short array', () => {
   expect.hasAssertions();
   expect(() => new Vector2([1] as unknown as [number, number])).toThrow(RangeError);
  });

  it('constructor throws on invalid argument', () => {
   expect.hasAssertions();
   expect(() => new Vector2('invalid' as unknown as number)).toThrow(TypeError);
  });
 });

 describe('Coverage - Final Static Methods', () => {
  it('subtractScalar subtracts scalar from components', () => {
   expect.hasAssertions();
   const result = Vector2.subtractScalar({ x: 5, y: 10 }, 3);
   expectVecClose(result, 2, 7, DIGITS);
  });

  it('modScalar computes modulo with scalar', () => {
   expect.hasAssertions();
   const result = Vector2.modScalar({ x: 7, y: 10 }, 3);
   expectVecClose(result, 1, 1, DIGITS);
  });

  it('inverse computes reciprocal', () => {
   expect.hasAssertions();
   const result = Vector2.inverse({ x: 2, y: 4 });
   expectVecClose(result, 0.5, 0.25, DIGITS);
  });

  it('inverse throws on zero component', () => {
   expect.hasAssertions();
   expect(() => Vector2.inverse({ x: 0, y: 1 })).toThrow(RangeError);
  });

  it('swap swaps components', () => {
   expect.hasAssertions();
   const result = Vector2.swap({ x: 3, y: 7 });
   expectVecClose(result, 7, 3, DIGITS);
  });

  it('step applies step function', () => {
   expect.hasAssertions();
   const result = Vector2.step({ x: 1, y: 1 }, { x: 0.5, y: 1.5 });
   expectVecClose(result, 0, 1, DIGITS);
  });

  it('angleTo computes signed angle', () => {
   expect.hasAssertions();
   const angle = Vector2.angleTo({ x: 1, y: 0 }, { x: 0, y: 1 });
   expect(angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 describe('Coverage - Final Instance Methods', () => {
  it('swap swaps components in place', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 7);
   v.swap();
   expectVecClose(v, 7, 3, DIGITS);
  });

  it('inverse computes reciprocal in place', () => {
   expect.hasAssertions();
   const v = new Vector2(2, 4);
   v.inverse();
   expectVecClose(v, 0.5, 0.25, DIGITS);
  });

  it('inverse throws on zero component', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 1);
   expect(() => v.inverse()).toThrow(RangeError);
  });

  it('limit keeps short vector unchanged', () => {
   expect.hasAssertions();
   const v = new Vector2(2, 0);
   v.limit(5);
   expectVecClose(v, 2, 0, DIGITS);
  });

  it('clampLength handles zero vector', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 0);
   v.clampLength(1, 5);
   expectVecClose(v, 0, 0, DIGITS);
  });

  it('projectOnUnit projects onto unit vector', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.projectOnUnit({ x: 1, y: 0 });
   expectVecClose(v, 3, 0, DIGITS);
  });

  it('project handles zero axis', () => {
   expect.hasAssertions();
   const v = new Vector2(3, 4);
   v.project({ x: 0, y: 0 });
   expectVecClose(v, 0, 0, DIGITS);
  });

  it('slerp falls back to lerp for small angle', () => {
   expect.hasAssertions();
   const v = new Vector2(1, 0);
   v.slerp({ x: 1.001, y: 0 }, 0.5);
   // With very similar vectors, slerp should interpolate lengths
   expect(v.length()).toBeCloseTo(1.0005, 4);
  });

  it('slerp falls back to lerp for zero vector', () => {
   expect.hasAssertions();
   const v = new Vector2(0, 0);
   v.slerp({ x: 1, y: 0 }, 0.5);
   expectVecClose(v, 0.5, 0, DIGITS);
  });
 });
});
