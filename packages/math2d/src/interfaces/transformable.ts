/**
 * @file src/interfaces/transformable.ts
 * @module math2d/interfaces/transformable
 * @description Interface for objects that can be transformed geometrically.
 * 
 * @remarks
 * This interface defines the contract for types that support geometric
 * transformations like rotation, scaling, reflection, and translation.
 */

/**
 * Interface for objects that can be transformed geometrically.
 * 
 * @typeParam TVector - The vector type used for transformations.
 * @typeParam TMatrix - The matrix type used for transformations.
 */
export interface Transformable<TVector, TMatrix = any> {
  /**
   * Rotates this object by an angle.
   * 
   * @param angle - Rotation angle in radians.
   * @returns `this` for method chaining.
   */
  rotate(angle: number): this;

  /**
   * Rotates this object using precomputed sine and cosine.
   * 
   * @param cos - Cosine of the rotation angle.
   * @param sin - Sine of the rotation angle.
   * @returns `this` for method chaining.
   */
  rotateCS?(cos: number, sin: number): this;

  /**
   * Rotates this object around a point.
   * 
   * @param center - Center of rotation.
   * @param angle - Rotation angle in radians.
   * @returns `this` for method chaining.
   */
  rotateAround?(center: TVector, angle: number): this;

  /**
   * Scales this object uniformly or non-uniformly.
   * 
   * @param scale - Uniform scale factor or scale vector.
   * @returns `this` for method chaining.
   */
  scale?(scale: number | TVector): this;

  /**
   * Reflects this object about a normal.
   * 
   * @param normal - Normal vector to reflect about.
   * @returns `this` for method chaining.
   */
  reflect?(normal: TVector): this;

  /**
   * Safely reflects this object about a normal.
   * 
   * @param normal - Normal vector (need not be unit length).
   * @param tolerance - Tolerance for zero-length normal.
   * @returns `this` for method chaining.
   */
  reflectSafe?(normal: TVector, tolerance?: number): this;

  /**
   * Projects this object onto an axis.
   * 
   * @param axis - Axis to project onto.
   * @returns `this` for method chaining.
   */
  project?(axis: TVector): this;

  /**
   * Applies a matrix transformation.
   * 
   * @param matrix - Transformation matrix.
   * @returns `this` for method chaining.
   */
  transform?(matrix: TMatrix): this;
}

/**
 * Static interface for transformable operations.
 * 
 * @typeParam T - The type being transformed.
 * @typeParam TVector - The vector type used for transformations.
 * @typeParam TMatrix - The matrix type used for transformations.
 */
export interface TransformableStatic<T, TVector = T, TMatrix = any> {
  /**
   * Creates a rotated copy of an object.
   * 
   * @param source - Object to rotate.
   * @param angle - Rotation angle in radians.
   * @returns A new rotated object.
   */
  rotate(source: T, angle: number): T;

  /**
   * Creates a rotated copy, writing to an output object.
   * 
   * @param source - Object to rotate.
   * @param angle - Rotation angle in radians.
   * @param out - Object to write the result to.
   * @returns The `out` object with rotated values.
   */
  rotate(source: T, angle: number, out: T): T;

  /**
   * Creates a rotated copy using precomputed sine and cosine.
   * 
   * @param source - Object to rotate.
   * @param cos - Cosine of the rotation angle.
   * @param sin - Sine of the rotation angle.
   * @returns A new rotated object.
   */
  rotateCS?(source: T, cos: number, sin: number): T;

  /**
   * Creates a rotated copy using precomputed values, writing to output.
   * 
   * @param source - Object to rotate.
   * @param cos - Cosine of the rotation angle.
   * @param sin - Sine of the rotation angle.
   * @param out - Object to write the result to.
   * @returns The `out` object with rotated values.
   */
  rotateCS?(source: T, cos: number, sin: number, out: T): T;

  /**
   * Creates a copy rotated around a point.
   * 
   * @param source - Object to rotate.
   * @param center - Center of rotation.
   * @param angle - Rotation angle in radians.
   * @returns A new rotated object.
   */
  rotateAround?(source: T, center: TVector, angle: number): T;

  /**
   * Creates a copy rotated around a point, writing to output.
   * 
   * @param source - Object to rotate.
   * @param center - Center of rotation.
   * @param angle - Rotation angle in radians.
   * @param out - Object to write the result to.
   * @returns The `out` object with rotated values.
   */
  rotateAround?(source: T, center: TVector, angle: number, out: T): T;

  /**
   * Creates a reflected copy about a normal.
   * 
   * @param source - Object to reflect.
   * @param normal - Unit normal vector.
   * @returns A new reflected object.
   */
  reflect?(source: T, normal: TVector): T;

  /**
   * Creates a reflected copy, writing to output.
   * 
   * @param source - Object to reflect.
   * @param normal - Unit normal vector.
   * @param out - Object to write the result to.
   * @returns The `out` object with reflected values.
   */
  reflect?(source: T, normal: TVector, out: T): T;

  /**
   * Creates a projected copy onto an axis.
   * 
   * @param source - Object to project.
   * @param axis - Axis to project onto.
   * @returns A new projected object.
   */
  project?(source: T, axis: TVector): T;

  /**
   * Creates a projected copy, writing to output.
   * 
   * @param source - Object to project.
   * @param axis - Axis to project onto.
   * @param out - Object to write the result to.
   * @returns The `out` object with projected values.
   */
  project?(source: T, axis: TVector, out: T): T;

  /**
   * Applies a matrix transformation.
   * 
   * @param source - Object to transform.
   * @param matrix - Transformation matrix.
   * @returns A new transformed object.
   */
  transform?(source: T, matrix: TMatrix): T;

  /**
   * Applies a matrix transformation, writing to output.
   * 
   * @param source - Object to transform.
   * @param matrix - Transformation matrix.
   * @param out - Object to write the result to.
   * @returns The `out` object with transformed values.
   */
  transform?(source: T, matrix: TMatrix, out: T): T;
}
