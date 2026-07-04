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
 * Defines a uniform random number source with optional seeding
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
  * Generates a random number in the range [0, 1)
  *
  * @returns A random number in [0, 1)
  *
  * @category Accessor
  * @since 0.7.0
  */
 next(): number;

 /**
  * Generates a random integer in the range [0, max)
  *
  * @param max - Exclusive upper bound (must be positive)
  * @returns A random integer in [0, max)
  *
  * @category Accessor
  * @since 0.7.0
  */
 nextInt(max: number): number;

 /**
  * Seeds the random number generator when supported
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
 * Non-deterministic random source backed by `Math.random`
 *
 * @remarks
 * This source is not seedable and is not deterministic. Obtain the
 * process-wide instance through {@link getDefaultRandomSource}; direct
 * construction of additional instances is not supported (the class has no
 * per-instance state).
 *
 * @example
 * ```typescript
 * const rng = getDefaultRandomSource();
 * const value = rng.next();       // random number in [0, 1)
 * const index = rng.nextInt(10);  // random integer in [0, 10)
 * ```
 *
 * @category Factory
 * @since 0.7.0
 * @public
 */
export class MathRandomSource implements RandomSource {
 /** @internal */
 private constructor() {
  // Intentionally private. Use `getDefaultRandomSource()` to obtain
  // the process-wide instance.
 }

 /**
  * Internal factory used by the default-source helper
  *
  * @returns A new `MathRandomSource` instance
  *
  * @internal
  */
 public static create(): MathRandomSource {
  return new MathRandomSource();
 }

 /**
  * Generates a random number using Math.random()
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
  * Generates a random integer using Math.random()
  *
  * @param max - Exclusive upper bound; must be an integer in `[1, Number.MAX_SAFE_INTEGER]`
  * @returns A random integer in [0, max)
  *
  * @throws {RangeError} If `max` is not an integer, not positive, or exceeds `Number.MAX_SAFE_INTEGER`
  *
  * @category Accessor
  * @since 0.7.0
  */
 nextInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > Number.MAX_SAFE_INTEGER) {
   throw new RangeError(
    `MathRandomSource.nextInt: max must be a positive integer in [1, Number.MAX_SAFE_INTEGER], got ${max}`,
   );
  }
  return Math.floor(Math.random() * max);
 }
}

/* ========================================================================== */
/* xoshiro128++ internals                                                      */
/* ========================================================================== */

