/**
 * @file utils/random.ts
 * @module @lenguados/math2d/utils
 * @description Deterministic random generation utilities for 2D mathematical objects
 *
 * @remarks
 * Implementation based on well-established sampling and distribution techniques:
 * - Polar coordinates with sqrt(r) for uniform area distribution
 * - Box-Muller transform for Gaussian sampling
 * - Rejection sampling and barycentric coordinates for bounded regions
 *
 * Distribution guarantees:
 * - Points in/on circles use polar coordinates with sqrt(r) for uniform area distribution
 * - Rotations use uniform angle distribution
 *
 * **Determinism Guarantee**: All mathematical operations use deterministic kernels
 * for cross-platform reproducibility. When using a {@link SeededRandomSource},
 * results are guaranteed to be identical across different JavaScript engines.
 *
 * Functions use:
 * - `sin/cos` for trigonometry
 * - `sqrtSafe` for square roots
 * - `log` for natural logarithm
 *
 * @example
 * ```typescript
 * // Reproducible random generation
 * const source = new SeededRandomSource(12345);
 * const v1 = randomUnitVector2(new Vector2(), source);
 *
 * // Same seed = same result
 * const source2 = new SeededRandomSource(12345);
 * const v2 = randomUnitVector2(new Vector2(), source2);
 * // v1.exactEquals(v2) === true
 * ```
 */

import { sinCos } from '../auxiliary/angle/operations';
import { sqrtSafe } from '../auxiliary/numeric/safety';
import { TAU } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { Complex } from '../core/complex';
import { Interval } from '../core/interval';
import { Matrix2 } from '../core/matrix2';
import { Rotation2 } from '../core/rotation2';
import { Transform2 } from '../core/transform2';
import { Vector2 } from '../core/vector2';
import { log } from '../deterministic/deterministic-kernels';
import type { ReadonlyVector2Like } from '../types';
import { assertNonNegative } from '../validation/assert';

import { type RandomSource, getDefaultRandomSource } from './random-source';

/* ========================================================================== */
/* Random Vectors                                                             */
/* ========================================================================== */

/**
 * Generates a random 2D vector with components in range [min, max)
 *
 * @remarks
 * Each component is sampled independently with a uniform distribution.
 *
 * @param min - Minimum component value. Defaults to `0`
 * @param max - Maximum component value (exclusive). Defaults to `1`
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector containing the random components
 *
 * @example
 * ```typescript
 * const v = randomVector2(-1, 1);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomVector2(
 min = 0,
 max = 1,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 const range = max - min;
 return out.set(source.next() * range + min, source.next() * range + min);
}

/**
 * Generates a random unit vector
 *
 * @remarks
 * Uses a uniform distribution over the unit circle.
 *
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a unit-length direction
 *
 * @example
 * ```typescript
 * const dir = randomUnitVector2();
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomUnitVector2(
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 const angle = source.next() * TAU;
 const { sin, cos } = sinCos(angle);
 return out.set(cos, sin);
}

/* ========================================================================== */
/* Random Circles                                                             */
/* ========================================================================== */

