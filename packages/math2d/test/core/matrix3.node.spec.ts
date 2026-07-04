/**
 * @file test/core/matrix3.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Tests for Matrix3 core behavior.
 */

import { describe, expect, it } from '@jest/globals';

import { Matrix2 } from '../../src/core/matrix2';
import { Matrix3 } from '../../src/core/matrix3';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

// DIGITS = 10 matches EPSILON = 1e-10 — the library's documented tolerance
const DIGITS = 10;

function expectVecClose(vector: Vector2, x: number, y: number, digits = DIGITS): void {
 expect(vector.x).toBeCloseTo(x, digits);
 expect(vector.y).toBeCloseTo(y, digits);
}

function expectMatTranslation(matrix: Matrix3, tx: number, ty: number): void {
 expect(matrix.m20).toBeCloseTo(tx, DIGITS);
 expect(matrix.m21).toBeCloseTo(ty, DIGITS);
 expect(matrix.m22).toBeCloseTo(1, DIGITS);
}

describe('Matrix3', () => {
 describe('Factories', () => {
  it('fromTranslation sets translation column', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTranslation(new Vector2(3, 5));
   expectMatTranslation(mat, 3, 5);
  });

  it('fromRotation uses deterministic trig', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromRotation(Math.PI / 2);
   expect(mat.m00).toBeCloseTo(0, DIGITS);
   expect(mat.m01).toBeCloseTo(1, DIGITS);
   expect(mat.m10).toBeCloseTo(-1, DIGITS);
   expect(mat.m11).toBeCloseTo(0, DIGITS);
  });

  it('fromTransform composes translation/rotation/scale', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTransform2(new Vector2(10, -4), Math.PI / 4, new Vector2(2, 1));
   expectMatTranslation(mat, 10, -4);
   expect(mat.isAffine()).toBe(true);
  });

  it('fromMatrix2 promotes 2x2 block', () => {
   expect.hasAssertions();
   const mat2 = Matrix3.fromMatrix2(Matrix3.IDENTITY as unknown as Matrix3);
   expect(mat2.m22).toBe(1);
   expect(mat2.m02).toBe(0);
  });

  it('fromAffine embeds linear 2x2 and translation', () => {
   expect.hasAssertions();
   const linear = new Matrix2(2, 0, 0, 3);
   const result = Matrix3.fromAffine(linear, { x: 10, y: 20 });
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(0);
   expect(result.m02).toBe(0);
   expect(result.m10).toBe(0);
   expect(result.m11).toBe(3);
   expect(result.m12).toBe(0);
   expect(result.m20).toBe(10);
   expect(result.m21).toBe(20);
   expect(result.m22).toBe(1);
   expect(result.isAffine()).toBe(true);
  });

  it('fromAffine transforms a point as linear · p + translation', () => {
   expect.hasAssertions();
   const linear = new Matrix2(2, 0, 0, 3);
   const affine = Matrix3.fromAffine(linear, { x: 5, y: 7 });
   const p = affine.transformPoint({ x: 1, y: 1 });
   expect(p.x).toBeCloseTo(7, DIGITS); // 2·1 + 5
   expect(p.y).toBeCloseTo(10, DIGITS); // 3·1 + 7
  });

  it('fromArray supports row-major inputs and validates bounds', () => {
   expect.hasAssertions();
   const columnMajor = Matrix3.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   expect(columnMajor.m00).toBe(1);
   expect(columnMajor.m11).toBe(5);
   expect(columnMajor.m22).toBe(9);

   const rowMajor = Matrix3.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 0, false);
   expect(rowMajor.m00).toBe(1);
   expect(rowMajor.m10).toBe(2);
   expect(rowMajor.m20).toBe(3);

   expect(() => Matrix3.fromArray([1, 2, 3], 2)).toThrow(RangeError);
  });
 });

 describe('Static vs instance operations', () => {
  it('multiply mutates instance and Matrix3.multiply stays pure', () => {
   expect.hasAssertions();
   const a = Matrix3.fromTranslation(new Vector2(2, 0));
   const b = Matrix3.fromTranslation(new Vector2(0, 3));
   const returned = a.multiply(b);
   expect(returned).toBe(a);
   expectMatTranslation(a, 2, 3);

   const staticResult = Matrix3.multiply(
    Matrix3.fromTranslation(new Vector2(2, 0)),
    Matrix3.fromTranslation(new Vector2(0, 3)),
   );
   expectMatTranslation(staticResult, 2, 3);
  });

  it('inverse produces matrix that yields identity when multiplied', () => {
   expect.hasAssertions();
   const transform = Matrix3.fromTransform2(new Vector2(5, -2), Math.PI / 3, 2);
   const inv = Matrix3.inverse(transform, new Matrix3());
   const composed = Matrix3.multiply(transform, inv);
   expect(composed.isIdentity()).toBe(true);
  });

  it('inverse throws for singular matrices', () => {
   expect.hasAssertions();
   expect(() => Matrix3.inverse(Matrix3.ZERO)).toThrow('Matrix3.inverse: matrix is singular');
  });
 });

 describe('Transform application', () => {
  it('transformPoint applies translation and scale', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTransform2(new Vector2(10, 5), 0, new Vector2(2, 3));
   const result = mat.transformPoint(new Vector2(2, 2));
   expectVecClose(result, 14, 11);
  });

  it('transformVector ignores translation', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTransform2(new Vector2(100, 200), Math.PI / 2, 1);
   const vector = mat.transformVector(new Vector2(1, 0));
   expectVecClose(vector, 0, 1);
  });

  it('translate/rotate/scaleBy mutate instance', () => {
   expect.hasAssertions();
   const mat = new Matrix3()
    .translate(new Vector2(1, 2))
    .rotate(Math.PI / 2)
    .scaleBy(new Vector2(2, 3));
   expectMatTranslation(mat, 1, 2);
   expect(mat.m00).toBeCloseTo(0, DIGITS);
   expect(mat.m11).toBeCloseTo(0, DIGITS);
  });

  it('transformPoint performs homogeneous divide when w != 1', () => {
   expect.hasAssertions();
   const perspective = new Matrix3(1, 0, 0.5, 0, 1, 0, 0, 0, 2);
   const result = Matrix3.transformPoint(perspective, new Vector2(2, 0));
   // w = 0.5 * 2 + 2 = 3 -> x' = (1*2 +0+0)/3 = 2/3, y' = 0
   expectVecClose(result, 2 / 3, 0);
  });

  // V9-Matrix3-01: projective w ≈ 0 collapse documented — transformed point = origin
  it('transformPoint collapses to origin when projective w ≈ 0 (V9-Matrix3-01)', () => {
   // Construct a perspective matrix where m02*x + m12*y + m22 ≈ 0 for the test point
   // m02 = -1, m12 = 0, m22 = 1, point = (1, 0) → w = -1 + 0 + 1 = 0
   const nearPlane = new Matrix3(2, 0, -1, 0, 3, 0, 0, 0, 1);
   const result = Matrix3.transformPoint(nearPlane, new Vector2(1, 0));
   // divideSafe(1, 0) = 0 → x' = (2*1)*0 = 0, y' = 0
   expect(result.x).toBe(0);
   expect(result.y).toBe(0);
  });

  it('transformVector writes into provided out parameter', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromScale(2);
   const out = new Vector2();
   const returned = Matrix3.transformVector(mat, new Vector2(1, 2), out);
   expect(returned).toBe(out);
   expectVecClose(out, 2, 4);
  });
 });

 describe('Queries', () => {
  it('getTranslation/getScale/getRotation report components', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTransform2(new Vector2(7, -3), Math.PI / 4, new Vector2(3, 4));
   const translation = mat.getTranslation();
   expectVecClose(translation, 7, -3);

   const scale = mat.getScale();
   expectVecClose(scale, 3, 4);

   expect(mat.getRotation()).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('isIdentity checks for identity matrix', () => {
   expect.hasAssertions();
   expect(Matrix3.IDENTITY.isIdentity()).toBe(true);
   expect(Matrix3.fromTranslation(new Vector2(1, 0)).isIdentity()).toBe(false);
  });

  it('isAffine checks last row', () => {
   expect.hasAssertions();
   const affine = Matrix3.fromTranslation(new Vector2(5, 10));
   expect(affine.isAffine()).toBe(true);
  });

  it('determinant computes correctly', () => {
   expect.hasAssertions();
   expect(Matrix3.determinant(Matrix3.IDENTITY)).toBe(1);
   expect(Matrix3.determinant(Matrix3.ZERO)).toBe(0);
  });
 });

 describe('Clone and copy', () => {
  it('clone creates independent copy', () => {
   expect.hasAssertions();
   const original = Matrix3.fromTranslation(new Vector2(5, 10));
   const cloned = original.clone();
   expect(cloned.m20).toBe(original.m20);
   expect(cloned).not.toBe(original);
  });

  it('copy copies from source', () => {
   expect.hasAssertions();
   const source = Matrix3.fromRotation(Math.PI / 3);
   const target = new Matrix3();
   target.copy(source);
   expect(target.m00).toBe(source.m00);
  });
 });

 describe('Conversion', () => {
  it('toArray returns column-major array', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTranslation(new Vector2(1, 2));
   const array = mat.toArray();
   expect(array).toHaveLength(9);
   expect(array[6]).toBeCloseTo(1, DIGITS); // m20 = translation x
   expect(array[7]).toBeCloseTo(2, DIGITS); // m21 = translation y
  });

  it('toObject returns plain object', () => {
   expect.hasAssertions();
   const mat = Matrix3.IDENTITY;
   const object = mat.toObject();
   expect(object.m00).toBe(1);
   expect(object.m11).toBe(1);
   expect(object.m22).toBe(1);
  });

  it('toString returns formatted string', () => {
   expect.hasAssertions();
   const mat = Matrix3.IDENTITY;
   expect(mat.toString()).toContain('Matrix3');
  });
 });

 describe('Equality', () => {
  it('equals checks component equality', () => {
   expect.hasAssertions();
   const a = Matrix3.fromTranslation(new Vector2(5, 10));
   const b = Matrix3.fromTranslation(new Vector2(5, 10));
   expect(a.exactEquals(b)).toBe(true);
  });
 });

 describe('Static Methods - Additional', () => {
  it('transformPoint transforms a point', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTranslation(new Vector2(10, 20));
   const result = Matrix3.transformPoint(m, new Vector2(1, 2));
   expect(result.x).toBeCloseTo(11);
   expect(result.y).toBeCloseTo(22);
  });

  it('transformVector transforms a vector (ignores translation)', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTranslation(new Vector2(100, 100));
   const result = Matrix3.transformVector(m, new Vector2(1, 0));
   expect(result.x).toBeCloseTo(1);
   expect(result.y).toBeCloseTo(0);
  });

  it('negate negates all elements', () => {
   expect.hasAssertions();
   const m = Matrix3.IDENTITY;
   const result = Matrix3.negate(m);
   expect(result.m00).toBe(-1);
   expect(result.m11).toBe(-1);
  });

  it('lerp interpolates between matrices', () => {
   expect.hasAssertions();
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromScale(new Vector2(3, 3));
   const result = Matrix3.lerp(a, b, 0.5);
   expect(result.m00).toBeCloseTo(2);
  });

  it('fromScale creates scale matrix from vector', () => {
   expect.hasAssertions();
   const m = Matrix3.fromScale(new Vector2(2, 3));
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
  });

  it('determinant computes determinant', () => {
   expect.hasAssertions();
   expect(Matrix3.determinant(Matrix3.IDENTITY)).toBe(1);
  });
 });

 describe('Instance Methods - Full Coverage', () => {
  it('set sets all components', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.m00).toBe(1);
   expect(m.m22).toBe(9);
  });

  it('multiply multiplies with another matrix', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.multiply(Matrix3.fromScale(new Vector2(2, 2)));
   expect(m.m00).toBe(2);
  });

  it('premultiply multiplies from left', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTranslation(new Vector2(5, 0));
   m.premultiply(Matrix3.fromScale(new Vector2(2, 2)));
   expect(m.m20).toBe(10); // Translation scaled
  });

  it('translate adds translation', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.translate(new Vector2(5, 10));
   expect(m.m20).toBe(5);
   expect(m.m21).toBe(10);
  });

  it('rotate rotates the matrix', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.rotate(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
  });

  it('rotateCS rotates using precomputed cos/sin', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   const cos = Math.cos(Math.PI / 2);
   const sin = Math.sin(Math.PI / 2);
   m.rotateCS(cos, sin);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
  });

  it('static rotateCS matches static rotate', () => {
   expect.hasAssertions();
   const m1 = Matrix3.fromTranslation({ x: 100, y: 50 });
   const m2 = Matrix3.fromTranslation({ x: 100, y: 50 });
   const angle = Math.PI / 4;
   const cos = Math.cos(angle);
   const sin = Math.sin(angle);
   const r1 = Matrix3.rotate(m1, angle);
   const r2 = Matrix3.rotateCS(m2, cos, sin);
   expect(r1.m00).toBeCloseTo(r2.m00);
   expect(r1.m01).toBeCloseTo(r2.m01);
   expect(r1.m10).toBeCloseTo(r2.m10);
   expect(r1.m11).toBeCloseTo(r2.m11);
  });

  it('multiplyScalar scales all matrix elements', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(2);
  });

  it('transpose transposes the matrix', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.transpose();
   expect(m.m01).toBe(4);
   expect(m.m10).toBe(2);
  });

  it('isIdentity checks if identity', () => {
   expect.hasAssertions();
   expect(Matrix3.IDENTITY.isIdentity()).toBe(true);
   expect(Matrix3.fromTranslation(new Vector2(1, 0)).isIdentity()).toBe(false);
  });

  it('getTranslation extracts translation', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTranslation(new Vector2(5, 10));
   const t = m.getTranslation();
   expect(t.x).toBe(5);
   expect(t.y).toBe(10);
  });

  it('getScale extracts scale', () => {
   expect.hasAssertions();
   const m = Matrix3.fromScale(new Vector2(2, 3));
   const s = m.getScale();
   expect(s.x).toBeCloseTo(2);
   expect(s.y).toBeCloseTo(3);
  });

  it('getRotation extracts rotation', () => {
   expect.hasAssertions();
   const m = Matrix3.fromRotation(Math.PI / 4);
   const r = m.getRotation();
   expect(r).toBeCloseTo(Math.PI / 4);
  });

  it('toJSON returns JSON representation', () => {
   expect.hasAssertions();
   const m = Matrix3.IDENTITY;
   const json = m.toJSON();
   expect(json.m00).toBe(1);
  });

  it('determinant instance method', () => {
   expect.hasAssertions();
   expect(Matrix3.IDENTITY.determinant()).toBe(1);
  });

  it('transformPoint instance method', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTranslation(new Vector2(5, 10));
   const result = m.transformPoint(new Vector2(1, 2));
   expect(result.x).toBeCloseTo(6);
   expect(result.y).toBeCloseTo(12);
  });

  it('transformVector instance method', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTranslation(new Vector2(100, 100));
   const result = m.transformVector(new Vector2(1, 0));
   expect(result.x).toBeCloseTo(1);
  });

  it('add instance method', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.add(Matrix3.IDENTITY);
   expect(m.m00).toBe(2);
  });

  it('subtract instance method', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.subtract(Matrix3.IDENTITY);
   expect(m.m00).toBe(0);
  });

  it('negate instance method', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.negate();
   expect(m.m00).toBe(-1);
  });

  it('inverse instance method', () => {
   expect.hasAssertions();
   const m = Matrix3.fromScale(new Vector2(2, 2));
   m.inverse();
   expect(m.m00).toBeCloseTo(0.5);
  });
 });

 describe('Transform Operations', () => {
  it('transformPoint applies full transformation', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTranslation(new Vector2(10, 5));
   const point = new Vector2(1, 2);
   const result = Matrix3.transformPoint(mat, point);
   expectVecClose(result, 11, 7);
  });

  it('transformPoint handles perspective divide', () => {
   expect.hasAssertions();
   const mat = new Matrix3();
   mat.m22 = 2; // Non-1 w component
   const point = new Vector2(4, 6);
   const result = Matrix3.transformPoint(mat, point);
   expectVecClose(result, 2, 3);
  });

  it('transformVector ignores translation', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTranslation(new Vector2(100, 100));
   const vec = new Vector2(1, 0);
   const result = Matrix3.transformVector(mat, vec);
   expectVecClose(result, 1, 0);
  });

  it('negate negates all elements', () => {
   expect.hasAssertions();
   const mat = new Matrix3();
   const negated = Matrix3.negate(mat);
   expect(negated.m00).toBe(-1);
   expect(negated.m11).toBe(-1);
   expect(negated.m22).toBe(-1);
  });
 });

 describe('Decomposition', () => {
  it('decompose extracts translation/rotation/scale', () => {
   expect.hasAssertions();
   const original = Matrix3.fromTransform2(new Vector2(10, 20), 0, new Vector2(2, 2));
   const decomposed = Matrix3.decompose(original);
   expect(decomposed.translation.x).toBeCloseTo(10, 5);
   expect(decomposed.translation.y).toBeCloseTo(20, 5);
  });

  it('decompose handles identity', () => {
   expect.hasAssertions();
   const decomposed = Matrix3.decompose(Matrix3.IDENTITY);
   expect(decomposed.translation.x).toBeCloseTo(0, 5);
   expect(decomposed.translation.y).toBeCloseTo(0, 5);
  });
 });

 describe('Lerp Operations', () => {
  it('lerp interpolates matrices', () => {
   expect.hasAssertions();
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromTranslation(new Vector2(10, 10));
   const result = Matrix3.lerp(a, b, 0.5);
   expect(result.m20).toBeCloseTo(5);
   expect(result.m21).toBeCloseTo(5);
  });

  it('lerp at t=0 returns first matrix', () => {
   expect.hasAssertions();
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromTranslation(new Vector2(10, 10));
   const result = Matrix3.lerp(a, b, 0);
   expect(result.m20).toBeCloseTo(0);
  });

  it('lerp at t=1 returns second matrix', () => {
   expect.hasAssertions();
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromTranslation(new Vector2(10, 10));
   const result = Matrix3.lerp(a, b, 1);
   expect(result.m20).toBeCloseTo(10);
  });
 });

 describe('Instance Methods', () => {
  it('multiplyScalar scales all elements', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.multiplyScalar(2);
   expect(m.m00).toBeCloseTo(2);
   expect(m.m11).toBeCloseTo(2);
   expect(m.m22).toBeCloseTo(2);
  });

  it('transpose swaps elements', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.transpose();
   expect(m.m01).toBe(4);
   expect(m.m10).toBe(2);
  });

  it('multiply multiplies matrices', () => {
   expect.hasAssertions();
   const m = Matrix3.fromScale(new Vector2(2, 2));
   m.multiply(Matrix3.fromScale(new Vector2(3, 3)));
   expect(m.m00).toBeCloseTo(6);
   expect(m.m11).toBeCloseTo(6);
  });

  it('premultiply premultiplies matrices', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTranslation(new Vector2(1, 1));
   m.premultiply(Matrix3.fromScale(new Vector2(2, 2)));
   expect(m.m20).toBeCloseTo(2);
  });
 });

 describe('Static Transform Operations', () => {
  it('transformPoint transforms a point with translation', () => {
   const m = Matrix3.fromTranslation(new Vector2(10, 20));
   const point = { x: 5, y: 5 };
   const result = Matrix3.transformPoint(m, point);
   expect(result.x).toBeCloseTo(15);
   expect(result.y).toBeCloseTo(25);
  });

  it('transformVector transforms direction (ignores translation)', () => {
   const m = Matrix3.fromTranslation(new Vector2(10, 20));
   const vector = { x: 1, y: 0 };
   const result = Matrix3.transformVector(m, vector);
   expect(result.x).toBeCloseTo(1);
   expect(result.y).toBeCloseTo(0);
  });

  it('negate negates all matrix elements', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const negated = Matrix3.negate(m, new Matrix3());
   expect(negated.m00).toBe(-1);
   expect(negated.m11).toBe(-5);
   expect(negated.m22).toBe(-9);
  });

  it('inverse returns inverse matrix', () => {
   const m = Matrix3.fromScale(new Vector2(2, 4));
   const inv = Matrix3.inverse(m, new Matrix3());
   expect(inv.m00).toBeCloseTo(0.5);
   expect(inv.m11).toBeCloseTo(0.25);
  });
 });

 describe('Matrix Properties', () => {
  it('determinant returns matrix determinant', () => {
   const identity = Matrix3.IDENTITY;
   expect(identity.determinant()).toBeCloseTo(1);

   const scale = Matrix3.fromScale(new Vector2(2, 3));
   expect(scale.determinant()).toBeCloseTo(6);
  });

  it('isIdentity checks for identity matrix', () => {
   expect(Matrix3.IDENTITY.isIdentity()).toBe(true);
   expect(Matrix3.fromScale(new Vector2(2, 2)).isIdentity()).toBe(false);
  });

  it('isInvertible checks if matrix can be inverted', () => {
   expect(Matrix3.IDENTITY.isInvertible()).toBe(true);
   expect(Matrix3.ZERO.isInvertible()).toBe(false);
  });
 });

 describe('Conversion Methods', () => {
  it('toArray returns flat array of components', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const array = m.toArray();
   expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('toString returns formatted string', () => {
   const m = Matrix3.IDENTITY;
   expect(m.toString()).toContain('Matrix3');
  });

  it('clone creates independent copy', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const copy = m.clone();
   m.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
   expect(copy.m00).toBe(1);
  });
 });

 describe('Instance Setters', () => {
  it('identity resets to identity matrix', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.identity();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(0);
   expect(m.m11).toBe(1);
  });

  it('copy copies from another matrix', () => {
   const source = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const target = new Matrix3();
   target.copy(source);
   expect(target.m00).toBe(1);
   expect(target.m22).toBe(9);
  });
 });

 describe('Factory Methods Extended', () => {
  it('fromRotation creates rotation matrix', () => {
   const m = Matrix3.fromRotation(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
  });

  it('fromScaleXY creates non-uniform scale', () => {
   const m = Matrix3.fromScale(new Vector2(2, 3));
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
  });

  it('fromValues creates matrix with given values', () => {
   const m = Matrix3.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(5);
   expect(m.m22).toBe(9);
  });

  it('fromArray column-major reads correctly', () => {
   const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   const m = Matrix3.fromArray(array, 0, true);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
  });

  it('fromArray row-major reads correctly', () => {
   const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   const m = Matrix3.fromArray(array, 0, false);
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
  });

  it('fromTransform with uniform scale', () => {
   const m = Matrix3.fromTransform2({ x: 10, y: 20 }, 0, 2);
   expect(m.m00).toBe(2);
   expect(m.m20).toBe(10);
  });

  it('fromTransform with non-uniform scale', () => {
   const m = Matrix3.fromTransform2({ x: 5, y: 5 }, 0, { x: 2, y: 3 });
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
  });
 });

 describe('Decomposition Extended', () => {
  it('decompose extracts translation from TRS matrix', () => {
   const m = Matrix3.fromTranslation({ x: 10, y: 20 });
   const result = Matrix3.decompose(m);
   expect(result.translation.x).toBe(10);
   expect(result.translation.y).toBe(20);
  });

  it('decompose extracts rotation from rotation matrix', () => {
   const angle = Math.PI / 4;
   const m = Matrix3.fromRotation(angle);
   const result = Matrix3.decompose(m);
   expect(result.rotation).toBeCloseTo(angle);
  });

  it('decompose extracts non-uniform scale', () => {
   const m = Matrix3.fromScale({ x: 2, y: 3 });
   const result = Matrix3.decompose(m);
   expect(result.scale.x).toBeCloseTo(2);
   expect(result.scale.y).toBeCloseTo(3);
  });

  it('decompose handles negative determinant (reflection)', () => {
   const m = Matrix3.fromScale({ x: 2, y: -3 });
   const result = Matrix3.decompose(m);
   expect(result.scale.x).toBeCloseTo(2);
   expect(result.scale.y).toBeCloseTo(-3);
  });
 });

 describe('Matrix Arithmetic', () => {
  it('add adds two matrices', () => {
   const a = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
   const b = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   const result = Matrix3.add(a, b);
   expect(result.m00).toBe(3);
  });

  it('subtract subtracts two matrices', () => {
   const a = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const b = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   const result = Matrix3.subtract(a, b);
   expect(result.m00).toBe(3);
  });

  it('multiplyScalar scales matrix by scalar', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const result = Matrix3.multiplyScalar(m, 2);
   expect(result.m00).toBe(2);
  });
 });

 describe('Instance Operations Extended', () => {
  it('inverted getter returns inverse matrix', () => {
   const m = Matrix3.fromScale({ x: 2, y: 4 });
   const inv = m.inverted;
   expect(inv.m00).toBeCloseTo(0.5);
   expect(inv.m11).toBeCloseTo(0.25);
  });

  it('multiplyScalar instance method scales all elements', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(2);
  });

  it('multiply instance method', () => {
   const a = Matrix3.fromScale({ x: 2, y: 2 });
   const b = Matrix3.fromScale({ x: 3, y: 3 });
   a.multiply(b);
   expect(a.m00).toBeCloseTo(6);
  });

  it('add instance method', () => {
   const a = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
   const b = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   a.add(b);
   expect(a.m00).toBe(3);
  });
 });

 describe('Getters', () => {
  it('inverted returns inverse without modifying original', () => {
   const m = Matrix3.fromScale({ x: 2, y: 4 });
   const inv = m.inverted;
   expect(inv.m00).toBeCloseTo(0.5);
   expect(m.m00).toBe(2);
  });

  it('inverted returns identity for singular matrix', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const inv = m.inverted;
   expect(inv.isIdentity()).toBe(true);
  });

  it('negated returns negated matrix', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const neg = m.negated;
   expect(neg.m00).toBe(-1);
   expect(neg.m11).toBe(-5);
  });

  it('upperLeft2x2 extracts 2x2 submatrix', () => {
   const m = new Matrix3(1, 2, 0, 3, 4, 0, 0, 0, 1);
   const sub = m.upperLeft2x2;
   expect(sub.m00).toBe(1);
   expect(sub.m11).toBe(4);
  });

  it('translation extracts translation vector', () => {
   const m = Matrix3.fromTranslation({ x: 10, y: 20 });
   expect(m.translation.x).toBe(10);
   expect(m.translation.y).toBe(20);
  });

  it('diagonal returns diagonal elements', () => {
   const m = new Matrix3(1, 0, 0, 0, 2, 0, 0, 0, 3);
   const d = m.diagonal;
   expect(d).toEqual([1, 2, 3]);
  });

  it('transposed returns transposed without modifying', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const t = m.transposed;
   expect(t.m01).toBe(4);
   expect(m.m01).toBe(2);
  });
 });

 describe('Instance Arithmetic', () => {
  it('add mutates this and returns this', () => {
   expect.hasAssertions();
   const a = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
   const b = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   const result = a.add(b);
   expect(result).toBe(a);
   expect(a.m00).toBe(3);
  });

  it('subtract mutates this and returns this', () => {
   expect.hasAssertions();
   const a = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const b = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   const result = a.subtract(b);
   expect(result).toBe(a);
   expect(a.m00).toBe(3);
  });

  it('multiply mutates this and returns this', () => {
   expect.hasAssertions();
   const a = Matrix3.fromScale({ x: 2, y: 2 });
   const b = Matrix3.fromScale({ x: 3, y: 3 });
   const result = a.multiply(b);
   expect(result).toBe(a);
   expect(a.m00).toBeCloseTo(6);
  });

  it('multiplyScalar mutates this and returns this', () => {
   expect.hasAssertions();
   const m = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
   const result = m.multiplyScalar(2);
   expect(result).toBe(m);
   expect(m.m00).toBe(2);
  });
 });

 describe('Static Operations Extended', () => {
  it('clone with out parameter', () => {
   const source = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const out = new Matrix3();
   const result = Matrix3.clone(source, out);
   expect(result).toBe(out);
   expect(out.m00).toBe(1);
  });

  it('fromValues with out parameter', () => {
   const out = new Matrix3();
   const result = Matrix3.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, out);
   expect(result).toBe(out);
  });

  it('ortho creates proper projection', () => {
   const m = Matrix3.ortho(0, 800, 0, 600);
   expect(m.m00).toBeCloseTo(2 / 800);
   expect(m.m11).toBeCloseTo(2 / 600);
  });

  it('transformPoint handles perspective', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 0.5);
   const result = Matrix3.transformPoint(m, { x: 4, y: 6 });
   expect(result.x).toBeCloseTo(8);
   expect(result.y).toBeCloseTo(12);
  });
 });

 describe('Coverage - Uncovered Functions', () => {
  it('fromArray with row-major (columnMajor = false)', () => {
   expect.hasAssertions();
   // Row-major: rows are sequential in the array
   // arr = [m00, m10, m20, m01, m11, m21, m02, m12, m22] when columnMajor=false
   const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   const m = Matrix3.fromArray(array, 0, false);
   // When columnMajor=false, the set() receives values reordered:
   // set(values[0], values[3], values[6], values[1], values[4], values[7], values[2], values[5], values[8])
   // = set(1, 4, 7, 2, 5, 8, 3, 6, 9)
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(4);
   expect(m.m02).toBe(7);
   expect(m.m10).toBe(2);
   expect(m.m11).toBe(5);
   expect(m.m12).toBe(8);
   expect(m.m20).toBe(3);
   expect(m.m21).toBe(6);
   expect(m.m22).toBe(9);
  });

  it('decompose extracts translation, rotation, and scale', () => {
   expect.hasAssertions();
   // Create a matrix with known transform
   const m = Matrix3.fromTransform2(new Vector2(10, 20), Math.PI / 4, new Vector2(2, 3));
   const result = Matrix3.decompose(m);

   expect(result.translation.x).toBeCloseTo(10);
   expect(result.translation.y).toBeCloseTo(20);
   expect(result.rotation).toBeCloseTo(Math.PI / 4, 5);
   expect(result.scale.x).toBeCloseTo(2, 5);
   expect(result.scale.y).toBeCloseTo(3, 5);
  });

  it('decompose handles zero scale gracefully', () => {
   expect.hasAssertions();
   const m = new Matrix3(0, 0, 0, 0, 0, 0, 5, 10, 1);
   const result = Matrix3.decompose(m);

   expect(result.translation.x).toBe(5);
   expect(result.translation.y).toBe(10);
   expect(result.rotation).toBe(0); // Zero scale returns 0 rotation
   expect(result.scale.x).toBe(0);
  });

  it('decompose handles negative determinant (reflection)', () => {
   expect.hasAssertions();
   // Reflection matrix (negative scale on Y)
   const m = Matrix3.fromScale(new Vector2(2, -3));
   const result = Matrix3.decompose(m);

   expect(result.scale.x).toBeCloseTo(2);
   expect(result.scale.y).toBeCloseTo(-3);
  });

  it('copy copies all components from source', () => {
   expect.hasAssertions();
   const source = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const target = new Matrix3();
   target.copy(source);

   expect(target.m00).toBe(1);
   expect(target.m01).toBe(2);
   expect(target.m02).toBe(3);
   expect(target.m10).toBe(4);
   expect(target.m11).toBe(5);
   expect(target.m12).toBe(6);
   expect(target.m20).toBe(7);
   expect(target.m21).toBe(8);
   expect(target.m22).toBe(9);
  });

  it('identity resets to identity matrix', () => {
   expect.hasAssertions();
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.identity();

   expect(m.m00).toBe(1);
   expect(m.m01).toBe(0);
   expect(m.m02).toBe(0);
   expect(m.m10).toBe(0);
   expect(m.m11).toBe(1);
   expect(m.m12).toBe(0);
   expect(m.m20).toBe(0);
   expect(m.m21).toBe(0);
   expect(m.m22).toBe(1);
  });

  it('inverted getter returns inverse without modifying original', () => {
   expect.hasAssertions();
   const m = Matrix3.fromScale(new Vector2(2, 4));
   const inv = m.inverted;

   // Original unchanged
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(4);

   // Inverse is correct
   expect(inv.m00).toBeCloseTo(0.5);
   expect(inv.m11).toBeCloseTo(0.25);
  });

  it('inverted getter returns identity for singular matrix', () => {
   expect.hasAssertions();
   const m = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
   const inv = m.inverted;

   expect(inv.isIdentity()).toBe(true);
  });

  it('add instance method adds matrices', () => {
   expect.hasAssertions();
   const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const b = new Matrix3(9, 8, 7, 6, 5, 4, 3, 2, 1);
   a.add(b);

   expect(a.m00).toBe(10);
   expect(a.m11).toBe(10);
   expect(a.m22).toBe(10);
  });

  it('subtract instance method subtracts matrices', () => {
   expect.hasAssertions();
   const a = new Matrix3(10, 10, 10, 10, 10, 10, 10, 10, 10);
   const b = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   a.subtract(b);

   expect(a.m00).toBe(9);
   expect(a.m11).toBe(5);
   expect(a.m22).toBe(1);
  });

  it('multiply mutates this and chains', () => {
   expect.hasAssertions();
   const a = Matrix3.fromScale(new Vector2(2, 2));
   const b = Matrix3.fromTranslation(new Vector2(5, 5));
   const result = a.multiply(b);

   expect(result).toBe(a);
   expect(a.m20).toBeCloseTo(10);
  });

  it('add mutates this and chains', () => {
   expect.hasAssertions();
   const a = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   const b = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   const result = a.add(b);

   expect(result).toBe(a);
   expect(a.m00).toBe(2);
  });

  it('subtract mutates this and chains', () => {
   expect.hasAssertions();
   const a = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const b = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
   const result = a.subtract(b);

   expect(result).toBe(a);
   expect(a.m00).toBe(4);
  });
 });

 describe('Coverage - Instance Methods', () => {
  it('set updates all components', () => {
   const m = new Matrix3();
   m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(5);
   expect(m.m22).toBe(9);
  });

  it('copy copies from another matrix', () => {
   const source = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const target = new Matrix3();
   target.copy(source);
   expect(target.m00).toBe(1);
   expect(target.m22).toBe(9);
  });

  it('identity resets to identity matrix', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.identity();
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
   expect(m.m22).toBe(1);
   expect(m.m01).toBe(0);
  });
 });

 describe('Coverage - Static fromArray', () => {
  it('fromArray with column-major order', () => {
   // Column-major: columns are sequential
   const array = [1, 4, 7, 2, 5, 8, 3, 6, 9];
   const m = Matrix3.fromArray(array, 0, true); // columnMajor = true
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(4);
   expect(m.m02).toBe(7);
   expect(m.m10).toBe(2);
   expect(m.m11).toBe(5);
  });
 });

 describe('Coverage - Static Decompose', () => {
  it('decompose extracts translation, rotation, and scale', () => {
   const m = Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, { x: 2, y: 2 });
   const result = Matrix3.decompose(m);
   expect(result.translation.x).toBeCloseTo(10);
   expect(result.translation.y).toBeCloseTo(20);
   expect(result.rotation).toBeCloseTo(Math.PI / 4, 4);
   expect(result.scale.x).toBeCloseTo(2, 4);
  });

  it('decompose handles negative determinant', () => {
   const m = Matrix3.fromScale({ x: -2, y: 2 });
   const result = Matrix3.decompose(m);
   expect(result.scale.y).toBeCloseTo(-2);
  });

  it('decompose handles zero scale', () => {
   const m = new Matrix3(0, 0, 0, 0, 1, 0, 0, 0, 1);
   const result = Matrix3.decompose(m);
   expect(result.rotation).toBe(0);
  });
 });

 describe('Coverage - Static Determinant', () => {
  it('determinant computes 3x3 determinant', () => {
   const m = new Matrix3(1, 2, 3, 0, 1, 4, 5, 6, 0);
   expect(Matrix3.determinant(m)).toBe(1);
  });
 });

 describe('Coverage - Instance Methods Without Out', () => {
  it('multiply without out returns this', () => {
   expect.hasAssertions();
   const a = Matrix3.fromScale(new Vector2(2, 2));
   const b = Matrix3.fromScale(new Vector2(3, 3));
   const result = a.multiply(b);
   expect(result).toBe(a);
   expect(a.m00).toBeCloseTo(6);
  });

  it('add without out returns this', () => {
   expect.hasAssertions();
   const a = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   const b = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   const result = a.add(b);
   expect(result).toBe(a);
   expect(a.m00).toBe(2);
  });

  it('subtract without out returns this', () => {
   expect.hasAssertions();
   const a = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const b = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
   const result = a.subtract(b);
   expect(result).toBe(a);
   expect(a.m00).toBe(4);
  });

  it('multiplyScalar without out returns this', () => {
   expect.hasAssertions();
   const a = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   const result = a.multiplyScalar(2);
   expect(result).toBe(a);
   expect(a.m00).toBe(2);
  });

  it('transpose without out returns this', () => {
   expect.hasAssertions();
   const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const result = a.transpose();
   expect(result).toBe(a);
   expect(a.m01).toBe(4);
   expect(a.m10).toBe(2);
  });

  it('negate without out returns this', () => {
   expect.hasAssertions();
   const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const result = a.negate();
   expect(result).toBe(a);
   expect(a.m00).toBe(-1);
  });

  it('inverse without out returns this', () => {
   expect.hasAssertions();
   const a = Matrix3.fromScale(new Vector2(2, 4));
   const result = a.inverse();
   expect(result).toBe(a);
   expect(a.m00).toBeCloseTo(0.5);
  });
 });

 describe('Coverage - Static fromArray Row-Major', () => {
  it('fromArray row-major (columnMajor=false) reorders correctly', () => {
   expect.hasAssertions();
   // Row-major: [r0c0, r0c1, r0c2, r1c0, r1c1, r1c2, r2c0, r2c1, r2c2]
   const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   const m = Matrix3.fromArray(array, 0, false);
   // When columnMajor=false, values are reordered to column-major
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
   expect(m.m20).toBe(3);
  });
 });

 describe('Coverage - Decompose Edge Cases', () => {
  it('decompose handles zero X scale', () => {
   expect.hasAssertions();
   const m = new Matrix3(0, 0, 0, 0, 1, 0, 5, 10, 1);
   const result = Matrix3.decompose(m);
   expect(result.scale.x).toBe(0);
   expect(result.rotation).toBe(0);
  });

  it('decompose with combined transform', () => {
   expect.hasAssertions();
   const m = Matrix3.fromTransform2(new Vector2(10, 20), Math.PI / 6, new Vector2(2, 3));
   const result = Matrix3.decompose(m);
   expect(result.translation.x).toBeCloseTo(10, 5);
   expect(result.rotation).toBeCloseTo(Math.PI / 6, 5);
   expect(result.scale.x).toBeCloseTo(2, 5);
  });
 });

 describe('Coverage - Instance Setters', () => {
  it('set updates all nine components', () => {
   expect.hasAssertions();
   const m = new Matrix3();
   const result = m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(result).toBe(m);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m02).toBe(3);
   expect(m.m10).toBe(4);
   expect(m.m11).toBe(5);
   expect(m.m12).toBe(6);
   expect(m.m20).toBe(7);
   expect(m.m21).toBe(8);
   expect(m.m22).toBe(9);
  });

  it('copy returns this for chaining', () => {
   expect.hasAssertions();
   const source = Matrix3.fromTranslation(new Vector2(5, 10));
   const target = new Matrix3();
   const result = target.copy(source);
   expect(result).toBe(target);
   expect(target.m20).toBe(5);
  });

  it('identity returns this for chaining', () => {
   expect.hasAssertions();
   const m = Matrix3.fromScale(new Vector2(2, 2));
   const result = m.identity();
   expect(result).toBe(m);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
  });
 });

 describe('Coverage - Getters', () => {
  it('inverted getter handles singular matrix', () => {
   expect.hasAssertions();
   const singular = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
   const inv = singular.inverted;
   expect(inv.isIdentity()).toBe(true);
  });

  it('inverted getter returns correct inverse', () => {
   expect.hasAssertions();
   const m = Matrix3.fromScale(new Vector2(2, 4));
   const inv = m.inverted;
   expect(inv.m00).toBeCloseTo(0.5);
   expect(inv.m11).toBeCloseTo(0.25);
   expect(m.m00).toBe(2); // Original unchanged
  });
 });

 describe('New Static Factories', () => {
  it('fromObject creates matrix from object', () => {
   const object = { m00: 1, m01: 2, m02: 3, m10: 4, m11: 5, m12: 6, m20: 7, m21: 8, m22: 9 };
   const m = Matrix3.fromObject(object);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(5);
   expect(m.m22).toBe(9);
  });

  it('static copy copies matrix', () => {
   const source = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const destination = new Matrix3();
   Matrix3.copy(source, destination);
   expect(destination.m00).toBe(1);
   expect(destination.m22).toBe(9);
  });

  it('fromColumns creates matrix from column tuples', () => {
   const m = Matrix3.fromColumns([1, 2, 3], [4, 5, 6], [7, 8, 9]);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(4);
   expect(m.m11).toBe(5);
  });

  it('fromRows creates matrix from row tuples', () => {
   const m = Matrix3.fromRows([1, 2, 3], [4, 5, 6], [7, 8, 9]);
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
  });
 });

 describe('Static Scalar Arithmetic', () => {
  it('addScalar adds scalar to all elements', () => {
   const m = Matrix3.IDENTITY;
   const result = Matrix3.addScalar(m, 5);
   expect(result.m00).toBe(6);
   expect(result.m01).toBe(5);
  });

  it('subtractScalar subtracts scalar from all elements', () => {
   const m = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const result = Matrix3.subtractScalar(m, 2);
   expect(result.m00).toBe(3);
  });

  it('multiplyScalar multiplies all elements by scalar', () => {
   const m = Matrix3.IDENTITY;
   const result = Matrix3.multiplyScalar(m, 3);
   expect(result.m00).toBe(3);
   expect(result.m11).toBe(3);
  });

  it('divideScalar divides all elements by scalar', () => {
   const m = new Matrix3(4, 4, 4, 4, 4, 4, 4, 4, 4);
   const result = Matrix3.divideScalar(m, 2);
   expect(result.m00).toBe(2);
  });
 });

 describe('Static Numeric Transforms', () => {
  it('floor applies Math.floor', () => {
   const m = new Matrix3(1.7, 2.3, 3.9, 4.1, 5.5, 6.8, 7.2, 8.6, 9.4);
   const result = Matrix3.floor(m);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
  });

  it('ceil applies Math.ceil', () => {
   const m = new Matrix3(1.1, 2.3, 3.9, 4.1, 5.5, 6.8, 7.2, 8.6, 9.4);
   const result = Matrix3.ceil(m);
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(3);
  });

  it('round applies Math.round', () => {
   const m = new Matrix3(1.4, 2.5, 3.6, 4.4, 5.5, 6.6, 7.4, 8.5, 9.6);
   const result = Matrix3.round(m);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(3);
  });

  it('abs applies absolute value', () => {
   const m = new Matrix3(-1, -2, -3, -4, -5, -6, -7, -8, -9);
   const result = Matrix3.abs(m);
   expect(result.m00).toBe(1);
   expect(result.m11).toBe(5);
  });

  it('sign extracts sign', () => {
   const m = new Matrix3(-5, 0, 5, -3, 0, 3, -1, 0, 1);
   const result = Matrix3.sign(m);
   expect(result.m00).toBe(-1);
   expect(result.m01).toBe(0);
   expect(result.m02).toBe(1);
  });

  it('sign propagates NaN per V9-Scalar-01 (IEEE 754 §6.2)', () => {
   const m = new Matrix3(Number.NaN, 0, 5, -3, 0, 3, -1, 0, 1);
   const result = Matrix3.sign(m);
   expect(result.m00).toBeNaN();
   expect(result.m01).toBe(0);
   expect(result.m02).toBe(1);
  });

  it('min computes element-wise minimum', () => {
   const a = new Matrix3(1, 5, 3, 7, 2, 8, 4, 6, 9);
   const b = new Matrix3(2, 3, 4, 5, 6, 7, 8, 9, 1);
   const result = Matrix3.min(a, b);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(3);
  });

  it('max computes element-wise maximum', () => {
   const a = new Matrix3(1, 5, 3, 7, 2, 8, 4, 6, 9);
   const b = new Matrix3(2, 3, 4, 5, 6, 7, 8, 9, 1);
   const result = Matrix3.max(a, b);
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(5);
  });

  it('clamp clamps between two matrices', () => {
   const m = new Matrix3(0, 10, 5, 0, 10, 5, 0, 10, 5);
   const minM = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   const maxM = new Matrix3(8, 8, 8, 8, 8, 8, 8, 8, 8);
   const result = Matrix3.clamp(m, minM, maxM);
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(8);
   expect(result.m02).toBe(5);
  });

  it('clampScalar clamps between scalars', () => {
   const m = new Matrix3(0, 10, 5, 0, 10, 5, 0, 10, 5);
   const result = Matrix3.clampScalar(m, 2, 8);
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(8);
   expect(result.m02).toBe(5);
  });
 });

 describe('Static Interpolation Extended', () => {
  it('lerp allows extrapolation', () => {
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromScale(new Vector2(3, 3));
   const result = Matrix3.lerp(a, b, 2);
   expect(result.m00).toBeCloseTo(5); // 1 + 2*(3-1) = 5
  });

  it('smoothStep computes smoothstep interpolation', () => {
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromScale(new Vector2(5, 5));
   const result = Matrix3.smoothStep(a, b, 0.5);
   // t = saturate(0.5) = 0.5
   // factor = 0.5 * 0.5 * (3 - 2*0.5) = 0.25 * 2 = 0.5
   // lerp(1, 5, 0.5) = 1 + 0.5 * (5 - 1) = 3
   expect(result.m00).toBeCloseTo(3);
  });
 });

 describe('Static Comparison & Validation', () => {
  it('isZero checks for zero matrix', () => {
   expect(Matrix3.isZero(Matrix3.ZERO)).toBe(true);
   expect(Matrix3.isZero(Matrix3.IDENTITY)).toBe(false);
  });

  it('nearZero checks for near-zero matrix', () => {
   const m = new Matrix3(1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10);
   expect(Matrix3.isNearZero(m)).toBe(true);
  });

  it('isFinite checks for finite elements', () => {
   expect(Matrix3.isFinite(Matrix3.IDENTITY)).toBe(true);
   const inf = new Matrix3(Infinity, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(Matrix3.isFinite(inf)).toBe(false);
  });

  it('hasNaN checks for NaN elements', () => {
   expect(Matrix3.hasNaN(Matrix3.IDENTITY)).toBe(false);
   const nan = new Matrix3(NaN, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(Matrix3.hasNaN(nan)).toBe(true);
  });

  it('isSymmetric checks for symmetric matrix', () => {
   const sym = new Matrix3(1, 2, 3, 2, 4, 5, 3, 5, 6);
   expect(Matrix3.isSymmetric(sym)).toBe(true);
   expect(Matrix3.isSymmetric(Matrix3.IDENTITY)).toBe(true);
  });

  it('isSkewSymmetric checks for skew-symmetric matrix', () => {
   const skew = new Matrix3(0, 1, 2, -1, 0, 3, -2, -3, 0);
   expect(Matrix3.isSkewSymmetric(skew)).toBe(true);
  });

  it('isDiagonal checks for diagonal matrix', () => {
   expect(Matrix3.isDiagonal(Matrix3.IDENTITY)).toBe(true);
   expect(Matrix3.isDiagonal(Matrix3.fromTranslation(new Vector2(1, 0)))).toBe(false);
  });

  it('isInvertible checks for invertible matrix', () => {
   expect(Matrix3.isInvertible(Matrix3.ZERO)).toBe(false);
   expect(Matrix3.isInvertible(Matrix3.IDENTITY)).toBe(true);
  });

  it('isOrthogonal checks for orthogonal matrix', () => {
   expect(Matrix3.isOrthogonal(Matrix3.IDENTITY)).toBe(true);
   expect(Matrix3.isOrthogonal(Matrix3.fromRotation(Math.PI / 4))).toBe(true);
  });
 });

 describe('Static Matrix Operations Extended', () => {
  it('inverseSafe returns identity for singular matrix', () => {
   const result = Matrix3.inverseSafe(Matrix3.ZERO);
   expect(result.isIdentity()).toBe(true);
  });

  it('inverseUnchecked computes inverse without check', () => {
   const m = Matrix3.fromScale(new Vector2(2, 4));
   const result = Matrix3.inverseUnchecked(m);
   expect(result.m00).toBeCloseTo(0.5);
   expect(result.m11).toBeCloseTo(0.25);
  });

  it('trace computes sum of diagonal', () => {
   const m = new Matrix3(1, 0, 0, 0, 2, 0, 0, 0, 3);
   expect(Matrix3.trace(m)).toBe(6);
  });

  it('frobeniusNorm computes Frobenius norm', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   // sqrt(1+4+9+16+25+36+49+64+81) = sqrt(285)
   expect(Matrix3.frobeniusNorm(m)).toBeCloseTo(Math.sqrt(285));
  });

  it('adjugate computes adjugate matrix', () => {
   const m = new Matrix3(1, 2, 3, 0, 1, 4, 5, 6, 0);
   const adj = Matrix3.adjugate(m);
   expect(adj).toBeDefined();
  });
 });

 describe('Instance Numeric Transforms', () => {
  it('floor modifies in place', () => {
   const m = new Matrix3(1.7, 2.3, 3.9, 4.1, 5.5, 6.8, 7.2, 8.6, 9.4);
   m.floor();
   expect(m.m00).toBe(1);
  });

  it('ceil modifies in place', () => {
   const m = new Matrix3(1.1, 2.3, 3.9, 4.1, 5.5, 6.8, 7.2, 8.6, 9.4);
   m.ceil();
   expect(m.m00).toBe(2);
  });

  it('round modifies in place', () => {
   const m = new Matrix3(1.4, 2.6, 3.5, 4.4, 5.6, 6.5, 7.4, 8.6, 9.5);
   m.round();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(3);
  });

  it('abs modifies in place', () => {
   const m = new Matrix3(-1, -2, -3, -4, -5, -6, -7, -8, -9);
   m.abs();
   expect(m.m00).toBe(1);
  });

  it('sign modifies in place', () => {
   const m = new Matrix3(-5, 0, 5, -3, 0, 3, -1, 0, 1);
   m.sign();
   expect(m.m00).toBe(-1);
   expect(m.m01).toBe(0);
  });

  it('min modifies in place', () => {
   const m = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const other = new Matrix3(3, 3, 3, 3, 3, 3, 3, 3, 3);
   m.min(other);
   expect(m.m00).toBe(3);
  });

  it('max modifies in place', () => {
   const m = new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
   const other = new Matrix3(3, 3, 3, 3, 3, 3, 3, 3, 3);
   m.max(other);
   expect(m.m00).toBe(3);
  });

  it('clamp modifies in place', () => {
   const m = new Matrix3(0, 10, 5, 0, 10, 5, 0, 10, 5);
   const minM = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   const maxM = new Matrix3(8, 8, 8, 8, 8, 8, 8, 8, 8);
   m.clamp(minM, maxM);
   expect(m.m00).toBe(2);
   expect(m.m01).toBe(8);
  });

  it('clampScalar modifies in place', () => {
   const m = new Matrix3(0, 10, 5, 0, 10, 5, 0, 10, 5);
   m.clampScalar(2, 8);
   expect(m.m00).toBe(2);
   expect(m.m01).toBe(8);
  });
 });

 describe('Instance Scalar Arithmetic', () => {
  it('addScalar modifies in place', () => {
   const m = new Matrix3();
   m.addScalar(5);
   expect(m.m00).toBe(6);
   expect(m.m01).toBe(5);
  });

  it('subtractScalar modifies in place', () => {
   const m = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   m.subtractScalar(2);
   expect(m.m00).toBe(3);
  });

  it('divideScalar modifies in place', () => {
   const m = new Matrix3(4, 4, 4, 4, 4, 4, 4, 4, 4);
   m.divideScalar(2);
   expect(m.m00).toBe(2);
  });

  it('divideScalarUnchecked divides without validation', () => {
   const m = new Matrix3(4, 4, 4, 4, 4, 4, 4, 4, 4);
   m.divideScalarUnchecked(2);
   expect(m.m00).toBe(2);
  });

  it('divideScalarSafe returns zero matrix for zero divisor', () => {
   const m = new Matrix3(4, 4, 4, 4, 4, 4, 4, 4, 4);
   m.divideScalarSafe(0);
   expect(m.m00).toBe(0);
  });

  it('static divideScalarUnchecked divides without validation', () => {
   const m = new Matrix3(4, 4, 4, 4, 4, 4, 4, 4, 4);
   const result = Matrix3.divideScalarUnchecked(m, 2);
   expect(result.m00).toBe(2);
  });
 });

 describe('Instance Interpolation Extended', () => {
  it('lerp modifies in place', () => {
   const m = new Matrix3();
   const target = Matrix3.fromScale(new Vector2(3, 3));
   m.lerp(target, 0.5);
   expect(m.m00).toBeCloseTo(2);
  });

  it('lerp allows extrapolation', () => {
   const m = new Matrix3();
   const target = Matrix3.fromScale(new Vector2(3, 3));
   m.lerp(target, 2);
   expect(m.m00).toBeCloseTo(5);
  });

  it('smoothStep modifies in place', () => {
   const m = new Matrix3();
   const target = Matrix3.fromScale(new Vector2(5, 5));
   m.smoothStep(target, 0.5); // t=0.5 → smooth interpolation
   // smoothStep(0.5) = 0.5 * 0.5 * (3 - 2 * 0.5) = 0.5
   // lerp(1, 5, 0.5) = 1 + 0.5 * (5 - 1) = 3
   expect(m.m00).toBeCloseTo(3);
  });
 });

 describe('Instance Comparison Extended', () => {
  it('isZero checks for zero matrix', () => {
   expect(Matrix3.ZERO.isZero()).toBe(true);
   expect(Matrix3.IDENTITY.isZero()).toBe(false);
  });

  it('nearZero checks for near-zero', () => {
   const m = new Matrix3(1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10, 1e-10);
   expect(m.isNearZero()).toBe(true);
  });

  it('isFinite checks for finite elements', () => {
   expect(Matrix3.IDENTITY.isFinite()).toBe(true);
  });

  it('hasNaN checks for NaN', () => {
   expect(Matrix3.IDENTITY.hasNaN()).toBe(false);
  });

  it('isSymmetric checks symmetry', () => {
   const sym = new Matrix3(1, 2, 3, 2, 4, 5, 3, 5, 6);
   expect(sym.isSymmetric()).toBe(true);
  });

  it('isSkewSymmetric checks skew-symmetry', () => {
   const skew = new Matrix3(0, 1, 2, -1, 0, 3, -2, -3, 0);
   expect(skew.isSkewSymmetric()).toBe(true);
  });

  it('isDiagonal checks for diagonal', () => {
   expect(Matrix3.IDENTITY.isDiagonal()).toBe(true);
  });

  it('isInvertible checks invertibility', () => {
   expect(Matrix3.ZERO.isInvertible()).toBe(false);
  });

  it('isOrthogonal checks orthogonality', () => {
   expect(Matrix3.IDENTITY.isOrthogonal()).toBe(true);
  });
 });

 describe('Instance Matrix Operations Extended', () => {
  it('inverseSafe handles singular matrix', () => {
   const m = Matrix3.ZERO.clone();
   m.inverseSafe();
   expect(m.isIdentity()).toBe(true);
  });

  it('inverseUnchecked inverts without check', () => {
   const m = Matrix3.fromScale(new Vector2(2, 4));
   m.inverseUnchecked();
   expect(m.m00).toBeCloseTo(0.5);
  });

  it('adjugate computes adjugate in place', () => {
   const m = new Matrix3(1, 2, 3, 0, 1, 4, 5, 6, 0);
   m.adjugate();
   expect(m).toBeDefined();
  });

  it('premultiply premultiplies in place', () => {
   const m = Matrix3.fromTranslation(new Vector2(5, 0));
   m.premultiply(Matrix3.fromScale(new Vector2(2, 2)));
   expect(m.m20).toBe(10);
  });
 });

 describe('Instance Column/Row Access', () => {
  it('column0 returns first column', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.column0[0]).toBe(1);
   expect(m.column0[1]).toBe(2);
   expect(m.column0[2]).toBe(3);
  });

  it('column1 returns second column', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.column1[0]).toBe(4);
   expect(m.column1[1]).toBe(5);
   expect(m.column1[2]).toBe(6);
  });

  it('column2 returns third column', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.column2[0]).toBe(7);
   expect(m.column2[1]).toBe(8);
   expect(m.column2[2]).toBe(9);
  });

  it('row0 returns first row', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.row0[0]).toBe(1);
   expect(m.row0[1]).toBe(4);
   expect(m.row0[2]).toBe(7);
  });

  it('row1 returns second row', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.row1[0]).toBe(2);
   expect(m.row1[1]).toBe(5);
   expect(m.row1[2]).toBe(8);
  });

  it('row2 returns third row', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.row2[0]).toBe(3);
   expect(m.row2[1]).toBe(6);
   expect(m.row2[2]).toBe(9);
  });

  it('getColumn returns column by index', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const col = m.getColumn(1);
   expect(col[0]).toBe(4);
   expect(col[1]).toBe(5);
   expect(col[2]).toBe(6);
  });

  it('getRow returns row by index', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const row = m.getRow(1);
   expect(row[0]).toBe(2);
   expect(row[1]).toBe(5);
   expect(row[2]).toBe(8);
  });

  it('setColumn sets column by index', () => {
   const m = new Matrix3();
   m.setColumn(0, [1, 2, 3]);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m02).toBe(3);
  });

  it('setRow sets row by index', () => {
   const m = new Matrix3();
   m.setRow(0, [1, 2, 3]);
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
   expect(m.m20).toBe(3);
  });
 });

 describe('Constructor (scalar-only, total)', () => {
  it('constructor with no args creates identity', () => {
   const m = new Matrix3();
   expect(m.isIdentity()).toBe(true);
  });

  it('constructor with 9 numbers', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.m00).toBe(1);
   expect(m.m22).toBe(9);
  });

  it('accepts non-finite components (pure assignment, IEEE 754 values)', () => {
   const m = new Matrix3(Number.NaN, 0, 0, 0, 1, 0, 0, 0, Number.POSITIVE_INFINITY);
   expect(m.m00).toBeNaN();
   expect(m.m22).toBe(Number.POSITIVE_INFINITY);
  });

  it('array construction is the exclusive domain of fromArray (validates in every build)', () => {
   const m = Matrix3.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   expect(m.m00).toBe(1);
   expect(m.m22).toBe(9);
   expect(() =>
    Matrix3.fromArray([1, 2, 3] as unknown as [
     number,
     number,
     number,
     number,
     number,
     number,
     number,
     number,
     number,
    ]),
   ).toThrow(RangeError);
  });

  it('object construction is the exclusive domain of fromObject (type-trusting)', () => {
   const object = { m00: 1, m01: 2, m02: 3, m10: 4, m11: 5, m12: 6, m20: 7, m21: 8, m22: 9 };
   const m = Matrix3.fromObject(object);
   expect(m.m00).toBe(1);
   expect(m.m22).toBe(9);
  });
 });

 describe('Constants', () => {
  it('FLIP_XY flips both axes', () => {
   expect(Matrix3.FLIP_XY.m00).toBe(-1);
   expect(Matrix3.FLIP_XY.m11).toBe(-1);
  });
 });

 describe('Conversion Extended', () => {
  it('toArray with out parameter', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const out = new Float32Array(9);
   m.toArray(out);
   expect(out[0]).toBe(1);
   expect(out[8]).toBe(9);
  });

  it('toArray with offset', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const out = new Float32Array(12);
   m.toArray(out, 3);
   expect(out[3]).toBe(1);
   expect(out[11]).toBe(9);
  });

  it('toString with precision', () => {
   const m = new Matrix3(1.123456, 2, 3, 4, 5, 6, 7, 8, 9);
   const string_ = m.toString(2);
   expect(string_).toContain('1.12');
  });
 });

 describe('Iterator', () => {
  it('supports array destructuring', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = m;
   expect(m00).toBe(1);
   expect(m01).toBe(2);
   expect(m02).toBe(3);
   expect(m10).toBe(4);
   expect(m11).toBe(5);
   expect(m12).toBe(6);
   expect(m20).toBe(7);
   expect(m21).toBe(8);
   expect(m22).toBe(9);
  });

  it('supports spread operator', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const array = [...m];
   expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('works with for...of', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const values: number[] = [];
   for (const v of m) {
    values.push(v);
   }
   expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
 });

 describe('Coverage - Static translate/rotate/scaleBy', () => {
  it('static translate translates matrix', () => {
   const m = Matrix3.IDENTITY;
   const result = Matrix3.translate(m, { x: 5, y: 10 });
   expect(result.m20).toBe(5);
   expect(result.m21).toBe(10);
  });

  it('static rotate rotates matrix', () => {
   const m = Matrix3.IDENTITY;
   const result = Matrix3.rotate(m, Math.PI / 2);
   expect(result.m00).toBeCloseTo(0, DIGITS);
   expect(result.m01).toBeCloseTo(1, DIGITS);
  });

  it('static scaleBy with scalar', () => {
   const m = Matrix3.IDENTITY;
   const result = Matrix3.scaleBy(m, 2);
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(2);
  });

  it('static scaleBy with vector', () => {
   const m = Matrix3.IDENTITY;
   const result = Matrix3.scaleBy(m, { x: 2, y: 3 });
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(3);
  });
 });

 describe('Coverage - Static smoothStep', () => {
  it('static smoothStep interpolates smoothly', () => {
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromScale(new Vector2(5, 5));
   const result = Matrix3.smoothStep(a, b, 0.5);
   expect(result.m00).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Coverage - Static lerpClamped', () => {
  it('static lerpClamped clamps t', () => {
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromScale(new Vector2(3, 3));
   const result = Matrix3.lerpClamped(a, b, 2);
   expect(result.m00).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Coverage - Instance translate/rotate/scaleBy', () => {
  it('instance translate translates', () => {
   const m = new Matrix3();
   m.translate({ x: 5, y: 10 });
   expect(m.m20).toBe(5);
   expect(m.m21).toBe(10);
  });

  it('instance rotate rotates', () => {
   const m = new Matrix3();
   m.rotate(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0, DIGITS);
  });

  it('instance scaleBy with scalar', () => {
   const m = new Matrix3();
   m.scaleBy(2);
   expect(m.m00).toBe(2);
  });

  it('instance scaleBy with vector', () => {
   const m = new Matrix3();
   m.scaleBy({ x: 2, y: 3 });
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
  });
 });

 describe('Coverage - Object.freeze on matrix', () => {
  it('Object.freeze freezes the matrix object', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const frozen = Object.freeze(m);
   expect(frozen).toBe(m);
   expect(Object.isFrozen(frozen)).toBe(true);
  });
 });

 describe('Coverage - Instance smoothStep', () => {
  it('instance smoothStep interpolates', () => {
   const m = new Matrix3();
   const target = Matrix3.fromScale(new Vector2(5, 5));
   m.smoothStep(target, 0.5);
   expect(m.m00).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Coverage - Static isFinite and hasNaN', () => {
  it('static isFinite returns true for finite matrix', () => {
   expect(Matrix3.isFinite(Matrix3.IDENTITY)).toBe(true);
  });

  it('static isFinite returns false for infinite', () => {
   expect(
    Matrix3.isFinite({
     m00: Infinity,
     m01: 0,
     m02: 0,
     m10: 0,
     m11: 1,
     m12: 0,
     m20: 0,
     m21: 0,
     m22: 1,
    }),
   ).toBe(false);
  });

  it('static hasNaN returns false for normal matrix', () => {
   expect(Matrix3.hasNaN(Matrix3.IDENTITY)).toBe(false);
  });

  it('static hasNaN returns true for NaN', () => {
   expect(
    Matrix3.hasNaN({ m00: NaN, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 0, m21: 0, m22: 1 }),
   ).toBe(true);
  });
 });

 describe('Coverage - Static hasInfinity', () => {
  it('hasInfinity returns false for finite matrix', () => {
   expect(Matrix3.hasInfinity(Matrix3.IDENTITY)).toBe(false);
  });

  it('hasInfinity returns true for Infinity', () => {
   expect(
    Matrix3.hasInfinity({
     m00: Infinity,
     m01: 0,
     m02: 0,
     m10: 0,
     m11: 1,
     m12: 0,
     m20: 0,
     m21: 0,
     m22: 1,
    }),
   ).toBe(true);
  });

  it('hasInfinity returns false for NaN (not infinity)', () => {
   expect(
    Matrix3.hasInfinity({
     m00: NaN,
     m01: 0,
     m02: 0,
     m10: 0,
     m11: 1,
     m12: 0,
     m20: 0,
     m21: 0,
     m22: 1,
    }),
   ).toBe(false);
  });
 });

 describe('Coverage - Instance hasInfinity', () => {
  it('instance hasInfinity returns false for finite', () => {
   const m = Matrix3.IDENTITY;
   expect(m.hasInfinity()).toBe(false);
  });

  it('instance hasInfinity returns true for infinite', () => {
   const m = new Matrix3(Infinity, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(m.hasInfinity()).toBe(true);
  });
 });

 describe('Coverage - Static copy', () => {
  it('static copy copies to destination', () => {
   const source = Matrix3.fromTranslation({ x: 5, y: 10 });
   const destination = new Matrix3();
   const result = Matrix3.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.m20).toBe(5);
   expect(destination.m21).toBe(10);
  });
 });

 describe('Coverage - fromObject', () => {
  it('creates matrix from plain object', () => {
   const object = {
    m00: 1,
    m01: 2,
    m02: 3,
    m10: 4,
    m11: 5,
    m12: 6,
    m20: 7,
    m21: 8,
    m22: 9,
   };
   const result = Matrix3.fromObject(object);
   expect(result.m00).toBe(1);
   expect(result.m22).toBe(9);
  });
 });

 describe('Coverage - inverseSafe', () => {
  it('returns identity for singular matrix', () => {
   const singular = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const inv = Matrix3.inverseSafe(singular);
   expect(inv.isIdentity()).toBe(true);
  });

  it('returns inverse for invertible matrix', () => {
   const m = Matrix3.fromScale({ x: 2, y: 4 });
   const inv = Matrix3.inverseSafe(m);
   expect(inv.m00).toBeCloseTo(0.5, DIGITS);
   expect(inv.m11).toBeCloseTo(0.25, DIGITS);
  });
 });

 describe('Coverage - Additional static transforms', () => {
  it('scaleBy applies non-uniform scale', () => {
   const m = new Matrix3();
   m.scaleBy({ x: 2, y: 3 });
   expect(m.m00).toBeCloseTo(2, DIGITS);
   expect(m.m11).toBeCloseTo(3, DIGITS);
  });

  it('translateBy translates matrix', () => {
   const m = new Matrix3();
   m.translate({ x: 10, y: 20 });
   expect(m.m20).toBe(10);
   expect(m.m21).toBe(20);
  });
 });

 describe('Coverage - Static determinant', () => {
  it('determinant returns matrix determinant', () => {
   const m = Matrix3.fromScale({ x: 2, y: 3 });
   expect(Matrix3.determinant(m)).toBeCloseTo(6, DIGITS);
  });
 });

 describe('Coverage - Static multiply', () => {
  it('multiply multiplies two matrices', () => {
   const a = Matrix3.fromTranslation({ x: 5, y: 0 });
   const b = Matrix3.fromTranslation({ x: 0, y: 10 });
   const result = Matrix3.multiply(a, b);
   expect(result.m20).toBeCloseTo(5, DIGITS);
   expect(result.m21).toBeCloseTo(10, DIGITS);
  });
 });

 describe('Coverage - Static transpose', () => {
  it('transpose transposes matrix', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const t = Matrix3.transpose(m);
   expect(t.m01).toBe(m.m10);
   expect(t.m10).toBe(m.m01);
  });
 });

 describe('Coverage - Static fromRotation', () => {
  it('fromRotation creates rotation matrix', () => {
   const m = Matrix3.fromRotation(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0, DIGITS);
   expect(m.m01).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Static add', () => {
  it('add adds two matrices', () => {
   const a = Matrix3.IDENTITY;
   const b = Matrix3.IDENTITY;
   const result = Matrix3.add(a, b);
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(2);
  });
 });

 describe('Coverage - Static subtract', () => {
  it('subtract subtracts two matrices', () => {
   const a = Matrix3.fromScale({ x: 2, y: 2 });
   const b = Matrix3.IDENTITY;
   const result = Matrix3.subtract(a, b);
   expect(result.m00).toBe(1);
   expect(result.m11).toBe(1);
  });
 });

 describe('Coverage - Static lerp', () => {
  it('lerp interpolates between matrices', () => {
   const a = Matrix3.IDENTITY;
   const b = Matrix3.fromScale({ x: 3, y: 3 });
   const result = Matrix3.lerp(a, b, 0.5);
   expect(result.m00).toBeCloseTo(2, DIGITS);
   expect(result.m11).toBeCloseTo(2, DIGITS);
  });
 });

 describe('Coverage - Instance determinant', () => {
  it('determinant returns matrix determinant', () => {
   const m = Matrix3.fromScale({ x: 2, y: 3 });
   expect(m.determinant()).toBeCloseTo(6, DIGITS);
  });
 });

 describe('Coverage - Instance multiply', () => {
  it('multiply multiplies in place', () => {
   const a = Matrix3.fromTranslation({ x: 5, y: 0 }).clone();
   const b = Matrix3.fromTranslation({ x: 0, y: 10 });
   a.multiply(b);
   expect(a.m20).toBeCloseTo(5, DIGITS);
   expect(a.m21).toBeCloseTo(10, DIGITS);
  });
 });

 describe('Coverage - Instance transpose', () => {
  it('transpose transposes in place', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const orig01 = m.m01;
   const orig10 = m.m10;
   m.transpose();
   expect(m.m01).toBe(orig10);
   expect(m.m10).toBe(orig01);
  });
 });

 describe('Coverage - Instance add', () => {
  it('add adds in place', () => {
   const a = new Matrix3();
   a.add(Matrix3.IDENTITY);
   expect(a.m00).toBe(2);
   expect(a.m11).toBe(2);
  });
 });

 describe('Coverage - Instance subtract', () => {
  it('subtract subtracts in place', () => {
   const a = Matrix3.fromScale({ x: 2, y: 2 }).clone();
   a.subtract(Matrix3.IDENTITY);
   expect(a.m00).toBe(1);
   expect(a.m11).toBe(1);
  });
 });

 describe('Coverage - Instance lerp', () => {
  it('lerp interpolates in place', () => {
   const a = new Matrix3();
   a.lerp(Matrix3.fromScale({ x: 3, y: 3 }), 0.5);
   expect(a.m00).toBeCloseTo(2, DIGITS);
   expect(a.m11).toBeCloseTo(2, DIGITS);
  });
 });

 describe('Coverage - Static fromArray (basic)', () => {
  it('fromArray creates from array', () => {
   const array = [1, 0, 0, 0, 1, 0, 0, 0, 1];
   const m = Matrix3.fromArray(array);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
  });
 });

 describe('Coverage - Instance toArray', () => {
  it('toArray returns array', () => {
   const m = Matrix3.IDENTITY;
   const array = m.toArray();
   expect(array[0]).toBe(1);
   expect(array[4]).toBe(1);
   expect(array[8]).toBe(1);
  });
 });

 describe('Coverage - Static nearEquals', () => {
  it('nearEquals checks approximate equality', () => {
   const a = Matrix3.IDENTITY;
   const b = new Matrix3();
   expect(Matrix3.nearEquals(a, b)).toBe(true);
  });
 });

 // === BRANCH COVERAGE: L2645-2656, L2982-3013 ===
 describe('Coverage - Instance addScalar', () => {
  it('addScalar adds scalar to all elements', () => {
   const m = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
   m.addScalar(1);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
   expect(m.m22).toBe(1);
  });
 });

 describe('Coverage - Instance subtractScalar', () => {
  it('subtractScalar subtracts scalar from all elements', () => {
   const m = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
   m.subtractScalar(1);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
   expect(m.m22).toBe(1);
  });
 });

 describe('Coverage - Instance floor', () => {
  it('floor floors all elements', () => {
   const m = new Matrix3(1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7);
   m.floor();
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
   expect(m.m22).toBe(1);
  });
 });

 describe('Coverage - Instance ceil', () => {
  it('ceil ceils all elements', () => {
   const m = new Matrix3(1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3);
   m.ceil();
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(2);
   expect(m.m22).toBe(2);
  });
 });

 describe('Coverage - Instance round', () => {
  it('round rounds all elements', () => {
   const m = new Matrix3(1.4, 1.6, 1.5, 1.4, 1.6, 1.5, 1.4, 1.6, 1.5);
   m.round();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m02).toBe(2);
  });
 });

 describe('Coverage - Instance scale', () => {
  it('multiplyScalar scales all elements', () => {
   const m = new Matrix3();
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(2);
  });
 });

 describe('Coverage - Instance multiplyScalar', () => {
  it('multiplyScalar multiplies all elements', () => {
   const m = new Matrix3();
   m.multiplyScalar(3);
   expect(m.m00).toBe(3);
   expect(m.m11).toBe(3);
  });
 });

 describe('Coverage - Ortho Edge Cases', () => {
  it('ortho throws for zero width/height', () => {
   expect(() => Matrix3.ortho(0, 0, 0, 0)).toThrow(RangeError);
  });

  it('orthoSafe returns identity for zero width/height', () => {
   const m = Matrix3.orthoSafe(0, 0, 0, 0);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
   expect(m.m22).toBe(1);
  });
 });

 describe('Coverage - Large inputs', () => {
  it('fromRotation handles large angle', () => {
   const m = Matrix3.fromRotation(100 * Math.PI);
   expect(m.m00).toBeCloseTo(1);
   expect(m.m01).toBeCloseTo(0);
  });
 });

 describe('Coverage - fromRows method', () => {
  it('fromRows creates matrix from row vectors', () => {
   const m = Matrix3.fromRows([1, 2, 3], [4, 5, 6], [7, 8, 9]);
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
   expect(m.m20).toBe(3);
   expect(m.m01).toBe(4);
   expect(m.m11).toBe(5);
   expect(m.m21).toBe(6);
  });

  it('fromRows uses out parameter', () => {
   const out = new Matrix3();
   const result = Matrix3.fromRows([1, 0, 0], [0, 1, 0], [0, 0, 1], out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - static copy', () => {
  it('copy copies matrix to destination', () => {
   const source = Matrix3.fromTranslation({ x: 5, y: 10 });
   const destination = new Matrix3();
   const result = Matrix3.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.m20).toBe(5);
   expect(destination.m21).toBe(10);
  });
 });

 describe('Coverage - isFinite/hasNaN static', () => {
  it('isFinite returns true for finite matrix', () => {
   expect(Matrix3.isFinite(Matrix3.IDENTITY)).toBe(true);
  });

  it('isFinite returns false for Infinity', () => {
   const m = new Matrix3(Infinity, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(Matrix3.isFinite(m)).toBe(false);
  });

  it('hasNaN returns false for valid matrix', () => {
   expect(Matrix3.hasNaN(Matrix3.IDENTITY)).toBe(false);
  });

  it('hasNaN returns true for NaN', () => {
   const m = new Matrix3(NaN, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(Matrix3.hasNaN(m)).toBe(true);
  });
 });

 describe('Coverage - divideScalar variants', () => {
  it('divideScalar divides all elements', () => {
   const m = new Matrix3(4, 4, 4, 4, 4, 4, 4, 4, 4);
   const result = Matrix3.divideScalar(m, 2);
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(2);
  });

  it('divideScalar throws on zero', () => {
   expect(() => Matrix3.divideScalar(Matrix3.IDENTITY, 0)).toThrow(RangeError);
  });

  it('divideScalarSafe returns zero on zero divisor', () => {
   const result = Matrix3.divideScalarSafe(Matrix3.IDENTITY, 0);
   expect(result.m00).toBe(0);
   expect(result.m11).toBe(0);
  });

  it('divideScalarSafe divides normally for non-zero', () => {
   const m = new Matrix3(4, 4, 4, 4, 4, 4, 4, 4, 4);
   const result = Matrix3.divideScalarSafe(m, 2);
   expect(result.m00).toBe(2);
  });
 });

 describe('Coverage - fromColumns', () => {
  it('fromColumns creates matrix from column vectors', () => {
   const m = Matrix3.fromColumns([1, 2, 3], [4, 5, 6], [7, 8, 9]);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m02).toBe(3);
   expect(m.m10).toBe(4);
   expect(m.m11).toBe(5);
  });
 });

 describe('Coverage - fromRotation with Rotation2Like', () => {
  it('fromRotation accepts Rotation2Like object', () => {
   const rotation = { cos: 0, sin: 1 };
   const m = Matrix3.fromRotation(rotation);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
  });
 });

 describe('Coverage - Static scaleBy', () => {
  it('scaleBy with scalar', () => {
   const m = Matrix3.fromTranslation({ x: 10, y: 5 });
   const result = Matrix3.scaleBy(m, 2);
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(2);
  });

  it('scaleBy with vector', () => {
   const m = Matrix3.fromTranslation({ x: 10, y: 5 });
   const result = Matrix3.scaleBy(m, { x: 2, y: 3 });
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(3);
  });
 });

 describe('Coverage - Static copy method', () => {
  it('copy copies source to destination', () => {
   const source = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const destination = new Matrix3();
   const result = Matrix3.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.m00).toBe(1);
   expect(destination.m22).toBe(9);
  });
 });

 describe('Coverage - Static transpose method', () => {
  it('transpose transposes matrix', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const result = Matrix3.transpose(m);
   expect(result.m01).toBe(4);
   expect(result.m10).toBe(2);
  });
 });

 describe('Coverage - Instance multiplyScalar operation', () => {
  it('multiplyScalar multiplies all elements by scalar', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(10);
   expect(m.m22).toBe(18);
  });
 });

 describe('Coverage - Instance addScalar operation', () => {
  it('addScalar adds scalar to all elements', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.addScalar(10);
   expect(m.m00).toBe(11);
   expect(m.m11).toBe(15);
   expect(m.m22).toBe(19);
  });
 });

 describe('Coverage - Instance subtractScalar operation', () => {
  it('subtractScalar subtracts scalar from all elements', () => {
   const m = new Matrix3(10, 20, 30, 40, 50, 60, 70, 80, 90);
   m.subtractScalar(5);
   expect(m.m00).toBe(5);
   expect(m.m11).toBe(45);
   expect(m.m22).toBe(85);
  });
 });

 describe('Static mod/modScalar', () => {
  it('static mod computes element-wise modulo', () => {
   const a = new Matrix3(10, 7, 15, 9, 11, 13, 20, 17, 14);
   const b = new Matrix3(3, 4, 6, 5, 3, 7, 9, 8, 5);
   const result = Matrix3.mod(a, b);
   expect(result.m00).toBeCloseTo(1, 10);
   expect(result.m01).toBeCloseTo(3, 10);
   expect(result.m02).toBeCloseTo(3, 10);
   expect(result.m10).toBeCloseTo(4, 10);
   expect(result.m11).toBeCloseTo(2, 10);
   expect(result.m12).toBeCloseTo(6, 10);
   expect(result.m20).toBeCloseTo(2, 10);
   expect(result.m21).toBeCloseTo(1, 10);
   expect(result.m22).toBeCloseTo(4, 10);
  });

  it('static mod uses out parameter', () => {
   const out = new Matrix3();
   const result = Matrix3.mod(
    new Matrix3(10, 7, 15, 9, 11, 13, 20, 17, 14),
    new Matrix3(3, 4, 6, 5, 3, 7, 9, 8, 5),
    out,
   );
   expect(result).toBe(out);
  });

  it('static mod matches instance mod', () => {
   const a = new Matrix3(10, 7, 15, 9, 11, 13, 20, 17, 14);
   const b = new Matrix3(3, 4, 6, 5, 3, 7, 9, 8, 5);
   const staticResult = Matrix3.mod(a, b);
   const instanceResult = a.clone().mod(b);
   expect(staticResult.m00).toBeCloseTo(instanceResult.m00, 10);
   expect(staticResult.m11).toBeCloseTo(instanceResult.m11, 10);
   expect(staticResult.m22).toBeCloseTo(instanceResult.m22, 10);
  });

  it('static modScalar computes scalar modulo', () => {
   const result = Matrix3.modScalar(new Matrix3(10, 7, 15, 9, 11, 13, 20, 17, 14), 4);
   expect(result.m00).toBeCloseTo(2, 10);
   expect(result.m01).toBeCloseTo(3, 10);
   expect(result.m02).toBeCloseTo(3, 10);
  });

  it('static modScalar uses out parameter', () => {
   const out = new Matrix3();
   const result = Matrix3.modScalar(new Matrix3(10, 7, 15, 9, 11, 13, 20, 17, 14), 4, out);
   expect(result).toBe(out);
  });

  it('static modScalar matches instance modScalar', () => {
   const a = new Matrix3(10, 7, 15, 9, 11, 13, 20, 17, 14);
   const staticResult = Matrix3.modScalar(a, 4);
   const instanceResult = a.clone().modScalar(4);
   expect(staticResult.m00).toBeCloseTo(instanceResult.m00, 10);
   expect(staticResult.m11).toBeCloseTo(instanceResult.m11, 10);
   expect(staticResult.m22).toBeCloseTo(instanceResult.m22, 10);
  });
 });

 describe('Static transformPoints/transformVectors', () => {
  it('transformPoints transforms array of points', () => {
   const m = Matrix3.fromTranslation(new Vector2(10, 20));
   const points = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
   ];
   const result = Matrix3.transformPoints(m, points);
   expect(result).toHaveLength(3);
   expect(result[0]!.x).toBeCloseTo(10, DIGITS);
   expect(result[0]!.y).toBeCloseTo(20, DIGITS);
   expect(result[1]!.x).toBeCloseTo(11, DIGITS);
   expect(result[2]!.y).toBeCloseTo(21, DIGITS);
  });

  it('transformPoints matches instance transformPoints', () => {
   const m = Matrix3.fromRotation(0.5);
   const points = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
   ];
   const staticResult = Matrix3.transformPoints(m, points);
   const instanceResult = m.transformPoints(points);
   expect(staticResult[0]!.x).toBeCloseTo(instanceResult[0]!.x, DIGITS);
   expect(staticResult[0]!.y).toBeCloseTo(instanceResult[0]!.y, DIGITS);
   expect(staticResult[1]!.x).toBeCloseTo(instanceResult[1]!.x, DIGITS);
  });

  it('transformVectors ignores translation', () => {
   const m = Matrix3.fromTranslation(new Vector2(100, 200));
   const vectors = [{ x: 1, y: 0 }];
   const result = Matrix3.transformVectors(m, vectors);
   expect(result[0]!.x).toBeCloseTo(1, DIGITS);
   expect(result[0]!.y).toBeCloseTo(0, DIGITS);
  });

  it('transformVectors applies rotation', () => {
   const m = Matrix3.fromRotation(Math.PI / 2);
   const vectors = [{ x: 1, y: 0 }];
   const result = Matrix3.transformVectors(m, vectors);
   expect(result[0]!.x).toBeCloseTo(0, 8);
   expect(result[0]!.y).toBeCloseTo(1, 8);
  });
 });

 describe('Static isAffine', () => {
  it('identity is affine', () => {
   expect(Matrix3.isAffine(new Matrix3())).toBe(true);
  });

  it('translation matrix is affine', () => {
   expect(Matrix3.isAffine(Matrix3.fromTranslation(new Vector2(5, 10)))).toBe(true);
  });

  it('non-affine matrix returns false', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 2);
   expect(Matrix3.isAffine(m)).toBe(false);
  });

  it('static isAffine matches instance isAffine', () => {
   const m = Matrix3.fromRotation(0.5);
   expect(Matrix3.isAffine(m)).toBe(m.isAffine());
  });
 });

 describe('Instance decompose', () => {
  it('decomposes translation + rotation + scale', () => {
   const m = Matrix3.fromTranslation(new Vector2(5, 3));
   const rot = Matrix3.fromRotation(Math.PI / 4);
   const scl = Matrix3.fromScale(new Vector2(2, 2));
   const combined = Matrix3.multiply(Matrix3.multiply(m, rot), scl);
   const d = combined.decompose();
   expect(d.translation.x).toBeCloseTo(5, 8);
   expect(d.translation.y).toBeCloseTo(3, 8);
   expect(d.rotation).toBeCloseTo(Math.PI / 4, 8);
   expect(d.scale.x).toBeCloseTo(2, 8);
   expect(d.scale.y).toBeCloseTo(2, 8);
  });

  it('instance decompose matches static decompose', () => {
   const m = Matrix3.fromRotation(0.5);
   const inst = m.decompose();
   const stat = Matrix3.decompose(m);
   expect(inst.rotation).toBeCloseTo(stat.rotation, DIGITS);
   expect(inst.scale.x).toBeCloseTo(stat.scale.x, DIGITS);
   expect(inst.translation.x).toBeCloseTo(stat.translation.x, DIGITS);
  });

  it('decompose of identity returns zero translation, zero rotation, unit scale', () => {
   const d = new Matrix3().decompose();
   expect(d.translation.x).toBeCloseTo(0, DIGITS);
   expect(d.translation.y).toBeCloseTo(0, DIGITS);
   expect(d.rotation).toBeCloseTo(0, DIGITS);
   expect(d.scale.x).toBeCloseTo(1, DIGITS);
   expect(d.scale.y).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Near-singular boundary', () => {
  const EPS = 1e-10;

  it('inverse throws when determinant equals EPSILON', () => {
   // Diagonal matrix with det = 1 * 1 * EPS = EPS → singular
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, EPS);
   expect(() => Matrix3.inverse(m)).toThrow(RangeError);
  });

  it('inverse throws when determinant is zero', () => {
   // Row 0 = Row 1 → det = 0
   const m = new Matrix3(1, 0, 0, 1, 0, 0, 0, 0, 1);
   expect(() => Matrix3.inverse(m)).toThrow(RangeError);
  });

  it('inverse succeeds when determinant is above EPSILON', () => {
   // det = 1 * 1 * 2e-10 = 2e-10 > EPSILON
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 2e-10);
   const inv = Matrix3.inverse(m);
   expect(inv.m00).toBe(1);
   expect(inv.m11).toBe(1);
   expect(inv.m22).toBe(1 / 2e-10);
  });

  it('inverse succeeds with negative determinant beyond -EPSILON', () => {
   // det = 1 * 1 * (-2e-10) = -2e-10, |det| > EPSILON
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, -2e-10);
   const inv = Matrix3.inverse(m);
   expect(inv.m22).toBe(1 / -2e-10);
  });

  it('inverseSafe returns identity when determinant equals EPSILON', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, EPS);
   const inv = Matrix3.inverseSafe(m);
   expect(Matrix3.isIdentity(inv)).toBe(true);
  });

  it('inverseSafe returns identity when determinant is zero', () => {
   const m = new Matrix3(1, 0, 0, 1, 0, 0, 0, 0, 1);
   const inv = Matrix3.inverseSafe(m);
   expect(Matrix3.isIdentity(inv)).toBe(true);
  });

  it('inverseSafe inverts when determinant is above EPSILON', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 2e-10);
   const inv = Matrix3.inverseSafe(m);
   expect(inv.m22).toBe(1 / 2e-10);
  });
 });

 describe('Coverage: static factories and operations', () => {
  it('fromObject creates matrix from plain object', () => {
   const m = Matrix3.fromObject({
    m00: 1,
    m01: 2,
    m02: 3,
    m10: 4,
    m11: 5,
    m12: 6,
    m20: 7,
    m21: 8,
    m22: 9,
   });
   expect(m.m00).toBe(1);
   expect(m.m12).toBe(6);
   expect(m.m22).toBe(9);
  });

  it('fromRows creates matrix from row tuples (transposed to column-major)', () => {
   const m = Matrix3.fromRows([1, 2, 3], [4, 5, 6], [7, 8, 9]);
   // row0=[1,2,3] → m00=1, m10=2, m20=3
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
   expect(m.m20).toBe(3);
   // row1=[4,5,6] → m01=4, m11=5, m21=6
   expect(m.m01).toBe(4);
   expect(m.m11).toBe(5);
   expect(m.m21).toBe(6);
  });

  it('determinant computes cofactor expansion', () => {
   expect(Matrix3.determinant(Matrix3.IDENTITY)).toBe(1);
   expect(Matrix3.determinant(Matrix3.ZERO)).toBe(0);
  });

  it('adjugate satisfies adj(A) * A = det(A) * I', () => {
   const m = new Matrix3(2, 1, 0, 0, 3, 1, 0, 0, 1);
   const adj = Matrix3.adjugate(m);
   const product = Matrix3.multiply(adj, m);
   const det = Matrix3.determinant(m);
   expect(product.m00).toBeCloseTo(det, 8);
   expect(product.m11).toBeCloseTo(det, 8);
   expect(product.m22).toBeCloseTo(det, 8);
  });

  it('translate applies translation to matrix', () => {
   const m = new Matrix3();
   const r = Matrix3.translate(m, { x: 10, y: 20 });
   expect(r.m20).toBeCloseTo(10, DIGITS);
   expect(r.m21).toBeCloseTo(20, DIGITS);
  });

  it('rotateCS rotates with precomputed cos/sin', () => {
   const m = new Matrix3();
   const r = Matrix3.rotateCS(m, 0, 1); // 90°
   expect(r.m00).toBeCloseTo(0, DIGITS);
   expect(r.m01).toBeCloseTo(1, DIGITS);
  });

  it('scaleBy scales matrix per-axis', () => {
   const m = new Matrix3();
   const r = Matrix3.scaleBy(m, { x: 2, y: 3 });
   expect(r.m00).toBeCloseTo(2, DIGITS);
   expect(r.m11).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Coverage: instance operations', () => {
  it('set updates all 9 components', () => {
   const m = new Matrix3();
   m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
   expect(m.m00).toBe(1);
   expect(m.m22).toBe(9);
  });

  it('isAffine checks bottom row', () => {
   const affine = new Matrix3(1, 0, 0, 0, 1, 0, 5, 10, 1);
   expect(affine.isAffine()).toBe(true);
   const nonAffine = new Matrix3(1, 0, 0.5, 0, 1, 0, 0, 0, 1);
   expect(nonAffine.isAffine()).toBe(false);
  });

  it('inverted getter returns new inverted matrix', () => {
   const m = new Matrix3(2, 0, 0, 0, 3, 0, 0, 0, 1);
   const inv = m.inverted;
   expect(inv).not.toBe(m);
   expect(inv.m00).toBeCloseTo(0.5, DIGITS);
   expect(inv.m11).toBeCloseTo(1 / 3, DIGITS);
  });

  it('inverted returns identity for singular matrix', () => {
   const m = new Matrix3(1, 0, 0, 1, 0, 0, 0, 0, 1);
   const inv = m.inverted;
   expect(Matrix3.isIdentity(inv)).toBe(true);
  });

  it('negated getter returns new negated matrix', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const neg = m.negated;
   expect(neg).not.toBe(m);
   expect(neg.m00).toBe(-1);
   expect(neg.m22).toBe(-9);
  });

  it('subtractScalar subtracts from all elements', () => {
   const m = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   m.subtractScalar(1);
   expect(m.m00).toBe(4);
   expect(m.m22).toBe(4);
  });

  it('negate negates all elements in place', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.negate();
   expect(m.m00).toBe(-1);
   expect(m.m22).toBe(-9);
  });

  it('adjugate instance matches static', () => {
   const m1 = new Matrix3(2, 1, 0, 0, 3, 1, 0, 0, 1);
   const m2 = m1.clone();
   const staticAdj = Matrix3.adjugate(m1);
   m2.adjugate();
   expect(m2.m00).toBeCloseTo(staticAdj.m00, DIGITS);
   expect(m2.m11).toBeCloseTo(staticAdj.m11, DIGITS);
  });

  it('premultiply instance computes other * this', () => {
   const a = new Matrix3(1, 2, 0, 3, 4, 0, 0, 0, 1);
   const b = new Matrix3(5, 6, 0, 7, 8, 0, 0, 0, 1);
   const expected = Matrix3.multiply(b, new Matrix3(1, 2, 0, 3, 4, 0, 0, 0, 1));
   a.premultiply(b);
   expect(a.m00).toBeCloseTo(expected.m00, DIGITS);
   expect(a.m11).toBeCloseTo(expected.m11, DIGITS);
  });
 });
});

