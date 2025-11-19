/**
 * @file src/interfaces/normalizable.ts
 * @module math2d/interfaces/normalizable
 * @description Interface for objects that can be normalized.
 * 
 * @remarks
 * This interface defines the contract for types that support normalization
 * operations, typically converting to unit length while preserving direction.
 */

/**
 * Interface for objects that can be normalized to unit length.
 * 
 * @typeParam T - The type returned by the normalization methods (typically `this` for chaining).
 */
export interface Normalizable<T> {
  /**
   * Normalizes this object to unit length.
   * 
   * @returns The normalized object (typically `this` for method chaining).
   * @throws {RangeError} If the object has zero length and cannot be normalized.
   */
  normalize(): T;

  /**
   * Safely normalizes this object to unit length.
   * 
   * @param tolerance - Optional tolerance for zero-length check.
   * @returns The normalized object, or a zero object if length is within tolerance.
   */
  normalizeSafe(tolerance?: number): T;

  /**
   * Checks if this object is already normalized (has unit length).
   * 
   * @param tolerance - Optional tolerance for the unit length check.
   * @returns `true` if the object has unit length within tolerance.
   */
  isUnit?(tolerance?: number): boolean;
}

/**
 * Static interface for normalizable operations.
 * 
 * @typeParam T - The type of objects being normalized.
 * @typeParam R - The return type of the normalization (often same as T).
 */
export interface NormalizableStatic<T, R = T> {
  /**
   * Creates a normalized copy of the input.
   * 
   * @param source - The object to normalize.
   * @returns A new normalized object.
   * @throws {RangeError} If the source has zero length.
   */
  normalize(source: T): R;

  /**
   * Creates a normalized copy of the input, writing to an output object.
   * 
   * @param source - The object to normalize.
   * @param out - The object to write the result to.
   * @returns The `out` object with normalized values.
   * @throws {RangeError} If the source has zero length.
   */
  normalize(source: T, out: R): R;

  /**
   * Safely creates a normalized copy of the input.
   * 
   * @param source - The object to normalize.
   * @param tolerance - Optional tolerance for zero-length check.
   * @returns A new normalized object, or zero if source length is within tolerance.
   */
  normalizeSafe?(source: T, tolerance?: number): R;

  /**
   * Safely creates a normalized copy, writing to an output object.
   * 
   * @param source - The object to normalize.
   * @param tolerance - Tolerance for zero-length check.
   * @param out - The object to write the result to.
   * @returns The `out` object with normalized values.
   */
  normalizeSafe?(source: T, tolerance: number, out: R): R;

  /**
   * Checks if an object is normalized (has unit length).
   * 
   * @param source - The object to check.
   * @param tolerance - Optional tolerance for the unit length check.
   * @returns `true` if the object has unit length within tolerance.
   */
  isUnit?(source: T, tolerance?: number): boolean;
}
