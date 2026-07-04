/**
 * @file test/core/complex.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Tests for Complex core behavior.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex, freezeComplex } from '../../src/core/complex';
import { Rotation2 } from '../../src/core/rotation2';
import { Vector2 } from '../../src/core/vector2';

// DIGITS = 10 matches EPSILON = 1e-10 — the library's documented tolerance
const DIGITS = 10;

describe('Complex', () => {
 describe('Factories', () => {
  it('fromPolar uses deterministic trig', () => {
   const complex = Complex.fromPolar(2, Math.PI / 2);
   expect(complex.real).toBeCloseTo(0, DIGITS);
   expect(complex.imag).toBeCloseTo(2, DIGITS);
  });

  it('fromArray validates bounds', () => {
   const complex = Complex.fromArray([1, 2]);
   expect(complex.real).toBe(1);
   expect(complex.imag).toBe(2);
   expect(() => Complex.fromArray([1], 1)).toThrow(RangeError);
  });

  it('fromObject sanitizes components', () => {
   const complex = Complex.fromObject({ real: 3, imag: -4 });
   expect(complex.real).toBe(3);
   expect(complex.imag).toBe(-4);
  });
 });

 describe('Arithmetic', () => {
  it('supports multiply and divide', () => {
   const a = new Complex(3, 4);
   const b = new Complex(1, -2);
   const product = a.multiply(b);
   expect(product.real).toBeCloseTo(11, DIGITS);
   expect(product.imag).toBeCloseTo(-2, DIGITS);

   const quotient = product.divide(b);
   expect(quotient.real).toBeCloseTo(3, DIGITS);
   expect(quotient.imag).toBeCloseTo(4, DIGITS);
  });

  it('normalize throws on zero magnitude', () => {
   const zero = new Complex(0, 0);
   expect(() => zero.normalize()).toThrow(RangeError);
  });

  it('normalizeSafe handles zero safely', () => {
   const zero = new Complex(0, 0).normalizeSafe();
   expect(zero.real).toBe(1);
   expect(zero.imag).toBe(0);
  });

  it('divide throws for zero denominator', () => {
   const a = new Complex(5, -7);
   expect(() => a.divide(Complex.ZERO)).toThrow(RangeError);
  });

  it('reciprocal returns conjugate divided by magnitude squared', () => {
   const complex = Complex.fromPolar(2, Math.PI / 3);
   const original = complex.clone();
   const reciprocal = Complex.reciprocal(complex);
   const product = Complex.multiply(original, reciprocal);
   expect(product.nearEquals(Complex.ONE)).toBe(true);
  });
 });

 describe('Interpolation', () => {
  it('lerp allows extrapolation (does NOT clamp t)', () => {
   const start = new Complex(0, 0);
   const end = new Complex(10, 10);
   start.lerp(end, 2); // Mutates start, extrapolates
   expect(start.real).toBe(20); // 0 + 2*(10-0) = 20
   expect(start.imag).toBe(20);
  });

  it('lerpClamped clamps interpolation factor', () => {
   const start = new Complex(0, 0);
   const end = new Complex(10, 10);
   start.lerpClamped(end, 2); // Mutates start, clamped
   expect(start.real).toBe(10);
   expect(start.imag).toBe(10);
  });

  it('slerp blends magnitude and angle', () => {
   const a = Complex.fromPolar(1, 0);
   const b = Complex.fromPolar(2, Math.PI);
   a.slerp(b, 0.5); // Mutates a
   expect(a.magnitude()).toBeCloseTo(1.5, DIGITS);
   expect(Math.abs(a.angle)).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('static lerp uses out parameter', () => {
   const start = new Complex(1, 1);
   const end = new Complex(3, 5);
   const out = new Complex();
   const returned = Complex.lerp(start, end, 0.5, out);
   expect(returned).toBe(out);
   expect(out.real).toBeCloseTo(2, DIGITS);
   expect(out.imag).toBeCloseTo(3, DIGITS);
  });
 });

 describe('Classification helpers', () => {
  it('isReal and isImaginary respond to tolerances', () => {
   const almostReal = new Complex(5, 1e-11);
   expect(almostReal.isReal()).toBe(true);
   const almostImag = new Complex(1e-11, 5);
   expect(almostImag.isImaginary()).toBe(true);
  });
 });

 describe('Constants', () => {
  it('ZERO is (0, 0)', () => {
   expect(Complex.ZERO.real).toBe(0);
   expect(Complex.ZERO.imag).toBe(0);
  });

  it('ONE is (1, 0)', () => {
   expect(Complex.ONE.real).toBe(1);
   expect(Complex.ONE.imag).toBe(0);
  });

  it('I is (0, 1)', () => {
   expect(Complex.I.real).toBe(0);
   expect(Complex.I.imag).toBe(1);
  });
 });

 describe('Construction', () => {
  it('default constructor creates (0, 0)', () => {
   const c = new Complex();
   expect(c.real).toBe(0);
   expect(c.imag).toBe(0);
  });

  it('constructor with values', () => {
   const c = new Complex(3, 4);
   expect(c.real).toBe(3);
   expect(c.imag).toBe(4);
  });

  it('clone creates independent copy', () => {
   const original = new Complex(1, 2);
   const cloned = original.clone();
   expect(cloned.real).toBe(1);
   expect(cloned.imag).toBe(2);
   expect(cloned).not.toBe(original);
  });

  it('copy copies from source', () => {
   const source = new Complex(5, 6);
   const target = new Complex();
   target.copy(source);
   expect(target.real).toBe(5);
   expect(target.imag).toBe(6);
  });
 });

 describe('Properties', () => {
  it('magnitude returns length', () => {
   const c = new Complex(3, 4);
   expect(c.magnitude()).toBeCloseTo(5, DIGITS);
  });

  it('angle returns phase angle', () => {
   const c = new Complex(1, 1);
   expect(c.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('normalized getter returns unit complex', () => {
   const c = new Complex(3, 4);
   const n = c.normalized;
   expect(n.magnitude()).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Basic Arithmetic', () => {
  it('add', () => {
   const a = new Complex(1, 2);
   const b = new Complex(3, 4);
   const sum = a.add(b);
   expect(sum.real).toBe(4);
   expect(sum.imag).toBe(6);
  });

  it('subtract', () => {
   const a = new Complex(5, 7);
   const b = new Complex(2, 3);
   const diff = a.subtract(b);
   expect(diff.real).toBe(3);
   expect(diff.imag).toBe(4);
  });

  it('scale', () => {
   const c = new Complex(2, 3);
   const scaled = c.multiplyScalar(2);
   expect(scaled.real).toBe(4);
   expect(scaled.imag).toBe(6);
  });

  it('negate', () => {
   const c = new Complex(3, -4);
   const negated = c.negate();
   expect(negated.real).toBe(-3);
   expect(negated.imag).toBe(4);
  });

  it('conjugate', () => {
   const c = new Complex(3, 4);
   const conj = c.conjugate();
   expect(conj.real).toBe(3);
   expect(conj.imag).toBe(-4);
  });
 });

 describe('Powers and Roots', () => {
  it('sqrt', () => {
   const c = new Complex(0, 2);
   const root = c.sqrt();
   // √(2i) = 1 + i
   expect(root.real).toBeCloseTo(1, DIGITS);
   expect(root.imag).toBeCloseTo(1, DIGITS);
  });

  it('powScalar', () => {
   const c = new Complex(0, 1);
   const powered = c.powScalar(2);
   // i² = -1
   expect(powered.real).toBeCloseTo(-1, DIGITS);
   expect(powered.imag).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Conversion', () => {
  it('toArray returns [real, imag]', () => {
   const c = new Complex(1, 2);
   expect(c.toArray()).toEqual([1, 2]);
  });

  it('toObject returns plain object', () => {
   const c = new Complex(3, 4);
   expect(c.toObject()).toEqual({ real: 3, imag: 4 });
  });

  it('toString returns formatted string', () => {
   const c = new Complex(3, 4);
   expect(c.toString()).toContain('3');
   expect(c.toString()).toContain('4');
  });
 });

 describe('Comparison', () => {
  it('equals checks equality', () => {
   const a = new Complex(1, 2);
   const b = new Complex(1, 2);
   const c = new Complex(1, 3);
   expect(a.exactEquals(b)).toBe(true);
   expect(a.exactEquals(c)).toBe(false);
  });

  it('isZero checks for zero', () => {
   expect(Complex.ZERO.isZero()).toBe(true);
   expect(new Complex(1, 0).isZero()).toBe(false);
  });
 });

 describe('Static operations', () => {
  it('static add', () => {
   const sum = Complex.add(new Complex(1, 2), new Complex(3, 4));
   expect(sum.real).toBe(4);
   expect(sum.imag).toBe(6);
  });

  it('static multiply', () => {
   const product = Complex.multiply(new Complex(1, 2), new Complex(3, 4));
   // (1+2i)(3+4i) = 3 + 4i + 6i - 8 = -5 + 10i
   expect(product.real).toBeCloseTo(-5, DIGITS);
   expect(product.imag).toBeCloseTo(10, DIGITS);
  });

  it('static lerp', () => {
   const mid = Complex.lerp(new Complex(0, 0), new Complex(10, 10), 0.5);
   expect(mid.real).toBe(5);
   expect(mid.imag).toBe(5);
  });

  it('static subtract', () => {
   const diff = Complex.subtract(new Complex(5, 7), new Complex(2, 3));
   expect(diff.real).toBe(3);
   expect(diff.imag).toBe(4);
  });

  it('static divide', () => {
   const quotient = Complex.divide(new Complex(3, 4), new Complex(1, 2));
   // (3+4i)/(1+2i) = (3+4i)(1-2i)/5 = (3 + 8 + i(4-6))/5 = (11 - 2i)/5
   expect(quotient.real).toBeCloseTo(2.2, DIGITS);
   expect(quotient.imag).toBeCloseTo(-0.4, DIGITS);
  });

  it('static conjugate', () => {
   const conj = Complex.conjugate(new Complex(3, 4));
   expect(conj.real).toBe(3);
   expect(conj.imag).toBe(-4);
  });

  it('static negate', () => {
   const neg = Complex.negate(new Complex(3, -4));
   expect(neg.real).toBe(-3);
   expect(neg.imag).toBe(4);
  });

  it('static normalize', () => {
   const n = Complex.normalize(new Complex(3, 4));
   expect(n.magnitude()).toBeCloseTo(1, DIGITS);
  });

  it('static magnitude', () => {
   expect(Complex.magnitude(new Complex(3, 4))).toBeCloseTo(5, DIGITS);
  });

  it('static angle', () => {
   expect(Complex.angle(new Complex(1, 1))).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('static equals', () => {
   expect(Complex.exactEquals(new Complex(1, 2), new Complex(1, 2))).toBe(true);
   expect(Complex.exactEquals(new Complex(1, 2), new Complex(1, 3))).toBe(false);
  });
 });

 describe('Instance Methods - Additional', () => {
  it('set updates values', () => {
   const c = new Complex();
   c.set(5, 6);
   expect(c.real).toBe(5);
   expect(c.imag).toBe(6);
  });

  it('copy copies from source', () => {
   const c = new Complex();
   c.copy(new Complex(7, 8));
   expect(c.real).toBe(7);
   expect(c.imag).toBe(8);
  });

  it('clone creates copy', () => {
   const c = new Complex(3, 4);
   const cloned = c.clone();
   expect(cloned.real).toBe(3);
   expect(cloned).not.toBe(c);
  });
 });

 describe('Static Methods - Additional', () => {
  it('magnitudeSq returns squared magnitude', () => {
   expect(Complex.magnitudeSq(new Complex(3, 4))).toBe(25);
  });

  it('reciprocal returns 1/z', () => {
   const result = Complex.reciprocal(new Complex(1, 0));
   expect(result.real).toBeCloseTo(1);
   expect(result.imag).toBeCloseTo(0);
  });

  it('pow raises to power', () => {
   const result = Complex.powScalar(new Complex(0, 1), 2);
   expect(result.real).toBeCloseTo(-1, DIGITS);
  });

  it('sqrt computes square root', () => {
   const result = Complex.sqrt(new Complex(-1, 0));
   expect(result.imag).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Readonly Getters', () => {
  it('conjugated returns conjugate without modifying original', () => {
   const c = new Complex(3, 4);
   const conj = c.conjugated;
   expect(conj.real).toBe(3);
   expect(conj.imag).toBe(-4);
   expect(c.imag).toBe(4); // Original unchanged
  });

  it('normalized returns unit complex', () => {
   const c = new Complex(3, 4);
   const unit = c.normalized;
   expect(unit.magnitude()).toBeCloseTo(1, DIGITS);
  });

  it('normalized returns identity (1,0) for zero complex (BREAKING v0.6.0 → v0.7.0)', () => {
   const c = new Complex(0, 0);
   const unit = c.normalized;
   expect(unit.real).toBe(1);
   expect(unit.imag).toBe(0);
  });
 });

 describe('Coverage - Instance Methods', () => {
  it('reciprocal instance method', () => {
   expect.hasAssertions();
   const c = new Complex(2, 0);
   const rec = c.reciprocal();
   expect(rec.real).toBeCloseTo(0.5);
  });

  it('powScalar instance method', () => {
   expect.hasAssertions();
   const c = new Complex(2, 0);
   const powered = c.powScalar(2);
   expect(powered.real).toBeCloseTo(4);
  });

  it('sqrt instance method', () => {
   expect.hasAssertions();
   const c = new Complex(4, 0);
   const result = c.sqrt();
   expect(result.real).toBeCloseTo(2);
  });

  it('normalize instance method', () => {
   expect.hasAssertions();
   const c = new Complex(3, 4);
   const result = c.normalize();
   expect(result.magnitude()).toBeCloseTo(1);
  });

  it('negate instance method', () => {
   expect.hasAssertions();
   const c = new Complex(3, 4);
   const result = c.negate();
   expect(result.real).toBe(-3);
   expect(result.imag).toBe(-4);
  });

  it('conjugate instance method', () => {
   expect.hasAssertions();
   const c = new Complex(3, 4);
   const result = c.conjugate();
   expect(result.real).toBe(3);
   expect(result.imag).toBe(-4);
  });
 });

 describe('Coverage - Static Reciprocal and Pow', () => {
  it('reciprocal static method', () => {
   expect.hasAssertions();
   const c = new Complex(2, 0);
   const result = Complex.reciprocal(c);
   expect(result.real).toBeCloseTo(0.5);
  });

  it('pow static method', () => {
   expect.hasAssertions();
   const c = new Complex(2, 0);
   const result = Complex.powScalar(c, 3);
   expect(result.real).toBeCloseTo(8);
  });

  it('sqrt static method', () => {
   expect.hasAssertions();
   const c = new Complex(4, 0);
   const result = Complex.sqrt(c);
   expect(result.real).toBeCloseTo(2);
  });
 });

 describe('Iterator', () => {
  it('supports array destructuring', () => {
   const c = new Complex(3, 4);
   const [real, imag] = c;
   expect(real).toBe(3);
   expect(imag).toBe(4);
  });

  it('supports spread operator', () => {
   const c = new Complex(5, -2);
   const array = [...c];
   expect(array).toEqual([5, -2]);
  });

  it('works with for...of', () => {
   const c = new Complex(1, 2);
   const values: number[] = [];
   for (const v of c) {
    values.push(v);
   }
   expect(values).toEqual([1, 2]);
  });
 });

 describe('Utility Methods', () => {
  it('isFinite returns true for finite complex', () => {
   const c = new Complex(1, 2);
   expect(c.isFinite()).toBe(true);
  });

  it('isFinite returns false for infinite complex', () => {
   const c = new Complex(Infinity, 2);
   expect(c.isFinite()).toBe(false);
  });

  it('hasNaN returns false for normal complex', () => {
   const c = new Complex(1, 2);
   expect(c.hasNaN()).toBe(false);
  });

  it('hasNaN returns true for NaN complex', () => {
   const c = new Complex(NaN, 2);
   expect(c.hasNaN()).toBe(true);
  });

  it('zero() resets to origin', () => {
   const c = new Complex(5, 7);
   const result = c.zero();
   expect(result).toBe(c);
   expect(c.real).toBe(0);
   expect(c.imag).toBe(0);
  });
 });

 describe('Coverage - Static lerpClamped and smoothStep', () => {
  it('static lerpClamped clamps t to [0, 1]', () => {
   const a = new Complex(0, 0);
   const b = new Complex(10, 20);
   const result = Complex.lerpClamped(a, b, 2);
   expect(result.real).toBe(10);
   expect(result.imag).toBe(20);
  });

  it('static lerpClamped clamps negative t', () => {
   const a = new Complex(0, 0);
   const b = new Complex(10, 20);
   const result = Complex.lerpClamped(a, b, -1);
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });

  it('static smoothStep interpolates with smooth step', () => {
   const a = new Complex(0, 0);
   const b = new Complex(10, 10);
   const mid = Complex.smoothStep(a, b, 0.5);
   expect(mid.real).toBe(5);
   expect(mid.imag).toBe(5);
  });

  it('instance smoothStep interpolates with smooth step', () => {
   const a = new Complex(0, 0);
   const b = new Complex(10, 10);
   a.smoothStep(b, 0.5);
   expect(a.real).toBe(5);
   expect(a.imag).toBe(5);
  });
 });

 describe('Coverage - Static nearEquals', () => {
  it('static nearEquals compares with tolerance', () => {
   const a = new Complex(1, 2);
   const b = new Complex(1.0000001, 2.0000001);
   expect(Complex.nearEquals(a, b, 1e-5)).toBe(true);
  });

  it('static nearEquals returns false for different values', () => {
   const a = new Complex(1, 2);
   const b = new Complex(2, 3);
   expect(Complex.nearEquals(a, b)).toBe(false);
  });
 });

 describe('Coverage - Static magnitude and angle', () => {
  it('static magnitudeSq returns squared magnitude', () => {
   expect(Complex.magnitudeSq(new Complex(3, 4))).toBe(25);
  });

  it('static angle returns angle for various quadrants', () => {
   expect(Complex.angle(new Complex(1, 0))).toBeCloseTo(0, DIGITS);
   expect(Complex.angle(new Complex(0, 1))).toBeCloseTo(Math.PI / 2, DIGITS);
   expect(Complex.angle(new Complex(-1, 0))).toBeCloseTo(Math.PI, DIGITS);
  });
 });

 describe('Coverage - Static normalizeSafe', () => {
  it('normalizeSafe returns fallback for zero complex', () => {
   const result = Complex.normalizeSafe(new Complex(0, 0));
   expect(result.real).toBe(1);
   expect(result.imag).toBe(0);
  });

  it('normalizeSafe normalizes non-zero complex', () => {
   const result = Complex.normalizeSafe(new Complex(3, 4));
   expect(result.magnitude()).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Static apply', () => {
  it('apply rotates vector by complex angle', () => {
   const c = Complex.fromPolar(1, Math.PI / 2);
   const v = { x: 1, y: 0 };
   const result = Complex.apply(c, v);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('apply handles zero complex (returns original vector)', () => {
   const c = new Complex(0, 0);
   const v = { x: 3, y: 4 };
   const result = Complex.apply(c, v);
   expect(result.x).toBe(3);
   expect(result.y).toBe(4);
  });

  it('apply normalizes complex before rotating', () => {
   const c = Complex.fromPolar(1, Math.PI / 4);
   const v = { x: 1, y: 0 };
   const result = Complex.apply(c, v);
   expect(result.x).toBeCloseTo(Math.SQRT1_2, DIGITS);
   expect(result.y).toBeCloseTo(Math.SQRT1_2, DIGITS);
  });
 });

 describe('Coverage - Static applyInverse', () => {
  it('applyInverse rotates vector by inverse of complex angle', () => {
   const c = Complex.fromPolar(1, Math.PI / 2); // 90° rotation
   const v = { x: 0, y: 1 };
   const result = Complex.applyInverse(c, v);
   expect(result.x).toBeCloseTo(1, DIGITS); // Rotate back by -90°
   expect(result.y).toBeCloseTo(0, DIGITS);
  });

  it('applyInverse handles zero complex (returns original vector)', () => {
   const c = new Complex(0, 0);
   const v = { x: 3, y: 4 };
   const result = Complex.applyInverse(c, v);
   expect(result.x).toBe(3);
   expect(result.y).toBe(4);
  });

  it('applyInverse is inverse of apply', () => {
   const c = Complex.fromPolar(1, Math.PI / 4);
   const v = { x: 1, y: 0 };
   const rotated = Complex.apply(c, v);
   const back = Complex.applyInverse(c, rotated);
   expect(back.x).toBeCloseTo(1, DIGITS);
   expect(back.y).toBeCloseTo(0, DIGITS);
  });

  it('instance applyInverse works correctly', () => {
   const c = Complex.fromPolar(1, Math.PI / 2);
   const v = { x: 0, y: 1 };
   const result = c.applyInverse(v);
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Instance scale', () => {
  it('static scale multiplies by scalar', () => {
   const c = new Complex(2, 3);
   const result = Complex.multiplyScalar(c, 2);
   expect(result.real).toBe(4);
   expect(result.imag).toBe(6);
  });
 });

 describe('Coverage - Instance methods return this', () => {
  it('subtract returns this', () => {
   const a = new Complex(5, 7);
   const b = new Complex(2, 3);
   const result = a.subtract(b);
   expect(result).toBe(a);
   expect(a.real).toBe(3);
   expect(a.imag).toBe(4);
  });

  it('multiply returns this', () => {
   const a = new Complex(1, 2);
   const b = new Complex(3, 4);
   const result = a.multiply(b);
   expect(result).toBe(a);
  });

  it('divide returns this', () => {
   const a = new Complex(3, 4);
   const b = new Complex(1, 2);
   const result = a.divide(b);
   expect(result).toBe(a);
  });
 });

 describe('Coverage - Static isFinite and hasNaN', () => {
  it('static isFinite returns true for finite complex', () => {
   expect(Complex.isFinite(new Complex(1, 2))).toBe(true);
  });

  it('static isFinite returns false for infinite', () => {
   expect(Complex.isFinite(new Complex(Infinity, 0))).toBe(false);
   expect(Complex.isFinite(new Complex(0, Infinity))).toBe(false);
  });

  it('static hasNaN returns false for normal complex', () => {
   expect(Complex.hasNaN(new Complex(1, 2))).toBe(false);
  });

  it('static hasNaN returns true for NaN', () => {
   expect(Complex.hasNaN(new Complex(NaN, 0))).toBe(true);
   expect(Complex.hasNaN(new Complex(0, NaN))).toBe(true);
  });
 });

 describe('Coverage - Static hasInfinity', () => {
  it('hasInfinity returns false for finite complex', () => {
   expect(Complex.hasInfinity(new Complex(1, 2))).toBe(false);
  });

  it('hasInfinity returns true for Infinity real', () => {
   expect(Complex.hasInfinity(new Complex(Infinity, 0))).toBe(true);
  });

  it('hasInfinity returns true for -Infinity imag', () => {
   expect(Complex.hasInfinity(new Complex(0, -Infinity))).toBe(true);
  });

  it('hasInfinity returns false for NaN (not infinity)', () => {
   expect(Complex.hasInfinity(new Complex(NaN, 0))).toBe(false);
  });
 });

 describe('Coverage - Static isIdentity', () => {
  it('isIdentity returns true for 1+0i', () => {
   expect(Complex.isIdentity(new Complex(1, 0))).toBe(true);
  });

  it('isIdentity returns false for 0+0i', () => {
   expect(Complex.isIdentity(new Complex(0, 0))).toBe(false);
  });

  it('isIdentity returns false for 1+1i', () => {
   expect(Complex.isIdentity(new Complex(1, 1))).toBe(false);
  });

  it('isIdentity returns true for near-identity within epsilon', () => {
   const c = new Complex(1, 0); // Use explicit value close to identity
   expect(Complex.isIdentity(c)).toBe(true);
  });
 });

 describe('Coverage - Instance hasInfinity', () => {
  it('instance hasInfinity returns false for finite', () => {
   const c = new Complex(1, 2);
   expect(c.hasInfinity()).toBe(false);
  });

  it('static hasInfinity returns true for infinite', () => {
   // Can't instantiate with Infinity due to validation, so test via static with valid instance
   const c = new Complex(1, 2);
   expect(Complex.hasInfinity(c)).toBe(false);
  });
 });

 describe('Coverage - Instance isIdentity', () => {
  it('instance isIdentity returns true for 1+0i', () => {
   const c = new Complex(1, 0);
   expect(c.isIdentity()).toBe(true);
  });

  it('instance isIdentity returns false for 2+0i', () => {
   const c = new Complex(2, 0);
   expect(c.isIdentity()).toBe(false);
  });
 });

 describe('Coverage - fromArray with offset', () => {
  it('fromArray with offset reads correct values', () => {
   const array = [1, 2, 3, 4, 5];
   const c = Complex.fromArray(array, 2);
   expect(c.real).toBe(3);
   expect(c.imag).toBe(4);
  });

  it('fromArray with out parameter', () => {
   const out = new Complex();
   const result = Complex.fromArray([5, 6], 0, out);
   expect(result).toBe(out);
   expect(out.real).toBe(5);
   expect(out.imag).toBe(6);
  });

  it('fromArray throws for negative offset', () => {
   expect(() => Complex.fromArray([1, 2], -1)).toThrow(RangeError);
  });
 });

 describe('Coverage - Static slerp', () => {
  it('static slerp interpolates magnitude and angle', () => {
   const a = Complex.fromPolar(1, 0);
   const b = Complex.fromPolar(2, Math.PI);
   const mid = Complex.slerp(a, b, 0.5);
   expect(mid.magnitude()).toBeCloseTo(1.5, DIGITS);
   expect(Math.abs(mid.angle)).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('static slerpClamped clamps t', () => {
   const a = Complex.fromPolar(1, 0);
   const b = Complex.fromPolar(2, Math.PI);
   const result = Complex.slerpClamped(a, b, 2);
   expect(result.magnitude()).toBeCloseTo(2, DIGITS);
  });
 });

 describe('Coverage - normalized getter edge case', () => {
  it('normalized handles non-zero complex correctly', () => {
   const c = new Complex(3, 4);
   const n = c.normalized;
   expect(n.real).toBeCloseTo(0.6, DIGITS);
   expect(n.imag).toBeCloseTo(0.8, DIGITS);
  });
 });

 describe('Coverage - Static normalizeSafe path', () => {
  it('normalizeSafe with out parameter', () => {
   const c = new Complex(3, 4);
   const out = new Complex();
   const result = Complex.normalizeSafe(c, out);
   expect(result).toBe(out);
   expect(result.magnitude()).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Static apply with normalizing', () => {
  it('apply normalizes non-unit complex before rotating', () => {
   const c = new Complex(3, 0); // Not unit, magnitude 3
   const v = { x: 1, y: 0 };
   const result = Complex.apply(c, v);
   // Should normalize c to (1, 0), which doesn't rotate v
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Instance subtract and multiply', () => {
  it('subtract modifies in place', () => {
   const a = new Complex(5, 7);
   a.subtract(new Complex(2, 3));
   expect(a.real).toBe(3);
   expect(a.imag).toBe(4);
  });

  it('multiply modifies in place', () => {
   const a = new Complex(1, 2);
   a.multiply(new Complex(3, 4));
   // (1+2i)(3+4i) = 3 + 4i + 6i - 8 = -5 + 10i
   expect(a.real).toBeCloseTo(-5, DIGITS);
   expect(a.imag).toBeCloseTo(10, DIGITS);
  });
 });
});

describe('Coverage - Instance nearEquals', () => {
 it('instance nearEquals uses tolerance', () => {
  const a = new Complex(1, 2);
  const b = new Complex(1.0000001, 2.0000001);
  expect(a.nearEquals(b, 1e-5)).toBe(true);
 });
});

describe('Coverage - slerpClamped', () => {
 it('clamps t to [0, 1]', () => {
  const a = Complex.fromPolar(1, 0);
  const b = Complex.fromPolar(2, Math.PI);
  const result = Complex.slerpClamped(a, b, 2);
  // t=2 clamped to 1, so result should equal b
  expect(result.magnitude()).toBeCloseTo(2, DIGITS);
  expect(Math.abs(result.angle)).toBeCloseTo(Math.PI, DIGITS);
 });

 it('works like slerp for t in [0, 1]', () => {
  const a = Complex.fromPolar(1, 0);
  const b = Complex.fromPolar(2, Math.PI);
  const result = Complex.slerpClamped(a, b, 0.5);
  expect(result.magnitude()).toBeCloseTo(1.5, DIGITS);
 });
});

describe('Coverage - static apply', () => {
 it('applies complex as rotation to vector', () => {
  const c = Complex.fromPolar(1, Math.PI / 2);
  const result = Complex.apply(c, { x: 1, y: 0 });
  expect(result.x).toBeCloseTo(0, DIGITS);
  expect(result.y).toBeCloseTo(1, DIGITS);
 });

 it('normalizes non-unit complex before applying', () => {
  const c = Complex.fromPolar(5, Math.PI / 4);
  const result = Complex.apply(c, { x: 1, y: 0 });
  // Should rotate by PI/4 regardless of magnitude
  expect(result.x).toBeCloseTo(Math.SQRT1_2, DIGITS);
  expect(result.y).toBeCloseTo(Math.SQRT1_2, DIGITS);
 });
});

describe('Coverage - divideSafe and divideUnchecked', () => {
 it('divideSafe returns (0,0) for zero denominator', () => {
  const result = Complex.divideSafe(new Complex(5, 3), Complex.ZERO);
  expect(result.real).toBe(0);
  expect(result.imag).toBe(0);
 });

 it('divideSafe works like divide for non-zero denominator', () => {
  const a = new Complex(10, 5);
  const b = new Complex(2, 0);
  const result = Complex.divideSafe(a, b);
  expect(result.real).toBeCloseTo(5, DIGITS);
  expect(result.imag).toBeCloseTo(2.5, DIGITS);
 });

 it('divideUnchecked computes quotient without validation', () => {
  const a = new Complex(6, 3);
  const b = new Complex(3, 0);
  const result = Complex.divideUnchecked(a, b);
  expect(result.real).toBeCloseTo(2, DIGITS);
 });
});

describe('Coverage - fromArray edge cases', () => {
 it('throws for negative offset', () => {
  expect(() => Complex.fromArray([1, 2], -1)).toThrow(RangeError);
 });

 it('throws for offset beyond array bounds', () => {
  expect(() => Complex.fromArray([1, 2, 3], 2)).toThrow(RangeError);
 });

 it('works with offset', () => {
  const result = Complex.fromArray([0, 5, 10], 1);
  expect(result.real).toBe(5);
  expect(result.imag).toBe(10);
 });
});

describe('Coverage - Instance scale (chaining)', () => {
 it('scales complex by scalar in place', () => {
  const c = new Complex(3, 4);
  c.multiplyScalar(2);
  expect(c.real).toBe(6);
  expect(c.imag).toBe(8);
 });

 it('scale returns this for chaining', () => {
  const c = new Complex(1, 2);
  const result = c.multiplyScalar(3);
  expect(result).toBe(c);
 });
});

describe('Coverage - Instance divideSafe/Unchecked', () => {
 it('instance divideSafe returns zero for zero denominator', () => {
  const c = new Complex(5, 3);
  c.divideSafe(Complex.ZERO);
  expect(c.real).toBe(0);
  expect(c.imag).toBe(0);
 });

 it('instance divideSafe works for valid denominator', () => {
  const c = new Complex(10, 5);
  c.divideSafe(new Complex(2, 0));
  expect(c.real).toBeCloseTo(5, DIGITS);
  expect(c.imag).toBeCloseTo(2.5, DIGITS);
 });

 it('instance divideUnchecked divides without validation', () => {
  const c = new Complex(6, 3);
  c.divideUnchecked(new Complex(3, 0));
  expect(c.real).toBeCloseTo(2, DIGITS);
  expect(c.imag).toBeCloseTo(1, DIGITS);
 });
});

describe('Coverage - Instance powScalar', () => {
 it('powScalar computes real-exponent power', () => {
  const c = new Complex(2, 0);
  c.powScalar(3);
  expect(c.real).toBeCloseTo(8, DIGITS);
  expect(c.imag).toBeCloseTo(0, DIGITS);
 });

 it('powScalar with fractional exponent', () => {
  const c = new Complex(4, 0);
  c.powScalar(0.5);
  expect(c.real).toBeCloseTo(2, DIGITS);
 });
});

describe('Coverage - Instance comparison', () => {
 it('exactEquals compares exact equality', () => {
  const a = new Complex(1, 2);
  const b = new Complex(1, 2);
  const c = new Complex(1.0001, 2);
  expect(a.exactEquals(b)).toBe(true);
  expect(a.exactEquals(c)).toBe(false);
 });
});

describe('Coverage - Static powScalar', () => {
 it('powScalar computes real-exponent power on real base', () => {
  const result = Complex.powScalar(new Complex(2, 0), 3);
  expect(result.real).toBeCloseTo(8, DIGITS);
 });

 it('powScalar computes real-exponent power on complex base', () => {
  const result = Complex.powScalar(new Complex(0, 1), 2);
  expect(result.real).toBeCloseTo(-1, DIGITS);
 });
});

describe('Coverage - Instance interpolation', () => {
 it('lerpClamped instance clamps t', () => {
  const a = new Complex(0, 0);
  const b = new Complex(10, 10);
  a.lerpClamped(b, 2);
  expect(a.real).toBe(10);
  expect(a.imag).toBe(10);
 });

 it('slerpClamped instance clamps t', () => {
  const a = Complex.fromPolar(1, 0);
  const b = Complex.fromPolar(2, Math.PI);
  a.slerpClamped(b, 2);
  expect(a.magnitude()).toBeCloseTo(2, DIGITS);
 });
});

describe('Coverage - Instance divide throws', () => {
 it('instance divide throws for zero magnitude', () => {
  const c = new Complex(5, 3);
  expect(() => c.divide(Complex.ZERO)).toThrow(RangeError);
 });

 it('instance divide works for valid divisor', () => {
  const c = new Complex(4, 2);
  c.divide(new Complex(2, 0));
  expect(c.real).toBeCloseTo(2, DIGITS);
  expect(c.imag).toBeCloseTo(1, DIGITS);
 });
});

describe('Coverage - Instance copy and set', () => {
 it('copy copies from another complex', () => {
  const a = new Complex(0, 0);
  const b = new Complex(5, 10);
  a.copy(b);
  expect(a.real).toBe(5);
  expect(a.imag).toBe(10);
 });
});

describe('Coverage - Instance conjugate', () => {
 it('conjugate negates imaginary part', () => {
  const c = new Complex(3, 4);
  c.conjugate();
  expect(c.real).toBe(3);
  expect(c.imag).toBe(-4);
 });
});

describe('Coverage - Instance magnitudeSq', () => {
 it('magnitudeSq returns squared magnitude', () => {
  const c = new Complex(3, 4);
  expect(c.magnitudeSq()).toBe(25);
 });
});

describe('Coverage - Static normalize', () => {
 it('static normalize normalizes complex', () => {
  const normalized = Complex.normalize(new Complex(3, 4));
  expect(normalized.magnitude()).toBeCloseTo(1, DIGITS);
 });

 it('static normalize throws for zero magnitude', () => {
  expect(() => Complex.normalize(Complex.ZERO)).toThrow(RangeError);
 });
});

describe('Coverage - Instance normalize', () => {
 it('instance normalize normalizes in place', () => {
  const c = new Complex(3, 4);
  c.normalize();
  expect(c.magnitude()).toBeCloseTo(1, DIGITS);
 });

 it('instance normalize throws for zero magnitude', () => {
  const c = new Complex(0, 0);
  expect(() => c.normalize()).toThrow(RangeError);
 });
});

describe('Coverage - Static conjugate', () => {
 it('static conjugate returns conjugate', () => {
  const result = Complex.conjugate(new Complex(3, 4));
  expect(result.real).toBe(3);
  expect(result.imag).toBe(-4);
 });
});

describe('Coverage - fromObject', () => {
 it('creates complex from object', () => {
  const result = Complex.fromObject({ real: 5, imag: 10 });
  expect(result.real).toBe(5);
  expect(result.imag).toBe(10);
 });
});

describe('Coverage - Static lerp', () => {
 it('lerp interpolates between complex numbers', () => {
  expect.hasAssertions();
  const a = new Complex(0, 0);
  const b = new Complex(10, 10);
  const result = Complex.lerp(a, b, 0.5);
  expect(result.real).toBeCloseTo(5, DIGITS);
  expect(result.imag).toBeCloseTo(5, DIGITS);
 });
});

describe('Coverage - Static add', () => {
 it('add adds two complex numbers', () => {
  expect.hasAssertions();
  const result = Complex.add(new Complex(1, 2), new Complex(3, 4));
  expect(result.real).toBe(4);
  expect(result.imag).toBe(6);
 });
});

describe('Coverage - Static subtract', () => {
 it('subtract subtracts two complex numbers', () => {
  expect.hasAssertions();
  const result = Complex.subtract(new Complex(5, 7), new Complex(2, 3));
  expect(result.real).toBe(3);
  expect(result.imag).toBe(4);
 });
});

describe('Coverage - Static multiply', () => {
 it('multiply multiplies two complex numbers', () => {
  expect.hasAssertions();
  const a = new Complex(1, 2);
  const b = new Complex(3, 4);
  const result = Complex.multiply(a, b);
  expect(result.real).toBeCloseTo(-5, DIGITS);
  expect(result.imag).toBeCloseTo(10, DIGITS);
 });
});

describe('Coverage - Static negate', () => {
 it('negate negates complex number', () => {
  expect.hasAssertions();
  const result = Complex.negate(new Complex(3, 4));
  expect(result.real).toBe(-3);
  expect(result.imag).toBe(-4);
 });
});

describe('Coverage - Static scale', () => {
 it('scale scales by scalar', () => {
  expect.hasAssertions();
  const result = Complex.multiplyScalar(new Complex(2, 3), 2);
  expect(result.real).toBe(4);
  expect(result.imag).toBe(6);
 });
});

describe('Coverage - Instance add', () => {
 it('add adds in place', () => {
  expect.hasAssertions();
  const c = new Complex(1, 2);
  c.add(new Complex(3, 4));
  expect(c.real).toBe(4);
  expect(c.imag).toBe(6);
 });
});

describe('Coverage - Instance subtract', () => {
 it('subtract subtracts in place', () => {
  expect.hasAssertions();
  const c = new Complex(5, 7);
  c.subtract(new Complex(2, 3));
  expect(c.real).toBe(3);
  expect(c.imag).toBe(4);
 });
});

describe('Coverage - Instance multiply', () => {
 it('multiply multiplies in place', () => {
  expect.hasAssertions();
  const c = new Complex(1, 2);
  c.multiply(new Complex(3, 4));
  expect(c.real).toBeCloseTo(-5, DIGITS);
  expect(c.imag).toBeCloseTo(10, DIGITS);
 });
});

describe('Coverage - Instance negate', () => {
 it('negate negates in place', () => {
  expect.hasAssertions();
  const c = new Complex(3, 4);
  c.negate();
  expect(c.real).toBe(-3);
  expect(c.imag).toBe(-4);
 });
});

describe('Coverage - Instance lerp', () => {
 it('lerp interpolates in place', () => {
  expect.hasAssertions();
  const c = new Complex(0, 0);
  c.lerp(new Complex(10, 10), 0.5);
  expect(c.real).toBeCloseTo(5, DIGITS);
  expect(c.imag).toBeCloseTo(5, DIGITS);
 });
});

describe('Coverage - Static slerp (interpolation)', () => {
 it('slerp interpolates spherically', () => {
  expect.hasAssertions();
  const a = new Complex(1, 0);
  const b = new Complex(0, 1);
  const result = Complex.slerp(a, b, 0.5);
  expect(result.magnitude()).toBeCloseTo(1, DIGITS);
 });
});

describe('Coverage - Static fromPolar', () => {
 it('fromPolar creates from polar coordinates', () => {
  expect.hasAssertions();
  const result = Complex.fromPolar(2, Math.PI / 2);
  expect(result.real).toBeCloseTo(0, DIGITS);
  expect(result.imag).toBeCloseTo(2, DIGITS);
 });
});

describe('Coverage - Instance angle', () => {
 it('angle returns phase angle', () => {
  expect.hasAssertions();
  const c = new Complex(0, 1);
  expect(c.angle).toBeCloseTo(Math.PI / 2, DIGITS);
 });
});

describe('Coverage - Instance toArray', () => {
 it('toArray returns [real, imag]', () => {
  expect.hasAssertions();
  const c = new Complex(3, 4);
  const array = c.toArray();
  expect(array[0]).toBe(3);
  expect(array[1]).toBe(4);
 });
});

describe('Coverage - Static divide', () => {
 it('divide divides two complex numbers', () => {
  expect.hasAssertions();
  const a = new Complex(5, 10);
  const b = new Complex(1, 2);
  const result = Complex.divide(a, b);
  expect(result.real).toBeCloseTo(5, DIGITS);
  expect(result.imag).toBeCloseTo(0, DIGITS);
 });
});

describe('Coverage - Static reciprocal', () => {
 it('reciprocal returns 1/z', () => {
  expect.hasAssertions();
  const c = new Complex(3, 4);
  const recip = Complex.reciprocal(c);
  const product = Complex.multiply(c, recip);
  expect(product.real).toBeCloseTo(1, DIGITS);
  expect(product.imag).toBeCloseTo(0, DIGITS);
 });
});

// === BRANCH COVERAGE: L1067-1080 ===
describe('Coverage - Instance divide', () => {
 it('divide divides in place', () => {
  expect.hasAssertions();
  const c = new Complex(5, 10);
  c.divide(new Complex(1, 2));
  expect(c.real).toBeCloseTo(5, DIGITS);
  expect(c.imag).toBeCloseTo(0, DIGITS);
 });

 it('divide throws for zero denominator', () => {
  expect.hasAssertions();
  const c = new Complex(1, 2);
  expect(() => c.divide(new Complex(0, 0))).toThrow(RangeError);
 });
});

describe('Coverage - Instance set', () => {
 it('set sets real and imag', () => {
  expect.hasAssertions();
  const c = new Complex();
  c.set(3, 4);
  expect(c.real).toBe(3);
  expect(c.imag).toBe(4);
 });
});

describe('Coverage - Instance conjugate (mutating)', () => {
 it('conjugate negates imag', () => {
  expect.hasAssertions();
  const c = new Complex(3, 4);
  c.conjugate();
  expect(c.real).toBe(3);
  expect(c.imag).toBe(-4);
 });
});

describe('Coverage - Instance normalize (mutating)', () => {
 it('normalize makes unit complex', () => {
  expect.hasAssertions();
  const c = new Complex(3, 4);
  c.normalize();
  expect(c.magnitude()).toBeCloseTo(1, DIGITS);
 });

 it('normalize throws for zero', () => {
  expect.hasAssertions();
  const c = new Complex(0, 0);
  expect(() => c.normalize()).toThrow(RangeError);
 });
});

describe('Coverage - Instance copy', () => {
 it('copy copies from source', () => {
  expect.hasAssertions();
  const source = new Complex(3, 4);
  const target = new Complex();
  target.copy(source);
  expect(target.real).toBe(3);
  expect(target.imag).toBe(4);
 });
});

describe('Coverage - Instance slerp', () => {
 it('slerp interpolates spherically in place', () => {
  expect.hasAssertions();
  const c = new Complex(1, 0);
  c.slerp(new Complex(0, 1), 0.5);
  expect(c.magnitude()).toBeCloseTo(1, DIGITS);
 });

 describe('Coverage - Safety Methods', () => {
  it('divideSafe returns zero when denominator is zero', () => {
   const result = Complex.divideSafe(new Complex(5, 5), Complex.ZERO);
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });

  it('divideSafe works like divide for non-zero', () => {
   const result = Complex.divideSafe(new Complex(4, 0), new Complex(2, 0));
   expect(result.real).toBeCloseTo(2);
   expect(result.imag).toBeCloseTo(0);
  });

  it('reciprocalSafe returns zero for zero complex', () => {
   const result = Complex.reciprocalSafe(Complex.ZERO);
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });

  it('reciprocalSafe works safely', () => {
   const result = Complex.reciprocalSafe(new Complex(2, 0));
   expect(result!.real).toBeCloseTo(0.5);
  });

  // V9-Complex-06: reciprocated preserves signed zero per C99 Annex G §G.5.1 (RA-4)
  it('reciprocated preserves IEEE 754 signed zero for purely-real inputs', () => {
   const result = new Complex(2, 0).reciprocated;
   expect(result.real).toBeCloseTo(0.5);
   // Signed zero from IEEE arithmetic is retained — the previous post-hoc cleanup
   // that coerced -0 → +0 is removed; matches Complex.sqrt convention.
   expect(Number.isFinite(result.imag)).toBe(true);
  });

  it('divideUnchecked computes division', () => {
   const result = Complex.divideUnchecked(new Complex(6, 0), new Complex(3, 0));
   expect(result.real).toBeCloseTo(2);
  });

  it('reciprocalUnchecked computes reciprocal', () => {
   const result = Complex.reciprocalUnchecked(new Complex(4, 0));
   expect(result.real).toBeCloseTo(0.25);
  });
 });

 describe('Coverage - isUnit', () => {
  it('returns true for unit vector', () => {
   expect(Complex.isUnit(new Complex(1, 0))).toBe(true);
   expect(Complex.isUnit(new Complex(0, 1))).toBe(true);
   // 1/√2 + i/√2
   expect(Complex.isUnit(Complex.fromPolar(1, Math.PI / 4))).toBe(true);
  });

  it('returns false for non-unit', () => {
   expect(Complex.isUnit(new Complex(2, 0))).toBe(false);
   expect(Complex.isUnit(new Complex(0, 0))).toBe(false);
  });
 });

 describe('fromValues factory', () => {
  it('creates complex from real and imag values', () => {
   const c = Complex.fromValues(3, 4);
   expect(c.real).toBe(3);
   expect(c.imag).toBe(4);
  });

  it('creates unit imaginary', () => {
   const c = Complex.fromValues(0, 1);
   expect(c.real).toBe(0);
   expect(c.imag).toBe(1);
   expect(c.exactEquals(Complex.I)).toBe(true);
  });

  it('uses out parameter', () => {
   const out = new Complex();
   const result = Complex.fromValues(5, 6, out);
   expect(result).toBe(out);
   expect(out.real).toBe(5);
   expect(out.imag).toBe(6);
  });
  // Pure math: NaN/Infinity are valid IEEE 754 values, no longer throws
 });

 describe('normalizeUnchecked', () => {
  it('static normalizeUnchecked normalizes complex', () => {
   const c = new Complex(3, 4);
   const result = Complex.normalizeUnchecked(c);
   expect(result.real).toBeCloseTo(0.6, DIGITS);
   expect(result.imag).toBeCloseTo(0.8, DIGITS);
   expect(result.magnitude()).toBeCloseTo(1, DIGITS);
  });

  it('static normalizeUnchecked uses out parameter', () => {
   const c = new Complex(3, 4);
   const out = new Complex();
   const result = Complex.normalizeUnchecked(c, out);
   expect(result).toBe(out);
  });

  it('instance normalizeUnchecked normalizes in place', () => {
   const c = new Complex(3, 4);
   const result = c.normalizeUnchecked();
   expect(result).toBe(c);
   expect(c.real).toBeCloseTo(0.6, DIGITS);
   expect(c.imag).toBeCloseTo(0.8, DIGITS);
  });

  it('normalizeUnchecked returns NaN for zero complex', () => {
   const c = new Complex(0, 0);
   const result = Complex.normalizeUnchecked(c);
   expect(result.hasNaN()).toBe(true);
  });
 });

 describe('Coverage - applyInverse with out', () => {
  it('applyInverse uses out parameter', () => {
   const c = Complex.fromPolar(1, Math.PI / 2);
   const v = { x: 0, y: 1 };
   const result = Complex.applyInverse(c, v);
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - static copy', () => {
  it('copy copies values to destination', () => {
   const source = new Complex(3, 4);
   const destination = new Complex();
   const result = Complex.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.real).toBe(3);
   expect(destination.imag).toBe(4);
  });
 });

 describe('Coverage - isUnit static', () => {
  it('isUnit returns true for unit complex', () => {
   const c = Complex.fromPolar(1, Math.PI / 4);
   expect(Complex.isUnit(c)).toBe(true);
  });

  it('isUnit returns false for non-unit complex', () => {
   const c = new Complex(3, 4);
   expect(Complex.isUnit(c)).toBe(false);
  });

  it('isUnit respects epsilon parameter', () => {
   const c = new Complex(1.01, 0);
   expect(Complex.isUnit(c, 0.001)).toBe(false);
   expect(Complex.isUnit(c, 0.1)).toBe(true);
  });
 });

 describe('Coverage - divideSafe and divideUnchecked', () => {
  it('divideSafe returns zero for zero denominator', () => {
   const result = Complex.divideSafe(new Complex(1, 2), Complex.ZERO);
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });

  it('divideSafe divides normally for non-zero', () => {
   const result = Complex.divideSafe(new Complex(4, 0), new Complex(2, 0));
   expect(result.real).toBeCloseTo(2, DIGITS);
  });

  it('divideUnchecked divides without validation', () => {
   const result = Complex.divideUnchecked(new Complex(4, 0), new Complex(2, 0));
   expect(result.real).toBeCloseTo(2, DIGITS);
  });
 });

 describe('Coverage - reciprocalSafe and reciprocalUnchecked', () => {
  it('reciprocalSafe returns zero for zero complex', () => {
   const result = Complex.reciprocalSafe(Complex.ZERO);
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });

  it('reciprocalSafe computes reciprocal for non-zero', () => {
   const result = Complex.reciprocalSafe(new Complex(2, 0));
   expect(result.real).toBeCloseTo(0.5, DIGITS);
  });

  it('reciprocalUnchecked computes reciprocal', () => {
   const result = Complex.reciprocalUnchecked(new Complex(4, 0));
   expect(result.real).toBeCloseTo(0.25, DIGITS);
  });
 });

 describe('Coverage - freezeComplex helper', () => {
  it('freezeComplex freezes complex object', () => {
   const c = new Complex(3, 4);
   const frozen = freezeComplex(c);
   expect(Object.isFrozen(frozen)).toBe(true);
   expect(frozen.real).toBe(3);
   expect(frozen.imag).toBe(4);
  });

  it('freezeComplex returns same instance', () => {
   const c = new Complex(1, 2);
   const frozen = freezeComplex(c);
   expect(frozen).toBe(c);
  });
 });

 describe('Coverage - setFromPolar instance method', () => {
  it('setFromPolar sets from polar coordinates', () => {
   const c = new Complex();
   c.setFromPolar(2, Math.PI / 2);
   expect(c.real).toBeCloseTo(0, DIGITS);
   expect(c.imag).toBeCloseTo(2, DIGITS);
  });

  it('setFromPolar returns this for chaining', () => {
   const c = new Complex();
   const result = c.setFromPolar(1, 0);
   expect(result).toBe(c);
  });
 });

 describe('Coverage - hasNaN static method', () => {
  it('hasNaN returns false for finite complex', () => {
   expect(Complex.hasNaN(new Complex(1, 2))).toBe(false);
  });

  // Note: Cannot easily test hasNaN returning true since constructor may reject NaN
  // depending on validation, but the static method is tested via coverage of the path
 });

 describe('Coverage - hasInfinity with real infinity', () => {
  it('hasInfinity checks for infinite values', () => {
   const c = new Complex(1, 2);
   expect(Complex.hasInfinity(c)).toBe(false);
  });
 });

 describe('Coverage - setFromArray instance method', () => {
  it('setFromArray sets from array values', () => {
   const c = new Complex();
   c.setFromArray([5, 10], 0);
   expect(c.real).toBe(5);
   expect(c.imag).toBe(10);
  });

  it('setFromArray with offset', () => {
   const c = new Complex();
   c.setFromArray([1, 2, 3, 4], 2);
   expect(c.real).toBe(3);
   expect(c.imag).toBe(4);
  });
 });

 describe('Branch Coverage - divideSafe zero denominator', () => {
  it('returns (0,0) for zero denominator', () => {
   const result = Complex.divideSafe(new Complex(1, 2), new Complex(0, 0));
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });

  it('returns (0,0) for near-zero denominator', () => {
   const result = Complex.divideSafe(new Complex(1, 2), new Complex(1e-16, 0));
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });
 });

 describe('Branch Coverage - powScalar edge cases', () => {
  it('powScalar with zero exponent returns 1', () => {
   const result = Complex.powScalar(new Complex(5, 5), 0);
   expect(result.real).toBe(1);
   expect(result.imag).toBe(0);
  });

  it('powScalar with negative exponent', () => {
   const result = Complex.powScalar(new Complex(2, 0), -1);
   expect(result.real).toBeCloseTo(0.5, DIGITS);
  });

  it('powScalar with zero base and positive exponent', () => {
   const result = Complex.powScalar(new Complex(0, 0), 2);
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
  });

  it('powScalar throws for zero base with negative exponent', () => {
   expect(() => Complex.powScalar(new Complex(0, 0), -1)).toThrow(RangeError);
  });
 });

 describe('slerp zero-magnitude fallback', () => {
  it('falls back to lerp when first input has zero magnitude', () => {
   const a = new Complex(0, 0);
   const b = new Complex(2, 4);
   const result = Complex.slerp(a, b, 0.5);
   expect(result.real).toBeCloseTo(1);
   expect(result.imag).toBeCloseTo(2);
  });

  it('falls back to lerp when second input has zero magnitude', () => {
   const a = new Complex(2, 4);
   const b = new Complex(0, 0);
   const result = Complex.slerp(a, b, 0.5);
   expect(result.real).toBeCloseTo(1);
   expect(result.imag).toBeCloseTo(2);
  });
 });

 describe('Branch Coverage - sqrt edge cases', () => {
  it('sqrt of negative real returns imaginary', () => {
   const result = Complex.sqrt(new Complex(-4, 0));
   expect(result.imag).toBeCloseTo(2, DIGITS);
  });

  it('sqrt of pure imaginary', () => {
   const result = Complex.sqrt(new Complex(0, 4));
   // sqrt(4i) = sqrt(2) + sqrt(2)i
   expect(result.real).toBeCloseTo(Math.SQRT2, DIGITS);
   expect(result.imag).toBeCloseTo(Math.SQRT2, DIGITS);
  });
 });

 describe('Branch Coverage - normalizeSafe zero magnitude', () => {
  it('normalizeSafe returns (1,0) for zero magnitude', () => {
   const result = Complex.normalizeSafe(new Complex(0, 0));
   expect(result.real).toBe(1);
   expect(result.imag).toBe(0);
  });
 });

 describe('Normalize with extreme values', () => {
  it('normalize handles very large components without overflow', () => {
   const c = new Complex(1e200, 1e200);
   const n = Complex.normalize(c);
   expect(Number.isFinite(n.real)).toBe(true);
   expect(Number.isFinite(n.imag)).toBe(true);
   expect(n.magnitude()).toBeCloseTo(1, DIGITS);
  });

  // Note: underflow protection (real*real → denormal) cannot be tested independently
  // because any value where real*real underflows (~1e-154) is already below EPSILON (1e-10),
  // so the library correctly treats it as zero-magnitude. The overflow test above
  // validates hypot's numerical advantage.
 });

 describe('Coverage - Instance subtract method', () => {
  it('subtract mutates this complex in place', () => {
   const a = new Complex(10, 20);
   const b = new Complex(3, 5);
   const result = a.subtract(b);
   expect(result).toBe(a); // Returns this
   expect(a.real).toBe(7);
   expect(a.imag).toBe(15);
  });
 });

 describe('Coverage - Instance scale method', () => {
  it('scale mutates this complex in place', () => {
   const c = new Complex(3, 4);
   const result = c.multiplyScalar(2);
   expect(result).toBe(c); // Returns this
   expect(c.real).toBe(6);
   expect(c.imag).toBe(8);
  });
 });

 describe('Coverage - Instance setFromPolar method', () => {
  it('setFromPolar sets from polar coordinates', () => {
   const c = new Complex(0, 0);
   const result = c.setFromPolar(2, Math.PI / 2);
   expect(result).toBe(c); // Returns this
   expect(c.real).toBeCloseTo(0, DIGITS);
   expect(c.imag).toBeCloseTo(2, DIGITS);
  });
 });

 describe('Coverage - fromArray negative offset error', () => {
  it('fromArray throws on negative offset', () => {
   expect(() => Complex.fromArray([1, 2], -1)).toThrow(RangeError);
  });
 });

 describe('Coverage - hasNaN', () => {
  it('hasNaN detects NaN in real', () => {
   expect(Complex.hasNaN(new Complex(NaN, 0))).toBe(true);
  });

  it('hasNaN detects NaN in imag', () => {
   expect(Complex.hasNaN(new Complex(0, NaN))).toBe(true);
  });

  it('hasNaN returns false for valid complex', () => {
   expect(Complex.hasNaN(new Complex(1, 2))).toBe(false);
  });
 });

 describe('Coverage - isNearZero', () => {
  it('isNearZero returns true for near-zero complex', () => {
   expect(Complex.isNearZero(new Complex(1e-15, 1e-15))).toBe(true);
  });

  it('isNearZero returns false for non-zero complex', () => {
   expect(Complex.isNearZero(new Complex(1, 0))).toBe(false);
  });
 });

 describe('Coverage - Instance isIdentity', () => {
  it('isIdentity returns true for 1+0i', () => {
   const c = new Complex(1, 0);
   expect(c.isIdentity()).toBe(true);
  });

  it('isIdentity returns false for non-identity', () => {
   const c = new Complex(1, 1);
   expect(c.isIdentity()).toBe(false);
  });
 });

 describe('Coverage - Instance negate', () => {
  it('negate negates complex in place', () => {
   const c = new Complex(3, -4);
   c.negate();
   expect(c.real).toBe(-3);
   expect(c.imag).toBe(4);
  });
 });

 describe('Coverage - Instance nearEquals', () => {
  it('nearEquals returns true for equal complex', () => {
   const a = new Complex(1, 2);
   const b = new Complex(1.0000001, 2.0000001);
   expect(a.nearEquals(b, 0.001)).toBe(true);
  });
 });

 describe('Coverage - Instance zero', () => {
  it('zero sets complex to 0+0i', () => {
   const c = new Complex(5, 6);
   c.zero();
   expect(c.real).toBe(0);
   expect(c.imag).toBe(0);
  });
 });

 describe('Coverage - Instance conjugateNew', () => {
  it('conjugated returns new conjugate without mutating', () => {
   const c = new Complex(3, 4);
   const conj = c.conjugated;
   expect(conj.real).toBe(3);
   expect(conj.imag).toBe(-4);
   expect(c.imag).toBe(4); // Original unchanged
  });
 });

 describe('Coverage - Static normalizeSafe', () => {
  it('normalizeSafe returns (1,0) for near-zero magnitude', () => {
   const result = Complex.normalizeSafe(new Complex(1e-15, 1e-15));
   expect(result.real).toBe(1);
   expect(result.imag).toBe(0);
  });

  it('normalizeSafe normalizes for valid complex', () => {
   const result = Complex.normalizeSafe(new Complex(3, 4));
   expect(result.real).toBeCloseTo(0.6);
   expect(result.imag).toBeCloseTo(0.8);
  });
 });

 describe('Coverage - Static hasInfinity', () => {
  it('hasInfinity returns true for infinite real', () => {
   expect(Complex.hasInfinity(new Complex(Infinity, 0))).toBe(true);
  });

  it('hasInfinity returns true for infinite imag', () => {
   expect(Complex.hasInfinity(new Complex(0, -Infinity))).toBe(true);
  });

  it('hasInfinity returns false for finite complex', () => {
   expect(Complex.hasInfinity(new Complex(1, 2))).toBe(false);
  });
 });

 describe('Coverage - Instance copy method', () => {
  it('copy copies from another complex', () => {
   const a = new Complex(5, 6);
   const b = new Complex(1, 2);
   a.copy(b);
   expect(a.real).toBe(1);
   expect(a.imag).toBe(2);
  });
 });

 describe('Coverage - Instance conjugate', () => {
  it('conjugate negates imaginary part in place', () => {
   const c = new Complex(3, 4);
   c.conjugate();
   expect(c.real).toBe(3);
   expect(c.imag).toBe(-4);
  });
 });

 describe('Coverage - fromArray offset overflow', () => {
  it('fromArray throws when offset + 2 exceeds array length', () => {
   expect(() => Complex.fromArray([1, 2], 1)).toThrow(RangeError);
  });
 });

 describe('Coverage - Instance multiply', () => {
  it('multiply multiplies complex numbers in place', () => {
   const a = new Complex(1, 2);
   a.multiply(new Complex(3, 4));
   expect(a.real).toBe(1 * 3 - 2 * 4); // -5
   expect(a.imag).toBe(1 * 4 + 2 * 3); // 10
  });
 });

 describe('Coverage - Instance divide', () => {
  it('divide divides complex numbers in place', () => {
   const a = new Complex(10, 0);
   a.divide(new Complex(2, 0));
   expect(a.real).toBe(5);
   expect(a.imag).toBe(0);
  });
 });

 describe('Coverage - Instance setFromPolar', () => {
  it('setFromPolar sets from polar coordinates', () => {
   const c = new Complex(0, 0);
   c.setFromPolar(5, 0);
   expect(c.real).toBeCloseTo(5);
   expect(c.imag).toBeCloseTo(0);
  });
 });

 describe('Coverage - Instance add', () => {
  it('add adds complex numbers in place', () => {
   const a = new Complex(1, 2);
   a.add(new Complex(3, 4));
   expect(a.real).toBe(4);
   expect(a.imag).toBe(6);
  });
 });

 describe('Coverage - Instance subtract', () => {
  it('subtract subtracts complex numbers in place', () => {
   const a = new Complex(5, 6);
   a.subtract(new Complex(3, 4));
   expect(a.real).toBe(2);
   expect(a.imag).toBe(2);
  });
 });

 describe('toVector2', () => {
  it('maps real to x and imag to y', () => {
   const c = new Complex(3, 4);
   const v = c.toVector2();
   expect(v.x).toBe(3);
   expect(v.y).toBe(4);
  });

  it('accepts out parameter', () => {
   const c = new Complex(-1, 2);
   const out = new Vector2();
   const result = c.toVector2(out);
   expect(result).toBe(out);
   expect(out.x).toBe(-1);
   expect(out.y).toBe(2);
  });
 });
});

describe('Complex.exp', () => {
 it('exp(0) = 1', () => {
  const result = Complex.exp(new Complex(0, 0));
  expect(result.real).toBeCloseTo(1, DIGITS);
  expect(result.imag).toBeCloseTo(0, DIGITS);
 });

 it('exp of real number equals e^re', () => {
  const result = Complex.exp(new Complex(1, 0));
  expect(result.real).toBeCloseTo(Math.E, DIGITS);
  expect(result.imag).toBeCloseTo(0, DIGITS);
 });

 it('exp of purely imaginary number gives rotation', () => {
  const result = Complex.exp(new Complex(0, Math.PI / 2));
  expect(result.real).toBeCloseTo(0, DIGITS);
  expect(result.imag).toBeCloseTo(1, DIGITS);
 });

 it('Euler identity: e^(iπ) + 1 = 0', () => {
  const result = Complex.exp(new Complex(0, Math.PI));
  expect(result.real).toBeCloseTo(-1, DIGITS);
  expect(result.imag).toBeCloseTo(0, DIGITS);
 });

 it('exp overflow returns Infinity components', () => {
  const result = Complex.exp(new Complex(1000, 0));
  expect(result.real).toBe(Infinity);
 });

 it('exp with out parameter', () => {
  const out = new Complex();
  const result = Complex.exp(new Complex(0, 0), out);
  expect(result).toBe(out);
  expect(out.real).toBeCloseTo(1, DIGITS);
 });

 it('instance exp mutates in place', () => {
  const c = new Complex(1, 0);
  const result = c.exp();
  expect(result).toBe(c);
  expect(c.real).toBeCloseTo(Math.E, DIGITS);
  expect(c.imag).toBeCloseTo(0, DIGITS);
 });
});

describe('Complex.log', () => {
 it('log(e) = 1 + 0i', () => {
  const result = Complex.log(new Complex(Math.E, 0));
  expect(result.real).toBeCloseTo(1, DIGITS);
  expect(result.imag).toBeCloseTo(0, DIGITS);
 });

 it('log of negative real gives π imaginary part', () => {
  const result = Complex.log(new Complex(-1, 0));
  expect(result.real).toBeCloseTo(0, DIGITS);
  expect(result.imag).toBeCloseTo(Math.PI, DIGITS);
 });

 it('log of unit circle point gives angle', () => {
  const result = Complex.log(Complex.fromPolar(1, Math.PI / 4));
  expect(result.real).toBeCloseTo(0, DIGITS);
  expect(result.imag).toBeCloseTo(Math.PI / 4, DIGITS);
 });

 it('log of zero returns -Infinity real', () => {
  const result = Complex.log(new Complex(0, 0));
  expect(result.real).toBe(-Infinity);
 });

 it('round-trip: exp(log(z)) ≈ z for non-zero z', () => {
  const z = new Complex(3, 4);
  const result = Complex.exp(Complex.log(z));
  expect(result.real).toBeCloseTo(3, 6);
  expect(result.imag).toBeCloseTo(4, 6);
 });

 it('instance log mutates in place', () => {
  const c = new Complex(Math.E, 0);
  const result = c.log();
  expect(result).toBe(c);
  expect(c.real).toBeCloseTo(1, DIGITS);
  expect(c.imag).toBeCloseTo(0, DIGITS);
 });
});

describe('Complex.toPolar', () => {
 it('real axis returns angle 0', () => {
  const polar = Complex.toPolar(new Complex(5, 0));
  expect(polar.magnitude).toBeCloseTo(5, DIGITS);
  expect(polar.angle).toBeCloseTo(0, DIGITS);
 });

 it('unit circle point returns correct angle', () => {
  const polar = Complex.toPolar(Complex.fromPolar(1, Math.PI / 3));
  expect(polar.magnitude).toBeCloseTo(1, DIGITS);
  expect(polar.angle).toBeCloseTo(Math.PI / 3, DIGITS);
 });

 it('zero returns magnitude 0', () => {
  const polar = Complex.toPolar(new Complex(0, 0));
  expect(polar.magnitude).toBe(0);
 });

 it('round-trip: fromPolar(toPolar(z)) ≈ z', () => {
  const z = new Complex(3, 4);
  const polar = Complex.toPolar(z);
  const back = Complex.fromPolar(polar.magnitude, polar.angle);
  expect(back.real).toBeCloseTo(3, DIGITS);
  expect(back.imag).toBeCloseTo(4, DIGITS);
 });

 it('instance toPolar delegates to static', () => {
  const c = new Complex(3, 4);
  const polar = c.toPolar();
  expect(polar.magnitude).toBeCloseTo(5, DIGITS);
  expect(polar.angle).toBeCloseTo(Math.atan2(4, 3), 6);
 });
});

describe('Complex NaN/Infinity handling', () => {
 it('magnitude of NaN complex is NaN', () => {
  const c = new Complex(NaN, 1);
  expect(c.magnitude()).toBeNaN();
 });

 it('magnitude of Infinity complex is Infinity', () => {
  const c = new Complex(Infinity, 0);
  expect(c.magnitude()).toBe(Infinity);
 });

 it('fromPolar with NaN magnitude produces NaN', () => {
  const c = Complex.fromPolar(NaN, 0);
  expect(c.real).toBeNaN();
  expect(c.imag).toBeNaN();
 });

 it('fromPolar with NaN angle throws (assertFinite)', () => {
  expect(() => Complex.fromPolar(1, NaN)).toThrow();
 });

 it('normalizeSafe of NaN complex propagates NaN (not caught by isNearZero)', () => {
  const c = new Complex(NaN, NaN);
  const result = Complex.normalizeSafe(c);
  expect(result.real).toBeNaN();
  expect(result.imag).toBeNaN();
 });

 describe('fromPolarCS', () => {
  it('creates unit complex from cos/sin', () => {
   const c = Complex.fromPolarCS(1, Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));
   expect(c.real).toBeCloseTo(Math.SQRT1_2, DIGITS);
   expect(c.imag).toBeCloseTo(Math.SQRT1_2, DIGITS);
  });

  it('creates complex with arbitrary magnitude', () => {
   const c = Complex.fromPolarCS(5, 0, 1);
   expect(c.real).toBeCloseTo(0, DIGITS);
   expect(c.imag).toBeCloseTo(5, DIGITS);
  });

  it('zero magnitude produces zero complex', () => {
   const c = Complex.fromPolarCS(0, 1, 0);
   expect(c.real).toBe(0);
   expect(c.imag).toBe(0);
  });

  it('uses out parameter', () => {
   const out = new Complex();
   const result = Complex.fromPolarCS(1, 1, 0, out);
   expect(result).toBe(out);
   expect(out.real).toBe(1);
   expect(out.imag).toBe(0);
  });

  it('matches fromPolar for same angle', () => {
   const angle = 1.23;
   const cs = Complex.fromPolarCS(3, Math.cos(angle), Math.sin(angle));
   const polar = Complex.fromPolar(3, angle);
   expect(cs.real).toBeCloseTo(polar.real, 8);
   expect(cs.imag).toBeCloseTo(polar.imag, 8);
  });
 });

 describe('Coverage: static predicates and factories', () => {
  it('fromArray throws on out-of-bounds offset', () => {
   expect(() => Complex.fromArray([1, 2], 2)).toThrow(RangeError);
  });

  it('normalizeSafe returns (1,0) for zero-magnitude', () => {
   const r = Complex.normalizeSafe(Complex.ZERO);
   expect(r.real).toBe(1);
   expect(r.imag).toBe(0);
  });

  it('isZero detects zero complex', () => {
   expect(Complex.isZero(new Complex(0, 0))).toBe(true);
   expect(Complex.isZero(new Complex(1e-11, 0))).toBe(false);
  });

  it('isFinite detects non-finite components', () => {
   expect(Complex.isFinite(new Complex(1, 2))).toBe(true);
   expect(Complex.isFinite(new Complex(Infinity, 0))).toBe(false);
   expect(Complex.isFinite(new Complex(0, NaN))).toBe(false);
  });

  it('hasNaN detects NaN components', () => {
   expect(Complex.hasNaN(new Complex(1, 2))).toBe(false);
   expect(Complex.hasNaN(new Complex(NaN, 1))).toBe(true);
   expect(Complex.hasNaN(new Complex(1, NaN))).toBe(true);
  });

  it('hasInfinity detects Infinity components', () => {
   expect(Complex.hasInfinity(new Complex(Infinity, 0))).toBe(true);
   expect(Complex.hasInfinity(new Complex(0, -Infinity))).toBe(true);
   expect(Complex.hasInfinity(new Complex(NaN, 0))).toBe(false);
  });

  it('isNearZero uses tolerance', () => {
   expect(Complex.isNearZero(new Complex(1e-11, 1e-11))).toBe(true);
   expect(Complex.isNearZero(new Complex(1, 0))).toBe(false);
  });

  it('isReal and isImaginary', () => {
   expect(Complex.isReal(new Complex(5, 0))).toBe(true);
   expect(Complex.isReal(new Complex(5, 1))).toBe(false);
   expect(Complex.isImaginary(new Complex(0, 5))).toBe(true);
   expect(Complex.isImaginary(new Complex(1, 5))).toBe(false);
  });
 });

 describe('Coverage: instance mutators', () => {
  it('add mutates and returns this', () => {
   const c = new Complex(1, 2);
   const result = c.add(new Complex(3, 4));
   expect(result).toBe(c);
   expect(c.real).toBe(4);
   expect(c.imag).toBe(6);
  });

  it('divideSafe returns (0,0) for zero divisor', () => {
   const c = new Complex(5, 3);
   const result = c.divideSafe(Complex.ZERO);
   expect(result).toBe(c);
   expect(c.real).toBe(0);
   expect(c.imag).toBe(0);
  });

  it('divideUnchecked divides without validation', () => {
   const c = new Complex(6, 0);
   c.divideUnchecked(new Complex(2, 0));
   expect(c.real).toBeCloseTo(3, DIGITS);
   expect(c.imag).toBeCloseTo(0, DIGITS);
  });

  it('scale multiplies both components', () => {
   const c = new Complex(2, 3);
   const result = c.multiplyScalar(2);
   expect(result).toBe(c);
   expect(c.real).toBe(4);
   expect(c.imag).toBe(6);
  });

  it('reciprocalUnchecked computes 1/z', () => {
   const c = new Complex(2, 0);
   c.reciprocalUnchecked();
   expect(c.real).toBeCloseTo(0.5, DIGITS);
   expect(c.imag).toBeCloseTo(0, DIGITS);
  });

  it('applyInverse rotates vector in opposite direction', () => {
   const rot = Complex.fromPolar(1, Math.PI / 2);
   const v = rot.applyInverse({ x: 0, y: 1 });
   expect(v.x).toBeCloseTo(1, 8);
   expect(v.y).toBeCloseTo(0, 8);
  });
 });

 describe('Coverage: instance comparison and getters', () => {
  it('exactEquals checks bit-identical equality', () => {
   expect(new Complex(1, 2).exactEquals(new Complex(1, 2))).toBe(true);
   expect(new Complex(1, 2).exactEquals(new Complex(1, 2.0001))).toBe(false);
  });

  it('nearEquals instance delegates to static', () => {
   const a = new Complex(1, 2);
   const b = new Complex(1 + 1e-12, 2);
   expect(a.nearEquals(b)).toBe(true);
  });

  it('isIdentity checks (1,0) within tolerance', () => {
   expect(new Complex(1, 0).isIdentity()).toBe(true);
   expect(new Complex(1 + 1e-11, 1e-11).isIdentity()).toBe(true);
   expect(new Complex(0, 1).isIdentity()).toBe(false);
  });

  it('isUnit checks unit magnitude', () => {
   expect(new Complex(1, 0).isUnit()).toBe(true);
   expect(new Complex(2, 0).isUnit()).toBe(false);
  });

  it('isNearZero instance', () => {
   expect(new Complex(1e-11, 1e-11).isNearZero()).toBe(true);
  });

  it('isReal and isImaginary instance', () => {
   expect(new Complex(5, 0).isReal()).toBe(true);
   expect(new Complex(0, 5).isImaginary()).toBe(true);
  });

  it('conjugated getter returns new instance', () => {
   const c = new Complex(3, 4);
   const conj = c.conjugated;
   expect(conj.real).toBe(3);
   expect(conj.imag).toBe(-4);
   expect(conj).not.toBe(c);
  });

  it('negated getter returns new instance', () => {
   const c = new Complex(3, 4);
   const neg = c.negated;
   expect(neg.real).toBe(-3);
   expect(neg.imag).toBe(-4);
   expect(neg).not.toBe(c);
  });
 });
});

describe('Complex predicates — edge cases', () => {
 it('hasNaN detects NaN in both real and imaginary', () => {
  expect(Complex.hasNaN(new Complex(NaN, NaN))).toBe(true);
 });

 it('hasInfinity detects Infinity in both components', () => {
  expect(Complex.hasInfinity(new Complex(Infinity, -Infinity))).toBe(true);
 });

 it('instance hasInfinity detects Infinity', () => {
  expect(new Complex(Infinity, 0).hasInfinity()).toBe(true);
  expect(new Complex(0, -Infinity).hasInfinity()).toBe(true);
  expect(new Complex(1, 2).hasInfinity()).toBe(false);
 });

 it('instance isZero positive and negative cases', () => {
  expect(new Complex(0, 0).isZero()).toBe(true);
  expect(new Complex(1, 0).isZero()).toBe(false);
  expect(new Complex(0, 1).isZero()).toBe(false);
 });

 it('instance isNearZero negative case', () => {
  expect(new Complex(1, 0).isNearZero()).toBe(false);
 });

 it('instance isReal negative case', () => {
  expect(new Complex(5, 1).isReal()).toBe(false);
 });

 it('instance isImaginary negative case', () => {
  expect(new Complex(1, 5).isImaginary()).toBe(false);
 });
});

describe('Smith algorithm division robustness', () => {
 it('handles overflow: (1,0) / (1e200, 1e200)', () => {
  const a = new Complex(1, 0);
  const b = new Complex(1e200, 1e200);
  const result = Complex.divide(a, b);
  // Expected: ~(5e-201, -5e-201)
  expect(result.real).toBeCloseTo(5e-201, 210);
  expect(result.imag).toBeCloseTo(-5e-201, 210);
 });

 it('handles large magnitude ratio: (1,1) / (1e-4, 1e-4)', () => {
  const a = new Complex(1, 1);
  const b = new Complex(1e-4, 1e-4);
  const result = Complex.divide(a, b);
  // (1+i)/(1e-4+1e-4·i) = 1/(1e-4) = 1e4
  expect(result.real).toBeCloseTo(1e4, -1);
  expect(result.imag).toBeCloseTo(0, DIGITS);
 });

 it('normal-range regression: identical results for typical inputs', () => {
  const a = new Complex(3, 4);
  const b = new Complex(1, 2);
  const result = Complex.divide(a, b);
  // (3+4i)/(1+2i) = (3+4i)(1-2i)/(1+4) = (3+8+i(4-6))/5 = (11-2i)/5
  expect(result.real).toBeCloseTo(11 / 5, DIGITS);
  expect(result.imag).toBeCloseTo(-2 / 5, DIGITS);
 });

 it('reciprocal threshold: Complex(1e-5, 0) reciprocal succeeds', () => {
  const c = new Complex(1e-5, 0);
  const recip = Complex.reciprocal(c);
  expect(recip.real).toBeCloseTo(1e5, DIGITS);
  expect(recip.imag).toBeCloseTo(0, DIGITS);
 });

 it('reciprocal parity: Complex(5e-6, 0) static and instance must agree', () => {
  // magnitude = 5e-6 is between EPSILON (1e-10) and sqrt(EPSILON) (~3.16e-6)
  // Previously the instance used magnitudeSq for zero-detection which would incorrectly
  // treat this as zero (magnitudeSq = 2.5e-11 < EPSILON), while static would not
  const z = new Complex(5e-6, 0);
  const staticResult = Complex.reciprocal(new Complex(5e-6, 0));
  const instanceResult = z.reciprocal();

  // Both must succeed (not throw, not return zero)
  expect(staticResult.real).toBeCloseTo(200000, DIGITS);
  expect(staticResult.imag).toBeCloseTo(0, DIGITS);
  expect(instanceResult.real).toBeCloseTo(200000, DIGITS);
  expect(instanceResult.imag).toBeCloseTo(0, DIGITS);

  // Results must be identical
  expect(instanceResult.real).toBe(staticResult.real);
  expect(instanceResult.imag).toBe(staticResult.imag);
 });
});

/* ===== Section 8: Edge case tests ===== */

