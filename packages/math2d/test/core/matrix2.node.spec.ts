import { describe, expect, it } from '@jest/globals';

import { Matrix2 } from '../../src/core/matrix2';
import { Vector2 } from '../../src/core/vector2';

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

  it('scale mutates instance', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.scale(2);
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
   const scaled = Matrix2.scale(m, 3);
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

  it('scale scales matrix', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.scale(2);
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
   m.scale(2);
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

  it('isInvertible checks invertibility', () => {
   expect(Matrix2.IDENTITY.isInvertible()).toBe(true);
   expect(new Matrix2(0, 0, 0, 0).isInvertible()).toBe(false);
  });

  it('isOrthogonal checks orthogonality', () => {
   expect(Matrix2.fromRotation(Math.PI / 4).isOrthogonal()).toBe(true);
   expect(new Matrix2(1, 2, 3, 4).isOrthogonal()).toBe(false);
  });
 });

 describe('Matrix Operations Extended', () => {
  it('scale multiplies all components by scalar', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.scale(2);
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
   const v = { x: 1, y: 0 };
   const result = m.transformVector(v);
   expect(result.x).toBeCloseTo(0);
   expect(result.y).toBeCloseTo(1);
  });

  it('transformVector with out parameter', () => {
   const m = Matrix2.fromScale(2);
   const v = { x: 3, y: 4 };
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

  it('scale scales all components', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.scale(2);
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

 describe('Constructor Overloads', () => {
  it('constructs from array', () => {
   const m = new Matrix2([1, 2, 3, 4]);
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('constructs from object', () => {
   const m = new Matrix2({ m00: 5, m01: 6, m10: 7, m11: 8 });
   expect(m.m00).toBe(5);
   expect(m.m01).toBe(6);
   expect(m.m10).toBe(7);
   expect(m.m11).toBe(8);
  });

  it('throws on short array', () => {
   expect(() => new Matrix2([1, 2, 3] as [number, number, number, number])).toThrow(RangeError);
  });

  it('throws on invalid arguments', () => {
   expect(() => new Matrix2('invalid' as unknown as number)).toThrow(TypeError);
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

  it('multiplyScalar is alias for scale', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const result = Matrix2.multiplyScalar(m, 3);
   expect(result.m00).toBe(3);
   expect(result.m11).toBe(12);
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
  it('lerpUnclamped allows t outside [0,1]', () => {
   const a = new Matrix2(0, 0, 0, 0);
   const b = new Matrix2(10, 10, 10, 10);
   const result = Matrix2.lerpUnclamped(a, b, 1.5);
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
   expect(Matrix2.nearZero(m, 0.001)).toBe(true);
   expect(Matrix2.nearZero(m, 0.0000001)).toBe(false);
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

  it('isSingular tests if matrix is singular', () => {
   expect(Matrix2.isSingular(Matrix2.ZERO)).toBe(true);
   expect(Matrix2.isSingular(Matrix2.IDENTITY)).toBe(false);
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

  it('multiplyScalar is alias for scale', () => {
   const m = new Matrix2(1, 2, 3, 4);
   m.multiplyScalar(3);
   expect(m.m00).toBe(3);
   expect(m.m11).toBe(12);
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
   expect(m.nearZero(0.001)).toBe(true);
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

  it('isSingular checks singularity', () => {
   const m = new Matrix2(1, 2, 2, 4);
   expect(m.isSingular()).toBe(true);
  });
 });

 describe('Instance Transformations Extended', () => {
  it('rotate rotates the matrix', () => {
   const m = new Matrix2(1, 0, 0, 1);
   m.rotate(Math.PI / 2);
   expect(m.m00).toBeCloseTo(0);
   expect(m.m01).toBeCloseTo(1);
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

  it('SCALE_2 scales by 2', () => {
   const scaled = Matrix2.SCALE_2.transformVector(new Vector2(3, 4));
   expect(scaled.x).toBe(6);
   expect(scaled.y).toBe(8);
  });

  it('SCALE_HALF scales by 0.5', () => {
   const scaled = Matrix2.SCALE_HALF.transformVector(new Vector2(4, 6));
   expect(scaled.x).toBe(2);
   expect(scaled.y).toBe(3);
  });

  it('ONE is all-ones matrix', () => {
   expect(Matrix2.ONE.m00).toBe(1);
   expect(Matrix2.ONE.m01).toBe(1);
   expect(Matrix2.ONE.m10).toBe(1);
   expect(Matrix2.ONE.m11).toBe(1);
  });

  it('EPSILON_MATRIX contains epsilon values', () => {
   expect(Matrix2.EPSILON_MATRIX.m00).toBeGreaterThan(0);
   expect(Matrix2.EPSILON_MATRIX.m00).toBeLessThan(0.001);
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

  it('lerpUnclamped allows extrapolation', () => {
   expect.hasAssertions();
   const a = Matrix2.IDENTITY;
   const b = Matrix2.fromScale(3);
   const result = Matrix2.lerpUnclamped(a, b, 2);
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
   const m = Matrix2.IDENTITY.clone();
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
});