/**
 * SplitMix32 seed expansion function
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
 * Deterministic random source using xoshiro128++ algorithm
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
  * Creates a new seeded random source
  *
  * @remarks
  * Default-seed entropy: when `seed` is `undefined`, the constructor derives
  * a single 32-bit seed from `performance.now() * 1000 | 0` (or `Date.now() |
  * 0` as fallback). The `| 0` truncation discards every bit above 32, so two
  * sources constructed within the same microsecond tick receive identical
  * seeds. Callers that need independent streams started at the same moment
  * MUST supply an explicit `seed` (e.g. a per-stream index) rather than rely
  * on the timestamp default.
  *
  * @param seed - Initial seed value. Defaults to sub-millisecond timestamp (32-bit truncated)
  */
 constructor(seed?: number) {
  if (seed !== undefined) {
   this.state = splitMix32(seed | 0);
  } else {
   // Sub-millisecond uniqueness with Date.now() fallback. See constructor
   // @remarks for the 32-bit truncation caveat.
   const now =
    typeof globalThis.performance !== 'undefined'
     ? (globalThis.performance.now() * 1000) | 0
     : Date.now() | 0;
   this.state = splitMix32(now);
  }
 }

 /**
  * Generates the next random number
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
  * Returns an unbiased random integer in `[0, max)`
  *
  * @remarks
  * Two `xoshiro128++` draws are combined into a 53-bit raw value (top 27 bits of
  * the first draw + top 26 bits of the second), then rejection-sampled over
  * `2^53 % max` to preserve uniformity.
  *
  * **Supported range**: `1 ≤ max ≤ Number.MAX_SAFE_INTEGER` (`2^53 − 1`).
  *
  * **References**: Blackman & Vigna 2021 (xoshiro128++ specification);
  * Lemire 2019, "Fast Random Integer Generation in an Interval".
  *
  * @param max - Exclusive upper bound; must be an integer in `[1, Number.MAX_SAFE_INTEGER]`
  * @returns A random integer in `[0, max)`
  *
  * @throws {RangeError} If `max` is not an integer, not positive, or exceeds `Number.MAX_SAFE_INTEGER`
  *
  * @example
  * ```typescript
  * const rng = new SeededRandomSource(42);
  * rng.nextInt(100);                       // in [0, 100)
  * rng.nextInt(Number.MAX_SAFE_INTEGER);   // full safe-integer range
  * ```
  *
  * @category Accessor
  * @since 0.7.0
  */
 nextInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > Number.MAX_SAFE_INTEGER) {
   throw new RangeError(
    `SeededRandomSource.nextInt: max must be a positive integer in [1, Number.MAX_SAFE_INTEGER], got ${max}`,
   );
  }

  // Compose two xoshiro128++ draws into a 53-bit unbiased raw value.
  // Top 27 bits of `hi` + top 26 bits of `lo` = 53 bits = Number.MAX_SAFE_INTEGER + 1.
  // Rejection sample over 2^53 % max so the residual range divides max evenly.
  const MAX_RAW = 0x20000000000000; // 2^53
  const reject = MAX_RAW % max;

  let raw: number;
  do {
   const hi = xoshiro128pp(this.state); // uint32
   const lo = xoshiro128pp(this.state); // uint32
   raw = (hi >>> 5) * 0x4000000 + (lo >>> 6);
  } while (raw < reject);

  return raw % max;
 }

 /**
  * Re-seeds the generator using SplitMix32 expansion
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
  * Returns the current internal state as a 4-element uint32 array
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
  * Restores a previously saved state
  *
  * @remarks
  * Every component must be a finite integer in `[0, 2³²)`. The all-zero state
  * is the absorbing fixed point of xoshiro128++ (outputs only 0 forever) and
  * is rejected. NaN, Infinity, and non-integer components are rejected
  * **before** the uint32 coercion so callers get a precise diagnostic rather
  * than a silent `>>> 0 → 0` coercion.
  *
  * @param state - 4-element uint32 state array from {@link getState}
  *
  * @throws {RangeError} If state is not a 4-element array, contains a
  *         non-finite or non-integer component, or is all zeros.
  *
  * @category Configuration
  * @since 0.7.0
  */
 restoreState(state: [number, number, number, number]): void {
  if (!Array.isArray(state) || state.length !== 4) {
   throw new RangeError('SeededRandomSource.restoreState: state must be a 4-element array');
  }
  for (let index = 0; index < 4; index++) {
   const component = state[index]!;
   if (!Number.isInteger(component)) {
    throw new RangeError(
     `SeededRandomSource.restoreState: state[${index}] must be a finite integer; got ${component}`,
    );
   }
  }
  // Safe uint32 coercion on integer inputs (no silent NaN → 0 collapse).
  const s0 = state[0] >>> 0;
  const s1 = state[1] >>> 0;
  const s2 = state[2] >>> 0;
  const s3 = state[3] >>> 0;
  if (s0 === 0 && s1 === 0 && s2 === 0 && s3 === 0) {
   throw new RangeError(
    'SeededRandomSource.restoreState: state must not be all zeros (xoshiro128++ absorbing fixed point)',
   );
  }
  this.state = [s0, s1, s2, s3];
 }
}

/* ========================================================================== */
/* Default Source Configuration                                               */
/* ========================================================================== */

/**
 * Global default random source (module-private)
 * @internal
 */
let defaultRandomSource: RandomSource = MathRandomSource.create();

/**
 * Sets the global default random source
 *
 * @remarks
 * Process-wide mutation — the replacement applies to every module that
 * calls {@link getDefaultRandomSource} afterwards. Test suites that swap
 * the default source MUST capture the previous source and restore it in
 * `afterEach` / `afterAll`, otherwise later tests inherit the mutated
 * source and lose determinism.
 *
 * @param source - New default random source
 *
 * @example
 * ```typescript
 * const previous = getDefaultRandomSource();
 * setDefaultRandomSource(new SeededRandomSource(42));
 * try {
 *   // ...test code...
 * } finally {
 *   setDefaultRandomSource(previous);
 * }
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
 * Returns the global default random source
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
