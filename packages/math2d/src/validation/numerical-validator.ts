/**
 * @file src/validation/NumericalValidator.ts
 * @module @lenguados/math2d/validation
 * @description Numerical validation utilities for @lenguados/math2d.
 */

import {
 isFinite as isFiniteNumber,
 isNaN as isNaNNumber,
 sanitizeNumber,
} from '../auxiliary/numeric';
import { nearEquals } from '../auxiliary/scalar';

import { ValidationMode, getValidationConfig } from './validation-mode';

/**
 * Validation error thrown when strict mode is enabled.
 */
export class NumericalValidationError extends Error {
 constructor(
  public readonly value: unknown,
  public readonly constraint: string,
  message?: string,
 ) {
  super(message || `Numerical validation failed: ${constraint}`);
  this.name = 'NumericalValidationError';
 }
}

/**
 * Numerical validator with configurable behavior.
 */
export class NumericalValidator {
 /**
  * Validates that a value is finite.
  * @param value - Value to validate
  * @param name - Parameter name for error messages
  * @returns Validated value or safe fallback
  * @throws {NumericalValidationError} In strict mode if value is not finite
  */
 static validateFinite(value: number, name = 'value'): number {
  const config = getValidationConfig();

  if (!config.validateFinite || config.mode === ValidationMode.NONE) {
   return value;
  }

  if (!isFiniteNumber(value)) {
   const message = `${name} must be finite, got ${value}`;

   switch (config.mode) {
    case ValidationMode.STRICT:
     throw new NumericalValidationError(value, 'finite', message);
    case ValidationMode.WARN:
     config.logger(message);
     return value;
    case ValidationMode.SAFE:
    default:
     return 0; // Safe fallback
   }
  }

  return value;
 }

 /**
  * Validates that a value is not NaN.
  * @param value - Value to validate
  * @param name - Parameter name for error messages
  * @returns Validated value or safe fallback
  * @throws {NumericalValidationError} In strict mode if value is NaN
  */
 static validateNotNaN(value: number, name = 'value'): number {
  const config = getValidationConfig();

  if (!config.validateNaN || config.mode === ValidationMode.NONE) {
   return value;
  }

  if (isNaNNumber(value)) {
   const message = `${name} must not be NaN`;

   switch (config.mode) {
    case ValidationMode.STRICT:
     throw new NumericalValidationError(value, 'not NaN', message);
    case ValidationMode.WARN:
     config.logger(message);
     return value;
    case ValidationMode.SAFE:
    default:
     return 0; // Safe fallback
   }
  }

  return value;
 }

 /**
  * Validates that a value is within range.
  * @param value - Value to validate
  * @param min - Minimum value (inclusive)
  * @param max - Maximum value (inclusive)
  * @param name - Parameter name for error messages
  * @returns Validated value, clamped in safe mode
  * @throws {NumericalValidationError} In strict mode if value is out of range
  */
 static validateRange(value: number, min: number, max: number, name = 'value'): number {
  const config = getValidationConfig();

  if (!config.validateRange || config.mode === ValidationMode.NONE) {
   return value;
  }

  if (value < min || value > max) {
   const message = `${name} must be between ${min} and ${max}, got ${value}`;

   switch (config.mode) {
    case ValidationMode.STRICT:
     throw new NumericalValidationError(value, 'range', message);
    case ValidationMode.WARN:
     config.logger(message);
     return value;
    case ValidationMode.SAFE:
    default:
     // Clamp to range
     return value < min ? min : value > max ? max : value;
   }
  }

  return value;
 }

 /**
  * Validates and cleans a numeric value.
  * @param value - Value to validate
  * @param fallback - Fallback value if invalid
  * @param min - Minimum allowed value
  * @param max - Maximum allowed value
  * @returns Clean value
  */
 static sanitize(
  value: number,
  fallback = 0,
  min = -Number.MAX_VALUE,
  max = Number.MAX_VALUE,
 ): number {
  const config = getValidationConfig();

  if (config.mode === ValidationMode.NONE) {
   return value;
  }

  // Use auxiliary numeric sanitization
  return sanitizeNumber(value, fallback, min, max);
 }

 /**
  * Validates a vector's components.
  * @param x - X component
  * @param y - Y component
  * @param name - Vector name for error messages
  * @returns Validated components
  */
 static validateVector2(x: number, y: number, name = 'vector'): { x: number; y: number } {
  return {
   x: this.validateFinite(x, `${name}.x`),
   y: this.validateFinite(y, `${name}.y`),
  };
 }

 /**
  * Validates a matrix's components.
  * @param m00 - Matrix element [0,0]
  * @param m01 - Matrix element [0,1]
  * @param m10 - Matrix element [1,0]
  * @param m11 - Matrix element [1,1]
  * @param name - Matrix name for error messages
  * @returns Validated components
  */
 static validateMatrix2(
  m00: number,
  m01: number,
  m10: number,
  m11: number,
  name = 'matrix',
 ): { m00: number; m01: number; m10: number; m11: number } {
  return {
   m00: this.validateFinite(m00, `${name}[0,0]`),
   m01: this.validateFinite(m01, `${name}[0,1]`),
   m10: this.validateFinite(m10, `${name}[1,0]`),
   m11: this.validateFinite(m11, `${name}[1,1]`),
  };
 }

 /**
  * Assert that two values are nearly equal.
  * @param actual - Actual value
  * @param expected - Expected value
  * @param epsilon - Tolerance
  * @param message - Error message
  * @throws {NumericalValidationError} If values are not nearly equal
  */
 static assertNearEquals(
  actual: number,
  expected: number,
  epsilon = 1e-10,
  message?: string,
 ): void {
  if (!nearEquals(actual, expected, epsilon)) {
   throw new NumericalValidationError(
    actual,
    `near ${expected}`,
    message || `Expected ${actual} to be near ${expected} (tolerance: ${epsilon})`,
   );
  }
 }

 /**
  * Check if validation would throw in current mode.
  * @returns True if current mode is STRICT
  */
 static wouldThrow(): boolean {
  return getValidationConfig().mode === ValidationMode.STRICT;
 }

 /**
  * Check if validation would warn in current mode.
  * @returns True if current mode is WARN or STRICT
  */
 static wouldWarn(): boolean {
  const mode = getValidationConfig().mode;
  return mode === ValidationMode.WARN || mode === ValidationMode.STRICT;
 }
}
