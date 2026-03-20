/**
 * @file utils/random-source.ts
 * @module @lenguados/math2d/utils
 * @description Random number source abstractions for deterministic sampling
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
  * @returns A random number in [0, 1)
  *
  * @category Accessor
  * @since 0.7.0
  */
 next(): number;

 /**
  * Generates a random integer in the range [0, max).
  *
  * @param max - Exclusive upper bound (must be positive)
  * @returns A random integer in [0, max)
  *
  * @category Accessor
  * @since 0.7.0
  */
 nextInt(max: number): number;

 /**
  * Seeds the random number generator when supported.
  *
  * @remarks
  * Not all sources support seeding (for example, Math.random()).
  *
  * @param seed - Integer seed value
  *
  * @category Accessor
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
 * @example
 * ```typescript
 * const rng = new MathRandomSource();
 * const value = rng.next();       // random number in [0, 1)
 * const index = rng.nextInt(10);  // random integer in [0, 10)
 * ```
 *
 * @category Factory
 * @since 0.7.0
 * @public
 */
export class MathRandomSource implements RandomSource {
 /**
  * Generates a random number using Math.random().
  *
  * @returns A random number in [0, 1)
  *
  * @category Accessor
  * @since 0.7.0
  */
 next(): number {
  return Math.random();
 }

 /**
  * Generates a random integer using Math.random().
  *
  * @param max - Exclusive upper bound
  * @returns A random integer in [0, max)
  *
  * @category Accessor
  * @since 0.7.0
  */
 nextInt(max: number): number {
  return Math.floor(Math.random() * max);
 }
}

/* ========================================================================== */
/* xoshiro128++ internals                                                      */
/* ========================================================================== */

/**
 * SplitMix32 seed expansion function.
 * Expands a single 32-bit seed into a full 128-bit xoshiro128++ state.
 *
 * @remarks
 * Uses the SplitMix32 algorithm per Blackman & Vigna recommendation for
 * initializing larger state from a single seed. Constants: gamma = 0x9e3779b9,
 * mixing multipliers 0x85ebca6b and 0xc2b2ae35, shift amounts 16/13/16.
 *
 * @param seed - 32-bit integer seed
 * @returns 4-element array of uint32 state values
 *
 * @internal
 */
function splitMix32(seed: number): [number, number, number, number] {
 let z = seed | 0;
 const result: [number, number, number, number] = [0, 0, 0, 0];

 for (let index = 0; index < 4; index++) {
  z = (z + 0x9e3779b9) | 0;
  let t = z;
  t = Math.imul(t ^ (t >>> 16), 0x85ebca6b);
  t = Math.imul(t ^ (t >>> 13), 0xc2b2ae35);
  result[index] = (t ^ (t >>> 16)) >>> 0;
 }

 // Ensure state is not all-zero (degenerate case)
 if (result[0] === 0 && result[1] === 0 && result[2] === 0 && result[3] === 0) {
  result[0] = 1;
 }

 return result;
}

/**
 * 32-bit left rotation.
 * @param x - Value to rotate
 * @param k - Number of positions to rotate left
 * @returns Rotated 32-bit unsigned integer
 * @internal
 */
function rotl(x: number, k: number): number {
 return ((x << k) | (x >>> (32 - k))) >>> 0;
}

/**
 * xoshiro128++ core step.
 * Advances the 4 × uint32 state and returns a 32-bit unsigned integer.
 *
 * @remarks
 * Implements the scrambler: `rotl(s0 + s3, 7) + s0` per Blackman & Vigna (2021).
 *
 * @param s - 4-element state array of uint32 values
 * @returns 32-bit unsigned integer
 *
 * @internal
 */
function xoshiro128pp(s: [number, number, number, number]): number {
 // Scrambler: rotl(s[0] + s[3], 7) + s[0]
 const result = (rotl((s[0] + s[3]) >>> 0, 7) + s[0]) >>> 0;

 const t = (s[1] << 9) >>> 0;

 s[2] = (s[2] ^ s[0]) >>> 0;
 s[3] = (s[3] ^ s[1]) >>> 0;
 s[1] = (s[1] ^ s[2]) >>> 0;
 s[0] = (s[0] ^ s[3]) >>> 0;

 s[2] = (s[2] ^ t) >>> 0;

 s[3] = rotl(s[3], 11);

 return result;
}

