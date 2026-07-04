/**
 * @file auxiliary/angle/conversion.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angular unit conversion operations
 */

import { TAU, DEG_TO_RAD, RAD_TO_DEG, RAD_TO_TURN } from '../scalar/constants';

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 *
 * @example
 * ```typescript
 * degreesToRadians(180);   // Math.PI
 * degreesToRadians(90);    // Math.PI / 2
 * degreesToRadians(360);   // 2 * Math.PI
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function degreesToRadians(degrees: number): number {
 return degrees * DEG_TO_RAD;
}

/**
 * Converts radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 *
 * @example
 * ```typescript
 * radiansToDegrees(Math.PI);       // 180
 * radiansToDegrees(Math.PI / 2);   // 90
 * radiansToDegrees(2 * Math.PI);   // 360
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function radiansToDegrees(radians: number): number {
 return radians * RAD_TO_DEG;
}

/**
 * Converts turns to radians (1 turn = TAU radians = 2π radians)
 * @param turns - Number of turns
 * @returns Angle in radians
 *
 * @example
 * ```typescript
 * turnsToRadians(1);      // 2 * Math.PI
 * turnsToRadians(0.5);    // Math.PI
 * turnsToRadians(0.25);   // Math.PI / 2
 * turnsToRadians(2);      // 4 * Math.PI
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function turnsToRadians(turns: number): number {
 return turns * TAU;
}

/**
 * Converts radians to turns (1 turn = TAU radians = 2π radians)
 * @param radians - Angle in radians
 * @returns Number of turns
 *
 * @example
 * ```typescript
 * radiansToTurns(2 * Math.PI);   // 1
 * radiansToTurns(Math.PI);       // 0.5
 * radiansToTurns(Math.PI / 2);   // 0.25
 * radiansToTurns(4 * Math.PI);   // 2
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function radiansToTurns(radians: number): number {
 return radians * RAD_TO_TURN;
}
