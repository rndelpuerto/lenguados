/**
 * @file auxiliary/scalar/arithmetic.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Fundamental scalar arithmetic operations
 */

/**
 * Clamps a value between min and max bounds
 *
 * @remarks
 * The implementation is permissive on the `min > max` configuration: when
 * `min > max`, a `value` in the overlap `(max, min)` short-circuits through
 * the ternary and returns `min` (because `value < min` fires first); a
 * `value > min` returns `max`; a `value < max` returns `min`. This is
 * intentional — callers that need a stricter contract should validate the
 * bounds before calling.
 *
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
 * @since 0.5.0
 */
export function clamp(value: number, min: number, max: number): number {
 return value < min ? min : value > max ? max : value;
}

/**
 * Returns the sign of a number (-1, 0, or 1)
 * More robust than Math.sign for special cases.
 *
 * @remarks
 * Handles special cases:
 * - Returns 0 for both +0 and -0
 * - Returns 0 for NaN (unlike Math.sign which returns NaN)
 *
 * @param value - Input number
 * @returns Sign of the value
 *
 * @example
 * ```typescript
 * sign(42);    // 1
 * sign(-3.5);  // -1
 * sign(0);     // 0
 * sign(NaN);   // NaN (propagates per IEEE 754 §6.2)
 * ```
 *
 * @category Arithmetic
 * @since 0.5.0
 */
export function sign(value: number): number {
 if (value > 0) return 1;
 if (value < 0) return -1;
 // Propagate NaN per IEEE 754 §6.2 / ECMA-262 §21.3.2.32; +0 and -0 return 0.
 return value !== value ? value : 0;
}

/**
 * Saturates value to [0, 1] range
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
 * @since 0.5.0
 */
export function saturate(value: number): number {
 return clamp(value, 0, 1);
}

/**
 * Loops value into [min, max) range (strict)
 * @param value - Value to wrap
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (exclusive)
 * @returns Wrapped value
 * @throws {RangeError} If range is invalid (max <= min)
 *
 * @example
 * ```typescript
 * loop(-1, 0, 10);   // 9
 * loop(10, 0, 10);   // 0
 * loop(15, 0, 10);   // 5
 * ```
 *
 * @see {@link loopSafe} - Returns min if range is invalid
 * @see {@link loopUnchecked} - No validation
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function loop(value: number, min: number, max: number): number {
 const range = max - min;
 if (range <= 0) {
  throw new RangeError('loop: invalid range (max must be greater than min)');
 }
 const wrapped = ((value - min) % range) + min;
 return wrapped < min ? wrapped + range : wrapped;
}

/**
 * Loops value into [min, max) range (safe)
 * @param value - Value to wrap
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (exclusive)
 * @returns Wrapped value, or min if range is invalid
 *
 * @example
 * ```typescript
 * loopSafe(5, 0, 10);    // 5
 * loopSafe(5, 5, 5);     // 5 (return min)
 * ```
 *
 * @see {@link loop} - Throws for invalid range
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function loopSafe(value: number, min: number, max: number): number {
 const range = max - min;
 if (range <= 0) return min;
 const wrapped = ((value - min) % range) + min;
 return wrapped < min ? wrapped + range : wrapped;
}

/**
 * Loops value into [min, max) range (unchecked)
 *
 * @remarks
 * **Precondition:** max > min. Invalid range produces undefined behavior.
 *
 * @param value - Value to wrap
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (exclusive, must be > min)
 * @returns Wrapped value
 *
 * @see {@link loop} - Throws for invalid range
 * @see {@link loopSafe} - Returns min if range is invalid
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function loopUnchecked(value: number, min: number, max: number): number {
 const range = max - min;
 const wrapped = ((value - min) % range) + min;
 return wrapped < min ? wrapped + range : wrapped;
}

/**
 * Step function (Heaviside function)
 * Returns 0 if x < edge, else 1.
 *
 * @remarks
 * NaN comparisons: `step(NaN, x)` returns 1 (x is not < NaN), `step(edge, NaN)` returns 1.
 *
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
 * @since 0.7.0
 */
export function step(edge: number, x: number): number {
 return x < edge ? 0 : 1;
}

/**
 * Modulo operation that always returns positive result (strict)
 * @param dividend - Value to divide
 * @param divisor - Divisor (must be positive)
 * @returns Positive modulo result
 * @throws {RangeError} If divisor is not positive
 *
 * @example
 * ```typescript
 * mod(7, 3);       // 1
 * mod(-7, 3);      // 2 (not -1 like %)
 * ```
 *
 * @see {@link modSafe} - Returns 0 if divisor invalid
 * @see {@link modUnchecked} - No validation
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function mod(dividend: number, divisor: number): number {
 if (divisor <= 0) {
  throw new RangeError('mod: divisor must be positive');
 }
 const result = dividend % divisor;
 return result < 0 ? result + divisor : result;
}

/**
 * Modulo operation that always returns positive result (safe)
 * @param dividend - Value to divide
 * @param divisor - Divisor
 * @returns Positive modulo result, or 0 if divisor <= 0
 *
 * @example
 * ```typescript
 * modSafe(7, 3);      // 1
 * modSafe(7, 0);      // 0
 * ```
 *
 * @see {@link mod} - Throws for non-positive divisor
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function modSafe(dividend: number, divisor: number): number {
 if (divisor <= 0) return 0;
 const result = dividend % divisor;
 return result < 0 ? result + divisor : result;
}

/**
 * Modulo operation that always returns positive result (unchecked)
 *
 * @remarks
 * **Precondition:** divisor > 0.
 *
 * @param dividend - Value to divide
 * @param divisor - Divisor (must be positive)
 * @returns Positive modulo result
 *
 * @see {@link mod} - Throws for non-positive divisor
 * @see {@link modSafe} - Returns 0 if divisor is invalid
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function modUnchecked(dividend: number, divisor: number): number {
 const result = dividend % divisor;
 return result < 0 ? result + divisor : result;
}

/**
 * Returns the floor of value/divisor
 * Useful for grid cell calculations.
 * @param value - Numerator
 * @param divisor - Denominator
 * @returns Floor of division
 * @throws {RangeError} If divisor is zero
 *
 * @example
 * ```typescript
 * floorDivide(7, 3);      // 2
 * floorDivide(-7, 3);     // -3
 * floorDivide(6, 3);      // 2
 * ```
 *
 * @see {@link floorDivideSafe} - Returns 0 if divisor is zero
 * @see {@link floorDivideUnchecked} - No validation
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function floorDivide(value: number, divisor: number): number {
 if (divisor === 0) {
  throw new RangeError('floorDivide: divisor must not be zero');
 }
 return Math.floor(value / divisor);
}

/**
 * Safe floored division. Returns 0 for zero divisor
 * @param value - Numerator
 * @param divisor - Denominator
 * @returns Floor of division, or 0 if divisor is zero
 *
 * @see {@link floorDivide} - Throws for zero divisor
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function floorDivideSafe(value: number, divisor: number): number {
 if (divisor === 0) return 0;
 return Math.floor(value / divisor);
}

/**
 * Unchecked floored division. No validation
 *
 * @remarks
 * **Precondition:** divisor !== 0.
 *
 * @param value - Numerator
 * @param divisor - Denominator
 * @returns Floor of division
 *
 * @see {@link floorDivide} - Throws for zero divisor
 * @see {@link floorDivideSafe} - Returns 0 if divisor is zero
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function floorDivideUnchecked(value: number, divisor: number): number {
 return Math.floor(value / divisor);
}
