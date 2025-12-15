/**
 * @file test/core/coverage-boost.node.spec.ts
 * @description Additional tests to boost coverage for uncovered instance methods.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Matrix3 } from '../../src/core/matrix3';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

const DIGITS = 8;

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
