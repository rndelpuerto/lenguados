/**
 * @file src/interfaces/comparable.ts
 * @module math2d/interfaces/comparable
 * @description Interface for objects that can be compared for equality.
 * 
 * @remarks
 * This interface defines the contract for types that support equality
 * comparisons, both exact and approximate (with tolerance).
 */

/**
 * Interface for objects that can be compared for equality.
 * 
 * @typeParam T - The type of object this can be compared with.
 */
export interface Comparable<T> {
  /**
   * Tests for exact equality with another object.
   * 
   * @param other - The object to compare with.
   * @returns `true` if objects are exactly equal.
   */
  equals(other: T): boolean;

  /**
   * Tests for approximate equality with another object.
   * 
   * @param other - The object to compare with.
   * @param tolerance - The tolerance for the comparison.
   * @returns `true` if objects are equal within the given tolerance.
   */
  nearEquals(other: T, tolerance?: number): boolean;

  /**
   * Computes a hash code for this object.
   * 
   * @returns A 32-bit integer hash code.
   * @remarks
   * Objects that are equal (via `equals`) should return the same hash code.
   */
  hashCode?(): number;
}

/**
 * Static interface for comparable operations.
 * 
 * @typeParam T - The type of objects being compared.
 */
export interface ComparableStatic<T> {
  /**
   * Tests for exact equality between two objects.
   * 
   * @param a - First object.
   * @param b - Second object.
   * @returns `true` if objects are exactly equal.
   */
  equals(a: T, b: T): boolean;

  /**
   * Tests for approximate equality between two objects.
   * 
   * @param a - First object.
   * @param b - Second object.
   * @param tolerance - The tolerance for the comparison.
   * @returns `true` if objects are equal within the given tolerance.
   */
  nearEquals(a: T, b: T, tolerance?: number): boolean;

  /**
   * Computes a hash code for an object.
   * 
   * @param obj - The object to hash.
   * @returns A 32-bit integer hash code.
   */
  hashCode?(obj: T): number;
}

/**
 * Interface for objects that can be compared to zero.
 */
export interface ZeroComparable {
  /**
   * Tests if this object is exactly zero.
   * 
   * @returns `true` if all components are exactly zero.
   */
  isZero(): boolean;

  /**
   * Tests if this object is approximately zero.
   * 
   * @param tolerance - The tolerance for the comparison.
   * @returns `true` if all components are within tolerance of zero.
   */
  nearZero(tolerance?: number): boolean;

  /**
   * Sets this object to zero.
   * 
   * @returns `this` for method chaining.
   */
  zero(): this;
}

/**
 * Static interface for zero comparison operations.
 * 
 * @typeParam T - The type of objects being compared.
 */
export interface ZeroComparableStatic<T> {
  /**
   * Tests if an object is exactly zero.
   * 
   * @param obj - The object to test.
   * @returns `true` if all components are exactly zero.
   */
  isZero(obj: T): boolean;

  /**
   * Tests if an object is approximately zero.
   * 
   * @param obj - The object to test.
   * @param tolerance - The tolerance for the comparison.
   * @returns `true` if all components are within tolerance of zero.
   */
  nearZero(obj: T, tolerance?: number): boolean;
}
