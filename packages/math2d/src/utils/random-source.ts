/**
 * @file src/utils/random-source.ts
 * @module @lenguados/math2d/utils
 * @description Random number source abstractions for deterministic sampling.
 *
 * @remarks
 * This allows the math2d library to support:
 * - Default Math.random() for typical use
 * - Seeded random for deterministic simulations
 * - Custom random sources for testing or specialized needs
 *
 * **Note on Math.floor usage**: This module uses `Math.floor` directly for
 * integer conversion because it's IEEE 754 deterministic and the random
 * sources handle their own determinism guarantees.
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/**
 * Defines a uniform random number source with optional seeding.
 *
 * @remarks
 * Implementations must provide uniform distribution in [0, 1).
 *
 * @category Types
 * @since 0.7.0
 * @public
 */
export interface RandomSource {
 /**
  * Generates a random number in the range [0, 1).
  *
  * @returns A random number in [0, 1).
  *
  * @category Utility
  * @since 0.7.0
  */
 next(): number;

 /**
  * Generates a random integer in the range [0, max).
  *
  * @param max - Exclusive upper bound (must be positive).
  * @returns A random integer in [0, max).
  *
  * @category Utility
  * @since 0.7.0
  */
 nextInt(max: number): number;

 /**
  * Seeds the random number generator when supported.
  *
  * @param seed - Integer seed value.
  *
  * @remarks
  * Not all sources support seeding (for example, Math.random()).
  *
  * @category Utility
  * @since 0.7.0
  */
 seed?(seed: number): void;
}

/* ========================================================================== */
/* Random Sources                                                             */
/* ========================================================================== */

/**
 * Non-deterministic random source backed by `Math.random`.
 *
 * @remarks
 * This source is not seedable and is not deterministic.
 *
 * @category Utility
 * @since 0.7.0
 * @public
 */
export class MathRandomSource implements RandomSource {
 /**
  * Generates a random number using Math.random().
  *
  * @returns A random number in [0, 1).
  *
  * @category Utility
  * @since 0.7.0
  */
 next(): number {
  return Math.random();
 }

 /**
  * Generates a random integer using Math.random().
  *
  * @param max - Exclusive upper bound.
  * @returns A random integer in [0, max).
  *
  * @category Utility
  * @since 0.7.0
  */
 nextInt(max: number): number {
  return Math.floor(Math.random() * max);
 }
}

/**
 * Deterministic random source using a linear congruential generator (LCG).
 *
 * @remarks
 * Based on Park and Miller's "minimal standard" generator and provides
 * deterministic pseudo-random numbers when seeded.
 *
 * @category Utility
 * @since 0.7.0
 * @public
 */
export class SeededRandomSource implements RandomSource {
 private static readonly A = 16807; // Multiplier (7^5)
 private static readonly M = 2147483647; // Modulus (2^31 - 1, a Mersenne prime)
 private static readonly Q = 127773; // M / A
 private static readonly R = 2836; // M % A

 private state: number;

 /**
  * Creates a new seeded random source.
  *
  * @param seed - Initial seed value. Defaults to the current time.
  */
 constructor(seed?: number) {
  this.state = seed !== undefined ? Math.abs(seed | 0) || 1 : Date.now();
  // Ensure state is in valid range [1, M-1]
  this.state = (this.state % (SeededRandomSource.M - 1)) + 1;
 }

 /**
  * Generates the next random number.
  *
  * @returns A random number in [0, 1).
  *
  * @remarks
  * Uses Park and Miller's algorithm with Schrage's method to avoid overflow.
  *
  * @category Utility
  * @since 0.7.0
  */
 next(): number {
  const k = Math.floor(this.state / SeededRandomSource.Q);
  this.state =
   SeededRandomSource.A * (this.state - k * SeededRandomSource.Q) - k * SeededRandomSource.R;

  if (this.state < 0) {
   this.state += SeededRandomSource.M;
  }

  // Convert to [0, 1) range
  return (this.state - 1) / (SeededRandomSource.M - 1);
 }

 /**
  * Generates a random integer.
  *
  * @param max - Exclusive upper bound.
  * @returns A random integer in [0, max).
  *
  * @category Utility
  * @since 0.7.0
  */
 nextInt(max: number): number {
  return Math.floor(this.next() * max);
 }

 /**
  * Re-seeds the generator.
  *
  * @param seed - New seed value.
  *
  * @category Utility
  * @since 0.7.0
  */
 seed(seed: number): void {
  this.state = Math.abs(seed | 0) || 1;
  this.state = (this.state % (SeededRandomSource.M - 1)) + 1;
 }

 /**
  * Returns the current internal state.
  *
  * @returns Current state value.
  *
  * @remarks
  * Useful for saving and restoring random generator state.
  *
  * @category Utility
  * @since 0.7.0
  */
 getState(): number {
  return this.state;
 }

 /**
  * Sets the internal state directly.
  *
  * @param state - State value to set.
  *
  * @remarks
  * Useful for restoring a previously saved state.
  *
  * @throws {RangeError} If `state` is outside [1, M - 1].
  *
  * @category Utility
  * @since 0.7.0
  */
 setState(state: number): void {
  if (state <= 0 || state >= SeededRandomSource.M) {
   throw new RangeError(`State must be in range [1, ${SeededRandomSource.M - 1}]`);
  }
  this.state = state;
 }
}

/* ========================================================================== */
/* Default Source Configuration                                               */
/* ========================================================================== */

/**
 * Global default random source.
 *
 * @remarks
 * Replace this to change random behavior globally.
 *
 * @category Utility
 * @since 0.7.0
 * @public
 */
export let defaultRandomSource: RandomSource = new MathRandomSource();

/**
 * Sets the global default random source.
 *
 * @param source - New default random source.
 *
 * @category Utility
 * @since 0.7.0
 * @public
 */
export function setDefaultRandomSource(source: RandomSource): void {
 defaultRandomSource = source;
}

/**
 * Returns the global default random source.
 *
 * @returns Current default random source.
 *
 * @category Utility
 * @since 0.7.0
 * @public
 */
export function getDefaultRandomSource(): RandomSource {
 return defaultRandomSource;
}