describe('Static getTranslation/getScale/getRotation', () => {
 it('getTranslation extracts correct translation', () => {
  const m = Matrix3.fromTranslation(new Vector2(10, 20));
  const t = Matrix3.getTranslation(m);
  expect(t.x).toBeCloseTo(10, DIGITS);
  expect(t.y).toBeCloseTo(20, DIGITS);
 });

 it('getTranslation writes to out parameter', () => {
  const m = Matrix3.fromTranslation(new Vector2(5, 7));
  const out = new Vector2();
  const result = Matrix3.getTranslation(m, out);
  expect(result).toBe(out);
  expect(out.x).toBeCloseTo(5, DIGITS);
  expect(out.y).toBeCloseTo(7, DIGITS);
 });

 it('getScale extracts correct scale from rotated+scaled matrix', () => {
  const m = Matrix3.multiply(
   Matrix3.fromRotation(Math.PI / 3),
   Matrix3.fromScale(new Vector2(2, 3)),
  );
  const s = Matrix3.getScale(m);
  expect(s.x).toBeCloseTo(2, DIGITS);
  expect(s.y).toBeCloseTo(3, DIGITS);
 });

 it('getScale writes to out parameter', () => {
  const m = Matrix3.fromScale(new Vector2(4, 5));
  const out = new Vector2();
  const result = Matrix3.getScale(m, out);
  expect(result).toBe(out);
  expect(out.x).toBeCloseTo(4, DIGITS);
  expect(out.y).toBeCloseTo(5, DIGITS);
 });

 it('getRotation extracts correct angle', () => {
  const m = Matrix3.fromRotation(Math.PI / 4);
  expect(Matrix3.getRotation(m)).toBeCloseTo(Math.PI / 4, DIGITS);
 });

 // V9-Matrix3-02: atan2 directly — IEEE 754 §9.2.1 `atan2(0, 0) = 0`, NaN propagates per §6.2
 it('getRotation returns atan2(0, 0) = 0 for all-zero upper-left block', () => {
  const m = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 1);
  expect(Matrix3.getRotation(m)).toBe(0); // atan2(0, 0) = 0 per IEEE 754 §9.2.1
 });

 it('getRotation returns π/2 for singular matrix with m01 > 0, m00 = 0', () => {
  // Previously returned 0 (via isNearZero short-circuit). Now returns atan2(1, 0) = π/2
  // per IEEE 754, exposing the true IEEE-correct angle rather than fabricating 0.
  const m = new Matrix3(0, 1, 0, 0, 0, 0, 0, 0, 1);
  expect(Matrix3.getRotation(m)).toBeCloseTo(Math.PI / 2, DIGITS);
 });

 it('getRotation propagates NaN per IEEE 754 §6.2', () => {
  const m = new Matrix3(Number.NaN, 0, 0, 0, 1, 0, 0, 0, 1);
  expect(Matrix3.getRotation(m)).toBeNaN();
 });

 it('static and instance getters produce identical results', () => {
  const m = Matrix3.multiply(
   Matrix3.fromTranslation(new Vector2(10, 20)),
   Matrix3.multiply(Matrix3.fromRotation(Math.PI / 6), Matrix3.fromScale(new Vector2(2, 3))),
  );
  expect(Matrix3.getRotation(m)).toBeCloseTo(m.getRotation(), DIGITS);
  const staticScale = Matrix3.getScale(m);
  const instanceScale = m.getScale();
  expect(staticScale.x).toBeCloseTo(instanceScale.x, DIGITS);
  expect(staticScale.y).toBeCloseTo(instanceScale.y, DIGITS);
  const staticTranslation = Matrix3.getTranslation(m);
  const instanceTranslation = m.getTranslation();
  expect(staticTranslation.x).toBeCloseTo(instanceTranslation.x, DIGITS);
  expect(staticTranslation.y).toBeCloseTo(instanceTranslation.y, DIGITS);
 });
});

