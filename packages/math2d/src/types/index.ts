/**
 * @file types/index.ts
 * @module @lenguados/math2d/types
 * @description Shared type definitions and type guards for math2d
 *
 * @remarks
 * This module centralizes structural types and runtime shape checks shared
 * across the math2d package.
 */

/* ========================================================================== */
/* Vector2 Types                                                              */
/* ========================================================================== */

/**
 * Readonly interface for objects with x,y components.
 *
 * @category Types
 * @since 0.7.0
 */
export interface ReadonlyVector2Like {
 readonly x: number;
 readonly y: number;
}

/**
 * Mutable interface for objects with x,y components.
 *
 * @category Types
 * @since 0.7.0
 */
export interface Vector2Like {
 x: number;
 y: number;
}

/* ========================================================================== */
/* Matrix2 Types                                                              */
/* ========================================================================== */

/**
 * Readonly interface for 2x2 matrix components.
 *
 * @category Types
 * @since 0.7.0
 */
export interface ReadonlyMatrix2Like {
 readonly m00: number;
 readonly m01: number;
 readonly m10: number;
 readonly m11: number;
}

/**
 * Mutable interface for 2x2 matrix components.
 *
 * @category Types
 * @since 0.7.0
 */
export interface Matrix2Like {
 m00: number;
 m01: number;
 m10: number;
 m11: number;
}

/* ========================================================================== */
/* Matrix3 Types                                                              */
/* ========================================================================== */

/**
 * Readonly interface for 3x3 matrix components.
 *
 * @category Types
 * @since 0.7.0
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
 *
 * @category Types
 * @since 0.7.0
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

/* ========================================================================== */
/* Rotation2 Types                                                            */
/* ========================================================================== */

/**
 * Readonly interface for 2D rotation represented as cosine/sine components.
 *
 * @category Types
 * @since 0.7.0
 */
export interface ReadonlyRotation2Like {
 /**
  * Cosine component of the rotation.
  * For a rotation of angle θ, this equals cos(θ).
  */
 readonly cos: number;

 /**
  * Sine component of the rotation.
  * For a rotation of angle θ, this equals sin(θ).
  */
 readonly sin: number;
}

/**
 * Mutable interface for 2D rotation represented as cosine/sine components.
 * @see {@link ReadonlyRotation2Like} for detailed property documentation.
 *
 * @category Types
 * @since 0.7.0
 */
export interface Rotation2Like {
 /**
  * Cosine component of the rotation.
  * For a rotation of angle θ, this equals cos(θ).
  */
 cos: number;

 /**
  * Sine component of the rotation.
  * For a rotation of angle θ, this equals sin(θ).
  */
 sin: number;
}

/* ========================================================================== */
/* Complex Types                                                              */
/* ========================================================================== */

/**
 * Readonly interface for complex numbers.
 *
 * @category Types
 * @since 0.7.0
 */
export interface ReadonlyComplexLike {
 readonly real: number;
 readonly imag: number;
}

/**
 * Mutable interface for complex numbers.
 *
 * @category Types
 * @since 0.7.0
 */
export interface ComplexLike {
 real: number;
 imag: number;
}

/* ========================================================================== */
/* Interval Types                                                             */
/* ========================================================================== */

/**
 * Readonly interface for intervals.
 *
 * @category Types
 * @since 0.7.0
 */
export interface ReadonlyIntervalLike {
 readonly min: number;
 readonly max: number;
}

/**
 * Mutable interface for intervals.
 *
 * @category Types
 * @since 0.7.0
 */
export interface IntervalLike {
 min: number;
 max: number;
}

/* ========================================================================== */
/* Transform2 Types                                                           */
/* ========================================================================== */

/**
 * Readonly interface for 2D transforms.
 *
 * @category Types
 * @since 0.7.0
 */
export interface ReadonlyTransform2Like {
 readonly position: ReadonlyVector2Like;
 readonly rotation: ReadonlyRotation2Like;
 readonly scale: ReadonlyVector2Like;
}

/**
 * Mutable interface for 2D transforms.
 *
 * @category Types
 * @since 0.7.0
 */
export interface Transform2Like {
 position: Vector2Like;
 rotation: Rotation2Like;
 scale: Vector2Like;
}

/* ========================================================================== */
/* Type Guards                                                                */
/* ========================================================================== */

/**
 * Internal helper to check if an object has numeric properties.
 *
 * @param object - Object to check
 * @param keys - Property names to verify
 * @returns True if all keys exist and are numbers
 * @internal
 */
function hasNumericProperties(object: Record<string, unknown>, keys: readonly string[]): boolean {
 for (const key of keys) {
  if (!(key in object) || typeof object[key] !== 'number') {
   return false;
  }
 }
 return true;
}

/**
 * Type guard to check if value has x,y properties (Vector2Like).
 *
 * @param value - Value to check
 * @returns True if value conforms to ReadonlyVector2Like
 *
 * @example
 * ```typescript
 * const point = { x: 1, y: 2 };
 * if (isVector2Like(point)) {
 *   console.log(point.x, point.y); // TypeScript knows x, y are numbers
 * }
 * ```
 *
 * @category Types
 * @since 0.7.0
 */
