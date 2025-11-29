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

  it('normalize handles zero safely', () => {
   const zero = new Complex(0, 0).normalize();
   expect(zero.real).toBe(0);
   expect(zero.imag).toBeCloseTo(0, DIGITS);
  });

  it('divide falls back gracefully when denominator is zero', () => {
   const a = new Complex(5, -7);
   const result = a.divide(Complex.ZERO);
   expect(result.real).toBeCloseTo(0, DIGITS);
   expect(result.imag).toBeCloseTo(0, DIGITS);
  });

  it('reciprocal returns conjugate divided by magnitude squared', () => {
   const complex = Complex.fromPolar(2, Math.PI / 3);
   const reciprocal = complex.reciprocal();
   const product = complex.multiply(reciprocal);
   expect(product.equals(Complex.ONE)).toBe(true);
  });
 });

 describe('Interpolation', () => {
  it('lerp clamps interpolation factor', () => {
   const start = new Complex(0, 0);
   const end = new Complex(10, 10);
   const overshoot = start.lerp(end, 2);
   expect(overshoot.real).toBe(10);
   expect(overshoot.imag).toBe(10);
  });

  it('slerp blends magnitude and angle', () => {
   const a = Complex.fromPolar(1, 0);
   const b = Complex.fromPolar(2, Math.PI);
   const mid = a.slerp(b, 0.5);
   expect(mid.magnitude()).toBeCloseTo(1.5, DIGITS);
   expect(Math.abs(mid.argument())).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('lerp honors out parameter', () => {
   const start = new Complex(1, 1);
   const end = new Complex(3, 5);
   const out = new Complex();
   const returned = start.lerp(end, 0.5, out);
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
});
