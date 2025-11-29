/**
 * @file auxiliary/numeric/rounding.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Rounding and quantization operations
 */

import { RoundingControl } from '../../deterministic/rounding-control';
import { clamp } from '../scalar/arithmetic';

/**
 * Rounds to nearest integer.
 * Uses banker's rounding (round half to even).
 * @param value - Value to round
 * @returns Rounded integer
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
 * @category Rounding
 * @since 1.0.0
 */
export function roundToInt(value: number): number {
 return RoundingControl.nearestEven(value);
}

/**
 * Rounds to specific decimal places.
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
 * @category Rounding
 * @since 1.0.0
 */
export function roundToPlaces(value: number, places: number): number {
 const factor = Math.pow(10, places);
 return Math.round(value * factor) / factor;
}

/**
 * Rounds to nearest multiple.
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
 * @category Rounding
 * @since 1.0.0
 */
export function roundToMultiple(value: number, multiple: number): number {
 if (multiple === 0) return value;
 return Math.round(value / multiple) * multiple;
}

/**
 * Rounds to nearest power of two.
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
 * @category Rounding
 * @since 1.0.0
 */
export function roundToPowerOfTwo(value: number): number {
 if (value <= 0) return 0;

 const log2 = Math.log2(value);
 const lower = Math.pow(2, Math.floor(log2));
 const upper = Math.pow(2, Math.ceil(log2));

 // Choose the closer power of two
 return value - lower < upper - value ? lower : upper;
}

/**
 * Snaps to grid with offset.
 * @param value - Value to snap
 * @param gridSize - Size of grid cells
 * @param offset - Grid offset (default: 0)
 * @returns Snapped value
 *
 * @example
 * ```typescript
 * snapToGrid(7, 5);          // 5
 * snapToGrid(8, 5);          // 10
 * snapToGrid(7, 5, 2);       // 7 (snaps to 2, 7, 12, ...)
 * snapToGrid(3.7, 0.5);      // 3.5
 * ```
 *
 * @category Rounding
 * @since 1.0.0
 */
export function snapToGrid(value: number, gridSize: number, offset: number = 0): number {
 if (gridSize === 0) return value;
 return Math.round((value - offset) / gridSize) * gridSize + offset;
}

/**
 * Quantizes to specific number of levels.
 * @param value - Value to quantize
 * @param levels - Number of quantization levels
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (default: 1)
 * @returns Quantized value
 *
 * @example
 * ```typescript
 * quantize(0.7, 5, 0, 1);    // 0.75 (one of: 0, 0.25, 0.5, 0.75, 1)
 * quantize(0.3, 3, 0, 1);    // 0.5 (one of: 0, 0.5, 1)
 * quantize(7, 5, 0, 10);     // 7.5 (one of: 0, 2.5, 5, 7.5, 10)
 * ```
 *
 * @category Rounding
 * @since 1.0.0
 */
export function quantize(value: number, levels: number, min: number = 0, max: number = 1): number {
 if (levels <= 1) return min;

 // Normalize to [0, 1]
 const normalized = clamp((value - min) / (max - min), 0, 1);

 // Quantize
 const step = 1 / (levels - 1);
 const quantizedNormalized = Math.round(normalized / step) * step;

 // Map back to original range
 return min + quantizedNormalized * (max - min);
}

/**
 * Truncates to integer (towards zero).
 * @param value - Value to truncate
 * @returns Truncated integer
 *
 * @example
 * ```typescript
 * trunc(3.7);        // 3
 * trunc(3.2);        // 3
 * trunc(-3.7);       // -3
 * trunc(-3.2);       // -3
 * ```
 *
 * @category Rounding
 * @since 1.0.0
 */
export function trunc(value: number): number {
 return RoundingControl.truncate(value);
}

/**
 * Gets fractional part.
 * @param value - Value to get fraction from
 * @returns Fractional part (always positive)
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
 * @category Rounding
 * @since 1.0.0
 */
export function fract(value: number): number {
 return value - Math.floor(value);
}
