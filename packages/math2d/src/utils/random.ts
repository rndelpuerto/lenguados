/**
 * @file src/utils/random.ts
 * @module math2d/utils/random
 * @description
 * Random generation utilities for 2D mathematical objects.
 *
 * Implementation based on:
 * - Uniform sampling techniques from "Graphics Gems" series
 * - "Numerical Recipes" for distribution methods
 * - Game Programming Gems for practical random generation
 *
 * All functions ensure proper distributions:
 * - Points in/on circles use polar coordinates with sqrt(r) for uniform area distribution
 * - Rotations use uniform angle distribution
 */

import { Mat2 } from '../mat2';
import { Rot2 } from '../rot2';
import { TAU } from '../scalar';
import { Transform2 } from '../transform2';
import { Vector2, ReadonlyVector2 } from '../vector2';

import { RandomSource, defaultRandomSource } from './random-source';

/**
 * Generates a random 2D vector with components in range [min, max).
 *
 * @param min - Minimum value for components (default: 0)
 * @param max - Maximum value for components (default: 1)
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A vector with random components
 */
export function randomVector2(
 min = 0,
 max = 1,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 const range = max - min;
 return out.set(source.next() * range + min, source.next() * range + min);
}

/**
 * Generates a random unit vector (direction).
 *
 * Uses uniform distribution on the unit circle.
 *
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A normalized vector with random direction
 */
export function randomUnitVector2(
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 const angle = source.next() * TAU;
 return out.set(Math.cos(angle), Math.sin(angle));
}

/**
 * Generates a random point on a circle's circumference.
 *
 * Uniform distribution along the perimeter.
 *
 * @param radius - Circle radius (default: 1)
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A point on the circle
 */
