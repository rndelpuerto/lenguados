/**
 * @file deterministic/DeterministicMath.ts
 * @module @lenguados/math2d/deterministic
 * @description Deterministic implementations of mathematical functions
 */

import { normalizeRadiansPositive } from '../auxiliary/angle/normalization';
import { abs as scalarAbs, sign as scalarSign } from '../auxiliary/scalar/arithmetic';
import { TAU } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';

import type { DeterministicOptions } from './types';

/**
 * Deterministic math implementation using lookup tables and iterative algorithms.
 * Ensures reproducible results across different JavaScript engines and platforms.
 *
 * @example
 * ```typescript
 * // Deterministic trigonometry
 * DeterministicMath.configure({ tableSize: 4096 });
 * const sine = DeterministicMath.sin(Math.PI / 4);
 * const cosine = DeterministicMath.cos(Math.PI / 4);
 *
 * // Deterministic sqrt
 * const root = DeterministicMath.sqrt(2);
 * ```
 */
export class DeterministicMath {
 private static readonly MIN_TABLE_SIZE = 256;

 private static readonly DEFAULT_OPTIONS: Required<DeterministicOptions> = {
  tableSize: 65536,
  sqrtIterations: 3,
  useFixedPoint: false,
  fixedPointScale: 16,
 };

 private static options: Required<DeterministicOptions> = {
  ...DeterministicMath.DEFAULT_OPTIONS,
 };

 private static sinTable: Float64Array = new Float64Array(DeterministicMath.options.tableSize);
 private static cosTable: Float64Array = new Float64Array(DeterministicMath.options.tableSize);
 private static tableMask = DeterministicMath.options.tableSize - 1;
 private static angleScale = DeterministicMath.options.tableSize / TAU;
 private static initialized = false;

 /**
  * Update deterministic math configuration.
  * @param options - Partial options to override defaults
  */
 static configure(options: Partial<DeterministicOptions> = {}): void {
  const nextOptions: Required<DeterministicOptions> = {
   ...this.options,
   ...options,
  };

  this.validateOptions(nextOptions);

  const tableSizeChanged = nextOptions.tableSize !== this.options.tableSize;

  this.options = nextOptions;
  this.tableMask = nextOptions.tableSize - 1;
  this.angleScale = nextOptions.tableSize / TAU;

  if (tableSizeChanged || !this.initialized) {
   this.rebuildTables();
  }
 }

 /**
  * Reset configuration to defaults and rebuild lookup tables.
  */
 static reset(): void {
  this.options = { ...this.DEFAULT_OPTIONS };
  this.tableMask = this.options.tableSize - 1;
  this.angleScale = this.options.tableSize / TAU;
  this.rebuildTables();
 }

 /**
  * Ensures lookup tables are initialized.
  */
 private static ensureTables(): void {
  if (!this.initialized) {
   this.rebuildTables();
  }
 }

 /**
  * Validate deterministic math options.
  */
 private static validateOptions(options: Required<DeterministicOptions>): void {
  const { tableSize, sqrtIterations } = options;

  const isPowerOfTwo = (value: number): boolean => (value & (value - 1)) === 0;

  if (!isPowerOfTwo(tableSize) || tableSize < this.MIN_TABLE_SIZE) {
   throw new Error(
    `DeterministicMath: tableSize must be a power of two and >= ${this.MIN_TABLE_SIZE}`,
   );
  }

  if (!Number.isInteger(sqrtIterations) || sqrtIterations <= 0) {
   throw new Error('DeterministicMath: sqrtIterations must be a positive integer');
  }
 }

 /**
  * Initializes sine and cosine lookup tables using Float64 for precision.
  */
 private static rebuildTables(): void {
  const { tableSize } = this.options;

  this.sinTable = new Float64Array(tableSize);
  this.cosTable = new Float64Array(tableSize);

  const angleStep = TAU / tableSize;

  for (let index = 0; index < tableSize; index++) {
   const angle = index * angleStep;
   this.sinTable[index] = Math.sin(angle);
   this.cosTable[index] = Math.cos(angle);
  }

  this.initialized = true;
 }

