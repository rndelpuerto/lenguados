import { describe, expect, it } from '@jest/globals';

import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

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
   expect(transform.rotation).toBeCloseTo(Math.PI / 2, DIGITS);
   expectVecClose(transform.scale, 3, 4);
  });

  it('fromComponents accepts scalar scale and Rotation2', () => {
   const transform = Transform2.fromComponents(new Vector2(2, 3), Math.PI / 4, 5);
   expectVecClose(transform.position, 2, 3);
   expect(transform.rotation).toBeCloseTo(Math.PI / 4, DIGITS);
   expect(transform.scale.x).toBeCloseTo(5, DIGITS);
   expect(transform.scale.y).toBeCloseTo(5, DIGITS);
  });

  it('fromObject sanitizes components', () => {
   const transform = Transform2.fromObject({
    position: { x: 4, y: -2 },
    rotation: Math.PI,
    scale: { x: 2, y: 3 },
   });
   expectVecClose(transform.position, 4, -2);
   expect(Math.abs(transform.rotation)).toBeCloseTo(Math.PI, DIGITS);
   expectVecClose(transform.scale, 2, 3);
  });

  it('fromMatrix round-trips toMatrix', () => {
   const original = Transform2.fromValues(5, -3, Math.PI / 3, 2, 1.5);
   const matrix = original.toMatrix();
   const reconstructed = Transform2.fromMatrix(matrix);
   expect(reconstructed.nearEquals(original, 1e-6)).toBe(true);
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
   const combined = parent.multiply(child, new Transform2());
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
   const inverse = transform.clone().inverse(new Transform2());
   const testPoint = new Vector2(5, 7);
   const transformed = transform.transformPoint(testPoint);
   const restored = inverse.transformPoint(transformed);
   expectVecClose(restored, testPoint.x, testPoint.y, 4);
  });
 });

 describe('Interpolation', () => {
  it('lerp interpolates position, rotation, and scale deterministically', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(10, 10, Math.PI, 3, 5);
   const mid = start.clone().lerp(end, 0.5);
   expectVecClose(mid.position, 5, 5);
   expect(Math.abs(mid.rotation)).toBeCloseTo(Math.PI / 2, DIGITS);
   expectVecClose(mid.scale, 2, 3);
  });

  it('lerp allows extrapolation (does NOT clamp t)', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(0, 0, Math.PI / 2, 2, 2);
   // With t=2, should extrapolate beyond end (PI or -PI, equivalent)
   const over = start.clone().lerp(end, 2);
   expect(Math.abs(over.rotation)).toBeCloseTo(Math.PI, DIGITS);
   expectVecClose(over.scale, 3, 3); // 1 + 2*(2-1) = 3
   // With t=-1, should extrapolate before start
   const under = start.clone().lerp(end, -1);
   expect(under.rotation).toBeCloseTo(-Math.PI / 2, DIGITS);
   expectVecClose(under.scale, 0, 0); // 1 + (-1)*(2-1) = 0
  });

  it('lerpClamped clamps interpolation factor to [0, 1]', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(0, 0, Math.PI, 2, 2);
   const under = start.clone().lerpClamped(end, -1);
   const over = start.clone().lerpClamped(end, 2);
   expect(under.rotation).toBeCloseTo(0, DIGITS);
   expectVecClose(under.scale, 1, 1);
   expect(Math.abs(over.rotation)).toBeCloseTo(Math.PI, DIGITS);
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

  it('nearEquals handles angular wrap-around at ±π boundary', () => {
   // Rotations near +π and -π should be considered equal
   const nearPiPositive = Transform2.fromValues(0, 0, Math.PI - 1e-11, 1, 1);
   const nearPiNegative = Transform2.fromValues(0, 0, -Math.PI + 1e-11, 1, 1);
   expect(nearPiPositive.nearEquals(nearPiNegative, 1e-6)).toBe(true);

   // Static method should also work
   expect(Transform2.nearEquals(nearPiPositive, nearPiNegative, 1e-6)).toBe(true);

   // Rotations that are truly different should not be equal
   const quarterTurn = Transform2.fromValues(0, 0, Math.PI / 2, 1, 1);
   expect(nearPiPositive.nearEquals(quarterTurn, 1e-6)).toBe(false);
  });

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
   expect(object.rotation).toBeCloseTo(Math.PI / 6, DIGITS);
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
   expect(t.rotation).toBeCloseTo(Math.PI / 2, DIGITS);
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
   expect(mid.rotation).toBeCloseTo(Math.PI / 4, DIGITS);
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
   expect(t.rotation).toBe(0);
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
   const m = t.toMatrix();
   expect(m.m20).toBe(10);
   expect(m.m21).toBe(20);
  });

  it('fromMatrix reconstructs from matrix', () => {
   const original = Transform2.fromValues(5, 10, Math.PI / 4, 2, 2);
   const m = original.toMatrix();
   const reconstructed = new Transform2();
   reconstructed.fromMatrix(m);
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
   expect(t.rotation).toBeCloseTo(Math.PI / 4);
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
   expect(target.rotation).toBeCloseTo(Math.PI / 4);
   expect(target.scale.y).toBe(3);
  });

  it('identity resets to identity transform', () => {
   const t = Transform2.fromValues(5, 10, Math.PI / 4, 2, 3);
   t.identity();
   expect(t.position.x).toBe(0);
   expect(t.position.y).toBe(0);
   expect(t.rotation).toBe(0);
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
   const m = t.toMatrix();
   expect(m.m20).toBe(5); // translation x
   expect(m.m21).toBe(10); // translation y
  });

  it('fromMatrix extracts transform from matrix', () => {
   const original = Transform2.fromValues(5, 10, Math.PI / 4, 2, 2);
   const matrix = original.toMatrix();
   const reconstructed = new Transform2();
   reconstructed.fromMatrix(matrix);
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
   expect(t.rotation).toBe(0);
   expect(t.scale.x).toBe(1);
  });
 });

 describe('fromArray / toArray', () => {
  it('creates transform from array', () => {
   const t = Transform2.fromArray([100, 50, Math.PI / 4, 2, 3]);
   expect(t.position.x).toBe(100);
   expect(t.position.y).toBe(50);
   expect(t.rotation).toBeCloseTo(Math.PI / 4, DIGITS);
   expect(t.scale.x).toBe(2);
   expect(t.scale.y).toBe(3);
  });

  it('supports offset parameter', () => {
   const t = Transform2.fromArray([999, 10, 20, Math.PI / 2, 1.5, 2.5, 888], 1);
   expect(t.position.x).toBe(10);
   expect(t.position.y).toBe(20);
   expect(t.rotation).toBeCloseTo(Math.PI / 2, DIGITS);
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
   t.rotation = Infinity;
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
   t.rotation = NaN;
   expect(t.hasNaN()).toBe(true);
  });

  it('hasNaN returns true for NaN in scale', () => {
   const t = new Transform2();
   t.scale.y = NaN;
   expect(t.hasNaN()).toBe(true);
  });
 });
});
