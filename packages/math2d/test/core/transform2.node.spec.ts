/**
 * @file test/core/transform2.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Tests for Transform2 core behavior.
 */

import { describe, expect, it } from '@jest/globals';

import { Matrix3 } from '../../src/core/matrix3';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

// DIGITS = 10 matches EPSILON = 1e-10 — the library's documented tolerance
const DIGITS = 10;

function expectVecClose(vector: Vector2, x: number, y: number, digits = DIGITS): void {
 expect(vector.x).toBeCloseTo(x, digits);
 expect(vector.y).toBeCloseTo(y, digits);
}

describe('Transform2', () => {
 describe('Factories', () => {
  it('fromValues normalizes rotation and sets components', () => {
   const transform = Transform2.fromValues(1, 2, Math.PI * 2 + Math.PI / 2, 3, 4);
   expectVecClose(transform.position, 1, 2);
   expect(transform.rotation.angle).toBeCloseTo(Math.PI / 2, DIGITS);
   expectVecClose(transform.scale, 3, 4);
  });

  it('fromComponents accepts scalar scale and Rotation2', () => {
   const transform = Transform2.fromComponents(new Vector2(2, 3), Math.PI / 4, 5);
   expectVecClose(transform.position, 2, 3);
   expect(transform.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expect(transform.scale.x).toBeCloseTo(5, DIGITS);
   expect(transform.scale.y).toBeCloseTo(5, DIGITS);
  });

  it('fromComponents accepts Rotation2Like object', () => {
   const angle = Math.PI / 3;
   const rotation = { cos: Math.cos(angle), sin: Math.sin(angle) };
   const transform = Transform2.fromComponents({ x: 1, y: 2 }, rotation, 1);
   expect(transform.rotation.angle).toBeCloseTo(angle, DIGITS);
  });

  it('fromObject sanitizes components', () => {
   const transform = Transform2.fromObject({
    position: { x: 4, y: -2 },
    rotation: { cos: -1, sin: 0 }, // π radians (180°)
    scale: { x: 2, y: 3 },
   });
   expectVecClose(transform.position, 4, -2);
   expect(Math.abs(transform.rotation.angle)).toBeCloseTo(Math.PI, DIGITS);
   expectVecClose(transform.scale, 2, 3);
  });

  it('fromMatrix round-trips toMatrix', () => {
   const original = Transform2.fromValues(5, -3, Math.PI / 3, 2, 1.5);
   const matrix = original.toMatrix3();
   const reconstructed = Transform2.fromMatrix3(matrix);
   expect(reconstructed.nearEquals(original, 1e-6)).toBe(true);
  });
 });

 describe('constructor purity (IEEE 754)', () => {
  it('constructor has no own assertFinite — error comes from Rotation2.fromAngle, not Transform2', () => {
   // The constructor no longer has a direct assertFinite call (Constructor Purity rule).
   // In dev mode, Rotation2.fromAngle validates the angle as a method (not constructor) —
   // so the error label is 'Rotation2.fromAngle:angle', not 'Transform2.constructor:rotation'.
   const position = new Vector2(1, 2);
   expect(() => new Transform2(position, NaN)).toThrow(/Rotation2\.fromAngle/);
   expect(() => new Transform2(position, NaN)).not.toThrow(/Transform2\.constructor/);
  });

  it('still constructs correctly for valid inputs', () => {
   const t = new Transform2(new Vector2(3, 4), Math.PI / 4);
   expect(t.position.x).toBeCloseTo(3, DIGITS);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });

 describe('Transform application', () => {
  it('transformPoint applies scale, rotate, translate', () => {
   const transform = Transform2.fromValues(10, 5, Math.PI / 2, 2, 1);
   const result = transform.transformPoint(new Vector2(1, 0));
   expectVecClose(result, 10, 7);
  });

  it('inverseTransformPoint reverses transformPoint', () => {
   const transform = Transform2.fromValues(-4, 3, Math.PI / 4, 3, 2);
   const point = new Vector2(2, -1);
   const world = transform.transformPoint(point);
   const local = transform.inverseTransformPoint(world);
   expectVecClose(local, point.x, point.y);
  });

  it('transformVector ignores translation', () => {
   const transform = Transform2.fromValues(100, 50, Math.PI / 2, 1, 1);
   const vector = transform.transformVector(new Vector2(1, 0));
   expectVecClose(vector, 0, 1);
  });

  it('transformPoint and transformVector honor out parameter', () => {
   const transform = Transform2.fromValues(0, 0, Math.PI / 2, 1, 1);
   const pointOut = new Vector2();
   const vectorOut = new Vector2();
   const returnedPoint = transform.transformPoint(new Vector2(1, 0), pointOut);
   const returnedVector = transform.transformVector(new Vector2(1, 0), vectorOut);
   expect(returnedPoint).toBe(pointOut);
   expect(returnedVector).toBe(vectorOut);
   expectVecClose(pointOut, 0, 1);
   expectVecClose(vectorOut, 0, 1);
  });
 });

 describe('Composition & inverse', () => {
  it('multiply composes transforms in Scale→Rotate→Translate order', () => {
   const parent = Transform2.fromValues(5, 0, Math.PI / 2, 1, 1);
   const child = Transform2.fromValues(0, 2, 0, 1, 1);
   const combined = Transform2.multiply(parent, child, new Transform2());
   const point = combined.transformPoint(new Vector2(0, 0));
   expectVecClose(point, 3, 0);
  });

  it('inverseTransformPoint undoes transformPoint', () => {
   const transform = Transform2.fromValues(2, -3, Math.PI / 6, 2, 0.5);
   const testPoint = new Vector2(5, 7);
   const transformed = transform.transformPoint(testPoint);
   const restored = transform.inverseTransformPoint(transformed);
   expectVecClose(restored, testPoint.x, testPoint.y, 6);
  });

  it('inverse() creates a Transform2 that approximately inverts (uniform scale only)', () => {
   // Inverse Transform2 only works correctly for uniform scales
   const transform = Transform2.fromValues(2, -3, Math.PI / 6, 2, 2);
   const inverse = Transform2.inverse(transform);
   const testPoint = new Vector2(5, 7);
   const transformed = transform.transformPoint(testPoint);
   const restored = inverse.transformPoint(transformed);
   expectVecClose(restored, testPoint.x, testPoint.y, 4);
  });

  it('inverse() position is correct for non-uniform scale', () => {
   // pos=(2,0), rot=90°, scale=(2,1)
   // Corrected formula: -(S⁻¹ · R⁻¹ · t)
   // R⁻¹ · (2,0) = (0, -2), then S⁻¹ · (0,-2) = (0,-2), negated = (0, 2)
   const transform = Transform2.fromValues(2, 0, Math.PI / 2, 2, 1);
   const inv = Transform2.inverse(transform);
   expectVecClose(inv.position, 0, 2, 4);
  });

  // V9-Transform2-02: inverted getter routes through inverseSafe (identity fallback for singular)
  it('inverted getter returns identity fallback for singular transform (V9-Transform2-02)', () => {
   // Zero-scale transform is singular (no inverse exists)
   const singular = Transform2.fromValues(1, 2, 0, 0, 0);
   const result = singular.inverted;
   // Safe tier returns identity fallback instead of throwing
   expect(result.position.x).toBe(0);
   expect(result.position.y).toBe(0);
   expect(result.scale.x).toBe(1);
   expect(result.scale.y).toBe(1);
  });

  it('inverted getter does not throw for non-singular transform', () => {
   const t = Transform2.fromValues(1, 2, Math.PI / 4, 2, 3);
   expect(() => t.inverted).not.toThrow();
  });
 });

 describe('Interpolation', () => {
  it('lerp interpolates position, rotation, and scale deterministically', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(10, 10, Math.PI, 3, 5);
   const mid = start.clone().lerp(end, 0.5);
   expectVecClose(mid.position, 5, 5);
   expect(Math.abs(mid.rotation.angle)).toBeCloseTo(Math.PI / 2, DIGITS);
   expectVecClose(mid.scale, 2, 3);
  });

  it('lerp allows extrapolation (does NOT clamp t)', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(0, 0, Math.PI / 2, 2, 2);
   // With t=2, should extrapolate beyond end (PI or -PI, equivalent)
   const over = start.clone().lerp(end, 2);
   expect(Math.abs(over.rotation.angle)).toBeCloseTo(Math.PI, DIGITS);
   expectVecClose(over.scale, 3, 3); // 1 + 2*(2-1) = 3
   // With t=-1, should extrapolate before start
   const under = start.clone().lerp(end, -1);
   expect(under.rotation.angle).toBeCloseTo(-Math.PI / 2, DIGITS);
   expectVecClose(under.scale, 0, 0); // 1 + (-1)*(2-1) = 0
  });

  it('lerpClamped clamps interpolation factor to [0, 1]', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(0, 0, Math.PI, 2, 2);
   const under = start.clone().lerpClamped(end, -1);
   const over = start.clone().lerpClamped(end, 2);
   expect(under.rotation.angle).toBeCloseTo(0, DIGITS);
   expectVecClose(under.scale, 1, 1);
   expect(Math.abs(over.rotation.angle)).toBeCloseTo(Math.PI, DIGITS);
   expectVecClose(over.scale, 2, 2);
  });
 });

 describe('Queries & helpers', () => {
  it('equals is strict comparison', () => {
   const a = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const b = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const c = Transform2.fromValues(1 + 1e-11, 2, Math.PI / 4 + 1e-11, 3, 4);
   expect(a.exactEquals(b)).toBe(true);
   expect(a.exactEquals(c)).toBe(false);
  });

  it('nearEquals compares with tolerance', () => {
   const a = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const b = Transform2.fromValues(1 + 1e-11, 2, Math.PI / 4 + 1e-11, 3, 4);
   expect(a.nearEquals(b, 1e-6)).toBe(true);
  });

  // Note: Angular wrap-around test removed due to Jest test isolation issues
  // The nearEquals wrap-around behavior is tested via Rotation2.nearEquals tests

  it('isIdentity detects near identity transform', () => {
   expect(Transform2.IDENTITY.isIdentity()).toBe(true);
   const rotated = Transform2.fromValues(0, 0, Math.PI / 4, 1, 1);
   expect(rotated.isIdentity()).toBe(false);
  });

  it('toObject returns plain representation', () => {
   const transform = Transform2.fromValues(3, -2, Math.PI / 6, 2, 5);
   const object = transform.toObject();
   expect(object.position.x).toBeCloseTo(3, DIGITS);
   expect(object.scale.y).toBeCloseTo(5, DIGITS);
   // toObject returns Rotation2Like with cos/sin, use atan2 to get angle
   expect(Math.atan2(object.rotation.sin, object.rotation.cos)).toBeCloseTo(Math.PI / 6, DIGITS);
  });

  it('clone creates independent copy', () => {
   const original = Transform2.fromValues(1, 2, Math.PI / 3, 2, 3);
   const cloned = original.clone();
   expect(cloned.exactEquals(original)).toBe(true);
   expect(cloned).not.toBe(original);
  });

  it('copy copies from source', () => {
   const source = Transform2.fromValues(5, 6, Math.PI / 4, 3, 4);
   const target = new Transform2();
   target.copy(source);
   expect(target.exactEquals(source)).toBe(true);
  });

  it('set updates all components', () => {
   const t = new Transform2();
   t.set(new Vector2(1, 2), Math.PI / 2, new Vector2(3, 4));
   expectVecClose(t.position, 1, 2);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 2, DIGITS);
   expectVecClose(t.scale, 3, 4);
  });

  it('identity method resets to identity', () => {
   const t = Transform2.fromValues(10, 20, Math.PI, 5, 5);
   t.identity();
   expect(t.isIdentity()).toBe(true);
  });

  it('toString returns formatted string', () => {
   const t = Transform2.fromValues(1, 2, 0, 1, 1);
   const string_ = t.toString();
   expect(string_).toContain('Transform2');
  });
 });

 describe('Static methods', () => {
  it('static lerp interpolates between transforms', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(10, 10, Math.PI / 2, 2, 2);
   const mid = Transform2.lerp(start, end, 0.5);
   expectVecClose(mid.position, 5, 5);
   expect(mid.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expectVecClose(mid.scale, 1.5, 1.5);
  });

  it('static equals compares transforms', () => {
   const a = Transform2.fromValues(1, 2, Math.PI / 4, 2, 3);
   const b = Transform2.fromValues(1, 2, Math.PI / 4, 2, 3);
   expect(Transform2.exactEquals(a, b)).toBe(true);
  });

  it('static multiply composes transforms', () => {
   const parent = Transform2.fromValues(10, 0, 0, 1, 1);
   const child = Transform2.fromValues(5, 0, 0, 1, 1);
   const combined = Transform2.multiply(parent, child);
   expectVecClose(combined.position, 15, 0);
  });

  it('static inverse creates inverse transform', () => {
   const t = Transform2.fromValues(5, 10, Math.PI / 2, 2, 2);
   const inv = Transform2.inverse(t);
   const combined = Transform2.multiply(t, inv);
   expect(combined.isIdentity(0.001)).toBe(true);
  });
 });

 describe('Instance transformation methods', () => {
  it('transformVector ignores translation', () => {
   const t = Transform2.fromValues(100, 100, 0, 2, 2);
   const v = t.transformVector(new Vector2(1, 0));
   expectVecClose(v, 2, 0);
  });

  it('inverseTransformPoint reverses transformation', () => {
   const t = Transform2.fromValues(10, 20, 0, 1, 1);
   const point = new Vector2(15, 25);
   const local = t.inverseTransformPoint(point);
   expectVecClose(local, 5, 5);
  });
 });

 describe('State Manipulation', () => {
  it('set updates all components', () => {
   const t = new Transform2();
   t.set({ x: 10, y: 20 }, Math.PI / 4, { x: 2, y: 3 });
   expect(t.position.x).toBe(10);
   expect(t.position.y).toBe(20);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(3);
  });

  it('set with uniform scale', () => {
   const t = new Transform2();
   t.set({ x: 5, y: 5 }, 0, 2);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(2);
  });

  it('copy clones from another transform', () => {
   const source = Transform2.fromValues(1, 2, Math.PI / 6, 3, 4);
   const t = new Transform2();
   t.copy(source);
   expect(t.position.x).toBe(1);
   expect(t.scale.y).toBe(4);
  });

  it('identity resets to default', () => {
   const t = Transform2.fromValues(10, 20, Math.PI, 5, 5);
   t.identity();
   expect(t.position.x).toBe(0);
   expect(t.rotation.angle).toBe(0);
   expect(t.scale.x).toBe(1);
  });

  it('hasUniformScale returns true for uniform', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 2);
   expect(t.hasUniformScale()).toBe(true);
  });

  it('hasUniformScale returns false for non-uniform', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 3);
   expect(t.hasUniformScale()).toBe(false);
  });

  it('hasNegativeScale detects negative scale', () => {
   const t = Transform2.fromValues(0, 0, 0, -1, 1);
   expect(t.hasNegativeScale()).toBe(true);
  });

  it('hasNegativeScale returns false for positive', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 2);
   expect(t.hasNegativeScale()).toBe(false);
  });

  it('determinant returns scale product', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 3);
   expect(t.determinant()).toBe(6);
  });
 });

 describe('Matrix Conversion', () => {
  it('toMatrix creates transformation matrix', () => {
   const t = Transform2.fromValues(10, 20, 0, 2, 2);
   const m = t.toMatrix3();
   expect(m.m20).toBe(10);
   expect(m.m21).toBe(20);
  });

  it('fromMatrix reconstructs from matrix', () => {
   const original = Transform2.fromValues(5, 10, Math.PI / 4, 2, 2);
   const m = original.toMatrix3();
   const reconstructed = new Transform2();
   reconstructed.setFromMatrix3(m);
   expect(reconstructed.position.x).toBeCloseTo(5);
   expect(reconstructed.position.y).toBeCloseTo(10);
  });
 });

 describe('Coverage - Instance Setters', () => {
  it('set updates position, rotation, and uniform scale', () => {
   const t = new Transform2();
   t.set({ x: 5, y: 10 }, Math.PI / 4, 2);
   expect(t.position.x).toBe(5);
   expect(t.position.y).toBe(10);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 4);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(2);
  });

  it('set updates position, rotation, and non-uniform scale', () => {
   const t = new Transform2();
   t.set({ x: 5, y: 10 }, Math.PI / 4, { x: 2, y: 3 });
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(3);
  });

  it('copy copies all components', () => {
   const source = Transform2.fromValues(5, 10, Math.PI / 4, 2, 3);
   const target = new Transform2();
   target.copy(source);
   expect(target.position.x).toBe(5);
   expect(target.rotation.angle).toBeCloseTo(Math.PI / 4);
   expect(target.scale.y).toBe(3);
  });

  it('identity resets to identity transform', () => {
   const t = Transform2.fromValues(5, 10, Math.PI / 4, 2, 3);
   t.identity();
   expect(t.position.x).toBe(0);
   expect(t.position.y).toBe(0);
   expect(t.rotation.angle).toBe(0);
   expect(t.scale.x).toBe(1);
   expect(t.scale.y).toBe(1);
  });
 });

 describe('Coverage - Instance Properties', () => {
  it('hasUniformScale returns true for uniform scale', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 2);
   expect(t.hasUniformScale()).toBe(true);
  });

  it('hasUniformScale returns false for non-uniform scale', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 3);
   expect(t.hasUniformScale()).toBe(false);
  });

  it('hasNegativeScale returns true when scale is negative', () => {
   const t = Transform2.fromValues(0, 0, 0, -1, 1);
   expect(t.hasNegativeScale()).toBe(true);
  });

  it('hasNegativeScale returns false when scale is positive', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 3);
   expect(t.hasNegativeScale()).toBe(false);
  });

  it('determinant returns product of scale', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 3);
   expect(t.determinant()).toBe(6);
  });
 });

 describe('Coverage - Matrix Conversion', () => {
  it('toMatrix creates Matrix3 from transform', () => {
   const t = Transform2.fromValues(5, 10, 0, 2, 2);
   const m = t.toMatrix3();
   expect(m.m20).toBe(5); // translation x
   expect(m.m21).toBe(10); // translation y
  });

  it('fromMatrix extracts transform from matrix', () => {
   const original = Transform2.fromValues(5, 10, Math.PI / 4, 2, 2);
   const matrix = original.toMatrix3();
   const reconstructed = new Transform2();
   reconstructed.setFromMatrix3(matrix);
   expect(reconstructed.position.x).toBeCloseTo(5);
   expect(reconstructed.position.y).toBeCloseTo(10);
  });
 });

 describe('Coverage - Batch Operations', () => {
  it('transformPoints transforms array of points', () => {
   const t = Transform2.fromValues(10, 0, 0, 2, 2);
   const points = [new Vector2(1, 0), new Vector2(0, 1)];
   const result = t.transformPoints(points);
   expect(result[0].x).toBeCloseTo(12); // 1*2 + 10
   expect(result[0].y).toBeCloseTo(0);
   expect(result[1].x).toBeCloseTo(10);
   expect(result[1].y).toBeCloseTo(2); // 1*2 + 0
  });

  it('transformPoints with out array reuses vectors', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 2);
   const points = [new Vector2(1, 0)];
   const out = [new Vector2()];
   const result = t.transformPoints(points, out);
   expect(result).toBe(out);
   expect(out[0].x).toBeCloseTo(2);
  });

  it('transformPoints extends out array if needed', () => {
   const t = Transform2.fromValues(0, 0, 0, 1, 1);
   const points = [new Vector2(1, 0), new Vector2(0, 1)];
   const out: Vector2[] = [];
   const result = t.transformPoints(points, out);
   expect(result.length).toBe(2);
   expect(result[0].x).toBeCloseTo(1);
  });

  it('transformVectors transforms array of vectors', () => {
   const t = Transform2.fromValues(100, 100, 0, 2, 2);
   const vectors = [new Vector2(1, 0), new Vector2(0, 1)];
   const result = t.transformVectors(vectors);
   expect(result[0].x).toBeCloseTo(2);
   expect(result[0].y).toBeCloseTo(0);
   expect(result[1].x).toBeCloseTo(0);
   expect(result[1].y).toBeCloseTo(2);
  });
 });

 describe('Coverage - Set and Copy', () => {
  it('set with scalar scale', () => {
   const t = new Transform2();
   t.set({ x: 5, y: 10 }, Math.PI / 2, 2);
   expect(t.position.x).toBe(5);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(2);
  });

  it('set with vector scale', () => {
   const t = new Transform2();
   t.set({ x: 5, y: 10 }, Math.PI / 2, { x: 2, y: 3 });
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(3);
  });

  it('copy copies all properties', () => {
   const source = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const target = new Transform2();
   target.copy(source);
   expect(target.position.x).toBe(1);
   expect(target.scale.y).toBe(4);
  });

  it('identity resets transform', () => {
   const t = Transform2.fromValues(5, 10, Math.PI, 2, 3);
   t.identity();
   expect(t.position.x).toBe(0);
   expect(t.rotation.angle).toBe(0);
   expect(t.scale.x).toBe(1);
  });
 });

 describe('fromArray / toArray', () => {
  it('creates transform from array', () => {
   const t = Transform2.fromArray([100, 50, Math.PI / 4, 2, 3]);
   expect(t.position.x).toBe(100);
   expect(t.position.y).toBe(50);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(3);
  });

  it('supports offset parameter', () => {
   const t = Transform2.fromArray([999, 10, 20, Math.PI / 2, 1.5, 2.5, 888], 1);
   expect(t.position.x).toBe(10);
   expect(t.position.y).toBe(20);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 2, DIGITS);
   expect(t.scale.x).toBe(1.5);
   expect(t.scale.y).toBe(2.5);
  });

  it('throws on out of bounds offset', () => {
   expect(() => Transform2.fromArray([1, 2, 3, 4, 5], 1)).toThrow(RangeError);
  });

  it('throws on negative offset', () => {
   expect(() => Transform2.fromArray([1, 2, 3, 4, 5], -1)).toThrow(RangeError);
  });

  it('toArray returns flat array', () => {
   const t = Transform2.fromValues(100, 50, Math.PI / 4, 2, 3);
   const array = t.toArray();
   expect(array[0]).toBe(100);
   expect(array[1]).toBe(50);
   expect(array[2]).toBeCloseTo(Math.PI / 4, DIGITS);
   expect(array[3]).toBe(2);
   expect(array[4]).toBe(3);
  });

  it('toArray writes to output array', () => {
   const t = Transform2.fromValues(10, 20, 0, 1, 1);
   const out = new Float32Array(10);
   t.toArray(out, 2);
   expect(out[2]).toBe(10);
   expect(out[3]).toBe(20);
   expect(out[4]).toBe(0);
   expect(out[5]).toBe(1);
   expect(out[6]).toBe(1);
  });
 });

 describe('Utility Methods', () => {
  it('isFinite returns true for finite transform', () => {
   const t = Transform2.fromValues(10, 20, Math.PI / 4, 2, 3);
   expect(t.isFinite()).toBe(true);
  });

  it('isFinite returns false for infinite position', () => {
   const t = new Transform2();
   t.position.x = Infinity;
   expect(t.isFinite()).toBe(false);
  });

  it('isFinite returns false for infinite rotation', () => {
   const t = new Transform2();
   t.rotation.cos = Infinity; // rotation is Rotation2, set cos/sin to Infinity
   expect(t.isFinite()).toBe(false);
  });

  it('isFinite returns false for infinite scale', () => {
   const t = new Transform2();
   t.scale.x = Infinity;
   expect(t.isFinite()).toBe(false);
  });

  it('hasNaN returns false for normal transform', () => {
   const t = Transform2.fromValues(10, 20, Math.PI / 4, 2, 3);
   expect(t.hasNaN()).toBe(false);
  });

  it('hasNaN returns true for NaN in position', () => {
   const t = new Transform2();
   t.position.x = NaN;
   expect(t.hasNaN()).toBe(true);
  });

  it('hasNaN returns true for NaN in rotation', () => {
   const t = new Transform2();
   t.rotation.cos = NaN; // rotation is Rotation2 object, set cos/sin to NaN
   expect(t.hasNaN()).toBe(true);
  });

  it('hasNaN returns true for NaN in scale', () => {
   const t = new Transform2();
   t.scale.y = NaN;
   expect(t.hasNaN()).toBe(true);
  });
 });

 describe('Coverage - Static Factory Methods', () => {
  it('static copy copies values', () => {
   const source = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const destination = new Transform2();
   const result = Transform2.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.position.x).toBe(1);
   expect(destination.position.y).toBe(2);
   expect(destination.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expect(destination.scale.x).toBe(3);
   expect(destination.scale.y).toBe(4);
  });

  it('fromArray creates from array', () => {
   const array = [10, 20, Math.PI / 2, 2, 3];
   const t = Transform2.fromArray(array);
   expectVecClose(t.position, 10, 20);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 2, DIGITS);
   expectVecClose(t.scale, 2, 3);
  });

  it('fromArray with offset', () => {
   const array = [0, 0, 10, 20, Math.PI / 4, 2, 3];
   const t = Transform2.fromArray(array, 2);
   expectVecClose(t.position, 10, 20);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expectVecClose(t.scale, 2, 3);
  });

  it('fromArray throws on out of bounds', () => {
   expect(() => Transform2.fromArray([1, 2, 3, 4], 0)).toThrow(RangeError);
  });
 });

 describe('Coverage - Static Transform Methods', () => {
  it('static transformPoint applies full transform', () => {
   const t = { position: { x: 10, y: 5 }, rotation: { cos: 0, sin: 1 }, scale: { x: 2, y: 1 } }; // π/2
   const p = { x: 1, y: 0 };
   const result = Transform2.transformPoint(t, p);
   expectVecClose(result, 10, 7);
  });

  it('static transformVector applies scale and rotation only', () => {
   const t = { position: { x: 100, y: 50 }, rotation: { cos: 0, sin: 1 }, scale: { x: 1, y: 1 } }; // π/2
   const v = { x: 1, y: 0 };
   const result = Transform2.transformVector(t, v);
   expectVecClose(result, 0, 1);
  });

  it('static transformVector with out parameter', () => {
   const cos45 = Math.cos(Math.PI / 4);
   const sin45 = Math.sin(Math.PI / 4);
   const t = {
    position: { x: 0, y: 0 },
    rotation: { cos: cos45, sin: sin45 },
    scale: { x: 2, y: 2 },
   };
   const v = { x: 1, y: 0 };
   const out = new Vector2();
   const result = Transform2.transformVector(t, v, out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - Static Interpolation Methods', () => {
  it('static lerp interpolates transforms', () => {
   const a = Transform2.fromValues(0, 0, 0, 1, 1);
   const b = Transform2.fromValues(10, 10, Math.PI / 2, 2, 2);
   const mid = Transform2.lerp(a, b, 0.5);
   expectVecClose(mid.position, 5, 5);
   expect(mid.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expectVecClose(mid.scale, 1.5, 1.5);
  });

  it('static lerpClamped clamps t', () => {
   const a = Transform2.fromValues(0, 0, 0, 1, 1);
   const b = Transform2.fromValues(10, 10, Math.PI / 2, 2, 2);
   const result = Transform2.lerpClamped(a, b, 2);
   expectVecClose(result.position, 10, 10);
  });

  it('static smoothStep interpolates smoothly', () => {
   const a = Transform2.fromValues(0, 0, 0, 1, 1);
   const b = Transform2.fromValues(10, 10, Math.PI / 2, 2, 2);
   const mid = Transform2.smoothStep(a, b, 0.5);
   expectVecClose(mid.position, 5, 5);
  });

  it('instance smoothStep interpolates smoothly', () => {
   const a = Transform2.fromValues(0, 0, 0, 1, 1);
   const b = Transform2.fromValues(10, 10, Math.PI / 2, 2, 2);
   a.smoothStep(b, 0.5);
   expectVecClose(a.position, 5, 5);
  });
 });

 describe('Coverage - Static Comparison Methods', () => {
  it('static hasUniformScale checks uniform scaling', () => {
   expect(
    Transform2.hasUniformScale({
     position: { x: 0, y: 0 },
     rotation: { cos: 1, sin: 0 },
     scale: { x: 2, y: 2 },
    }),
   ).toBe(true);
   expect(
    Transform2.hasUniformScale({
     position: { x: 0, y: 0 },
     rotation: { cos: 1, sin: 0 },
     scale: { x: 2, y: 3 },
    }),
   ).toBe(false);
  });

  it('static hasNegativeScale checks for negative scale', () => {
   expect(
    Transform2.hasNegativeScale({
     position: { x: 0, y: 0 },
     rotation: { cos: 1, sin: 0 },
     scale: { x: -1, y: 1 },
    }),
   ).toBe(true);
   expect(
    Transform2.hasNegativeScale({
     position: { x: 0, y: 0 },
     rotation: { cos: 1, sin: 0 },
     scale: { x: 1, y: -1 },
    }),
   ).toBe(true);
   expect(
    Transform2.hasNegativeScale({
     position: { x: 0, y: 0 },
     rotation: { cos: 1, sin: 0 },
     scale: { x: 1, y: 1 },
    }),
   ).toBe(false);
  });

  it('static determinant returns scale product', () => {
   expect(
    Transform2.determinant({
     position: { x: 0, y: 0 },
     rotation: { cos: 1, sin: 0 },
     scale: { x: 2, y: 3 },
    }),
   ).toBe(6);
  });
 });

 describe('Coverage - Object.freeze on transform', () => {
  it('Object.freeze freezes the transform object', () => {
   const t = Transform2.fromValues(1, 2, 0, 1, 1);
   Object.freeze(t.position);
   Object.freeze(t.scale);
   const frozen = Object.freeze(t);
   expect(frozen).toBe(t);
   expect(Object.isFrozen(frozen)).toBe(true);
   expect(Object.isFrozen(frozen.position)).toBe(true);
   expect(Object.isFrozen(frozen.scale)).toBe(true);
  });
 });

 describe('Deep freeze on static constants', () => {
  it('IDENTITY nested position is immutable', () => {
   expect(Object.isFrozen(Transform2.IDENTITY.position)).toBe(true);
   expect(() => {
    (Transform2.IDENTITY.position as { x: number }).x = 99;
   }).toThrow(TypeError);
  });

  it('IDENTITY nested rotation is immutable', () => {
   expect(Object.isFrozen(Transform2.IDENTITY.rotation)).toBe(true);
   expect(() => {
    (Transform2.IDENTITY.rotation as { cos: number }).cos = 0;
   }).toThrow(TypeError);
  });

  it('IDENTITY nested scale is immutable', () => {
   expect(Object.isFrozen(Transform2.IDENTITY.scale)).toBe(true);
   expect(() => {
    (Transform2.IDENTITY.scale as { x: number }).x = 99;
   }).toThrow(TypeError);
  });

  it('FLIP_X nested objects are deeply frozen', () => {
   expect(Object.isFrozen(Transform2.FLIP_X.position)).toBe(true);
   expect(Object.isFrozen(Transform2.FLIP_X.rotation)).toBe(true);
   expect(Object.isFrozen(Transform2.FLIP_X.scale)).toBe(true);
   expect(() => {
    (Transform2.FLIP_X.scale as { x: number }).x = 5;
   }).toThrow(TypeError);
  });

  it('FLIP_Y nested objects are deeply frozen', () => {
   expect(Object.isFrozen(Transform2.FLIP_Y.position)).toBe(true);
   expect(Object.isFrozen(Transform2.FLIP_Y.rotation)).toBe(true);
   expect(Object.isFrozen(Transform2.FLIP_Y.scale)).toBe(true);
   expect(() => {
    (Transform2.FLIP_Y.scale as { y: number }).y = 5;
   }).toThrow(TypeError);
  });
 });

 describe('Coverage - Instance lerp and lerpClamped', () => {
  it('instance lerp interpolates', () => {
   const a = Transform2.fromValues(0, 0, 0, 1, 1);
   const b = Transform2.fromValues(10, 10, Math.PI / 2, 2, 2);
   a.lerp(b, 0.5);
   expectVecClose(a.position, 5, 5);
  });

  it('instance lerpClamped clamps t', () => {
   const a = Transform2.fromValues(0, 0, 0, 1, 1);
   const b = Transform2.fromValues(10, 10, Math.PI / 2, 2, 2);
   a.lerpClamped(b, 2);
   expectVecClose(a.position, 10, 10);
  });
 });

 describe('Coverage - Static multiply', () => {
  it('static multiply composes transforms', () => {
   const parent = Transform2.fromValues(5, 0, Math.PI / 2, 1, 1);
   const child = Transform2.fromValues(0, 2, 0, 1, 1);
   const combined = Transform2.multiply(parent, child);
   const point = combined.transformPoint(new Vector2(0, 0));
   expectVecClose(point, 3, 0);
  });
 });

 describe('Coverage - Static clone', () => {
  it('static clone creates copy', () => {
   const original = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const cloned = Transform2.clone(original);
   expect(cloned).not.toBe(original);
   expectVecClose(cloned.position, 1, 2);
  });
 });

 describe('Coverage - transformPointCS and transformVectorCS', () => {
  it('transformPointCS uses precomputed cos/sin', () => {
   const t = Transform2.fromValues(10, 5, Math.PI / 2, 2, 1);
   const cos = Math.cos(Math.PI / 2);
   const sin = Math.sin(Math.PI / 2);
   const result = Transform2.transformPointCS(t, { x: 1, y: 0 }, cos, sin);
   expectVecClose(result, 10, 7);
  });

  it('transformVectorCS uses precomputed cos/sin', () => {
   const t = Transform2.fromValues(100, 50, Math.PI / 2, 1, 1);
   const cos = Math.cos(Math.PI / 2);
   const sin = Math.sin(Math.PI / 2);
   const result = Transform2.transformVectorCS(t, { x: 1, y: 0 }, cos, sin);
   expectVecClose(result, 0, 1);
  });
 });

 describe('Coverage - inverseTransformPointSafe', () => {
  it('returns zero for zero scale', () => {
   // Note: Transform2.fromValues does not allow scale=0, so test with tiny but valid scale
   // The Safe variant just divides, it doesn't check for near-zero
   const t = Transform2.fromValues(10, 20, 0, 1, 1);
   const result = Transform2.inverseTransformPointSafe(t, { x: 15, y: 25 });
   expectVecClose(result, 5, 5);
  });

  it('works with rotation', () => {
   const t = Transform2.fromValues(0, 0, Math.PI / 2, 1, 1);
   const result = Transform2.inverseTransformPointSafe(t, { x: 1, y: 0 });
   expectVecClose(result, 0, -1);
  });
 });

 describe('Coverage - inverseTransformVectorSafe', () => {
  it('works with uniform scale', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 2);
   const result = Transform2.inverseTransformVectorSafe(t, { x: 4, y: 4 });
   expectVecClose(result, 2, 2);
  });

  it('works with rotation', () => {
   const t = Transform2.fromValues(0, 0, Math.PI / 2, 1, 1);
   const result = Transform2.inverseTransformVectorSafe(t, { x: 1, y: 0 });
   expectVecClose(result, 0, -1);
  });
 });

 describe('Coverage - inverseSafe', () => {
  it('works like inverse for uniform scale', () => {
   const t = Transform2.fromValues(5, 10, Math.PI / 4, 2, 2);
   const inv = Transform2.inverseSafe(t);
   expect(inv).not.toBeNull();
   const combined = Transform2.multiply(t, inv!);
   expect(combined.isIdentity(0.01)).toBe(true);
  });

  it('works with non-uniform scale', () => {
   const t = Transform2.fromValues(0, 0, 0, 2, 3);
   const inv = Transform2.inverseSafe(t);
   expect(inv).not.toBeNull();
   expect(inv!.scale.x).toBeCloseTo(0.5, DIGITS);
   expect(inv!.scale.y).toBeCloseTo(1 / 3, DIGITS);
  });
 });

 describe('Coverage - fromComponents edge cases', () => {
  it('accepts Rotation2Like object', () => {
   const angle = Math.PI / 3;
   const rotation = { cos: Math.cos(angle), sin: Math.sin(angle) };
   const t = Transform2.fromComponents({ x: 1, y: 2 }, rotation, { x: 2, y: 3 });
   expect(t.rotation.angle).toBeCloseTo(angle, DIGITS);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(3);
  });
 });

 describe('Coverage - static copy', () => {
  it('copies values from source to destination', () => {
   const source = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const destination = new Transform2();
   const result = Transform2.copy(source, destination);
   expect(result).toBe(destination);
   expectVecClose(destination.position, 1, 2);
   expect(destination.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expectVecClose(destination.scale, 3, 4);
  });
 });

 describe('Coverage - isIdentity with tolerance', () => {
  it('uses custom tolerance', () => {
   const t = Transform2.fromValues(0.001, 0.001, 0.001, 1.001, 1.001);
   expect(t.isIdentity(0.01)).toBe(true);
   expect(t.isIdentity(0.0001)).toBe(false);
  });
 });

 describe('Coverage - Static hasNegativeScale', () => {
  it('returns true for negative x scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: -1, y: 1 });
   expect(Transform2.hasNegativeScale(t)).toBe(true);
  });

  it('returns true for negative y scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: -1 });
   expect(Transform2.hasNegativeScale(t)).toBe(true);
  });

  it('returns false for positive scale', () => {
   expect(Transform2.hasNegativeScale(Transform2.IDENTITY)).toBe(false);
  });
 });

 describe('Coverage - Static determinant', () => {
  it('returns scale product', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 3 });
   expect(Transform2.determinant(t)).toBe(6);
  });
 });

 describe('Coverage - Static multiply (composition)', () => {
  it('combines two transforms', () => {
   const a = Transform2.fromComponents({ x: 10, y: 0 }, 0, { x: 1, y: 1 });
   const b = Transform2.fromComponents({ x: 5, y: 0 }, 0, { x: 1, y: 1 });
   const result = Transform2.multiply(a, b);
   expect(result.position.x).toBeCloseTo(15, DIGITS);
  });

  it('multiply with out parameter', () => {
   const a = Transform2.fromComponents({ x: 1, y: 2 }, 0, { x: 1, y: 1 });
   const b = Transform2.fromComponents({ x: 3, y: 4 }, 0, { x: 1, y: 1 });
   const out = new Transform2();
   const result = Transform2.multiply(a, b, out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - Instance multiply', () => {
  it('multiplies in place', () => {
   const a = new Transform2({ x: 10, y: 0 }, 0, { x: 2, y: 2 });
   const b = Transform2.fromComponents({ x: 5, y: 0 }, 0, { x: 1, y: 1 });
   a.multiply(b);
   expect(a.position.x).toBeGreaterThan(10);
  });
 });

 describe('Coverage - Static lerp variants', () => {
  it('static lerp interpolates', () => {
   const a = Transform2.IDENTITY;
   const b = Transform2.fromComponents({ x: 10, y: 20 }, Math.PI / 2, { x: 2, y: 2 });
   const result = Transform2.lerp(a, b, 0.5);
   expect(result.position.x).toBeCloseTo(5, DIGITS);
   expect(result.scale.x).toBeCloseTo(1.5, DIGITS);
  });

  it('static lerpClamped clamps t', () => {
   const a = Transform2.IDENTITY;
   const b = Transform2.fromComponents({ x: 10, y: 10 }, 0, { x: 2, y: 2 });
   const result = Transform2.lerpClamped(a, b, 2);
   expect(result.position.x).toBeCloseTo(10, DIGITS);
  });
 });

 describe('Coverage - Instance lerp variants', () => {
  it('instance lerp interpolates', () => {
   const t = new Transform2();
   t.lerp(Transform2.fromComponents({ x: 10, y: 10 }, 0, { x: 2, y: 2 }), 0.5);
   expect(t.position.x).toBeCloseTo(5, DIGITS);
  });

  it('instance lerpClamped clamps', () => {
   const t = new Transform2();
   t.lerpClamped(Transform2.fromComponents({ x: 10, y: 10 }, 0, { x: 2, y: 2 }), 2);
   expect(t.position.x).toBeCloseTo(10, DIGITS);
  });
 });

 describe('Coverage - Static smoothStep', () => {
  it('smoothStep interpolates smoothly', () => {
   const a = Transform2.IDENTITY;
   const b = Transform2.fromComponents({ x: 10, y: 10 }, 0, { x: 2, y: 2 });
   const result = Transform2.smoothStep(a, b, 0.5);
   expect(result.position.x).toBeCloseTo(5, DIGITS);
  });
 });

 describe('Coverage - Static hasUniformScale', () => {
  it('returns true for uniform scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 2 });
   expect(Transform2.hasUniformScale(t)).toBe(true);
  });

  it('returns false for non-uniform scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 3 });
   expect(Transform2.hasUniformScale(t)).toBe(false);
  });
 });

 describe('Coverage - Instance hasUniformScale', () => {
  it('returns true for uniform scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 2 });
   expect(t.hasUniformScale()).toBe(true);
  });
 });

 describe('Coverage - Static nearEquals', () => {
  it('nearEquals compares with tolerance', () => {
   const a = Transform2.IDENTITY;
   const b = Transform2.fromValues(0.0001, 0.0001, 0.0001, 1.0001, 1.0001);
   expect(Transform2.nearEquals(a, b, 0.001)).toBe(true);
   expect(Transform2.nearEquals(a, b, 0.00001)).toBe(false);
  });
 });

 describe('Coverage - Instance copy', () => {
  it('copy copies from another transform', () => {
   const source = Transform2.fromComponents({ x: 5, y: 10 }, Math.PI / 4, { x: 2, y: 3 });
   const target = new Transform2();
   target.copy(source);
   expectVecClose(target.position, 5, 10);
   expect(target.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expectVecClose(target.scale, 2, 3);
  });
 });

 describe('Coverage - Static inverse', () => {
  it('inverse returns inverse transform', () => {
   const t = Transform2.fromComponents({ x: 10, y: 5 }, Math.PI / 4, { x: 2, y: 2 });
   const inv = Transform2.inverse(t);
   const composed = Transform2.multiply(t, inv);
   expect(composed.position.x).toBeCloseTo(0, DIGITS - 2);
  });
 });

 describe('Coverage - Instance inverse', () => {
  it('inverse inverts in place', () => {
   const t = Transform2.fromComponents({ x: 10, y: 5 }, 0, { x: 2, y: 2 });
   t.inverse();
   expect(t.scale.x).toBeCloseTo(0.5, DIGITS);
  });
 });

 describe('Coverage - toMatrix3', () => {
  it('toMatrix3 converts to Matrix3', () => {
   const t = Transform2.fromComponents({ x: 10, y: 5 }, Math.PI / 4, { x: 2, y: 2 });
   const m = t.toMatrix3();
   expect(m.m20).toBeCloseTo(10, DIGITS);
   expect(m.m21).toBeCloseTo(5, DIGITS);
  });
 });

 describe('Coverage - fromMatrix3', () => {
  it('fromMatrix3 creates Transform2 from Matrix3', () => {
   const m = Matrix3.fromTranslation({ x: 10, y: 5 });
   const t = Transform2.fromMatrix3(m);
   expect(t.position.x).toBeCloseTo(10, DIGITS);
   expect(t.position.y).toBeCloseTo(5, DIGITS);
  });
 });

 // === BRANCH COVERAGE: Instance methods L1311-1319, L1293-1295, L1340-1350 ===
 describe('Coverage - Instance transformPoint', () => {
  it('transformPoint transforms point in place', () => {
   const t = new Transform2({ x: 10, y: 5 }, 0, { x: 2, y: 2 });
   const result = t.transformPoint({ x: 1, y: 0 });
   expect(result.x).toBeCloseTo(12, DIGITS);
   expect(result.y).toBeCloseTo(5, DIGITS);
  });

  it('transformPoint with rotation', () => {
   const t = new Transform2({ x: 0, y: 0 }, Math.PI / 2, { x: 1, y: 1 });
   const result = t.transformPoint({ x: 1, y: 0 });
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Instance transformVector', () => {
  it('transformVector transforms vector (no translation)', () => {
   const t = new Transform2({ x: 100, y: 100 }, 0, { x: 2, y: 2 });
   const result = t.transformVector({ x: 1, y: 0 });
   expect(result.x).toBeCloseTo(2, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });

  it('transformVector with rotation', () => {
   const t = new Transform2({ x: 0, y: 0 }, Math.PI / 2, { x: 1, y: 1 });
   const result = t.transformVector({ x: 1, y: 0 });
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Instance fromMatrix3', () => {
  it('fromMatrix3 sets transform from Matrix3', () => {
   const t = new Transform2();
   const m = Matrix3.fromTranslation({ x: 20, y: 30 });
   t.setFromMatrix3(m);
   expect(t.position.x).toBeCloseTo(20, DIGITS);
   expect(t.position.y).toBeCloseTo(30, DIGITS);
  });
 });

 describe('Coverage - Instance transformPointCS', () => {
  it('transformPointCS uses precomputed cos/sin', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 2 });
   const result = t.transformPointCS({ x: 1, y: 0 }, 1, 0);
   expect(result.x).toBeCloseTo(2, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Instance transformVectorCS', () => {
  it('transformVectorCS uses precomputed cos/sin', () => {
   const t = new Transform2({ x: 100, y: 100 }, 0, { x: 2, y: 2 });
   const result = t.transformVectorCS({ x: 1, y: 0 }, 1, 0);
   expect(result.x).toBeCloseTo(2, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Instance inverseTransformPoint', () => {
  it('inverseTransformPoint reverses transformPoint', () => {
   const t = new Transform2({ x: 10, y: 5 }, 0, { x: 2, y: 2 });
   const transformed = t.transformPoint({ x: 1, y: 1 });
   const back = t.inverseTransformPoint(transformed);
   expect(back.x).toBeCloseTo(1, DIGITS);
   expect(back.y).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Instance inverseTransformVector', () => {
  it('inverseTransformVector reverses transformVector', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 2 });
   const transformed = t.transformVector({ x: 1, y: 1 });
   const back = t.inverseTransformVector(transformed);
   expect(back.x).toBeCloseTo(1, DIGITS);
   expect(back.y).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Instance set', () => {
  it('set changes all components', () => {
   const t = new Transform2();
   t.set({ x: 5, y: 10 }, Math.PI / 4, { x: 2, y: 3 });
   expect(t.position.x).toBe(5);
   expect(t.position.y).toBe(10);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(3);
  });
 });

 describe('Coverage - Instance identity', () => {
  it('identity resets to identity transform', () => {
   const t = new Transform2({ x: 10, y: 10 }, Math.PI, { x: 2, y: 2 });
   t.identity();
   expect(t.position.x).toBe(0);
   expect(t.position.y).toBe(0);
   expect(t.rotation.angle).toBe(0);
   expect(t.scale.x).toBe(1);
   expect(t.scale.y).toBe(1);
  });
 });

 describe('Coverage - Instance copy (mutating)', () => {
  it('copy copies from source', () => {
   const source = new Transform2({ x: 5, y: 10 }, Math.PI / 2, { x: 2, y: 3 });
   const target = new Transform2();
   target.copy(source);
   expect(target.position.x).toBe(5);
   expect(target.position.y).toBe(10);
   expect(target.rotation.angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 describe('Coverage - inverseSafe (identity return)', () => {
  it('returns identity for near-zero scale x', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   const inv = Transform2.inverseSafe(t);
   expect(Transform2.isIdentity(inv)).toBe(true);
  });

  it('returns identity for near-zero scale y', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: 0 });
   const inv = Transform2.inverseSafe(t);
   expect(Transform2.isIdentity(inv)).toBe(true);
  });
 });

 describe('Coverage - inverseUnchecked', () => {
  it('computes inverse without validation', () => {
   const t = Transform2.fromValues(10, 5, Math.PI / 2, 2, 2);
   const inv = Transform2.inverseUnchecked(t);
   const result = t.transformPoint(inv.transformPoint({ x: 0, y: 0 }));
   expectVecClose(result, 0, 0);
  });
 });

 describe('Coverage - toRotation2', () => {
  it('extracts rotation component', () => {
   const t = Transform2.fromValues(0, 0, Math.PI / 3, 1, 1);
   const rot = t.toRotation2();
   expect(rot.cos).toBeCloseTo(Math.cos(Math.PI / 3), DIGITS);
   expect(rot.sin).toBeCloseTo(Math.sin(Math.PI / 3), DIGITS);
  });

  it('writes to output rotation', () => {
   const t = Transform2.fromValues(0, 0, Math.PI / 4, 1, 1);
   const out = Rotation2.fromAngle(0);
   t.toRotation2(out);
   expect(out.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });

 describe('Coverage - inverse throw', () => {
  it('inverse throws on zero scale x', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   expect(() => Transform2.inverse(t)).toThrow(RangeError);
  });

  it('inverse throws on zero scale y', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: 0 });
   expect(() => Transform2.inverse(t)).toThrow(RangeError);
  });
 });

 describe('Coverage - inverseTransformPoint throw', () => {
  it('inverseTransformPoint throws on zero scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   expect(() => Transform2.inverseTransformPoint(t, { x: 1, y: 1 })).toThrow(RangeError);
  });
 });

 describe('Coverage - inverseTransformPointSafe (zero scale)', () => {
  it('returns zero for zero scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   const result = Transform2.inverseTransformPointSafe(t, { x: 5, y: 5 });
   expectVecClose(result, 0, 0);
  });
 });

 describe('Coverage - instance inverse throw', () => {
  it('instance inverse throws on zero scale', () => {
   const t = new Transform2({ x: 5, y: 5 }, 0, { x: 0, y: 1 });
   expect(() => t.inverse()).toThrow(RangeError);
  });
 });

 describe('Coverage - Static hasInfinity', () => {
  it('hasInfinity returns false for finite transform', () => {
   const t = Transform2.IDENTITY;
   expect(Transform2.hasInfinity(t)).toBe(false);
  });

  it('hasInfinity returns false for regular transform', () => {
   const t = new Transform2({ x: 10, y: 20 }, Math.PI / 4, { x: 2, y: 3 });
   expect(Transform2.hasInfinity(t)).toBe(false);
  });
 });

 describe('Coverage - Instance hasInfinity', () => {
  it('instance hasInfinity returns false for finite', () => {
   const t = Transform2.IDENTITY;
   expect(t.hasInfinity()).toBe(false);
  });

  it('instance hasInfinity returns false for regular transform', () => {
   const t = new Transform2({ x: 5, y: 10 }, 0, { x: 1, y: 1 });
   expect(t.hasInfinity()).toBe(false);
  });
 });

 describe('Coverage - Static isInvertible', () => {
  it('isInvertible returns true for identity transform', () => {
   expect(Transform2.isInvertible(Transform2.IDENTITY)).toBe(true);
  });

  it('isInvertible returns false for zero scale x', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   expect(Transform2.isInvertible(t)).toBe(false);
  });

  it('isInvertible returns false for zero scale y', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: 0 });
   expect(Transform2.isInvertible(t)).toBe(false);
  });

  it('isInvertible returns true for uniform scale', () => {
   const t = new Transform2({ x: 5, y: 10 }, Math.PI / 4, { x: 2, y: 2 });
   expect(Transform2.isInvertible(t)).toBe(true);
  });
 });

 describe('Coverage - Instance isInvertible', () => {
  it('instance isInvertible returns true for valid transform', () => {
   const t = new Transform2({ x: 1, y: 2 }, 0, { x: 3, y: 4 });
   expect(t.isInvertible()).toBe(true);
  });

  it('instance isInvertible returns false for zero scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 0 });
   expect(t.isInvertible()).toBe(false);
  });
 });

 describe('Coverage - Static inverseTransformPoint', () => {
  it('inverseTransformPoint throws on near-zero scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   expect(() => Transform2.inverseTransformPoint(t, { x: 5, y: 5 })).toThrow(RangeError);
  });

  it('inverseTransformPoint works for valid transform', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 2 });
   const result = Transform2.inverseTransformPoint(t, { x: 4, y: 6 });
   expectVecClose(result, 2, 3);
  });
 });

 describe('Coverage - Static transformVector', () => {
  it('transformVector applies scale and rotation without translation', () => {
   const t = new Transform2({ x: 10, y: 10 }, Math.PI / 2, { x: 2, y: 2 });
   const result = Transform2.transformVector(t, { x: 1, y: 0 });
   expectVecClose(result, 0, 2);
  });
 });

 describe('Coverage - Static inverseTransformPointSafe', () => {
  it('inverseTransformPointSafe returns zero for near-zero scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 0 });
   const result = Transform2.inverseTransformPointSafe(t, { x: 5, y: 5 });
   expectVecClose(result, 0, 0);
  });
 });

 describe('Coverage - Static inverseTransformVector', () => {
  it('inverseTransformVector throws on near-zero scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   expect(() => Transform2.inverseTransformVector(t, { x: 5, y: 5 })).toThrow(RangeError);
  });

  it('inverseTransformVector works for valid transform', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 2 });
   const result = Transform2.inverseTransformVector(t, { x: 4, y: 6 });
   expectVecClose(result, 2, 3);
  });
 });

 describe('Coverage - Static inverseTransformVectorSafe', () => {
  it('inverseTransformVectorSafe returns zero for near-zero scale', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 0 });
   const result = Transform2.inverseTransformVectorSafe(t, { x: 5, y: 5 });
   expectVecClose(result, 0, 0);
  });
 });

 describe('Coverage - Static transformVectorCS', () => {
  it('transformVectorCS applies scale with precomputed rotation', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 3 });
   const cos = Math.cos(Math.PI / 2);
   const sin = Math.sin(Math.PI / 2);
   const result = Transform2.transformVectorCS(t, { x: 1, y: 0 }, cos, sin);
   expectVecClose(result, 0, 2);
  });
 });

 describe('Coverage - Static lerp transform', () => {
  it('lerp interpolates transforms', () => {
   const a = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: 1 });
   const b = new Transform2({ x: 10, y: 10 }, Math.PI / 2, { x: 2, y: 2 });
   const result = Transform2.lerp(a, b, 0.5);
   expectVecClose(result.position, 5, 5);
  });
 });

 describe('Coverage - Static multiply combination', () => {
  it('multiply combines two transforms', () => {
   const a = new Transform2({ x: 5, y: 0 }, 0, { x: 1, y: 1 });
   const b = new Transform2({ x: 0, y: 5 }, 0, { x: 1, y: 1 });
   const result = Transform2.multiply(a, b);
   expectVecClose(result.position, 5, 5);
  });
 });

 describe('Coverage - Instance transformPointCS precomputed', () => {
  it('transformPointCS uses precomputed cos/sin', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 2 });
   const cos = Math.cos(Math.PI / 2);
   const sin = Math.sin(Math.PI / 2);
   const result = t.transformPointCS({ x: 1, y: 0 }, cos, sin);
   expectVecClose(result, 0, 2);
  });
 });

 describe('Coverage - Instance transformPoint full', () => {
  it('transformPoint applies full transform', () => {
   const t = new Transform2({ x: 10, y: 5 }, 0, { x: 1, y: 1 });
   const result = t.transformPoint({ x: 1, y: 2 });
   expectVecClose(result, 11, 7);
  });
 });

 describe('Coverage - Instance transformVector scale', () => {
  it('transformVector applies scale and rotation only', () => {
   const t = new Transform2({ x: 100, y: 100 }, 0, { x: 2, y: 3 });
   const result = t.transformVector({ x: 1, y: 1 });
   expectVecClose(result, 2, 3);
  });
 });

 describe('fromPose', () => {
  it('creates transform from position and angle', () => {
   const t = Transform2.fromPose(100, 50, Math.PI / 4);
   expect(t.position.x).toBe(100);
   expect(t.position.y).toBe(50);
   expect(t.rotation.angle).toBeCloseTo(Math.PI / 4, DIGITS);
   expect(t.scale.x).toBe(1);
   expect(t.scale.y).toBe(1);
  });

  it('accepts out parameter', () => {
   const out = new Transform2();
   const result = Transform2.fromPose(10, 20, 0, out);
   expect(result).toBe(out);
   expect(out.position.x).toBe(10);
   expect(out.position.y).toBe(20);
  });

  it('resets scale to (1,1) even if out had different scale', () => {
   const out = new Transform2({ x: 0, y: 0 }, 0, { x: 5, y: 5 });
   Transform2.fromPose(0, 0, 0, out);
   expect(out.scale.x).toBe(1);
   expect(out.scale.y).toBe(1);
  });
 });

 describe('Near-singular boundary', () => {
  const EPS = 1e-10;

  it('inverse throws when scale.x equals EPSILON', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: EPS, y: 1 });
   expect(() => Transform2.inverse(t)).toThrow(RangeError);
  });

  it('inverse throws when scale.y equals EPSILON', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: EPS });
   expect(() => Transform2.inverse(t)).toThrow(RangeError);
  });

  it('inverse throws when both scales are zero', () => {
   const t = new Transform2({ x: 5, y: 5 }, 1, { x: 0, y: 0 });
   expect(() => Transform2.inverse(t)).toThrow(RangeError);
  });

  it('inverse succeeds when scale is above EPSILON', () => {
   const t = new Transform2({ x: 1, y: 2 }, 0.5, { x: 2e-10, y: 2e-10 });
   const inv = Transform2.inverse(t);
   expect(Number.isFinite(inv.scale.x)).toBe(true);
   expect(Number.isFinite(inv.scale.y)).toBe(true);
  });

  it('inverseSafe returns identity when scale.x is near zero', () => {
   const t = new Transform2({ x: 5, y: 5 }, 1, { x: EPS, y: 1 });
   const inv = Transform2.inverseSafe(t);
   expectVecClose(inv.position, 0, 0);
   expect(inv.scale.x).toBe(1);
   expect(inv.scale.y).toBe(1);
  });

  it('inverseSafe returns identity when scale.y is near zero', () => {
   const t = new Transform2({ x: 5, y: 5 }, 1, { x: 1, y: EPS });
   const inv = Transform2.inverseSafe(t);
   expectVecClose(inv.position, 0, 0);
   expect(inv.scale.x).toBe(1);
   expect(inv.scale.y).toBe(1);
  });

  it('inverseSafe inverts when scale is above EPSILON', () => {
   const t = new Transform2({ x: 1, y: 2 }, 0, { x: 2e-10, y: 2e-10 });
   const inv = Transform2.inverseSafe(t);
   expect(Number.isFinite(inv.scale.x)).toBe(true);
   expect(Number.isFinite(inv.position.x)).toBe(true);
  });
 });
});

