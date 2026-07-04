/**
 * @file test/properties/arithmetic.property.node.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Property-based tests for scalar arithmetic.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { clamp } from '../../src/auxiliary/scalar/arithmetic';

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
});
