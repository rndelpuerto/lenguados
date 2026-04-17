/**
 * @file stress/arbitraries.ts
 * @description Lab-specific fast-check arbitraries for stress testing
 *
 * Defines arbitraries not present in math2d's test suite, targeting
 * overflow boundaries, subnormal ranges, near-singular matrices,
 * and ill-conditioned systems.
 *
 * Follows the conventions from testing-deep-patterns.md:
 * - arbOverflowVector2: components above sqrt(MAX_VALUE/2) ≈ 1.34e154
 * - arbSubnormalVector2: components near Number.MIN_VALUE
 */

import * as fc from 'fast-check';

/**
 * The overflow threshold from testing-deep-patterns.md
 *
 * Above this value, naive x*x + y*y overflows to Infinity,
 * but hypot(x, y) remains safe.
 */
export const OVERFLOW_THRESHOLD = Math.sqrt(Number.MAX_VALUE / 2);

/**
 * Vector2-like with components at overflow boundary
 *
 * Tests that Default/Safe tiers use hypot (overflow-safe)
 * while Unchecked uses Math.sqrt(x*x + y*y) per convention.
 */
export const arbOverflowVector2 = fc
 .tuple(
  fc.double({ min: OVERFLOW_THRESHOLD * 1.01, max: 1e200, noNaN: true, noDefaultInfinity: true }),
  fc.double({ min: OVERFLOW_THRESHOLD * 1.01, max: 1e200, noNaN: true, noDefaultInfinity: true }),
 )
 .map(([x, y]) => ({ x, y }));

/**
 * Vector2-like with components near the subnormal range
 *
 * Tests underflow behavior near Number.MIN_VALUE (5e-324).
 */
export const arbSubnormalVector2 = fc
 .tuple(
  fc.double({ min: Number.MIN_VALUE, max: 1e-300, noNaN: true, noDefaultInfinity: true }),
  fc.double({ min: Number.MIN_VALUE, max: 1e-300, noNaN: true, noDefaultInfinity: true }),
 )
 .map(([x, y]) => ({ x, y }));

/**
 * Matrix2-like with determinant between 1e-15 and 1e-5
 *
 * Crosses the MIN_SAFE_DIVISOR = 1e-10 boundary for near-singular testing.
 *
 * Constructed as: [[1, t], [t, 1+epsilon]] where epsilon controls the determinant.
 * det = 1+epsilon - t^2. By choosing t close to 1, det becomes small.
 */
export const arbNearSingularMatrix2 = fc
 .double({ min: 1e-15, max: 1e-5, noNaN: true, noDefaultInfinity: true })
 .map((targetDet) => {
  // det = m00*m11 - m01*m10
  // Set m00=1, m01=1, m10=1, m11 = 1 + targetDet
  // Then det = 1*(1+targetDet) - 1*1 = targetDet
  return {
   m00: 1,
   m01: 1,
   m10: 1,
   m11: 1 + targetDet,
  };
 });

/**
 * Matrix3-like with high condition number (> 1e8)
 *
 * Tests numerical stability of inversion and decomposition.
 *
 * Uses a diagonal matrix with extreme element ratio to produce
 * a known condition number.
 */
export const arbIllConditionedMatrix3 = fc
 .double({ min: 1e8, max: 1e14, noNaN: true, noDefaultInfinity: true })
 .map((conditionNumber) => {
  // Diagonal matrix: diag(conditionNumber, 1, 1)
  // Condition number = max(singular values) / min(singular values) = conditionNumber
  return {
   m00: conditionNumber,
   m01: 0,
   m02: 0,
   m10: 0,
   m11: 1,
   m12: 0,
   m20: 0,
   m21: 0,
   m22: 1,
  };
 });

/** IEEE 754 special values for edge-case grid testing */
export const IEEE754_SPECIAL_VALUES = [
 +0,
 -0,
 NaN,
 Infinity,
 -Infinity,
 Number.MAX_VALUE,
 Number.MIN_VALUE,
 Number.EPSILON,
 Number.MAX_SAFE_INTEGER,
 Number.MIN_SAFE_INTEGER,
] as const;

/**
 * Generate the cartesian product of special values for binary operations
 *
 * @returns Array of all (a, b) pairs from IEEE754_SPECIAL_VALUES
 */
export function specialValuePairs(): Array<[number, number]> {
 const pairs: Array<[number, number]> = [];
 for (const a of IEEE754_SPECIAL_VALUES) {
  for (const b of IEEE754_SPECIAL_VALUES) {
   pairs.push([a, b]);
  }
 }
 return pairs;
}