/**
 * Generates a random point on a circle's circumference
 *
 * @remarks
 * Uses a uniform distribution along the perimeter. `radius` should be non-negative.
 *
 * @param radius - Circle radius. Defaults to `1`
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point on the circle
 *
 * @example
 * ```typescript
 * const p = randomOnCircle(2);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomOnCircle(
 radius = 1,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 // Development assertion: negative radius produces inverted points (likely a bug)
 if (__LENGUADOS_DEV__) {
  assertNonNegative(radius, 'randomOnCircle:radius');
 }
 const angle = source.next() * TAU;
 const { sin, cos } = sinCos(angle);
 return out.set(cos * radius, sin * radius);
}

/**
 * Generates a random point inside a unit circle
 *
 * @remarks
 * Uses sqrt(r) in polar coordinates to achieve uniform area distribution.
 *
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point inside the unit circle
 *
 * @example
 * ```typescript
 * const p = randomInUnitCircle();
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInUnitCircle(
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 // sqrt(r) gives uniform distribution by area
 // Use sqrtSafe for cross-platform reproducibility
 const r = sqrtSafe(source.next());
 const angle = source.next() * TAU;
 const { sin, cos } = sinCos(angle);
 return out.set(cos * r, sin * r);
}

/**
 * Generates a random point inside a circle with given radius
 *
 * @remarks
 * Samples the unit disk and scales by `radius` to keep uniform area density.
 *
 * @param radius - Circle radius (non-negative)
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point inside the circle
 *
 * @example
 * ```typescript
 * const p = randomInCircle(3);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInCircle(
 radius: number,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 // Development assertion: negative radius produces inverted points (likely a bug)
 if (__LENGUADOS_DEV__) {
  assertNonNegative(radius, 'randomInCircle:radius');
 }
 randomInUnitCircle(out, source);
 return out.multiplyScalar(radius);
}

/**
 * Generates a uniform random point in the annulus between `inner` and `outer` radii
 *
 * @remarks
 * Uniform area density requires `r² = U · (outer² − inner²) + inner²` with
 * `U ~ Uniform[0, 1)`; taking the square root gives the radial sample. The
 * angle is sampled uniformly in `[0, TAU)`. Degenerate case `inner === outer`
 * produces a point on the circle of that radius.
 *
 * @param inner - Inner radius (non-negative)
 * @param outer - Outer radius (must satisfy `outer ≥ inner`)
 * @param out - Optional output vector. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point inside the annulus
 * @throws {RangeError} If `inner < 0` or `inner > outer`
 *
 * @example
 * ```typescript
 * const p = randomInAnnulus(2, 5);
 * ```
 *
 * @see {@link randomInAnnulusSafe} - Returns fallback on invalid radii
 * @see {@link randomInAnnulusUnchecked} - No validation, for hot paths
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInAnnulus(
 inner: number,
 outer: number,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 if (inner < 0) {
  throw new RangeError('randomInAnnulus: inner radius must be non-negative');
 }
 if (inner > outer) {
  throw new RangeError('randomInAnnulus: inner radius must be ≤ outer radius');
 }
 return randomInAnnulusUnchecked(inner, outer, out, source);
}

/**
 * Generates a uniform random point in the annulus, returning a fallback on invalid input
 *
 * @param inner - Inner radius
 * @param outer - Outer radius
 * @param fallback - Fallback applied to `out` on invalid radii. @defaultValue `(0, 0)`
 * @param out - Optional output vector. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to an annulus sample, or the fallback
 *
 * @see {@link randomInAnnulus} - Strict variant that throws
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInAnnulusSafe(
 inner: number,
 outer: number,
 fallback: ReadonlyVector2Like = Vector2.ZERO,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 if (inner < 0 || inner > outer) {
  return out.set(fallback.x, fallback.y);
 }
 return randomInAnnulusUnchecked(inner, outer, out, source);
}

/**
 * Generates a uniform random point in the annulus without validation
 *
 * @remarks
 * **Precondition:** `0 ≤ inner ≤ outer`.
 *
 * @param inner - Inner radius
 * @param outer - Outer radius
 * @param out - Optional output vector. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to an annulus sample
 *
 * @see {@link randomInAnnulus} - Strict variant that throws
 * @see {@link randomInAnnulusSafe} - Returns fallback on invalid radii
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInAnnulusUnchecked(
 inner: number,
 outer: number,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 const innerSq = inner * inner;
 const outerSq = outer * outer;
 const radius = Math.sqrt(innerSq + source.next() * (outerSq - innerSq));
 const angle = source.next() * TAU;
 const { sin, cos } = sinCos(angle);
 return out.set(radius * cos, radius * sin);
}

/* ========================================================================== */
/* Random Rotations                                                           */
/* ========================================================================== */