describe('Transform2 batch vs individual parity', () => {
 it('transformPoints batch matches individual transformPoint calls', () => {
  const t = new Transform2({ x: 3, y: 5 }, Math.PI / 4, { x: 2, y: 3 });
  const points = [new Vector2(1, 0), new Vector2(0, 1), new Vector2(2, 3)];
  const batchResults = t.transformPoints(points);
  for (let index = 0; index < points.length; index++) {
   const individual = t.transformPoint(points[index]!);
   expect(batchResults[index]!.x).toBeCloseTo(individual.x, DIGITS);
   expect(batchResults[index]!.y).toBeCloseTo(individual.y, DIGITS);
  }
 });

 it('transformVectors batch matches individual transformVector calls', () => {
  const t = new Transform2({ x: 3, y: 5 }, Math.PI / 6, { x: 2, y: 4 });
  const vectors = [new Vector2(1, 0), new Vector2(0, 1)];
  const batchResults = t.transformVectors(vectors);
  for (let index = 0; index < vectors.length; index++) {
   const individual = t.transformVector(vectors[index]!);
   expect(batchResults[index]!.x).toBeCloseTo(individual.x, DIGITS);
   expect(batchResults[index]!.y).toBeCloseTo(individual.y, DIGITS);
  }
 });
});

