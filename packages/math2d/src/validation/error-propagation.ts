/**
 * @file src/validation/ErrorPropagation.ts
 * @module @lenguados/math2d/validation
 * @description Error propagation analysis for numerical operations.
 */

import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { abs } from '../auxiliary/scalar/arithmetic';

import { NumericalValidator } from './numerical-validator';

/**
 * Represents numerical error bounds.
 */
export interface ErrorBounds {
 /**
  * Absolute error bound.
  */
 absolute: number;

 /**
  * Relative error bound.
  */
 relative: number;
}

/**
 * Error propagation utilities for tracking numerical precision.
 */
export class ErrorPropagation {
 /**
  * Machine epsilon for floating point operations.
  */
 static readonly MACHINE_EPSILON = Number.EPSILON;

 /**
  * Calculate error bounds for addition.
  * @param aError - Error bounds for first operand
  * @param bError - Error bounds for second operand
  * @returns Combined error bounds
  */
 static add(aError: ErrorBounds, bError: ErrorBounds): ErrorBounds {
  const aSafe = this.sanitizeErrorBounds(aError, 'ErrorPropagation.add:aError');
  const bSafe = this.sanitizeErrorBounds(bError, 'ErrorPropagation.add:bError');

  return {
   absolute: aSafe.absolute + bSafe.absolute,
   relative: Math.max(aSafe.relative, bSafe.relative),
  };
 }

 /**
  * Calculate error bounds for subtraction.
  * @param aError - Error bounds for first operand
  * @param bError - Error bounds for second operand
  * @param a - First operand value
  * @param b - Second operand value
  * @returns Combined error bounds
  */
 static subtract(aError: ErrorBounds, bError: ErrorBounds, a: number, b: number): ErrorBounds {
  const aSafe = this.sanitizeErrorBounds(aError, 'ErrorPropagation.subtract:aError');
  const bSafe = this.sanitizeErrorBounds(bError, 'ErrorPropagation.subtract:bError');
  const aValue = this.sanitizeValue(a, 'ErrorPropagation.subtract:a');
  const bValue = this.sanitizeValue(b, 'ErrorPropagation.subtract:b');
  const result = aValue - bValue;
  const absoluteError = aSafe.absolute + bSafe.absolute;

  // Catastrophic cancellation check
  if (this.isCancellation(result, aValue, bValue)) {
   const relativeError = absoluteError / this.safeMagnitude(result);
   return {
    absolute: absoluteError,
    relative: Math.max(relativeError, aSafe.relative, bSafe.relative),
   };
  }

  return {
   absolute: absoluteError,
   relative: Math.max(aSafe.relative, bSafe.relative),
  };
 }

 /**
  * Calculate error bounds for multiplication.
  * @param aError - Error bounds for first operand
  * @param bError - Error bounds for second operand
  * @param a - First operand value
  * @param b - Second operand value
  * @returns Combined error bounds
  */
 static multiply(aError: ErrorBounds, bError: ErrorBounds, a: number, b: number): ErrorBounds {
  const aSafe = this.sanitizeErrorBounds(aError, 'ErrorPropagation.multiply:aError');
  const bSafe = this.sanitizeErrorBounds(bError, 'ErrorPropagation.multiply:bError');
  const aValue = this.sanitizeValue(a, 'ErrorPropagation.multiply:a');
  const bValue = this.sanitizeValue(b, 'ErrorPropagation.multiply:b');

  // Error propagation: δ(a*b) ≈ |b|*δa + |a|*δb
  const absoluteError = abs(bValue) * aSafe.absolute + abs(aValue) * bSafe.absolute;
  const relativeError = aSafe.relative + bSafe.relative;

  return {
   absolute: absoluteError,
   relative: relativeError,
  };
 }

 /**
  * Calculate error bounds for division.
  * @param aError - Error bounds for numerator
  * @param bError - Error bounds for denominator
  * @param a - Numerator value
  * @param b - Denominator value
  * @returns Combined error bounds
  */
 static divide(aError: ErrorBounds, bError: ErrorBounds, a: number, b: number): ErrorBounds {
  const aSafe = this.sanitizeErrorBounds(aError, 'ErrorPropagation.divide:aError');
  const bSafe = this.sanitizeErrorBounds(bError, 'ErrorPropagation.divide:bError');
  const aValue = this.sanitizeValue(a, 'ErrorPropagation.divide:a');
  const bValue = this.sanitizeValue(b, 'ErrorPropagation.divide:b');
  const magnitudeB = this.safeMagnitude(bValue);
  const magnitudeBSquared = magnitudeB * magnitudeB;

  // Error propagation: δ(a/b) ≈ (δa/|b|) + (|a|*δb/b²)
  const absoluteError =
   safeDivide(aSafe.absolute, magnitudeB) +
   safeDivide(abs(aValue) * bSafe.absolute, magnitudeBSquared);
  const relativeError = aSafe.relative + bSafe.relative;

  return {
   absolute: absoluteError,
   relative: relativeError,
  };
 }

