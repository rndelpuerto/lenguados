/**
 * @file src/utils/hash.ts
 * @module math2d/utils/hash
 * @description
 * Hash functions for mathematical types. Provides consistent 32-bit hash codes
 * for use in hash tables and comparisons.
 *
 * Implementation based on:
 * - Java's hashCode conventions for floating point numbers
 * - Spatial hashing techniques for 2D/3D coordinates
 * - Ensures deterministic results across platforms
 */

import type { ReadonlyMat2 } from '../mat2';
import type { ReadonlyMat3 } from '../mat3';
import type { ReadonlyRot2 } from '../rot2';
import type { ReadonlyTransform2 } from '../transform2';
import type { ReadonlyVector2 } from '../vector2';

/**
 * Precision factor for converting floats to integers in hash calculations.
 * Using 1e6 provides ~6 decimal places of precision.
 */
const HASH_PRECISION = 1e6;

/**
 * Computes a 32-bit hash code for a 2D vector.
 *
 * Uses spatial hashing technique that preserves locality:
 * nearby vectors produce similar hashes.
 *
 * @param v - The vector to hash
 * @returns A 32-bit unsigned integer hash code
 */
export function hashVector2(v: ReadonlyVector2): number {
 const xInt = Math.round(v.x * HASH_PRECISION) & 0xffff;
 const yInt = Math.round(v.y * HASH_PRECISION) & 0xffff;
 return ((xInt << 16) | yInt) >>> 0;
}

/**
 * Computes a 32-bit hash code for a 2x2 matrix.
 *
 * Combines all 4 components into a single hash value.
 * Uses XOR to combine two 32-bit values from pairs of components.
 *
 * @param m - The matrix to hash
 * @returns A 32-bit unsigned integer hash code
 */
export function hashMat2(m: ReadonlyMat2): number {
 const x0 = (Math.round(m.m00 * HASH_PRECISION) & 0xffff) >>> 0;
 const x1 = (Math.round(m.m01 * HASH_PRECISION) & 0xffff) >>> 0;
 const x2 = (Math.round(m.m10 * HASH_PRECISION) & 0xffff) >>> 0;
 const x3 = (Math.round(m.m11 * HASH_PRECISION) & 0xffff) >>> 0;

 const a0 = ((x0 << 16) | x1) >>> 0;
 const a1 = ((x2 << 16) | x3) >>> 0;

 return (a0 ^ a1) >>> 0;
}

/**
 * Computes a 32-bit hash code for a 3x3 matrix.
 *
 * Combines all 9 components using XOR operations.
 * Uses the same algorithm as the original Mat3.hashCode for consistency.
 *
 * @param m - The matrix to hash
 * @returns A 32-bit unsigned integer hash code
 */
export function hashMat3(m: ReadonlyMat3): number {
 const p = (n: number) => (Math.round(n * HASH_PRECISION) & 0xffff) >>> 0;

 const x0 = p(m.m00),
  x1 = p(m.m01),
  x2 = p(m.m02);
 const x3 = p(m.m10),
  x4 = p(m.m11),
  x5 = p(m.m12);
 const x6 = p(m.m20),
  x7 = p(m.m21),
  x8 = p(m.m22);

 const h0 = ((x0 << 16) | x1) >>> 0;
 const h1 = ((x2 << 16) | x3) >>> 0;
 const h2 = ((x4 << 16) | x5) >>> 0;
 const h3 = ((x6 << 16) | x7) >>> 0;

 return (h0 ^ h1 ^ (h2 ^ h3) ^ x8) >>> 0;
}

/**
 * Computes a 32-bit hash code for a 2D rotation.
 *
 * Since Rot2 is essentially a unit vector {c, s},
 * we can reuse the vector hash function.
 *
 * @param r - The rotation to hash
 * @returns A 32-bit unsigned integer hash code
 */
export function hashRot2(r: ReadonlyRot2): number {
 const cInt = Math.round(r.c * HASH_PRECISION) & 0xffff;
 const sInt = Math.round(r.s * HASH_PRECISION) & 0xffff;
 return ((cInt << 16) | sInt) >>> 0;
}

/**
 * Computes a 32-bit hash code for a 2D rigid transform.
 *
 * Combines the position and rotation hashes using bit rotation
 * and XOR to ensure good distribution.
 *
 * @param t - The transform to hash
 * @returns A 32-bit unsigned integer hash code
 */
export function hashTransform2(t: ReadonlyTransform2): number {
 const pHash = hashVector2(t.p) >>> 0;
 const rHash = hashRot2(t.r) >>> 0;

 // Rotate position hash by 1 bit and XOR with rotation hash
 return (((pHash << 1) | (pHash >>> 31)) ^ rHash) >>> 0;
}