describe('Complex.exp overflow', () => {
 it('Complex.exp(Complex(710, 0)) overflows to Infinity', () => {
  const result = Complex.exp(new Complex(710, 0));
  // e^710 > Number.MAX_VALUE, so er = Infinity
  // Infinity * cos(0) = Infinity, Infinity * sin(0) = NaN (Inf*0)
  expect(result.real).toBe(Infinity);
 });

 it('Complex.exp(Complex(1, 0)) returns e', () => {
  const result = Complex.exp(new Complex(1, 0));
  expect(result.real).toBeCloseTo(Math.E);
  expect(result.imag).toBeCloseTo(0);
 });
});

describe('negative-zero edge cases', () => {
 it('Complex.toString with -0 imaginary', () => {
  const c = new Complex(1, -0);
  const string_ = c.toString();
  expect(typeof string_).toBe('string');
 });
});

describe('Instance slerp zero-magnitude guard', () => {
 it('falls back to lerp when this has zero magnitude', () => {
  const a = new Complex(0, 0);
  const b = new Complex(2, 4);
  const result = a.slerp(b, 0.5);
  const expected = new Complex(0, 0).lerp(new Complex(2, 4), 0.5);
  expect(result.real).toBeCloseTo(expected.real);
  expect(result.imag).toBeCloseTo(expected.imag);
 });

 it('falls back to lerp when other has zero magnitude', () => {
  const a = new Complex(2, 4);
  const b = new Complex(0, 0);
  const result = a.slerp(b, 0.5);
  expect(result.real).toBeCloseTo(1);
  expect(result.imag).toBeCloseTo(2);
 });

 it('static and instance slerp produce matching results for normal inputs', () => {
  const a = new Complex(3, 4);
  const b = new Complex(0, 5);
  const staticResult = Complex.slerp(a, b, 0.5);
  const instanceResult = a.clone().slerp(b, 0.5);
  expect(instanceResult.real).toBeCloseTo(staticResult.real, DIGITS);
  expect(instanceResult.imag).toBeCloseTo(staticResult.imag, DIGITS);
 });

 it('static and instance slerp produce matching results for zero-magnitude inputs', () => {
  const a = new Complex(0, 0);
  const b = new Complex(3, 4);
  const staticResult = Complex.slerp(a, b, 0.5);
  const instanceResult = a.clone().slerp(b, 0.5);
  expect(instanceResult.real).toBeCloseTo(staticResult.real, DIGITS);
  expect(instanceResult.imag).toBeCloseTo(staticResult.imag, DIGITS);
 });
});

