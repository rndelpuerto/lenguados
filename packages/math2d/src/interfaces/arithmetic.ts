/**
 * @file src/interfaces/arithmetic.ts
 * @module math2d/interfaces/arithmetic
 * @description Interface for objects that support arithmetic operations.
 * 
 * @remarks
 * This interface defines the contract for types that support basic
 * arithmetic operations like addition, subtraction, multiplication, etc.
 */

/**
 * Interface for objects that support arithmetic operations.
 * 
 * @typeParam T - The type of object for operations (often same as implementing type).
 */
export interface Arithmetic<T> {
  /**
   * Adds another object to this one.
   * 
   * @param other - The object to add.
   * @returns `this` for method chaining.
   */
  add(other: T): this;

  /**
   * Adds a scalar to all components.
   * 
   * @param scalar - The scalar to add.
   * @returns `this` for method chaining.
   */
  addScalar?(scalar: number): this;

  /**
   * Subtracts another object from this one.
   * 
   * @param other - The object to subtract.
   * @returns `this` for method chaining.
   */
  sub(other: T): this;

  /**
   * Subtracts a scalar from all components.
   * 
   * @param scalar - The scalar to subtract.
   * @returns `this` for method chaining.
   */
  subScalar?(scalar: number): this;

  /**
   * Multiplies this object by another (component-wise).
   * 
   * @param other - The object to multiply by.
   * @returns `this` for method chaining.
   */
  multiply(other: T): this;

  /**
   * Multiplies all components by a scalar.
   * 
   * @param scalar - The scalar to multiply by.
   * @returns `this` for method chaining.
   */
  multiplyScalar(scalar: number): this;

  /**
   * Divides this object by another (component-wise).
   * 
   * @param other - The object to divide by.
   * @returns `this` for method chaining.
   * @throws {RangeError} If any divisor component is zero.
   */
  divide(other: T): this;

  /**
   * Divides all components by a scalar.
   * 
   * @param scalar - The scalar to divide by.
   * @returns `this` for method chaining.
   * @throws {RangeError} If scalar is zero.
   */
  divideScalar(scalar: number): this;

  /**
   * Negates all components.
   * 
   * @returns `this` for method chaining.
   */
  negate(): this;
}

/**
 * Static interface for arithmetic operations.
 * 
 * @typeParam T - The type of objects in operations.
 */
export interface ArithmeticStatic<T> {
  /**
   * Adds two objects.
   * 
   * @param a - First operand.
   * @param b - Second operand.
   * @returns A new object containing the sum.
   */
  add(a: T, b: T): T;

  /**
   * Adds two objects, writing to output.
   * 
   * @param a - First operand.
   * @param b - Second operand.
   * @param out - Object to write the result to.
   * @returns The `out` object with the sum.
   */
  add(a: T, b: T, out: T): T;

  /**
   * Adds a scalar to an object.
   * 
   * @param obj - The object.
   * @param scalar - The scalar to add.
   * @returns A new object with the scalar added.
   */
  addScalar?(obj: T, scalar: number): T;

  /**
   * Adds a scalar to an object, writing to output.
   * 
   * @param obj - The object.
   * @param scalar - The scalar to add.
   * @param out - Object to write the result to.
   * @returns The `out` object with the scalar added.
   */
  addScalar?(obj: T, scalar: number, out: T): T;

  /**
   * Subtracts two objects.
   * 
   * @param a - Minuend.
   * @param b - Subtrahend.
   * @returns A new object containing the difference.
   */
  sub(a: T, b: T): T;

  /**
   * Subtracts two objects, writing to output.
   * 
   * @param a - Minuend.
   * @param b - Subtrahend.
   * @param out - Object to write the result to.
   * @returns The `out` object with the difference.
   */
  sub(a: T, b: T, out: T): T;

  /**
   * Multiplies two objects (component-wise).
   * 
   * @param a - First factor.
   * @param b - Second factor.
   * @returns A new object containing the product.
   */
  multiply(a: T, b: T): T;

  /**
   * Multiplies two objects, writing to output.
   * 
   * @param a - First factor.
   * @param b - Second factor.
   * @param out - Object to write the result to.
   * @returns The `out` object with the product.
   */
  multiply(a: T, b: T, out: T): T;

  /**
   * Multiplies an object by a scalar.
   * 
   * @param obj - The object.
   * @param scalar - The scalar multiplier.
   * @returns A new scaled object.
   */
  multiplyScalar(obj: T, scalar: number): T;

  /**
   * Multiplies an object by a scalar, writing to output.
   * 
   * @param obj - The object.
   * @param scalar - The scalar multiplier.
   * @param out - Object to write the result to.
   * @returns The `out` object scaled.
   */
  multiplyScalar(obj: T, scalar: number, out: T): T;

  /**
   * Divides two objects (component-wise).
   * 
   * @param a - Dividend.
   * @param b - Divisor.
   * @returns A new object containing the quotient.
   * @throws {RangeError} If any divisor component is zero.
   */
  divide(a: T, b: T): T;

  /**
   * Divides two objects, writing to output.
   * 
   * @param a - Dividend.
   * @param b - Divisor.
   * @param out - Object to write the result to.
   * @returns The `out` object with the quotient.
   * @throws {RangeError} If any divisor component is zero.
   */
  divide(a: T, b: T, out: T): T;

  /**
   * Negates an object.
   * 
   * @param obj - Object to negate.
   * @returns A new negated object.
   */
  negate(obj: T): T;

  /**
   * Negates an object, writing to output.
   * 
   * @param obj - Object to negate.
   * @param out - Object to write the result to.
   * @returns The `out` object negated.
   */
  negate(obj: T, out: T): T;
}
