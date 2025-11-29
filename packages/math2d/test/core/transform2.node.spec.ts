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
   expect(reconstructed.equals(original, 1e-6)).toBe(true);
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

  it('lerp clamps interpolation factor via saturate', () => {
   const start = Transform2.fromValues(0, 0, 0, 1, 1);
   const end = Transform2.fromValues(0, 0, Math.PI, 2, 2);
   const under = start.clone().lerp(end, -1);
   const over = start.clone().lerp(end, 2);
   expect(under.rotation).toBeCloseTo(0, DIGITS);
   expectVecClose(under.scale, 1, 1);
   expect(Math.abs(over.rotation)).toBeCloseTo(Math.PI, DIGITS);
   expectVecClose(over.scale, 2, 2);
  });
 });

 describe('Queries & helpers', () => {
  it('equals compares components with tolerance', () => {
   const a = Transform2.fromValues(1, 2, Math.PI / 4, 3, 4);
   const b = Transform2.fromValues(1 + 1e-11, 2, Math.PI / 4 + 1e-11, 3, 4);
   expect(a.equals(b, 1e-6)).toBe(true);
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
 });
});
