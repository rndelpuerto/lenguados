/**
 * @file test/properties/wrapping.property.node.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Property-based tests for wrapping operations.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { flooredMod, repeat } from '../../src/auxiliary/numeric/wrapping';

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

 describe('repeat', () => {
  it('should always return value in [0, length)', () => {
   fc.assert(
    fc.property(
     fc.double({ min: -10000, max: 10000, noNaN: true }),
     fc.double({ min: 0.1, max: 100, noNaN: true }),
     (value, length) => {
      const result = repeat(value, length);
      return result >= -1e-9 && result < length + 1e-9; // Tolerance for float precision
     },
    ),
   );
  });

  it('should be periodic: repeat(v + length, length) ≈ repeat(v, length)', () => {
   fc.assert(
    fc.property(
     // Use only integers to avoid floating-point precision at exact boundaries
     // (e.g., 0.3/0.1 ≠ 3.0 in IEEE 754 due to representation errors)
     fc.integer({ min: -1000, max: 1000 }),
     fc.integer({ min: 1, max: 100 }),
     (v, length) => {
      const p1 = repeat(v, length);
      const p2 = repeat(v + length, length);
      // Exact comparison works for integers
      return p1 === p2;
     },
    ),
   );
  });
 });
});