/**
 * Generates a random 2D rotation
 *
 * @remarks
 * Uses a uniform angle distribution in [0, TAU).
 *
 * @param out - Optional output rotation to avoid allocation. Defaults to `new Rotation2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` rotation set to a random angle
 *
 * @example
 * ```typescript
 * const r = randomRotation2();
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomRotation2(
 out = new Rotation2(),
 source: RandomSource = getDefaultRandomSource(),
): Rotation2 {
 return Rotation2.fromAngle(source.next() * TAU, out);
}

/**
 * Generates a random 2x2 rotation matrix
 *
 * @remarks
 * Uses a uniform angle distribution in [0, TAU).
 *
 * @param out - Optional output matrix to avoid allocation. Defaults to `new Matrix2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` matrix set to a random rotation
 *
 * @example
 * ```typescript
 * const m = randomRotationMatrix2();
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomRotationMatrix2(
 out = new Matrix2(),
 source: RandomSource = getDefaultRandomSource(),
): Matrix2 {
 const angle = source.next() * TAU;
 return Matrix2.fromRotation(angle, out);
}

/* ========================================================================== */
/* Random Transforms                                                          */
/* ========================================================================== */

/**
 * Generates a random isometry on SE(2): random rotation and random translation with identity scale
 *
 * @remarks
 * Rotation is sampled uniformly in [0, TAU) and translation is sampled inside
 * the unit disk. An isometry preserves distances — the scale is identity,
 * matching the Special Euclidean group SE(2) (translation + rotation only, no
 * stretch). See Altmann 1986 *Rotations, Quaternions, and Double Groups* Ch. 3
 * for the standard definition and do Carmo 1976 *Differential Geometry of
 * Curves and Surfaces* Ch. 4 for the distance-preserving characterisation.
 *
 * @param out - Optional output transform to avoid allocation. Defaults to `new Transform2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` transform set to a random rotation and translation
 *
 * @example
 * ```typescript
 * const t = randomIsometry2();
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomIsometry2(
 out = new Transform2(),
 source: RandomSource = getDefaultRandomSource(),
): Transform2 {
 randomInUnitCircle(out.position, source);
 out.rotation.angle = source.next() * TAU;
 out.scale.set(1, 1);
 return out;
}

/* ========================================================================== */
/* Random Rectangles and Boxes                                                */
/* ========================================================================== */

/**
 * Generates a random point inside a rectangle centered at the origin
 *
 * @remarks
 * Each coordinate is sampled uniformly from [-width/2, width/2) and
 * [-height/2, height/2).
 *
 * @param width - Rectangle width
 * @param height - Rectangle height
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point inside the rectangle
 *
 * @example
 * ```typescript
 * const p = randomInRectangle(4, 2);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInRectangle(
 width: number,
 height: number,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 return out.set((source.next() - 0.5) * width, (source.next() - 0.5) * height);
}

/**
 * Generates a random point inside an axis-aligned box
 *
 * @remarks
 * Each coordinate is sampled independently in [min, max).
 *
 * @param minX - Minimum x coordinate
 * @param minY - Minimum y coordinate
 * @param maxX - Maximum x coordinate
 * @param maxY - Maximum y coordinate
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point inside the box
 *
 * @example
 * ```typescript
 * const p = randomInBox(-1, -1, 1, 1);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInBox(
 minX: number,
 minY: number,
 maxX: number,
 maxY: number,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 return out.set(source.next() * (maxX - minX) + minX, source.next() * (maxY - minY) + minY);
}

/**
 * Generates a random point on the perimeter of a rectangle
 *
 * @remarks
 * Samples uniformly along the perimeter length. Width and height should be positive.
 *
 * @param width - Rectangle width
 * @param height - Rectangle height
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point on the rectangle's perimeter
 *
 * @example
 * ```typescript
 * const p = randomOnRectangle(3, 2);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomOnRectangle(
 width: number,
 height: number,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 const halfWidth = width * 0.5;
 const halfHeight = height * 0.5;
 const perimeter = 2 * (width + height);
 const t = source.next() * perimeter;

 if (t < width) {
  // Bottom edge
  return out.set(t - halfWidth, -halfHeight);
 } else if (t < width + height) {
  // Right edge
  return out.set(halfWidth, t - width - halfHeight);
 } else if (t < 2 * width + height) {
  // Top edge
  return out.set(halfWidth - (t - width - height), halfHeight);
 } else {
  // Left edge
  return out.set(-halfWidth, halfHeight - (t - 2 * width - height));
 }
}

/* ========================================================================== */
/* Random Distributions                                                       */
/* ========================================================================== */