/**
 * Deterministic random source using xoshiro128++ algorithm.
 *
 * @remarks
 * Uses xoshiro128++ (Blackman & Vigna, 2021) with 4 × uint32 state for
 * high-quality pseudo-random numbers. State is initialized via SplitMix32
 * seed expansion. Provides unbiased integer generation via rejection sampling.
 *
 * @example
 * ```typescript
 * const rng = new SeededRandomSource(12345);
 * const a = rng.next();       // deterministic value in [0, 1)
 * const b = rng.nextInt(100); // deterministic integer in [0, 100)
 * ```
 *
 * @category Factory
 * @since 0.7.0
 * @public
 */
export class SeededRandomSource implements RandomSource {
 private state: [number, number, number, number];

 /**
  * Creates a new seeded random source.
  *
  * @param seed - Initial seed value. Defaults to sub-millisecond timestamp
  */
 constructor(seed?: number) {
  if (seed !== undefined) {
   this.state = splitMix32(seed | 0);
  } else {
   // Sub-millisecond uniqueness with Date.now() fallback
   const now =
    typeof globalThis.performance !== 'undefined'
     ? (globalThis.performance.now() * 1000) | 0
     : Date.now() | 0;
   this.state = splitMix32(now);
  }
 }

 /**
  * Generates the next random number.
  *
  * @remarks
  * Uses xoshiro128++ algorithm with 32-bit state for deterministic generation.
  *
  * @returns A random number in [0, 1)
  *
  * @category Accessor
  * @since 0.7.0
  */
 next(): number {
  // Convert uint32 to [0, 1) by dividing by 2^32
  return xoshiro128pp(this.state) / 4294967296;
 }

 /**
  * Generates a random integer in [0, max).
  *
  * @remarks
  * Uses rejection sampling with modulo debiasing to eliminate bias.
  *
  * @param max - Exclusive upper bound
  * @returns A random integer in [0, max)
  *
  * @throws {TypeError} If max is not a positive integer
  *
  * @category Accessor
  * @since 0.7.0
  */
 nextInt(max: number): number {
  if (max <= 0 || !Number.isInteger(max) || max !== max) {
   throw new TypeError(`SeededRandomSource.nextInt: max must be a positive integer, got ${max}`);
  }

  // Rejection sampling: discard values in [0, 2^32 % max) so remaining range divides evenly
  const maxU32 = 0x100000000; // 2^32
  const reject = maxU32 % max;

  let raw: number;
  do {
   raw = xoshiro128pp(this.state);
  } while (raw < reject);

  return raw % max;
 }

 /**
  * Re-seeds the generator using SplitMix32 expansion.
  *
  * @param seed - New seed value
  *
  * @category Configuration
  * @since 0.7.0
  */
 seed(seed: number): void {
  this.state = splitMix32(seed | 0);
 }

 /**
  * Returns the current internal state as a 4-element uint32 array.
  *
  * @remarks
  * Useful for saving and restoring random generator state.
  *
  * @returns Copy of the current `[s0, s1, s2, s3]` state
  *
  * @category Accessor
  * @since 0.7.0
  */
 getState(): [number, number, number, number] {
  return [this.state[0], this.state[1], this.state[2], this.state[3]];
 }

 /**
  * Restores a previously saved state.
  *
  * @param state - 4-element uint32 state array from {@link getState}
  *
  * @throws {RangeError} If state is not a 4-element array or is all zeros
  *
  * @category Configuration
  * @since 0.7.0
  */
 restoreState(state: [number, number, number, number]): void {
  if (!Array.isArray(state) || state.length !== 4) {
   throw new RangeError('State must be a 4-element array');
  }
  if (state[0] === 0 && state[1] === 0 && state[2] === 0 && state[3] === 0) {
   throw new RangeError('State must not be all zeros');
  }
  this.state = [state[0] >>> 0, state[1] >>> 0, state[2] >>> 0, state[3] >>> 0];
 }
}

/* ========================================================================== */
/* Default Source Configuration                                               */
/* ========================================================================== */

/**
 * Global default random source (module-private).
 * @internal
 */
let defaultRandomSource: RandomSource = new MathRandomSource();

/**
 * Sets the global default random source.
 *
 * @param source - New default random source
 *
 * @example
 * ```typescript
 * setDefaultRandomSource(new SeededRandomSource(42));
 * ```
 *
 * @category Configuration
 * @since 0.7.0
 * @public
 */
export function setDefaultRandomSource(source: RandomSource): void {
 defaultRandomSource = source;
}

/**
 * Returns the global default random source.
 *
 * @returns Current default random source
 *
 * @example
 * ```typescript
 * const rng = getDefaultRandomSource();
 * const value = rng.next();
 * ```
 *
 * @category Configuration
 * @since 0.7.0
 * @public
 */
export function getDefaultRandomSource(): RandomSource {
 return defaultRandomSource;
}
