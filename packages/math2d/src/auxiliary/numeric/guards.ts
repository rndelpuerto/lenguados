/**
 * @file auxiliary/numeric/guards.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Numeric type guards (boolean predicates)
 *
 * @remarks
 * This module provides boolean predicates for testing numeric values.
 * For safe operations that return numbers, see {@link ./safety}.
 *
 * **API Design Note:**
 * Some functions like `isFinite` and `isNaN` are thin wrappers around
 * `Number.*` methods. They are included for:
 * - API consistency (all numeric guards in one place)
 * - Tree-shaking (import only what you need)
 * - Documentation (clear examples and edge case behavior)
 *
 * Functions like `isDenormal`, `isInfinity`, and `isInRange` provide
 * additional value not available in the standard library.
 */

/**
 * Tests if value is finite (not NaN, ±Infinity).
 * @param value - Value to test
 * @returns True if finite number
 *
 * @example
 * ```typescript
 * isFinite(42);            // true
 * isFinite(0);             // true
 * isFinite(NaN);           // false
 * isFinite(Infinity);      // false
 * isFinite(-Infinity);     // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isFinite(value: number): boolean {
 return Number.isFinite(value);
}

/**
 * Tests if value is NaN.
 * @param value - Value to test
 * @returns True if NaN
 *
 * @example
 * ```typescript
 * isNaN(NaN);              // true
 * isNaN(0 / 0);            // true
 * isNaN(42);               // false
 * isNaN(Infinity);         // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isNaN(value: number): boolean {
 return Number.isNaN(value);
}

/**
 * Tests if value is positive infinity.
 * @param value - Value to test
 * @returns True if positive infinity
 *
 * @example
 * ```typescript
 * isPositiveInfinity(Infinity);      // true
 * isPositiveInfinity(1 / 0);         // true
 * isPositiveInfinity(-Infinity);     // false
 * isPositiveInfinity(42);            // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isPositiveInfinity(value: number): boolean {
 return value === Infinity;
}

/**
 * Tests if value is negative infinity.
 * @param value - Value to test
 * @returns True if negative infinity
 *
 * @example
 * ```typescript
 * isNegativeInfinity(-Infinity);     // true
 * isNegativeInfinity(-1 / 0);        // true
 * isNegativeInfinity(Infinity);      // false
 * isNegativeInfinity(-42);           // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isNegativeInfinity(value: number): boolean {
 return value === -Infinity;
}

/**
 * Tests if value is any infinity.
 * @param value - Value to test
 * @returns True if positive or negative infinity
 *
 * @example
 * ```typescript
 * isInfinity(Infinity);      // true
 * isInfinity(-Infinity);     // true
 * isInfinity(42);            // false
 * isInfinity(NaN);           // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isInfinity(value: number): boolean {
 return value === Infinity || value === -Infinity;
}

/**
 * Smallest positive normal number in IEEE 754 double precision.
 * Numbers smaller than this (but not zero) are denormal/subnormal.
 * @internal
 */
const SMALLEST_NORMAL = 2.2250738585072014e-308; // 2^-1022

/**
 * Tests if value is a denormal number.
 * @param value - Value to test
 * @returns True if denormal
 *
 * @remarks
 * Denormal (or subnormal) numbers are very small numbers that
 * can cause performance issues on some processors. In IEEE 754
 * double precision, denormals are numbers with absolute value
 * less than 2^-1022 (approximately 2.225e-308) but not zero.
 *
 * @example
 * ```typescript
 * isDenormal(1e-300);        // false (normal)
 * isDenormal(1e-308);        // true (denormal)
 * isDenormal(5e-324);        // true (denormal, smallest positive number)
 * isDenormal(0);             // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isDenormal(value: number): boolean {
 return value !== 0 && Math.abs(value) < SMALLEST_NORMAL;
}

/**
 * Tests if value is in safe integer range.
 * @param value - Value to test
 * @returns True if safe integer
 *
 * @example
 * ```typescript
 * isSafeInteger(42);                     // true
 * isSafeInteger(Number.MAX_SAFE_INTEGER); // true
 * isSafeInteger(Number.MAX_SAFE_INTEGER + 1); // false
 * isSafeInteger(3.14);                   // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isSafeInteger(value: number): boolean {
 return Number.isSafeInteger(value);
}

/**
 * Tests if value is in range [min, max].
 * @param value - Value to test
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 * @returns True if value is within range
 *
 * @example
 * ```typescript
 * isInRange(5, 0, 10);       // true
 * isInRange(0, 0, 10);       // true (on boundary)
 * isInRange(11, 0, 10);      // false
 * isInRange(-1, 0, 10);      // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isInRange(value: number, min: number, max: number): boolean {
 return value >= min && value <= max;
}
