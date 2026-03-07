/**
 * @file test/core/coverage-boost.node.spec.ts
 * @description Additional tests to boost coverage for uncovered instance methods.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Matrix3 } from '../../src/core/matrix3';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

// DIGITS = 10 matches EPSILON = 1e-10 — the library's documented tolerance
const DIGITS = 10;

describe('Complex Instance Methods Coverage', () => {
 describe('conjugate', () => {
  it('instance conjugate negates imaginary part', () => {
   const c = new Complex(3, 4);
   c.conjugate();
   expect(c.real).toBe(3);
   expect(c.imag).toBe(-4);
  });

  it('conjugate returns this for chaining', () => {
   const c = new Complex(1, 2);
   const result = c.conjugate();
   expect(result).toBe(c);
  });
 });

 describe('normalize', () => {
  it('instance normalize creates unit complex', () => {
   const c = new Complex(3, 4);
   c.normalize();
   expect(c.magnitude()).toBeCloseTo(1, DIGITS);
  });

  it('normalize throws for zero complex', () => {
   const c = new Complex(0, 0);
   expect(() => c.normalize()).toThrow(RangeError);
  });
 });

 describe('isReal and isImaginary', () => {
  it('static isReal returns true for real numbers', () => {
   expect(Complex.isReal(new Complex(5, 0))).toBe(true);
   expect(Complex.isReal(new Complex(5, 0.001))).toBe(false);
  });

  it('static isImaginary returns true for imaginary numbers', () => {
   expect(Complex.isImaginary(new Complex(0, 5))).toBe(true);
   expect(Complex.isImaginary(new Complex(0.001, 5))).toBe(false);
  });
 });

 describe('isZero', () => {
  it('static isZero returns true only for exact zero', () => {
   expect(Complex.isZero(new Complex(0, 0))).toBe(true);
   expect(Complex.isZero(new Complex(1e-20, 0))).toBe(false);
  });
 });

 describe('isNearZero', () => {
  it('static isNearZero uses epsilon tolerance', () => {
   expect(Complex.isNearZero(new Complex(1e-15, 1e-15))).toBe(true);
   expect(Complex.isNearZero(new Complex(0.1, 0))).toBe(false);
  });
 });
});

describe('Matrix3 Instance Methods Coverage', () => {
 describe('isAffine', () => {
  it('identity is affine', () => {
   expect(Matrix3.IDENTITY.isAffine()).toBe(true);
  });

  it('non-affine matrix returns false', () => {
   const m = new Matrix3(1, 0, 0.5, 0, 1, 0, 0, 0, 1);
   expect(m.isAffine()).toBe(false);
  });
 });

 describe('isInvertible method', () => {
  it('identity is invertible', () => {
   expect(Matrix3.IDENTITY.isInvertible()).toBe(true);
  });

  it('zero matrix is not invertible', () => {
   expect(Matrix3.ZERO.isInvertible()).toBe(false);
  });
 });
});

describe('Transform2 Coverage', () => {
 describe('transformVector', () => {
  it('static transformVector applies scale and rotation only', () => {
   const t = Transform2.fromComponents(new Vector2(100, 100), Math.PI / 2, new Vector2(2, 2));
   const v = new Vector2(1, 0);
   const result = Transform2.transformVector(t, v);
   // Should be rotated and scaled, but NOT translated
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(2, DIGITS);
  });

  it('transformVector with out parameter', () => {
   const t = Transform2.fromComponents(new Vector2(0, 0), 0, new Vector2(3, 3));
   const out = new Vector2();
   Transform2.transformVector(t, new Vector2(1, 1), out);
   expect(out.x).toBe(3);
   expect(out.y).toBe(3);
  });
 });
});

describe('Additional Coverage Tests', () => {
 describe('Complex instance multiply', () => {
  it('instance multiply mutates this', () => {
   const c = new Complex(2, 3);
   c.multiply(new Complex(4, 5));
   // (2+3i)(4+5i) = 8 + 10i + 12i + 15i² = 8 + 22i - 15 = -7 + 22i
   expect(c.real).toBe(-7);
   expect(c.imag).toBe(22);
  });
 });

 describe('Complex instance divide', () => {
  it('instance divide mutates this', () => {
   const c = new Complex(4, 2);
   c.divide(new Complex(2, 0));
   expect(c.real).toBe(2);
   expect(c.imag).toBe(1);
  });
 });

 describe('Matrix3 row and column operations', () => {
  it('getRow returns correct row tuple', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const row = m.getRow(0);
   expect(row[0]).toBe(1);
   expect(row[1]).toBe(4);
  });

  it('setRow sets row values from tuple', () => {
   const m = new Matrix3();
   m.setRow(0, [5, 6, 0]);
   expect(m.m00).toBe(5);
   expect(m.m10).toBe(6);
  });
 });

 describe('Complex instance subtract and add', () => {
  it('instance subtract mutates this', () => {
   const c = new Complex(5, 3);
   c.subtract(new Complex(2, 1));
   expect(c.real).toBe(3);
   expect(c.imag).toBe(2);
  });

  it('instance add mutates this', () => {
   const c = new Complex(1, 2);
   c.add(new Complex(3, 4));
   expect(c.real).toBe(4);
   expect(c.imag).toBe(6);
  });
 });

 describe('Complex instance scale', () => {
  it('instance scale mutates this', () => {
   const c = new Complex(2, 3);
   c.scale(2);
   expect(c.real).toBe(4);
   expect(c.imag).toBe(6);
  });
 });

 describe('Complex instance divideSafe', () => {
  it('divideSafe divides normally', () => {
   const c = new Complex(4, 2);
   c.divideSafe(new Complex(2, 0));
   expect(c.real).toBe(2);
   expect(c.imag).toBe(1);
  });

  it('divideSafe handles near-zero denominator', () => {
   const c = new Complex(4, 2);
   c.divideSafe(new Complex(0, 0));
   expect(c.real).toBe(0);
   expect(c.imag).toBe(0);
  });
 });

 describe('Complex instance negate', () => {
  it('negate negates both components', () => {
   const c = new Complex(3, -4);
   c.negate();
   expect(c.real).toBe(-3);
   expect(c.imag).toBe(4);
  });
 });
});

describe('Coverage Boost - Edge Cases', () => {
 describe('Vector2.applyComplex edge case', () => {
  it('returns clone when complex is near-zero', () => {
   const v = new Vector2(3, 4);
   const nearZeroComplex = { real: 0, imag: 0 };
   const result = Vector2.applyComplex(v, nearZeroComplex);
   expect(result.x).toBe(3);
   expect(result.y).toBe(4);
  });
 });

 describe('Transform2 inverse operations', () => {
  it('inverseTransformPoint round-trips', () => {
   const t = Transform2.fromComponents(new Vector2(10, 20), Math.PI / 4, new Vector2(2, 2));
   const original = new Vector2(5, 5);
   const transformed = Transform2.transformPoint(t, original);
   const recovered = Transform2.inverseTransformPoint(t, transformed);
   expect(recovered.x).toBeCloseTo(original.x, DIGITS);
   expect(recovered.y).toBeCloseTo(original.y, DIGITS);
  });

  it('inverseTransformVector round-trips', () => {
   const t = Transform2.fromComponents(new Vector2(100, 100), Math.PI / 2, new Vector2(3, 3));
   const original = new Vector2(1, 0);
   const transformed = Transform2.transformVector(t, original);
   const recovered = Transform2.inverseTransformVector(t, transformed);
   expect(recovered.x).toBeCloseTo(original.x, DIGITS);
   expect(recovered.y).toBeCloseTo(original.y, DIGITS);
  });
 });

 describe('Matrix3 static subtract', () => {
  it('subtracts matrices element-wise', () => {
   const a = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const b = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   const result = Matrix3.subtract(a, b);
   expect(result.m00).toBe(4);
   expect(result.m22).toBe(-4);
  });
 });

 describe('Matrix3 instance rotateCS', () => {
  it('rotates matrix using precomputed cos/sin', () => {
   const m = Matrix3.IDENTITY.clone();
   const cos = Math.SQRT1_2;
   const sin = Math.SQRT1_2;
   m.rotateCS(cos, sin);
   expect(m.m00).toBeCloseTo(cos, DIGITS);
   expect(m.m01).toBeCloseTo(sin, DIGITS);
  });
 });

 describe('Transform2 inverse throw paths', () => {
  it('inverseTransformPoint throws on near-zero scale X', () => {
   const t = Transform2.fromComponents(new Vector2(0, 0), 0, new Vector2(0, 1));
   expect(() => Transform2.inverseTransformPoint(t, new Vector2(1, 1))).toThrow(RangeError);
  });

  it('inverseTransformPoint throws on near-zero scale Y', () => {
   const t = Transform2.fromComponents(new Vector2(0, 0), 0, new Vector2(1, 0));
   expect(() => Transform2.inverseTransformPoint(t, new Vector2(1, 1))).toThrow(RangeError);
  });

  it('inverseTransformVector throws on near-zero scale', () => {
   const t = Transform2.fromComponents(new Vector2(0, 0), 0, new Vector2(0, 0));
   expect(() => Transform2.inverseTransformVector(t, new Vector2(1, 1))).toThrow(RangeError);
  });
 });

 describe('Matrix3 more static methods', () => {
  it('Matrix3.subtractScalar subtracts scalar from all elements', () => {
   const m = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
   const result = Matrix3.subtractScalar(m, 2);
   expect(result.m00).toBe(3);
   expect(result.m22).toBe(3);
  });

  it('Matrix3.trunc truncates all elements', () => {
   const m = new Matrix3(1.9, 2.9, 3.9, 4.9, 5.9, 6.9, 7.9, 8.9, 9.9);
   const result = Matrix3.trunc(m);
   expect(result.m00).toBe(1);
   expect(result.m22).toBe(9);
  });

  it('Matrix3.abs takes absolute value of all elements', () => {
   const m = new Matrix3(-1, -2, -3, -4, -5, -6, -7, -8, -9);
   const result = Matrix3.abs(m);
   expect(result.m00).toBe(1);
   expect(result.m22).toBe(9);
  });
 });

 describe('Transform2 instance methods', () => {
  it('set with scalar scale', () => {
   const t = new Transform2();
   t.set(new Vector2(5, 10), Math.PI / 4, 3);
   expect(t.position.x).toBe(5);
   expect(t.position.y).toBe(10);
   expect(t.scale.x).toBe(3);
   expect(t.scale.y).toBe(3);
  });

  it('set with vector scale', () => {
   const t = new Transform2();
   t.set(new Vector2(1, 2), 0, new Vector2(4, 5));
   expect(t.scale.x).toBe(4);
   expect(t.scale.y).toBe(5);
  });
 });

 describe('Rotation2 coverage', () => {
  it('normalizeSafe handles zero-magnitude rotation', () => {
   const r = new Rotation2(0, 0);
   r.normalizeSafe();
   expect(r.cos).toBe(1);
   expect(r.sin).toBe(0);
  });

  it('setAngle updates cos/sin', () => {
   const r = new Rotation2();
   r.setAngle(Math.PI / 2);
   expect(r.cos).toBeCloseTo(0, DIGITS);
   expect(r.sin).toBeCloseTo(1, DIGITS);
  });

  it('fromValues creates rotation from cos/sin', () => {
   const r = Rotation2.fromValues(0, 1);
   expect(r.cos).toBe(0);
   expect(r.sin).toBe(1);
  });

  it('identity resets to default', () => {
   const r = Rotation2.fromAngle(Math.PI / 4);
   r.identity();
   expect(r.cos).toBe(1);
   expect(r.sin).toBe(0);
  });
 });

 describe('Complex coverage', () => {
  it('static pow computes power', () => {
   const result = Complex.pow(new Complex(2, 0), 3);
   expect(result.real).toBeCloseTo(8, DIGITS);
  });
 });

 describe('Vector2 coverage', () => {
  it('rotateAround rotates point around center', () => {
   const v = new Vector2(2, 0);
   const center = new Vector2(1, 0);
   const result = Vector2.rotateAround(v, center, Math.PI);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });

  it('perpendicular creates orthogonal vector', () => {
   const v = new Vector2(1, 0);
   const perp = Vector2.perpendicular(v);
   expect(perp.x).toBeCloseTo(0, DIGITS);
   expect(Math.abs(perp.y)).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Matrix3 additional coverage', () => {
  it('instance negate negates all elements', () => {
   const m = Matrix3.IDENTITY.clone();
   m.negate();
   expect(m.m00).toBe(-1);
   expect(m.m11).toBe(-1);
  });

  it('instance transpose swaps elements', () => {
   const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
   m.transpose();
   expect(m.m01).toBe(4);
   expect(m.m10).toBe(2);
  });

  it('instance scaleBy modifies matrix', () => {
   const m = Matrix3.IDENTITY.clone();
   m.scaleBy({ x: 2, y: 3 });
   expect(m.m00).toBe(2);
   expect(m.m11).toBe(3);
  });
 });
});
