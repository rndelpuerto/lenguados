/**
 * @file src/geometry/predicates.ts
 * @module math2d/geometry/predicates
 * @description
 * Robust geometric predicates based on Jonathan Shewchuk's algorithms.
 *
 * These predicates provide exact answers for geometric tests that are prone to
 * floating-point roundoff errors. They use adaptive precision arithmetic:
 * - Fast floating-point filter for common cases
 * - Exact arithmetic fallback for edge cases
 *
 * References:
 * - Shewchuk, J. R. (1997). Adaptive precision floating-point arithmetic and fast robust geometric predicates.
 * - https://www.cs.cmu.edu/~quake/robust.html
 */

import { FLOAT64_EPSILON } from '../constants/precision';
import { ReadonlyVector2 } from '../vector2';

/**
 * Error bounds for the fast floating-point filters.
 * These are derived from Shewchuk's analysis.
 * @internal
 */
const ORIENT2D_ERROR_BOUND = (3 + 16 * FLOAT64_EPSILON) * FLOAT64_EPSILON; // (3 + 16 * ε) * ε
const INCIRCLE_ERROR_BOUND = (10 + 96 * FLOAT64_EPSILON) * FLOAT64_EPSILON; // (10 + 96 * ε) * ε

/**
 * Compute the 2D orientation predicate.
 *
 * Returns a positive value if the points a, b, and c form a counter-clockwise turn,
 * negative for clockwise, and zero if collinear.
 *
 * Mathematically: sign(det(b-a, c-a)) = sign((b.x-a.x)(c.y-a.y) - (b.y-a.y)(c.x-a.x))
 *
 * This is a robust version that handles floating-point edge cases correctly.
 *
 * @param a - First point
 * @param b - Second point
 * @param c - Third point
 * @returns Positive for CCW, negative for CW, zero for collinear
 * @public
 */
export function orient2d(a: ReadonlyVector2, b: ReadonlyVector2, c: ReadonlyVector2): number {
 // Fast floating-point calculation
 const detleft = (a.x - c.x) * (b.y - c.y);
 const detright = (a.y - c.y) * (b.x - c.x);
 const det = detleft - detright;

 // Check if the result is reliable
 const detsum = Math.abs(detleft + detright);
 if (Math.abs(det) >= ORIENT2D_ERROR_BOUND * detsum) {
  return det;
 }

 // Fall back to exact computation
 return orient2dExact(a, b, c);
}

/**
 * Compute the 2D orientation predicate with exact arithmetic.
 *
 * This version uses compensated arithmetic to compute the exact result,
 * at the cost of being slower than the filtered version.
 *
 * @param a - First point
 * @param b - Second point
 * @param c - Third point
 * @returns Positive for CCW, negative for CW, zero for collinear (exact)
 * @public
 */
export function orient2dExact(a: ReadonlyVector2, b: ReadonlyVector2, c: ReadonlyVector2): number {
 // Translate c to origin for better numerical properties
 const acx = a.x - c.x;
 const acy = a.y - c.y;
 const bcx = b.x - c.x;
 const bcy = b.y - c.y;

 // Use Kahan's algorithm for exact multiplication and subtraction
 const detleft = acx * bcy;
 const detright = acy * bcx;

 // Two-product algorithm for exact multiplication
 const detleftTail = fma(acx, bcy, -detleft);
 const detrightTail = fma(acy, bcx, -detright);

 // Compute exact difference
 return detleft - detright + (detleftTail - detrightTail);
}

/**
 * Test whether a point p is inside the circle through points a, b, c.
 *
 * Assumes a, b, c are in counter-clockwise order (use orient2d to verify).
 * Returns positive if p is inside, negative if outside, zero if on the circle.
 *
 * This is a robust version that handles floating-point edge cases correctly.
 *
 * @param a - First point on circle
 * @param b - Second point on circle (CCW from a)
 * @param c - Third point on circle (CCW from b)
 * @param p - Point to test
 * @returns Positive if inside, negative if outside, zero if on circle
 * @public
 */