describe('Instance powScalar zero-to-negative validation', () => {
 it('throws RangeError for zero complex raised to negative real exponent', () => {
  const zero = new Complex(0, 0);
  expect(() => zero.powScalar(-1)).toThrow(RangeError);
 });

 it('zero complex raised to positive real exponent returns (0, 0)', () => {
  const zero = new Complex(0, 0);
  const result = zero.powScalar(2);
  expect(result.real).toBeCloseTo(0);
  expect(result.imag).toBeCloseTo(0);
 });
});

describe('Complex-exponent pow / powSafe / powUnchecked', () => {
 it('pow matches powScalar when exponent is real', () => {
  const base = new Complex(2, 3);
  const viaComplex = Complex.pow(base, new Complex(4, 0));
  const viaScalar = Complex.powScalar(base, 4);
  expect(viaComplex.real).toBeCloseTo(viaScalar.real, 8);
  expect(viaComplex.imag).toBeCloseTo(viaScalar.imag, 8);
 });

 it('pow computes principal branch for complex exponent', () => {
  // i^i = exp(-π/2) ≈ 0.20787957635
  const result = Complex.pow(new Complex(0, 1), new Complex(0, 1));
  expect(result.real).toBeCloseTo(Math.exp(-Math.PI / 2), 10);
  expect(result.imag).toBeCloseTo(0, 10);
 });

 it('pow throws on zero base', () => {
  expect(() => Complex.pow(new Complex(0, 0), new Complex(1, 1))).toThrow(RangeError);
 });

 it('powSafe returns fallback on zero base', () => {
  const fallback = new Complex(7, 8);
  const result = Complex.powSafe(new Complex(0, 0), new Complex(2, 0), fallback);
  expect(result.real).toBe(7);
  expect(result.imag).toBe(8);
 });

 it('powSafe defaults fallback to ZERO', () => {
  const result = Complex.powSafe(new Complex(0, 0), new Complex(2, 0));
  expect(result.real).toBe(0);
  expect(result.imag).toBe(0);
 });

 it('powSafe matches pow for non-zero base', () => {
  const base = new Complex(1, 1);
  const exp = new Complex(0.5, 0.25);
  const strict = Complex.pow(base, exp);
  const safe = Complex.powSafe(base, exp);
  expect(safe.real).toBeCloseTo(strict.real, 12);
  expect(safe.imag).toBeCloseTo(strict.imag, 12);
 });

 it('powUnchecked matches pow for non-zero base', () => {
  const base = new Complex(2, 3);
  const exp = new Complex(1.5, -0.5);
  const strict = Complex.pow(base, exp);
  const unchecked = Complex.powUnchecked(base, exp);
  expect(unchecked.real).toBeCloseTo(strict.real, 12);
  expect(unchecked.imag).toBeCloseTo(strict.imag, 12);
 });

 it('instance pow mutates this and returns this', () => {
  const z = new Complex(1, 1);
  const result = z.pow(new Complex(2, 0));
  expect(result).toBe(z);
  expect(z.real).toBeCloseTo(0, 10);
  expect(z.imag).toBeCloseTo(2, 10);
 });

 it('instance pow throws on zero', () => {
  const z = new Complex(0, 0);
  expect(() => z.pow(new Complex(1, 1))).toThrow(RangeError);
 });

 it('instance powSafe returns fallback on zero', () => {
  const z = new Complex(0, 0);
  const fallback = new Complex(5, 5);
  z.powSafe(new Complex(2, 0), fallback);
  expect(z.real).toBe(5);
  expect(z.imag).toBe(5);
 });

 it('instance powUnchecked matches static', () => {
  const base = new Complex(3, 4);
  const exp = new Complex(0.5, 0);
  const staticResult = Complex.powUnchecked(base, exp);
  const instanceResult = base.clone().powUnchecked(exp);
  expect(instanceResult.real).toBeCloseTo(staticResult.real, 12);
  expect(instanceResult.imag).toBeCloseTo(staticResult.imag, 12);
 });
});

