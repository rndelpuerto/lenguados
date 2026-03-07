/**
 * @file src/utils/random.ts
 * @module @lenguados/math2d/utils
 * @description Deterministic random generation utilities for 2D mathematical objects.
 *
 * @remarks
 * Implementation based on:
 * - Uniform sampling techniques from "Graphics Gems" series
 * - "Numerical Recipes" for distribution methods
 * - Game Programming Gems for practical random generation
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

import { TAU } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { Complex } from '../core/complex';
import { Interval } from '../core/interval';
import { Matrix2 } from '../core/matrix2';
import { Rotation2 } from '../core/rotation2';
import { Transform2 } from '../core/transform2';
import { Vector2, type ReadonlyVector2 } from '../core/vector2';
import { cos, log, sin, sqrtSafe } from '../deterministic/deterministic-kernels';
import { assertNonNegative } from '../validation/assert';

import { type RandomSource, getDefaultRandomSource } from './random-source';

/* ========================================================================== */
/* Random Vectors                                                             */
/* ========================================================================== */

/**
 * Generates a random 2D vector with components in range [min, max).
 *
 * @param min - Minimum component value. Defaults to `0`.
 * @param max - Maximum component value (exclusive). Defaults to `1`.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector containing the random components.
 *
 * @remarks
 * Each component is sampled independently with a uniform distribution.
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
 * Generates a random unit vector.
 *
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a unit-length direction.
 *
 * @remarks
 * Uses a uniform distribution over the unit circle.
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
 return out.set(cos(angle), sin(angle));
}

/* ========================================================================== */
/* Random Circles                                                             */
/* ========================================================================== */

/**
 * Generates a random point on a circle's circumference.
 *
 * @param radius - Circle radius. Defaults to `1`.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a point on the circle.
 *
 * @remarks
 * Uses a uniform distribution along the perimeter. `radius` should be non-negative.
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
 assertNonNegative(radius, 'randomOnCircle:radius');
 const angle = source.next() * TAU;
 return out.set(cos(angle) * radius, sin(angle) * radius);
}

/**
 * Generates a random point inside a unit circle.
 *
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a point inside the unit circle.
 *
 * @remarks
 * Uses sqrt(r) in polar coordinates to achieve uniform area distribution.
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
 return out.set(cos(angle) * r, sin(angle) * r);
}

/**
 * Generates a random point inside a circle with given radius.
 *
 * @param radius - Circle radius (non-negative).
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a point inside the circle.
 *
 * @remarks
 * Samples the unit disk and scales by `radius` to keep uniform area density.
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
 assertNonNegative(radius, 'randomInCircle:radius');
 randomInUnitCircle(out, source);
 return out.scale(radius);
}

/* ========================================================================== */
/* Random Rotations                                                           */
/* ========================================================================== */

/**
 * Generates a random 2D rotation.
 *
 * @param out - Optional output rotation to avoid allocation. Defaults to `new Rotation2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` rotation set to a random angle.
 *
 * @remarks
 * Uses a uniform angle distribution in [0, TAU).
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
 * Generates a random 2x2 rotation matrix.
 *
 * @param out - Optional output matrix to avoid allocation. Defaults to `new Matrix2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` matrix set to a random rotation.
 *
 * @remarks
 * Uses a uniform angle distribution in [0, TAU).
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
 * Generates a random rigid transform (SE(2)).
 *
 * @param out - Optional output transform to avoid allocation. Defaults to `new Transform2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` transform set to a random rotation and translation.
 *
 * @remarks
 * Rotation is sampled uniformly and translation is sampled inside the unit circle.
 *
 * @example
 * ```typescript
 * const t = randomTransform2();
 * ```
 *
 * @category Factory
 * @since 0.7.0
 */