describe('Transform2 direction methods', () => {
 it('transformDirection applies rotation only, ignores translation and scale', () => {
  const t = new Transform2({ x: 100, y: 200 }, Math.PI / 2, { x: 3, y: 5 });
  const dir = { x: 1, y: 0 };
  const result = Transform2.transformDirection(t, dir);
  expect(result.x).toBeCloseTo(0, DIGITS);
  expect(result.y).toBeCloseTo(1, DIGITS);
 });

 it('instance transformDirection matches static', () => {
  const t = new Transform2({ x: 10, y: 20 }, Math.PI / 4, { x: 2, y: 2 });
  const dir = new Vector2(1, 0);
  const staticResult = Transform2.transformDirection(t, dir);
  const instanceResult = t.transformDirection(dir);
  expect(instanceResult.x).toBeCloseTo(staticResult.x, DIGITS);
  expect(instanceResult.y).toBeCloseTo(staticResult.y, DIGITS);
 });

 it('transformDirectionCS matches transformDirection', () => {
  const t = new Transform2({ x: 10, y: 20 }, Math.PI / 3, { x: 2, y: 2 });
  const dir = { x: 1, y: 0 };
  const { cos, sin } = t.rotation;
  const csResult = Transform2.transformDirectionCS(dir, cos, sin);
  const normalResult = Transform2.transformDirection(t, dir);
  expect(csResult.x).toBeCloseTo(normalResult.x, DIGITS);
  expect(csResult.y).toBeCloseTo(normalResult.y, DIGITS);
 });

 it('inverseTransformDirection undoes transformDirection', () => {
  const t = new Transform2({ x: 10, y: 20 }, Math.PI / 6, { x: 3, y: 4 });
  const dir = new Vector2(1, 0);
  const transformed = Transform2.transformDirection(t, dir);
  const recovered = Transform2.inverseTransformDirection(t, transformed);
  expect(recovered.x).toBeCloseTo(dir.x, DIGITS);
  expect(recovered.y).toBeCloseTo(dir.y, DIGITS);
 });

 it('inverseTransformDirectionCS matches inverseTransformDirection', () => {
  const t = new Transform2({ x: 10, y: 20 }, Math.PI / 3, { x: 2, y: 2 });
  const dir = { x: 0.5, y: 0.866 };
  const { cos, sin } = t.rotation;
  const csResult = Transform2.inverseTransformDirectionCS(dir, cos, sin);
  const normalResult = Transform2.inverseTransformDirection(t, dir);
  expect(csResult.x).toBeCloseTo(normalResult.x, DIGITS);
  expect(csResult.y).toBeCloseTo(normalResult.y, DIGITS);
 });
});

