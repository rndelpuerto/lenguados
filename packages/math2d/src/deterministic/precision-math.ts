/**
 * @file deterministic/PrecisionMath.ts
 * @module @lenguados/math2d/deterministic
 * @description High-precision arithmetic using compensation techniques
 *
 * @remarks
 * This module intentionally uses inline validation to avoid circular
 * dependencies with the validation module. The validation layer
 * depends on auxiliary/numeric, which in turn uses PrecisionMath.
 */

/**
 * Result of a compensated arithmetic operation
 */
export interface CompensatedResult {
 /** The primary result */
 value: number;
 /** The error/compensation term */
 error: number;
}

/**
 * Two-sum result for exact floating-point addition
 */
export interface TwoSumResult {
 /** The rounded sum */
 sum: number;
 /** The exact error */
 error: number;
}

/**
 * Two-product result for exact floating-point multiplication
 */
export interface TwoProductResult {
 /** The rounded product */
 product: number;
 /** The exact error */
 error: number;
}

/**
 * High-precision arithmetic operations using error compensation.
 * These algorithms track and compensate for rounding errors in floating-point arithmetic.
 *
 * @example
 * ```typescript
 * // Kahan summation for accurate sums
 * const sum = PrecisionMath.kahanSum([0.1, 0.2, 0.3, 0.4]);
 *
 * // Two-sum for exact error tracking
 * const { sum, error } = PrecisionMath.twoSum(1e20, 1);
 * console.log(sum);    // 1e20 (lost precision)
 * console.log(error);  // 1 (exact error)
 * ```
 */
export class PrecisionMath {
 /**
  * Inline validation to avoid circular dependency with validation module.
  * Returns 0 for non-finite values, otherwise returns the value unchanged.
  * @param value - Value to sanitize
  * @returns The value if finite, 0 otherwise
  * @internal
  */
 private static sanitize(value: number): number {
  return Number.isFinite(value) ? value : 0;
 }

 /**
  * Kahan summation algorithm for accurate sum of many numbers.
  * Compensates for rounding errors in floating-point addition.
  * @param values - Array of numbers to sum
  * @returns Compensated sum
  *
  * @example
  * ```typescript
  * // Standard sum loses precision
  * const standard = [0.1, 0.2, 0.3].reduce((a, b) => a + b, 0);
  * // Kahan sum maintains precision
  * const kahan = PrecisionMath.kahanSum([0.1, 0.2, 0.3]);
  * ```
  */
 static kahanSum(values: readonly number[]): number {
  let sum = 0;
  let compensation = 0;

  for (const value of values) {
   const sanitized = this.sanitize(value);
   const y = sanitized - compensation;
   const t = sum + y;
   compensation = t - sum - y;
   sum = t;
  }

  return sum;
 }

 /**
  * Neumaier summation - improved Kahan algorithm.
  * Better handles cases where values vary greatly in magnitude.
  * @param values - Array of numbers to sum
  * @returns Compensated sum
  */
 static neumaierSum(values: readonly number[]): number {
  let sum = 0;
  let compensation = 0;

  for (const value of values) {
   const sanitized = this.sanitize(value);
   const t = sum + sanitized;

   if (Math.abs(sum) >= Math.abs(sanitized)) {
    // sum is bigger, low-order digits of value are lost
    compensation += sum - t + sanitized;
   } else {
    // value is bigger, low-order digits of sum are lost
    compensation += sanitized - t + sum;
   }

   sum = t;
  }

  return sum + compensation;
 }

 /**
  * Two-sum algorithm: exact floating-point addition.
  * Returns both the rounded sum and the exact error.
  * @param a - First operand
  * @param b - Second operand
  * @returns Sum and error such that a + b = sum + error exactly
  *
  * @remarks
  * Based on Knuth's algorithm. The error term captures the
  * exact rounding error, allowing for extended precision.
  */
 static twoSum(a: number, b: number): TwoSumResult {
  const sanitizedA = this.sanitize(a);
  const sanitizedB = this.sanitize(b);
  const sum = sanitizedA + sanitizedB;
  const bVirtual = sum - sanitizedA;
  const aVirtual = sum - bVirtual;
  const bRoundoff = sanitizedB - bVirtual;
  const aRoundoff = sanitizedA - aVirtual;
  const error = aRoundoff + bRoundoff;

  return { sum, error };
 }