export function randomTransform2(
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
 * Generates a random point inside a rectangle centered at the origin.
 *
 * @param width - Rectangle width.
 * @param height - Rectangle height.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a point inside the rectangle.
 *
 * @remarks
 * Each coordinate is sampled uniformly from [-width/2, width/2) and
 * [-height/2, height/2).
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
 * Generates a random point inside an axis-aligned box.
 *
 * @param minX - Minimum x coordinate.
 * @param minY - Minimum y coordinate.
 * @param maxX - Maximum x coordinate.
 * @param maxY - Maximum y coordinate.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a point inside the box.
 *
 * @remarks
 * Each coordinate is sampled independently in [min, max).
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
 * Generates a random point on the perimeter of a rectangle.
 *
 * @param width - Rectangle width.
 * @param height - Rectangle height.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a point on the rectangle's perimeter.
 *
 * @remarks
 * Samples uniformly along the perimeter length. Width and height should be positive.
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
 * Generates a random 2D vector with a normal distribution.
 *
 * @param mean - Mean of the distribution. Defaults to `0`.
 * @param standardDeviation - Standard deviation. Defaults to `1`.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector with Gaussian-distributed components.
 *
 * @remarks
 * Uses the Box-Muller transform to sample each component independently from
 * N(mean, standardDeviation^2). `standardDeviation` should be non-negative.
 *
 * @example
 * ```typescript
 * const v = randomGaussianVector2(0, 2);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 * @see https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 */
export function randomGaussianVector2(
 mean = 0,
 standardDeviation = 1,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 // Development assertion: negative stdDev is mathematically valid but counterintuitive
 assertNonNegative(standardDeviation, 'randomGaussianVector2:standardDeviation');
 // Box-Muller transform
 const u1 = source.next();
 const u2 = source.next();

 // Use safe version to avoid log(0) = -Infinity
 // Clamp u1 to avoid edge case where u1 = 0
 const safeU1 = u1 <= 0 ? Number.EPSILON : u1;
 // Use deterministic log() from deterministic-kernels for cross-platform consistency
 const mag = standardDeviation * sqrtSafe(-2.0 * log(safeU1));
 const angle = TAU * u2;

 return out.set(mean + mag * cos(angle), mean + mag * sin(angle));
}

/* ========================================================================== */
/* Random Segments and Triangles                                              */
/* ========================================================================== */

/**
 * Generates a random point on a line segment.
 *
 * @param start - Start point of the segment.
 * @param end - End point of the segment.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a random point on the segment.
 *
 * @remarks
 * Samples uniformly along the segment length.
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
 start: ReadonlyVector2,
 end: ReadonlyVector2,
 out = new Vector2(),
 source: RandomSource = getDefaultRandomSource(),
): Vector2 {
 const t = source.next();
 return out.set(lerp(start.x, end.x, t), lerp(start.y, end.y, t));
}

/**
 * Generates a random point inside a triangle.
 *
 * @param a - First vertex of the triangle.
 * @param b - Second vertex of the triangle.
 * @param c - Third vertex of the triangle.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a random point inside the triangle.
 *
 * @remarks
 * Uses barycentric coordinates to ensure uniform area distribution.
 *
 * @example
 * ```typescript
 * const p = randomInTriangle(a, b, c);
 * ```
 *
 * @category Factory
 * @since 0.7.0
 * @see https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle
 */
export function randomInTriangle(
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 c: ReadonlyVector2,
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
 * Generates a random point on a triangle perimeter.
 *
 * @param a - First vertex of the triangle.
 * @param b - Second vertex of the triangle.
 * @param c - Third vertex of the triangle.
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` vector set to a point on the triangle's perimeter.
 *
 * @remarks
 * Distributes points uniformly by edge length.
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
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 c: ReadonlyVector2,
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
 * Generates a random complex number with components in range [min, max).
 *
 * @param min - Minimum component value. Defaults to `0`.
 * @param max - Maximum component value (exclusive). Defaults to `1`.
 * @param out - Optional output complex to avoid allocation. Defaults to `new Complex()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` complex containing the random components.
 *
 * @remarks
 * Both real and imaginary components are sampled independently
 * with a uniform distribution.
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
 * Generates a random unit complex number (on the unit circle).
 *
 * @param out - Optional output complex to avoid allocation. Defaults to `new Complex()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` complex set to a unit-magnitude complex number.
 *
 * @remarks
 * Equivalent to generating a random rotation as a complex number.
 * Uses a uniform distribution over the unit circle.
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
 return out.set(cos(angle), sin(angle));
}

/* ========================================================================== */
/* Random Intervals                                                            */
/* ========================================================================== */

/**
 * Generates a random interval within specified bounds.
 *
 * @param minBound - Minimum allowed value for interval.min. Defaults to `0`.
 * @param maxBound - Maximum allowed value for interval.max. Defaults to `1`.
 * @param out - Optional output interval to avoid allocation. Defaults to `new Interval()`.
 * @param source - Random source to sample from. Defaults to `defaultRandomSource`.
 * @returns The `out` interval containing random bounds within [minBound, maxBound].
 *
 * @remarks
 * Generates two random values, sorts them, and uses them as min/max.
 * This ensures min ≤ max invariant is always satisfied.
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