export function randomOnCircle(
 radius = 1,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 const angle = source.next() * TAU;
 return out.set(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

/**
 * Generates a random point inside a unit circle.
 *
 * Uses rejection sampling or sqrt(r) technique for uniform area distribution.
 * The sqrt ensures points are not clustered at the center.
 *
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A point inside the unit circle
 */
export function randomInUnitCircle(
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 // sqrt(r) gives uniform distribution by area
 const r = Math.sqrt(source.next());
 const angle = source.next() * TAU;
 return out.set(Math.cos(angle) * r, Math.sin(angle) * r);
}

/**
 * Generates a random point inside a circle with given radius.
 *
 * @param radius - Circle radius
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A point inside the circle
 */
export function randomInCircle(
 radius: number,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 randomInUnitCircle(out, source);
 return out.multiplyScalar(radius);
}

/**
 * Generates a random 2D rotation.
 *
 * Uniform distribution over all possible 2D rotations.
 *
 * @param out - Optional output rotation (default: new Rot2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A random rotation
 */
export function randomRotation2(
 out = new Rot2(),
 source: RandomSource = defaultRandomSource,
): Rot2 {
 return Rot2.fromAngle(source.next() * TAU, out);
}

/**
 * Generates a random rotation matrix (2x2).
 *
 * Creates a rotation matrix with uniform distribution over all angles.
 *
 * @param out - Optional output matrix (default: new Mat2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A random rotation matrix
 */
export function randomRotationMatrix2(
 out = new Mat2(),
 source: RandomSource = defaultRandomSource,
): Mat2 {
 const angle = source.next() * TAU;
 return Mat2.fromRotation(angle, out);
}

/**
 * Generates a random rigid transform (SE(2)).
 *
 * Random rotation with uniform distribution and translation inside unit circle.
 *
 * @param out - Optional output transform (default: new Transform2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A random transform
 */
export function randomTransform2(
 out = new Transform2(),
 source: RandomSource = defaultRandomSource,
): Transform2 {
 randomInUnitCircle(out.p, source);
 randomRotation2(out.r, source);
 return out;
}

/**
 * Generates a random point inside a rectangle.
 *
 * Rectangle is centered at origin with given dimensions.
 *
 * @param width - Rectangle width
 * @param height - Rectangle height
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A point inside the rectangle
 */
export function randomInRectangle(
 width: number,
 height: number,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 return out.set((source.next() - 0.5) * width, (source.next() - 0.5) * height);
}

/**
 * Generates a random point inside an axis-aligned box.
 *
 * @param minX - Minimum x coordinate
 * @param minY - Minimum y coordinate
 * @param maxX - Maximum x coordinate
 * @param maxY - Maximum y coordinate
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A point inside the box
 */
export function randomInBox(
 minX: number,
 minY: number,
 maxX: number,
 maxY: number,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 return out.set(source.next() * (maxX - minX) + minX, source.next() * (maxY - minY) + minY);
}

/**
 * Generates a random point on the perimeter of a rectangle.
 *
 * Uniform distribution along the perimeter.
 *
 * @param width - Rectangle width
 * @param height - Rectangle height
 * @param out - Optional output vector (default: new Vector2)
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A point on the rectangle's perimeter
 */
export function randomOnRectangle(
 width: number,
 height: number,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
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

/**
 * Generate a random 2D vector with Gaussian (normal) distribution.
 *
 * Uses the Box-Muller transform for generating normally distributed values.
 * Each component is independently sampled from N(mean, stdDev²).
 *
 * @param mean - Mean of the distribution (default 0).
 * @param stdDev - Standard deviation (default 1).
 * @param out - Optional output vector.
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A vector with Gaussian-distributed components.
 * @see https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 */
export function randomGaussianVector2(
 mean = 0,
 standardDeviation = 1,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 // Box-Muller transform
 const u1 = source.next();
 const u2 = source.next();

 const mag = standardDeviation * Math.sqrt(-2.0 * Math.log(u1));
 const angle = 2.0 * Math.PI * u2;

 return out.set(mean + mag * Math.cos(angle), mean + mag * Math.sin(angle));
}

/**
 * Generate a random point on a line segment.
 *
 * @param start - Start point of the segment.
 * @param end - End point of the segment.
 * @param out - Optional output vector.
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A random point on the segment with uniform distribution.
 */
export function randomOnSegment(
 start: ReadonlyVector2,
 end: ReadonlyVector2,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 const t = source.next();
 return Vector2.lerp(start, end, t, out);
}

/**
 * Generate a random point inside a triangle with uniform distribution.
 *
 * Uses barycentric coordinates to ensure uniform sampling.
 *
 * @param a - First vertex of the triangle.
 * @param b - Second vertex of the triangle.
 * @param c - Third vertex of the triangle.
 * @param out - Optional output vector.
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A random point inside the triangle.
 * @see https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle
 */
export function randomInTriangle(
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 c: ReadonlyVector2,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
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
 * Generate a random point on the perimeter of a triangle.
 *
 * @param a - First vertex of the triangle.
 * @param b - Second vertex of the triangle.
 * @param c - Third vertex of the triangle.
 * @param out - Optional output vector.
 * @param source - Optional random source (default: defaultRandomSource)
 * @returns A random point on the triangle's perimeter with uniform distribution by length.
 */
export function randomOnTriangle(
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 c: ReadonlyVector2,
 out = new Vector2(),
 source: RandomSource = defaultRandomSource,
): Vector2 {
 // Calculate side lengths
 const ab = Vector2.distance(a, b);
 const bc = Vector2.distance(b, c);
 const ca = Vector2.distance(c, a);
 const perimeter = ab + bc + ca;

 // Random position along perimeter
 const t = source.next() * perimeter;

 if (t < ab) {
  // On edge AB
  return randomOnSegment(a, b, out, source);
 } else if (t < ab + bc) {
  // On edge BC
  return randomOnSegment(b, c, out, source);
 } else {
  // On edge CA
  return randomOnSegment(c, a, out, source);
 }
}
