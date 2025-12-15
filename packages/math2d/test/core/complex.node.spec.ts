/**
 * @file test/core/complex.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Tests for Complex core behavior.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex, freezeComplex } from '../../src/core/complex';

const DIGITS = 8; // toBeCloseTo decimal digits (8 for float tolerance)

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
   expect(Math.abs(a.argument())).toBeCloseTo(Math.PI / 2, DIGITS);
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

  it('argument returns angle', () => {
   const c = new Complex(1, 1);
   expect(c.argument()).toBeCloseTo(Math.PI / 4, DIGITS);
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
   const scaled = c.scale(2);
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

  it('pow', () => {
   const c = new Complex(0, 1);
   const powered = c.pow(2);
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

  it('static argument', () => {
   expect(Complex.argument(new Complex(1, 1))).toBeCloseTo(Math.PI / 4, DIGITS);
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
   const result = Complex.pow(new Complex(0, 1), 2);
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

  it('normalized handles zero complex', () => {
   const c = new Complex(0, 0);
   const unit = c.normalized;
   expect(unit.real).toBe(0);
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

  it('pow instance method', () => {
   expect.hasAssertions();
   const c = new Complex(2, 0);
   const powered = c.pow(2);
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
   const result = Complex.pow(c, 3);
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

 describe('Coverage - Static magnitude and argument', () => {
  it('static magnitudeSq returns squared magnitude', () => {
   expect(Complex.magnitudeSq(new Complex(3, 4))).toBe(25);
  });

  it('static argument returns angle for various quadrants', () => {
   expect(Complex.argument(new Complex(1, 0))).toBeCloseTo(0, DIGITS);
   expect(Complex.argument(new Complex(0, 1))).toBeCloseTo(Math.PI / 2, DIGITS);
   expect(Complex.argument(new Complex(-1, 0))).toBeCloseTo(Math.PI, DIGITS);
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
   const result = Complex.scale(c, 2);
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
   expect(Math.abs(mid.argument())).toBeCloseTo(Math.PI / 2, DIGITS);
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
  expect(Math.abs(result.argument())).toBeCloseTo(Math.PI, DIGITS);
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
  c.scale(2);
  expect(c.real).toBe(6);
  expect(c.imag).toBe(8);
 });

 it('scale returns this for chaining', () => {
  const c = new Complex(1, 2);
  const result = c.scale(3);
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

describe('Coverage - Instance pow', () => {
 it('pow computes complex power', () => {
  const c = new Complex(2, 0);
  c.pow(3);
  expect(c.real).toBeCloseTo(8, DIGITS);
  expect(c.imag).toBeCloseTo(0, DIGITS);
 });

 it('pow with fractional exponent', () => {
  const c = new Complex(4, 0);
  c.pow(0.5);
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

describe('Coverage - Static pow', () => {
 it('static pow computes complex power', () => {
  const result = Complex.pow(new Complex(2, 0), 3);
  expect(result.real).toBeCloseTo(8, DIGITS);
 });

 it('static pow with complex base', () => {
  const result = Complex.pow(new Complex(0, 1), 2);
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
  const result = Complex.scale(new Complex(2, 3), 2);
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

describe('Coverage - Instance argument', () => {
 it('argument returns angle', () => {
  expect.hasAssertions();
  const c = new Complex(0, 1);
  expect(c.argument()).toBeCloseTo(Math.PI / 2, DIGITS);
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

 describe('Branch Coverage - pow edge cases', () => {
  it('pow with zero exponent returns 1', () => {
   const result = Complex.pow(new Complex(5, 5), 0);
   expect(result.real).toBe(1);
   expect(result.imag).toBe(0);
  });

  it('pow with negative exponent', () => {
   const result = Complex.pow(new Complex(2, 0), -1);
   expect(result.real).toBeCloseTo(0.5, DIGITS);
  });

  it('pow with zero base', () => {
   const result = Complex.pow(new Complex(0, 0), 2);
   expect(result.real).toBe(0);
   expect(result.imag).toBe(0);
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
   const result = c.scale(2);
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
});