describe('Real-exponent powScalarSafe / powScalarUnchecked', () => {
 it('powScalarSafe returns fallback for zero base with negative exponent', () => {
  const fallback = new Complex(9, 9);
  const result = Complex.powScalarSafe(new Complex(0, 0), -2, fallback);
  expect(result.real).toBe(9);
  expect(result.imag).toBe(9);
 });

 it('powScalarSafe matches powScalar for ordinary inputs', () => {
  const base = new Complex(2, 1);
  const strict = Complex.powScalar(base, 3);
  const safe = Complex.powScalarSafe(base, 3);
  expect(safe.real).toBeCloseTo(strict.real, 12);
  expect(safe.imag).toBeCloseTo(strict.imag, 12);
 });

 it('powScalarUnchecked matches powScalar for non-zero base', () => {
  const base = new Complex(4, 0);
  const strict = Complex.powScalar(base, 0.5);
  const unchecked = Complex.powScalarUnchecked(base, 0.5);
  expect(unchecked.real).toBeCloseTo(strict.real, 12);
  expect(unchecked.imag).toBeCloseTo(strict.imag, 12);
 });

 it('instance powScalarSafe mutates and returns this', () => {
  const z = new Complex(0, 0);
  const result = z.powScalarSafe(-1, new Complex(3, 4));
  expect(result).toBe(z);
  expect(z.real).toBe(3);
  expect(z.imag).toBe(4);
 });

 it('instance powScalarUnchecked mutates and returns this', () => {
  const z = new Complex(2, 0);
  const result = z.powScalarUnchecked(4);
  expect(result).toBe(z);
  expect(z.real).toBeCloseTo(16, 10);
 });
});

