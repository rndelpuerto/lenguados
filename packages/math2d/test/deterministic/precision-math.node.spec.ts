import { describe, expect, it } from '@jest/globals';

import { PrecisionMath } from '../../src/deterministic/precision-math';

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

 describe('safety', () => {
  it('handles non-finite inputs gracefully without throwing', () => {
   // PrecisionMath uses inline validation to avoid circular dependencies
   // Non-finite values are sanitized to 0 instead of throwing
   expect(PrecisionMath.kahanSum([1, Number.NaN])).toBe(1); // NaN → 0
   expect(PrecisionMath.kahanSum([1, Infinity])).toBe(1); // Infinity → 0
   expect(PrecisionMath.twoProduct(Infinity, 1).product).toBe(0);
   expect(PrecisionMath.twoSum(NaN, 5).sum).toBe(5); // NaN → 0
  });

  it('produces correct results with all valid inputs', () => {
   expect(PrecisionMath.kahanSum([1, 2, 3])).toBe(6);
   expect(PrecisionMath.twoSum(1, 2).sum).toBe(3);
  });
 });

 describe('Coverage - Additional Methods', () => {
  it('fastTwoSum computes sum when |a| >= |b|', () => {
   const result = PrecisionMath.fastTwoSum(10, 0.1);
   expect(result.sum).toBeCloseTo(10.1);
  });

  it('twoProduct computes product with error term', () => {
   const result = PrecisionMath.twoProduct(3, 4);
   expect(result.product).toBe(12);
  });

  it('neumaierSum handles alternating signs', () => {
   const values = [1, -1e-15, 1e-15, -1];
   const result = PrecisionMath.neumaierSum(values);
   expect(result).toBeCloseTo(0, 10);
  });
 });
});
