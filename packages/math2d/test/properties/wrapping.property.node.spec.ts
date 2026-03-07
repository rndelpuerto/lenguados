/**
 * @file test/properties/wrapping.property.node.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Property-based tests for wrapping operations.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { flooredMod } from '../../src/auxiliary/numeric/wrapping';

describe('Wrapping Properties', () => {
 describe('flooredMod', () => {
  it('should always return value in [0, divisor) for positive divisor', () => {
   fc.assert(
    fc.property(fc.integer(), fc.integer({ min: 1 }), (dividend, divisor) => {
     const result = flooredMod(dividend, divisor);
     return result >= 0 && result < divisor;
    }),
   );
  });

  it('should satisfy: flooredMod(a + n*b, b) = flooredMod(a, b)', () => {
   fc.assert(
    fc.property(
     fc.integer({ min: -1000, max: 1000 }),
     fc.integer({ min: 1, max: 100 }),
     fc.integer({ min: -10, max: 10 }),
     (a, b, n) => {
      return flooredMod(a + n * b, b) === flooredMod(a, b);
     },
    ),
   );
  });
 });
});