/**
 * Generates a random 2D vector with a normal distribution
 *
 * @remarks
 * Uses the Box-Muller transform (Box & Muller 1958) to sample each component
 * independently from N(mean, standardDeviation^2). `standardDeviation` should
 * be non-negative.
 *
 * @param mean - Mean of the distribution. Defaults to `0`
 * @param standardDeviation - Standard deviation. Defaults to `1`
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector with Gaussian-distributed components
 *
 * @example
 * ```typescript
 * const v = randomGaussianVector2(0, 2);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomGaussianVector2(
 mean = 0,
 standardDeviation = 1,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 // Development assertion: negative stdDev is mathematically valid but counterintuitive
 if (__LENGUADOS_DEV__) {
  assertNonNegative(standardDeviation, 'randomGaussianVector2:standardDeviation');
 }
 // Box-Muller transform
 const u1 = source.next();
 const u2 = source.next();

 // Use safe version to avoid log(0) = -Infinity
 // Clamp u1 to avoid edge case where u1 = 0
 const safeU1 = u1 <= 0 ? Number.EPSILON : u1;
 // Use deterministic log() from deterministic-kernels for cross-platform consistency
 const mag = standardDeviation * sqrtSafe(-2.0 * log(safeU1));
 const angle = TAU * u2;
 const { sin, cos } = sinCos(angle);

 return out.set(mean + mag * cos, mean + mag * sin);
}

/* ========================================================================== */
/* Random Segments and Triangles                                              */
/* ========================================================================== */

/**
 * Generates a random point on a line segment
 *
 * @remarks
 * Samples uniformly along the segment length.
 *
 * @param start - Start point of the segment
 * @param end - End point of the segment
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a random point on the segment
 *
 * @example
 * ```typescript
 * const p = randomOnSegment(a, b);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomOnSegment(
 start: ReadonlyVector2Like,
 end: ReadonlyVector2Like,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 const t = source.next();
 return out.set(lerp(start.x, end.x, t), lerp(start.y, end.y, t));
}

/**
 * Generates a random point inside a triangle
 *
 * @remarks
 * Samples two uniform variates `(u, v)` in the unit square and folds the pair
 * across the diagonal `u + v = 1` into the unit triangle. The fold is
 * area-preserving, so the resulting barycentric coordinates `(u, v, 1 − u − v)`
 * are uniformly distributed over the triangle.
 *
 * @param a - First vertex of the triangle
 * @param b - Second vertex of the triangle
 * @param c - Third vertex of the triangle
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a random point inside the triangle
 *
 * @example
 * ```typescript
 * const p = randomInTriangle(a, b, c);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInTriangle(
 a: ReadonlyVector2Like,
 b: ReadonlyVector2Like,
 c: ReadonlyVector2Like,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 // Generate random barycentric coordinates
 let u = source.next();
 let v = source.next();

 // Ensure u + v <= 1 (point is inside triangle)
 if (u + v > 1) {
  u = 1 - u;
  v = 1 - v;
 }

 const w = 1 - u - v;

 // Convert barycentric to Cartesian coordinates
 return out.set(w * a.x + u * b.x + v * c.x, w * a.y + u * b.y + v * c.y);
}

/**
 * Generates a random point on a triangle perimeter
 *
 * @remarks
 * Distributes points uniformly by edge length.
 *
 * @param a - First vertex of the triangle
 * @param b - Second vertex of the triangle
 * @param c - Third vertex of the triangle
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` vector set to a point on the triangle's perimeter
 *
 * @example
 * ```typescript
 * const p = randomOnTriangle(a, b, c);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomOnTriangle(
 a: ReadonlyVector2Like,
 b: ReadonlyVector2Like,
 c: ReadonlyVector2Like,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 // Calculate side lengths
 const ab = Vector2.distance(a, b);
 const bc = Vector2.distance(b, c);
 const ca = Vector2.distance(c, a);
 const perimeter = ab + bc + ca;

 // Degenerate: zero-perimeter triangle (all vertices coincide)
 if (perimeter === 0) {
  return out.set(a.x, a.y);
 }

 // Random position along perimeter (single random call for consistent distribution)
 const t = source.next() * perimeter;

 if (t < ab) {
  // On edge AB - calculate position directly instead of calling randomOnSegment
  const edgeT = t / ab;
  return out.set(lerp(a.x, b.x, edgeT), lerp(a.y, b.y, edgeT));
 } else if (t < ab + bc) {
  // On edge BC
  const edgeT = (t - ab) / bc;
  return out.set(lerp(b.x, c.x, edgeT), lerp(b.y, c.y, edgeT));
 } else {
  // On edge CA
  const edgeT = (t - ab - bc) / ca;
  return out.set(lerp(c.x, a.x, edgeT), lerp(c.y, a.y, edgeT));
 }
}

/* ========================================================================== */
/* Random Complex Numbers                                                      */
/* ========================================================================== */