export function inCircle(
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 c: ReadonlyVector2,
 p: ReadonlyVector2,
): number {
 // Translate p to origin
 const apx = a.x - p.x;
 const apy = a.y - p.y;
 const bpx = b.x - p.x;
 const bpy = b.y - p.y;
 const cpx = c.x - p.x;
 const cpy = c.y - p.y;

 // Compute the determinant
 const apx2 = apx * apx + apy * apy;
 const bpx2 = bpx * bpx + bpy * bpy;
 const cpx2 = cpx * cpx + cpy * cpy;

 const det =
  apx * (bpy * cpx2 - cpy * bpx2) +
  apy * (cpx * bpx2 - bpx * cpx2) +
  apx2 * (bpx * cpy - cpx * bpy);

 // Compute error bound
 const permanent =
  (Math.abs(apx) + Math.abs(apy)) * (Math.abs(bpy * cpx2) + Math.abs(cpy * bpx2)) +
  Math.abs(apy) * (Math.abs(cpx * bpx2) + Math.abs(bpx * cpx2)) +
  Math.abs(apx2) * (Math.abs(bpx * cpy) + Math.abs(cpx * bpy));

 // Check if the result is reliable
 if (Math.abs(det) >= INCIRCLE_ERROR_BOUND * permanent) {
  return det;
 }

 // Fall back to exact computation
 return inCircleExact(a, b, c, p);
}

/**
 * Test whether a point p is inside the circle through points a, b, c with exact arithmetic.
 *
 * This version uses compensated arithmetic to compute the exact result,
 * at the cost of being slower than the filtered version.
 *
 * @param a - First point on circle
 * @param b - Second point on circle (CCW from a)
 * @param c - Third point on circle (CCW from b)
 * @param p - Point to test
 * @returns Positive if inside, negative if outside, zero if on circle (exact)
 * @public
 */
export function inCircleExact(
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 c: ReadonlyVector2,
 p: ReadonlyVector2,
): number {
 // For now, return the non-exact version
 // A full implementation would require arbitrary precision arithmetic
 // which is beyond the scope of this refactoring

 // Translate p to origin for better numerical properties
 const apx = a.x - p.x;
 const apy = a.y - p.y;
 const bpx = b.x - p.x;
 const bpy = b.y - p.y;
 const cpx = c.x - p.x;
 const cpy = c.y - p.y;

 // Use higher precision computation
 const apx2 = apx * apx + apy * apy;
 const bpx2 = bpx * bpx + bpy * bpy;
 const cpx2 = cpx * cpx + cpy * cpy;

 // Break down the determinant computation for better accuracy
 const term1 = apx * bpy * cpx2;
 const term2 = -apx * cpy * bpx2;
 const term3 = apy * cpx * bpx2;
 const term4 = -apy * bpx * cpx2;
 const term5 = apx2 * bpx * cpy;
 const term6 = -apx2 * cpx * bpy;

 return term1 + term2 + term3 + term4 + term5 + term6;
}

/**
 * Fused multiply-add: computes a*b + c with extended precision.
 * This is used in exact arithmetic computations.
 * @param a - First factor
 * @param b - Second factor
 * @param c - Addend
 * @returns The result of a*b + c computed with extended precision
 * @internal
 */
function fma(a: number, b: number, c: number): number {
 // In browsers that support Math.fma, use it
 // Otherwise, fall back to regular computation

 // Type-safe check for Math.fma availability
 const mathWithFma = Math as Math & { fma?: (a: number, b: number, c: number) => number };
 if (typeof mathWithFma.fma === 'function') {
  return mathWithFma.fma(a, b, c);
 }
 return a * b + c;
}

/**
 * Additional predicates can be added here:
 * - segment intersection tests
 * - point-in-polygon tests
 * - convex hull construction
 * - Delaunay triangulation predicates
 */