export function isVector2Like(value: unknown): value is ReadonlyVector2Like {
 if (typeof value !== 'object' || value === null) return false;
 return hasNumericProperties(value as Record<string, unknown>, ['x', 'y']);
}

/**
 * Type guard to check if value has 2x2 matrix properties (Matrix2Like).
 *
 * @param value - Value to check
 * @returns True if value conforms to ReadonlyMatrix2Like
 *
 * @example
 * ```typescript
 * const mat = { m00: 1, m01: 0, m10: 0, m11: 1 };
 * if (isMatrix2Like(mat)) {
 *   console.log(mat.m00); // TypeScript knows m00 is a number
 * }
 * ```
 *
 * @category Types
 * @since 0.7.0
 */
export function isMatrix2Like(value: unknown): value is ReadonlyMatrix2Like {
 if (typeof value !== 'object' || value === null) return false;
 return hasNumericProperties(value as Record<string, unknown>, ['m00', 'm01', 'm10', 'm11']);
}

/**
 * Type guard to check if value has rotation properties (Rotation2Like).
 *
 * @param value - Value to check
 * @returns True if value conforms to ReadonlyRotation2Like
 *
 * @example
 * ```typescript
 * const rot = { cos: 1, sin: 0 };
 * if (isRotation2Like(rot)) {
 *   console.log(rot.cos, rot.sin); // TypeScript knows cos, sin are numbers
 * }
 * ```
 *
 * @category Types
 * @since 0.7.0
 */
export function isRotation2Like(value: unknown): value is ReadonlyRotation2Like {
 if (typeof value !== 'object' || value === null) return false;
 return hasNumericProperties(value as Record<string, unknown>, ['cos', 'sin']);
}

/**
 * Type guard to check if value has 3x3 matrix properties (Matrix3Like).
 *
 * @param value - Value to check
 * @returns True if value conforms to ReadonlyMatrix3Like
 *
 * @example
 * ```typescript
 * const mat = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 0, m21: 0, m22: 1 };
 * if (isMatrix3Like(mat)) {
 *   console.log(mat.m00); // TypeScript knows m00 is a number
 * }
 * ```
 *
 * @category Types
 * @since 0.7.0
 */
export function isMatrix3Like(value: unknown): value is ReadonlyMatrix3Like {
 if (typeof value !== 'object' || value === null) return false;
 return hasNumericProperties(value as Record<string, unknown>, [
  'm00',
  'm01',
  'm02',
  'm10',
  'm11',
  'm12',
  'm20',
  'm21',
  'm22',
 ]);
}

/**
 * Type guard to check if value has complex number properties (ComplexLike).
 *
 * @param value - Value to check
 * @returns True if value conforms to ReadonlyComplexLike
 *
 * @example
 * ```typescript
 * const c = { real: 1, imag: 2 };
 * if (isComplexLike(c)) {
 *   console.log(c.real, c.imag); // TypeScript knows real, imag are numbers
 * }
 * ```
 *
 * @category Types
 * @since 0.7.0
 */
export function isComplexLike(value: unknown): value is ReadonlyComplexLike {
 if (typeof value !== 'object' || value === null) return false;
 return hasNumericProperties(value as Record<string, unknown>, ['real', 'imag']);
}

/**
 * Type guard to check if value has interval properties (IntervalLike).
 *
 * @param value - Value to check
 * @returns True if value conforms to ReadonlyIntervalLike
 *
 * @example
 * ```typescript
 * const interval = { min: 0, max: 10 };
 * if (isIntervalLike(interval)) {
 *   console.log(interval.min, interval.max); // TypeScript knows min, max are numbers
 * }
 * ```
 *
 * @category Types
 * @since 0.7.0
 */
export function isIntervalLike(value: unknown): value is ReadonlyIntervalLike {
 if (typeof value !== 'object' || value === null) return false;
 return hasNumericProperties(value as Record<string, unknown>, ['min', 'max']);
}

/**
 * Type guard to check if value has transform2 properties (Transform2Like).
 *
 * @param value - Value to check
 * @returns True if value conforms to ReadonlyTransform2Like
 *
 * @example
 * ```typescript
 * const transform = {
 *   position: { x: 0, y: 0 },
 *   rotation: { cos: 1, sin: 0 },
 *   scale: { x: 1, y: 1 }
 * };
 * if (isTransform2Like(transform)) {
 *   console.log(transform.position.x); // TypeScript knows structure
 * }
 * ```
 *
 * @category Types
 * @since 0.7.0
 */
export function isTransform2Like(value: unknown): value is ReadonlyTransform2Like {
 if (typeof value !== 'object' || value === null) return false;
 const v = value as Record<string, unknown>;
 return isVector2Like(v.position) && isRotation2Like(v.rotation) && isVector2Like(v.scale);
}