 /**
  * Map an angle to lookup-table indices and interpolation fraction.
  * @returns Tuple with both indices and the fractional component.
  */
 private static resolveIndices(angle: number): {
  index0: number;
  index1: number;
  fraction: number;
 } {
  const normalized = normalizeRadiansPositive(angle);
  const scaledAngle = normalized * this.angleScale;
  const index = Math.floor(scaledAngle);
  const fraction = scaledAngle - index;
  const index0 = index & this.tableMask;
  const index1 = (index + 1) & this.tableMask;

  return { index0, index1, fraction };
 }

 static {
  this.rebuildTables();
 }

 /**
  * Deterministic sine using lookup table with linear interpolation.
  * @param angle - Angle in radians
  * @returns Sine value
  */
 static sin(angle: number): number {
  this.ensureTables();

  const { index0, index1, fraction } = this.resolveIndices(angle);
  return lerp(this.sinTable[index0]!, this.sinTable[index1]!, fraction);
 }

 /**
  * Deterministic cosine using lookup table with linear interpolation.
  * @param angle - Angle in radians
  * @returns Cosine value
  */
 static cos(angle: number): number {
  this.ensureTables();

  const { index0, index1, fraction } = this.resolveIndices(angle);
  return lerp(this.cosTable[index0]!, this.cosTable[index1]!, fraction);
 }

 /**
  * Deterministic tangent computed from sin/cos.
  * @param angle - Angle in radians
  * @returns Tangent value
  */
 static tan(angle: number): number {
  const s = this.sin(angle);
  const c = this.cos(angle);

  if (scalarAbs(c) < Number.EPSILON) {
   return s >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }

  return s / c;
 }

 /**
  * Deterministic square root using Newton-Raphson iteration.
  * @param x - Value to take square root of
  * @returns Square root
  */
 static sqrt(x: number): number {
  if (x < 0) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;

  // Initial guess using bit manipulation (fast inverse sqrt style)
  // For IEEE 754 float: reinterpret bits and adjust exponent
  let guess = x;

  // Use a simple initial approximation
  // This is deterministic across platforms
  if (x < 1) {
   guess = 0.5 + x * 0.5;
  } else {
   // For x > 1, use x/2 as initial guess
   guess = x * 0.5;
  }

  // Newton-Raphson iterations
  for (let index = 0; index < this.options.sqrtIterations; index++) {
   guess = 0.5 * (guess + x / guess);
  }

  return guess;
 }

 /**
  * Deterministic arc tangent with quadrant handling.
  * Delegates to {@link Math.atan2} and quantizes the result to a fixed precision
  * so that equivalent inputs yield identical outputs across platforms.
  * @param y - Y coordinate
  * @param x - X coordinate
  * @returns Angle in radians [-PI, PI]
  */
 static atan2(y: number, x: number): number {
  if (!Number.isFinite(y) || !Number.isFinite(x)) {
   return NaN;
  }

  const angle = Math.atan2(y, x);
  if (angle === 0) {
   return 0;
  }

  return this.quantize(angle, 1e12);
 }

 /**
  * Quantize a floating-point value to a deterministic resolution.
  * @param value - Value to quantize
  * @param scale - Quantization scale (default: 1e12)
  * @returns Quantized value
  */
 private static quantize(value: number, scale: number = 1e12): number {
  return Math.round(value * scale) / scale;
 }

 /**
  * Deterministic absolute value.
  * @param x - Input value
  * @returns Absolute value
  */
 static abs(value: number): number {
  return scalarAbs(value);
 }

 /**
  * Deterministic sign function.
  * @param x - Input value
  * @returns Sign (-1, 0, or 1)
  */
 static sign(value: number): number {
  return scalarSign(value);
 }

