/**
 * @file deterministic/RoundingControl.ts
 * @module @lenguados/math2d/deterministic
 * @description Explicit rounding control for deterministic operations
 */

import { repeat } from '../auxiliary/numeric/wrapping';
import { NumericalValidator } from '../validation/numerical-validator';

import { RoundingMode } from './types';

/**
 * Provides explicit control over rounding operations for deterministic behavior.
 * JavaScript doesn't provide native rounding mode control, so this class
 * implements various rounding strategies explicitly.
 *
 * @example
 * ```typescript
 * // Different rounding modes
 * RoundingControl.round(2.5, RoundingMode.NEAREST_EVEN);  // 2 (banker's)
 * RoundingControl.round(2.5, RoundingMode.NEAREST_AWAY);  // 3
 * RoundingControl.round(2.5, RoundingMode.FLOOR);         // 2
 * RoundingControl.round(2.5, RoundingMode.CEIL);          // 3
 * ```
 */
export class RoundingControl {
 /**
  * Rounds a value according to the specified rounding mode.
  * @param value - Value to round
  * @param mode - Rounding mode to use
  * @returns Rounded value
  */
 static round(value: number, mode: RoundingMode): number {
  switch (mode) {
   case RoundingMode.TRUNCATE:
    return this.truncate(value);

   case RoundingMode.NEAREST_EVEN:
    return this.nearestEven(value);

   case RoundingMode.NEAREST_AWAY:
    return this.nearestAway(value);

   case RoundingMode.CEIL:
    return this.ceil(value);

   case RoundingMode.FLOOR:
    return this.floor(value);

   default:
    throw new Error(`RoundingControl: unknown rounding mode ${mode}`);
  }
 }

 /**
  * Truncates towards zero.
  * @param value - Value to truncate
  * @returns Truncated value
  */
 static truncate(value: number): number {
  const sanitized = this.sanitizeFinite(value, 'RoundingControl.truncate:value');
  return sanitized < 0 ? Math.ceil(sanitized) : Math.floor(sanitized);
 }

 /**
  * Rounds to nearest integer, ties to even (banker's rounding).
  * Reduces bias in repeated rounding operations.
  * @param value - Value to round
  * @returns Rounded value
  */
 static nearestEven(value: number): number {
  const sanitized = this.sanitizeFinite(value, 'RoundingControl.nearestEven:value');
  const integer = Math.floor(sanitized);
  const fraction = sanitized - integer;

  if (fraction < 0.5) return integer;
  if (fraction > 0.5) return integer + 1;

  // Exactly 0.5: round to even
  return integer % 2 === 0 ? integer : integer + 1;
 }

 /**
  * Rounds to nearest integer, ties away from zero.
  * Traditional rounding taught in schools.
  * @param value - Value to round
  * @returns Rounded value
  */
 static nearestAway(value: number): number {
  const sanitized = this.sanitizeFinite(value, 'RoundingControl.nearestAway:value');
  return sanitized < 0 ? Math.floor(sanitized - 0.5) : Math.floor(sanitized + 0.5);
 }

 /**
  * Rounds towards positive infinity (ceiling).
  * @param value - Value to round
  * @returns Rounded value
  */
 static ceil(value: number): number {
  const sanitized = this.sanitizeFinite(value, 'RoundingControl.ceil:value');
  return Math.ceil(sanitized);
 }

 /**
  * Rounds towards negative infinity (floor).
  * @param value - Value to round
  * @returns Rounded value
  */
 static floor(value: number): number {
  const sanitized = this.sanitizeFinite(value, 'RoundingControl.floor:value');
  return Math.floor(sanitized);
 }

 /**
  * Rounds to specified number of decimal places using given mode.
  * @param value - Value to round
  * @param places - Number of decimal places
  * @param mode - Rounding mode
  * @returns Rounded value
  */
 static roundToPlaces(
  value: number,
  places: number,
  mode: RoundingMode = RoundingMode.NEAREST_EVEN,
 ): number {
  const sanitizedValue = this.sanitizeFinite(value, 'RoundingControl.roundToPlaces:value');
  const sanitizedPlaces = this.sanitizeInteger(places, 'RoundingControl.roundToPlaces:places');
  const factor = Math.pow(10, sanitizedPlaces);
  if (!Number.isFinite(factor)) {
   throw new RangeError(
    `RoundingControl.roundToPlaces: places (${sanitizedPlaces}) produce non-finite scale`,
   );
  }
  return this.round(sanitizedValue * factor, mode) / factor;
 }

