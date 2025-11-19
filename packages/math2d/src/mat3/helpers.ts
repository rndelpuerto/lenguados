/**
 * @file src/mat3/helpers.ts
 * @module math2d/mat3/helpers
 * @description Helper types and functions for Mat3.
 */

import type { Mat3Base } from './base';

/**
 * Minimal structural type for a 3×3 matrix in row-major form.
 * Use this to interoperate with plain objects when needed.
 */
export interface Mat3Like {
  /** Row 0, Col 0. */
  readonly m00: number;
  /** Row 0, Col 1. */
  readonly m01: number;
  /** Row 0, Col 2. */
  readonly m02: number;
  /** Row 1, Col 0. */
  readonly m10: number;
  /** Row 1, Col 1. */
  readonly m11: number;
  /** Row 1, Col 2. */
  readonly m12: number;
  /** Row 2, Col 0. */
  readonly m20: number;
  /** Row 2, Col 1. */
  readonly m21: number;
  /** Row 2, Col 2. */
  readonly m22: number;
}

/**
 * Readonly view of Mat3.
 */
export type ReadonlyMat3 = Readonly<Mat3Base>;

/**
 * Permanently freezes a Mat3 instance so it can no longer be mutated.
 * 
 * @param matrix - The Mat3 object to freeze.
 * @returns The same instance, now typed as ReadonlyMat3,
 *          after being frozen with Object.freeze.
 * 
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify fields throws a TypeError.
 *   In non-strict mode the write is silently ignored.
 * - Use this helper to create truly immutable static constants.
 * 
 * @example
 * ```ts
 * const I = freezeMat3(new Mat3()); // identity by default
 * // Will throw in strict mode:
 * I.m00 = 2;
 * ```
 */
export function freezeMat3(matrix: Mat3Base): ReadonlyMat3 {
  return Object.freeze(matrix);
}

/**
 * Type guard for a plain object that looks like a 3×3 matrix.
 * 
 * @param subject - Unknown value.
 * @returns `true` if subject exposes numeric `m00` through `m22` members.
 * 
 * @example
 * ```ts
 * const maybe: unknown = { m00: 1, m01: 0, m02: 0, ... };
 * if (isMat3Like(maybe)) {
 *   // safely use maybe.m00, maybe.m22 ...
 * }
 * ```
 */
export function isMat3Like(subject: unknown): subject is Mat3Like {
  return (
    typeof subject === 'object' &&
    subject !== null &&
    typeof (subject as { m00?: unknown }).m00 === 'number' &&
    typeof (subject as { m01?: unknown }).m01 === 'number' &&
    typeof (subject as { m02?: unknown }).m02 === 'number' &&
    typeof (subject as { m10?: unknown }).m10 === 'number' &&
    typeof (subject as { m11?: unknown }).m11 === 'number' &&
    typeof (subject as { m12?: unknown }).m12 === 'number' &&
    typeof (subject as { m20?: unknown }).m20 === 'number' &&
    typeof (subject as { m21?: unknown }).m21 === 'number' &&
    typeof (subject as { m22?: unknown }).m22 === 'number'
  );
}
