/**
 * @file test/properties/arithmetic.property.node.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Property-based tests for scalar arithmetic.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { clamp, remap } from '../../src/auxiliary/scalar/arithmetic';

describe('Arithmetic Properties', () => {
 describe('clamp', () => {
  it('should always return value in [min, max]', () => {
   fc.assert(
    fc.property(
     fc.double({ noNaN: true, noDefaultInfinity: true }),
     fc.double({ noNaN: true, noDefaultInfinity: true }),
     fc.double({ noNaN: true, noDefaultInfinity: true }),
     (value, a, b) => {
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      const result = clamp(value, min, max);
      return result >= min && result <= max;
     },
    ),
   );
  });

  it('should not modify value if within range', () => {
   fc.assert(
    fc.property(
     fc.double({ min: -100, max: 100, noNaN: true }),
     fc.double({ min: 0, max: 10, noNaN: true }),
     (center, margin) => {
      const min = center - margin;
      const max = center + margin;
      return clamp(center, min, max) === center;
     },
    ),
   );
  });
 });

 describe('remap', () => {
  // Note: Using smaller ranges to avoid floating-point precision issues
  // The mathematical property is correct, but extreme values cause precision loss
  it('should map inMin to outMin and inMax to outMax', () => {
   fc.assert(
    fc.property(
     fc.double({ min: -1000, max: 1000, noNaN: true }),
     fc.double({ min: 0.1, max: 100, noNaN: true }), // inDiff (strictly positive for stability)
     fc.double({ min: -1000, max: 1000, noNaN: true }),
     fc.double({ min: -1000, max: 1000, noNaN: true }),
     (inMin, inDiff, outMin, outDiff) => {
      // Ensure non-zero range
      const inMax = inMin + (inDiff === 0 ? 1 : inDiff);
      const outMax = outMin + outDiff;
      const r1 = remap(inMin, inMin, inMax, outMin, outMax);
      const r2 = remap(inMax, inMin, inMax, outMin, outMax);
      return Math.abs(r1 - outMin) < 1e-5 && Math.abs(r2 - outMax) < 1e-5;
     },
    ),
   );
  });

  it('should be reversible (approx): remap(remap(x,...),...) ≈ x', () => {
   fc.assert(
    fc.property(
     fc.double({ min: -1000, max: 1000, noNaN: true }), // val
     fc.double({ min: -1000, max: 1000, noNaN: true }), // inMin
     fc.double({ min: 1, max: 1000, noNaN: true }), // inRange
     fc.double({ min: -1000, max: 1000, noNaN: true }), // outMin
     fc.double({ min: 1, max: 1000, noNaN: true }), // outRange
     (value, inMin, inRange, outMin, outRange) => {
      const inMax = inMin + inRange;
      const outMax = outMin + outRange;

      const mapped = remap(value, inMin, inMax, outMin, outMax);
      const reversed = remap(mapped, outMin, outMax, inMin, inMax);

      // Relative error might be needed, but absolute for reasonable range is fine
      return Math.abs(reversed - value) < 1e-4;
     },
    ),
   );
  });
 });
});