 /**
  * Rounds to nearest multiple using given mode.
  * @param value - Value to round
  * @param multiple - Multiple to round to
  * @param mode - Rounding mode
  * @returns Rounded value
  */
 static roundToMultiple(
  value: number,
  multiple: number,
  mode: RoundingMode = RoundingMode.NEAREST_EVEN,
 ): number {
  const sanitizedValue = this.sanitizeFinite(value, 'RoundingControl.roundToMultiple:value');
  const sanitizedMultiple = this.sanitizePositiveFinite(
   multiple,
   'RoundingControl.roundToMultiple:multiple',
  );
  if (sanitizedMultiple === 0) {
   return sanitizedValue;
  }
  return this.round(sanitizedValue / sanitizedMultiple, mode) * sanitizedMultiple;
 }

 /**
  * Quantizes value to fixed-point representation.
  * Useful for ensuring consistent precision.
  * @param value - Value to quantize
  * @param fractionalBits - Number of fractional bits
  * @param mode - Rounding mode
  * @returns Quantized value
  *
  * @example
  * ```typescript
  * // 16-bit fractional precision
  * const quantized = RoundingControl.quantizeToFixed(3.14159, 16);
  * ```
  */
 static quantizeToFixed(
  value: number,
  fractionalBits: number,
  mode: RoundingMode = RoundingMode.NEAREST_EVEN,
 ): number {
  const sanitizedValue = this.sanitizeFinite(value, 'RoundingControl.quantizeToFixed:value');
  const bits = this.sanitizeInteger(
   fractionalBits,
   'RoundingControl.quantizeToFixed:fractionalBits',
  );
  if (bits < 0 || bits > 52) {
   throw new RangeError(
    `RoundingControl.quantizeToFixed: fractionalBits (${bits}) must be between 0 and 52`,
   );
  }
  const scale = Math.pow(2, bits);
  return this.round(sanitizedValue * scale, mode) / scale;
 }

 /**
  * Applies stochastic rounding using provided random value.
  * Useful for Monte Carlo simulations where bias matters.
  * @param value - Value to round
  * @param random - Random value in [0, 1)
  * @returns Rounded value
  *
  * @example
  * ```typescript
  * // Round 2.7 stochastically
  * // 70% chance of rounding to 3, 30% chance of rounding to 2
  * const rounded = RoundingControl.stochasticRound(2.7, Math.random());
  * ```
  */
 static stochasticRound(value: number, random: number): number {
  const sanitizedValue = this.sanitizeFinite(value, 'RoundingControl.stochasticRound:value');
  const sanitizedRandom = this.sanitizeRandom(random);
  const floor = Math.floor(sanitizedValue);
  const fraction = sanitizedValue - floor;

  return sanitizedRandom < fraction ? floor + 1 : floor;
 }

 /**
  * Performs range reduction for periodic functions.
  * Reduces value to [0, period) using exact arithmetic.
  * @param value - Value to reduce
  * @param period - Period of the function
  * @returns Reduced value in [0, period)
  */
 static rangeReduce(value: number, period: number): number {
  const sanitizedValue = this.sanitizeFinite(value, 'RoundingControl.rangeReduce:value');
  const sanitizedPeriod = this.sanitizePositiveFinite(period, 'RoundingControl.rangeReduce:period');
  if (sanitizedPeriod === 0) {
   throw new RangeError('RoundingControl.rangeReduce: period must be non-zero');
  }
  return repeat(sanitizedValue, sanitizedPeriod);
 }

 private static sanitizeFinite(value: number, label: string): number {
  return NumericalValidator.validateFinite(value, label);
 }

 private static sanitizeInteger(value: number, label: string): number {
  const sanitized = this.sanitizeFinite(value, label);
  if (!Number.isInteger(sanitized)) {
   throw new RangeError(`${label} must be an integer, got ${sanitized}`);
  }
  return sanitized;
 }

 private static sanitizePositiveFinite(value: number, label: string): number {
  const sanitized = this.sanitizeFinite(value, label);
  if (sanitized < 0) {
   throw new RangeError(`${label} must be non-negative, got ${sanitized}`);
  }
  return sanitized;
 }

 private static sanitizeRandom(value: number): number {
  const sanitized = NumericalValidator.validateFinite(
   value,
   'RoundingControl.stochasticRound:random',
  );
  if (sanitized < 0) {
   return 1 - Number.EPSILON;
  }
  if (sanitized >= 1) {
   return Number.EPSILON;
  }
  return NumericalValidator.validateRange(
   sanitized,
   0,
   1,
   'RoundingControl.stochasticRound:random',
  );
 }
}
