/**
 * @file src/mat2/helpers.ts
 * @module math2d/mat2/helpers
 * @description Helper types and functions for Mat2.
 */

import type { Mat2Base } from './base';

/**
 * Minimal structural type for a 2×2 matrix in row-major form.
 * Use this to interoperate with plain objects when needed.
 */
export interface Mat2Like {
  /** Row 0, Col 0. */
  readonly m00: number;
  /** Row 0, Col 1. */
  readonly m01: number;
  /** Row 1, Col 0. */
  readonly m10: number;
  /** Row 1, Col 1. */
  readonly m11: number;
}

/**
 * Readonly view of Mat2.
 */
export type ReadonlyMat2 = Readonly<Mat2Base>;

/**
 * Permanently freezes a Mat2 instance so it can no longer be mutated.
 * 
 * @param matrix - The Mat2 object to freeze.
 * @returns The same instance, now typed as ReadonlyMat2,
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
 * const I = freezeMat2(new Mat2()); // identity by default
 * // Will throw in strict mode:
 * I.m00 = 2;
 * ```
 */
export function freezeMat2(matrix: Mat2Base): ReadonlyMat2 {
  return Object.freeze(matrix);
}

/**
 * Type guard for a plain object that looks like a 2×2 matrix.
 * 
 * @param subject - Unknown value.
 * @returns `true` if subject exposes numeric `m00, m01, m10, m11` members.
 * 
 * @example
 * ```ts
 * const maybe: unknown = { m00: 1, m01: 0, m10: 0, m11: 1 };
 * if (isMat2Like(maybe)) {
 *   // safely use maybe.m00, maybe.m11 ...
 * }
 * ```
 */
export function isMat2Like(subject: unknown): subject is Mat2Like {
  return (
    typeof subject === 'object' &&
    subject !== null &&
    typeof (subject as { m00?: unknown }).m00 === 'number' &&
    typeof (subject as { m01?: unknown }).m01 === 'number' &&
    typeof (subject as { m10?: unknown }).m10 === 'number' &&
    typeof (subject as { m11?: unknown }).m11 === 'number'
  );
}
