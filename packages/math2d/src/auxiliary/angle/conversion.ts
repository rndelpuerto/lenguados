/**
 * @file auxiliary/angle/conversion.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angular unit conversion operations
 */

import { TAU, DEG_TO_RAD, RAD_TO_DEG, GRAD_TO_RAD, RAD_TO_GRAD } from '../scalar/constants';

/**
 * Converts degrees to radians.
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
 * @since 1.0.0
 */
export function degreesToRadians(degrees: number): number {
 return degrees * DEG_TO_RAD;
}

/**
 * Converts radians to degrees.
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
 * @since 1.0.0
 */
export function radiansToDegrees(radians: number): number {
 return radians * RAD_TO_DEG;
}

/**
 * Converts turns to radians (1 turn = TAU radians = 2π radians).
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
 * @since 1.0.0
 */
export function turnsToRadians(turns: number): number {
 return turns * TAU;
}

/**
 * Converts radians to turns (1 turn = TAU radians = 2π radians).
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
 * @since 1.0.0
 */
export function radiansToTurns(radians: number): number {
 return radians / TAU;
}

/**
 * Converts gradians to radians (400 gradians = 2π radians).
 * Also known as gon or grade.
 * @param gradians - Angle in gradians
 * @returns Angle in radians
 *
 * @remarks
 * Gradians are used in some surveying applications where
 * a right angle is exactly 100 gradians.
 *
 * @example
 * ```typescript
 * gradiansToRadians(200);   // Math.PI
 * gradiansToRadians(100);   // Math.PI / 2
 * gradiansToRadians(400);   // 2 * Math.PI
 * gradiansToRadians(50);    // Math.PI / 4
 * ```
 *
 * @category Conversion
 * @since 1.0.0
 */
export function gradiansToRadians(gradians: number): number {
 return gradians * GRAD_TO_RAD;
}

/**
 * Converts radians to gradians (400 gradians = 2π radians).
 * Also known as gon or grade.
 * @param radians - Angle in radians
 * @returns Angle in gradians
 *
 * @example
 * ```typescript
 * radiansToGradians(Math.PI);       // 200
 * radiansToGradians(Math.PI / 2);   // 100
 * radiansToGradians(2 * Math.PI);   // 400
 * radiansToGradians(Math.PI / 4);   // 50
 * ```
 *
 * @category Conversion
 * @since 1.0.0
 */
export function radiansToGradians(radians: number): number {
 return radians * RAD_TO_GRAD;
}