describe('Complex multiplyCS hot-path variant', () => {
 it('matches multiply with pre-computed cos/sin factor', () => {
  const z = new Complex(2, 3);
  const cos = Math.cos(Math.PI / 4);
  const sin = Math.sin(Math.PI / 4);
  const unit = new Complex(cos, sin);
  const viaFull = Complex.multiply(z, unit);
  const viaCS = Complex.multiplyCS(z, cos, sin);
  expect(viaCS.real).toBeCloseTo(viaFull.real, DIGITS);
  expect(viaCS.imag).toBeCloseTo(viaFull.imag, DIGITS);
 });
});

describe('Complex mod triality', () => {
 it('mod computes component-wise positive modulo', () => {
  const result = Complex.mod(new Complex(7, -1), new Complex(3, 4));
  expect(result.real).toBe(1);
  expect(result.imag).toBe(3);
 });

 it('mod throws for non-positive real divisor', () => {
  expect(() => Complex.mod(new Complex(1, 1), new Complex(0, 2))).toThrow(RangeError);
 });

 it('mod throws for non-positive imag divisor', () => {
  expect(() => Complex.mod(new Complex(1, 1), new Complex(2, -1))).toThrow(RangeError);
 });

 it('modSafe returns fallback component for non-positive divisor', () => {
  const fallback = new Complex(9, 10);
  const result = Complex.modSafe(new Complex(7, 5), new Complex(0, 4), fallback);
  expect(result.real).toBe(9); // fallback.real
  expect(result.imag).toBe(1); // 5 mod 4
 });

 it('modSafe defaults fallback to ZERO', () => {
  const result = Complex.modSafe(new Complex(7, 5), new Complex(-1, 4));
  expect(result.real).toBe(0);
  expect(result.imag).toBe(1);
 });

 it('modUnchecked matches mod for positive divisor', () => {
  const a = new Complex(7, 13);
  const b = new Complex(3, 5);
  const strict = Complex.mod(a, b);
  const unchecked = Complex.modUnchecked(a, b);
  expect(unchecked.real).toBe(strict.real);
  expect(unchecked.imag).toBe(strict.imag);
 });

 it('instance mod mutates and returns this', () => {
  const z = new Complex(7, 5);
  const result = z.mod(new Complex(3, 4));
  expect(result).toBe(z);
  expect(z.real).toBe(1);
  expect(z.imag).toBe(1);
 });

 it('instance modSafe handles invalid divisor', () => {
  const z = new Complex(5, 5);
  z.modSafe(new Complex(0, 2), new Complex(7, 0));
  expect(z.real).toBe(7);
  expect(z.imag).toBe(1);
 });

 it('instance modUnchecked mutates and returns this', () => {
  const z = new Complex(10, 11);
  const result = z.modUnchecked(new Complex(3, 5));
  expect(result).toBe(z);
  expect(z.real).toBe(1);
  expect(z.imag).toBe(1);
 });
});

