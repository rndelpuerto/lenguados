/**
 * @file src/rot2/helpers.ts
 * @module math2d/rot2/helpers
 * @description Helper types and functions for Rot2.
 */

import type { Rot2Base } from './base';

/**
 * Minimal structural type for a rotation `{ c, s }`.
 * Use this to interoperate with plain objects when needed.
 */
export interface Rot2Like {
  /** Cosine of the angle. */
  readonly c: number;
  /** Sine of the angle. */
  readonly s: number;
}

/**
 * Readonly view of Rot2.
 */
export type ReadonlyRot2 = Readonly<Rot2Base>;

/**
 * Permanently freezes a Rot2 instance so it can no longer be mutated.
 * 
 * @param rotation - The Rot2 to freeze.
 * @returns The same instance, now typed as ReadonlyRot2,
 *          after being frozen with Object.freeze.
 * 
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify fields throws a TypeError.
 * - Use this helper to create truly immutable static constants.
 * 
 * @example
 * ```ts
 * const I = freezeRot2(new Rot2()); // identity by default
 * // Will throw in strict mode:
 * I.c = 0.5;
 * ```
 */
export function freezeRot2(rotation: Rot2Base): ReadonlyRot2 {
  return Object.freeze(rotation);
}

/**
 * Type guard for a plain object that looks like a rotation `{ c, s }`.
 * 
 * @param subject - Unknown value to test.
 * @returns `true` if both `c` and `s` are numeric; otherwise `false`.
 */
export function isRot2Like(subject: unknown): subject is Readonly<Rot2Like> {
  return (
    typeof subject === 'object' &&
    subject !== null &&
    typeof (subject as { c?: unknown }).c === 'number' &&
    typeof (subject as { s?: unknown }).s === 'number'
  );
}