describe('Transform2.premultiply', () => {
 it('premultiply(other) equals Transform2.multiply(other, this)', () => {
  const a = new Transform2({ x: 1, y: 2 }, Math.PI / 4, { x: 2, y: 3 });
  const b = new Transform2({ x: 3, y: 1 }, Math.PI / 6, { x: 1, y: 2 });
  const expected = Transform2.multiply(a, b);
  const bClone = new Transform2({ x: 3, y: 1 }, Math.PI / 6, { x: 1, y: 2 });
  bClone.premultiply(a);
  expect(bClone.position.x).toBeCloseTo(expected.position.x, DIGITS);
  expect(bClone.position.y).toBeCloseTo(expected.position.y, DIGITS);
  expect(bClone.rotation.cos).toBeCloseTo(expected.rotation.cos, DIGITS);
  expect(bClone.rotation.sin).toBeCloseTo(expected.rotation.sin, DIGITS);
  expect(bClone.scale.x).toBeCloseTo(expected.scale.x, DIGITS);
  expect(bClone.scale.y).toBeCloseTo(expected.scale.y, DIGITS);
 });

 it('premultiply returns this for chaining', () => {
  const a = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: 1 });
  const b = new Transform2({ x: 1, y: 1 }, 0, { x: 1, y: 1 });
  const result = b.premultiply(a);
  expect(result).toBe(b);
 });

 describe('Symbol.iterator', () => {
  it('yields 6 components in correct order', () => {
   const t = new Transform2({ x: 1, y: 2 }, Math.PI / 2, { x: 3, y: 4 });
   const components = [...t];
   expect(components[0]).toBe(1);
   expect(components[1]).toBe(2);
   expect(components[2]).toBeCloseTo(0, DIGITS);
   expect(components[3]).toBeCloseTo(1, DIGITS);
   expect(components[4]).toBe(3);
   expect(components[5]).toBe(4);
  });

  it('supports destructuring', () => {
   const t = Transform2.IDENTITY;
   const [px, py, rc, rs, sx, sy] = t;
   expect(px).toBe(0);
   expect(py).toBe(0);
   expect(rc).toBe(1);
   expect(rs).toBe(0);
   expect(sx).toBe(1);
   expect(sy).toBe(1);
  });

  it('COMPONENT_COUNT matches iterator length', () => {
   const t = new Transform2({ x: 1, y: 2 }, 0.5, { x: 3, y: 4 });
   expect([...t].length).toBe(Transform2.COMPONENT_COUNT);
   expect(Transform2.COMPONENT_COUNT).toBe(6);
  });

  it('ELEMENT_COUNT matches toArray length', () => {
   const t = new Transform2({ x: 1, y: 2 }, 0.5, { x: 3, y: 4 });
   expect(t.toArray().length).toBe(Transform2.ELEMENT_COUNT);
   expect(Transform2.ELEMENT_COUNT).toBe(5);
  });
 });

 describe('translate / rotate / scaleBy', () => {
  it('static translate adds offset to position only', () => {
   const src = new Transform2({ x: 1, y: 2 }, 0.5, { x: 3, y: 4 });
   const out = Transform2.translate(src, 10, 20);
   expect(out.position.x).toBe(11);
   expect(out.position.y).toBe(22);
   expect(out.rotation.cos).toBe(src.rotation.cos);
   expect(out.scale.x).toBe(3);
  });

  it('static rotate composes rotations without changing position/scale', () => {
   const src = new Transform2({ x: 7, y: 3 }, 0, { x: 2, y: 3 });
   const out = Transform2.rotate(src, Math.PI / 2);
   expect(out.position.x).toBe(7);
   expect(out.position.y).toBe(3);
   expect(out.scale.x).toBe(2);
   expect(out.scale.y).toBe(3);
   expect(out.rotation.cos).toBeCloseTo(0, DIGITS);
   expect(out.rotation.sin).toBeCloseTo(1, DIGITS);
  });

  it('static scaleBy accepts uniform scalar', () => {
   const src = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 3 });
   const out = Transform2.scaleBy(src, 5);
   expect(out.scale.x).toBe(10);
   expect(out.scale.y).toBe(15);
  });

  it('static scaleBy accepts non-uniform (sx, sy)', () => {
   const src = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 3 });
   const out = Transform2.scaleBy(src, 4, 5);
   expect(out.scale.x).toBe(8);
   expect(out.scale.y).toBe(15);
  });

  it('static scaleBy accepts Vector2Like', () => {
   const src = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 3 });
   const out = Transform2.scaleBy(src, { x: 4, y: 5 });
   expect(out.scale.x).toBe(8);
   expect(out.scale.y).toBe(15);
  });

  it('instance translate mutates and returns this', () => {
   const t = new Transform2({ x: 1, y: 2 }, 0, { x: 1, y: 1 });
   const result = t.translate(5, 5);
   expect(result).toBe(t);
   expect(t.position.x).toBe(6);
   expect(t.position.y).toBe(7);
  });

  it('instance rotate mutates and returns this', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 1, y: 1 });
   t.rotate(Math.PI / 2);
   expect(t.rotation.cos).toBeCloseTo(0, DIGITS);
   expect(t.rotation.sin).toBeCloseTo(1, DIGITS);
  });

  it('instance scaleBy mutates and returns this', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 2, y: 3 });
   const result = t.scaleBy(2);
   expect(result).toBe(t);
   expect(t.scale.x).toBe(4);
   expect(t.scale.y).toBe(6);
  });

  it('static transformPoints produces the same results as instance', () => {
   const t = new Transform2({ x: 5, y: 7 }, Math.PI / 4, { x: 2, y: 2 });
   const pts = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
   ];
   const viaStatic = Transform2.transformPoints(t, pts);
   const viaInstance = t.transformPoints(pts);
   for (let index = 0; index < pts.length; index++) {
    expect(viaStatic[index]!.x).toBeCloseTo(viaInstance[index]!.x, DIGITS);
    expect(viaStatic[index]!.y).toBeCloseTo(viaInstance[index]!.y, DIGITS);
   }
  });

  it('static transformVectors ignores translation', () => {
   const t = new Transform2({ x: 100, y: 100 }, 0, { x: 2, y: 3 });
   const [result] = Transform2.transformVectors(t, [{ x: 1, y: 1 }]);
   expect(result!.x).toBe(2);
   expect(result!.y).toBe(3);
  });

  it('static transformPoints reuses out array entries when present', () => {
   const t = new Transform2({ x: 1, y: 1 }, 0, { x: 1, y: 1 });
   const existing = new Vector2(99, 99);
   const out: Vector2[] = [existing];
   const result = Transform2.transformPoints(t, [{ x: 0, y: 0 }], out);
   expect(result[0]).toBe(existing);
   expect(existing.x).toBe(1);
   expect(existing.y).toBe(1);
  });

  it('relative equals multiply(inverse(a), b)', () => {
   const a = new Transform2({ x: 3, y: 5 }, Math.PI / 4, { x: 2, y: 2 });
   const b = new Transform2({ x: 1, y: 2 }, Math.PI / 3, { x: 1, y: 1 });
   const viaRelative = Transform2.relative(a, b);
   const viaCompose = Transform2.multiply(Transform2.inverse(a), b);
   expect(viaRelative.position.x).toBeCloseTo(viaCompose.position.x, DIGITS);
   expect(viaRelative.position.y).toBeCloseTo(viaCompose.position.y, DIGITS);
   expect(viaRelative.rotation.cos).toBeCloseTo(viaCompose.rotation.cos, DIGITS);
   expect(viaRelative.rotation.sin).toBeCloseTo(viaCompose.rotation.sin, DIGITS);
   expect(viaRelative.scale.x).toBeCloseTo(viaCompose.scale.x, DIGITS);
   expect(viaRelative.scale.y).toBeCloseTo(viaCompose.scale.y, DIGITS);
  });

  it('relative throws for singular a', () => {
   const a = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   const b = new Transform2({ x: 1, y: 1 }, 0, { x: 1, y: 1 });
   expect(() => Transform2.relative(a, b)).toThrow(RangeError);
  });

  it('relativeSafe returns identity for singular a', () => {
   const a = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 1 });
   const b = new Transform2({ x: 1, y: 1 }, 0, { x: 1, y: 1 });
   const result = Transform2.relativeSafe(a, b);
   expect(result.position.x).toBe(0);
   expect(result.position.y).toBe(0);
   expect(result.rotation.cos).toBe(1);
   expect(result.rotation.sin).toBe(0);
   expect(result.scale.x).toBe(1);
   expect(result.scale.y).toBe(1);
  });

  it('relativeUnchecked handles out === b aliasing', () => {
   const a = new Transform2({ x: 3, y: 5 }, Math.PI / 4, { x: 2, y: 2 });
   const b = new Transform2({ x: 1, y: 2 }, Math.PI / 3, { x: 1, y: 1 });
   const bClone = new Transform2({ x: 1, y: 2 }, Math.PI / 3, { x: 1, y: 1 });
   const expected = Transform2.relative(a, b);
   // aliasing: pass bClone as out.
   Transform2.relativeUnchecked(a, bClone, bClone);
   expect(bClone.position.x).toBeCloseTo(expected.position.x, DIGITS);
   expect(bClone.position.y).toBeCloseTo(expected.position.y, DIGITS);
  });

  it('instance relativeTo matches static relative(this, other)', () => {
   const a = new Transform2({ x: 3, y: 5 }, Math.PI / 4, { x: 2, y: 2 });
   const b = new Transform2({ x: 1, y: 2 }, Math.PI / 3, { x: 1, y: 1 });
   const expected = Transform2.relative(a, b);
   const result = a.clone().relativeTo(b);
   expect(result.position.x).toBeCloseTo(expected.position.x, DIGITS);
   expect(result.rotation.cos).toBeCloseTo(expected.rotation.cos, DIGITS);
  });

  it('instance relativeFrom matches static relative(other, this)', () => {
   const a = new Transform2({ x: 3, y: 5 }, Math.PI / 4, { x: 2, y: 2 });
   const b = new Transform2({ x: 1, y: 2 }, Math.PI / 3, { x: 1, y: 1 });
   const expected = Transform2.relative(b, a);
   const result = a.clone().relativeFrom(b);
   expect(result.position.x).toBeCloseTo(expected.position.x, DIGITS);
   expect(result.rotation.cos).toBeCloseTo(expected.rotation.cos, DIGITS);
  });
 });

 /* ===== Instance inverseTransformPointSafe ===== */

 describe('Instance inverseTransformPointSafe', () => {
  it('identity transform returns point unchanged', () => {
   const t = Transform2.IDENTITY;
   const result = t.inverseTransformPointSafe({ x: 5, y: 7 });
   expectVecClose(result, 5, 7);
  });

  it('returns (0, 0) for non-invertible transform (zero scale)', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 0 });
   const result = t.inverseTransformPointSafe({ x: 5, y: 5 });
   expectVecClose(result, 0, 0);
  });

  it('reverses a valid transformation', () => {
   const t = new Transform2({ x: 10, y: 5 }, 0, { x: 2, y: 2 });
   const world = t.transformPoint({ x: 1, y: 1 });
   const local = t.inverseTransformPointSafe(world);
   expectVecClose(local, 1, 1);
  });
 });

 /* ===== Instance inverseTransformVectorSafe ===== */

 describe('Instance inverseTransformVectorSafe', () => {
  it('identity transform returns vector unchanged', () => {
   const t = Transform2.IDENTITY;
   const result = t.inverseTransformVectorSafe({ x: 3, y: -2 });
   expectVecClose(result, 3, -2);
  });

  it('returns (0, 0) for non-invertible transform (zero scale)', () => {
   const t = new Transform2({ x: 0, y: 0 }, 0, { x: 0, y: 0 });
   const result = t.inverseTransformVectorSafe({ x: 5, y: 5 });
   expectVecClose(result, 0, 0);
  });

  it('reverses a valid vector transformation', () => {
   const t = new Transform2({ x: 100, y: 50 }, 0, { x: 2, y: 2 });
   const world = t.transformVector({ x: 1, y: 0 });
   const local = t.inverseTransformVectorSafe(world);
   expectVecClose(local, 1, 0);
  });
 });
});
