/**
 * @file src/types/index.ts
 * @module @lenguados/math2d/types
 * @description Shared type definitions and type guards for math2d.
 */

// ============================================================================
// Vector2 Types
// ============================================================================

/**
 * Readonly interface for objects with x,y components.
 */
export interface ReadonlyVector2Like {
 readonly x: number;
 readonly y: number;
}

/**
 * Mutable interface for objects with x,y components.
 */
export interface Vector2Like {
 x: number;
 y: number;
}

// ============================================================================
// Matrix2 Types
// ============================================================================

/**
 * Readonly interface for 2x2 matrix components.
 */
export interface ReadonlyMatrix2Like {
 readonly m00: number;
 readonly m01: number;
 readonly m10: number;
 readonly m11: number;
}

/**
 * Mutable interface for 2x2 matrix components.
 */
export interface Matrix2Like {
 m00: number;
 m01: number;
 m10: number;
 m11: number;
}

// ============================================================================
// Matrix3 Types
// ============================================================================

/**
 * Readonly interface for 3x3 matrix components.
 */
export interface ReadonlyMatrix3Like {
 readonly m00: number;
 readonly m01: number;
 readonly m02: number;
 readonly m10: number;
 readonly m11: number;
 readonly m12: number;
 readonly m20: number;
 readonly m21: number;
 readonly m22: number;
}

/**
 * Mutable interface for 3x3 matrix components.
 */
export interface Matrix3Like {
 m00: number;
 m01: number;
 m02: number;
 m10: number;
 m11: number;
 m12: number;
 m20: number;
 m21: number;
 m22: number;
}

// ============================================================================
// Rotation2 Types
// ============================================================================

/**
 * Readonly interface for rotation with cosine/sine.
 */
export interface ReadonlyRotation2Like {
 readonly c: number;
 readonly s: number;
}

/**
 * Mutable interface for rotation with cosine/sine.
 */
export interface Rotation2Like {
 c: number;
 s: number;
}

// ============================================================================
// Complex Types
// ============================================================================

/**
 * Readonly interface for complex numbers.
 */
export interface ReadonlyComplexLike {
 readonly real: number;
 readonly imag: number;
}

/**
 * Mutable interface for complex numbers.
 */
export interface ComplexLike {
 real: number;
 imag: number;
}

// ============================================================================
// Interval Types
// ============================================================================

/**
 * Readonly interface for intervals.
 */
export interface ReadonlyIntervalLike {
 readonly min: number;
 readonly max: number;
}

/**
 * Mutable interface for intervals.
 */
export interface IntervalLike {
 min: number;
 max: number;
}

// ============================================================================
// Quaternion2 Types
// ============================================================================

/**
 * Readonly interface for 2D quaternions.
 */
export interface ReadonlyQuaternion2Like {
 readonly w: number;
 readonly z: number;
}

/**
 * Mutable interface for 2D quaternions.
 */
export interface Quaternion2Like {
 w: number;
 z: number;
}

// ============================================================================
// Transform2 Types
// ============================================================================

/**
 * Readonly interface for 2D transforms.
 */
export interface ReadonlyTransform2Like {
 readonly position: ReadonlyVector2Like;
 readonly rotation: number;
 readonly scale: ReadonlyVector2Like;
}

/**
 * Mutable interface for 2D transforms.
 */