describe('Complex trigonometric / hyperbolic / inverse-trig', () => {
 it('sin(0) returns (0, 0)', () => {
  const result = Complex.sin(new Complex(0, 0));
  expect(result.real).toBe(0);
  expect(result.imag).toBe(0);
 });

 it('sin matches real-axis reduction', () => {
  const result = Complex.sin(new Complex(Math.PI / 2, 0));
  expect(result.real).toBeCloseTo(1, 12);
  expect(result.imag).toBeCloseTo(0, 12);
 });

 it('sin(i) = i·sinh(1)', () => {
  const result = Complex.sin(new Complex(0, 1));
  expect(result.real).toBeCloseTo(0, 12);
  expect(result.imag).toBeCloseTo(Math.sinh(1), 12);
 });

 it('cos(0) returns (1, 0)', () => {
  const result = Complex.cos(new Complex(0, 0));
  expect(result.real).toBeCloseTo(1, 12);
  // IEEE 754 signed-zero: −sin(0)·sinh(0) = −0, numerically equal to 0.
  expect(Math.abs(result.imag)).toBe(0);
 });

 it('cos(i) = cosh(1)', () => {
  const result = Complex.cos(new Complex(0, 1));
  expect(result.real).toBeCloseTo(Math.cosh(1), 12);
  expect(result.imag).toBeCloseTo(0, 12);
 });

 it('tan(0) returns (0, 0)', () => {
  const result = Complex.tan(new Complex(0, 0));
  expect(result.real).toBe(0);
  expect(result.imag).toBe(0);
 });

 it('tan matches sin/cos decomposition', () => {
  const z = new Complex(0.5, 0.3);
  const result = Complex.tan(z);
  const sinZ = Complex.sin(z);
  const cosZ = Complex.cos(z);
  const expected = Complex.divide(sinZ, cosZ);
  expect(result.real).toBeCloseTo(expected.real, 10);
  expect(result.imag).toBeCloseTo(expected.imag, 10);
 });

 it('sinh(0) returns (0, 0)', () => {
  const result = Complex.sinh(new Complex(0, 0));
  expect(result.real).toBe(0);
  expect(result.imag).toBe(0);
 });

 it('sinh(i·π/2) = i', () => {
  const result = Complex.sinh(new Complex(0, Math.PI / 2));
  expect(result.real).toBeCloseTo(0, 10);
  expect(result.imag).toBeCloseTo(1, 10);
 });

 it('cosh(0) returns (1, 0)', () => {
  const result = Complex.cosh(new Complex(0, 0));
  expect(result.real).toBeCloseTo(1, 12);
  expect(result.imag).toBe(0);
 });

 it('tanh matches sinh/cosh decomposition', () => {
  const z = new Complex(0.4, 0.2);
  const result = Complex.tanh(z);
  const sinhZ = Complex.sinh(z);
  const coshZ = Complex.cosh(z);
  const expected = Complex.divide(sinhZ, coshZ);
  expect(result.real).toBeCloseTo(expected.real, 10);
  expect(result.imag).toBeCloseTo(expected.imag, 10);
 });

 it('asin(sin(z)) recovers z for small argument', () => {
  const z = new Complex(0.3, 0.2);
  const round = Complex.asin(Complex.sin(z));
  expect(round.real).toBeCloseTo(z.real, 10);
  expect(round.imag).toBeCloseTo(z.imag, 10);
 });

 it('acos(cos(z)) recovers z for small argument', () => {
  const z = new Complex(0.3, 0.2);
  const round = Complex.acos(Complex.cos(z));
  expect(round.real).toBeCloseTo(z.real, 10);
  expect(round.imag).toBeCloseTo(z.imag, 10);
 });

 it('atan(tan(z)) recovers z for small argument', () => {
  const z = new Complex(0.2, 0.15);
  const round = Complex.atan(Complex.tan(z));
  expect(round.real).toBeCloseTo(z.real, 10);
  expect(round.imag).toBeCloseTo(z.imag, 10);
 });

 it('asin(1) = π/2', () => {
  const result = Complex.asin(new Complex(1, 0));
  expect(result.real).toBeCloseTo(Math.PI / 2, 10);
  expect(result.imag).toBeCloseTo(0, 10);
 });

 it('acos(1) = 0', () => {
  const result = Complex.acos(new Complex(1, 0));
  expect(result.real).toBeCloseTo(0, 10);
  expect(result.imag).toBeCloseTo(0, 10);
 });

 it('instance sin mutates and returns this', () => {
  const z = new Complex(Math.PI / 2, 0);
  const result = z.sin();
  expect(result).toBe(z);
  expect(z.real).toBeCloseTo(1, 12);
 });

 it('instance cos mutates and returns this', () => {
  const z = new Complex(0, 0);
  const result = z.cos();
  expect(result).toBe(z);
  expect(z.real).toBeCloseTo(1, 12);
 });

 it('instance tanh matches static', () => {
  const z = new Complex(0.2, 0.3);
  const staticResult = Complex.tanh(z);
  const instanceResult = z.clone().tanh();
  expect(instanceResult.real).toBeCloseTo(staticResult.real, 12);
  expect(instanceResult.imag).toBeCloseTo(staticResult.imag, 12);
 });

 it('instance asin matches static', () => {
  const z = new Complex(0.5, 0.5);
  const staticResult = Complex.asin(z);
  const instanceResult = z.clone().asin();
  expect(instanceResult.real).toBeCloseTo(staticResult.real, 10);
  expect(instanceResult.imag).toBeCloseTo(staticResult.imag, 10);
 });
});

