/**
 * @file src/utils/random-source.ts
 * @module math2d/utils/random-source
 * @description
 * Random number source abstraction for deterministic and non-deterministic random generation.
 *
 * This allows the math2d library to support:
 * - Default Math.random() for typical use
 * - Seeded random for deterministic simulations
 * - Custom random sources for testing or specialized needs
 */

/**
 * Interface for random number generation sources.
 * Implementations must provide uniform distribution in [0, 1).
 * @public
 */
export interface RandomSource {
 /**
  * Generate a random number in the range [0, 1).
  * Must return values with uniform distribution.
  * @returns A random number in [0, 1)
  */
 next(): number;

 /**
  * Generate a random integer in the range [0, max).
  * @param max - Exclusive upper bound (must be positive)
  * @returns A random integer in [0, max)
  */
 nextInt(max: number): number;

 /**
  * Optional: Seed the random number generator.
  * Not all sources support seeding (e.g., Math.random).
  * @param seed - Integer seed value
  */
 seed?(seed: number): void;
}

/**
 * Default random source using Math.random().
 * This is not seedable and not deterministic.
 * @public
 */
export class MathRandomSource implements RandomSource {
 /**
  * Generate a random number using Math.random().
  * @returns A random number in [0, 1)
  */
 next(): number {
  return Math.random();
 }

 /**
  * Generate a random integer using Math.random().
  * @param max - Exclusive upper bound
  * @returns A random integer in [0, max)
  */
 nextInt(max: number): number {
  return Math.floor(Math.random() * max);
 }
}

/**
 * Seeded random source using a linear congruential generator (LCG).
 * Based on Park & Miller's "minimal standard" generator.
 * Provides deterministic pseudo-random numbers when seeded.
 * @public
 */
export class SeededRandomSource implements RandomSource {
 private static readonly A = 16807; // Multiplier (7^5)
 private static readonly M = 2147483647; // Modulus (2^31 - 1, a Mersenne prime)
 private static readonly Q = 127773; // M / A
 private static readonly R = 2836; // M % A

 private state: number;

 /**
  * Create a new seeded random source.
  * @param seed - Initial seed value (defaults to current time)
  */
 constructor(seed?: number) {
  this.state = seed !== undefined ? Math.abs(seed | 0) || 1 : Date.now();
  // Ensure state is in valid range [1, M-1]
  this.state = (this.state % (SeededRandomSource.M - 1)) + 1;
 }

 /**
  * Generate the next random number.
  * Uses Park & Miller's algorithm with Schrage's method to avoid overflow.
  * @returns A random number in [0, 1)
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
  * Generate a random integer.
  * @param max - Exclusive upper bound
  * @returns A random integer in [0, max)
  */
 nextInt(max: number): number {
  return Math.floor(this.next() * max);
 }

 /**
  * Re-seed the generator.
  * @param seed - New seed value
  */
 seed(seed: number): void {
  this.state = Math.abs(seed | 0) || 1;
  this.state = (this.state % (SeededRandomSource.M - 1)) + 1;
 }

 /**
  * Get the current internal state.
  * Useful for saving/restoring random generator state.
  * @returns Current state value
  */
 getState(): number {
  return this.state;
 }

 /**
  * Set the internal state directly.
  * Useful for restoring a previously saved state.
  * @param state - State value to set
  */
 setState(state: number): void {
  if (state <= 0 || state >= SeededRandomSource.M) {
   throw new RangeError(`State must be in range [1, ${SeededRandomSource.M - 1}]`);
  }
  this.state = state;
 }
}

/**
 * Global default random source.
 * Can be replaced to change random behavior globally.
 * @public
 */
export let defaultRandomSource: RandomSource = new MathRandomSource();

/**
 * Set the global default random source.
 * @param source - New default random source
 * @public
 */
export function setDefaultRandomSource(source: RandomSource): void {
 defaultRandomSource = source;
}

/**
 * Get the global default random source.
 * @returns Current default random source
 * @public
 */
export function getDefaultRandomSource(): RandomSource {
 return defaultRandomSource;
}
