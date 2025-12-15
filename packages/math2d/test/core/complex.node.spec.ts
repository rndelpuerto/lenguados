import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';

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

  it('divide falls back gracefully when denominator is zero', () => {
   const a = new Complex(5, -7);
   const result = a.divide(Complex.ZERO);
   expect(result.real).toBeCloseTo(0, DIGITS);
   expect(result.imag).toBeCloseTo(0, DIGITS);
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
   const c = { real: 2, imag: 0 };
   const result = Complex.reciprocal(c);
   expect(result.real).toBeCloseTo(0.5);
  });

  it('pow static method', () => {
   expect.hasAssertions();
   const c = { real: 2, imag: 0 };
   const result = Complex.pow(c, 3);
   expect(result.real).toBeCloseTo(8);
  });

  it('sqrt static method', () => {
   expect.hasAssertions();
   const c = { real: 4, imag: 0 };
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
});
