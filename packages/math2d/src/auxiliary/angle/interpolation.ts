/**
 * @file auxiliary/angle/interpolation.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angular interpolation operations
 */

import { saturate } from '../scalar/arithmetic';
import { smoothStep } from '../scalar/interpolation';

import { normalizeRadians, normalizeRadiansAround } from './normalization';
import { angleDifference } from './operations';

/**
 * Interpolates between angles using shortest path.
 * @param from - Start angle in radians
 * @param to - End angle in radians
 * @param t - Interpolation factor [0, 1]
 * @returns Interpolated angle
 *
 * @remarks
 * Works for any real t (not only [0, 1]). Output is normalized
 * near `from` to avoid jumps.
 *
 * @example
 * ```typescript
 * lerpAngle(0, Math.PI / 2, 0.5);           // Math.PI / 4
 * lerpAngle(0, 3 * Math.PI / 2, 0.5);       // -Math.PI / 4 (short path)
 * lerpAngle(-Math.PI, Math.PI, 0.5);        // -Math.PI or Math.PI (on boundary)
 * ```
 *
 * @category Interpolation
 * @since 1.0.0
 */
export function lerpAngle(from: number, to: number, t: number): number {
 const diff = angleDifference(from, to);
 return normalizeRadiansAround(from + diff * t, from);
}

/**
 * Spherical linear interpolation for angles.
 * Constant angular velocity.
 * @param from - Start angle in radians
 * @param to - End angle in radians
 * @param t - Interpolation factor [0, 1]
 * @returns Interpolated angle
 *
 * @remarks
 * For angles, slerp and lerp produce the same result since
 * we're interpolating along a 1D circular arc. This function
 * exists for API consistency and clarity of intent.
 *
 * @category Interpolation
 * @since 1.0.0
 */
export function slerpAngle(from: number, to: number, t: number): number {
 // For 2D angles, slerp is equivalent to lerp along shortest arc
 return lerpAngle(from, to, t);
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
 * @since 1.0.0
 */
export function smoothStepAngle(from: number, to: number, t: number): number {
 const smoothT = smoothStep(0, 1, saturate(t));
 return lerpAngle(from, to, smoothT);
}

/**
 * Spring interpolation for angles.
 * @param current - Current angle in radians
 * @param target - Target angle in radians
 * @param velocity - Current angular velocity (rad/s)
 * @param stiffness - Spring stiffness (0-1)
 * @param damping - Damping factor (0-1)
 * @param dt - Time step
 * @returns Object with new angle and angular velocity
 *
 * @example
 * ```typescript
 * let angle = 0, velocity = 0;
 * const result = springAngle(angle, Math.PI, velocity, 0.1, 0.9, 0.016);
 * angle = result.angle;
 * velocity = result.velocity;
 * ```
 *
 * @category Interpolation
 * @since 1.0.0
 */
export function springAngle(
 current: number,
 target: number,
 velocity: number,
 stiffness: number,
 damping: number,
 dt: number,
): { angle: number; velocity: number } {
 // Use shortest path difference
 const diff = angleDifference(current, target);

 // Spring physics
 const force = diff * stiffness;
 const dampingForce = -velocity * damping;
 const acceleration = force + dampingForce;

 const newVelocity = velocity + acceleration * dt;
 const newAngle = current + newVelocity * dt;

 return {
  angle: normalizeRadians(newAngle),
  velocity: newVelocity,
 };
}
