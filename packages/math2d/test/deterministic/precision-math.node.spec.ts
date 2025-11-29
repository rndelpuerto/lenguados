import { describe, expect, it } from '@jest/globals';

import { PrecisionMath } from '../../src/deterministic/precision-math';
import { ValidationMode, withValidationConfig } from '../../src/validation/validation-mode';

describe('PrecisionMath', () => {
 describe('summations', () => {
  it('kahanSum maintains precision', () => {
   const values = new Array(1000).fill(0.1);
   const standard = values.reduce((sum, value) => sum + value, 0);
   const kahan = PrecisionMath.kahanSum(values);
   expect(Math.abs(100 - kahan)).toBeLessThan(Math.abs(100 - standard));
   expect(kahan).toBeCloseTo(100, 6);
  });

  it('neumaierSum handles varied magnitudes', () => {
   const values = [1e20, 1, -1e20];
   const standard = values.reduce((sum, value) => sum + value, 0);
   const neumaier = PrecisionMath.neumaierSum(values);
   expect(standard).toBe(0);
   expect(neumaier).toBeCloseTo(1, 10);
  });
 });

 describe('twoSum/twoProduct', () => {
  it('twoSum captures error term', () => {
   const { sum, error } = PrecisionMath.twoSum(1e20, 1);
   expect(sum).toBe(1e20);
   expect(error).toBe(1);
  });

  it('twoProduct captures error term', () => {
   const { product, error } = PrecisionMath.twoProduct(1e10, 1e-5);
   const exact = 1e5;
   expect(product + error).toBeCloseTo(exact, 5);
  });
 });

 describe('compensated operations', () => {
  it('compensatedProduct tracks errors', () => {
   const { value, error } = PrecisionMath.compensatedProduct([1e10, 1e-10, 3]);
   expect(value + error).toBeCloseTo(3, 5);
  });

  it('compensatedDot handles mixed magnitudes', () => {
   const a = [1e20, 1, -1e20];
   const b = [1, 1, 1];
   const { value, error } = PrecisionMath.compensatedDot(a, b);
   expect(value + error).toBeCloseTo(1, 6);
  });
 });

 describe('extendedSum', () => {
  it('combines compensated results', () => {
   const inputs = [
    { value: 1e20, error: 1 },
    { value: -1e20, error: -1 },
    { value: 0.25, error: 0.25 },
   ];
   const { value, error } = PrecisionMath.extendedSum(inputs);
   expect(value + error).toBeCloseTo(0.5, 10);
  });
 });

 describe('validation', () => {
  it('throws on non-finite inputs in strict mode', () => {
   expect(() =>
    withValidationConfig({ mode: ValidationMode.STRICT }, () =>
     PrecisionMath.kahanSum([1, Number.NaN]),
    ),
   ).toThrow();
   expect(() =>
    withValidationConfig({ mode: ValidationMode.STRICT }, () =>
     PrecisionMath.twoProduct(Infinity, 1),
    ),
   ).toThrow();
  });
 });
});
