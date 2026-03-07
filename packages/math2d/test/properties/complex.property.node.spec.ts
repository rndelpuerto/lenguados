/**
 * @file test/properties/complex.property.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Property-based tests for Complex numbers.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Complex } from '../../src/core/complex';
import { arbComplex, arbNonZeroComplex, arbUnitComplex, arbAngle } from '../arbitraries';

const TEST_TOLERANCE = 1e-6;

describe('Complex Property-Based Tests', () => {
 // ========================================================================
 // Arithmetic Properties
 // ========================================================================

 describe('Arithmetic', () => {
  it('should satisfy: a + b = b + a (commutativity)', () => {
   fc.assert(
    fc.property(arbComplex, arbComplex, (a, b) => {
     const ab = Complex.add(a, b);
     const ba = Complex.add(b, a);
     return Complex.nearEquals(ab, ba);
    }),
   );
  });

  it('should satisfy: a * b = b * a (commutativity)', () => {
   fc.assert(
    fc.property(arbComplex, arbComplex, (a, b) => {
     const ab = Complex.multiply(a, b);
     const ba = Complex.multiply(b, a);
     return Complex.nearEquals(ab, ba);
    }),
   );
  });

  it('should satisfy: (a + b) + c = a + (b + c) (associativity)', () => {
   fc.assert(
    fc.property(arbComplex, arbComplex, arbComplex, (a, b, c) => {
     const left = Complex.add(Complex.add(a, b), c);
     const right = Complex.add(a, Complex.add(b, c));
     return Complex.nearEquals(left, right);
    }),
   );
  });

  it('should satisfy: a + 0 = a (identity)', () => {
   fc.assert(
    fc.property(arbComplex, (a) => {
     const result = Complex.add(a, Complex.ZERO);
     return Complex.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: a * 1 = a (identity)', () => {
   fc.assert(
    fc.property(arbComplex, (a) => {
     const result = Complex.multiply(a, Complex.ONE);
     return Complex.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: a - a = 0', () => {
   fc.assert(
    fc.property(arbComplex, (a) => {
     const result = Complex.subtract(a, a);
     return Complex.nearEquals(result, Complex.ZERO);
    }),
   );
  });
 });

 // ========================================================================
 // Polar/Rectangular Conversion
 // ========================================================================

 describe('Polar Conversion', () => {
  it('should satisfy: fromPolar(r, θ).magnitude() ≈ r', () => {
   fc.assert(
    fc.property(
     fc.integer({ min: 1, max: 10000 }).map((n) => n),
     arbAngle,
     (r, theta) => {
      const c = Complex.fromPolar(r, theta);
      return Math.abs(c.magnitude() - r) < TEST_TOLERANCE * r;
     },
    ),
   );
  });

  it('should satisfy: normalize then magnitude = 1', () => {
   fc.assert(
    fc.property(arbNonZeroComplex, (c) => {
     const normalized = Complex.normalize(c.clone());
     const mag = normalized.magnitude();
     return Math.abs(mag - 1) < TEST_TOLERANCE;
    }),
   );
  });
 });

 // ========================================================================
 // Division Properties
 // ========================================================================

 describe('Division', () => {
  it('should satisfy: a / a = 1 for non-zero a', () => {
   fc.assert(
    fc.property(arbNonZeroComplex, (a) => {
     const result = Complex.divide(a.clone(), a);
     return Complex.nearEquals(result, Complex.ONE, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: (a * b) / b = a for non-zero b', () => {
   fc.assert(
    fc.property(arbComplex, arbNonZeroComplex, (a, b) => {
     const product = Complex.multiply(a, b);
     const result = Complex.divide(product, b);
     // Use relative tolerance for large values
     const maxMag = Math.max(a.magnitude(), 1);
     return Complex.nearEquals(result, a, TEST_TOLERANCE * maxMag);
    }),
   );
  });
 });

 // ========================================================================
 // Conjugate Properties
 // ========================================================================

 describe('Conjugate', () => {
  it('should satisfy: conjugate(conjugate(z)) = z', () => {
   fc.assert(
    fc.property(arbComplex, (z) => {
     const result = Complex.conjugate(Complex.conjugate(z.clone()));
     return Complex.exactEquals(result, z);
    }),
   );
  });

  it('should satisfy: z * conjugate(z) = |z|²', () => {
   fc.assert(
    fc.property(arbComplex, (z) => {
     const product = Complex.multiply(z, Complex.conjugate(z.clone()));
     const magSq = z.magnitudeSq();
     // Product should be real (imag ≈ 0) and equal to magnitude squared
     return (
      Math.abs(product.imag) < TEST_TOLERANCE && Math.abs(product.real - magSq) < TEST_TOLERANCE
     );
    }),
   );
  });
 });

 // ========================================================================
 // Interpolation Properties
 // ========================================================================

 describe('Interpolation', () => {
  it('should satisfy: lerp(a, b, 0) = a', () => {
   fc.assert(
    fc.property(arbComplex, arbComplex, (a, b) => {
     const result = Complex.lerp(a, b, 0);
     return Complex.nearEquals(result, a, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: lerp(a, b, 1) = b', () => {
   fc.assert(
    fc.property(arbComplex, arbComplex, (a, b) => {
     const result = Complex.lerp(a, b, 1);
     return Complex.nearEquals(result, b, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: lerp(a, a, t) = a', () => {
   fc.assert(
    fc.property(arbComplex, fc.float({ min: -2, max: 2, noNaN: true }), (a, t) => {
     const result = Complex.lerp(a, a, t);
     return Complex.nearEquals(result, a, TEST_TOLERANCE);
    }),
   );
  });
 });

 // ========================================================================
 // Unit Complex Properties
 // ========================================================================

 describe('Unit Complex', () => {
  it('should satisfy: unit complex has magnitude 1', () => {
   fc.assert(
    fc.property(arbUnitComplex, (c) => {
     // Unit complex from polar should be very close to magnitude 1
     // Using TEST_TOLERANCE since floating-point trig operations accumulate error
     return Math.abs(c.magnitude() - 1) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: unit complex multiplication preserves magnitude', () => {
   fc.assert(
    fc.property(arbUnitComplex, arbUnitComplex, (a, b) => {
     const product = Complex.multiply(a, b);
     return Math.abs(product.magnitude() - 1) < TEST_TOLERANCE;
    }),
   );
  });
 });

 // ========================================================================
 // Exp/Log Properties
 // ========================================================================

 describe('Exp/Log', () => {
  it('should satisfy: exp(log(z)) ≈ z for non-zero z', () => {
   fc.assert(
    fc.property(arbNonZeroComplex, (z) => {
     const roundTrip = Complex.exp(Complex.log(z));
     const maxMag = Math.max(z.magnitude(), 1);
     return Complex.nearEquals(roundTrip, z, TEST_TOLERANCE * maxMag);
    }),
   );
  });
 });
});
