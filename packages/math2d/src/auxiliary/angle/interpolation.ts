/**
 * @file auxiliary/angle/interpolation.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angular interpolation operations
 */

import { smoothStep } from '../scalar/interpolation';

import { angleDifference } from './operations';

/**
 * Interpolates between angles using shortest path.
 *
 * @remarks
 * Works for any real t (not only [0, 1]). Extrapolation continues
 * linearly in angle space and may produce values outside [-PI, PI).
 *
 * @param from - Start angle in radians
 * @param to - End angle in radians
 * @param t - Interpolation factor [0, 1]
 * @returns Interpolated angle
 *
 * @example
 * ```typescript
 * lerpAngle(0, Math.PI / 2, 0.5);           // Math.PI / 4
 * lerpAngle(0, 3 * Math.PI / 2, 0.5);       // -Math.PI / 4 (short path)
 * lerpAngle(-Math.PI, Math.PI, 0.5);        // -Math.PI (angles are equivalent, no arc to traverse)
 * ```
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function lerpAngle(from: number, to: number, t: number): number {
 return from + angleDifference(from, to) * t;
}

/**
 * Smooth step interpolation for angles.
 * @param from - Start angle in radians
 * @param to - End angle in radians
 * @param t - Interpolation factor [0, 1]
 * @returns Interpolated angle with smooth acceleration/deceleration
 *
 * @example
 * ```typescript
 * smoothStepAngle(0, Math.PI / 2, 0.5);      // Smooth transition
 * smoothStepAngle(0, Math.PI, 0.5);          // Smooth transition
 * ```
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function smoothStepAngle(from: number, to: number, t: number): number {
 const smoothT = smoothStep(0, 1, t);
 return lerpAngle(from, to, smoothT);
}