describe('Matrix3 Safe/Unchecked variants', () => {
 it('static inverseSafe returns identity for singular matrix', () => {
  const singular = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9); // det = 0
  const result = Matrix3.inverseSafe(singular);
  expect(result.m00).toBe(1);
  expect(result.m01).toBe(0);
  expect(result.m02).toBe(0);
  expect(result.m10).toBe(0);
  expect(result.m11).toBe(1);
  expect(result.m12).toBe(0);
  expect(result.m20).toBe(0);
  expect(result.m21).toBe(0);
  expect(result.m22).toBe(1);
 });

 it('static inverseUnchecked produces correct inverse for invertible matrix', () => {
  const m = new Matrix3(1, 0, 0, 0, 2, 0, 3, 4, 1);
  const result = Matrix3.inverseUnchecked(m);
  const product = Matrix3.multiply(m, result);
  expect(product.m00).toBeCloseTo(1, DIGITS);
  expect(product.m01).toBeCloseTo(0, DIGITS);
  expect(product.m02).toBeCloseTo(0, DIGITS);
  expect(product.m10).toBeCloseTo(0, DIGITS);
  expect(product.m11).toBeCloseTo(1, DIGITS);
  expect(product.m12).toBeCloseTo(0, DIGITS);
  expect(product.m20).toBeCloseTo(0, DIGITS);
  expect(product.m21).toBeCloseTo(0, DIGITS);
  expect(product.m22).toBeCloseTo(1, DIGITS);
 });

 it('static divideScalarSafe returns zero matrix for near-zero scalar', () => {
  const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  const result = Matrix3.divideScalarSafe(m, 0);
  expect(result.m00).toBe(0);
  expect(result.m11).toBe(0);
  expect(result.m22).toBe(0);
 });

 it('static divideScalarUnchecked produces correct result for valid scalar', () => {
  const m = new Matrix3(2, 4, 6, 8, 10, 12, 14, 16, 18);
  const result = Matrix3.divideScalarUnchecked(m, 2);
  expect(result.m00).toBeCloseTo(1, DIGITS);
  expect(result.m01).toBeCloseTo(2, DIGITS);
  expect(result.m10).toBeCloseTo(4, DIGITS);
  expect(result.m11).toBeCloseTo(5, DIGITS);
  expect(result.m22).toBeCloseTo(9, DIGITS);
 });

 it('instance inverseSafe returns identity for singular matrix', () => {
  const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  m.inverseSafe();
  expect(m.m00).toBe(1);
  expect(m.m01).toBe(0);
  expect(m.m10).toBe(0);
  expect(m.m11).toBe(1);
  expect(m.m22).toBe(1);
 });

 it('instance inverseUnchecked produces correct inverse', () => {
  const m = new Matrix3(1, 0, 0, 0, 2, 0, 3, 4, 1);
  const original = m.clone();
  m.inverseUnchecked();
  const product = Matrix3.multiply(original, m);
  expect(product.m00).toBeCloseTo(1, DIGITS);
  expect(product.m01).toBeCloseTo(0, DIGITS);
  expect(product.m10).toBeCloseTo(0, DIGITS);
  expect(product.m11).toBeCloseTo(1, DIGITS);
  expect(product.m22).toBeCloseTo(1, DIGITS);
 });

 it('instance divideScalarSafe returns zero for near-zero scalar', () => {
  const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  m.divideScalarSafe(0);
  expect(m.m00).toBe(0);
  expect(m.m11).toBe(0);
  expect(m.m22).toBe(0);
 });

 it('instance divideScalarUnchecked produces correct result', () => {
  const m = new Matrix3(2, 4, 6, 8, 10, 12, 14, 16, 18);
  m.divideScalarUnchecked(2);
  expect(m.m00).toBeCloseTo(1, DIGITS);
  expect(m.m01).toBeCloseTo(2, DIGITS);
  expect(m.m10).toBeCloseTo(4, DIGITS);
  expect(m.m11).toBeCloseTo(5, DIGITS);
  expect(m.m22).toBeCloseTo(9, DIGITS);
 });

 describe('Matrix3.fromReflection', () => {
  it('reflects about Y-axis (normal = (1, 0)) — negates x-coordinates', () => {
   const m = Matrix3.fromReflection({ x: 1, y: 0 });
   expect(m.m00).toBeCloseTo(-1, DIGITS);
   expect(m.m01).toBeCloseTo(0, DIGITS);
   expect(m.m10).toBeCloseTo(0, DIGITS);
   expect(m.m11).toBeCloseTo(1, DIGITS);
   expect(m.m22).toBeCloseTo(1, DIGITS);
  });

  it('reflects about X-axis (normal = (0, 1)) — negates y-coordinates', () => {
   const m = Matrix3.fromReflection({ x: 0, y: 1 });
   expect(m.m00).toBeCloseTo(1, DIGITS);
   expect(m.m01).toBeCloseTo(0, DIGITS);
   expect(m.m10).toBeCloseTo(0, DIGITS);
   expect(m.m11).toBeCloseTo(-1, DIGITS);
   expect(m.m22).toBeCloseTo(1, DIGITS);
  });

  it('reflects about diagonal (normal = (√2/2, √2/2))', () => {
   const m = Matrix3.fromReflection({ x: Math.SQRT1_2, y: Math.SQRT1_2 });
   expect(m.m00).toBeCloseTo(0, DIGITS);
   expect(m.m01).toBeCloseTo(-1, DIGITS);
   expect(m.m10).toBeCloseTo(-1, DIGITS);
   expect(m.m11).toBeCloseTo(0, DIGITS);
  });

  it('out parameter avoids allocation', () => {
   const out = new Matrix3();
   const result = Matrix3.fromReflection({ x: 1, y: 0 }, out);
   expect(result).toBe(out);
  });
 });

 /* ===== inverseAffine (3 tiers) ===== */

 describe('inverseAffine', () => {
  it('inverse of identity is identity', () => {
   const result = Matrix3.inverseAffine(Matrix3.IDENTITY);
   expect(result.m00).toBeCloseTo(1, DIGITS);
   expect(result.m11).toBeCloseTo(1, DIGITS);
   expect(result.m20).toBeCloseTo(0, DIGITS);
   expect(result.m21).toBeCloseTo(0, DIGITS);
   expect(result.m22).toBeCloseTo(1, DIGITS);
  });

  it('inverse of translation negates translation', () => {
   const m = Matrix3.fromTranslation(new Vector2(10, 20));
   const inv = Matrix3.inverseAffine(m);
   expect(inv.m20).toBeCloseTo(-10, DIGITS);
   expect(inv.m21).toBeCloseTo(-20, DIGITS);
  });

  it('throws on non-affine matrix', () => {
   const m = new Matrix3();
   m.set(1, 0, 0, 0, 1, 0, 0, 0, 2); // m22 ≠ 1
   expect(() => Matrix3.inverseAffine(m)).toThrow(RangeError);
  });

  it('throws on singular affine matrix', () => {
   const m = new Matrix3();
   m.set(0, 0, 0, 0, 0, 0, 0, 0, 1); // zero upper-left
   expect(() => Matrix3.inverseAffine(m)).toThrow(RangeError);
  });
 });

 describe('inverseAffineSafe', () => {
  it('returns identity for non-affine matrix', () => {
   const m = new Matrix3();
   m.set(1, 0, 0, 0, 1, 0, 0, 0, 2);
   const result = Matrix3.inverseAffineSafe(m);
   expect(result.m00).toBeCloseTo(1, DIGITS);
   expect(result.m11).toBeCloseTo(1, DIGITS);
   expect(result.m20).toBeCloseTo(0, DIGITS);
   expect(result.m21).toBeCloseTo(0, DIGITS);
  });

  it('returns identity for singular affine matrix', () => {
   const m = new Matrix3();
   m.set(0, 0, 0, 0, 0, 0, 0, 0, 1);
   const result = Matrix3.inverseAffineSafe(m);
   expect(result.m00).toBeCloseTo(1, DIGITS);
   expect(result.m11).toBeCloseTo(1, DIGITS);
  });

  it('returns correct inverse for valid affine matrix', () => {
   const m = Matrix3.fromTranslation(new Vector2(5, 10));
   const inv = Matrix3.inverseAffineSafe(m);
   expect(inv.m20).toBeCloseTo(-5, DIGITS);
   expect(inv.m21).toBeCloseTo(-10, DIGITS);
  });
 });

 describe('inverseAffineUnchecked', () => {
  it('inverse of identity is identity', () => {
   const result = Matrix3.inverseAffineUnchecked(Matrix3.IDENTITY);
   expect(result.m00).toBeCloseTo(1, DIGITS);
   expect(result.m11).toBeCloseTo(1, DIGITS);
   expect(result.m20).toBeCloseTo(0, DIGITS);
   expect(result.m21).toBeCloseTo(0, DIGITS);
  });
 });

 /* ===== instance inverseAffine variants ===== */

 describe('instance inverseAffine', () => {
  it('mutates in place and chains', () => {
   const m = Matrix3.fromTranslation(new Vector2(10, 20));
   expect(m.inverseAffine()).toBe(m);
   expect(m.m20).toBeCloseTo(-10, DIGITS);
   expect(m.m21).toBeCloseTo(-20, DIGITS);
  });

  it('instance inverseAffineSafe returns identity for singular', () => {
   const m = new Matrix3();
   m.set(0, 0, 0, 0, 0, 0, 0, 0, 1);
   expect(m.inverseAffineSafe()).toBe(m);
   expect(m.m00).toBeCloseTo(1, DIGITS);
   expect(m.m11).toBeCloseTo(1, DIGITS);
  });

  it('instance inverseAffineUnchecked mutates in place', () => {
   const m = Matrix3.fromTranslation(new Vector2(3, 7));
   expect(m.inverseAffineUnchecked()).toBe(m);
   expect(m.m20).toBeCloseTo(-3, DIGITS);
   expect(m.m21).toBeCloseTo(-7, DIGITS);
  });
 });

 /* ===== fromTransform2Like ===== */

 describe('fromTransform2Like', () => {
  it('produces same result as fromTransform2', () => {
   const t = new Transform2(new Vector2(10, 20), Math.PI / 4, new Vector2(2, 2));
   const fromLike = Matrix3.fromTransform2Like(t);
   const fromDirect = Matrix3.fromTransform2(new Vector2(10, 20), Math.PI / 4, new Vector2(2, 2));
   expect(fromLike.m00).toBeCloseTo(fromDirect.m00, DIGITS);
   expect(fromLike.m01).toBeCloseTo(fromDirect.m01, DIGITS);
   expect(fromLike.m10).toBeCloseTo(fromDirect.m10, DIGITS);
   expect(fromLike.m11).toBeCloseTo(fromDirect.m11, DIGITS);
   expect(fromLike.m20).toBeCloseTo(fromDirect.m20, DIGITS);
   expect(fromLike.m21).toBeCloseTo(fromDirect.m21, DIGITS);
  });

  it('identity transform produces identity matrix', () => {
   const t = Transform2.IDENTITY;
   const m = Matrix3.fromTransform2Like(t);
   expect(m.m00).toBeCloseTo(1, DIGITS);
   expect(m.m11).toBeCloseTo(1, DIGITS);
   expect(m.m20).toBeCloseTo(0, DIGITS);
   expect(m.m21).toBeCloseTo(0, DIGITS);
  });
 });

 /* ===== setTranslation ===== */

 describe('setTranslation', () => {
  it('modifies only m20 and m21', () => {
   const m = Matrix3.fromRotation(Math.PI / 4);
   const origM00 = m.m00;
   const origM01 = m.m01;
   m.setTranslation({ x: 100, y: 50 });
   expect(m.m20).toBe(100);
   expect(m.m21).toBe(50);
   expect(m.m00).toBe(origM00);
   expect(m.m01).toBe(origM01);
  });

  it('returns this for chaining', () => {
   const m = new Matrix3();
   expect(m.setTranslation({ x: 1, y: 2 })).toBe(m);
  });
 });

 /* ===== solveLinearSystem (3 tiers) ===== */

 describe('solveLinearSystem', () => {
  it('solves identity system', () => {
   expect.hasAssertions();
   const result = Matrix3.solveLinearSystem(Matrix3.IDENTITY, [3, 5, 7]);
   expect(result[0]).toBeCloseTo(3, DIGITS);
   expect(result[1]).toBeCloseTo(5, DIGITS);
   expect(result[2]).toBeCloseTo(7, DIGITS);
  });

  it('solves non-trivial system with roundtrip verification', () => {
   expect.hasAssertions();
   // A = [2 1 0; 1 3 1; 0 1 2], b = [5, 10, 7]
   const A = new Matrix3(2, 1, 0, 1, 3, 1, 0, 1, 2);
   const b: [number, number, number] = [5, 10, 7];
   const x = Matrix3.solveLinearSystem(A, b);

   // Verify A * x ≈ b (roundtrip)
   const b0 = A.m00 * x[0] + A.m10 * x[1] + A.m20 * x[2];
   const b1 = A.m01 * x[0] + A.m11 * x[1] + A.m21 * x[2];
   const b2 = A.m02 * x[0] + A.m12 * x[1] + A.m22 * x[2];
   expect(b0).toBeCloseTo(b[0], DIGITS);
   expect(b1).toBeCloseTo(b[1], DIGITS);
   expect(b2).toBeCloseTo(b[2], DIGITS);
  });

  it('throws on singular matrix', () => {
   expect.hasAssertions();
   // Rows are linearly dependent: row2 = row0 + row1
   const singular = new Matrix3(1, 0, 1, 0, 1, 1, 0, 0, 0);
   expect(() => Matrix3.solveLinearSystem(singular, [1, 2, 3])).toThrow(RangeError);
  });
 });

 describe('solveLinearSystemSafe', () => {
  it('returns [0,0,0] for singular matrix', () => {
   expect.hasAssertions();
   const singular = new Matrix3(1, 0, 1, 0, 1, 1, 0, 0, 0);
   const result = Matrix3.solveLinearSystemSafe(singular, [1, 2, 3]);
   expect(result[0]).toBe(0);
   expect(result[1]).toBe(0);
   expect(result[2]).toBe(0);
  });

  it('solves non-singular system normally', () => {
   expect.hasAssertions();
   const result = Matrix3.solveLinearSystemSafe(Matrix3.IDENTITY, [3, 5, 7]);
   expect(result[0]).toBeCloseTo(3, DIGITS);
   expect(result[1]).toBeCloseTo(5, DIGITS);
   expect(result[2]).toBeCloseTo(7, DIGITS);
  });
 });

 describe('solveLinearSystemUnchecked', () => {
  it('solves identity system', () => {
   expect.hasAssertions();
   const result = Matrix3.solveLinearSystemUnchecked(Matrix3.IDENTITY, [7, 11, 13]);
   expect(result[0]).toBeCloseTo(7, DIGITS);
   expect(result[1]).toBeCloseTo(11, DIGITS);
   expect(result[2]).toBeCloseTo(13, DIGITS);
  });

  it('singular matrix produces NaN or Infinity (GIGO contract — never throws)', () => {
   // All-zero matrix has determinant 0 — singular
   const singular = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
   let result!: [number, number, number];
   expect(() => {
    result = Matrix3.solveLinearSystemUnchecked(singular, [1, 2, 3]);
   }).not.toThrow();
   // At least one component must be NaN or non-finite (division by zero det)
   const hasNaNOrInfinity = result.some((v) => Number.isNaN(v) || !Number.isFinite(v));
   expect(hasNaNOrInfinity).toBe(true);
  });
 });
});
