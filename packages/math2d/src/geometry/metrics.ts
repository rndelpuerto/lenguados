/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * @file src/geometry/metrics.ts
 * @module math2d/geometry/metrics
 * @description
 * Specialized distance metrics and norms for 2D geometry.
 *
 * Implementation based on:
 * - "Computational Geometry: Algorithms and Applications" by de Berg et al.
 * - IEEE 754 standard for numerical stability
 * - Game Physics and spatial indexing literature
 *
 * Provides various Lp norms and derived distance functions:
 * - L1 norm (Manhattan/Taxicab distance)
 * - L2 norm (Euclidean distance) - use Vector2.length/distance
 * - L∞ norm (Chebyshev/Chessboard distance)
 * - Generalized Minkowski distance
 */

import { Vector2, type ReadonlyVector2 } from '../vector2';

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the L1 norm (Manhattan/Taxicab length) of a vector.
 *
 * This is the sum of absolute values of components: |x| + |y|
 * Named after Manhattan's grid-like street layout.
 *
 * @param v - The vector to measure
 * @returns The Manhattan length
 */
export function manhattanLength(v: ReadonlyVector2): number {
 return Math.abs(v.x) + Math.abs(v.y);
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the Manhattan distance between two points.
 *
 * This is the L1 distance: |x₁ - x₂| + |y₁ - y₂|
 * Represents the distance traveling along axis-aligned paths.
 *
 * @param a - First point
 * @param b - Second point
 * @returns The Manhattan distance
 */
export function manhattanDistance(a: ReadonlyVector2, b: ReadonlyVector2): number {
 return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the L∞ norm (Chebyshev/Chessboard length) of a vector.
 *
 * This is the maximum absolute component: max(|x|, |y|)
 * Named after the minimum moves for a chess king.
 *
 * @param v - The vector to measure
 * @returns The Chebyshev length
 */
export function chebyshevLength(v: ReadonlyVector2): number {
 return Math.max(Math.abs(v.x), Math.abs(v.y));
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the Chebyshev distance between two points.
 *
 * This is the L∞ distance: max(|x₁ - x₂|, |y₁ - y₂|)
 * Represents the minimum moves for a chess king between positions.
 *
 * @param a - First point
 * @param b - Second point
 * @returns The Chebyshev distance
 */
export function chebyshevDistance(a: ReadonlyVector2, b: ReadonlyVector2): number {
 return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the generalized Minkowski distance between two points.
 *
 * The Lp norm distance: (|x₁ - x₂|^p + |y₁ - y₂|^p)^(1/p)
 *
 * Special cases:
 * - p = 1: Manhattan distance
 * - p = 2: Euclidean distance
 * - p → ∞: Chebyshev distance
 *
 * @param a - First point
 * @param b - Second point
 * @param p - The norm parameter (must be ≥ 1)
 * @returns The Minkowski distance
 * @throws {RangeError} If p < 1
 */
export function minkowskiDistance(a: ReadonlyVector2, b: ReadonlyVector2, p: number): number {
 if (p < 1) {
  throw new RangeError('minkowskiDistance: p must be >= 1');
 }

 // Handle special cases for performance
 if (p === 1) return manhattanDistance(a, b);
 if (p === 2) return Vector2.distance(a, b); // Euclidean
 if (p === Number.POSITIVE_INFINITY) return chebyshevDistance(a, b);

 // General case
 const dx = Math.abs(a.x - b.x);
 const dy = Math.abs(a.y - b.y);
 return Math.pow(Math.pow(dx, p) + Math.pow(dy, p), 1 / p);
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the squared Euclidean distance between two points.
 *
 * Useful for distance comparisons without the sqrt overhead.
 * Result is (x₁ - x₂)² + (y₁ - y₂)²
 *
 * @param a - First point
 * @param b - Second point
 * @returns The squared Euclidean distance
 */
export function squaredDistance(a: ReadonlyVector2, b: ReadonlyVector2): number {
 return Vector2.distanceSq(a, b);
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the Canberra distance between two points.
 *
 * A weighted version of Manhattan distance, useful for data with
 * different scales: Σ|xᵢ - yᵢ| / (|xᵢ| + |yᵢ|)
 *
 * @param a - First point
 * @param b - Second point
 * @returns The Canberra distance
 */
export function canberraDistance(a: ReadonlyVector2, b: ReadonlyVector2): number {
 const dx = Math.abs(a.x - b.x);
 const dy = Math.abs(a.y - b.y);
 const sx = Math.abs(a.x) + Math.abs(b.x);
 const sy = Math.abs(a.y) + Math.abs(b.y);

 let result = 0;
 if (sx > 0) result += dx / sx;
 if (sy > 0) result += dy / sy;

 return result;
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Determines which axis has the maximum extent between two points.
 *
 * Useful for spatial partitioning algorithms (KD-trees, BVH).
 *
 * @param a - First point
 * @param b - Second point
 * @returns 0 for X axis, 1 for Y axis
 */
export function dominantAxis(a: ReadonlyVector2, b: ReadonlyVector2): number {
 return Math.abs(a.x - b.x) >= Math.abs(a.y - b.y) ? 0 : 1;
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Computes the signed area of a triangle defined by three points.
 *
 * Positive for counter-clockwise, negative for clockwise, zero for collinear.
 * This is half the cross product of vectors (b-a) and (c-a).
 *
 * @param a - First vertex
 * @param b - Second vertex
 * @param c - Third vertex
 * @returns The signed area
 */
export function signedTriangleArea(
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 c: ReadonlyVector2,
): number {
 return 0.5 * Vector2.cross3(a, b, c);
}

/**
 * Note: For standard Euclidean distance, prefer Vector2.distance().
 * This module provides specialized distance metrics not available in Vector2.
 *
 * @module
 * Tests if three points are in counter-clockwise order.
 *
 * @param a - First point
 * @param b - Second point
 * @param c - Third point
 * @returns True if points are in CCW order
 */
export function isCCW(a: ReadonlyVector2, b: ReadonlyVector2, c: ReadonlyVector2): boolean {
 return signedTriangleArea(a, b, c) > 0;
}
