/**
 * @file auxiliary/numeric/rounding.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Rounding and quantization operations.
 */

import { log } from '../../deterministic/deterministic-kernels';
import { LN_2 } from '../scalar/constants';

/**
 * Rounds to nearest integer.
 * Uses banker's rounding (round half to even).
 * @param value - Value to round.
 * @returns Rounded integer.
 *
 * @remarks
 * Banker's rounding reduces bias in repeated operations by
 * rounding 0.5 to the nearest even number.
 *
 * @example
 * ```typescript
 * roundToInt(3.2);     // 3
 * roundToInt(3.7);     // 4
 * roundToInt(3.5);     // 4 (rounds to even)
 * roundToInt(4.5);     // 4 (rounds to even)
 * roundToInt(-2.5);    // -2 (rounds to even)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function roundToInt(value: number): number {
 if (!Number.isFinite(value)) {
  throw new RangeError('roundToInt: value must be finite');
 }

 const integer = Math.floor(value);
 const fraction = value - integer;

 if (fraction < 0.5) return integer;
 if (fraction > 0.5) return integer + 1;

 // Exactly 0.5: round to even (banker's rounding)
 return integer % 2 === 0 ? integer : integer + 1;
}

/**
 * Rounds to specific decimal places.
 * @param value - Value to round.
 * @param places - Number of decimal places.
 * @returns Rounded value.
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
 * Rounds to nearest multiple.
 * @param value - Value to round.
 * @param multiple - Multiple to round to.
 * @returns Rounded value.
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
 * Rounds to nearest power of two.
 * @param value - Value to round (must be positive).
 * @returns Nearest power of two.
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
 * @remarks Uses deterministic math (`log` from deterministic-kernels).
 *
 * @category Arithmetic
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
 * Snaps to grid with offset.
 * @param value - Value to snap.
 * @param gridSize - Size of grid cells.
 * @param offset - Grid offset (default: 0).
 * @returns Snapped value.
 *
 * @example
 * ```typescript
 * snapToGrid(7, 5);          // 5
 * snapToGrid(8, 5);          // 10
 * snapToGrid(7, 5, 2);       // 7 (snaps to 2, 7, 12, ...)
 * snapToGrid(3.7, 0.5);      // 3.5
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function snapToGrid(value: number, gridSize: number, offset: number = 0): number {
 if (!Number.isFinite(value)) return value;
 if (gridSize === 0) return value;
 return Math.round((value - offset) / gridSize) * gridSize + offset;
}

/**
 * Gets fractional part.
 * @param value - Value to get fraction from.
 * @returns Fractional part (always positive).
 *
 * @example
 * ```typescript
 * fract(3.7);        // 0.7
 * fract(3.2);        // 0.2
 * fract(-3.7);       // 0.3
 * fract(-3.2);       // 0.8
 * fract(5);          // 0
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function fract(value: number): number {
 return value - Math.floor(value);
}