 /**
  * Calculate error bounds for square root.
  * @param error - Error bounds for operand
  * @param value - Operand value
  * @returns Error bounds for sqrt
  */
 static sqrt(error: ErrorBounds, value: number): ErrorBounds {
  const safeError = this.sanitizeErrorBounds(error, 'ErrorPropagation.sqrt:error');
  const sanitizedValue = this.sanitizeValue(value, 'ErrorPropagation.sqrt:value');

  if (sanitizedValue <= 0) {
   return { absolute: 0, relative: 0 };
  }

  const sqrtValue = safeSqrt(sanitizedValue);
  // Error propagation: δ(√x) ≈ δx/(2√x)
  const absoluteError = safeError.absolute / (2 * this.safeMagnitude(sqrtValue));
  const relativeError = safeError.relative / 2;

  return {
   absolute: absoluteError,
   relative: relativeError,
  };
 }

 /**
  * Calculate error bounds for sine/cosine.
  * @param error - Error bounds for angle
  * @returns Error bounds for trig function
  */
 static sincos(error: ErrorBounds): ErrorBounds {
  const safeError = this.sanitizeErrorBounds(error, 'ErrorPropagation.sincos:error');
  // Worst case: derivative of sin/cos is 1
  return {
   absolute: safeError.absolute,
   relative: safeError.absolute, // Since |sin|, |cos| ≤ 1
  };
 }

 /**
  * Create error bounds from ulps (units in the last place).
  * @param value - Value to calculate error for
  * @param ulps - Number of ulps of error
  * @returns Error bounds
  */
 static fromUlps(value: number, ulps: number): ErrorBounds {
  const sanitizedValue = abs(this.sanitizeValue(value, 'ErrorPropagation.fromUlps:value'));
  const sanitizedUlps = abs(this.sanitizeValue(ulps, 'ErrorPropagation.fromUlps:ulps'));
  const absoluteError = sanitizedValue * this.MACHINE_EPSILON * sanitizedUlps;
  const relativeError = this.MACHINE_EPSILON * sanitizedUlps;

  return {
   absolute: absoluteError,
   relative: relativeError,
  };
 }

 /**
  * Combine multiple error bounds (for sum operations).
  * @param errors - Array of error bounds
  * @returns Combined error bounds
  */
 static combine(...errors: ErrorBounds[]): ErrorBounds {
  let absoluteSum = 0;
  let maxRelative = 0;

  for (const error of errors) {
   const sanitized = this.sanitizeErrorBounds(error, 'ErrorPropagation.combine:error');
   absoluteSum += sanitized.absolute;
   maxRelative = Math.max(maxRelative, sanitized.relative);
  }

  return {
   absolute: absoluteSum,
   relative: maxRelative,
  };
 }

 /**
  * Check if error is within acceptable bounds.
  * @param error - Error bounds to check
  * @param maxAbsolute - Maximum allowed absolute error
  * @param maxRelative - Maximum allowed relative error
  * @returns True if error is acceptable
  */
 static isAcceptable(error: ErrorBounds, maxAbsolute = 1e-10, maxRelative = 1e-10): boolean {
  const sanitizedError = this.sanitizeErrorBounds(error, 'ErrorPropagation.isAcceptable:error');
  const safeMaxAbsolute = abs(
   this.sanitizeValue(maxAbsolute, 'ErrorPropagation.isAcceptable:maxAbsolute'),
  );
  const safeMaxRelative = abs(
   this.sanitizeValue(maxRelative, 'ErrorPropagation.isAcceptable:maxRelative'),
  );
  return sanitizedError.absolute <= safeMaxAbsolute && sanitizedError.relative <= safeMaxRelative;
 }

 /**
  * Format error bounds for logging.
  * @param error - Error bounds
  * @returns Human-readable string
  */
 static format(error: ErrorBounds): string {
  const sanitized = this.sanitizeErrorBounds(error, 'ErrorPropagation.format:error');
  return `±${sanitized.absolute.toExponential(2)} (${(sanitized.relative * 100).toFixed(4)}%)`;
 }

 private static sanitizeErrorBounds(error: ErrorBounds, label: string): ErrorBounds {
  const absolute = Math.max(
   0,
   NumericalValidator.validateFinite(error.absolute, `${label}.absolute`),
  );
  const relative = Math.max(
   0,
   NumericalValidator.validateFinite(error.relative, `${label}.relative`),
  );
  return { absolute, relative };
 }

 private static sanitizeValue(value: number, label: string): number {
  return NumericalValidator.validateFinite(value, label);
 }

 private static safeMagnitude(value: number): number {
  const magnitude = abs(value);
  return magnitude > 0 ? magnitude : Number.EPSILON;
 }

 private static isCancellation(result: number, a: number, b: number): boolean {
  const magnitudeResult = abs(result);
  const thresholdA = abs(a) * 0.1;
  const thresholdB = abs(b) * 0.1;
  return magnitudeResult < thresholdA && magnitudeResult < thresholdB;
 }
}