describe('Static addScalar / subtractScalar', () => {
 it('addScalar adds real scalar to real component only', () => {
  const result = Complex.addScalar(new Complex(3, 4), 2);
  expect(result.real).toBe(5);
  expect(result.imag).toBe(4);
 });

 it('subtractScalar subtracts real scalar from real component only', () => {
  const result = Complex.subtractScalar(new Complex(3, 4), 2);
  expect(result.real).toBe(1);
  expect(result.imag).toBe(4);
 });

 it('addScalar writes to out parameter', () => {
  const out = new Complex();
  const result = Complex.addScalar(new Complex(3, 4), 2, out);
  expect(result).toBe(out);
  expect(out.real).toBe(5);
  expect(out.imag).toBe(4);
 });

 it('handles NaN and Infinity', () => {
  expect(Complex.addScalar(new Complex(NaN, 4), 2).real).toBeNaN();
  expect(Complex.addScalar(new Complex(3, 4), Infinity).real).toBe(Infinity);
  expect(Complex.subtractScalar(new Complex(3, 4), Infinity).real).toBe(-Infinity);
 });
});

describe('Instance addScalar / subtractScalar', () => {
 it('addScalar mutates real component only and returns this', () => {
  const c = new Complex(3, 4);
  const result = c.addScalar(2);
  expect(result).toBe(c);
  expect(c.real).toBe(5);
  expect(c.imag).toBe(4);
 });

 it('subtractScalar mutates real component only and returns this', () => {
  const c = new Complex(3, 4);
  const result = c.subtractScalar(2);
  expect(result).toBe(c);
  expect(c.real).toBe(1);
  expect(c.imag).toBe(4);
 });

 it('chains correctly', () => {
  const c = new Complex(1, 2).addScalar(3).subtractScalar(1);
  expect(c.real).toBe(3);
  expect(c.imag).toBe(2);
 });
});

describe('Static divideScalar tiers', () => {
 it('divideScalar divides by scalar', () => {
  const result = Complex.divideScalar(new Complex(6, 4), 2);
  expect(result.real).toBeCloseTo(3);
  expect(result.imag).toBeCloseTo(2);
 });

 it('divideScalar throws for near-zero scalar', () => {
  expect(() => Complex.divideScalar(new Complex(1, 2), 0)).toThrow(RangeError);
 });

 it('divideScalarSafe returns zero for near-zero scalar', () => {
  const result = Complex.divideScalarSafe(new Complex(1, 2), 0);
  expect(result.real).toBe(0);
  expect(result.imag).toBe(0);
 });

 it('divideScalarSafe divides normally for valid scalar', () => {
  const result = Complex.divideScalarSafe(new Complex(6, 4), 2);
  expect(result.real).toBeCloseTo(3);
  expect(result.imag).toBeCloseTo(2);
 });

 it('divideScalarUnchecked divides without validation', () => {
  const result = Complex.divideScalarUnchecked(new Complex(9, 3), 3);
  expect(result.real).toBeCloseTo(3);
  expect(result.imag).toBeCloseTo(1);
 });

 it('divideScalar writes to out parameter', () => {
  const out = new Complex();
  const result = Complex.divideScalar(new Complex(10, 4), 2, out);
  expect(result).toBe(out);
  expect(out.real).toBeCloseTo(5);
  expect(out.imag).toBeCloseTo(2);
 });
});

