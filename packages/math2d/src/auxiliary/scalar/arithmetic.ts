/**
 * @file auxiliary/scalar/arithmetic.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Fundamental scalar arithmetic operations
 */

/**
 * Clamps a value between min and max bounds.
 * @param value - Value to clamp
 * @param min - Lower bound
 * @param max - Upper bound
 * @returns Clamped value
 *
 * @example
 * ```typescript
 * clamp(5, 0, 10);    // 5
 * clamp(-5, 0, 10);   // 0
 * clamp(15, 0, 10);   // 10
 * clamp(NaN, 0, 10);  // NaN
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function clamp(value: number, min: number, max: number): number {
 return value < min ? min : value > max ? max : value;
}

/**
 * Returns the sign of a number (-1, 0, or 1).
 * More robust than Math.sign for special cases.
 * @param value - Input number
 * @returns Sign of x
 *
 * @remarks
 * Handles special cases:
 * - Returns 0 for both +0 and -0
 * - Returns 0 for NaN (unlike Math.sign which returns NaN)
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function sign(value: number): number {
 if (value > 0) return 1;
 if (value < 0) return -1;
 return 0; // Handles -0, +0, NaN
}

/**
 * Absolute value.
 *
 * @remarks
 * This is a thin wrapper around {@link Math.abs} provided for API completeness.
 * Internal library code may use {@link Math.abs} directly for clarity and to
 * avoid indirection overhead in hot paths. Both are deterministic per IEEE 754.
 *
 * **When to use this function:**
 * - When you want a consistent import from `@lenguados/math2d`
 * - In user-facing code for API consistency
 *
 * **When to use Math.abs directly:**
 * - In performance-critical internal code
 * - When working with standard library patterns
 *
 * @param value - Input value
 * @returns Absolute value
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function abs(value: number): number {
 return Math.abs(value);
}

/**
 * Minimum of two values.
 * Type-safe wrapper for Math.min.
 * @param a - First value
 * @param b - Second value
 * @returns Minimum value
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function min(a: number, b: number): number {
 return Math.min(a, b);
}

/**
 * Maximum of two values.
 * Type-safe wrapper for Math.max.
 * @param a - First value
 * @param b - Second value
 * @returns Maximum value
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function max(a: number, b: number): number {
 return Math.max(a, b);
}

/**
 * Saturates value to [0, 1] range.
 * Commonly used for colors, interpolation factors.
 * @param value - Value to saturate
 * @returns Saturated value in [0, 1]
 *
 * @example
 * ```typescript
 * saturate(-0.5);  // 0
 * saturate(0.5);   // 0.5
 * saturate(1.5);   // 1
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function saturate(value: number): number {
 return clamp(value, 0, 1);
}

/**
 * Saturates value to [-1, 1] range.
 * Useful for normalized directions.
 * @param value - Value to saturate
 * @returns Saturated value in [-1, 1]
 *
 * @example
 * ```typescript
 * saturateSigned(-2);   // -1
 * saturateSigned(0.5);  // 0.5
 * saturateSigned(2);    // 1
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function saturateSigned(value: number): number {
 return clamp(value, -1, 1);
}

/**
 * Linear mapping from [inMin, inMax] to [outMin, outMax].
 * @param value - Value to remap
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Remapped value
 *
 * @example
 * ```typescript
 * remap(5, 0, 10, 0, 100);    // 50
 * remap(75, 0, 100, -1, 1);   // 0.5
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function remap(
 value: number,
 inMin: number,
 inMax: number,
 outMin: number,
 outMax: number,
): number {
 const inRange = inMax - inMin;
 if (inRange === 0) {
  // When input range is zero, return midpoint of output range
  return (outMin + outMax) * 0.5;
 }
 const normalized = (value - inMin) / inRange;
 return outMin + normalized * (outMax - outMin);
}

/**
 * Loops value into [min, max) range.
 * Unlike clamp, wraps around.
 * @param value - Value to wrap
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (exclusive)
 * @returns Wrapped value
 *
 * @example
 * ```typescript
 * loop(-1, 0, 10);   // 9
 * loop(10, 0, 10);   // 0
 * loop(15, 0, 10);   // 5
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function loop(value: number, min: number, max: number): number {
 const range = max - min;
 if (range <= 0) return min;

 const wrapped = ((value - min) % range) + min;
 return wrapped < min ? wrapped + range : wrapped;
}

/**
 * Ping-pongs value in [min, max] range.
 * Bounces back and forth instead of wrapping.
 * @param value - Value to ping-pong
 * @param min - Lower bound
 * @param max - Upper bound
 * @returns Ping-ponged value
 *
 * @example
 * ```typescript
 * pingPong(3, 0, 2);    // 1 (bounces back from 2)
 * pingPong(5, 0, 2);    // 1 (continues bouncing)
 * pingPong(-1, 0, 2);   // 1 (bounces from 0)
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function pingPong(value: number, min: number, max: number): number {
 const range = max - min;
 if (range <= 0) return min;

 const doubleRange = range * 2;
 let phase = (value - min) % doubleRange;
 if (phase < 0) {
  phase += doubleRange;
 }

 if (phase <= range) {
  return min + phase;
 }

 const reflected = phase - range;
 return max - reflected;
}

/**
 * Step function (Heaviside function).
 * Returns 0 if x < edge, else 1.
 * @param edge - Threshold value
 * @param x - Input value
 * @returns 0 or 1
 *
 * @example
 * ```typescript
 * step(5, 3);      // 0 (3 < 5)
 * step(5, 5);      // 1 (5 >= 5)
 * step(5, 7);      // 1 (7 > 5)
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function step(edge: number, x: number): number {
 return x < edge ? 0 : 1;
}

/**
 * Modulo operation that always returns positive result.
 * Unlike %, this handles negative numbers correctly.
 * @param dividend - Value to divide
 * @param divisor - Divisor (must be positive)
 * @returns Positive modulo result
 *
 * @example
 * ```typescript
 * mod(7, 3);       // 1
 * mod(-7, 3);      // 2 (not -1 like %)
 * mod(-1, 3);      // 2
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function mod(dividend: number, divisor: number): number {
 if (divisor <= 0) return 0;
 const result = dividend % divisor;
 return result < 0 ? result + divisor : result;
}

/**
 * Returns the floor of value/divisor.
 * Useful for grid cell calculations.
 * @param value - Numerator
 * @param divisor - Denominator
 * @returns Floor of division
 *
 * @example
 * ```typescript
 * floorDivide(7, 3);      // 2
 * floorDivide(-7, 3);     // -3
 * floorDivide(6, 3);      // 2
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function floorDivide(value: number, divisor: number): number {
 return Math.floor(value / divisor);
}

/**
 * Rounds to nearest integer away from zero.
 * @param value - Value to round
 * @returns Rounded value
 *
 * @example
 * ```typescript
 * roundAwayFromZero(1.5);     // 2
 * roundAwayFromZero(-1.5);    // -2
 * roundAwayFromZero(1.4);     // 1
 * roundAwayFromZero(-1.4);    // -1
 * ```
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function roundAwayFromZero(value: number): number {
 if (value >= 0) {
  return Math.floor(value + 0.5);
 }
 return Math.ceil(value - 0.5);
}
