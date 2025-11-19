/**
 * @file src/core-utils/error-messages.ts
 * @module math2d/core-utils/error-messages
 * @description Standardized error messages for the math2d library.
 * 
 * @remarks
 * This module provides consistent error messages across all math2d components.
 * It ensures uniformity in error reporting and makes it easier to maintain
 * and translate error messages in the future.
 */

/**
 * Error message templates for the math2d library.
 * @internal
 */
export const ErrorMessages = {
  // Division errors
  DIVISION_BY_ZERO: (methodName: string) => 
    `${methodName}: divisor must be non-zero`,
  
  DIVISION_COMPONENTS_ZERO: (methodName: string) => 
    `${methodName}: divisor components must be non-zero`,
  
  // Zero length errors
  NORMALIZE_ZERO_LENGTH: (methodName: string) => 
    `${methodName}: cannot normalize zero-length vector`,
  
  SET_LENGTH_ZERO_VECTOR: (methodName: string) => 
    `${methodName}: cannot set length on zero-length vector`,
  
  UNIT_PERPENDICULAR_ZERO: (methodName: string) => 
    `${methodName}: cannot compute unit perpendicular of a zero-length vector`,
  
  // Component errors
  ZERO_COMPONENT_INVERSE: (methodName: string) => 
    `${methodName}: cannot invert vector with zero component`,
  
  // Range errors
  NEGATIVE_LENGTH: (methodName: string) => 
    `${methodName}: length must be non-negative`,
  
  NEGATIVE_TOLERANCE: (methodName: string) => 
    `${methodName}: tolerance must be non-negative`,
  
  // Array bounds errors
  ARRAY_OUT_OF_BOUNDS: (methodName: string, offset: number, arrayLength: number) => 
    `${methodName}: invalid offset ${offset} for array length ${arrayLength}`,
  
  ARRAY_TOO_SHORT: (methodName: string) => 
    `${methodName}: array must have at least two elements`,
  
  // Type errors
  INVALID_OBJECT_PROPERTIES: (methodName: string) => 
    `${methodName}: requires object with numeric x and y properties`,
  
  INVALID_CONSTRUCTOR_ARGS: (className: string) => 
    `${className}.constructor: invalid constructor arguments for ${className}`,
  
  INVALID_COMPONENT_VALUES: (methodName: string) => 
    `${methodName}: x and y must be numbers`,
  
  // Parse errors
  PARSE_ERROR: (className: string, input: string) => 
    `${className}.parse: cannot parse ${className} from string "${input}"`,
  
  // Matrix errors
  SINGULAR_MATRIX: (methodName: string) => 
    `${methodName}: matrix is singular (non-invertible)`,
  
  DEGENERATE_TRANSFORMATION: (methodName: string) => 
    `${methodName}: degenerate transformation matrix`,
  
  // General validation
  INVALID_ARGUMENT: (methodName: string, argName: string, reason: string) => 
    `${methodName}: invalid ${argName} - ${reason}`,
} as const;

/**
 * Creates a standardized RangeError for the math2d library.
 * 
 * @param methodName - The name of the method throwing the error.
 * @param message - The error message or message generator function.
 * @returns A new RangeError with the standardized message.
 */
export function createRangeError(
  methodName: string, 
  message: string | ((methodName: string) => string)
): RangeError {
  const errorMessage = typeof message === 'function' ? message(methodName) : message;
  return new RangeError(errorMessage);
}

/**
 * Creates a standardized TypeError for the math2d library.
 * 
 * @param methodName - The name of the method throwing the error.
 * @param message - The error message or message generator function.
 * @returns A new TypeError with the standardized message.
 */
export function createTypeError(
  methodName: string, 
  message: string | ((methodName: string) => string)
): TypeError {
  const errorMessage = typeof message === 'function' ? message(methodName) : message;
  return new TypeError(errorMessage);
}

/**
 * Creates a standardized Error for the math2d library.
 * 
 * @param methodName - The name of the method throwing the error.
 * @param message - The error message or message generator function.
 * @returns A new Error with the standardized message.
 */
export function createError(
  methodName: string, 
  message: string | ((methodName: string) => string)
): Error {
  const errorMessage = typeof message === 'function' ? message(methodName) : message;
  return new Error(errorMessage);
}
