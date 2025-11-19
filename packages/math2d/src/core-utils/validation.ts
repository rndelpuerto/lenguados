/**
 * @file src/core-utils/validation.ts
 * @module math2d/core-utils/validation
 * @description Common validation utilities for the math2d library.
 * 
 * @remarks
 * This module provides reusable validation functions to ensure
 * consistent input validation across all math2d components.
 */

import { ErrorMessages, createRangeError, createTypeError } from './error-messages';

/**
 * Validates that a divisor is not zero.
 * 
 * @param divisor - The divisor to validate.
 * @param methodName - The name of the calling method for error reporting.
 * @throws {RangeError} If divisor is zero.
 */
export function validateNonZeroDivisor(divisor: number, methodName: string): void {
  if (divisor === 0) {
    throw createRangeError(methodName, ErrorMessages.DIVISION_BY_ZERO);
  }
}

/**
 * Validates that vector components are not zero for division.
 * 
 * @param x - The x component.
 * @param y - The y component.
 * @param methodName - The name of the calling method for error reporting.
 * @throws {RangeError} If either component is zero.
 */
export function validateNonZeroComponents(x: number, y: number, methodName: string): void {
  if (x === 0 || y === 0) {
    throw createRangeError(methodName, ErrorMessages.DIVISION_COMPONENTS_ZERO);
  }
}

/**
 * Validates that a length value is non-negative.
 * 
 * @param length - The length to validate.
 * @param methodName - The name of the calling method for error reporting.
 * @throws {RangeError} If length is negative.
 */
export function validateNonNegativeLength(length: number, methodName: string): void {
  if (length < 0) {
    throw createRangeError(methodName, ErrorMessages.NEGATIVE_LENGTH);
  }
}

/**
 * Validates array bounds for vector operations.
 * 
 * @param array - The array to validate.
 * @param offset - The offset into the array.
 * @param requiredLength - The required number of elements from offset.
 * @param methodName - The name of the calling method for error reporting.
 * @throws {RangeError} If array bounds are invalid.
 */
export function validateArrayBounds(
  array: ArrayLike<unknown>,
  offset: number,
  requiredLength: number,
  methodName: string
): void {
  if (offset < 0 || offset + requiredLength > array.length) {
    throw createRangeError(
      methodName,
      ErrorMessages.ARRAY_OUT_OF_BOUNDS(methodName, offset, array.length)
    );
  }
}

/**
 * Validates that an object has numeric x and y properties.
 * 
 * @param obj - The object to validate.
 * @param methodName - The name of the calling method for error reporting.
 * @throws {TypeError} If x or y is not a number.
 */
export function validateVector2Like(
  obj: { x: unknown; y: unknown },
  methodName: string
): void {
  if (typeof obj.x !== 'number' || typeof obj.y !== 'number') {
    throw createTypeError(methodName, ErrorMessages.INVALID_OBJECT_PROPERTIES);
  }
}

/**
 * Validates that a value is a finite number.
 * 
 * @param value - The value to validate.
 * @param paramName - The parameter name for error reporting.
 * @param methodName - The name of the calling method for error reporting.
 * @throws {RangeError} If value is not finite.
 */
export function validateFiniteNumber(
  value: number,
  paramName: string,
  methodName: string
): void {
  if (!Number.isFinite(value)) {
    throw createRangeError(
      methodName,
      ErrorMessages.INVALID_ARGUMENT(methodName, paramName, 'must be a finite number')
    );
  }
}

/**
 * Validates that a vector has non-zero length.
 * 
 * @param lengthSquared - The squared length of the vector.
 * @param methodName - The name of the calling method for error reporting.
 * @param operation - The operation being attempted (e.g., "normalize", "set length").
 * @throws {RangeError} If the vector has zero length.
 */
export function validateNonZeroLength(
  lengthSquared: number,
  methodName: string,
  operation: 'normalize' | 'set length' | 'unit perpendicular' = 'normalize'
): void {
  if (lengthSquared === 0) {
    const errorMap = {
      'normalize': ErrorMessages.NORMALIZE_ZERO_LENGTH,
      'set length': ErrorMessages.SET_LENGTH_ZERO_VECTOR,
      'unit perpendicular': ErrorMessages.UNIT_PERPENDICULAR_ZERO
    };
    throw createRangeError(methodName, errorMap[operation]);
  }
}

/**
 * Type guard to check if a value is a valid array index (0 or 1).
 * 
 * @param index - The index to check.
 * @returns True if index is 0 or 1.
 */
export function isValidComponentIndex(index: number): index is 0 | 1 {
  return index === 0 || index === 1;
}