/**
 * Generates a random complex number with components in range [min, max)
 *
 * @remarks
 * Both real and imaginary components are sampled independently
 * with a uniform distribution.
 *
 * @param min - Minimum component value. Defaults to `0`
 * @param max - Maximum component value (exclusive). Defaults to `1`
 * @param out - Optional output complex to avoid allocation. Defaults to `new Complex()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` complex containing the random components
 *
 * @example
 * ```typescript
 * const c = randomComplex(-1, 1);     // Random complex in [-1,1) x [-1,1)
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomComplex(
 min = 0,
 max = 1,
 out = new Complex(),
 source: RandomSource = getDefaultRandomSource(),
): Complex {
 const range = max - min;
 return out.set(source.next() * range + min, source.next() * range + min);
}

/**
 * Generates a random unit complex number (on the unit circle)
 *
 * @remarks
 * Equivalent to generating a random rotation as a complex number.
 * Uses a uniform distribution over the unit circle.
 *
 * @param out - Optional output complex to avoid allocation. Defaults to `new Complex()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` complex set to a unit-magnitude complex number
 *
 * @example
 * ```typescript
 * const c = randomUnitComplex();      // Random unit complex (magnitude = 1)
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomUnitComplex(
 out = new Complex(),
 source: RandomSource = getDefaultRandomSource(),
): Complex {
 const angle = source.next() * TAU;
 const { sin, cos } = sinCos(angle);
 return out.set(cos, sin);
}

/* ========================================================================== */
/* Random Intervals                                                            */
/* ========================================================================== */

/**
 * Generates a random interval within specified bounds
 *
 * @remarks
 * Generates two random values, sorts them, and uses them as min/max.
 * This ensures min ≤ max invariant is always satisfied.
 *
 * @param minBound - Minimum allowed value for interval.min. Defaults to `0`
 * @param maxBound - Maximum allowed value for interval.max. Defaults to `1`
 * @param out - Optional output interval to avoid allocation. Defaults to `new Interval()`
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`
 * @returns The `out` interval containing random bounds within [minBound, maxBound]
 *
 * @example
 * ```typescript
 * const i = randomInterval(0, 100);   // Random interval within [0, 100]
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomInterval(
 minBound = 0,
 maxBound = 1,
 out = new Interval(),
 source: RandomSource = getDefaultRandomSource(),
): Interval {
 const range = maxBound - minBound;
 const v1 = source.next() * range + minBound;
 const v2 = source.next() * range + minBound;
 // Ensure min ≤ max
 const min = v1 <= v2 ? v1 : v2;
 const max = v1 > v2 ? v1 : v2;
 return out.set(min, max);
}