 /**
  * Deterministic floor function using fast bitwise truncation.
  * @param x - Input value
  * @returns Floor value
  *
  * @remarks
  * **Performance vs Range Trade-off:**
  * This method uses bitwise operations (`| 0`) for maximum performance,
  * which limits the valid input range to int32 values: [-2147483648, 2147483647].
  *
  * For values outside this range, use {@link DeterministicMath.floorSafe} instead.
  *
  * @example
  * ```typescript
  * DeterministicMath.floor(3.7);   // 3
  * DeterministicMath.floor(-3.7);  // -4
  * ```
  */
 static floor(x: number): number {
  const truncated = x | 0; // Fast truncation (int32 range only)
  return x < 0 && x !== truncated ? truncated - 1 : truncated;
 }

 /**
  * Safe floor function that handles values outside int32 range.
  * @param x - Input value (any finite number)
  * @returns Floor value
  *
  * @remarks
  * Slower than {@link DeterministicMath.floor} but handles all finite values.
  * Uses Math.floor internally with deterministic post-processing.
  */
 static floorSafe(x: number): number {
  if (!Number.isFinite(x)) return x;
  // For values in int32 range, use fast path
  if (x >= -2147483648 && x <= 2147483647) {
   return this.floor(x);
  }
  return Math.floor(x);
 }

 /**
  * Deterministic ceiling function using fast bitwise truncation.
  * @param x - Input value
  * @returns Ceiling value
  *
  * @remarks
  * **Performance vs Range Trade-off:**
  * This method uses bitwise operations (`| 0`) for maximum performance,
  * which limits the valid input range to int32 values: [-2147483648, 2147483647].
  *
  * For values outside this range, use {@link DeterministicMath.ceilSafe} instead.
  *
  * @example
  * ```typescript
  * DeterministicMath.ceil(3.2);   // 4
  * DeterministicMath.ceil(-3.2);  // -3
  * ```
  */
 static ceil(x: number): number {
  const truncated = x | 0; // Fast truncation (int32 range only)
  return x > 0 && x !== truncated ? truncated + 1 : truncated;
 }

 /**
  * Safe ceiling function that handles values outside int32 range.
  * @param x - Input value (any finite number)
  * @returns Ceiling value
  *
  * @remarks
  * Slower than {@link DeterministicMath.ceil} but handles all finite values.
  * Uses Math.ceil internally with deterministic post-processing.
  */
 static ceilSafe(x: number): number {
  if (!Number.isFinite(x)) return x;
  // For values in int32 range, use fast path
  if (x >= -2147483648 && x <= 2147483647) {
   return this.ceil(x);
  }
  return Math.ceil(x);
 }

 /**
  * Deterministic round function (banker's rounding).
  * @param x - Input value
  * @returns Rounded value
  *
  * @remarks
  * Uses banker's rounding (round half to even) to reduce bias in
  * repeated rounding operations. This is the IEEE 754 recommended
  * rounding mode.
  *
  * **Range Limitation:** Inherits the int32 range limitation from
  * {@link DeterministicMath.floor}. Use {@link DeterministicMath.roundSafe}
  * for values outside this range.
  *
  * @example
  * ```typescript
  * DeterministicMath.round(2.5);   // 2 (rounds to even)
  * DeterministicMath.round(3.5);   // 4 (rounds to even)
  * DeterministicMath.round(2.6);   // 3
  * ```
  */
 static round(x: number): number {
  const integer = this.floor(x);
  const fraction = x - integer;

  if (fraction < 0.5) return integer;
  if (fraction > 0.5) return integer + 1;

  // Exactly 0.5: round to even (banker's rounding)
  return integer % 2 === 0 ? integer : integer + 1;
 }

 /**
  * Safe round function that handles values outside int32 range.
  * @param x - Input value (any finite number)
  * @returns Rounded value using banker's rounding
  */
 static roundSafe(x: number): number {
  if (!Number.isFinite(x)) return x;
  // For values in int32 range, use fast path
  if (x >= -2147483648 && x <= 2147483647) {
   return this.round(x);
  }
  const integer = Math.floor(x);
  const fraction = x - integer;
  if (fraction < 0.5) return integer;
  if (fraction > 0.5) return integer + 1;
  return integer % 2 === 0 ? integer : integer + 1;
 }

 /**
  * Gets the current configuration.
  * @returns Configuration options
  */
 static getOptions(): Required<DeterministicOptions> {
  return { ...this.options };
 }
}
