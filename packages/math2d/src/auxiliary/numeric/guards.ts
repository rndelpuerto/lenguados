/**
 * @file auxiliary/numeric/guards.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Numeric type guards and validation functions
 */

import { clamp } from '../scalar/arithmetic';

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
 * Tests if value is a denormal number.
 * @param value - Value to test
 * @returns True if denormal
 *
 * @remarks
 * Denormal (or subnormal) numbers are very small numbers that
 * can cause performance issues on some processors.
 *
 * @example
 * ```typescript
 * isDenormal(1e-308);        // false (normal)
 * isDenormal(5e-324);        // true (denormal)
 * isDenormal(0);             // false
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function isDenormal(value: number): boolean {
 return value !== 0 && Math.abs(value) < Number.MIN_VALUE;
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

/**
 * Validates and cleans numeric value.
 * @param value - Value to sanitize
 * @param fallback - Value to use if input is invalid (default: 0)
 * @param min - Minimum allowed value (default: -Number.MAX_VALUE)
 * @param max - Maximum allowed value (default: Number.MAX_VALUE)
 * @returns Clean value or fallback
 *
 * @example
 * ```typescript
 * sanitizeNumber(42);                    // 42
 * sanitizeNumber(NaN);                   // 0 (fallback)
 * sanitizeNumber(Infinity);              // 0 (fallback)
 * sanitizeNumber(100, 0, 0, 50);         // 50 (clamped to max)
 * sanitizeNumber(-10, 0, 0, 100);        // 0 (clamped to min)
 * sanitizeNumber(NaN, -1);               // -1 (custom fallback)
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function sanitizeNumber(
 value: number,
 fallback: number = 0,
 min: number = -Number.MAX_VALUE,
 max: number = Number.MAX_VALUE,
): number {
 if (!Number.isFinite(value)) {
  return fallback;
 }
 return clamp(value, min, max);
}

/**
 * Ensures finite value, replaces NaN/Infinity.
 * @param value - Value to check
 * @param fallback - Replacement for non-finite values (default: 0)
 * @returns Finite value or fallback
 *
 * @example
 * ```typescript
 * ensureFinite(42);              // 42
 * ensureFinite(NaN);             // 0
 * ensureFinite(Infinity);        // 0
 * ensureFinite(-Infinity);       // 0
 * ensureFinite(NaN, 1);          // 1 (custom fallback)
 * ```
 *
 * @category Guards
 * @since 1.0.0
 */
export function ensureFinite(value: number, fallback: number = 0): number {
 return Number.isFinite(value) ? value : fallback;
}
