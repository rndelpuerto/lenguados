/**
 * @file test/core/matrix2.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Tests for Matrix2 core behavior.
 */

import { describe, expect, it } from '@jest/globals';

import { Matrix2 } from '../../src/core/matrix2';
import { Vector2 } from '../../src/core/vector2';

// DIGITS = 10 matches EPSILON = 1e-10 — the library's documented tolerance
const DIGITS = 10;

describe('Matrix2', () => {
 describe('Constants', () => {
  it('IDENTITY', () => {
   const I = Matrix2.IDENTITY;
   expect(I.m00).toBe(1);
   expect(I.m11).toBe(1);
   expect(I.m01).toBe(0);
   expect(I.m10).toBe(0);
  });

  it('ZERO', () => {
   const Z = Matrix2.ZERO;
   expect(Z.m00).toBe(0);
   expect(Z.m11).toBe(0);
  });
 });

 describe('Construction', () => {
  it('constructor', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('fromRotation uses deterministic trig', () => {
   const m = Matrix2.fromRotation(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
   expect(m.m10).toBeCloseTo(-1);
   expect(m.m11).toBeCloseTo(0);
  });

  it('fromScale (vector and scalar)', () => {
   const vScale = Matrix2.fromScale(new Vector2(2, 3));
   expect(vScale.m00).toBe(2);
   expect(vScale.m11).toBe(3);

   const sScale = Matrix2.fromScale(5);
   expect(sScale.m00).toBe(5);
   expect(sScale.m11).toBe(5);
  });

  it('fromShear/fromColumns/fromRows populate expected entries', () => {
   const shear = Matrix2.fromShear(new Vector2(2, 3));
   expect(shear.m01).toBe(3);
   expect(shear.m10).toBe(2);

   const columns = Matrix2.fromColumns(new Vector2(1, 2), new Vector2(3, 4));
   expect(columns.m00).toBe(1);
   expect(columns.m01).toBe(2);
   expect(columns.m10).toBe(3);
   expect(columns.m11).toBe(4);

   const rows = Matrix2.fromRows(new Vector2(5, 6), new Vector2(7, 8));
   expect(rows.m00).toBe(5);
   expect(rows.m01).toBe(7);
   expect(rows.m10).toBe(6);
   expect(rows.m11).toBe(8);
  });

  it('fromArray validates bounds', () => {
   expect(() => Matrix2.fromArray([1, 2, 3], 2)).toThrow(RangeError);
   const m = Matrix2.fromArray([1, 2, 3, 4]);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });
 });

 describe('Instance vs static operations', () => {
  it('add mutates instance while static add returns new matrix', () => {
   const A = new Matrix2(1, 2, 3, 4);
   const B = new Matrix2(5, 6, 7, 8);
   const returned = A.add(B);
   expect(returned).toBe(A);
   expect(A.exactEquals(new Matrix2(6, 8, 10, 12))).toBe(true);
   const staticSum = Matrix2.add(new Matrix2(1, 2, 3, 4), B);
   expect(staticSum.exactEquals(new Matrix2(6, 8, 10, 12))).toBe(true);
  });

  it('multiply respects identity', () => {
   const A = new Matrix2(1, 2, 3, 4);
   const result = A.multiply(Matrix2.IDENTITY);
   expect(result).toBe(A);
   expect(A.exactEquals(new Matrix2(1, 2, 3, 4))).toBe(true);
   const staticResult = Matrix2.multiply(new Matrix2(1, 2, 3, 4), Matrix2.IDENTITY);
   expect(staticResult.exactEquals(new Matrix2(1, 2, 3, 4))).toBe(true);
  });

  it('determinant and inverse', () => {
   const m = new Matrix2(4, 7, 2, 6);
   const det = m.determinant();
   expect(det).toBe(10);
   const inv = new Matrix2(4, 7, 2, 6).inverse();
   const product = Matrix2.multiply(m, inv);
   expect(product.isIdentity(1e-6)).toBe(true);
  });

  it('static inverse throws for singular matrix', () => {
   expect(() => Matrix2.inverse(Matrix2.ZERO)).toThrow('Matrix2.inverse: matrix is singular');
  });

  it('transpose swaps off-diagonals', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.transpose();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(3);
   expect(m.m10).toBe(2);
   expect(m.m11).toBe(4);
  });
 });

 describe('Vector Transformations', () => {
  it('transformVector allocates when out not provided', () => {
   const m = Matrix2.fromScale(2);
   const v = new Vector2(1, 2);
   const result = m.transformVector(v);
   expect(result.x).toBe(2);
   expect(result.y).toBe(4);
  });

  it('transformVector uses out parameter', () => {
   const m = Matrix2.fromScale(3);
   const out = new Vector2();
   const returned = m.transformVector(new Vector2(1, 1), out);
   expect(returned).toBe(out);
   expect(out.x).toBe(3);
   expect(out.y).toBe(3);
  });

  it('transformVector static honors out parameter', () => {
   const out = new Vector2();
   const result = Matrix2.transformVector(
    Matrix2.fromRotation(Math.PI / 2),
    new Vector2(1, 0),
    out,
   );
   expect(result).toBe(out);
   expect(out.x).toBeCloseTo(0);
   expect(out.y).toBeCloseTo(1);
  });
 });

 describe('Additional Operations', () => {
  it('subtract mutates instance', () => {
   const A = new Matrix2(5, 6, 7, 8);
   const B = new Matrix2(1, 2, 3, 4);
   A.subtract(B);
   expect(A.exactEquals(new Matrix2(4, 4, 4, 4))).toBe(true);
  });

  it('multiplyScalar mutates instance', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.multiplyScalar(2);
   expect(m.exactEquals(new Matrix2(2, 4, 6, 8))).toBe(true);
  });

  it('negate mutates instance', () => {
   const m = new Matrix2(1, -2, 3, -4);
   m.negate();
   expect(m.exactEquals(new Matrix2(-1, 2, -3, 4))).toBe(true);
  });

  it('clone creates independent copy', () => {
   const original = new Matrix2(1, 2, 3, 4);
   const cloned = original.clone();
   expect(cloned.exactEquals(original)).toBe(true);
   expect(cloned).not.toBe(original);
   cloned.m00 = 999;
   expect(original.m00).toBe(1);
  });

  it('copy copies values from source', () => {
   const source = new Matrix2(1, 2, 3, 4);
   const target = new Matrix2();
   const returned = target.copy(source);
   expect(returned).toBe(target);
   expect(target.exactEquals(source)).toBe(true);
  });

  it('set updates all components', () => {
   const m = new Matrix2();
   m.set(5, 6, 7, 8);
   expect(m.m00).toBe(5);
   expect(m.m01).toBe(6);
   expect(m.m10).toBe(7);
   expect(m.m11).toBe(8);
  });
 });

 describe('Properties', () => {
  it('trace returns sum of diagonals', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.trace()).toBe(5);
  });
 });

 describe('Conversion', () => {
  it('toArray returns flat array', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('toObject returns plain object', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.toObject()).toEqual({ m00: 1, m01: 2, m10: 3, m11: 4 });
  });
 });

 describe('Static Operations', () => {
  it('lerp interpolates between matrices', () => {
   const A = new Matrix2(0, 0, 0, 0);
   const B = new Matrix2(10, 10, 10, 10);
   const mid = Matrix2.lerp(A, B, 0.5);
   expect(mid.m00).toBe(5);
   expect(mid.m11).toBe(5);
  });

  it('multiplyScalar static returns new matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const scaled = Matrix2.multiplyScalar(m, 3);
   expect(scaled.m00).toBe(3);
   expect(scaled.m11).toBe(12);
   expect(m.m00).toBe(1); // original unchanged
  });
 });

 describe('Rotation Constants', () => {
  it('ROTATE_90 rotates 90 degrees CCW', () => {
   const rotated = Matrix2.ROTATE_90.transformVector(new Vector2(1, 0));
   expect(rotated.x).toBeCloseTo(0);
   expect(rotated.y).toBeCloseTo(1);
  });

  it('ROTATE_180 rotates 180 degrees', () => {
   const rotated = Matrix2.ROTATE_180.transformVector(new Vector2(1, 0));
   expect(rotated.x).toBeCloseTo(-1);
   expect(rotated.y).toBeCloseTo(0);
  });

  it('FLIP_X flips along X axis', () => {
   const flipped = Matrix2.FLIP_X.transformVector(new Vector2(1, 1));
   expect(flipped.x).toBe(-1);
   expect(flipped.y).toBe(1);
  });

  it('FLIP_Y flips along Y axis', () => {
   const flipped = Matrix2.FLIP_Y.transformVector(new Vector2(1, 1));
   expect(flipped.x).toBe(1);
   expect(flipped.y).toBe(-1);
  });
 });

 describe('Instance Methods - Additional', () => {
  it('set updates all components', () => {
   const m = new Matrix2();
   m.set(1, 2, 3, 4);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('copy copies from source', () => {
   const m = new Matrix2();
   m.copy(new Matrix2(5, 6, 7, 8));
   expect(m.m00).toBe(5);
   expect(m.m11).toBe(8);
  });

  it('clone creates independent copy', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const c = m.clone();
   expect(c.m00).toBe(1);
   expect(c).not.toBe(m);
  });

  it('add adds matrices', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.add(new Matrix2(1, 1, 1, 1));
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(5);
  });

  it('subtract subtracts matrices', () => {
   const m = new Matrix2(5, 6, 7, 8);
   m.subtract(new Matrix2(1, 2, 3, 4));
   expect(m.m00).toBe(4);
   expect(m.m11).toBe(4);
  });

  it('multiply multiplies matrices', () => {
   const m = new Matrix2(1, 0, 0, 1);
   m.multiply(new Matrix2(2, 0, 0, 2));
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(2);
  });

  it('multiplyScalar scales matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(8);
  });

  it('transpose transposes', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.transpose();
   expect(m.m01).toBe(3);
   expect(m.m10).toBe(2);
  });

  it('inverse returns inverted matrix', () => {
   const m = new Matrix2(2, 0, 0, 2);
   const inv = m.inverse();
   expect(inv.m00).toBeCloseTo(0.5);
   expect(inv.m11).toBeCloseTo(0.5);
  });

  it('negate negates', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.negate();
   expect(m.m00).toBe(-1);
   expect(m.m11).toBe(-4);
  });

  it('determinant returns determinant', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.determinant()).toBe(-2);
  });

  it('equals checks equality', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.exactEquals(new Matrix2(1, 2, 3, 4))).toBe(true);
   expect(m.exactEquals(new Matrix2(1, 2, 3, 5))).toBe(false);
  });

  it('transformVector transforms vector', () => {
   const m = Matrix2.fromRotation(Math.PI / 2);
   const v = m.transformVector(new Vector2(1, 0));
   expect(v.x).toBeCloseTo(0);
   expect(v.y).toBeCloseTo(1);
  });

  it('toString returns formatted string', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.toString()).toContain('Matrix2');
  });
 });

 describe('Static Factory Methods', () => {
  it('fromValues creates matrix', () => {
   const m = Matrix2.fromValues(1, 2, 3, 4);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('fromArray creates from array', () => {
   const m = Matrix2.fromArray([1, 2, 3, 4]);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('fromScale creates scaling matrix', () => {
   const m = Matrix2.fromScale(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(2);
  });
 });

 describe('Static Operations - Additional', () => {
  it('add adds two matrices', () => {
   const result = Matrix2.add(new Matrix2(1, 2, 3, 4), new Matrix2(1, 1, 1, 1));
   expect(result.m00).toBe(2);
  });

  it('subtract subtracts two matrices', () => {
   const result = Matrix2.subtract(new Matrix2(5, 6, 7, 8), new Matrix2(1, 2, 3, 4));
   expect(result.m00).toBe(4);
  });

  it('multiply multiplies two matrices', () => {
   const result = Matrix2.multiply(Matrix2.IDENTITY, new Matrix2(2, 0, 0, 2));
   expect(result.m00).toBe(2);
  });

  it('transpose transposes matrix', () => {
   const result = Matrix2.transpose(new Matrix2(1, 2, 3, 4));
   expect(result.m01).toBe(3);
  });

  it('inverse inverts matrix', () => {
   const result = Matrix2.inverse(new Matrix2(2, 0, 0, 2));
   expect(result.m00).toBeCloseTo(0.5);
  });

  it('determinant computes determinant', () => {
   expect(Matrix2.determinant(new Matrix2(1, 2, 3, 4))).toBe(-2);
  });

  it('negate negates matrix', () => {
   const result = Matrix2.negate(new Matrix2(1, 2, 3, 4));
   expect(result.m00).toBe(-1);
  });

  it('equals checks equality', () => {
   expect(Matrix2.exactEquals(new Matrix2(1, 2, 3, 4), new Matrix2(1, 2, 3, 4))).toBe(true);
  });

  it('adjugate computes adjugate matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const adj = Matrix2.adjugate(m);
   expect(adj.m00).toBe(4);
   expect(adj.m11).toBe(1);
  });

  it('clone creates independent copy', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const c = Matrix2.clone(m);
   expect(c.m00).toBe(1);
   expect(c).not.toBe(m);
  });

  it('compose creates rotation-scale matrix', () => {
   const m = Matrix2.compose(0, 2);
   expect(m.m00).toBeCloseTo(2);
   expect(m.m11).toBeCloseTo(2);
  });

  it('decompose extracts rotation and scale', () => {
   const m = Matrix2.fromRotation(Math.PI / 4);
   const { rotation, scale } = Matrix2.decompose(m);
   expect(rotation).toBeCloseTo(Math.PI / 4);
   expect(scale.x).toBeCloseTo(1);
   expect(scale.y).toBeCloseTo(1);
  });

  it('transformVector transforms a vector', () => {
   const m = Matrix2.fromRotation(Math.PI / 2);
   const result = Matrix2.transformVector(m, new Vector2(1, 0));
   expect(result.x).toBeCloseTo(0);
   expect(result.y).toBeCloseTo(1);
  });
 });

 describe('Instance Methods - Full Coverage', () => {
  it('multiplyScalar scales all elements', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(8);
  });

  it('premultiply multiplies from left', () => {
   const a = new Matrix2(1, 0, 0, 1);
   const b = new Matrix2(2, 0, 0, 2);
   a.premultiply(b);
   expect(a.m00).toBe(2);
  });

  it('lerp interpolates matrices', () => {
   const m = new Matrix2(0, 0, 0, 0);
   m.lerp(new Matrix2(10, 10, 10, 10), 0.5);
   expect(m.m00).toBe(5);
  });

  it('isIdentity checks identity matrix', () => {
   expect(Matrix2.IDENTITY.isIdentity()).toBe(true);
   expect(new Matrix2(1, 1, 0, 1).isIdentity()).toBe(false);
  });

  it('toJSON returns JSON representation', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const json = m.toJSON();
   expect(json.m00).toBe(1);
  });

  it('transpose instance method', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.transpose();
   expect(m.m01).toBe(3);
   expect(m.m10).toBe(2);
  });

  it('inverse instance method', () => {
   const m = new Matrix2(4, 7, 2, 6);
   m.inverse();
   expect(m.m00).toBeCloseTo(0.6);
  });

  it('adjugate instance method', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.adjugate();
   expect(m.m00).toBe(4);
   expect(m.m11).toBe(1);
  });

  it('negate instance method', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.negate();
   expect(m.m00).toBe(-1);
  });

  it('determinant returns det', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.determinant()).toBe(-2);
  });

  it('trace returns trace', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.trace()).toBe(5);
  });

  it('transformVector transforms vector', () => {
   const m = Matrix2.fromRotation(Math.PI / 2);
   const result = m.transformVector(new Vector2(1, 0));
   expect(result.x).toBeCloseTo(0);
   expect(result.y).toBeCloseTo(1);
  });

  it('multiply instance multiplies', () => {
   const m = new Matrix2(1, 0, 0, 1);
   m.multiply(new Matrix2(2, 0, 0, 2));
   expect(m.m00).toBe(2);
  });

  it('add instance adds', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.add(new Matrix2(1, 1, 1, 1));
   expect(m.m00).toBe(2);
  });

  it('subtract instance subtracts', () => {
   const m = new Matrix2(5, 6, 7, 8);
   m.subtract(new Matrix2(1, 2, 3, 4));
   expect(m.m00).toBe(4);
  });

  it('frobeniusNorm computes norm', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.frobeniusNorm()).toBeCloseTo(Math.sqrt(30));
  });

  // Overflow-safe hypot composition (Matrix Frobenius convention per RA-2).
  // Threshold is sqrt(MAX_VALUE / 4) ≈ 6.7e153, above which naive sqrt(Σm²) overflows.
  it('frobeniusNorm is overflow-safe for components above ~6.7e153', () => {
   const large = 1e200; // individual component squared overflows: 1e200² = 1e400 > MAX_VALUE
   const m = new Matrix2(large, 0, 0, large);
   const norm = m.frobeniusNorm();
   // Naive `sqrt(large² + 0 + 0 + large²)` would overflow because large² = Infinity.
   // hypot composition returns a finite value ≈ large * √2 ≈ 1.41e200.
   expect(Number.isFinite(norm)).toBe(true);
   expect(norm).toBeCloseTo(large * Math.SQRT2, -190);
  });

  it('isInvertible checks invertibility', () => {
   expect(Matrix2.IDENTITY.isInvertible()).toBe(true);
   expect(new Matrix2(0, 0, 0, 0).isInvertible()).toBe(false);
  });

  it('isOrthogonal checks orthogonality', () => {
   expect(Matrix2.fromRotation(Math.PI / 4).isOrthogonal()).toBe(true);
   expect(new Matrix2(1, 2, 3, 4).isOrthogonal()).toBe(false);
  });

  it('isSpecialOrthogonal accepts rotation matrices', () => {
   const rot = Matrix2.fromRotation(Math.PI / 3);
   expect(Matrix2.isSpecialOrthogonal(rot)).toBe(true);
   expect(rot.isSpecialOrthogonal()).toBe(true);
  });

  it('isSpecialOrthogonal rejects reflection matrices', () => {
   // Reflection about X-axis: det = -1.
   const reflect = Matrix2.fromReflection({ x: 0, y: 1 });
   expect(Matrix2.isOrthogonal(reflect)).toBe(true);
   expect(Matrix2.isSpecialOrthogonal(reflect)).toBe(false);
  });

  it('isSpecialOrthogonal rejects non-orthogonal matrices', () => {
   expect(Matrix2.isSpecialOrthogonal(new Matrix2(1, 2, 3, 4))).toBe(false);
  });
 });

 describe('Matrix Operations Extended', () => {
  it('multiplyScalar multiplies all components by scalar', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(8);
  });

  it('transpose swaps off-diagonal elements', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.transpose();
   expect(m.m01).toBe(3);
   expect(m.m10).toBe(2);
  });

  it('inverse returns inverse matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const inv = m.clone().inverse();
   const product = m.clone().multiply(inv);
   expect(product.m00).toBeCloseTo(1);
   expect(product.m11).toBeCloseTo(1);
   expect(product.m01).toBeCloseTo(0);
   expect(product.m10).toBeCloseTo(0);
  });

  it('inverse throws for singular matrix', () => {
   const singular = new Matrix2(1, 2, 2, 4);
   expect(() => singular.inverse()).toThrow();
  });

  it('adjugate returns adjugate matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.adjugate();
   expect(m.m00).toBe(4);
   expect(m.m01).toBe(-2);
   expect(m.m10).toBe(-3);
   expect(m.m11).toBe(1);
  });

  it('negate negates all elements', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.negate();
   expect(m.m00).toBe(-1);
   expect(m.m11).toBe(-4);
  });

  it('premultiply multiplies other × this', () => {
   const scale = new Matrix2(2, 0, 0, 2);
   const rot = Matrix2.fromRotation(Math.PI / 2);
   scale.premultiply(rot);
   expect(scale.m00).toBeCloseTo(0);
  });

  it('transformVector transforms a vector', () => {
   const m = Matrix2.fromRotation(Math.PI / 2);
   const v = new Vector2(1, 0);
   const result = m.transformVector(v);
   expect(result.x).toBeCloseTo(0);
   expect(result.y).toBeCloseTo(1);
  });

  it('transformVector with out parameter', () => {
   const m = Matrix2.fromScale(2);
   const v = new Vector2(3, 4);
   const out = new Vector2();
   m.transformVector(v, out);
   expect(out.x).toBe(6);
   expect(out.y).toBe(8);
  });

  it('multiply mutates this matrix', () => {
   const a = new Matrix2(1, 0, 0, 1);
   const b = new Matrix2(2, 0, 0, 2);
   a.multiply(b);
   expect(a.m00).toBe(2); // multiply mutates 'this'
  });

  // Note: Instance methods no longer accept 'out' parameter
  // They mutate 'this' and return 'this' for chaining
  // Use static methods for allocation-free operations with 'out'
 });

 describe('Instance Properties', () => {
  it('set updates all components', () => {
   const m = new Matrix2();
   m.set(1, 2, 3, 4);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('copy copies from another matrix', () => {
   const source = new Matrix2(5, 6, 7, 8);
   const m = new Matrix2();
   m.copy(source);
   expect(m.m00).toBe(5);
  });

  it('identity resets to identity', () => {
   const m = new Matrix2(5, 6, 7, 8);
   m.identity();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(0);
  });

  it('trace returns sum of diagonal', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.trace()).toBe(5);
  });

  it('frobeniusNorm returns Frobenius norm', () => {
   const m = new Matrix2(1, 0, 0, 1);
   expect(m.frobeniusNorm()).toBeCloseTo(Math.sqrt(2));
  });

  it('isInvertible returns true for invertible matrix', () => {
   expect(new Matrix2(1, 0, 0, 1).isInvertible()).toBe(true);
  });

  it('isInvertible returns false for singular matrix', () => {
   expect(new Matrix2(1, 2, 2, 4).isInvertible()).toBe(false);
  });

  it('isOrthogonal returns true for rotation matrix', () => {
   const m = Matrix2.fromRotation(Math.PI / 4);
   expect(m.isOrthogonal()).toBe(true);
  });

  it('isOrthogonal returns false for scale matrix', () => {
   const m = Matrix2.fromScale(2);
   expect(m.isOrthogonal()).toBe(false);
  });
 });

 describe('Column Operations', () => {
  it('getColumn returns first column', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const col = m.getColumn(0);
   expect(col.x).toBe(1);
   expect(col.y).toBe(2);
  });

  it('getColumn returns second column', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const col = m.getColumn(1);
   expect(col.x).toBe(3);
   expect(col.y).toBe(4);
  });

  it('getColumn throws for invalid index', () => {
   const m = new Matrix2();
   expect(() => m.getColumn(2)).toThrow(RangeError);
  });

  it('setColumn sets first column', () => {
   const m = new Matrix2();
   m.setColumn(0, { x: 5, y: 6 });
   expect(m.m00).toBe(5);
   expect(m.m01).toBe(6);
  });

  it('setColumn sets second column', () => {
   const m = new Matrix2();
   m.setColumn(1, { x: 7, y: 8 });
   expect(m.m10).toBe(7);
   expect(m.m11).toBe(8);
  });

  it('setColumn throws for invalid index', () => {
   const m = new Matrix2();
   expect(() => m.setColumn(2, { x: 1, y: 1 })).toThrow(RangeError);
  });
 });

 describe('Coverage - Instance Setters', () => {
  it('set updates all components', () => {
   const m = new Matrix2();
   m.set(1, 2, 3, 4);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('copy copies from another matrix', () => {
   const source = new Matrix2(5, 6, 7, 8);
   const target = new Matrix2();
   target.copy(source);
   expect(target.m00).toBe(5);
   expect(target.m11).toBe(8);
  });

  it('identity resets to identity matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.identity();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(0);
   expect(m.m10).toBe(0);
   expect(m.m11).toBe(1);
  });
 });

 describe('Coverage - Instance Properties', () => {
  it('determinant computes det(M)', () => {
   const m = new Matrix2(1, 2, 3, 4);
   // det = 1*4 - 2*3 = -2
   expect(m.determinant()).toBe(-2);
  });

  it('trace computes sum of diagonal', () => {
   const m = new Matrix2(5, 2, 3, 7);
   expect(m.trace()).toBe(12); // 5 + 7
  });

  it('frobeniusNorm computes Frobenius norm', () => {
   const m = new Matrix2(1, 0, 0, 1);
   expect(m.frobeniusNorm()).toBeCloseTo(Math.sqrt(2));
  });

  it('isInvertible returns true for invertible matrix', () => {
   const m = new Matrix2(1, 0, 0, 1);
   expect(m.isInvertible()).toBe(true);
  });

  it('isInvertible returns false for singular matrix', () => {
   const m = new Matrix2(1, 2, 2, 4); // det = 0
   expect(m.isInvertible()).toBe(false);
  });

  it('isOrthogonal returns true for rotation matrix', () => {
   const angle = Math.PI / 4;
   const m = Matrix2.fromRotation(angle);
   expect(m.isOrthogonal()).toBe(true);
  });

  it('isOrthogonal returns false for non-orthogonal matrix', () => {
   const m = new Matrix2(2, 0, 0, 1); // scale matrix
   expect(m.isOrthogonal()).toBe(false);
  });
 });

 describe('Coverage - Instance Matrix Operations', () => {
  it('multiply multiplies with another matrix', () => {
   const a = new Matrix2(1, 2, 3, 4);
   const b = new Matrix2(5, 6, 7, 8);
   a.multiply(b);
   // Column-major: r00 = a00*b00 + a10*b01 = 1*5 + 3*6 = 23
   expect(a.m00).toBe(23);
  });

  it('multiply mutates this', () => {
   const a = new Matrix2(1, 2, 3, 4);
   const b = new Matrix2(5, 6, 7, 8);
   a.multiply(b);
   expect(a.m00).toBe(23);
  });

  it('multiplyScalar scales all components', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.multiplyScalar(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(8);
  });

  it('transpose swaps m01 and m10', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.transpose();
   expect(m.m01).toBe(3);
   expect(m.m10).toBe(2);
  });
 });

 describe('Coverage - Additional Static Methods', () => {
  it('fromColumns creates matrix from column vectors', () => {
   const m = Matrix2.fromColumns({ x: 1, y: 2 }, { x: 3, y: 4 });
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('fromRows creates matrix from row vectors', () => {
   const m = Matrix2.fromRows({ x: 1, y: 2 }, { x: 3, y: 4 });
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
   expect(m.m01).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('fromArray with offset', () => {
   const array = [0, 0, 1, 2, 3, 4];
   const m = Matrix2.fromArray(array, 2);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('fromArray row-major', () => {
   const array = [1, 2, 3, 4];
   const m = Matrix2.fromArray(array, 0, false);
   expect(m.m00).toBe(1);
   expect(m.m10).toBe(2);
   expect(m.m01).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('lerp interpolates between matrices', () => {
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale(3);
   const result = Matrix2.lerp(a, b, 0.5);
   expect(result.m00).toBeCloseTo(2);
   expect(result.m11).toBeCloseTo(2);
  });

  it('negate negates all components', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const result = Matrix2.negate(m);
   expect(result.m00).toBe(-1);
   expect(result.m11).toBe(-4);
  });

  it('transformVector transforms vector', () => {
   const m = Matrix2.fromScale(2);
   const v = { x: 3, y: 4 };
   const result = Matrix2.transformVector(m, v);
   expect(result.x).toBe(6);
   expect(result.y).toBe(8);
  });
 });

 describe('Coverage - Instance Getters', () => {
  it('getColumn returns column vector', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const col0 = m.getColumn(0);
   expect(col0.x).toBe(1);
   expect(col0.y).toBe(2);
   const col1 = m.getColumn(1);
   expect(col1.x).toBe(3);
   expect(col1.y).toBe(4);
  });

  it('getRow returns row vector', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const row0 = m.getRow(0);
   expect(row0.x).toBe(1);
   expect(row0.y).toBe(3);
   const row1 = m.getRow(1);
   expect(row1.x).toBe(2);
   expect(row1.y).toBe(4);
  });

  it('setColumn sets column', () => {
   const m = new Matrix2();
   m.setColumn(0, { x: 5, y: 6 });
   expect(m.m00).toBe(5);
   expect(m.m01).toBe(6);
  });

  it('setRow sets row', () => {
   const m = new Matrix2();
   m.setRow(0, { x: 5, y: 6 });
   expect(m.m00).toBe(5);
   expect(m.m10).toBe(6);
  });

  it('diagonal returns diagonal elements', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const d = m.diagonal;
   expect(d.x).toBe(1);
   expect(d.y).toBe(4);
  });

  it('inverted getter returns inverse', () => {
   const m = Matrix2.fromScale(2);
   const inv = m.inverted;
   expect(inv.m00).toBeCloseTo(0.5);
   expect(inv.m11).toBeCloseTo(0.5);
  });

  it('inverted getter returns identity for singular', () => {
   const m = Matrix2.ZERO;
   const inv = m.inverted;
   expect(inv.isIdentity()).toBe(true);
  });

  it('transposed getter returns transpose', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const t = m.transposed;
   expect(t.m01).toBe(3);
   expect(t.m10).toBe(2);
  });

  it('negated getter returns negated matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const n = m.negated;
   expect(n.m00).toBe(-1);
   expect(n.m11).toBe(-4);
  });
 });

 // Note: The "Instance Operations with Out" tests were removed because
 // instance methods no longer accept 'out' parameter (v0.9.0 breaking change)
 // Instance methods now mutate 'this' and return 'this' for chaining
 // Use static methods for allocation-free operations with 'out' parameter

 describe('Coverage - Conversion Methods', () => {
  it('toArray returns flat array', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('toObject returns plain object', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const object = m.toObject();
   expect(object.m00).toBe(1);
   expect(object.m11).toBe(4);
  });

  it('toJSON returns JSON object', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const json = m.toJSON();
   expect(json.m00).toBe(1);
  });

  it('toString returns string representation', () => {
   const m = Matrix2.IDENTITY;
   expect(m.toString()).toContain('Matrix2');
  });
 });

 describe('Constructor (scalar-only, total)', () => {
  it('array construction is the exclusive domain of fromArray (validates in every build)', () => {
   const m = Matrix2.fromArray([1, 2, 3, 4]);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
   expect(() =>
    Matrix2.fromArray([1, 2, 3] as unknown as [number, number, number, number]),
   ).toThrow(RangeError);
  });

  it('object construction is the exclusive domain of fromObject (type-trusting)', () => {
   const m = Matrix2.fromObject({ m00: 5, m01: 6, m10: 7, m11: 8 });
   expect(m.m00).toBe(5);
   expect(m.m01).toBe(6);
   expect(m.m10).toBe(7);
   expect(m.m11).toBe(8);
  });

  it('accepts non-finite components (pure assignment, IEEE 754 values)', () => {
   const m = new Matrix2(Number.NaN, 0, 0, Number.POSITIVE_INFINITY);
   expect(m.m00).toBeNaN();
   expect(m.m11).toBe(Number.POSITIVE_INFINITY);
  });

  it('constructs identity by default', () => {
   const m = new Matrix2();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(0);
   expect(m.m10).toBe(0);
   expect(m.m11).toBe(1);
  });
 });

 describe('Static Scalar Operations', () => {
  it('addScalar adds scalar to all components', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const result = Matrix2.addScalar(m, 10);
   expect(result.m00).toBe(11);
   expect(result.m01).toBe(12);
   expect(result.m10).toBe(13);
   expect(result.m11).toBe(14);
  });

  it('subtractScalar subtracts scalar from all components', () => {
   const m = new Matrix2(10, 20, 30, 40);
   const result = Matrix2.subtractScalar(m, 5);
   expect(result.m00).toBe(5);
   expect(result.m01).toBe(15);
   expect(result.m10).toBe(25);
   expect(result.m11).toBe(35);
  });

  it('divideScalar divides all components', () => {
   const m = new Matrix2(10, 20, 30, 40);
   const result = Matrix2.divideScalar(m, 10);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(4);
  });
 });

 describe('Static Numeric Transforms', () => {
  it('floor applies Math.floor to all elements', () => {
   const m = new Matrix2(1.7, 2.3, 3.9, 4.1);
   const result = Matrix2.floor(m);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(4);
  });

  it('ceil applies Math.ceil to all elements', () => {
   const m = new Matrix2(1.1, 2.7, 3.3, 4.9);
   const result = Matrix2.ceil(m);
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(3);
   expect(result.m10).toBe(4);
   expect(result.m11).toBe(5);
  });

  it('round applies Math.round to all elements', () => {
   const m = new Matrix2(1.4, 2.6, 3.5, 4.4);
   const result = Matrix2.round(m);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(3);
   expect(result.m10).toBe(4);
   expect(result.m11).toBe(4);
  });

  it('abs applies absolute value to all elements', () => {
   const m = new Matrix2(-1, -2, 3, -4);
   const result = Matrix2.abs(m);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(4);
  });

  it('sign returns sign of each element', () => {
   const m = new Matrix2(-5, 0, 3, -1);
   const result = Matrix2.sign(m);
   expect(result.m00).toBe(-1);
   expect(result.m01).toBe(0);
   expect(result.m10).toBe(1);
   expect(result.m11).toBe(-1);
  });

  it('sign propagates NaN per V9-Scalar-01 (IEEE 754 §6.2)', () => {
   const m = new Matrix2(Number.NaN, 0, 3, -1);
   const result = Matrix2.sign(m);
   expect(result.m00).toBeNaN();
   expect(result.m01).toBe(0);
   expect(result.m10).toBe(1);
   expect(result.m11).toBe(-1);
  });

  it('min returns component-wise minimum', () => {
   const a = new Matrix2(1, 5, 3, 8);
   const b = new Matrix2(4, 2, 6, 1);
   const result = Matrix2.min(a, b);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(1);
  });

  it('max returns component-wise maximum', () => {
   const a = new Matrix2(1, 5, 3, 8);
   const b = new Matrix2(4, 2, 6, 1);
   const result = Matrix2.max(a, b);
   expect(result.m00).toBe(4);
   expect(result.m01).toBe(5);
   expect(result.m10).toBe(6);
   expect(result.m11).toBe(8);
  });

  it('clamp clamps between min and max matrices', () => {
   const m = new Matrix2(-1, 10, 5, 15);
   const minM = new Matrix2(0, 0, 0, 0);
   const maxM = new Matrix2(8, 8, 8, 8);
   const result = Matrix2.clamp(m, minM, maxM);
   expect(result.m00).toBe(0);
   expect(result.m01).toBe(8);
   expect(result.m10).toBe(5);
   expect(result.m11).toBe(8);
  });

  it('clampScalar clamps between scalar min and max', () => {
   const m = new Matrix2(-1, 10, 5, 15);
   const result = Matrix2.clampScalar(m, 0, 8);
   expect(result.m00).toBe(0);
   expect(result.m01).toBe(8);
   expect(result.m10).toBe(5);
   expect(result.m11).toBe(8);
  });
 });

 describe('Static Interpolation Extended', () => {
  it('lerp allows t outside [0,1]', () => {
   const a = new Matrix2(0, 0, 0, 0);
   const b = new Matrix2(10, 10, 10, 10);
   const result = Matrix2.lerp(a, b, 1.5);
   expect(result.m00).toBe(15);
   expect(result.m11).toBe(15);
  });

  it('smoothStep uses smooth interpolation', () => {
   const a = new Matrix2(0, 0, 0, 0);
   const b = new Matrix2(10, 10, 10, 10);
   const result = Matrix2.smoothStep(a, b, 0.5);
   expect(result.m00).toBe(5);
   expect(result.m11).toBe(5);
  });
 });

 describe('Static Comparison Extended', () => {
  it('isZero returns true for zero matrix', () => {
   expect(Matrix2.isZero(Matrix2.ZERO)).toBe(true);
   expect(Matrix2.isZero(Matrix2.IDENTITY)).toBe(false);
  });

  it('isIdentity returns true for identity matrix', () => {
   expect(Matrix2.isIdentity(Matrix2.IDENTITY)).toBe(true);
   expect(Matrix2.isIdentity(Matrix2.ZERO)).toBe(false);
  });

  it('nearZero tests if all components are near zero', () => {
   const m = new Matrix2(0.0001, -0.0001, 0.00001, -0.00001);
   expect(Matrix2.isNearZero(m, 0.001)).toBe(true);
   expect(Matrix2.isNearZero(m, 0.0000001)).toBe(false);
  });

  it('hasNaN detects NaN in matrix', () => {
   const m = new Matrix2(1, Number.NaN, 3, 4);
   expect(Matrix2.hasNaN(m)).toBe(true);
   expect(Matrix2.hasNaN(Matrix2.IDENTITY)).toBe(false);
  });

  it('isFinite checks if all components are finite', () => {
   expect(Matrix2.isFinite(Matrix2.IDENTITY)).toBe(true);
   const m = new Matrix2(1, Number.POSITIVE_INFINITY, 3, 4);
   expect(Matrix2.isFinite(m)).toBe(false);
  });

  it('isSymmetric tests matrix symmetry', () => {
   const symmetric = new Matrix2(1, 2, 2, 4);
   expect(Matrix2.isSymmetric(symmetric)).toBe(true);
   const asymmetric = new Matrix2(1, 2, 3, 4);
   expect(Matrix2.isSymmetric(asymmetric)).toBe(false);
  });

  it('isSkewSymmetric tests skew symmetry', () => {
   const skew = new Matrix2(0, 2, -2, 0);
   expect(Matrix2.isSkewSymmetric(skew)).toBe(true);
  });

  it('isDiagonal tests if matrix is diagonal', () => {
   const diagonal = new Matrix2(3, 0, 0, 5);
   expect(Matrix2.isDiagonal(diagonal)).toBe(true);
   expect(Matrix2.isDiagonal(Matrix2.IDENTITY)).toBe(true);
   const nonDiagonal = new Matrix2(1, 2, 3, 4);
   expect(Matrix2.isDiagonal(nonDiagonal)).toBe(false);
  });

  it('isInvertible tests if matrix is invertible', () => {
   expect(Matrix2.isInvertible(Matrix2.ZERO)).toBe(false);
   expect(Matrix2.isInvertible(Matrix2.IDENTITY)).toBe(true);
  });

  it('isOrthogonal static tests if matrix is orthogonal', () => {
   expect(Matrix2.isOrthogonal(Matrix2.IDENTITY)).toBe(true);
   expect(Matrix2.isOrthogonal(Matrix2.fromRotation(Math.PI / 4))).toBe(true);
   expect(Matrix2.isOrthogonal(new Matrix2(2, 0, 0, 2))).toBe(false);
   expect(Matrix2.isOrthogonal(new Matrix2(1, 2, 3, 4))).toBe(false);
  });
 });

 describe('Static Inverse Variants', () => {
  it('inverseSafe returns identity for singular', () => {
   const result = Matrix2.inverseSafe(Matrix2.ZERO);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(0);
   expect(result.m10).toBe(0);
   expect(result.m11).toBe(1);
  });

  it('inverseSafe returns inverse for invertible matrix', () => {
   const m = new Matrix2(2, 0, 0, 2);
   const result = Matrix2.inverseSafe(m);
   expect(result.m00).toBeCloseTo(0.5);
   expect(result.m11).toBeCloseTo(0.5);
  });

  it('inverseUnchecked computes inverse without checks', () => {
   const m = new Matrix2(2, 0, 0, 4);
   const result = Matrix2.inverseUnchecked(m);
   expect(result.m00).toBeCloseTo(0.5);
   expect(result.m11).toBeCloseTo(0.25);
  });
 });

 describe('Static fromObject and copy', () => {
  it('fromObject creates matrix from plain object', () => {
   const object = { m00: 1, m01: 2, m10: 3, m11: 4 };
   const m = Matrix2.fromObject(object);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('copy copies values between matrices', () => {
   const source = new Matrix2(5, 6, 7, 8);
   const dst = new Matrix2();
   Matrix2.copy(source, dst);
   expect(dst.m00).toBe(5);
   expect(dst.m11).toBe(8);
  });
 });

 describe('Instance Scalar Operations', () => {
  it('addScalar adds scalar to instance', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.addScalar(10);
   expect(m.m00).toBe(11);
   expect(m.m11).toBe(14);
  });

  it('subtractScalar subtracts scalar from instance', () => {
   const m = new Matrix2(10, 20, 30, 40);
   m.subtractScalar(5);
   expect(m.m00).toBe(5);
   expect(m.m11).toBe(35);
  });

  it('divideScalar divides instance by scalar', () => {
   const m = new Matrix2(10, 20, 30, 40);
   m.divideScalar(10);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('divideScalarUnchecked divides without validation', () => {
   const m = new Matrix2(10, 20, 30, 40);
   m.divideScalarUnchecked(10);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('divideScalarSafe returns zero matrix for zero divisor', () => {
   const m = new Matrix2(10, 20, 30, 40);
   m.divideScalarSafe(0);
   expect(m.m00).toBe(0);
   expect(m.m11).toBe(0);
  });

  it('static divideScalarUnchecked divides without validation', () => {
   const m = new Matrix2(10, 20, 30, 40);
   const result = Matrix2.divideScalarUnchecked(m, 10);
   expect(result.m00).toBe(1);
   expect(result.m11).toBe(4);
  });
 });

 describe('Instance Numeric Transforms', () => {
  it('floor applies Math.floor', () => {
   const m = new Matrix2(1.7, 2.3, 3.9, 4.1);
   m.floor();
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('ceil applies Math.ceil', () => {
   const m = new Matrix2(1.1, 2.7, 3.3, 4.9);
   m.ceil();
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(5);
  });

  it('round applies Math.round', () => {
   const m = new Matrix2(1.4, 2.6, 3.5, 4.4);
   m.round();
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('abs applies absolute value', () => {
   const m = new Matrix2(-1, -2, 3, -4);
   m.abs();
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(4);
  });

  it('sign returns sign of each element', () => {
   const m = new Matrix2(-5, 0, 3, -1);
   m.sign();
   expect(m.m00).toBe(-1);
   expect(m.m11).toBe(-1);
  });

  it('min applies component-wise minimum', () => {
   const m = new Matrix2(1, 5, 3, 8);
   m.min(new Matrix2(4, 2, 6, 1));
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
  });

  it('max applies component-wise maximum', () => {
   const m = new Matrix2(1, 5, 3, 8);
   m.max(new Matrix2(4, 2, 6, 1));
   expect(m.m00).toBe(4);
   expect(m.m11).toBe(8);
  });

  it('clamp clamps between min and max', () => {
   const m = new Matrix2(-1, 10, 5, 15);
   m.clamp(new Matrix2(0, 0, 0, 0), new Matrix2(8, 8, 8, 8));
   expect(m.m00).toBe(0);
   expect(m.m11).toBe(8);
  });

  it('clampScalar clamps between scalar bounds', () => {
   const m = new Matrix2(-1, 10, 5, 15);
   m.clampScalar(0, 8);
   expect(m.m00).toBe(0);
   expect(m.m11).toBe(8);
  });
 });

 describe('Instance Inverse Variants', () => {
  it('inverseSafe returns identity for singular', () => {
   const m = new Matrix2(0, 0, 0, 0);
   m.inverseSafe();
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(0);
   expect(m.m10).toBe(0);
   expect(m.m11).toBe(1);
  });

  it('inverseSafe inverts invertible matrix', () => {
   const m = new Matrix2(2, 0, 0, 2);
   m.inverseSafe();
   expect(m.m00).toBeCloseTo(0.5);
   expect(m.m11).toBeCloseTo(0.5);
  });

  it('inverseUnchecked computes inverse without checks', () => {
   const m = new Matrix2(2, 0, 0, 4);
   m.inverseUnchecked();
   expect(m.m00).toBeCloseTo(0.5);
   expect(m.m11).toBeCloseTo(0.25);
  });
 });

 describe('Instance Interpolation', () => {
  it('smoothStep uses smooth interpolation', () => {
   const m = new Matrix2(0, 0, 0, 0);
   m.smoothStep(new Matrix2(10, 10, 10, 10), 0.5);
   expect(m.m00).toBe(5);
  });
 });

 describe('Instance Comparison Extended', () => {
  it('isZero tests if zero matrix', () => {
   const m = new Matrix2(0, 0, 0, 0);
   expect(m.isZero()).toBe(true);
   expect(Matrix2.IDENTITY.isZero()).toBe(false);
  });

  it('nearZero tests if near zero', () => {
   const m = new Matrix2(0.0001, -0.0001, 0, 0);
   expect(m.isNearZero(0.001)).toBe(true);
  });

  it('hasNaN detects NaN', () => {
   const m = new Matrix2(1, Number.NaN, 3, 4);
   expect(m.hasNaN()).toBe(true);
  });

  it('isFinite checks finiteness', () => {
   const m = new Matrix2(1, Number.POSITIVE_INFINITY, 3, 4);
   expect(m.isFinite()).toBe(false);
  });

  it('isSymmetric checks symmetry', () => {
   const m = new Matrix2(1, 2, 2, 4);
   expect(m.isSymmetric()).toBe(true);
  });

  it('isSkewSymmetric checks skew symmetry', () => {
   const m = new Matrix2(0, 2, -2, 0);
   expect(m.isSkewSymmetric()).toBe(true);
  });

  it('isDiagonal checks diagonal', () => {
   const m = new Matrix2(5, 0, 0, 3);
   expect(m.isDiagonal()).toBe(true);
  });

  it('isInvertible checks invertibility', () => {
   const m = new Matrix2(1, 2, 2, 4);
   expect(m.isInvertible()).toBe(false);
  });
 });

 describe('Instance Transformations Extended', () => {
  it('rotate rotates the matrix', () => {
   const m = new Matrix2(1, 0, 0, 1);
   m.rotate(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
  });

  it('rotateCS rotates using precomputed cos/sin', () => {
   const m = new Matrix2(1, 0, 0, 1);
   const cos = Math.cos(Math.PI / 2);
   const sin = Math.sin(Math.PI / 2);
   m.rotateCS(cos, sin);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
  });

  it('static rotateCS matches static rotate', () => {
   const m1 = Matrix2.fromScale({ x: 2, y: 1 });
   const m2 = Matrix2.fromScale({ x: 2, y: 1 });
   const angle = Math.PI / 4;
   const cos = Math.cos(angle);
   const sin = Math.sin(angle);
   const r1 = Matrix2.rotate(m1, angle);
   const r2 = Matrix2.rotateCS(m2, cos, sin);
   expect(r1.m00).toBeCloseTo(r2.m00);
   expect(r1.m01).toBeCloseTo(r2.m01);
   expect(r1.m10).toBeCloseTo(r2.m10);
   expect(r1.m11).toBeCloseTo(r2.m11);
  });

  it('scaleBy with vector scales per-axis', () => {
   const m = new Matrix2(1, 0, 0, 1);
   m.scaleBy({ x: 2, y: 3 });
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
  });

  it('scaleBy with number is uniform scale', () => {
   const m = new Matrix2(1, 0, 0, 1);
   m.scaleBy(2);
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(2);
  });

  it('getRotation extracts rotation angle', () => {
   const m = Matrix2.fromRotation(Math.PI / 4);
   expect(m.getRotation()).toBeCloseTo(Math.PI / 4);
  });

  it('getScale extracts scale factors', () => {
   const m = Matrix2.fromScale(new Vector2(2, 3));
   const scale = m.getScale();
   expect(scale.x).toBeCloseTo(2);
   expect(scale.y).toBeCloseTo(3);
  });
 });

 describe('Static getRotation / getScale', () => {
  it('getRotation extracts rotation from pure rotation matrix', () => {
   const m = Matrix2.fromRotation(Math.PI / 4);
   expect(Matrix2.getRotation(m)).toBeCloseTo(Math.PI / 4);
  });

  it('getRotation extracts rotation from rotation+scale matrix', () => {
   const m = Matrix2.compose(Math.PI / 3, new Vector2(2, 3));
   expect(Matrix2.getRotation(m)).toBeCloseTo(Math.PI / 3);
  });

  it('getScale extracts scale from pure scale matrix', () => {
   const m = Matrix2.fromScale(new Vector2(2, 3));
   const scale = Matrix2.getScale(m);
   expect(scale.x).toBeCloseTo(2);
   expect(scale.y).toBeCloseTo(3);
  });

  it('getScale extracts scale from rotation+scale matrix', () => {
   const m = Matrix2.compose(Math.PI / 6, new Vector2(4, 5));
   const scale = Matrix2.getScale(m);
   expect(scale.x).toBeCloseTo(4);
   expect(scale.y).toBeCloseTo(5);
  });

  it('getScale writes to out parameter', () => {
   const m = Matrix2.fromScale(new Vector2(7, 8));
   const out = new Vector2();
   const result = Matrix2.getScale(m, out);
   expect(result).toBe(out);
   expect(out.x).toBeCloseTo(7);
   expect(out.y).toBeCloseTo(8);
  });
 });

 describe('Instance Row Operations', () => {
  it('getRow returns row 0', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const row = m.getRow(0);
   expect(row.x).toBe(1);
   expect(row.y).toBe(3);
  });

  it('getRow returns row 1', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const row = m.getRow(1);
   expect(row.x).toBe(2);
   expect(row.y).toBe(4);
  });

  it('getRow throws for invalid index', () => {
   const m = new Matrix2();
   expect(() => m.getRow(2)).toThrow(RangeError);
  });

  it('setRow sets row 0', () => {
   const m = new Matrix2();
   m.setRow(0, { x: 5, y: 6 });
   expect(m.m00).toBe(5);
   expect(m.m10).toBe(6);
  });

  it('setRow sets row 1', () => {
   const m = new Matrix2();
   m.setRow(1, { x: 7, y: 8 });
   expect(m.m01).toBe(7);
   expect(m.m11).toBe(8);
  });

  it('setRow throws for invalid index', () => {
   const m = new Matrix2();
   expect(() => m.setRow(2, { x: 1, y: 1 })).toThrow(RangeError);
  });
 });

 describe('Additional Constants', () => {
  it('ROTATE_270 rotates 270 degrees CCW', () => {
   const rotated = Matrix2.ROTATE_270.transformVector(new Vector2(1, 0));
   expect(rotated.x).toBeCloseTo(0);
   expect(rotated.y).toBeCloseTo(-1);
  });

  it('FLIP_XY flips both axes', () => {
   const flipped = Matrix2.FLIP_XY.transformVector(new Vector2(1, 1));
   expect(flipped.x).toBe(-1);
   expect(flipped.y).toBe(-1);
  });
 });

 describe('Additional Interpolation Coverage', () => {
  it('smoothStep interpolates with smooth factor', () => {
   expect.hasAssertions();
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale(5);
   const result = Matrix2.smoothStep(a, b, 0.5);
   expect(result.m00).toBeCloseTo(3);
  });

  it('lerp allows extrapolation', () => {
   expect.hasAssertions();
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale(3);
   const result = Matrix2.lerp(a, b, 2);
   expect(result.m00).toBeCloseTo(5);
  });
 });

 describe('Additional Numeric Transforms Coverage', () => {
  it('sign computes component-wise sign', () => {
   expect.hasAssertions();
   const m = new Matrix2(-5, 0, 3, -1);
   const result = Matrix2.sign(m);
   expect(result.m00).toBe(-1);
   expect(result.m01).toBe(0);
   expect(result.m10).toBe(1);
   expect(result.m11).toBe(-1);
  });
 });

 describe('Additional Instance Methods Coverage', () => {
  it('smoothStep instance method', () => {
   expect.hasAssertions();
   const m = new Matrix2();
   const target = Matrix2.fromScale(5);
   m.smoothStep(target, 0.5);
   expect(m.m00).toBeCloseTo(3);
  });
 });

 describe('Iterator', () => {
  it('supports array destructuring', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const [m00, m01, m10, m11] = m;
   expect(m00).toBe(1);
   expect(m01).toBe(2);
   expect(m10).toBe(3);
   expect(m11).toBe(4);
  });

  it('supports spread operator', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const array = [...m];
   expect(array).toEqual([1, 2, 3, 4]);
  });

  it('works with for...of', () => {
   const m = new Matrix2(5, 6, 7, 8);
   const values: number[] = [];
   for (const v of m) {
    values.push(v);
   }
   expect(values).toEqual([5, 6, 7, 8]);
  });
 });

 describe('Coverage - Static lerpClamped', () => {
  it('static lerpClamped clamps t to [0, 1]', () => {
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale(3);
   const result = Matrix2.lerpClamped(a, b, 2);
   expect(result.m00).toBeCloseTo(3, DIGITS);
  });

  it('static lerpClamped clamps negative t', () => {
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale(3);
   const result = Matrix2.lerpClamped(a, b, -1);
   expect(result.m00).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Static smoothStep', () => {
  it('static smoothStep interpolates smoothly', () => {
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale(5);
   const result = Matrix2.smoothStep(a, b, 0.5);
   expect(result.m00).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Coverage - Static scaleBy', () => {
  it('static scaleBy with scalar', () => {
   const m = Matrix2.IDENTITY;
   const result = Matrix2.scaleBy(m, 2);
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(2);
  });

  it('static scaleBy with vector', () => {
   const m = Matrix2.IDENTITY;
   const result = Matrix2.scaleBy(m, { x: 2, y: 3 });
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(3);
  });
 });

 describe('Coverage - Static rotate', () => {
  it('static rotate rotates matrix', () => {
   const m = Matrix2.IDENTITY;
   const result = Matrix2.rotate(m, Math.PI / 2);
   expect(result.m00).toBeCloseTo(0, DIGITS);
   expect(result.m01).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Instance determinant/trace/frobeniusNorm', () => {
  it('determinant returns correct value', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.determinant()).toBe(1 * 4 - 2 * 3);
  });

  it('trace returns sum of diagonal', () => {
   const m = new Matrix2(5, 2, 3, 7);
   expect(m.trace()).toBe(12);
  });

  it('frobeniusNorm returns correct norm', () => {
   const m = new Matrix2(1, 2, 3, 4);
   expect(m.frobeniusNorm()).toBeCloseTo(Math.sqrt(1 + 4 + 9 + 16), DIGITS);
  });
 });

 describe('Coverage - Object.freeze on matrix', () => {
  it('Object.freeze freezes the matrix object', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const frozen = Object.freeze(m);
   expect(frozen).toBe(m);
   expect(Object.isFrozen(frozen)).toBe(true);
  });
 });

 describe('Coverage - Instance scaleBy and rotate', () => {
  it('instance scaleBy with scalar', () => {
   const m = new Matrix2();
   m.scaleBy(2);
   expect(m.m00).toBe(2);
  });

  it('instance scaleBy with vector', () => {
   const m = new Matrix2();
   m.scaleBy({ x: 2, y: 3 });
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
  });

  it('instance rotate rotates', () => {
   const m = new Matrix2();
   m.rotate(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Static isFinite and hasNaN', () => {
  it('static isFinite returns true for finite matrix', () => {
   expect(Matrix2.isFinite(Matrix2.IDENTITY)).toBe(true);
  });

  it('static isFinite returns false for infinite', () => {
   expect(Matrix2.isFinite({ m00: Infinity, m01: 0, m10: 0, m11: 1 })).toBe(false);
  });

  it('static hasNaN returns false for normal matrix', () => {
   expect(Matrix2.hasNaN(Matrix2.IDENTITY)).toBe(false);
  });

  it('static hasNaN returns true for NaN', () => {
   expect(Matrix2.hasNaN({ m00: NaN, m01: 0, m10: 0, m11: 1 })).toBe(true);
  });
 });

 describe('Coverage - Static hasInfinity', () => {
  it('hasInfinity returns false for finite matrix', () => {
   expect(Matrix2.hasInfinity(Matrix2.IDENTITY)).toBe(false);
  });

  it('hasInfinity returns true for Infinity', () => {
   expect(Matrix2.hasInfinity({ m00: Infinity, m01: 0, m10: 0, m11: 1 })).toBe(true);
  });

  it('hasInfinity returns false for NaN (not infinity)', () => {
   expect(Matrix2.hasInfinity({ m00: NaN, m01: 0, m10: 0, m11: 1 })).toBe(false);
  });
 });

 describe('Coverage - Instance hasInfinity', () => {
  it('instance hasInfinity returns false for finite', () => {
   const m = Matrix2.IDENTITY;
   expect(m.hasInfinity()).toBe(false);
  });

  it('instance hasInfinity returns true for infinite', () => {
   const m = new Matrix2(Infinity, 0, 0, 1);
   expect(m.hasInfinity()).toBe(true);
  });
 });

 describe('Coverage - Static scale', () => {
  it('static multiplyScalar scales all components', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const result = Matrix2.multiplyScalar(m, 2);
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(4);
   expect(result.m10).toBe(6);
   expect(result.m11).toBe(8);
  });

  it('static scale with out parameter', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const out = new Matrix2();
   const result = Matrix2.multiplyScalar(m, 3, out);
   expect(result).toBe(out);
   expect(out.m00).toBe(3);
  });
 });

 describe('Coverage - Column operations', () => {
  it('getColumn returns column 0', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const column = m.getColumn(0);
   expect(column.x).toBe(1);
   expect(column.y).toBe(2);
  });

  it('getColumn returns column 1', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const column = m.getColumn(1);
   expect(column.x).toBe(3);
   expect(column.y).toBe(4);
  });

  it('getColumn throws for invalid index', () => {
   const m = new Matrix2();
   expect(() => m.getColumn(2)).toThrow(RangeError);
  });

  it('setColumn sets column 0', () => {
   const m = new Matrix2();
   m.setColumn(0, { x: 5, y: 6 });
   expect(m.m00).toBe(5);
   expect(m.m01).toBe(6);
  });

  it('setColumn sets column 1', () => {
   const m = new Matrix2();
   m.setColumn(1, { x: 7, y: 8 });
   expect(m.m10).toBe(7);
   expect(m.m11).toBe(8);
  });

  it('setColumn throws for invalid index', () => {
   const m = new Matrix2();
   expect(() => m.setColumn(2, { x: 1, y: 1 })).toThrow(RangeError);
  });
 });

 describe('Coverage - Static determinant', () => {
  it('determinant returns matrix determinant', () => {
   const m = Matrix2.fromScale({ x: 2, y: 3 });
   expect(Matrix2.determinant(m)).toBeCloseTo(6, DIGITS);
  });
 });

 describe('Coverage - Static multiply', () => {
  it('multiply multiplies two matrices', () => {
   const a = Matrix2.fromScale({ x: 2, y: 1 });
   const b = Matrix2.fromScale({ x: 1, y: 3 });
   const result = Matrix2.multiply(a, b);
   expect(result.m00).toBeCloseTo(2, DIGITS);
   expect(result.m11).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Coverage - Static transpose', () => {
  it('transpose transposes matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const t = Matrix2.transpose(m);
   expect(t.m01).toBe(m.m10);
   expect(t.m10).toBe(m.m01);
  });
 });

 describe('Coverage - Static fromRotation', () => {
  it('fromRotation creates rotation matrix', () => {
   const m = Matrix2.fromRotation(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0, DIGITS);
   expect(m.m01).toBeCloseTo(1, DIGITS);
  });
 });

 describe('fromAngleScale', () => {
  it('identity rotation with uniform scale', () => {
   const mat = Matrix2.fromAngleScale(0, 2, 2);
   const expected = Matrix2.fromScale(2);
   expect(mat.m00).toBeCloseTo(expected.m00, 10);
   expect(mat.m01).toBeCloseTo(expected.m01, 10);
   expect(mat.m10).toBeCloseTo(expected.m10, 10);
   expect(mat.m11).toBeCloseTo(expected.m11, 10);
  });

  it('90-degree rotation with no scale', () => {
   const mat = Matrix2.fromAngleScale(Math.PI / 2, 1, 1);
   const expected = Matrix2.fromRotation(Math.PI / 2);
   expect(mat.m00).toBeCloseTo(expected.m00, 10);
   expect(mat.m01).toBeCloseTo(expected.m01, 10);
   expect(mat.m10).toBeCloseTo(expected.m10, 10);
   expect(mat.m11).toBeCloseTo(expected.m11, 10);
  });

  it('combined rotation and non-uniform scale', () => {
   const angle = Math.PI / 4;
   const mat = Matrix2.fromAngleScale(angle, 2, 3);
   const expected = Matrix2.multiply(
    Matrix2.fromRotation(angle),
    Matrix2.fromScale({ x: 2, y: 3 }),
   );
   expect(mat.m00).toBeCloseTo(expected.m00, 10);
   expect(mat.m01).toBeCloseTo(expected.m01, 10);
   expect(mat.m10).toBeCloseTo(expected.m10, 10);
   expect(mat.m11).toBeCloseTo(expected.m11, 10);
  });

  it('supports out parameter', () => {
   const out = new Matrix2();
   const result = Matrix2.fromAngleScale(Math.PI / 6, 1, 1, out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - Static add', () => {
  it('add adds two matrices', () => {
   const a = Matrix2.IDENTITY;
   const b = Matrix2.IDENTITY;
   const result = Matrix2.add(a, b);
   expect(result.m00).toBe(2);
   expect(result.m11).toBe(2);
  });
 });

 describe('Coverage - Static subtract', () => {
  it('subtract subtracts two matrices', () => {
   const a = Matrix2.fromScale({ x: 2, y: 2 });
   const b = Matrix2.IDENTITY;
   const result = Matrix2.subtract(a, b);
   expect(result.m00).toBe(1);
   expect(result.m11).toBe(1);
  });
 });

 describe('Coverage - Static lerp', () => {
  it('lerp interpolates between matrices', () => {
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale({ x: 3, y: 3 });
   const result = Matrix2.lerp(a, b, 0.5);
   expect(result.m00).toBeCloseTo(2, DIGITS);
   expect(result.m11).toBeCloseTo(2, DIGITS);
  });
 });

 describe('Coverage - Instance determinant', () => {
  it('determinant returns matrix determinant', () => {
   const m = Matrix2.fromScale({ x: 2, y: 3 });
   expect(m.determinant()).toBeCloseTo(6, DIGITS);
  });
 });

 describe('Coverage - Instance multiply', () => {
  it('multiply multiplies in place', () => {
   const a = Matrix2.fromScale({ x: 2, y: 1 }).clone();
   const b = Matrix2.fromScale({ x: 1, y: 3 });
   a.multiply(b);
   expect(a.m00).toBeCloseTo(2, DIGITS);
   expect(a.m11).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Coverage - Instance transpose', () => {
  it('transpose transposes in place', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const orig01 = m.m01;
   const orig10 = m.m10;
   m.transpose();
   expect(m.m01).toBe(orig10);
   expect(m.m10).toBe(orig01);
  });
 });

 describe('Coverage - Instance add', () => {
  it('add adds in place', () => {
   const a = new Matrix2();
   a.add(Matrix2.IDENTITY);
   expect(a.m00).toBe(2);
   expect(a.m11).toBe(2);
  });
 });

 describe('Coverage - Instance subtract', () => {
  it('subtract subtracts in place', () => {
   const a = Matrix2.fromScale({ x: 2, y: 2 }).clone();
   a.subtract(Matrix2.IDENTITY);
   expect(a.m00).toBe(1);
   expect(a.m11).toBe(1);
  });
 });

 describe('Coverage - Instance lerp', () => {
  it('lerp interpolates in place', () => {
   const a = new Matrix2();
   a.lerp(Matrix2.fromScale({ x: 3, y: 3 }), 0.5);
   expect(a.m00).toBeCloseTo(2, DIGITS);
   expect(a.m11).toBeCloseTo(2, DIGITS);
  });
 });

 describe('Coverage - Static fromArray', () => {
  it('fromArray creates from array', () => {
   const array = [1, 0, 0, 1];
   const m = Matrix2.fromArray(array);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
  });
 });

 describe('Coverage - Instance toArray', () => {
  it('toArray returns array', () => {
   const m = Matrix2.IDENTITY;
   const array = m.toArray();
   expect(array[0]).toBe(1);
   expect(array[3]).toBe(1);
  });
 });

 describe('Coverage - Static inverse', () => {
  it('inverse returns inverted matrix', () => {
   const m = Matrix2.fromScale({ x: 2, y: 4 });
   const inv = Matrix2.inverse(m);
   expect(inv.m00).toBeCloseTo(0.5, DIGITS);
   expect(inv.m11).toBeCloseTo(0.25, DIGITS);
  });
 });

 describe('Coverage - Instance inverse', () => {
  it('inverse inverts in place', () => {
   const m = Matrix2.fromScale({ x: 2, y: 4 }).clone();
   m.inverse();
   expect(m.m00).toBeCloseTo(0.5, DIGITS);
   expect(m.m11).toBeCloseTo(0.25, DIGITS);
  });
 });

 describe('Coverage - inverse throw', () => {
  it('static inverse throws on singular matrix', () => {
   const m = Matrix2.fromScale({ x: 0, y: 1 });
   expect(() => Matrix2.inverse(m)).toThrow(RangeError);
  });

  it('instance inverse throws on singular', () => {
   const m = Matrix2.fromScale({ x: 0, y: 1 }).clone();
   expect(() => m.inverse()).toThrow(RangeError);
  });
 });

 describe('Coverage - inverseSafe', () => {
  it('static inverseSafe returns valid inverse for invertible matrix', () => {
   const m = Matrix2.fromScale({ x: 2, y: 3 });
   const inv = Matrix2.inverseSafe(m);
   expect(inv).not.toBeNull();
   expect(inv!.m00).toBeCloseTo(0.5, DIGITS);
  });

  it('instance inverseSafe returns valid inverse', () => {
   const m = Matrix2.fromScale({ x: 2, y: 3 }).clone();
   const inv = m.inverseSafe();
   expect(inv).not.toBeNull();
  });
 });

 describe('Coverage - determinant', () => {
  it('static determinant returns det(M)', () => {
   const m = Matrix2.fromScale({ x: 2, y: 3 });
   expect(Matrix2.determinant(m)).toBeCloseTo(6, DIGITS);
  });
 });

 describe('Coverage - scaleBy', () => {
  it('scaleBy with Vector2 applies non-uniform scaling', () => {
   const m = Matrix2.fromRotation(0);
   const result = Matrix2.scaleBy(m, { x: 2, y: 3 });
   expect(result.m00).toBeCloseTo(2, DIGITS);
   expect(result.m11).toBeCloseTo(3, DIGITS);
  });

  it('scaleBy with number applies uniform scaling', () => {
   const m = Matrix2.IDENTITY;
   const result = Matrix2.scaleBy(m, 5);
   expect(result.m00).toBeCloseTo(5, DIGITS);
   expect(result.m11).toBeCloseTo(5, DIGITS);
  });
 });

 describe('Coverage - static copy', () => {
  it('copy copies source to destination', () => {
   const source = new Matrix2(1, 2, 3, 4);
   const destination = new Matrix2();
   const result = Matrix2.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.m00).toBe(1);
   expect(destination.m11).toBe(4);
  });
 });

 describe('Coverage - fromArray negative offset', () => {
  it('fromArray throws on negative offset', () => {
   expect(() => Matrix2.fromArray([1, 2, 3, 4], -1)).toThrow(RangeError);
  });
 });

 describe('Coverage - ELEMENT_COUNT', () => {
  it('Matrix2.ELEMENT_COUNT equals 4', () => {
   expect(Matrix2.ELEMENT_COUNT).toBe(4);
  });
 });

 describe('Coverage - Static floor', () => {
  it('floor applies Math.floor to elements', () => {
   const result = Matrix2.floor(new Matrix2(1.9, 2.1, 3.7, 4.4));
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(4);
  });
 });

 describe('Coverage - Static ceil', () => {
  it('ceil applies Math.ceil to elements', () => {
   const result = Matrix2.ceil(new Matrix2(1.1, 2.9, 3.2, 4.6));
   expect(result.m00).toBe(2);
   expect(result.m01).toBe(3);
   expect(result.m10).toBe(4);
   expect(result.m11).toBe(5);
  });
 });

 describe('Coverage - Static round', () => {
  it('round applies Math.round to elements', () => {
   const result = Matrix2.round(new Matrix2(1.4, 2.5, 3.6, 4.1));
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(3);
   expect(result.m10).toBe(4);
   expect(result.m11).toBe(4);
  });
 });

 describe('Coverage - Static clamp', () => {
  it('clamp restricts elements to bounds', () => {
   const matrix = new Matrix2(0, 5, -1, 10);
   const minM = new Matrix2(1, 1, 1, 1);
   const maxM = new Matrix2(4, 4, 4, 4);
   const result = Matrix2.clamp(matrix, minM, maxM);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(4);
   expect(result.m10).toBe(1);
   expect(result.m11).toBe(4);
  });
 });

 describe('Coverage - Static clampScalar', () => {
  it('clampScalar restricts all elements to scalar bounds', () => {
   const matrix = new Matrix2(-5, 10, 3, 20);
   const result = Matrix2.clampScalar(matrix, 0, 5);
   expect(result.m00).toBe(0);
   expect(result.m01).toBe(5);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(5);
  });
 });

 describe('Coverage - Static smoothStep interpolation', () => {
  it('smoothStep interpolates with smooth curve', () => {
   const a = new Matrix2(0, 0, 0, 0);
   const b = new Matrix2(10, 10, 10, 10);
   const result = Matrix2.smoothStep(a, b, 0.5);
   expect(result.m00).toBe(5); // 0.5 smoothstepped = 0.5
  });
 });

 describe('Coverage - Static trunc', () => {
  it('trunc applies Math.trunc to elements', () => {
   const result = Matrix2.trunc(new Matrix2(1.9, -2.1, 3.7, -4.4));
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(-2);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(-4);
  });
 });

 describe('Coverage - Static abs', () => {
  it('abs applies Math.abs to elements', () => {
   const result = Matrix2.abs(new Matrix2(-1, 2, -3, 4));
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
   expect(result.m10).toBe(3);
   expect(result.m11).toBe(4);
  });
 });

 describe('Coverage - Static min', () => {
  it('min returns element-wise minimum', () => {
   const a = new Matrix2(1, 5, 2, 8);
   const b = new Matrix2(3, 2, 4, 1);
   const result = Matrix2.min(a, b);
   expect(result.m00).toBe(1);
   expect(result.m01).toBe(2);
   expect(result.m10).toBe(2);
   expect(result.m11).toBe(1);
  });
 });

 describe('Coverage - Static max', () => {
  it('max returns element-wise maximum', () => {
   const a = new Matrix2(1, 5, 2, 8);
   const b = new Matrix2(3, 2, 4, 1);
   const result = Matrix2.max(a, b);
   expect(result.m00).toBe(3);
   expect(result.m01).toBe(5);
   expect(result.m10).toBe(4);
   expect(result.m11).toBe(8);
  });
 });

 describe('Static mod/modScalar', () => {
  it('static mod computes element-wise modulo', () => {
   const a = new Matrix2(10, 7, 15, 9);
   const b = new Matrix2(3, 4, 6, 5);
   const result = Matrix2.mod(a, b);
   expect(result.m00).toBeCloseTo(1, 10);
   expect(result.m01).toBeCloseTo(3, 10);
   expect(result.m10).toBeCloseTo(3, 10);
   expect(result.m11).toBeCloseTo(4, 10);
  });

  it('static mod uses out parameter', () => {
   const out = new Matrix2();
   const result = Matrix2.mod(new Matrix2(10, 7, 15, 9), new Matrix2(3, 4, 6, 5), out);
   expect(result).toBe(out);
  });

  it('static mod matches instance mod', () => {
   const a = new Matrix2(10, 7, 15, 9);
   const b = new Matrix2(3, 4, 6, 5);
   const staticResult = Matrix2.mod(a, b);
   const instanceResult = a.clone().mod(b);
   expect(staticResult.m00).toBeCloseTo(instanceResult.m00, 10);
   expect(staticResult.m01).toBeCloseTo(instanceResult.m01, 10);
   expect(staticResult.m10).toBeCloseTo(instanceResult.m10, 10);
   expect(staticResult.m11).toBeCloseTo(instanceResult.m11, 10);
  });

  it('static modScalar computes scalar modulo', () => {
   const result = Matrix2.modScalar(new Matrix2(10, 7, 15, 9), 4);
   expect(result.m00).toBeCloseTo(2, 10);
   expect(result.m01).toBeCloseTo(3, 10);
   expect(result.m10).toBeCloseTo(3, 10);
   expect(result.m11).toBeCloseTo(1, 10);
  });

  it('static modScalar uses out parameter', () => {
   const out = new Matrix2();
   const result = Matrix2.modScalar(new Matrix2(10, 7, 15, 9), 4, out);
   expect(result).toBe(out);
  });

  it('static modScalar matches instance modScalar', () => {
   const a = new Matrix2(10, 7, 15, 9);
   const staticResult = Matrix2.modScalar(a, 4);
   const instanceResult = a.clone().modScalar(4);
   expect(staticResult.m00).toBeCloseTo(instanceResult.m00, 10);
   expect(staticResult.m01).toBeCloseTo(instanceResult.m01, 10);
   expect(staticResult.m10).toBeCloseTo(instanceResult.m10, 10);
   expect(staticResult.m11).toBeCloseTo(instanceResult.m11, 10);
  });
 });

 describe('Instance compose/decompose', () => {
  it('compose sets matrix to rotation+scale', () => {
   const m = new Matrix2().compose(Math.PI / 4, 2);
   const d = m.decompose();
   expect(d.rotation).toBeCloseTo(Math.PI / 4, 8);
   expect(d.scale.x).toBeCloseTo(2, 8);
   expect(d.scale.y).toBeCloseTo(2, 8);
  });

  it('compose with per-axis scale', () => {
   const m = new Matrix2().compose(0, new Vector2(3, 5));
   expect(m.m00).toBeCloseTo(3, DIGITS);
   expect(m.m11).toBeCloseTo(5, DIGITS);
  });

  it('decompose returns this for chaining', () => {
   const m = new Matrix2().compose(0.5, 1);
   expect(m).toBeInstanceOf(Matrix2);
  });

  it('compose-decompose round-trip: identity', () => {
   const m = new Matrix2().compose(0, 1);
   const d = m.decompose();
   expect(d.rotation).toBeCloseTo(0, 8);
   expect(d.scale.x).toBeCloseTo(1, 8);
   expect(d.scale.y).toBeCloseTo(1, 8);
  });

  it('compose-decompose round-trip: pure rotation', () => {
   const angle = 1.2;
   const m = new Matrix2().compose(angle, 1);
   const d = m.decompose();
   expect(d.rotation).toBeCloseTo(angle, 8);
   expect(d.scale.x).toBeCloseTo(1, 8);
   expect(d.scale.y).toBeCloseTo(1, 8);
  });

  it('compose-decompose round-trip: non-uniform scale', () => {
   const m = new Matrix2().compose(0.3, new Vector2(2, 4));
   const d = m.decompose();
   expect(d.rotation).toBeCloseTo(0.3, 8);
   expect(d.scale.x).toBeCloseTo(2, 8);
   expect(d.scale.y).toBeCloseTo(4, 8);
  });

  it('instance compose matches static compose', () => {
   const inst = new Matrix2().compose(0.8, new Vector2(2, 3));
   const stat = Matrix2.compose(0.8, new Vector2(2, 3));
   expect(inst.m00).toBeCloseTo(stat.m00, DIGITS);
   expect(inst.m01).toBeCloseTo(stat.m01, DIGITS);
   expect(inst.m10).toBeCloseTo(stat.m10, DIGITS);
   expect(inst.m11).toBeCloseTo(stat.m11, DIGITS);
  });

  it('instance decompose matches static decompose', () => {
   const m = Matrix2.compose(0.5, new Vector2(2, 3));
   const instD = m.decompose();
   const statD = Matrix2.decompose(m);
   expect(instD.rotation).toBeCloseTo(statD.rotation, DIGITS);
   expect(instD.scale.x).toBeCloseTo(statD.scale.x, DIGITS);
   expect(instD.scale.y).toBeCloseTo(statD.scale.y, DIGITS);
  });
 });

 describe('Near-singular boundary', () => {
  const EPS = 1e-10;

  it('inverse throws when determinant equals EPSILON', () => {
   // det = 1 * EPS - 0 * 0 = EPS → |det| <= EPSILON → singular
   const m = new Matrix2(1, 0, 0, EPS);
   expect(() => Matrix2.inverse(m)).toThrow(RangeError);
  });

  it('inverse throws when determinant is zero', () => {
   const m = new Matrix2(1, 1, 1, 1); // det = 0
   expect(() => Matrix2.inverse(m)).toThrow(RangeError);
  });

  it('inverse succeeds when determinant is above EPSILON', () => {
   // det = 1 * 2e-10 - 0 = 2e-10 > EPSILON
   const m = new Matrix2(1, 0, 0, 2e-10);
   const inv = Matrix2.inverse(m);
   expect(inv.m00).toBe(1);
   expect(inv.m11).toBe(1 / 2e-10);
  });

  it('inverse succeeds with negative determinant beyond -EPSILON', () => {
   // det = 1 * (-2e-10) = -2e-10, |det| > EPSILON
   const m = new Matrix2(1, 0, 0, -2e-10);
   const inv = Matrix2.inverse(m);
   expect(inv.m11).toBe(1 / -2e-10);
  });

  it('inverseSafe returns identity when determinant equals EPSILON', () => {
   const m = new Matrix2(1, 0, 0, EPS);
   const inv = Matrix2.inverseSafe(m);
   expect(inv.m00).toBe(1);
   expect(inv.m01).toBe(0);
   expect(inv.m10).toBe(0);
   expect(inv.m11).toBe(1);
  });

  it('inverseSafe returns identity when determinant is zero', () => {
   const m = new Matrix2(1, 1, 1, 1);
   const inv = Matrix2.inverseSafe(m);
   expect(Matrix2.isIdentity(inv)).toBe(true);
  });

  it('inverseSafe inverts when determinant is above EPSILON', () => {
   const m = new Matrix2(1, 0, 0, 2e-10);
   const inv = Matrix2.inverseSafe(m);
   expect(inv.m11).toBe(1 / 2e-10);
  });
 });

 describe('Coverage: static factories and operations', () => {
  it('fromColumns creates matrix from column vectors', () => {
   const m = Matrix2.fromColumns({ x: 1, y: 2 }, { x: 3, y: 4 });
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('multiply computes full product', () => {
   const a = new Matrix2(1, 2, 3, 4);
   const b = new Matrix2(5, 6, 7, 8);
   const r = Matrix2.multiply(a, b);
   expect(r.m00).toBe(1 * 5 + 3 * 6);
   expect(r.m01).toBe(2 * 5 + 4 * 6);
   expect(r.m10).toBe(1 * 7 + 3 * 8);
   expect(r.m11).toBe(2 * 7 + 4 * 8);
  });

  it('multiplyScalar multiplies all components by scalar', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const r = Matrix2.multiplyScalar(m, 2.5);
   expect(r.m00).toBe(2.5);
   expect(r.m01).toBe(5);
   expect(r.m10).toBe(7.5);
   expect(r.m11).toBe(10);
  });

  it('lerpClamped clamps t to [0,1]', () => {
   const a = new Matrix2(0, 0, 0, 0);
   const b = new Matrix2(10, 10, 10, 10);
   const r = Matrix2.lerpClamped(a, b, 1.5);
   expect(r.m00).toBe(10);
   expect(r.m11).toBe(10);
  });

  it('smoothStep applies easing', () => {
   const a = new Matrix2(0, 0, 0, 0);
   const b = new Matrix2(10, 10, 10, 10);
   const r = Matrix2.smoothStep(a, b, 0.5);
   expect(r.m00).toBe(5);
  });

  it('rotateCS rotates with precomputed cos/sin', () => {
   const m = Matrix2.IDENTITY.clone();
   const r = Matrix2.rotateCS(m, 0, 1); // 90° rotation
   expect(r.m00).toBeCloseTo(0, DIGITS);
   expect(r.m01).toBeCloseTo(1, DIGITS);
   expect(r.m10).toBeCloseTo(-1, DIGITS);
   expect(r.m11).toBeCloseTo(0, DIGITS);
  });

  it('isOrthogonal detects rotation matrices', () => {
   const rot = Matrix2.fromRotation(0.7);
   expect(Matrix2.isOrthogonal(rot)).toBe(true);
   const scale = new Matrix2(2, 0, 0, 3);
   expect(Matrix2.isOrthogonal(scale)).toBe(false);
  });
 });

 describe('Coverage: instance operations', () => {
  it('fromObject factory copies all components', () => {
   const m = Matrix2.fromObject({ m00: 2, m01: 3, m10: 4, m11: 5 });
   expect(m.m00).toBe(2);
   expect(m.m01).toBe(3);
   expect(m.m10).toBe(4);
   expect(m.m11).toBe(5);
  });

  it('copy copies components', () => {
   const a = new Matrix2(1, 2, 3, 4);
   const b = new Matrix2();
   b.copy(a);
   expect(b.m00).toBe(1);
   expect(b.m11).toBe(4);
  });

  it('setFromArray loads from array at offset', () => {
   const m = new Matrix2();
   m.setFromArray([10, 20, 30, 40], 0);
   expect(m.m00).toBe(10);
   expect(m.m01).toBe(20);
   expect(m.m10).toBe(30);
   expect(m.m11).toBe(40);
  });

  it('inverseUnchecked inverts in place', () => {
   const m = new Matrix2(1, 0, 0, 2);
   m.inverseUnchecked();
   expect(m.m00).toBe(1);
   expect(m.m11).toBeCloseTo(0.5, DIGITS);
  });

  it('max computes component-wise maximum', () => {
   const a = new Matrix2(1, 5, 3, 2);
   const b = new Matrix2(4, 2, 6, 1);
   a.max(b);
   expect(a.m00).toBe(4);
   expect(a.m01).toBe(5);
   expect(a.m10).toBe(6);
   expect(a.m11).toBe(2);
  });

  it('premultiply in place computes other * this', () => {
   const a = new Matrix2(1, 2, 3, 4);
   const b = new Matrix2(5, 6, 7, 8);
   a.premultiply(b);
   const expected = Matrix2.multiply(b, new Matrix2(1, 2, 3, 4));
   expect(a.m00).toBeCloseTo(expected.m00, DIGITS);
   expect(a.m11).toBeCloseTo(expected.m11, DIGITS);
  });

  it('transformVector transforms a vector', () => {
   const rot = Matrix2.fromRotation(Math.PI / 2);
   const v = rot.transformVector({ x: 1, y: 0 });
   expect(v.x).toBeCloseTo(0, 8);
   expect(v.y).toBeCloseTo(1, 8);
  });

  it('rotate rotates matrix by angle', () => {
   const m = new Matrix2();
   m.rotate(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0, 8);
   expect(m.m01).toBeCloseTo(1, 8);
  });

  it('rotateCS instance rotates with cos/sin', () => {
   const m = new Matrix2();
   m.rotateCS(0, 1); // 90°
   expect(m.m00).toBeCloseTo(0, DIGITS);
   expect(m.m01).toBeCloseTo(1, DIGITS);
  });
 });
});

describe('Matrix2 Safe/Unchecked variants', () => {
 it('static inverseSafe returns identity for singular matrix', () => {
  const singular = new Matrix2(1, 2, 2, 4); // det = 1*4 - 2*2 = 0
  const result = Matrix2.inverseSafe(singular);
  expect(result.m00).toBe(1);
  expect(result.m01).toBe(0);
  expect(result.m10).toBe(0);
  expect(result.m11).toBe(1);
 });

 it('static inverseUnchecked produces correct inverse for invertible matrix', () => {
  const m = new Matrix2(4, 7, 2, 6); // det = 24 - 14 = 10
  const result = Matrix2.inverseUnchecked(m);
  // Verify A * A^-1 = I
  const product = Matrix2.multiply(m, result);
  expect(product.m00).toBeCloseTo(1, DIGITS);
  expect(product.m01).toBeCloseTo(0, DIGITS);
  expect(product.m10).toBeCloseTo(0, DIGITS);
  expect(product.m11).toBeCloseTo(1, DIGITS);
 });

 it('static divideScalarSafe returns zero matrix for near-zero scalar', () => {
  const m = new Matrix2(1, 2, 3, 4);
  const result = Matrix2.divideScalarSafe(m, 0);
  expect(result.m00).toBe(0);
  expect(result.m01).toBe(0);
  expect(result.m10).toBe(0);
  expect(result.m11).toBe(0);
 });

 it('static divideScalarUnchecked produces correct result for valid scalar', () => {
  const m = new Matrix2(4, 6, 8, 10);
  const result = Matrix2.divideScalarUnchecked(m, 2);
  expect(result.m00).toBeCloseTo(2, DIGITS);
  expect(result.m01).toBeCloseTo(3, DIGITS);
  expect(result.m10).toBeCloseTo(4, DIGITS);
  expect(result.m11).toBeCloseTo(5, DIGITS);
 });

 it('instance inverseSafe returns identity for singular matrix', () => {
  const m = new Matrix2(1, 2, 2, 4);
  m.inverseSafe();
  expect(m.m00).toBe(1);
  expect(m.m01).toBe(0);
  expect(m.m10).toBe(0);
  expect(m.m11).toBe(1);
 });

 it('instance inverseUnchecked produces correct inverse', () => {
  const m = new Matrix2(4, 7, 2, 6);
  const original = m.clone();
  m.inverseUnchecked();
  const product = Matrix2.multiply(original, m);
  expect(product.m00).toBeCloseTo(1, DIGITS);
  expect(product.m01).toBeCloseTo(0, DIGITS);
  expect(product.m10).toBeCloseTo(0, DIGITS);
  expect(product.m11).toBeCloseTo(1, DIGITS);
 });

 it('instance divideScalarSafe returns zero for near-zero scalar', () => {
  const m = new Matrix2(1, 2, 3, 4);
  m.divideScalarSafe(0);
  expect(m.m00).toBe(0);
  expect(m.m01).toBe(0);
  expect(m.m10).toBe(0);
  expect(m.m11).toBe(0);
 });

 it('instance divideScalarUnchecked produces correct result', () => {
  const m = new Matrix2(4, 6, 8, 10);
  m.divideScalarUnchecked(2);
  expect(m.m00).toBeCloseTo(2, DIGITS);
  expect(m.m01).toBeCloseTo(3, DIGITS);
  expect(m.m10).toBeCloseTo(4, DIGITS);
  expect(m.m11).toBeCloseTo(5, DIGITS);
 });

 /* ===== fromDiagonal ===== */

 describe('fromDiagonal', () => {
  it('creates diagonal matrix', () => {
   const m = Matrix2.fromDiagonal({ x: 2, y: 3 });
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
   expect(m.m01).toBe(0);
   expect(m.m10).toBe(0);
  });
 });

 /* ===== fromReflection ===== */

 describe('fromReflection', () => {
  it('reflection about Y-axis (normal = (1,0)) negates x', () => {
   const m = Matrix2.fromReflection({ x: 1, y: 0 });
   // I - 2*n*nT = [[1-2,0],[0,1]] = [[-1,0],[0,1]]
   expect(m.m00).toBeCloseTo(-1, DIGITS);
   expect(m.m01).toBeCloseTo(0, DIGITS);
   expect(m.m10).toBeCloseTo(0, DIGITS);
   expect(m.m11).toBeCloseTo(1, DIGITS);
  });

  it('reflection about X-axis (normal = (0,1)) negates y', () => {
   const m = Matrix2.fromReflection({ x: 0, y: 1 });
   // I - 2*n*nT = [[1,0],[0,1-2]] = [[1,0],[0,-1]]
   expect(m.m00).toBeCloseTo(1, DIGITS);
   expect(m.m01).toBeCloseTo(0, DIGITS);
   expect(m.m10).toBeCloseTo(0, DIGITS);
   expect(m.m11).toBeCloseTo(-1, DIGITS);
  });

  it('DEV-mode rejects non-unit normals', () => {
   // |n| = sqrt(2 ≠ 1) — assertion should fire in dev builds.
   expect(() => Matrix2.fromReflection({ x: 1, y: 1 })).toThrow();
  });
 });

 /* ===== fromOuterProduct ===== */

 describe('fromOuterProduct', () => {
  it('standard basis vectors produce basis outer products', () => {
   const basisX = { x: 1, y: 0 };
   const basisY = { x: 0, y: 1 };
   const m00 = Matrix2.fromOuterProduct(basisX, basisX);
   expect(m00.m00).toBe(1);
   expect(m00.m01).toBe(0);
   expect(m00.m10).toBe(0);
   expect(m00.m11).toBe(0);
   const m01 = Matrix2.fromOuterProduct(basisX, basisY);
   // column 0 = basisX * 0 = 0, column 1 = basisX * 1 = (1, 0)
   expect(m01.m00).toBe(0);
   expect(m01.m01).toBe(0);
   expect(m01.m10).toBe(1);
   expect(m01.m11).toBe(0);
  });

  it('general outer product layout M[i,j] = u[i]·v[j]', () => {
   const u = { x: 2, y: 3 };
   const v = { x: 5, y: 7 };
   const m = Matrix2.fromOuterProduct(u, v);
   expect(m.m00).toBe(10); // u.x * v.x
   expect(m.m01).toBe(15); // u.y * v.x
   expect(m.m10).toBe(14); // u.x * v.y
   expect(m.m11).toBe(21); // u.y * v.y
  });

  it('composes with fromReflection: fromReflection(n) = I - 2·(n ⊗ n)', () => {
   const n = { x: 3 / 5, y: 4 / 5 }; // unit vector
   const outer = Matrix2.fromOuterProduct(n, n);
   const reflected = Matrix2.fromReflection(n);
   expect(reflected.m00).toBeCloseTo(1 - 2 * outer.m00, DIGITS);
   expect(reflected.m01).toBeCloseTo(-2 * outer.m01, DIGITS);
   expect(reflected.m10).toBeCloseTo(-2 * outer.m10, DIGITS);
   expect(reflected.m11).toBeCloseTo(1 - 2 * outer.m11, DIGITS);
  });

  it('writes to provided out parameter and returns it', () => {
   const out = new Matrix2();
   const result = Matrix2.fromOuterProduct({ x: 1, y: 2 }, { x: 3, y: 4 }, out);
   expect(result).toBe(out);
  });
 });

 /* ===== solveLinearSystem (3 tiers) ===== */

 describe('solveLinearSystem', () => {
  it('solves identity system', () => {
   const result = Matrix2.solveLinearSystem(Matrix2.IDENTITY, { x: 3, y: 5 });
   expect(result.x).toBeCloseTo(3, DIGITS);
   expect(result.y).toBeCloseTo(5, DIGITS);
  });

  it('solves non-trivial system', () => {
   // [2 1; 1 3] * x = [5, 7]  →  x = (1.6, 1.8)
   const A = new Matrix2(2, 1, 1, 3);
   const b = { x: 5, y: 7 };
   const x = Matrix2.solveLinearSystem(A, b);
   expect(x.x).toBeCloseTo(1.6, DIGITS);
   expect(x.y).toBeCloseTo(1.8, DIGITS);
  });

  it('throws on singular matrix', () => {
   const singular = new Matrix2(1, 2, 2, 4); // rows are proportional
   expect(() => Matrix2.solveLinearSystem(singular, { x: 1, y: 2 })).toThrow(RangeError);
  });
 });

 describe('solveLinearSystemSafe', () => {
  it('returns (0,0) for singular matrix', () => {
   const singular = new Matrix2(1, 2, 2, 4);
   const result = Matrix2.solveLinearSystemSafe(singular, { x: 1, y: 2 });
   expect(result.x).toBe(0);
   expect(result.y).toBe(0);
  });

  it('solves non-singular system normally', () => {
   const result = Matrix2.solveLinearSystemSafe(Matrix2.IDENTITY, { x: 3, y: 5 });
   expect(result.x).toBeCloseTo(3, DIGITS);
   expect(result.y).toBeCloseTo(5, DIGITS);
  });
 });

 describe('solveLinearSystemUnchecked', () => {
  it('solves identity system', () => {
   const result = Matrix2.solveLinearSystemUnchecked(Matrix2.IDENTITY, { x: 7, y: 11 });
   expect(result.x).toBeCloseTo(7, DIGITS);
   expect(result.y).toBeCloseTo(11, DIGITS);
  });

  it('singular matrix produces NaN or Infinity (GIGO contract — never throws)', () => {
   // det([[1,2],[2,4]]) = 1*4 - 2*2 = 0 — singular, column-major: m00=1,m01=2,m10=2,m11=4
   const singular = new Matrix2(1, 2, 2, 4);
   let result!: { x: number; y: number };
   expect(() => {
    result = Matrix2.solveLinearSystemUnchecked(singular, { x: 1, y: 1 });
   }).not.toThrow();
   expect(Number.isNaN(result.x) || !Number.isFinite(result.x)).toBe(true);
  });
 });

 describe('eigenvalues', () => {
  it('diagonal matrix [[3,0],[0,5]] has eigenvalues 5 and 3', () => {
   // Column-major: m00=3, m01=0, m10=0, m11=5
   const m = new Matrix2(3, 0, 0, 5);
   const result = Matrix2.eigenvalues(m);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   expect(real.lambda1).toBeCloseTo(5, DIGITS);
   expect(real.lambda2).toBeCloseTo(3, DIGITS);
  });

  it('symmetric matrix [[2,1],[1,2]] has eigenvalues 3 and 1', () => {
   // Row form: [[2,1],[1,2]]
   // Column-major: m00=2, m01=1, m10=1, m11=2
   const m = new Matrix2(2, 1, 1, 2);
   const result = Matrix2.eigenvalues(m);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   expect(real.lambda1).toBeCloseTo(3, DIGITS);
   expect(real.lambda2).toBeCloseTo(1, DIGITS);
  });

  it('rotation matrix has complex eigenvalues', () => {
   // Rotation by PI/4: cos = sin = sqrt(2)/2
   const angle = Math.PI / 4;
   const c = Math.cos(angle);
   const s = Math.sin(angle);
   // Row form: [[cos, -sin],[sin, cos]]
   // Column-major: m00=cos, m01=sin, m10=-sin, m11=cos
   const m = new Matrix2(c, s, -s, c);
   const result = Matrix2.eigenvalues(m);
   expect(result.type).toBe('complex');
   const complex = result as { type: 'complex'; realPart: number; imaginaryPart: number };
   expect(complex.realPart).toBeCloseTo(c, DIGITS);
   expect(complex.imaginaryPart).toBeCloseTo(s, DIGITS);
  });

  it('identity matrix has repeated eigenvalue 1', () => {
   const result = Matrix2.eigenvalues(Matrix2.IDENTITY);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   expect(real.lambda1).toBeCloseTo(1, DIGITS);
   expect(real.lambda2).toBeCloseTo(1, DIGITS);
  });

  it('eigenvalue-trace consistency: lambda1 + lambda2 = trace', () => {
   const m = new Matrix2(4, 3, 2, 1);
   const result = Matrix2.eigenvalues(m);
   const trace = Matrix2.trace(m);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   expect(real.lambda1 + real.lambda2).toBeCloseTo(trace, DIGITS);
  });

  it('eigenvalue-determinant consistency: lambda1 * lambda2 = determinant', () => {
   const m = new Matrix2(4, 3, 2, 1);
   const result = Matrix2.eigenvalues(m);
   const determinant = Matrix2.determinant(m);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   expect(real.lambda1 * real.lambda2).toBeCloseTo(determinant, DIGITS);
  });

  it('complex eigenvalue consistency: realPart^2 + imaginaryPart^2 = determinant', () => {
   const angle = Math.PI / 3;
   const c = Math.cos(angle);
   const s = Math.sin(angle);
   const m = new Matrix2(c, s, -s, c);
   const result = Matrix2.eigenvalues(m);
   const determinant = Matrix2.determinant(m);
   expect(result.type).toBe('complex');
   const complex = result as { type: 'complex'; realPart: number; imaginaryPart: number };
   expect(
    complex.realPart * complex.realPart + complex.imaginaryPart * complex.imaginaryPart,
   ).toBeCloseTo(determinant, DIGITS);
  });

  it('zero matrix has both eigenvalues 0', () => {
   // All-zero matrix: trace=0, det=0 → eigenvalues both 0
   const m = new Matrix2(0, 0, 0, 0);
   const result = Matrix2.eigenvalues(m);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   expect(real.lambda1).toBeCloseTo(0, DIGITS);
   expect(real.lambda2).toBeCloseTo(0, DIGITS);
  });

  it('Jordan block [[2,0],[1,2]] has repeated eigenvalue 2 (discriminant = 0)', () => {
   // Row form [[2,1],[0,2]]: col0=[2,0], col1=[1,2] → column-major: m00=2, m01=0, m10=1, m11=2
   const m = new Matrix2(2, 0, 1, 2);
   const result = Matrix2.eigenvalues(m);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   expect(real.lambda1).toBeCloseTo(2, DIGITS);
   expect(real.lambda2).toBeCloseTo(2, DIGITS);
  });

  it('negative diagonal [[-1,0],[0,-2]] has real negative eigenvalues', () => {
   // column-major: m00=-1, m01=0, m10=0, m11=-2
   const m = new Matrix2(-1, 0, 0, -2);
   const result = Matrix2.eigenvalues(m);
   expect(result.type).toBe('real');
   const real = result as { type: 'real'; lambda1: number; lambda2: number };
   // Eigenvalues are -1 and -2 (order: lambda1 >= lambda2 by descending)
   expect(real.lambda1).toBeCloseTo(-1, DIGITS);
   expect(real.lambda2).toBeCloseTo(-2, DIGITS);
   // Consistency checks
   expect(real.lambda1 + real.lambda2).toBeCloseTo(Matrix2.trace(m), DIGITS);
   expect(real.lambda1 * real.lambda2).toBeCloseTo(Matrix2.determinant(m), DIGITS);
  });
 });

 describe('eigendecompose', () => {
  it('diagonal matrix [[3,0],[0,5]] has standard basis eigenvectors', () => {
   const m = new Matrix2(3, 0, 0, 5);
   const result = Matrix2.eigendecompose(m);
   expect(result.type).toBe('real');
   const real = result as {
    type: 'real';
    lambda1: number;
    v1: { x: number; y: number };
    lambda2: number;
    v2: { x: number; y: number };
   };
   expect(real.lambda1).toBeCloseTo(5, DIGITS);
   expect(real.lambda2).toBeCloseTo(3, DIGITS);
   // lambda1=5 corresponds to m11=5, so eigenvector should be [0,1]
   expect(real.v1.x).toBeCloseTo(0, DIGITS);
   expect(real.v1.y).toBeCloseTo(1, DIGITS);
   // lambda2=3 corresponds to m00=3, so eigenvector should be [1,0]
   expect(real.v2.x).toBeCloseTo(1, DIGITS);
   expect(real.v2.y).toBeCloseTo(0, DIGITS);
  });

  it('symmetric matrix [[2,1],[1,2]] has correct eigenvectors', () => {
   const m = new Matrix2(2, 1, 1, 2);
   const result = Matrix2.eigendecompose(m);
   expect(result.type).toBe('real');
   const real = result as {
    type: 'real';
    lambda1: number;
    v1: { x: number; y: number };
    lambda2: number;
    v2: { x: number; y: number };
   };
   expect(real.lambda1).toBeCloseTo(3, DIGITS);
   expect(real.lambda2).toBeCloseTo(1, DIGITS);
   // Eigenvectors should be normalized
   const length1 = Math.sqrt(real.v1.x * real.v1.x + real.v1.y * real.v1.y);
   expect(length1).toBeCloseTo(1, DIGITS);
   const length2 = Math.sqrt(real.v2.x * real.v2.x + real.v2.y * real.v2.y);
   expect(length2).toBeCloseTo(1, DIGITS);
  });

  it('rotation matrix returns complex result', () => {
   const angle = Math.PI / 4;
   const c = Math.cos(angle);
   const s = Math.sin(angle);
   const m = new Matrix2(c, s, -s, c);
   const result = Matrix2.eigendecompose(m);
   expect(result.type).toBe('complex');
   const complex = result as { type: 'complex'; realPart: number; imaginaryPart: number };
   expect(complex.realPart).toBeCloseTo(c, DIGITS);
   expect(complex.imaginaryPart).toBeCloseTo(s, DIGITS);
  });

  it('identity matrix eigendecomposition has repeated eigenvalue 1', () => {
   const result = Matrix2.eigendecompose(Matrix2.IDENTITY);
   expect(result.type).toBe('real');
   const real = result as {
    type: 'real';
    lambda1: number;
    v1: { x: number; y: number };
    lambda2: number;
    v2: { x: number; y: number };
   };
   expect(real.lambda1).toBeCloseTo(1, DIGITS);
   expect(real.lambda2).toBeCloseTo(1, DIGITS);
   // Identity is diagonal, eigenvectors are standard basis
   expect(real.v1.x).toBeCloseTo(1, DIGITS);
   expect(real.v1.y).toBeCloseTo(0, DIGITS);
   expect(real.v2.x).toBeCloseTo(0, DIGITS);
   expect(real.v2.y).toBeCloseTo(1, DIGITS);
  });

  it('eigenvectors satisfy A*v = lambda*v', () => {
   // Non-trivial non-symmetric matrix with real eigenvalues
   // [[4, 1], [2, 3]] => Row form, column-major: m00=4, m01=2, m10=1, m11=3
   const m = new Matrix2(4, 2, 1, 3);
   const result = Matrix2.eigendecompose(m);
   expect(result.type).toBe('real');
   const real = result as {
    type: 'real';
    lambda1: number;
    v1: { x: number; y: number };
    lambda2: number;
    v2: { x: number; y: number };
   };
   // A*v1 should equal lambda1*v1
   const av1x = m.m00 * real.v1.x + m.m10 * real.v1.y;
   const av1y = m.m01 * real.v1.x + m.m11 * real.v1.y;
   expect(av1x).toBeCloseTo(real.lambda1 * real.v1.x, DIGITS);
   expect(av1y).toBeCloseTo(real.lambda1 * real.v1.y, DIGITS);

   // A*v2 should equal lambda2*v2
   const av2x = m.m00 * real.v2.x + m.m10 * real.v2.y;
   const av2y = m.m01 * real.v2.x + m.m11 * real.v2.y;
   expect(av2x).toBeCloseTo(real.lambda2 * real.v2.x, DIGITS);
   expect(av2y).toBeCloseTo(real.lambda2 * real.v2.y, DIGITS);
  });

  it('eigenvectors of symmetric matrix are orthogonal', () => {
   const m = new Matrix2(2, 1, 1, 2);
   const result = Matrix2.eigendecompose(m);
   expect(result.type).toBe('real');
   const real = result as {
    type: 'real';
    v1: { x: number; y: number };
    v2: { x: number; y: number };
   };
   const dot = real.v1.x * real.v2.x + real.v1.y * real.v2.y;
   expect(dot).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Instance mirrors for eigenvalues / eigendecompose / solveLinearSystem', () => {
  it('instance eigenvalues matches static', () => {
   const m = new Matrix2(3, 0, 0, 5);
   const staticResult = Matrix2.eigenvalues(m);
   const instanceResult = m.eigenvalues();
   expect(instanceResult.type).toBe('real');
   expect(staticResult.type).toBe('real');
   // Narrow both unions and assert component-wise equality.
   const staticReal = staticResult as Extract<typeof staticResult, { type: 'real' }>;
   const instanceReal = instanceResult as Extract<typeof instanceResult, { type: 'real' }>;
   expect(instanceReal.lambda1).toBeCloseTo(staticReal.lambda1, DIGITS);
   expect(instanceReal.lambda2).toBeCloseTo(staticReal.lambda2, DIGITS);
  });

  it('instance eigendecompose matches static', () => {
   const m = new Matrix2(2, 1, 1, 2);
   const staticResult = Matrix2.eigendecompose(m);
   const instanceResult = m.eigendecompose();
   expect(instanceResult.type).toBe(staticResult.type);
  });

  it('instance solveLinearSystem matches static', () => {
   const m = new Matrix2(2, 0, 0, 3);
   const b = { x: 4, y: 9 };
   const staticResult = Matrix2.solveLinearSystem(m, b);
   const instanceResult = m.solveLinearSystem(b);
   expect(instanceResult.x).toBeCloseTo(staticResult.x, DIGITS);
   expect(instanceResult.y).toBeCloseTo(staticResult.y, DIGITS);
  });

  it('instance solveLinearSystemSafe returns (0, 0) for singular', () => {
   const singular = new Matrix2(1, 2, 2, 4);
   const b = { x: 1, y: 1 };
   const result = singular.solveLinearSystemSafe(b);
   expect(result.x).toBe(0);
   expect(result.y).toBe(0);
  });

  it('instance solveLinearSystemUnchecked matches static', () => {
   const m = new Matrix2(2, 0, 0, 3);
   const b = { x: 4, y: 9 };
   const instanceResult = m.solveLinearSystemUnchecked(b);
   expect(instanceResult.x).toBeCloseTo(2, DIGITS);
   expect(instanceResult.y).toBeCloseTo(3, DIGITS);
  });
 });
});
