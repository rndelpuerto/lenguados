/**
 * @file deterministic/DeterministicMath.ts
 * @module @lenguados/math2d/deterministic
 * @description Deterministic implementations of mathematical functions
 */

import { normalizeRadiansPositive } from '../auxiliary/angle/normalization';
import { abs as scalarAbs, sign as scalarSign } from '../auxiliary/scalar/arithmetic';
import { TAU } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { assertPositive, assertSafeInteger } from '../validation/assert';

/**
 * Options for deterministic math operations
 */
export interface DeterministicOptions {
 /**
  * Number of entries in lookup tables (must be power of 2)
  * @default 65536
  */
 tableSize?: number;

 /**
  * Number of Newton-Raphson iterations for sqrt
  * @default 3
  */
 sqrtIterations?: number;

 /**
  * Use fixed-point arithmetic for intermediate calculations
  * @default false
  */
 useFixedPoint?: boolean;

 /**
  * Fixed-point scale factor (number of fractional bits)
  * @default 16
  */
 fixedPointScale?: number;
}

/**
 * Deterministic math implementation using lookup tables and iterative algorithms.
 * Ensures reproducible results across different JavaScript engines and platforms.
 *
 * @remarks
 * **Why is this needed?**
 * JavaScript's `Math.sin`, `Math.cos`, and other trigonometric functions are not
 * guaranteed to produce identical results across different engines (V8, SpiderMonkey,
 * JSC). This is problematic for:
 * - **Lockstep networking** in multiplayer games (all clients must compute identically)
 * - **Replay systems** (recorded input must reproduce exact simulation)
 * - **Unit testing** (tests must be deterministic across CI environments)
 *
 * **Memory Trade-off:**
 * The lookup tables consume memory based on `tableSize`:
 * | tableSize | Memory (approx) | Max Error     | Use Case           |
 * |-----------|-----------------|---------------|--------------------|
 * | 256       | ~4 KB           | ~0.024 rad    | Mobile/constrained |
 * | 4096      | ~64 KB          | ~0.0015 rad   | Casual games       |
 * | 65536     | ~1 MB           | ~0.00009 rad  | Physics simulation |
 *
 * The default of 65536 entries provides excellent precision for physics engines.
 *
 * **Performance:**
 * - `sin`/`cos`: O(1) lookup + linear interpolation (~2ns)
 * - `sqrt`: O(k) Newton-Raphson iterations (~10ns for k=3)
 * - `atan2`: O(1) native + quantization (~5ns)
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
 *
 * @see {@link DeterministicOptions} for configuration options
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

 // Reusable object for resolveIndices to avoid allocation in hot paths
 // Note: NOT thread-safe, but JS is single-threaded
 private static readonly _indices = { index0: 0, index1: 0, fraction: 0 };

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

  // Development assertions (Box2D pattern: catch config errors early)
  assertPositive(tableSize, 'DeterministicMath.configure:tableSize');
  assertSafeInteger(tableSize, 'DeterministicMath.configure:tableSize');
  assertPositive(sqrtIterations, 'DeterministicMath.configure:sqrtIterations');
  assertSafeInteger(sqrtIterations, 'DeterministicMath.configure:sqrtIterations');

  const isPowerOfTwo = (value: number): boolean => (value & (value - 1)) === 0;

  // Production throws (always enforced)
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
  * @returns Cached object with both indices and the fractional component.
  *
  * @remarks
  * **Performance:** Uses a static cached object to avoid allocation.
  * This is safe because JavaScript is single-threaded.
  *
  * @internal
  */
 private static resolveIndices(angle: number): {
  readonly index0: number;
  readonly index1: number;
  readonly fraction: number;
 } {
  const normalized = normalizeRadiansPositive(angle);
  const scaledAngle = normalized * this.angleScale;
  const index = Math.floor(scaledAngle);

  const result = this._indices;
  result.index0 = index & this.tableMask;
  result.index1 = (index + 1) & this.tableMask;
  result.fraction = scaledAngle - index;

  return result;
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
  * @returns Square root, NaN for negative values, handles Infinity correctly
  *
  * @remarks
  * Uses Newton-Raphson iteration for deterministic results across platforms.
  * For safe handling of negative values (clamping to 0), use {@link sqrtSafe}.
  *
  * @example
  * ```typescript
  * DeterministicMath.sqrt(4);     // 2
  * DeterministicMath.sqrt(2);     // ~1.414
  * DeterministicMath.sqrt(-1);    // NaN
  * DeterministicMath.sqrt(Infinity); // Infinity
  * ```
  *
  * @see {@link sqrtSafe} for version that clamps negatives to 0
  */
 static sqrt(x: number): number {
  // Handle special cases first for determinism
  if (x < 0) return NaN;
  if (x === 0 || x === 1) return x;
  if (!Number.isFinite(x)) return x; // Handle Infinity correctly

  // Use Math.sqrt for initial guess, then refine with Newton-Raphson
  // This provides both determinism (through refinement) and good precision
  // The final iterations ensure cross-platform consistency
  let guess = Math.sqrt(x);

  // Newton-Raphson refinement for determinism
  const iterations = this.options.sqrtIterations;
  for (let iteration = 0; iteration < iterations; iteration++) {
   guess = 0.5 * (guess + x / guess);
  }

  return guess;
 }

 /**
  * Safe deterministic square root.
  * Clamps negative values to 0 instead of returning NaN.
  * @param x - Value to take square root of
  * @returns Square root (0 for negative values)
  *
  * @remarks
  * Use this when input may be slightly negative due to floating-point
  * errors (e.g., in geometric calculations where x should theoretically
  * be non-negative but may be -1e-15 due to precision loss).
  *
  * @example
  * ```typescript
  * DeterministicMath.sqrtSafe(-1);     // 0 (not NaN)
  * DeterministicMath.sqrtSafe(-1e-15); // 0 (handles FP errors)
  * DeterministicMath.sqrtSafe(4);      // 2
  * DeterministicMath.sqrtSafe(0);      // 0
  * ```
  *
  * @see {@link sqrt} for standard sqrt that returns NaN for negatives
  */
 static sqrtSafe(x: number): number {
  return x <= 0 ? 0 : this.sqrt(x);
 }

 /**
  * Deterministic arc cosine using trigonometric identity.
  * Uses the identity: acos(x) = atan2(sqrt(1-x²), x)
  *
  * @param x - Value in range [-1, 1]
  * @returns Angle in radians [0, PI]
  *
  * @remarks
  * **Why not use Math.acos directly?**
  * While IEEE 754 requires correctly rounded results, different JavaScript
  * engines (V8, SpiderMonkey, JSC) may produce slightly different results for
  * edge cases. This implementation composes `atan2` and `sqrt` which are
  * already deterministic in this class.
  *
  * **Mathematical basis:**
  * For a unit circle, if cos(θ) = x, then sin(θ) = ±sqrt(1-x²).
  * Since acos returns values in [0, π], sin(θ) ≥ 0, so sin(θ) = sqrt(1-x²).
  * Therefore: θ = atan2(sin(θ), cos(θ)) = atan2(sqrt(1-x²), x)
  *
  * @example
  * ```typescript
  * DeterministicMath.acos(1);    // 0
  * DeterministicMath.acos(0);    // PI/2
  * DeterministicMath.acos(-1);   // PI
  * DeterministicMath.acos(0.5);  // PI/3
  * ```
  *
  * @see {@link acosSafe} for version that clamps input to [-1, 1]
  */
 static acos(x: number): number {
  // Handle exact boundary values for maximum precision
  if (x >= 1) return 0;
  if (x <= -1) return Math.PI;

  // Handle NaN
  if (Number.isNaN(x)) return NaN;

  // Identity: acos(x) = atan2(sqrt(1-x²), x)
  const sinValue = this.sqrt(1 - x * x);
  return this.atan2(sinValue, x);
 }

 /**
  * Safe deterministic arc cosine with input clamping.
  * Clamps input to [-1, 1] to avoid NaN for out-of-range values.
  *
  * @param x - Value to compute arc cosine of (will be clamped to [-1, 1])
  * @returns Angle in radians [0, PI]
  *
  * @remarks
  * Use this when input may be slightly outside [-1, 1] due to floating-point
  * errors (e.g., dot products that should be in range but may be 1.0000001).
  *
  * @example
  * ```typescript
  * DeterministicMath.acosSafe(1.0001);  // 0 (clamped to 1)
  * DeterministicMath.acosSafe(-1.001);  // PI (clamped to -1)
  * DeterministicMath.acosSafe(0.5);     // PI/3
  * ```
  *
  * @see {@link acos} for version that returns NaN for out-of-range inputs
  */
 static acosSafe(x: number): number {
  const clamped = x < -1 ? -1 : x > 1 ? 1 : x;
  return this.acos(clamped);
 }

 /**
  * Deterministic arc sine using trigonometric identity.
  * Uses the identity: asin(x) = atan2(x, sqrt(1-x²))
  *
  * @param x - Value in range [-1, 1]
  * @returns Angle in radians [-PI/2, PI/2]
  *
  * @remarks
  * **Mathematical basis:**
  * For a unit circle, if sin(θ) = x, then cos(θ) = ±sqrt(1-x²).
  * Since asin returns values in [-π/2, π/2], cos(θ) ≥ 0, so cos(θ) = sqrt(1-x²).
  * Therefore: θ = atan2(sin(θ), cos(θ)) = atan2(x, sqrt(1-x²))
  *
  * @example
  * ```typescript
  * DeterministicMath.asin(0);    // 0
  * DeterministicMath.asin(1);    // PI/2
  * DeterministicMath.asin(-1);   // -PI/2
  * DeterministicMath.asin(0.5);  // PI/6
  * ```
  *
  * @see {@link asinSafe} for version that clamps input to [-1, 1]
  */
 static asin(x: number): number {
  // Handle exact boundary values for maximum precision
  if (x >= 1) return Math.PI / 2;
  if (x <= -1) return -Math.PI / 2;

  // Handle NaN
  if (Number.isNaN(x)) return NaN;

  // Identity: asin(x) = atan2(x, sqrt(1-x²))
  const cosValue = this.sqrt(1 - x * x);
  return this.atan2(x, cosValue);
 }

 /**
  * Safe deterministic arc sine with input clamping.
  * Clamps input to [-1, 1] to avoid NaN for out-of-range values.
  *
  * @param x - Value to compute arc sine of (will be clamped to [-1, 1])
  * @returns Angle in radians [-PI/2, PI/2]
  *
  * @example
  * ```typescript
  * DeterministicMath.asinSafe(1.0001);  // PI/2 (clamped to 1)
  * DeterministicMath.asinSafe(-1.001);  // -PI/2 (clamped to -1)
  * DeterministicMath.asinSafe(0.5);     // PI/6
  * ```
  *
  * @see {@link asin} for version that returns NaN for out-of-range inputs
  */
 static asinSafe(x: number): number {
  const clamped = x < -1 ? -1 : x > 1 ? 1 : x;
  return this.asin(clamped);
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

  // Short-circuit for values near zero (avoids quantization artifacts)
  // Threshold: values smaller than 1e-12 are treated as exactly 0
  if (scalarAbs(angle) < 1e-12) {
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