 /**
  * Fast two-sum when |a| >= |b| is known.
  * More efficient than general two-sum.
  * @param a - Larger operand (by magnitude)
  * @param b - Smaller operand (by magnitude)
  * @returns Sum and error
  */
 static fastTwoSum(a: number, b: number): TwoSumResult {
  const sanitizedA = this.sanitize(a);
  const sanitizedB = this.sanitize(b);
  const sum = a + b;
  const error = sanitizedB - (sum - sanitizedA);
  return { sum, error };
 }

 /**
  * Two-product algorithm: exact floating-point multiplication.
  * @param a - First operand
  * @param b - Second operand
  * @returns Product and error such that a * b = product + error exactly
  *
  * @remarks
  * Uses FMA (Fused Multiply-Add) if available, otherwise falls back
  * to Veltkamp splitting for exact multiplication.
  */
 static twoProduct(a: number, b: number): TwoProductResult {
  const sanitizedA = this.sanitize(a);
  const sanitizedB = this.sanitize(b);
  const product = sanitizedA * sanitizedB;

  // Check if FMA is available (not standard in JavaScript)
  // For now, use Veltkamp splitting algorithm
  const split = 134217729; // 2^27 + 1

  // Split a
  const c = split * sanitizedA;
  const aHigh = c - (c - sanitizedA);
  const aLow = sanitizedA - aHigh;

  // Split b
  const d = split * sanitizedB;
  const bHigh = d - (d - sanitizedB);
  const bLow = sanitizedB - bHigh;

  // Compute error
  const error1 = product - aHigh * bHigh;
  const error2 = error1 - aLow * bHigh;
  const error3 = error2 - aHigh * bLow;
  const error = aLow * bLow - error3;

  return { product, error };
 }

 /**
  * Compensated multiplication using error tracking.
  * @param values - Array of numbers to multiply
  * @returns Compensated product
  */
 static compensatedProduct(values: readonly number[]): CompensatedResult {
  if (values.length === 0) {
   return { value: 1, error: 0 };
  }

  let product = this.sanitize(values[0]!);
  let errorSum = 0;

  for (let index = 1; index < values.length; index++) {
   const sanitized = this.sanitize(values[index]!);
   const { product: p, error } = this.twoProduct(product, sanitized);
   product = p;
   errorSum += error;
  }

  return { value: product, error: errorSum };
 }

 /**
  * Compensated dot product of two vectors.
  * @param a - First vector
  * @param b - Second vector
  * @returns Compensated dot product
  *
  * @throws {Error} If vectors have different lengths
  */
 static compensatedDot(a: readonly number[], b: readonly number[]): CompensatedResult {
  if (a.length !== b.length) {
   throw new Error('PrecisionMath.compensatedDot: vectors must have same length');
  }

  let sum = 0;
  let compensation = 0;

  for (let index = 0; index < a.length; index++) {
   const sanitizedA = this.sanitize(a[index]!);
   const sanitizedB = this.sanitize(b[index]!);
   const { product, error: productError } = this.twoProduct(sanitizedA, sanitizedB);
   const { sum: provisionalSum, error: sumError } = this.twoSum(sum, product);
   sum = provisionalSum;
   compensation += sumError + productError;
  }

  return { value: sum, error: compensation };
 }

 /**
  * Extended precision addition using compensation.
  * @param values - Values to sum with their errors
  * @returns Sum with combined error
  */
 static extendedSum(values: readonly CompensatedResult[]): CompensatedResult {
  // Sum primary values
  const primarySum = this.kahanSum(values.map((v) => this.sanitize(v.value)));

  // Sum error terms
  const errorSum = this.kahanSum(values.map((v) => this.sanitize(v.error)));

  // Combine with two-sum for exact result
  const { sum, error } = this.twoSum(primarySum, errorSum);

  return { value: sum, error };
 }
}
