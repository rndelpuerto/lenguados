import { describe, expect, it } from '@jest/globals';

import { Matrix2 as Mat2 } from '../../src/core/matrix2';
import { Vector2 } from '../../src/core/vector2';

describe('Matrix2', () => {
 describe('Constants', () => {
  it('IDENTITY', () => {
   const I = Mat2.IDENTITY;
   expect(I.m00).toBe(1);
   expect(I.m11).toBe(1);
   expect(I.m01).toBe(0);
   expect(I.m10).toBe(0);
  });

  it('ZERO', () => {
   const Z = Mat2.ZERO;
   expect(Z.m00).toBe(0);
   expect(Z.m11).toBe(0);
  });
 });

 describe('Construction', () => {
  it('constructor', () => {
   const m = new Mat2(1, 2, 3, 4);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('fromRotation uses deterministic trig', () => {
   const m = Mat2.fromRotation(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
   expect(m.m10).toBeCloseTo(-1);
   expect(m.m11).toBeCloseTo(0);
  });

  it('fromScale (vector and scalar)', () => {
   const vScale = Mat2.fromScale(new Vector2(2, 3));
   expect(vScale.m00).toBe(2);
   expect(vScale.m11).toBe(3);

   const sScale = Mat2.fromScale(5);
   expect(sScale.m00).toBe(5);
   expect(sScale.m11).toBe(5);
  });

  it('fromShear/fromColumns/fromRows populate expected entries', () => {
   const shear = Mat2.fromShear(new Vector2(2, 3));
   expect(shear.m01).toBe(3);
   expect(shear.m10).toBe(2);

   const columns = Mat2.fromColumns(new Vector2(1, 2), new Vector2(3, 4));
   expect(columns.m00).toBe(1);
   expect(columns.m01).toBe(2);
   expect(columns.m10).toBe(3);
   expect(columns.m11).toBe(4);

   const rows = Mat2.fromRows(new Vector2(5, 6), new Vector2(7, 8));
   expect(rows.m00).toBe(5);
   expect(rows.m01).toBe(7);
   expect(rows.m10).toBe(6);
   expect(rows.m11).toBe(8);
  });

  it('fromArray validates bounds', () => {
   expect(() => Mat2.fromArray([1, 2, 3], 2)).toThrow(RangeError);
   const m = Mat2.fromArray([1, 2, 3, 4]);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });
 });

 describe('Instance vs static operations', () => {
  it('add mutates instance while static add returns new matrix', () => {
   const A = new Mat2(1, 2, 3, 4);
   const B = new Mat2(5, 6, 7, 8);
   const returned = A.add(B);
   expect(returned).toBe(A);
   expect(A.equals(new Mat2(6, 8, 10, 12))).toBe(true);
   const staticSum = Mat2.add(new Mat2(1, 2, 3, 4), B);
   expect(staticSum.equals(new Mat2(6, 8, 10, 12))).toBe(true);
  });

  it('multiply respects identity', () => {
   const A = new Mat2(1, 2, 3, 4);
   const result = A.multiply(Mat2.IDENTITY);
   expect(result).toBe(A);
   expect(A.equals(new Mat2(1, 2, 3, 4))).toBe(true);
   const staticResult = Mat2.multiply(new Mat2(1, 2, 3, 4), Mat2.IDENTITY);
   expect(staticResult.equals(new Mat2(1, 2, 3, 4))).toBe(true);
  });

  it('determinant and inverse', () => {
   const m = new Mat2(4, 7, 2, 6);
   const det = m.determinant();
   expect(det).toBe(10);
   const inv = new Mat2(4, 7, 2, 6).inverse();
   const product = Mat2.multiply(m, inv);
   expect(product.isIdentity(1e-6)).toBe(true);
  });

  it('static inverse throws for singular matrix', () => {
   expect(() => Mat2.inverse(Mat2.ZERO)).toThrow('Matrix2.inverse: matrix is singular');
  });

  it('transpose swaps off-diagonals', () => {
   const m = new Mat2(1, 2, 3, 4);
   m.transpose();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(3);
   expect(m.m10).toBe(2);
   expect(m.m11).toBe(4);
  });
 });

 describe('Vector Transformations', () => {
  it('transformVector allocates when out not provided', () => {
   const m = Mat2.fromScale(2);
   const v = new Vector2(1, 2);
   const result = m.transformVector(v);
   expect(result.x).toBe(2);
   expect(result.y).toBe(4);
  });

  it('transformVector uses out parameter', () => {
   const m = Mat2.fromScale(3);
   const out = new Vector2();
   const returned = m.transformVector(new Vector2(1, 1), out);
   expect(returned).toBe(out);
   expect(out.x).toBe(3);
   expect(out.y).toBe(3);
  });

  it('transformVector static honors out parameter', () => {
   const out = new Vector2();
   const result = Mat2.transformVector(Mat2.fromRotation(Math.PI / 2), new Vector2(1, 0), out);
   expect(result).toBe(out);
   expect(out.x).toBeCloseTo(0);
   expect(out.y).toBeCloseTo(1);
  });
 });
});