export interface Transform2Like {
 position: Vector2Like;
 rotation: number;
 scale: Vector2Like;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if value has x,y properties.
 * @param value - Value to check
 * @returns True if value is Vector2Like
 */
export function isVector2Like(value: unknown): value is ReadonlyVector2Like {
 return (
  typeof value === 'object' &&
  value !== null &&
  'x' in value &&
  'y' in value &&
  typeof (value as unknown as { x: unknown }).x === 'number' &&
  typeof (value as unknown as { y: unknown }).y === 'number'
 );
}

/**
 * Type guard to check if value has matrix2 properties.
 * @param value - Value to check
 * @returns True if value is Matrix2Like
 */
export function isMatrix2Like(value: unknown): value is ReadonlyMatrix2Like {
 return (
  typeof value === 'object' &&
  value !== null &&
  'm00' in value &&
  'm01' in value &&
  'm10' in value &&
  'm11' in value &&
  typeof (value as unknown as { m00: unknown; m01: unknown; m10: unknown; m11: unknown }).m00 ===
   'number' &&
  typeof (value as unknown as { m00: unknown; m01: unknown; m10: unknown; m11: unknown }).m01 ===
   'number' &&
  typeof (value as unknown as { m00: unknown; m01: unknown; m10: unknown; m11: unknown }).m10 ===
   'number' &&
  typeof (value as unknown as { m00: unknown; m01: unknown; m10: unknown; m11: unknown }).m11 ===
   'number'
 );
}

/**
 * Type guard to check if value has rotation properties.
 * @param value - Value to check
 * @returns True if value is Rotation2Like
 */
export function isRotation2Like(value: unknown): value is ReadonlyRotation2Like {
 return (
  typeof value === 'object' &&
  value !== null &&
  'c' in value &&
  's' in value &&
  typeof (value as unknown as { c: unknown; s: unknown }).c === 'number' &&
  typeof (value as unknown as { c: unknown; s: unknown }).s === 'number'
 );
}

/**
 * Type guard to check if value has matrix3 properties.
 * @param value - Value to check
 * @returns True if value is Matrix3Like
 */
export function isMatrix3Like(value: unknown): value is ReadonlyMatrix3Like {
 if (typeof value !== 'object' || value === null) return false;
 const keys = ['m00', 'm01', 'm02', 'm10', 'm11', 'm12', 'm20', 'm21', 'm22'] as const;
 for (const key of keys) {
  if (!(key in value) || typeof (value as Record<string, unknown>)[key] !== 'number') {
   return false;
  }
 }
 return true;
}

/**
 * Type guard to check if value has complex number properties.
 * @param value - Value to check
 * @returns True if value is ComplexLike
 */
export function isComplexLike(value: unknown): value is ReadonlyComplexLike {
 return (
  typeof value === 'object' &&
  value !== null &&
  'real' in value &&
  'imag' in value &&
  typeof (value as unknown as { real: unknown; imag: unknown }).real === 'number' &&
  typeof (value as unknown as { imag: unknown }).imag === 'number'
 );
}

/**
 * Type guard to check if value has interval properties.
 * @param value - Value to check
 * @returns True if value is IntervalLike
 */
export function isIntervalLike(value: unknown): value is ReadonlyIntervalLike {
 return (
  typeof value === 'object' &&
  value !== null &&
  'min' in value &&
  'max' in value &&
  typeof (value as unknown as { min: unknown; max: unknown }).min === 'number' &&
  typeof (value as unknown as { max: unknown }).max === 'number'
 );
}

/**
 * Type guard to check if value has quaternion properties.
 * @param value - Value to check
 * @returns True if value is Quaternion2Like
 */
export function isQuaternion2Like(value: unknown): value is ReadonlyQuaternion2Like {
 return (
  typeof value === 'object' &&
  value !== null &&
  'w' in value &&
  'z' in value &&
  typeof (value as unknown as { w: unknown; z: unknown }).w === 'number' &&
  typeof (value as unknown as { z: unknown }).z === 'number'
 );
}

/**
 * Type guard to check if value has transform2 properties.
 * @param value - Value to check
 * @returns True if value is Transform2Like
 */
export function isTransform2Like(value: unknown): value is ReadonlyTransform2Like {
 if (typeof value !== 'object' || value === null) return false;
 const v = value as Record<string, unknown>;
 return (
  'position' in v &&
  'rotation' in v &&
  'scale' in v &&
  isVector2Like(v.position) &&
  typeof v.rotation === 'number' &&
  isVector2Like(v.scale)
 );
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * Array allocation utilities.
 */
export const ArrayUtils = {
 /**
  * Create a Float32Array with optional initial values.
  * @param size - Array size
  * @param fill - Optional value to fill array with
  * @returns New Float32Array
  */
 createFloat32(size: number, fill?: number): Float32Array {
  const array = new Float32Array(size);
  if (fill !== undefined) {
   array.fill(fill);
  }
  return array;
 },

 /**
  * Create a Float64Array with optional initial values.
  * @param size - Array size
  * @param fill - Optional value to fill array with
  * @returns New Float64Array
  */
 createFloat64(size: number, fill?: number): Float64Array {
  const array = new Float64Array(size);
  if (fill !== undefined) {
   array.fill(fill);
  }
  return array;
 },

 /**
  * Resize a TypedArray, preserving existing data.
  * @param array - Array to resize
  * @param newSize - New size
  * @returns New array with copied data
  */
 resize<T extends Float32Array | Float64Array>(array: T, newSize: number): T {
  const ArrayConstructor = array.constructor as new (size: number) => T;
  const newArray = new ArrayConstructor(newSize);
  newArray.set(array.subarray(0, Math.min(array.length, newSize)));
  return newArray;
 },
} as const;
