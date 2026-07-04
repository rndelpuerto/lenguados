/**
 * @file auxiliary/numeric/rounding.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Rounding and quantization operations
 */

import { log } from '../../deterministic/deterministic-kernels';
import { LN_2 } from '../scalar/constants';

/**
 * Rounds a value to the nearest integer using banker's rounding (round half to even)
 *
 * @remarks
 * Banker's rounding reduces bias in repeated operations by rounding 0.5 to
 * the nearest even number. Non-finite inputs propagate per IEEE 754 §6.2 and
 * C99 §F.9.6.4: `NaN → NaN`, `±Infinity → ±Infinity`. Consistent with the sibling
 * `roundToMultiple`.
 *
 * @param value - Value to round
 * @returns Rounded integer; `NaN` for `NaN` input; `±Infinity` for `±Infinity`
 *
 * @example
 * ```typescript
 * roundToInt(3.2);       // 3
 * roundToInt(3.7);       // 4
 * roundToInt(3.5);       // 4 (rounds to even)
 * roundToInt(4.5);       // 4 (rounds to even)
 * roundToInt(-2.5);      // -2 (rounds to even)
 * roundToInt(NaN);       // NaN
 * roundToInt(Infinity);  // Infinity
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function roundToInt(value: number): number {
 // Propagate non-finite per IEEE 754 §6.2 / C99 §F.9.6.4:
 // NaN → NaN; ±Infinity → ±Infinity.
 if (!Number.isFinite(value)) return value;

 const integer = Math.floor(value);
 const fraction = value - integer;

 if (fraction < 0.5) return integer;
 if (fraction > 0.5) return integer + 1;

 // Exactly 0.5: round to even (banker's rounding)
 return integer % 2 === 0 ? integer : integer + 1;
}

/**
 * Rounds to specific decimal places
 *
 * @remarks
 * Uses the standard `Math.round(value * 10^places) / 10^places` approach.
 * Due to IEEE 754 binary floating-point representation, some decimal values
 * cannot be represented exactly. For example, `1.005` is stored as
 * `1.00499999999999989...`, so `roundToPlaces(1.005, 2)` returns `1.0`
 * rather than `1.01`. This is inherent to all multiply-round-divide
 * approaches in binary floating-point arithmetic.
 *
 * For extreme places values (>308), 10**places overflows to Infinity,
 * causing the result to be NaN.
 *
 * @param value - Value to round
 * @param places - Number of decimal places
 * @returns Rounded value
 *
 * @example
 * ```typescript
 * roundToPlaces(3.14159, 2);     // 3.14
 * roundToPlaces(3.14159, 4);     // 3.1416
 * roundToPlaces(1234.5, -2);     // 1200 (round to hundreds)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function roundToPlaces(value: number, places: number): number {
 if (!Number.isFinite(value)) return value;
 const factor = 10 ** places;
 return Math.round(value * factor) / factor;
}

/**
 * Rounds to nearest multiple
 * @param value - Value to round
 * @param multiple - Multiple to round to
 * @returns Rounded value
 *
 * @example
 * ```typescript
 * roundToMultiple(7, 5);         // 5
 * roundToMultiple(8, 5);         // 10
 * roundToMultiple(23, 10);       // 20
 * roundToMultiple(1.7, 0.5);     // 1.5
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function roundToMultiple(value: number, multiple: number): number {
 if (!Number.isFinite(value)) return value;
 if (multiple === 0) return value;
 return Math.round(value / multiple) * multiple;
}

/**
 * Rounds to nearest power of two
 * @remarks Uses deterministic math (`log` from deterministic-kernels).
 *
 * @param value - Value to round (must be positive)
 * @returns Nearest power of two
 *
 * @example
 * ```typescript
 * roundToPowerOfTwo(5);      // 4
 * roundToPowerOfTwo(7);      // 8
 * roundToPowerOfTwo(16);     // 16
 * roundToPowerOfTwo(17);     // 16
 * roundToPowerOfTwo(24);     // 32
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function roundToPowerOfTwo(value: number): number {
 if (value <= 0) return 0;

 const log2 = log(value) / LN_2;
 const lower = 2 ** Math.floor(log2);
 const upper = 2 ** Math.ceil(log2);

 // Choose the closer power of two
 return value - lower < upper - value ? lower : upper;
}

/**
 * Returns the smallest power of two greater than or equal to value
 * @param value - Input value (positive)
 * @returns Next power of two, or 0 for non-positive input
 *
 * @example
 * ```typescript
 * ceilPowerOfTwo(5);      // 8
 * ceilPowerOfTwo(8);      // 8
 * ceilPowerOfTwo(1);      // 1
 * ceilPowerOfTwo(0);      // 0
 * ```
 *
 * @see {@link floorPowerOfTwo} - Largest power of two ≤ value
 * @see {@link roundToPowerOfTwo} - Nearest power of two
 *
 * @category Safety
 * @since 0.7.0
 */
export function ceilPowerOfTwo(value: number): number {
 if (value <= 0) return 0;
 const floor = floorPowerOfTwo(value);
 return floor >= value ? floor : floor * 2;
}

/**
 * Returns the largest power of two less than or equal to value
 * @param value - Input value (positive)
 * @returns Previous power of two, or 0 for non-positive input
 *
 * @example
 * ```typescript
 * floorPowerOfTwo(5);     // 4
 * floorPowerOfTwo(8);     // 8
 * floorPowerOfTwo(1);     // 1
 * floorPowerOfTwo(0);     // 0
 * ```
 *
 * @see {@link ceilPowerOfTwo} - Smallest power of two ≥ value
 * @see {@link roundToPowerOfTwo} - Nearest power of two
 *
 * @category Safety
 * @since 0.7.0
 */
export function floorPowerOfTwo(value: number): number {
 if (value <= 0) return 0;
 const candidate = 2 ** Math.floor(log(value) / LN_2);
 return candidate > value ? candidate / 2 : candidate;
}

/**
 * Gets fractional part
 *
 * @remarks
 * Returns NaN for every non-finite input: `fract(NaN) → NaN`,
 * `fract(+Infinity) → NaN`, `fract(-Infinity) → NaN`. The result is
 * always non-negative (`fract(−3.7) ≈ 0.3`), matching the fractional-part
 * convention `x - floor(x)`. For
 * the cross-linked ceil/floor/round-to-power-of-two family, see
 * {@link roundToPowerOfTwo}, {@link ceilPowerOfTwo}, {@link floorPowerOfTwo}
 * in this file; for scalar wrapping variants (e.g. `flooredMod`) see
 * `auxiliary/numeric/wrapping.ts`.
 *
 * @param value - Value to get fraction from
 * @returns Fractional part (always positive), or NaN for non-finite input
 *
 * @example
 * ```typescript
 * fract(3.7);        // 0.7000000000000002
 * fract(3.2);        // 0.20000000000000018
 * fract(-3.7);       // 0.2999999999999998
 * fract(-3.2);       // 0.7999999999999998
 * fract(5);          // 0
 * fract(Infinity);   // NaN
 * fract(NaN);        // NaN
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function fract(value: number): number {
 return value - Math.floor(value);
}
