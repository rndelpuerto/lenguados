import { describe, expect, it } from '@jest/globals';

import { Matrix3 } from '../../src/core/matrix3';
import { Vector2 } from '../../src/core/vector2';

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
   const mat = Matrix3.fromTransform(new Vector2(10, -4), Math.PI / 4, new Vector2(2, 1));
   expectMatTranslation(mat, 10, -4);
   expect(mat.isAffine()).toBe(true);
  });

  it('fromMatrix2 promotes 2x2 block', () => {
   expect.hasAssertions();
   const mat2 = Matrix3.fromMatrix2(Matrix3.IDENTITY as unknown as Matrix3);
   expect(mat2.m22).toBe(1);
   expect(mat2.m02).toBe(0);
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
   const transform = Matrix3.fromTransform(new Vector2(5, -2), Math.PI / 3, 2);
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
   const mat = Matrix3.fromTransform(new Vector2(10, 5), 0, new Vector2(2, 3));
   const result = mat.transformPoint(new Vector2(2, 2));
   expectVecClose(result, 14, 11);
  });

  it('transformVector ignores translation', () => {
   expect.hasAssertions();
   const mat = Matrix3.fromTransform(new Vector2(100, 200), Math.PI / 2, 1);
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
   const mat = Matrix3.fromTransform(new Vector2(7, -3), Math.PI / 4, new Vector2(3, 4));
   const translation = mat.getTranslation();
   expectVecClose(translation, 7, -3);

   const scale = mat.getScale();
   expectVecClose(scale, 3, 4);

   expect(mat.getRotation()).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });
});