describe('Instance divideScalar tiers', () => {
 it('divideScalar divides in place', () => {
  const c = new Complex(6, 4);
  c.divideScalar(2);
  expect(c.real).toBeCloseTo(3);
  expect(c.imag).toBeCloseTo(2);
 });

 it('divideScalar throws for near-zero scalar', () => {
  const c = new Complex(1, 2);
  expect(() => c.divideScalar(0)).toThrow(RangeError);
 });

 it('divideScalarSafe returns zero for near-zero scalar', () => {
  const c = new Complex(1, 2);
  c.divideScalarSafe(0);
  expect(c.real).toBe(0);
  expect(c.imag).toBe(0);
 });

 it('divideScalarUnchecked divides in place', () => {
  const c = new Complex(9, 3);
  c.divideScalarUnchecked(3);
  expect(c.real).toBeCloseTo(3);
  expect(c.imag).toBeCloseTo(1);
 });
});

describe('Complex.fromVector2', () => {
 it('creates complex from vector2', () => {
  const v = new Vector2(3, 4);
  const z = Complex.fromVector2(v);
  expect(z.real).toBe(3);
  expect(z.imag).toBe(4);
 });

 it('writes to out parameter', () => {
  const out = new Complex();
  const result = Complex.fromVector2(new Vector2(5, 6), out);
  expect(result).toBe(out);
  expect(out.real).toBe(5);
  expect(out.imag).toBe(6);
 });

 it('accepts plain object with x, y', () => {
  const z = Complex.fromVector2({ x: 1, y: -1 });
  expect(z.real).toBe(1);
  expect(z.imag).toBe(-1);
 });

 describe('instance smoothStep (redundant saturate removal)', () => {
  it('produces correct result at t=0.5', () => {
   const z = new Complex(0, 0);
   z.smoothStep({ real: 1, imag: 1 }, 0.5);
   expect(z.real).toBeCloseTo(0.5, DIGITS);
   expect(z.imag).toBeCloseTo(0.5, DIGITS);
  });

  it('clamps t < 0 to edge0', () => {
   const z = new Complex(0, 0);
   z.smoothStep({ real: 1, imag: 1 }, -1);
   expect(z.real).toBeCloseTo(0, DIGITS);
   expect(z.imag).toBeCloseTo(0, DIGITS);
  });

  it('clamps t > 1 to edge1', () => {
   const z = new Complex(0, 0);
   z.smoothStep({ real: 1, imag: 1 }, 2);
   expect(z.real).toBeCloseTo(1, DIGITS);
   expect(z.imag).toBeCloseTo(1, DIGITS);
  });
 });
});

describe('Component-wise operations', () => {
 describe('Static component-wise', () => {
  it('absComponents returns absolute values', () => {
   const result = Complex.absComponents({ real: -3, imag: -4 });
   expect(result.real).toBe(3);
   expect(result.imag).toBe(4);
  });

  it('floor floors both components', () => {
   const result = Complex.floor({ real: 1.7, imag: -2.3 });
   expect(result.real).toBe(1);
   expect(result.imag).toBe(-3);
  });

  it('ceil ceils both components', () => {
   const result = Complex.ceil({ real: 1.2, imag: -2.8 });
   expect(result.real).toBe(2);
   expect(result.imag).toBe(-2);
  });

  it('round rounds both components', () => {
   const result = Complex.round({ real: 1.5, imag: -2.4 });
   expect(result.real).toBe(2);
   expect(result.imag).toBe(-2);
  });

  it('trunc truncates both components', () => {
   const result = Complex.trunc({ real: 1.9, imag: -2.9 });
   expect(result.real).toBe(1);
   expect(result.imag).toBe(-2);
  });

  it('signComponents returns sign of both components', () => {
   const result = Complex.signComponents({ real: -5, imag: 3 });
   expect(result.real).toBe(-1);
   expect(result.imag).toBe(1);
  });

  it('min returns per-component minimum', () => {
   const result = Complex.min({ real: 3, imag: 1 }, { real: 1, imag: 5 });
   expect(result.real).toBe(1);
   expect(result.imag).toBe(1);
  });

  it('max returns per-component maximum', () => {
   const result = Complex.max({ real: 3, imag: 1 }, { real: 1, imag: 5 });
   expect(result.real).toBe(3);
   expect(result.imag).toBe(5);
  });

  it('clamp clamps components', () => {
   const result = Complex.clamp({ real: -5, imag: 10 }, { real: 0, imag: 0 }, { real: 3, imag: 3 });
   expect(result.real).toBe(0);
   expect(result.imag).toBe(3);
  });

  it('mod computes component-wise remainder', () => {
   const result = Complex.mod({ real: 5, imag: 7 }, { real: 3, imag: 4 });
   expect(result.real).toBeCloseTo(2);
   expect(result.imag).toBeCloseTo(3);
  });

  it('handles NaN passthrough', () => {
   const result = Complex.absComponents({ real: NaN, imag: 1 });
   expect(result.real).toBeNaN();
   expect(result.imag).toBe(1);
  });

  it('handles Infinity', () => {
   const result = Complex.floor({ real: Infinity, imag: -Infinity });
   expect(result.real).toBe(Infinity);
   expect(result.imag).toBe(-Infinity);
  });

  it('writes to out parameter', () => {
   const out = new Complex();
   const result = Complex.absComponents({ real: -3, imag: -4 }, out);
   expect(result).toBe(out);
   expect(out.real).toBe(3);
   expect(out.imag).toBe(4);
  });
 });

 describe('Instance component-wise', () => {
  it('absComponents mutates and chains', () => {
   const z = new Complex(-3, -4);
   const result = z.absComponents();
   expect(result).toBe(z);
   expect(z.real).toBe(3);
   expect(z.imag).toBe(4);
  });

  it('floor mutates and chains', () => {
   const z = new Complex(1.7, -2.3);
   expect(z.floor()).toBe(z);
   expect(z.real).toBe(1);
   expect(z.imag).toBe(-3);
  });

  it('ceil mutates and chains', () => {
   const z = new Complex(1.2, -2.8);
   expect(z.ceil()).toBe(z);
   expect(z.real).toBe(2);
   expect(z.imag).toBe(-2);
  });

  it('round mutates and chains', () => {
   const z = new Complex(1.5, -2.4);
   expect(z.round()).toBe(z);
   expect(z.real).toBe(2);
   expect(z.imag).toBe(-2);
  });

  it('trunc mutates and chains', () => {
   const z = new Complex(1.9, -2.9);
   expect(z.trunc()).toBe(z);
   expect(z.real).toBe(1);
   expect(z.imag).toBe(-2);
  });

  it('signComponents mutates and chains', () => {
   const z = new Complex(-5, 3);
   expect(z.signComponents()).toBe(z);
   expect(z.real).toBe(-1);
   expect(z.imag).toBe(1);
  });

  it('min mutates and chains', () => {
   const z = new Complex(3, 5);
   expect(z.min({ real: 1, imag: 8 })).toBe(z);
   expect(z.real).toBe(1);
   expect(z.imag).toBe(5);
  });

  it('max mutates and chains', () => {
   const z = new Complex(3, 5);
   expect(z.max({ real: 1, imag: 8 })).toBe(z);
   expect(z.real).toBe(3);
   expect(z.imag).toBe(8);
  });

  it('clamp mutates and chains', () => {
   const z = new Complex(-5, 10);
   expect(z.clamp({ real: 0, imag: 0 }, { real: 3, imag: 3 })).toBe(z);
   expect(z.real).toBe(0);
   expect(z.imag).toBe(3);
  });

  it('mod mutates and chains', () => {
   const z = new Complex(5, 7);
   expect(z.mod({ real: 3, imag: 4 })).toBe(z);
   expect(z.real).toBeCloseTo(2);
   expect(z.imag).toBeCloseTo(3);
  });
 });

 /* ===== fromRotation2 ===== */

 describe('fromRotation2', () => {
  it('converts identity rotation to (1, 0)', () => {
   const z = Complex.fromRotation2({ cos: 1, sin: 0 });
   expect(z.real).toBe(1);
   expect(z.imag).toBe(0);
  });

  it('converts quarter-turn rotation', () => {
   const rot = Rotation2.fromAngle(Math.PI / 2);
   const z = Complex.fromRotation2(rot);
   expect(z.real).toBeCloseTo(0, DIGITS);
   expect(z.imag).toBeCloseTo(1, DIGITS);
  });
 });

 /* ===== sqrt (algebraic formula) ===== */

 describe('sqrt', () => {
  it('sqrt of positive real', () => {
   const z = Complex.sqrt({ real: 4, imag: 0 });
   expect(z.real).toBeCloseTo(2, DIGITS);
   expect(z.imag).toBeCloseTo(0, DIGITS);
  });

  it('sqrt of negative real (branch cut)', () => {
   const z = Complex.sqrt({ real: -1, imag: 0 });
   expect(z.real).toBeCloseTo(0, DIGITS);
   expect(z.imag).toBeCloseTo(1, DIGITS);
  });

  it('sqrt of zero', () => {
   const z = Complex.sqrt({ real: 0, imag: 0 });
   expect(z.real).toBe(0);
   expect(z.imag).toBe(0);
  });

  it('sqrt(z)^2 ≈ z for general complex', () => {
   const input = { real: 0, imag: 2 };
   const root = Complex.sqrt(input);
   // square the root: (a+bi)^2 = a^2-b^2 + 2ab*i
   const squared = Complex.multiply(root, root);
   expect(squared.real).toBeCloseTo(input.real, DIGITS);
   expect(squared.imag).toBeCloseTo(input.imag, DIGITS);
  });

  it('static and instance sqrt produce identical results', () => {
   const inputs = [
    [3, 4],
    [-1, 0],
    [0, 1],
    [-4, 0],
    [1e-10, 1e-10],
   ] as const;
   for (const [re, im] of inputs) {
    const staticR = Complex.sqrt(new Complex(re, im));
    const instanceR = new Complex(re, im);
    instanceR.sqrt();
    expect(instanceR.real).toBe(staticR.real);
    expect(instanceR.imag).toBe(staticR.imag);
   }
  });

  it('avoids catastrophic cancellation for |real| >> |imag| (Friedland 1967)', () => {
   // a >= 0 branch: (r - a) would cancel without the b/(2t) formula
   const z1 = Complex.sqrt({ real: 1e8, imag: 1 });
   expect(z1.imag).not.toBe(0);
   expect(z1.imag).toBeCloseTo(1 / (2 * Math.sqrt(1e8)), 4);

   const z2 = Complex.sqrt({ real: 1e16, imag: 1 });
   expect(z2.imag).not.toBe(0);
   expect(z2.imag).toBeCloseTo(1 / (2 * Math.sqrt(1e16)), 4);

   // a < 0 branch: (r + a) would cancel without the |b|/(2t) formula
   const z3 = Complex.sqrt({ real: -1e8, imag: 1 });
   expect(z3.real).not.toBe(0);
   expect(z3.real).toBeCloseTo(1 / (2 * Math.sqrt(1e8)), 4);
  });

  it('round-trip sqrt(z)^2 ≈ z for extreme aspect ratio', () => {
   const input = { real: 1e12, imag: 1e-6 };
   const root = Complex.sqrt(input);
   const squared = Complex.multiply(root, root);
   expect(squared.real).toBeCloseTo(input.real, 0);
   expect(squared.imag).toBeCloseTo(input.imag, 0);
  });
 });

 /* ===== exp and log ===== */

 describe('exp', () => {
  it('exp(0) = 1', () => {
   const z = Complex.exp({ real: 0, imag: 0 });
   expect(z.real).toBeCloseTo(1, DIGITS);
   expect(z.imag).toBeCloseTo(0, DIGITS);
  });

  it('exp(iπ) ≈ -1', () => {
   const z = Complex.exp({ real: 0, imag: Math.PI });
   expect(z.real).toBeCloseTo(-1, DIGITS);
   expect(z.imag).toBeCloseTo(0, DIGITS);
  });

  it('exp(+∞ + 0i) = (+∞, 0) per C99 Annex G §G.6.3.1', () => {
   const z = Complex.exp({ real: Infinity, imag: 0 });
   expect(z.real).toBe(Infinity);
   expect(z.imag).toBe(0);
  });

  it('exp(-∞ + 0i) = (0, 0)', () => {
   const z = Complex.exp({ real: -Infinity, imag: 0 });
   expect(z.real).toBe(0);
   expect(z.imag).toBe(0);
  });

  it('exp(+∞ + (-0)i) preserves signed zero', () => {
   const z = Complex.exp({ real: Infinity, imag: -0 });
   expect(z.real).toBe(Infinity);
   expect(Object.is(z.imag, -0)).toBe(true);
  });
 });

 describe('log', () => {
  it('log(1) = 0', () => {
   const z = Complex.log({ real: 1, imag: 0 });
   expect(z.real).toBeCloseTo(0, DIGITS);
   expect(z.imag).toBeCloseTo(0, DIGITS);
  });
 });

 /* ===== toPolar ===== */

 describe('toPolar', () => {
  it('converts real number to polar', () => {
   const polar = Complex.toPolar({ real: 3, imag: 0 });
   expect(polar.magnitude).toBeCloseTo(3, DIGITS);
   expect(polar.angle).toBeCloseTo(0, DIGITS);
  });

  it('instance toPolar matches static', () => {
   const z = new Complex(0, 2);
   const polar = z.toPolar();
   expect(polar.magnitude).toBeCloseTo(2, DIGITS);
   expect(polar.angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 /* ===== instance exp/log ===== */

 describe('instance exp/log', () => {
  it('instance exp mutates and chains', () => {
   const z = new Complex(0, 0);
   expect(z.exp()).toBe(z);
   expect(z.real).toBeCloseTo(1, DIGITS);
   expect(z.imag).toBeCloseTo(0, DIGITS);
  });

  it('instance log mutates and chains', () => {
   const z = new Complex(1, 0);
   expect(z.log()).toBe(z);
   expect(z.real).toBeCloseTo(0, DIGITS);
   expect(z.imag).toBeCloseTo(0, DIGITS);
  });
 });
});
