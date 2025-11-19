/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-dupe-class-members */
/**
 * @file src/vector2.ts
 * @module math2d/vector2
 * @description Two-dimensional vector implementation for the Lenguado 2-D physics-engine family.
 */

/* eslint-disable no-dupe-class-members */

import { EPSILON, TAU, clamp as clampNumber } from './scalar';

/**
 * Plain object with `{ x: number, y: number }` shape.
 * @public
 */
export type Vector2Like = { x: number; y: number };

/**
 * Readonly plain object with `{ readonly x: number, readonly y: number }` shape.
 * @public
 */
export type ReadonlyVector2Like = { readonly x: number; readonly y: number };

/**
 * Readonly view of a {@link Vector2} instance.
 * @public
 */
export type ReadonlyVector2 = Readonly<Vector2>;

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Vector2} instance so it can no longer be mutated.
 *
 * @param vector - The {@link Vector2} object to freeze.
 * @returns The *same* instance, now typed as ReadonlyVector2 ({@link Readonly}\<{@link Vector2}\>),
 *          after being frozen with {@link Object.freeze}.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In *strict mode* any subsequent attempt to modify `x` or `y` throws a
 *   `TypeError`. In non-strict mode the write is silently ignored.
 * - Use this helper to create **truly immutable static constants** such as
 *   {@code Vector2.ZERO_VECTOR}, ensuring they cannot be altered at runtime.
 *
 * @example
 * ```ts
 * const ZERO_VECTOR = freezeVector2(new Vector2(0, 0));
 *
 * // Will throw in strict mode:
 * ZERO_VECTOR.x = 5;
 * ```
 */
export function freezeVector2(vector: Vector2): ReadonlyVector2 {
 return Object.freeze(vector);
}

/**
 * Type guard for a plain object that *looks like* a 2‑D vector.
 *
 * @param subject - Unknown value to test.
 * @returns `true` if `subject` is an object with numeric `x` and `y` properties; otherwise `false`.
 *
 * @example
 * ```ts
 * if (isVector2Like(maybe)) {
 *   // `maybe` is narrowed to `{ readonly x:number, readonly y:number }`
 *   console.log(maybe.x + maybe.y);
 * }
 * ```
 */
export function isVector2Like(subject: unknown): subject is ReadonlyVector2Like {
 return (
  typeof subject === 'object' &&
  subject !== null &&
  typeof (subject as { x?: unknown }).x === 'number' &&
  typeof (subject as { y?: unknown }).y === 'number'
 );
}

/* ========================================================================== */
/* Class: Vector2                                                             */
/* ========================================================================== */

/**
 * Mutable, chainable two-dimensional vector with comprehensive operations for
 * arithmetic, geometry, transforms, comparisons and conversions.
 *
 * @remarks
 * - **Design:** Instance methods are *mutable* and chainable; static methods are *pure*
 *   with alloc‑free overloads that write into an `out` parameter (a common pattern in
 *   performance‑oriented math libs such as glMatrix). This minimizes allocations in hot paths.
 * - **Numerics:** Uses {@link Math.hypot} for robust length/distance calculations.
 * - **Safety:** “Safe” variants avoid throwing on degeneracies (e.g., zero length),
 *   returning zero vectors or no‑ops instead—useful in physics loops.
 */
export class Vector2 {
 /* ----------------------------------------------------------------------- */
 /* Static: Constants (immutable)                                           */
 /* ----------------------------------------------------------------------- */

 /** The zero/origin vector `(0, 0)`. */
 public static readonly ZERO_VECTOR = freezeVector2(new Vector2(0, 0));

 /** The all-ones vector `(1, 1)`. */
 public static readonly ONE_VECTOR = freezeVector2(new Vector2(1, 1));

 /** The all-(-1) vector `(−1, −1)`. */
 public static readonly NEGATIVE_ONE_VECTOR = freezeVector2(new Vector2(-1, -1));

 /** The `(EPSILON, EPSILON)` vector. */
 public static readonly EPSILON_VECTOR = freezeVector2(new Vector2(EPSILON, EPSILON));

 /** The `( +∞, +∞ )` vector. */
 public static readonly INFINITY_VECTOR = freezeVector2(
  new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
 );

 /** The `( −∞, −∞ )` vector. */
 public static readonly NEGATIVE_INFINITY_VECTOR = freezeVector2(
  new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
 );

 /** Unit vector along +X `(1, 0)`. */
 public static readonly UNIT_X_VECTOR = freezeVector2(new Vector2(1, 0));

 /** Unit vector along +Y `(0, 1)`. */
 public static readonly UNIT_Y_VECTOR = freezeVector2(new Vector2(0, 1));

 /** Unit vector along −X `(−1, 0)`. */
 public static readonly NEGATIVE_UNIT_X_VECTOR = freezeVector2(new Vector2(-1, 0));

 /** Unit vector along −Y `(0, −1)`. */
 public static readonly NEGATIVE_UNIT_Y_VECTOR = freezeVector2(new Vector2(0, -1));

 /** 45° diagonal unit `(1/√2, 1/√2)`. */
 public static readonly UNIT_DIAGONAL_VECTOR = freezeVector2(
  new Vector2(Math.SQRT1_2, Math.SQRT1_2),
 );

 /** 225° diagonal unit `(−1/√2, −1/√2)`. */
 public static readonly NEGATIVE_UNIT_DIAGONAL_VECTOR = freezeVector2(
  new Vector2(-Math.SQRT1_2, -Math.SQRT1_2),
 );

 /* ----------------------------------------------------------------------- */
 /* Static: Factories                                                       */
 /* ----------------------------------------------------------------------- */

 /**
  * Creates a deep copy of `source`.
  *
  * @param source - Vector to clone.
  * @returns A new {@link Vector2} instance with identical components.
  */
 public static clone(source: ReadonlyVector2): Vector2 {
  return new Vector2(source.x, source.y);
 }

 /**
  * Copies component values from `source` into `destination` (alloc‑free).
  *
  * @param source - Source vector.
  * @param destination - Target vector to receive the copy.
  * @returns The `destination` vector (for chaining).
  */
 public static copy(source: ReadonlyVector2, destination: Vector2): Vector2 {
  return destination.set(source.x, source.y);
 }

 /**
  * Constructs a vector from explicit components.
  *
  * @param x - X component.
  * @param y - Y component.
  * @returns A new {@link Vector2} with components `(x, y)`.
  */
 public static fromValues(x: number, y: number): Vector2 {
  return new Vector2(x, y);
 }

 /**
  * Creates a vector from a flat numeric array.
  *
  * @param sourceArray - Numeric array with at least two elements.
  * @param offset - Index of the **x** component. @defaultValue `0`
  * @returns A new {@link Vector2} initialized from the array.
  *
  * @throws {RangeError} If `offset` is out of bounds for `sourceArray`.
  *
  * @example
  * ```ts
  * const v = Vector2.fromArray([10, 20, 30]);     // -> (10, 20)
  * const w = Vector2.fromArray([10, 20, 30], 1); // -> (20, 30)
  * ```
  */
 public static fromArray(sourceArray: ArrayLike<number>, offset?: number): Vector2;
 /**
  * Alloc‑free overload that writes into `outVector`.
  *
  * @param sourceArray - Numeric array with at least two elements.
  * @param offset - Index of the **x** component. @defaultValue `0`
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  *
  * @throws {RangeError} If `offset` is out of bounds for `sourceArray`.
  */
 public static fromArray(
  sourceArray: ArrayLike<number>,
  offset: number,
  outVector: Vector2,
 ): Vector2;
 public static fromArray(
  sourceArray: ArrayLike<number>,
  offset = 0,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (offset < 0 || offset + 1 >= sourceArray.length) {
   throw new RangeError(
    `Vector2.fromArray: invalid offset ${offset} for array length ${sourceArray.length}`,
   );
  }

  return outVector.set(sourceArray[offset]!, sourceArray[offset + 1]!);
 }

 /**
  * Creates a vector from a plain object `{ x, y }`.
  *
  * @param object - Plain object with numeric `x` and `y`.
  * @returns A new {@link Vector2}.
  * @throws {TypeError} If `object.x` or `object.y` is not a number.
  */
 public static fromObject(object: Vector2Like): Vector2;
 /**
  * Alloc‑free overload that writes into `outVector`.
  *
  * @param object - Plain object with numeric `x` and `y`.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {TypeError} If `object.x` or `object.y` is not a number.
  */
 public static fromObject(object: Vector2Like, outVector: Vector2): Vector2;
 public static fromObject(object: Vector2Like, outVector: Vector2 = new Vector2()): Vector2 {
  if (typeof object.x !== 'number' || typeof object.y !== 'number') {
   throw new TypeError('Vector2.fromObject: requires an object with numeric x and y properties');
  }

  return outVector.set(object.x, object.y);
 }

 /**
  * Creates a vector from polar coordinates.
  *
  * @param angle - Angle in radians.
  * @param length - Magnitude. @defaultValue `1`
  * @returns A new {@link Vector2} positioned at the given angle and length.
  *
  * @example
  * ```ts
  * Vector2.fromAngle(Math.PI / 2, 2); // -> (0, 2)
  * ```
  */
 public static fromAngle(angle: number, length?: number): Vector2;
 /**
  * Alloc‑free overload writing into `outVector`.
  *
  * @param angle - Angle in radians.
  * @param length - Magnitude.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static fromAngle(angle: number, length: number, outVector: Vector2): Vector2;
 public static fromAngle(angle: number, length = 1, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(Math.cos(angle) * length, Math.sin(angle) * length);
 }

 /**
  * Parses a string of the form `"x,y"` into a vector.
  *
  * @param string_ - String containing two comma-separated numbers.
  * @returns A new {@link Vector2} parsed from the string.
  * @throws {Error} If the string cannot be parsed.
  */
 public static parse(string_: string): Vector2;
 /**
  * Alloc‑free overload writing into `outVector`.
  *
  * @param string_ - String containing two comma-separated numbers.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {Error} If the string cannot be parsed.
  */
 public static parse(string_: string, outVector: Vector2): Vector2;
 public static parse(string_: string, outVector: Vector2 = new Vector2()): Vector2 {
  const parts = string_.split(',').map((s) => parseFloat(s.trim()));

  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
   throw new Error(`Vector2.parse: cannot parse Vector2 from string "${string_}"`);
  }

  return outVector.set(parts[0]!, parts[1]!);
 }

 /**
  * Generates a **random unit vector** with uniform direction in `[0, 2π)`.
  *
  * @returns A new unit {@link Vector2} with random heading.
  */
 public static random(): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static random(outVector: Vector2): Vector2;
 public static random(outVector: Vector2 = new Vector2()): Vector2 {
  return Vector2.fromAngle(Math.random() * TAU, 1, outVector);
 }

 /**
  * Samples a random point **on** a circle of radius `radius`.
  *
  * @param radius - Circle radius. @defaultValue `1`
  * @returns A new {@link Vector2} located on the circle.
  */
 public static randomOnCircle(radius?: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param radius - Circle radius.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static randomOnCircle(radius: number, outVector: Vector2): Vector2;
 public static randomOnCircle(radius = 1, outVector: Vector2 = new Vector2()): Vector2 {
  const a = Math.random() * TAU;

  return outVector.set(Math.cos(a) * radius, Math.sin(a) * radius);
 }

 /**
  * Samples a random point **inside** the unit disk with uniform area density.
  *
  * @returns A new {@link Vector2} within the unit circle.
  */
 public static randomInUnitCircle(): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static randomInUnitCircle(outVector: Vector2): Vector2;
 public static randomInUnitCircle(outVector: Vector2 = new Vector2()): Vector2 {
  const r = Math.sqrt(Math.random()); // sqrt(u) → uniform area
  const a = Math.random() * TAU;

  return outVector.set(Math.cos(a) * r, Math.sin(a) * r);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Component-wise arithmetic                                       */
 /* ----------------------------------------------------------------------- */

 /**
  * Computes the sum of components `x + y`.
  *
  * @param vector - Vector to read.
  * @returns The scalar sum `vector.x + vector.y`.
  */
 public static sumComponents(vector: ReadonlyVector2): number {
  return vector.x + vector.y;
 }

 /**
  * Component-wise addition `a + b`.
  *
  * @param a - First addend.
  * @param b - Second addend.
  * @returns A new {@link Vector2} equal to `(a.x + b.x, a.y + b.y)`.
  */
 public static add(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - First addend.
  * @param b - Second addend.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static add(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static add(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(a.x + b.x, a.y + b.y);
 }

 /**
  * Adds a scalar to both components `v + s`.
  *
  * @param v - Source vector.
  * @param s - Scalar addend.
  * @returns A new {@link Vector2} equal to `(v.x + s, v.y + s)`.
  */
 public static addScalar(v: ReadonlyVector2, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param s - Scalar addend.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static addScalar(v: ReadonlyVector2, s: number, outVector: Vector2): Vector2;
 public static addScalar(
  v: ReadonlyVector2,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(v.x + s, v.y + s);
 }

 /**
  * Component-wise subtraction `a − b`.
  *
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @returns A new {@link Vector2} equal to `(a.x - b.x, a.y - b.y)`.
  */
 public static sub(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static sub(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static sub(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(a.x - b.x, a.y - b.y);
 }

 /**
  * Subtracts a scalar from both components `v − s`.
  *
  * @param v - Source vector.
  * @param s - Scalar to subtract.
  * @returns A new {@link Vector2} equal to `(v.x - s, v.y - s)`.
  */
 public static subScalar(v: ReadonlyVector2, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param s - Scalar to subtract.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static subScalar(v: ReadonlyVector2, s: number, outVector: Vector2): Vector2;
 public static subScalar(
  v: ReadonlyVector2,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(v.x - s, v.y - s);
 }

 /**
  * Component-wise multiplication `a * b`.
  *
  * @param a - First factor.
  * @param b - Second factor.
  * @returns A new {@link Vector2} equal to `(a.x * b.x, a.y * b.y)`.
  */
 public static multiply(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - First factor.
  * @param b - Second factor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static multiply(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static multiply(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(a.x * b.x, a.y * b.y);
 }

 /**
  * Scales a vector by a scalar `v * s`.
  *
  * @param v - Vector to scale.
  * @param s - Scale factor.
  * @returns A new {@link Vector2} equal to `(v.x * s, v.y * s)`.
  */
 public static multiplyScalar(v: ReadonlyVector2, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to scale.
  * @param s - Scale factor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static multiplyScalar(v: ReadonlyVector2, s: number, outVector: Vector2): Vector2;
 public static multiplyScalar(
  v: ReadonlyVector2,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(v.x * s, v.y * s);
 }

 /**
  * Component-wise division `a / b`.
  *
  * @param a - Numerator vector.
  * @param b - Divisor vector.
  * @returns A new {@link Vector2} equal to `(a.x / b.x, a.y / b.y)`.
  * @throws {RangeError} If any component of `b` is zero.
  */
 public static divide(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Numerator vector.
  * @param b - Divisor vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If any component of `b` is zero.
  */
 public static divide(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static divide(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (b.x === 0 || b.y === 0) {
   throw new RangeError('Vector2.divide: divisor components must be non-zero');
  }

  return outVector.set(a.x / b.x, a.y / b.y);
 }

 /**
  * Scalar division `v / s`.
  *
  * @param v - Vector to divide.
  * @param s - Non‑zero scalar divisor.
  * @returns A new {@link Vector2} equal to `(v.x / s, v.y / s)`.
  * @throws {RangeError} If `s === 0`.
  */
 public static divideScalar(v: ReadonlyVector2, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to divide.
  * @param s - Non‑zero scalar divisor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If `s === 0`.
  */
 public static divideScalar(v: ReadonlyVector2, s: number, outVector: Vector2): Vector2;
 public static divideScalar(
  v: ReadonlyVector2,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (s === 0) {
   throw new RangeError('Vector2.divideScalar: divisor must be non-zero');
  }

  return outVector.set(v.x / s, v.y / s);
 }

 /**
  * Safe component-wise division. Components with |divisor| ≤ {@link EPSILON} yield `0`.
  *
  * @param a - Numerator vector.
  * @param b - Divisor vector.
  * @returns A new {@link Vector2} with safe division per component.
  */
 public static divideSafe(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Numerator vector.
  * @param b - Divisor vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static divideSafe(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static divideSafe(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const ix = Math.abs(b.x) <= EPSILON ? 0 : 1 / b.x;
  const iy = Math.abs(b.y) <= EPSILON ? 0 : 1 / b.y;

  return outVector.set(a.x * ix, a.y * iy);
 }

 /**
  * Safe scalar division. If |`s`| ≤ {@link EPSILON}, returns `(0,0)`.
  *
  * @param v - Vector to divide.
  * @param s - Scalar divisor.
  * @returns A new {@link Vector2} containing the safe division.
  */
 public static divideScalarSafe(v: ReadonlyVector2, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to divide.
  * @param s - Scalar divisor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static divideScalarSafe(v: ReadonlyVector2, s: number, outVector: Vector2): Vector2;
 public static divideScalarSafe(
  v: ReadonlyVector2,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (Math.abs(s) <= EPSILON) return outVector.set(0, 0);

  return outVector.set(v.x / s, v.y / s);
 }

 /**
  * Component-wise remainder (JS `%` semantics).
  *
  * @param a - Dividend vector.
  * @param b - Divisor vector (non-zero components).
  * @returns A new {@link Vector2} equal to `(a.x % b.x, a.y % b.y)`.
  * @throws {RangeError} If any divisor component is zero.
  */
 public static mod(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Dividend vector.
  * @param b - Divisor vector (non-zero components).
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If any divisor component is zero.
  */
 public static mod(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static mod(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (b.x === 0 || b.y === 0) {
   throw new RangeError('Vector2.mod: divisor components must be non-zero');
  }

  return outVector.set(a.x % b.x, a.y % b.y);
 }

 /**
  * Scalar remainder `v % s`.
  *
  * @param v - Dividend vector.
  * @param s - Non‑zero scalar divisor.
  * @returns A new {@link Vector2} equal to `(v.x % s, v.y % s)`.
  * @throws {RangeError} If `s === 0`.
  */
 public static modScalar(v: ReadonlyVector2, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Dividend vector.
  * @param s - Non‑zero scalar divisor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If `s === 0`.
  */
 public static modScalar(v: ReadonlyVector2, s: number, outVector: Vector2): Vector2;
 public static modScalar(
  v: ReadonlyVector2,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (s === 0) {
   throw new RangeError('Vector2.modScalar: divisor must be non-zero');
  }

  return outVector.set(v.x % s, v.y % s);
 }

 /**
  * Unary negation `( -x, -y )`.
  *
  * @param v - Source vector.
  * @returns A new negated {@link Vector2}.
  */
 public static negate(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the negation.
  * @returns `outVector`.
  */
 public static negate(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static negate(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(-v.x, -v.y);
 }

 /**
  * Adds a scaled vector: `base + scale * scaled`.
  *
  * @param base - Base vector.
  * @param scaled - Vector to scale and add.
  * @param scale - Scale factor.
  * @returns A new {@link Vector2} equal to `(base + scaled * scale)`.
  *
  * @example
  * ```ts
  * velocity = Vector2.addScaledVector(velocity, acceleration, dt);
  * ```
  */
 public static addScaledVector(
  base: ReadonlyVector2,
  scaled: ReadonlyVector2,
  scale: number,
 ): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param base - Base vector.
  * @param scaled - Vector to scale and add.
  * @param scale - Scale factor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static addScaledVector(
  base: ReadonlyVector2,
  scaled: ReadonlyVector2,
  scale: number,
  outVector: Vector2,
 ): Vector2;
 public static addScaledVector(
  base: ReadonlyVector2,
  scaled: ReadonlyVector2,
  scale: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(base.x + scaled.x * scale, base.y + scaled.y * scale);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Interpolation                                                   */
 /* ----------------------------------------------------------------------- */

 /**
  * Linear interpolation: `a + t (b − a)`. The factor `t` is **not** clamped.
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor.
  * @returns A new {@link Vector2} equal to the linear interpolation.
  */
 public static lerp(a: ReadonlyVector2, b: ReadonlyVector2, t: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static lerp(a: ReadonlyVector2, b: ReadonlyVector2, t: number, outVector: Vector2): Vector2;
 public static lerp(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  t: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
 }

 /**
  * Linear interpolation with `t` clamped to `[0, 1]`.
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor.
  * @returns A new {@link Vector2} equal to the clamped interpolation.
  */
 public static lerpClamped(a: ReadonlyVector2, b: ReadonlyVector2, t: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static lerpClamped(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  t: number,
  outVector: Vector2,
 ): Vector2;
 public static lerpClamped(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  t: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;

  return Vector2.lerp(a, b, tt, outVector);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Measures & geometry                                             */
 /* ----------------------------------------------------------------------- */

 /**
  * Dot product `a·b = a.x*b.x + a.y*b.y`.
  *
  * @param a - First operand.
  * @param b - Second operand.
  * @returns The scalar dot product.
  */
 public static dot(a: ReadonlyVector2, b: ReadonlyVector2): number {
  return a.x * b.x + a.y * b.y;
 }

 /**
  * 2‑D scalar cross product (z‑component): `a.x*b.y − a.y*b.x`.
  *
  * @param a - First operand.
  * @param b - Second operand.
  * @returns The scalar cross product (signed area magnitude).
  */
 public static cross(a: ReadonlyVector2, b: ReadonlyVector2): number {
  return a.x * b.y - a.y * b.x;
 }

 /**
  * Twice the signed area of triangle `(a, b, c)`.
  *
  * @param a - First vertex.
  * @param b - Second vertex.
  * @param c - Third vertex.
  * @returns Twice the signed area (can be negative).
  */
 public static cross3(a: ReadonlyVector2, b: ReadonlyVector2, c: ReadonlyVector2): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
 }

 /**
  * Euclidean length `||v||` using {@link Math.hypot} for stability.
  *
  * @param v - Vector to measure.
  * @returns The Euclidean norm.
  */
 public static length(v: ReadonlyVector2): number {
  return Math.hypot(v.x, v.y);
 }

 /**
  * Squared length `||v||²` (avoids the square root for performance).
  *
  * @param v - Vector to measure.
  * @returns The squared length.
  */
 public static lengthSq(v: ReadonlyVector2): number {
  return v.x * v.x + v.y * v.y;
 }

 /**
  * Manhattan length `|x| + |y|`.
  *
  * @param v - Vector to measure.
  * @returns The L¹ norm.
  */
 public static manhattanLength(v: ReadonlyVector2): number {
  return Math.abs(v.x) + Math.abs(v.y);
 }

 /**
  * Euclidean distance between `a` and `b`.
  *
  * @param a - First point.
  * @param b - Second point.
  * @returns The Euclidean distance.
  */
 public static distance(a: ReadonlyVector2, b: ReadonlyVector2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
 }

 /**
  * Squared Euclidean distance between `a` and `b`.
  *
  * @param a - First point.
  * @param b - Second point.
  * @returns The squared Euclidean distance.
  */
 public static distanceSq(a: ReadonlyVector2, b: ReadonlyVector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return dx * dx + dy * dy;
 }

 /**
  * Manhattan distance between `a` and `b`.
  *
  * @param a - First point.
  * @param b - Second point.
  * @returns The Manhattan distance.
  */
 public static manhattanDistance(a: ReadonlyVector2, b: ReadonlyVector2): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Direction & angles                                              */
 /* ----------------------------------------------------------------------- */

 /**
  * Unit direction from `from` to `to`. Returns `(0,0)` if both points coincide.
  *
  * @param from - Start point.
  * @param to - End point.
  * @returns A new unit {@link Vector2} representing the direction.
  *
  * @remarks This implementation is **alloc‑free** and writes directly into `outVector` when provided.
  */
 public static direction(from: ReadonlyVector2, to: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param from - Start point.
  * @param to - End point.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static direction(from: ReadonlyVector2, to: ReadonlyVector2, outVector: Vector2): Vector2;
 public static direction(
  from: ReadonlyVector2,
  to: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);

  return length === 0 ? outVector.set(0, 0) : outVector.set(dx / length, dy / length);
 }

 /**
  * Heading (angle) of `v` from the +X axis in radians ∈ `[−π, π]`.
  *
  * @param v - Vector to measure.
  * @returns Angle in radians in the range `[−π, π]`.
  */
 public static angle(v: ReadonlyVector2): number {
  return Math.atan2(v.y, v.x);
 }

 /**
  * Signed angle from `a` to `b` in radians (positive if `b` is CCW from `a`).
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @returns The signed angle in radians.
  *
  * @remarks Uses `atan2(cross(a,b), dot(a,b))` for robust behavior.
  */
 public static angleTo(a: ReadonlyVector2, b: ReadonlyVector2): number {
  return Math.atan2(Vector2.cross(a, b), Vector2.dot(a, b));
 }

 /**
  * Smallest unsigned angle between `a` and `b` in radians ∈ `[0, π]`.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @returns The unsigned angle in radians.
  *
  * @remarks Clamps the cosine to `[-1, 1]` to avoid `NaN` due to floating‑point error.
  */
 public static angleBetween(a: ReadonlyVector2, b: ReadonlyVector2): number {
  const product = Vector2.length(a) * Vector2.length(b);

  if (product === 0) return 0;

  const cosA = clampNumber(Vector2.dot(a, b) / product, -1, 1);

  return Math.acos(cosA);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Numeric transforms                                              */
 /* ----------------------------------------------------------------------- */

 /**
  * Applies {@link Math.floor} to both components.
  *
  * @param v - Source vector.
  * @returns A new floored {@link Vector2}.
  */
 public static floor(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static floor(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static floor(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(Math.floor(v.x), Math.floor(v.y));
 }

 /**
  * Applies {@link Math.ceil} to both components.
  *
  * @param v - Source vector.
  * @returns A new ceiled {@link Vector2}.
  */
 public static ceil(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static ceil(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static ceil(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(Math.ceil(v.x), Math.ceil(v.y));
 }

 /**
  * Applies {@link Math.round} to both components.
  *
  * @param v - Source vector.
  * @returns A new rounded {@link Vector2}.
  */
 public static round(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static round(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static round(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(Math.round(v.x), Math.round(v.y));
 }

 /**
  * Applies {@link Math.abs} to both components.
  *
  * @param v - Source vector.
  * @returns A new {@link Vector2} with absolute components.
  */
 public static abs(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static abs(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static abs(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(Math.abs(v.x), Math.abs(v.y));
 }

 /**
  * Component-wise reciprocal `(1/x, 1/y)`.
  *
  * @param v - Source vector.
  * @returns A new inverted {@link Vector2}.
  * @throws {RangeError} If any component is zero.
  */
 public static inverse(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If any component is zero.
  */
 public static inverse(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static inverse(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  if (v.x === 0 || v.y === 0) {
   throw new RangeError('Vector2.inverse: cannot invert vector with zero component');
  }

  return outVector.set(1 / v.x, 1 / v.y);
 }

 /**
  * Safe reciprocal. Components with |value| ≤ {@link EPSILON} become `0`.
  *
  * @param v - Source vector.
  * @returns A new {@link Vector2} with safe reciprocals.
  */
 public static inverseSafe(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static inverseSafe(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static inverseSafe(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(
   Math.abs(v.x) <= EPSILON ? 0 : 1 / v.x,
   Math.abs(v.y) <= EPSILON ? 0 : 1 / v.y,
  );
 }

 /**
  * Returns a new vector with `x` and `y` swapped.
  *
  * @param v - Source vector.
  * @returns A new {@link Vector2} equal to `(v.y, v.x)`.
  */
 public static swap(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static swap(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static swap(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(v.y, v.x);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Constraints                                                     */
 /* ----------------------------------------------------------------------- */

 /**
  * Clamps each component between the corresponding components of `min` and `max`.
  *
  * @param v - Vector to clamp.
  * @param min - Per-component minima.
  * @param max - Per-component maxima.
  * @returns A new clamped {@link Vector2}.
  *
  * @remarks If `min` > `max` on a component, behavior follows `Math.min(Math.max(x, min), max)`.
  */
 public static clamp(v: ReadonlyVector2, min: ReadonlyVector2, max: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to clamp.
  * @param min - Per-component minima.
  * @param max - Per-component maxima.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static clamp(
  v: ReadonlyVector2,
  min: ReadonlyVector2,
  max: ReadonlyVector2,
  outVector: Vector2,
 ): Vector2;
 public static clamp(
  v: ReadonlyVector2,
  min: ReadonlyVector2,
  max: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(
   Math.min(Math.max(v.x, min.x), max.x),
   Math.min(Math.max(v.y, min.y), max.y),
  );
 }

 /**
  * Clamps both components between scalar `min` and `max`.
  *
  * @param v - Vector to clamp.
  * @param min - Minimum scalar.
  * @param max - Maximum scalar.
  * @returns A new clamped {@link Vector2}.
  */
 public static clampScalar(v: ReadonlyVector2, min: number, max: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to clamp.
  * @param min - Minimum scalar.
  * @param max - Maximum scalar.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static clampScalar(
  v: ReadonlyVector2,
  min: number,
  max: number,
  outVector: Vector2,
 ): Vector2;
 public static clampScalar(
  v: ReadonlyVector2,
  min: number,
  max: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(Math.min(Math.max(v.x, min), max), Math.min(Math.max(v.y, min), max));
 }

 /**
  * Clamps the vector length to the range `[minLength, maxLength]` using a single square root.
  *
  * @param v - Vector to clamp.
  * @param minLength - Minimum magnitude (≥ 0).
  * @param maxLength - Maximum magnitude.
  * @returns A new {@link Vector2} with clamped magnitude.
  *
  * @remarks Avoids redundant normalization to reduce cost in hot‑paths.
  */
 public static clampLength(v: ReadonlyVector2, minLength: number, maxLength: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to clamp.
  * @param minLength - Minimum magnitude (≥ 0).
  * @param maxLength - Maximum magnitude.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static clampLength(
  v: ReadonlyVector2,
  minLength: number,
  maxLength: number,
  outVector: Vector2,
 ): Vector2;
 public static clampLength(
  v: ReadonlyVector2,
  minLength: number,
  maxLength: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const lsq = Vector2.lengthSq(v);

  if (lsq === 0) return outVector.set(v.x, v.y);

  const l = Math.sqrt(lsq);

  if (l < minLength) {
   const s = minLength / l;

   return outVector.set(v.x * s, v.y * s);
  }

  if (l > maxLength) {
   const s = maxLength / l;

   return outVector.set(v.x * s, v.y * s);
  }

  return outVector.set(v.x, v.y);
 }

 /**
  * Limits the vector length to `maxLength`.
  *
  * @param v - Vector to limit.
  * @param maxLength - Maximum allowed magnitude (≥ 0).
  * @returns A new {@link Vector2} with length not exceeding `maxLength`.
  *
  * @remarks Equivalent to `clampLength(v, 0, maxLength)`.
  */
 public static limit(v: ReadonlyVector2, maxLength: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to limit.
  * @param maxLength - Maximum allowed magnitude (≥ 0).
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static limit(v: ReadonlyVector2, maxLength: number, outVector: Vector2): Vector2;
 public static limit(
  v: ReadonlyVector2,
  maxLength: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const lsq = Vector2.lengthSq(v);

  if (lsq > maxLength * maxLength && lsq > 0) {
   const s = maxLength / Math.sqrt(lsq);

   return outVector.set(v.x * s, v.y * s);
  }

  return outVector.set(v.x, v.y);
 }

 /**
  * Component-wise minimum of `a` and `b`.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @returns A new {@link Vector2} containing per-component minima.
  */
 public static min(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static min(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static min(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(Math.min(a.x, b.x), Math.min(a.y, b.y));
 }

 /**
  * Component-wise maximum of `a` and `b`.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @returns A new {@link Vector2} containing per-component maxima.
  */
 public static max(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static max(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static max(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(Math.max(a.x, b.x), Math.max(a.y, b.y));
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Vector transforms                                               */
 /* ----------------------------------------------------------------------- */

 /**
  * Normalizes `v` to unit length.
  *
  * @param v - Vector to normalize.
  * @returns A new unit {@link Vector2}.
  * @throws {RangeError} If `v` has zero length.
  */
 public static normalize(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to normalize.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If `v` has zero length.
  */
 public static normalize(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static normalize(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  const length = Vector2.length(v);

  if (length === 0) throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');

  return outVector.set(v.x / length, v.y / length);
 }

 /**
  * Safe normalization. If `v` has zero length, returns `(0,0)`.
  *
  * @param v - Vector to normalize.
  * @returns A new {@link Vector2} containing the safe normalization.
  */
 public static normalizeSafe(v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to normalize.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static normalizeSafe(v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static normalizeSafe(v: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  const length = Vector2.length(v);

  return length === 0 ? outVector.set(0, 0) : outVector.set(v.x / length, v.y / length);
 }

 /**
  * Returns a copy of `v` with the requested length.
  *
  * @param v - Source vector.
  * @param newLength - Desired magnitude (≥ 0).
  * @returns A new {@link Vector2} with magnitude `newLength`.
  * @throws {RangeError} If `newLength < 0` or `v` has zero length.
  */
 public static setLength(v: ReadonlyVector2, newLength: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param newLength - Desired magnitude (≥ 0).
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If `newLength < 0` or `v` has zero length.
  */
 public static setLength(v: ReadonlyVector2, newLength: number, outVector: Vector2): Vector2;
 public static setLength(
  v: ReadonlyVector2,
  newLength: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (newLength < 0) throw new RangeError('Vector2.setLength: length must be non-negative');

  const length = Vector2.length(v);

  if (length === 0)
   throw new RangeError('Vector2.setLength: cannot set length on zero-length vector');

  const s = newLength / length;

  return outVector.set(v.x * s, v.y * s);
 }

 /**
  * Safe copy with requested length. Negative `newLength` is clamped to `0`.
  * If `v` is zero, returns `(newLength, 0)`.
  *
  * @param v - Source vector.
  * @param newLength - Desired magnitude (non‑negative).
  * @returns A new {@link Vector2} with safe length.
  */
 public static setLengthSafe(v: ReadonlyVector2, newLength: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param newLength - Desired magnitude (non‑negative).
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static setLengthSafe(v: ReadonlyVector2, newLength: number, outVector: Vector2): Vector2;
 public static setLengthSafe(
  v: ReadonlyVector2,
  newLength: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const nn = newLength < 0 ? 0 : newLength;
  const length = Vector2.length(v);

  if (length === 0) return outVector.set(nn, 0);

  const s = nn / length;

  return outVector.set(v.x * s, v.y * s);
 }

 /**
  * Returns a vector with the same magnitude as `v` but new heading `angle`.
  *
  * @param v - Source vector.
  * @param angle - New heading in radians.
  * @returns A new {@link Vector2} with rotated heading and preserved length.
  */
 public static setHeading(v: ReadonlyVector2, angle: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param angle - New heading in radians.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static setHeading(v: ReadonlyVector2, angle: number, outVector: Vector2): Vector2;
 public static setHeading(
  v: ReadonlyVector2,
  angle: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const length = Vector2.length(v);

  return outVector.set(Math.cos(angle) * length, Math.sin(angle) * length);
 }

 /**
  * Projects `v` onto `axis`. If `axis` is zero, returns `(0,0)`.
  *
  * @param v - Vector to project.
  * @param axis - Projection axis.
  * @returns A new {@link Vector2} equal to the projection.
  */
 public static project(v: ReadonlyVector2, axis: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to project.
  * @param axis - Projection axis.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static project(v: ReadonlyVector2, axis: ReadonlyVector2, outVector: Vector2): Vector2;
 public static project(
  v: ReadonlyVector2,
  axis: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const denom = Vector2.lengthSq(axis);

  if (denom === 0) return outVector.set(0, 0);

  const s = Vector2.dot(v, axis) / denom;

  return outVector.set(axis.x * s, axis.y * s);
 }

 /**
  * Projects `v` onto a **unit** axis (assumes `|axis| == 1`).
  *
  * @param v - Vector to project.
  * @param unitAxis - Unit-length axis of projection.
  * @returns A new {@link Vector2} equal to the projection.
  *
  * @remarks Avoids the extra division by `|axis|²`.
  */
 public static projectOnUnit(v: ReadonlyVector2, unitAxis: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to project.
  * @param unitAxis - Unit-length axis of projection.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static projectOnUnit(
  v: ReadonlyVector2,
  unitAxis: ReadonlyVector2,
  outVector: Vector2,
 ): Vector2;
 public static projectOnUnit(
  v: ReadonlyVector2,
  unitAxis: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const s = Vector2.dot(v, unitAxis);

  return outVector.set(unitAxis.x * s, unitAxis.y * s);
 }

 /**
  * Safe projection: if `axis` is near zero, returns `(0,0)`.
  *
  * @param v - Vector to project.
  * @param axis - Projection axis.
  * @returns A new {@link Vector2} equal to the safe projection.
  */
 public static projectSafe(v: ReadonlyVector2, axis: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to project.
  * @param axis - Projection axis.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static projectSafe(v: ReadonlyVector2, axis: ReadonlyVector2, outVector: Vector2): Vector2;
 public static projectSafe(
  v: ReadonlyVector2,
  axis: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const denom = Vector2.lengthSq(axis);

  if (denom <= EPSILON) return outVector.set(0, 0);

  const s = Vector2.dot(v, axis) / denom;

  return outVector.set(axis.x * s, axis.y * s);
 }

 /**
  * Reflection of `v` about a **unit** normal: `r = v − 2 (v·n̂) n̂`.
  *
  * @param v - Incident vector.
  * @param unitNormal - Unit-length normal to reflect about.
  * @returns A new reflected {@link Vector2}.
  */
 public static reflect(v: ReadonlyVector2, unitNormal: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Incident vector.
  * @param unitNormal - Unit-length normal to reflect about.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static reflect(
  v: ReadonlyVector2,
  unitNormal: ReadonlyVector2,
  outVector: Vector2,
 ): Vector2;
 public static reflect(
  v: ReadonlyVector2,
  unitNormal: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const dt2 = 2 * Vector2.dot(v, unitNormal);

  return outVector.set(v.x - dt2 * unitNormal.x, v.y - dt2 * unitNormal.y);
 }

 /**
  * Safe reflection. If `normal` is not unitary, it is normalized; if `|normal| ≈ 0`, returns `v`.
  *
  * @param v - Incident vector.
  * @param normal - Normal (need not be unitary).
  * @returns A new {@link Vector2} equal to the safe reflection.
  */
 public static reflectSafe(v: ReadonlyVector2, normal: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Incident vector.
  * @param normal - Normal (need not be unitary).
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static reflectSafe(
  v: ReadonlyVector2,
  normal: ReadonlyVector2,
  outVector: Vector2,
 ): Vector2;
 public static reflectSafe(
  v: ReadonlyVector2,
  normal: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const length2 = Vector2.lengthSq(normal);

  if (length2 <= EPSILON) return outVector.set(v.x, v.y);

  const invLength = 1 / Math.sqrt(length2);
  const nx = normal.x * invLength;
  const ny = normal.y * invLength;
  const dt2 = 2 * (v.x * nx + v.y * ny);

  return outVector.set(v.x - dt2 * nx, v.y - dt2 * ny);
 }

 /**
  * Perpendicular vector (±90°) with **unchanged length**.
  *
  * @param v - Source vector.
  * @param clockwise - `true` for CW, `false` for CCW. @defaultValue `false`
  * @returns A new perpendicular {@link Vector2}.
  */
 public static perpendicular(v: ReadonlyVector2, clockwise?: boolean): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param clockwise - `true` for CW, `false` for CCW.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static perpendicular(v: ReadonlyVector2, clockwise: boolean, outVector: Vector2): Vector2;
 public static perpendicular(
  v: ReadonlyVector2,
  clockwise = false,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return clockwise ? outVector.set(v.y, -v.x) : outVector.set(-v.y, v.x);
 }

 /**
  * Unit perpendicular (throws if `v` is zero).
  *
  * @param v - Source vector.
  * @param clockwise - `true` for CW, `false` for CCW. @defaultValue `false`
  * @returns A new unit perpendicular {@link Vector2}.
  * @throws {RangeError} If `v` has zero length.
  */
 public static unitPerpendicular(v: ReadonlyVector2, clockwise?: boolean): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param clockwise - `true` for CW, `false` for CCW.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  * @throws {RangeError} If `v` has zero length.
  */
 public static unitPerpendicular(
  v: ReadonlyVector2,
  clockwise: boolean,
  outVector: Vector2,
 ): Vector2;
 public static unitPerpendicular(
  v: ReadonlyVector2,
  clockwise = false,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const p = Vector2.perpendicular(v, clockwise, outVector);

  return Vector2.normalize(p, p);
 }

 /**
  * Safe unit perpendicular. If `v` is zero, returns `(-1,0)` for CCW or `(1,0)` for CW.
  *
  * @param v - Source vector.
  * @param clockwise - `true` for CW, `false` for CCW. @defaultValue `false`
  * @returns A new unit perpendicular {@link Vector2} or fallback axis for zeros.
  */
 public static unitPerpendicularSafe(v: ReadonlyVector2, clockwise?: boolean): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Source vector.
  * @param clockwise - `true` for CW, `false` for CCW.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static unitPerpendicularSafe(
  v: ReadonlyVector2,
  clockwise: boolean,
  outVector: Vector2,
 ): Vector2;
 public static unitPerpendicularSafe(
  v: ReadonlyVector2,
  clockwise: boolean = false,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  if (v.x === 0 && v.y === 0) {
   return outVector.set(clockwise ? 1 : -1, 0);
  }

  return Vector2.unitPerpendicular(v, clockwise, outVector);
 }

 /**
  * Rotates `v` by an angle (radians).
  *
  * @param v - Vector to rotate.
  * @param angle - Rotation angle in radians.
  * @returns A new rotated {@link Vector2}.
  */
 public static rotate(v: ReadonlyVector2, angle: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to rotate.
  * @param angle - Rotation angle in radians.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static rotate(v: ReadonlyVector2, angle: number, outVector: Vector2): Vector2;
 public static rotate(
  v: ReadonlyVector2,
  angle: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return outVector.set(v.x * c - v.y * s, v.x * s + v.y * c);
 }

 /**
  * Rotates `v` using **precomputed** cosine/sine (optimal for batches).
  *
  * @param v - Vector to rotate.
  * @param c - Precomputed cosine.
  * @param s - Precomputed sine.
  * @returns A new rotated {@link Vector2}.
  *
  * @remarks Mirrors patterns found in physics libs like Box2D.
  */
 public static rotateCS(v: ReadonlyVector2, c: number, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to rotate.
  * @param c - Precomputed cosine.
  * @param s - Precomputed sine.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static rotateCS(v: ReadonlyVector2, c: number, s: number, outVector: Vector2): Vector2;
 public static rotateCS(
  v: ReadonlyVector2,
  c: number,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(v.x * c - v.y * s, v.x * s + v.y * c);
 }

 /**
  * Rotates `v` around `center` by `angle` radians.
  *
  * @param v - Vector to rotate.
  * @param center - Rotation pivot.
  * @param angle - Rotation angle in radians.
  * @returns A new rotated {@link Vector2}.
  */
 public static rotateAround(v: ReadonlyVector2, center: ReadonlyVector2, angle: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to rotate.
  * @param center - Rotation pivot.
  * @param angle - Rotation angle in radians.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static rotateAround(
  v: ReadonlyVector2,
  center: ReadonlyVector2,
  angle: number,
  outVector: Vector2,
 ): Vector2;
 public static rotateAround(
  v: ReadonlyVector2,
  center: ReadonlyVector2,
  angle: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const translatedX = v.x - center.x;
  const translatedY = v.y - center.y;

  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return outVector.set(
   translatedX * c - translatedY * s + center.x,
   translatedX * s + translatedY * c + center.y,
  );
 }

 /**
  * Rotates `v` around `center` using precomputed `(c, s)`.
  *
  * @param v - Vector to rotate.
  * @param center - Rotation pivot.
  * @param c - Precomputed cosine.
  * @param s - Precomputed sine.
  * @returns A new rotated {@link Vector2}.
  */
 public static rotateAroundCS(
  v: ReadonlyVector2,
  center: ReadonlyVector2,
  c: number,
  s: number,
 ): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param v - Vector to rotate.
  * @param center - Rotation pivot.
  * @param c - Precomputed cosine.
  * @param s - Precomputed sine.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static rotateAroundCS(
  v: ReadonlyVector2,
  center: ReadonlyVector2,
  c: number,
  s: number,
  outVector: Vector2,
 ): Vector2;
 public static rotateAroundCS(
  v: ReadonlyVector2,
  center: ReadonlyVector2,
  c: number,
  s: number,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const tx = v.x - center.x;
  const ty = v.y - center.y;

  return outVector.set(tx * c - ty * s + center.x, tx * s + ty * c + center.y);
 }

 /**
  * Midpoint between `a` and `b`.
  *
  * @param a - First endpoint.
  * @param b - Second endpoint.
  * @returns A new {@link Vector2} at the midpoint.
  */
 public static midpoint(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - First endpoint.
  * @param b - Second endpoint.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static midpoint(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static midpoint(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
 }

 /**
  * Vector rejection: the component of `a` **perpendicular** to `b`, i.e. `a − proj_b(a)`.
  *
  * @param a - Vector to decompose.
  * @param b - Axis of projection.
  * @returns A new {@link Vector2} equal to the rejection of `a` from `b`.
  */
 public static reject(a: ReadonlyVector2, b: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Vector to decompose.
  * @param b - Axis of projection.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static reject(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2): Vector2;
 public static reject(
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const denom = Vector2.lengthSq(b);

  if (denom === 0) return outVector.set(a.x, a.y);

  const s = Vector2.dot(a, b) / denom;

  return outVector.set(a.x - b.x * s, a.y - b.y * s);
 }

 /**
  * Box2D‑style cross product **vector × scalar**: `a × s = ( s·a.y, −s·a.x )`.
  *
  * @param a - Source vector.
  * @param s - Scalar factor.
  * @returns A new {@link Vector2} equal to the perpendicular scaled vector.
  */
 public static crossVS(a: ReadonlyVector2, s: number): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param a - Source vector.
  * @param s - Scalar factor.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static crossVS(a: ReadonlyVector2, s: number, outVector: Vector2): Vector2;
 public static crossVS(a: ReadonlyVector2, s: number, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(s * a.y, -s * a.x);
 }

 /**
  * Box2D‑style cross product **scalar × vector**: `s × a = ( −s·a.y, s·a.x )`.
  *
  * @param s - Scalar factor.
  * @param a - Source vector.
  * @returns A new {@link Vector2} equal to the perpendicular scaled vector.
  */
 public static crossSV(s: number, a: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free variant writing into `outVector`.
  *
  * @param s - Scalar factor.
  * @param a - Source vector.
  * @param outVector - Destination vector to receive the result.
  * @returns `outVector`.
  */
 public static crossSV(s: number, a: ReadonlyVector2, outVector: Vector2): Vector2;
 public static crossSV(s: number, a: ReadonlyVector2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(-s * a.y, s * a.x);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Comparison & validation                                         */
 /* ----------------------------------------------------------------------- */

 /**
  * Tests whether `v` is exactly `(0,0)`.
  *
  * @param v - Vector to test.
  * @returns `true` if both components are zero; otherwise `false`.
  */
 public static isZero(v: ReadonlyVector2): boolean {
  return v.x === 0 && v.y === 0;
 }

 /**
  * Tests whether both components are within `epsilon` of `0`.
  *
  * @param v - Vector to test.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if `|x| ≤ epsilon` and `|y| ≤ epsilon`; otherwise `false`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public static nearZero(v: ReadonlyVector2, epsilon = EPSILON): boolean {
  if (epsilon < 0) throw new RangeError('Vector2.nearZero: epsilon must be non-negative');

  return Math.abs(v.x) <= epsilon && Math.abs(v.y) <= epsilon;
 }

 /**
  * Strict component-wise equality.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @returns `true` if components are identical; otherwise `false`.
  */
 public static equals(a: ReadonlyVector2, b: ReadonlyVector2): boolean {
  return a.x === b.x && a.y === b.y;
 }

 /**
  * Approximate component-wise equality with tolerance.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if both component differences are within `epsilon`; otherwise `false`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public static nearEquals(a: ReadonlyVector2, b: ReadonlyVector2, epsilon = EPSILON): boolean {
  if (epsilon < 0) throw new RangeError('Vector2.nearEquals: epsilon must be non-negative');

  return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
 }

 /**
  * Tests whether `| length(v) − 1 | ≤ EPSILON`.
  *
  * @param v - Vector to test.
  * @returns `true` if `v` is unit length; otherwise `false`.
  */
 public static isUnit(v: ReadonlyVector2): boolean {
  return Math.abs(Vector2.length(v) - 1) <= EPSILON;
 }

 /**
  * Tests whether both components are finite numbers.
  *
  * @param v - Vector to test.
  * @returns `true` if `Number.isFinite(x)` and `Number.isFinite(y)`; otherwise `false`.
  */
 public static isFinite(v: ReadonlyVector2): boolean {
  return Number.isFinite(v.x) && Number.isFinite(v.y);
 }

 /**
  * Parallelism test: `|cross(a,b)| ≤ epsilon`.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param epsilon - Tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if vectors are parallel within tolerance; otherwise `false`.
  */
 public static isParallel(a: ReadonlyVector2, b: ReadonlyVector2, epsilon = EPSILON): boolean {
  return Math.abs(Vector2.cross(a, b)) <= Math.max(epsilon, EPSILON);
 }

 /**
  * Perpendicularity test: `|dot(a,b)| ≤ epsilon`.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param epsilon - Tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if vectors are perpendicular within tolerance; otherwise `false`.
  */
 public static isPerpendicular(a: ReadonlyVector2, b: ReadonlyVector2, epsilon = EPSILON): boolean {
  return Math.abs(Vector2.dot(a, b)) <= Math.max(epsilon, EPSILON);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Utilities                                                       */
 /* ----------------------------------------------------------------------- */

 /**
  * Computes a fast, deterministic 32‑bit unsigned hash from the vector components.
  *
  * @param v - Vector to hash.
  * @returns A 32‑bit unsigned integer hash (not cryptographically secure).
  */
 public static hashCode(v: ReadonlyVector2): number {
  const xInt = Math.round(v.x * 1e6) & 0xffff;
  const yInt = Math.round(v.y * 1e6) & 0xffff;

  return ((xInt << 16) | yInt) >>> 0;
 }

 /* ====================================================================== */
 /* Instance                                                                */
 /* ====================================================================== */

 /** X component. */
 public x: number;
 /** Y component. */
 public y: number;

 /* ----------------------------------------------------------------------- */
 /* Constructors                                                            */
 /* ----------------------------------------------------------------------- */

 /** Constructs `(0,0)`. */
 constructor();
 /** Constructs `(x, y)`. */
 constructor(x: number, y: number);
 /** Constructs from tuple `[x, y]`. */
 constructor(array: [number, number]);
 /** Constructs from plain object `{ x, y }`. */
 constructor(object: Vector2Like);
 /** Copy‑constructs from another {@link Vector2}. */
 constructor(vector: Vector2);
 /**
  * General constructor implementation.
  *
  * @param a - Overloaded: number pair, tuple, POJO `{x,y}`, or {@link Vector2}.
  * @param b - Y component when `a` is a number.
  * @throws {RangeError} If the tuple has fewer than two elements.
  * @throws {RangeError} If the POJO form has non‑numeric `x` or `y`.
  * @throws {RangeError} If arguments are invalid for any overload.
  */
 constructor(a?: number | [number, number] | Vector2Like | Vector2, b?: number) {
  if (typeof a === 'number' && typeof b === 'number') {
   this.x = a;
   this.y = b;
  } else if (Array.isArray(a)) {
   if (a.length < 2)
    throw new RangeError('Vector2.constructor: array must have at least two elements');

   this.x = a[0];
   this.y = a[1];
  } else if (a instanceof Vector2) {
   this.x = a.x;
   this.y = a.y;
  } else if (a && typeof a === 'object' && 'x' in a && 'y' in a) {
   const { x, y } = a as { x: unknown; y: unknown };

   if (typeof x !== 'number' || typeof y !== 'number') {
    throw new RangeError('Vector2.constructor: x and y must be numbers');
   }

   this.x = x;
   this.y = y;
  } else if (a === undefined) {
   this.x = 0;
   this.y = 0;
  } else {
   throw new RangeError('Vector2.constructor: invalid constructor arguments for Vector2');
  }
 }

 /* ----------------------------------------------------------------------- */
 /* Component access & swizzles                                             */
 /* ----------------------------------------------------------------------- */

 /**
  * Returns a component by index.
  *
  * @param index - `0` for `x`, `1` for `y`.
  * @returns The selected component value.
  */
 public getComponent(index: 0 | 1): number {
  return index === 1 ? this.y : this.x;
 }

 /**
  * Creates a shallow clone of this vector.
  *
  * @returns A new {@link Vector2} with the same components.
  */
 public clone(): Vector2 {
  return new Vector2(this.x, this.y);
 }

 /**
  * Swizzle `[x, y]` into a fresh {@link Vector2}.
  *
  * @returns A new {@link Vector2} equal to `(x, y)`.
  */
 get xy(): Vector2 {
  return new Vector2(this.x, this.y);
 }

 /**
  * Swizzle `[y, x]` into a fresh {@link Vector2}.
  *
  * @returns A new {@link Vector2} equal to `(y, x)`.
  */
 get yx(): Vector2 {
  return new Vector2(this.y, this.x);
 }

 /**
  * Swizzle `[x, x]` into a fresh {@link Vector2}.
  *
  * @returns A new {@link Vector2} equal to `(x, x)`.
  */
 get xx(): Vector2 {
  return new Vector2(this.x, this.x);
 }

 /**
  * Swizzle `[y, y]` into a fresh {@link Vector2}.
  *
  * @returns A new {@link Vector2} equal to `(y, y)`.
  */
 get yy(): Vector2 {
  return new Vector2(this.y, this.y);
 }

 /* ----------------------------------------------------------------------- */
 /* Basic mutators                                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Assigns both components.
  *
  * @param x - New `x` component.
  * @param y - New `y` component.
  * @returns `this` for chaining.
  */
 public set(x: number, y: number): this {
  this.x = x;
  this.y = y;

  return this;
 }

 /**
  * Assigns a component by index.
  *
  * @param index - `0` for X, `1` for Y.
  * @param value - New value.
  * @returns `this` for chaining.
  */
 public setComponent(index: 0 | 1, value: number): this {
  if (index === 1) this.y = value;
  else this.x = value;

  return this;
 }

 /**
  * Sets `x`.
  *
  * @param x - New `x` value.
  * @returns `this` for chaining.
  */
 public setX(x: number): this {
  this.x = x;

  return this;
 }

 /**
  * Sets `y`.
  *
  * @param y - New `y` value.
  * @returns `this` for chaining.
  */
 public setY(y: number): this {
  this.y = y;

  return this;
 }

 /**
  * Sets both components to the same scalar.
  *
  * @param s - Scalar value assigned to both `x` and `y`.
  * @returns `this` for chaining.
  */
 public setScalar(s: number): this {
  this.x = s;
  this.y = s;

  return this;
 }

 /**
  * Copies from another vector.
  *
  * @param other - Source vector.
  * @returns `this` for chaining.
  */
 public copy(other: ReadonlyVector2): this {
  return this.set(other.x, other.y);
 }

 /**
  * Resets both components to zero.
  *
  * @returns `this` for chaining.
  */
 public zero(): this {
  this.x = 0;
  this.y = 0;

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Arithmetic (instance)                                                   */
 /* ----------------------------------------------------------------------- */

 /**
  * Returns the sum of components `x + y`.
  *
  * @returns The scalar sum of components.
  */
 public sumComponents(): number {
  return this.x + this.y;
 }

 /**
  * Adds `v` component‑wise to `this`.
  *
  * @param v - Vector to add.
  * @returns `this` for chaining.
  */
 public add(v: ReadonlyVector2): this {
  this.x += v.x;
  this.y += v.y;

  return this;
 }

 /**
  * Adds scalar `s` to both components.
  *
  * @param s - Scalar to add.
  * @returns `this` for chaining.
  */
 public addScalar(s: number): this {
  this.x += s;
  this.y += s;

  return this;
 }

 /**
  * Subtracts `v` component‑wise from `this`.
  *
  * @param v - Vector to subtract.
  * @returns `this` for chaining.
  */
 public sub(v: ReadonlyVector2): this {
  this.x -= v.x;
  this.y -= v.y;

  return this;
 }

 /**
  * Subtracts scalar `s` from both components.
  *
  * @param s - Scalar to subtract.
  * @returns `this` for chaining.
  */
 public subScalar(s: number): this {
  this.x -= s;
  this.y -= s;

  return this;
 }

 /**
  * Multiplies `this` by `v` component‑wise.
  *
  * @param v - Vector multiplier.
  * @returns `this` for chaining.
  */
 public multiply(v: ReadonlyVector2): this {
  this.x *= v.x;
  this.y *= v.y;

  return this;
 }

 /**
  * Scales `this` by scalar `s`.
  *
  * @param s - Scale factor.
  * @returns `this` for chaining.
  */
 public multiplyScalar(s: number): this {
  this.x *= s;
  this.y *= s;

  return this;
 }

 /**
  * Component-wise division by `v`.
  *
  * @param v - Divisor vector.
  * @returns `this` for chaining.
  * @throws {RangeError} If any component of `v` is zero.
  */
 public divide(v: ReadonlyVector2): this {
  if (v.x === 0 || v.y === 0)
   throw new RangeError('Vector2.divide: divisor components must be non-zero');

  this.x /= v.x;
  this.y /= v.y;

  return this;
 }

 /**
  * Scalar division `this /= s`.
  *
  * @param s - Non‑zero scalar divisor.
  * @returns `this` for chaining.
  * @throws {RangeError} If `s === 0`.
  */
 public divideScalar(s: number): this {
  if (s === 0) throw new RangeError('Vector2.divideScalar: divisor must be non-zero');

  this.x /= s;
  this.y /= s;

  return this;
 }

 /**
  * Safe component-wise division (|divisor| ≤ EPSILON → component becomes `0`).
  *
  * @param v - Divisor vector.
  * @returns `this` for chaining.
  */
 public divideSafe(v: ReadonlyVector2): this {
  this.x = Math.abs(v.x) <= EPSILON ? 0 : this.x / v.x;
  this.y = Math.abs(v.y) <= EPSILON ? 0 : this.y / v.y;

  return this;
 }

 /**
  * Safe scalar division (|`s`| ≤ EPSILON → `(0,0)`).
  *
  * @param s - Scalar divisor.
  * @returns `this` for chaining.
  */
 public divideScalarSafe(s: number): this {
  if (Math.abs(s) <= EPSILON) return this.zero();

  this.x /= s;
  this.y /= s;

  return this;
 }

 /**
  * Component-wise remainder.
  *
  * @param v - Divisor vector (non-zero components).
  * @returns `this` for chaining.
  * @throws {RangeError} If any component of `v` is zero.
  */
 public mod(v: ReadonlyVector2): this {
  if (v.x === 0 || v.y === 0)
   throw new RangeError('Vector2.mod: divisor components must be non-zero');

  this.x %= v.x;
  this.y %= v.y;

  return this;
 }

 /**
  * Scalar remainder.
  *
  * @param s - Non‑zero scalar divisor.
  * @returns `this` for chaining.
  * @throws {RangeError} If `s === 0`.
  */
 public modScalar(s: number): this {
  if (s === 0) throw new RangeError('Vector2.modScalar: divisor must be non-zero');

  this.x %= s;
  this.y %= s;

  return this;
 }

 /**
  * Negates both components in place.
  *
  * @returns `this` for chaining.
  */
 public negate(): this {
  this.x = -this.x;
  this.y = -this.y;

  return this;
 }

 /**
  * Negated copy of this vector.
  *
  * @returns A new {@link Vector2} equal to `(-x, -y)`.
  */
 public get negated(): Vector2 {
  return new Vector2(-this.x, -this.y);
 }

 /**
  * Adds a scaled vector: `this += scale * v`.
  *
  * @param v - Vector to scale and add.
  * @param scale - Scale factor.
  * @returns `this` for chaining.
  */
 public addScaledVector(v: ReadonlyVector2, scale: number): this {
  this.x += v.x * scale;
  this.y += v.y * scale;

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Interpolation (instance)                                                */
 /* ----------------------------------------------------------------------- */

 /**
  * Linear interpolation towards `end` by factor `t` (no clamping).
  *
  * @param end - Target vector.
  * @param t - Interpolation factor.
  * @returns `this` for chaining.
  */
 public lerp(end: ReadonlyVector2, t: number): this {
  this.x += (end.x - this.x) * t;
  this.y += (end.y - this.y) * t;

  return this;
 }

 /**
  * Linear interpolation with `t` clamped to `[0, 1]`.
  *
  * @param end - Target vector.
  * @param t - Interpolation factor.
  * @returns `this` for chaining.
  */
 public lerpClamped(end: ReadonlyVector2, t: number): this {
  if (t <= 0) return this;
  if (t >= 1) return this.copy(end);

  return this.lerp(end, t);
 }

 /* ----------------------------------------------------------------------- */
 /* Measures & geometry (instance)                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Dot product with `v`.
  *
  * @param v - Second operand.
  * @returns The scalar dot product.
  */
 public dot(v: ReadonlyVector2): number {
  return this.x * v.x + this.y * v.y;
 }

 /**
  * 2‑D scalar cross product with `v`.
  *
  * @param v - Second operand.
  * @returns The scalar cross product.
  */
 public cross(v: ReadonlyVector2): number {
  return this.x * v.y - this.y * v.x;
 }

 /**
  * Twice the signed area of triangle `(this, b, c)`.
  *
  * @param b - Second vertex.
  * @param c - Third vertex.
  * @returns Twice the signed area.
  */
 public cross3(b: ReadonlyVector2, c: ReadonlyVector2): number {
  return (b.x - this.x) * (c.y - this.y) - (b.y - this.y) * (c.x - this.x);
 }

 /**
  * Euclidean length `||this||`.
  *
  * @returns The Euclidean norm of this vector.
  */
 public length(): number {
  return Math.hypot(this.x, this.y);
 }

 /**
  * Squared length `||this||²`.
  *
  * @returns The squared length of this vector.
  */
 public lengthSq(): number {
  return this.x * this.x + this.y * this.y;
 }

 /**
  * Manhattan length.
  *
  * @returns `|x| + |y|`.
  */
 public manhattanLength(): number {
  return Math.abs(this.x) + Math.abs(this.y);
 }

 /**
  * Euclidean distance to `v`.
  *
  * @param v - Target vector.
  * @returns The Euclidean distance.
  */
 public distanceTo(v: ReadonlyVector2): number {
  return Math.hypot(this.x - v.x, this.y - v.y);
 }

 /**
  * Squared Euclidean distance to `v`.
  *
  * @param v - Target vector.
  * @returns The squared distance.
  */
 public distanceToSq(v: ReadonlyVector2): number {
  const dx = this.x - v.x,
   dy = this.y - v.y;

  return dx * dx + dy * dy;
 }

 /**
  * Manhattan distance to `v`.
  *
  * @param v - Target vector.
  * @returns The Manhattan distance.
  */
 public manhattanDistanceTo(v: ReadonlyVector2): number {
  return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
 }

 /* ----------------------------------------------------------------------- */
 /* Direction & angles (instance)                                           */
 /* ----------------------------------------------------------------------- */

 /**
  * Unit direction from `this` to `target`. Returns `(0,0)` if coincident.
  *
  * @param target - Vector to point toward.
  * @returns A new {@link Vector2} representing the unit direction.
  */
 public directionTo(target: ReadonlyVector2): Vector2 {
  const dx = target.x - this.x;
  const dy = target.y - this.y;

  const length = Math.hypot(dx, dy);

  return length === 0 ? new Vector2(0, 0) : new Vector2(dx / length, dy / length);
 }

 /**
  * Heading (angle) in radians ∈ `[−π, π]`.
  *
  * @returns Angle in radians from the +X axis.
  */
 public angle(): number {
  return Math.atan2(this.y, this.x);
 }

 /**
  * Signed angle to `v` (positive if `v` is CCW).
  *
  * @param v - Target vector.
  * @returns The signed angle in radians.
  */
 public angleTo(v: ReadonlyVector2): number {
  return Math.atan2(this.cross(v), this.dot(v));
 }

 /**
  * Smallest unsigned angle to `v` with numerical clamping.
  *
  * @param v - Target vector.
  * @returns The unsigned angle in radians.
  */
 public angleBetween(v: ReadonlyVector2): number {
  const product = this.length() * v.length();

  if (product === 0) return 0;

  const cosA = clampNumber(this.dot(v) / product, -1, 1);

  return Math.acos(cosA);
 }

 /* ----------------------------------------------------------------------- */
 /* Numeric transforms (instance)                                           */
 /* ----------------------------------------------------------------------- */

 /**
  * Applies {@link Math.floor} to both components.
  *
  * @returns `this` for chaining.
  */
 public floor(): this {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);

  return this;
 }

 /**
  * Applies {@link Math.ceil} to both components.
  *
  * @returns `this` for chaining.
  */
 public ceil(): this {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);

  return this;
 }

 /**
  * Applies {@link Math.round} to both components.
  *
  * @returns `this` for chaining.
  */
 public round(): this {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);

  return this;
 }

 /**
  * Applies {@link Math.abs} to both components.
  *
  * @returns `this` for chaining.
  */
 public abs(): this {
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);

  return this;
 }

 /**
  * Absolute-value copy of this vector.
  *
  * @returns A new {@link Vector2} with absolute components.
  */
 public get absolute(): Vector2 {
  return new Vector2(Math.abs(this.x), Math.abs(this.y));
 }

 /**
  * Component-wise reciprocal.
  *
  * @returns `this` for chaining.
  * @throws {RangeError} If any component is zero.
  */
 public inverse(): this {
  if (this.x === 0 || this.y === 0)
   throw new RangeError('Vector2.inverse: cannot invert vector with zero component');

  this.x = 1 / this.x;
  this.y = 1 / this.y;

  return this;
 }

 /**
  * Safe reciprocal (|component| ≤ EPSILON → `0`).
  *
  * @returns `this` for chaining.
  */
 public inverseSafe(): this {
  this.x = Math.abs(this.x) <= EPSILON ? 0 : 1 / this.x;
  this.y = Math.abs(this.y) <= EPSILON ? 0 : 1 / this.y;

  return this;
 }

 /**
  * Swaps `x` and `y`.
  *
  * @returns `this` for chaining.
  */
 public swap(): this {
  const t = this.x;

  this.x = this.y;
  this.y = t;

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Constraints (instance)                                                  */
 /* ----------------------------------------------------------------------- */

 /**
  * Clamps each component between corresponding `min` and `max`.
  *
  * @param min - Minimum per component.
  * @param max - Maximum per component.
  * @returns `this` for chaining.
  */
 public clamp(min: ReadonlyVector2, max: ReadonlyVector2): this {
  this.x = Math.min(Math.max(this.x, min.x), max.x);
  this.y = Math.min(Math.max(this.y, min.y), max.y);

  return this;
 }

 /**
  * Clamps both components between scalar `min` and `max`.
  *
  * @param min - Minimum scalar.
  * @param max - Maximum scalar.
  * @returns `this` for chaining.
  */
 public clampScalar(min: number, max: number): this {
  this.x = Math.min(Math.max(this.x, min), max);
  this.y = Math.min(Math.max(this.y, min), max);

  return this;
 }

 /**
  * Clamps the length to `[minLength, maxLength]` using a single square root.
  *
  * @param minLength - Minimum magnitude (≥ 0).
  * @param maxLength - Maximum magnitude.
  * @returns `this` for chaining.
  */
 public clampLength(minLength: number, maxLength: number): this {
  const lsq = this.lengthSq();

  if (lsq === 0) return this;

  const l = Math.sqrt(lsq);

  if (l < minLength) {
   const s = minLength / l;

   this.x *= s;
   this.y *= s;
  } else if (l > maxLength) {
   const s = maxLength / l;

   this.x *= s;
   this.y *= s;
  }

  return this;
 }

 /**
  * Limits the length to `maxLength`.
  *
  * @param maxLength - Maximum allowed magnitude (≥ 0).
  * @returns `this` for chaining.
  */
 public limit(maxLength: number): this {
  const lsq = this.lengthSq();

  if (lsq > maxLength * maxLength) {
   const s = maxLength / Math.sqrt(lsq);

   this.x *= s;
   this.y *= s;
  }

  return this;
 }

 /**
  * Component-wise minimum with `v`.
  *
  * @param v - Other vector.
  * @returns `this` for chaining.
  */
 public min(v: ReadonlyVector2): this {
  this.x = Math.min(this.x, v.x);
  this.y = Math.min(this.y, v.y);

  return this;
 }

 /**
  * Component-wise maximum with `v`.
  *
  * @param v - Other vector.
  * @returns `this` for chaining.
  */
 public max(v: ReadonlyVector2): this {
  this.x = Math.max(this.x, v.x);
  this.y = Math.max(this.y, v.y);

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Vector transforms (instance)                                            */
 /* ----------------------------------------------------------------------- */

 /**
  * Normalizes this vector to unit length.
  *
  * @returns `this` for chaining.
  * @throws {RangeError} If this vector has zero length.
  */
 public normalize(): this {
  const length = this.length();

  if (length === 0) throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');

  this.x /= length;
  this.y /= length;

  return this;
 }

 /**
  * Safe normalization. If zero length, becomes `(0,0)`.
  *
  * @returns `this` for chaining.
  */
 public normalizeSafe(): this {
  const length = this.length();

  if (length === 0) {
   this.x = 0;
   this.y = 0;

   return this;
  }

  this.x /= length;
  this.y /= length;

  return this;
 }

 /**
  * Unit-length copy of this vector (or `(0,0)` if zero).
  *
  * @returns A new unit {@link Vector2}.
  */
 public get normalized(): Vector2 {
  const length = this.length();

  return length === 0 ? new Vector2(0, 0) : new Vector2(this.x / length, this.y / length);
 }

 /**
  * Sets this vector’s length (throws if negative or zero length).
  *
  * @param newLength - Desired magnitude (≥ 0).
  * @returns `this` for chaining.
  * @throws {RangeError} If `newLength < 0` or this vector is zero-length.
  */
 public setLength(newLength: number): this {
  if (newLength < 0) throw new RangeError('Vector2.setLength: length must be non-negative');

  const length = this.length();

  if (length === 0)
   throw new RangeError('Vector2.setLength: cannot set length on zero-length vector');

  const s = newLength / length;

  this.x *= s;
  this.y *= s;

  return this;
 }

 /**
  * Safe setLength. Negative `newLength` is clamped to `0`. Zero vectors become `(newLength, 0)`.
  *
  * @param newLength - Desired magnitude (non‑negative).
  * @returns `this` for chaining.
  */
 public setLengthSafe(newLength: number): this {
  const nn = newLength < 0 ? 0 : newLength;
  const length = this.length();

  if (length === 0) {
   this.x = nn;
   this.y = 0;

   return this;
  }

  const s = nn / length;

  this.x *= s;
  this.y *= s;

  return this;
 }

 /**
  * Sets heading (angle) while preserving length.
  *
  * @param angle - New heading in radians.
  * @returns `this` for chaining.
  */
 public setHeading(angle: number): this {
  const length = this.length();

  this.x = Math.cos(angle) * length;
  this.y = Math.sin(angle) * length;

  return this;
 }

 /**
  * Projects this vector onto `axis`. If `axis` is zero, sets `(0,0)`.
  *
  * @param axis - Projection axis.
  * @returns `this` for chaining.
  */
 public project(axis: ReadonlyVector2): this {
  const denom = axis.x * axis.x + axis.y * axis.y;

  if (denom === 0) return this.zero();

  const s = this.dot(axis) / denom;

  return this.set(axis.x * s, axis.y * s);
 }

 /**
  * Safe projection (axis near zero → sets `(0,0)`).
  *
  * @param axis - Projection axis.
  * @returns `this` for chaining.
  */
 public projectSafe(axis: ReadonlyVector2): this {
  const denom = axis.x * axis.x + axis.y * axis.y;

  if (denom <= EPSILON) return this.zero();

  const s = this.dot(axis) / denom;

  return this.set(axis.x * s, axis.y * s);
 }

 /**
  * Projects this vector onto a **unit** axis.
  *
  * @param unitAxis - Unit-length axis of projection.
  * @returns `this` for chaining.
  */
 public projectOnUnit(unitAxis: ReadonlyVector2): this {
  const s = this.dot(unitAxis);

  return this.set(unitAxis.x * s, unitAxis.y * s);
 }

 /**
  * Reflects this vector about a **unit** normal.
  *
  * @param unitNormal - Unit-length normal to reflect about.
  * @returns `this` for chaining.
  */
 public reflect(unitNormal: ReadonlyVector2): this {
  const dt2 = 2 * this.dot(unitNormal);

  this.x -= dt2 * unitNormal.x;
  this.y -= dt2 * unitNormal.y;

  return this;
 }

 /**
  * Safe reflection (normal is normalized internally; near‑zero normal → no‑op).
  *
  * @param normal - Normal (need not be unitary).
  * @returns `this` for chaining.
  */
 public reflectSafe(normal: ReadonlyVector2): this {
  const length2 = normal.x * normal.x + normal.y * normal.y;

  if (length2 <= EPSILON) return this;

  const inv = 1 / Math.sqrt(length2);

  const nx = normal.x * inv,
   ny = normal.y * inv;

  const dt2 = 2 * (this.x * nx + this.y * ny);

  this.x -= dt2 * nx;
  this.y -= dt2 * ny;

  return this;
 }

 /**
  * Rotates this vector by ±90° while keeping its magnitude.
  *
  * @param clockwise - `true` for CW; `false` for CCW. @defaultValue `false`
  * @returns `this` for chaining.
  */
 public perpendicular(clockwise = false): this {
  const { x, y } = this;

  if (clockwise) {
   this.x = y;
   this.y = -x;
  } else {
   this.x = -y;
   this.y = x;
  }

  return this;
 }

 /**
  * Rotates this vector by ±90° and normalizes it to unit length.
  *
  * @param clockwise - `true` for CW; `false` for CCW. @defaultValue `false`
  * @returns `this` for chaining.
  * @throws {RangeError} If this vector has zero length.
  */
 public unitPerpendicular(clockwise = false): this {
  if (this.isZero()) {
   throw new RangeError(
    'Vector2.unitPerpendicular: cannot compute unit perpendicular of a zero-length vector',
   );
  }

  return this.perpendicular(clockwise).normalize();
 }

 /**
  * Safe unit perpendicular (zero vectors become `(-1,0)` or `(1,0)` depending on `clockwise`).
  *
  * @param clockwise - `true` for CW; `false` for CCW. @defaultValue `false`
  * @returns `this` for chaining.
  */
 public unitPerpendicularSafe(clockwise = false): this {
  if (this.isZero()) {
   this.x = clockwise ? 1 : -1;
   this.y = 0;

   return this;
  }

  return this.unitPerpendicular(clockwise);
 }

 /**
  * Rotates this vector by `angle` radians.
  *
  * @param angle - Rotation angle in radians.
  * @returns `this` for chaining.
  */
 public rotate(angle: number): this {
  const c = Math.cos(angle),
   s = Math.sin(angle);

  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;

  this.x = rx;
  this.y = ry;

  return this;
 }

 /**
  * Rotates this vector using precomputed `cos`/`sin`.
  *
  * @param c - Cosine of the angle.
  * @param s - Sine of the angle.
  * @returns `this` for chaining.
  */
 public rotateCS(c: number, s: number): this {
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;

  this.x = rx;
  this.y = ry;

  return this;
 }

 /**
  * Rotates this vector around `center` by `angle`.
  *
  * @param center - Center of rotation.
  * @param angle - Rotation angle in radians.
  * @returns `this` for chaining.
  */
 public rotateAround(center: ReadonlyVector2, angle: number): this {
  return this.sub(center).rotate(angle).add(center);
 }

 /**
  * Rotates this vector around `center` using precomputed `cos`/`sin`.
  *
  * @param center - Center of rotation.
  * @param c - Cosine of the angle.
  * @param s - Sine of the angle.
  * @returns `this` for chaining.
  */
 public rotateAroundCS(center: ReadonlyVector2, c: number, s: number): this {
  return this.sub(center).rotateCS(c, s).add(center);
 }

 /**
  * Sets this vector to the midpoint between itself and `v`.
  *
  * @param v - The other vector.
  * @returns `this` for chaining.
  */
 public midpoint(v: ReadonlyVector2): this {
  this.x = (this.x + v.x) * 0.5;
  this.y = (this.y + v.y) * 0.5;

  return this;
 }

 /**
  * Replaces this vector by its rejection from `onto`: `this -= proj_onto(this)`.
  *
  * @param onto - Axis of projection.
  * @returns `this` for chaining.
  */
 public reject(onto: ReadonlyVector2): this {
  const denom = onto.x * onto.x + onto.y * onto.y;

  if (denom === 0) return this;

  const s = this.dot(onto) / denom;

  this.x -= onto.x * s;
  this.y -= onto.y * s;

  return this;
 }

 /**
  * Box2D‑style cross product **vector × scalar** on `this`: `this = ( s·y, −s·x )`.
  *
  * @param s - Scalar factor.
  * @returns `this` for chaining.
  */
 public crossScalarRight(s: number): this {
  const { x, y } = this;

  this.x = s * y;
  this.y = -s * x;

  return this;
 }

 /**
  * Box2D‑style cross product **scalar × vector** on `this`: `this = ( −s·y, s·x )`.
  *
  * @param s - Scalar factor.
  * @returns `this` for chaining.
  */
 public crossScalarLeft(s: number): this {
  const { x, y } = this;

  this.x = -s * y;
  this.y = s * x;

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Comparison & validation (instance)                                      */
 /* ----------------------------------------------------------------------- */

 /**
  * Tests whether this vector is exactly `(0,0)`.
  *
  * @returns `true` if `x === 0` and `y === 0`; otherwise `false`.
  */
 public isZero(): boolean {
  return this.x === 0 && this.y === 0;
 }

 /**
  * Tests whether both components are within `epsilon` of `0`.
  *
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if both components are within tolerance; otherwise `false`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public nearZero(epsilon = EPSILON): boolean {
  if (epsilon < 0) throw new RangeError('Vector2.nearZero: epsilon must be non-negative');

  return Math.abs(this.x) <= epsilon && Math.abs(this.y) <= epsilon;
 }

 /**
  * Strict component-wise equality with `v`.
  *
  * @param v - Vector to compare.
  * @returns `true` if components are identical; otherwise `false`.
  */
 public equals(v: ReadonlyVector2): boolean {
  return this.x === v.x && this.y === v.y;
 }

 /**
  * Approximate component-wise equality with tolerance.
  *
  * @param v - Vector to compare.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if both component differences are within `epsilon`; otherwise `false`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public nearEquals(v: ReadonlyVector2, epsilon: number = EPSILON): boolean {
  if (epsilon < 0) throw new RangeError('Vector2.nearEquals: epsilon must be non-negative');

  return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
 }

 /**
  * Tests whether this vector has unit length within `EPSILON`.
  *
  * @returns `true` if `|length() − 1| ≤ EPSILON`; otherwise `false`.
  */
 public isUnit(): boolean {
  return Math.abs(this.length() - 1) <= EPSILON;
 }

 /**
  * Tests whether both components are finite numbers.
  *
  * @returns `true` if both components are finite; otherwise `false`.
  */
 public isFinite(): boolean {
  return Number.isFinite(this.x) && Number.isFinite(this.y);
 }

 /**
  * Parallelism test against `v` using `epsilon` tolerance.
  *
  * @param v - Vector to compare.
  * @param epsilon - Tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if vectors are parallel within tolerance; otherwise `false`.
  */
 public isParallelTo(v: ReadonlyVector2, epsilon = EPSILON): boolean {
  return Math.abs(this.cross(v)) <= Math.max(epsilon, EPSILON);
 }

 /**
  * Perpendicularity test against `v` using `epsilon` tolerance.
  *
  * @param v - Vector to compare.
  * @param epsilon - Tolerance. @defaultValue {@link EPSILON}
  * @returns `true` if vectors are perpendicular within tolerance; otherwise `false`.
  */
 public isPerpendicularTo(v: ReadonlyVector2, epsilon = EPSILON): boolean {
  return Math.abs(this.dot(v)) <= Math.max(epsilon, EPSILON);
 }

 /* ----------------------------------------------------------------------- */
 /* Conversion & representation                                             */
 /* ----------------------------------------------------------------------- */

 /**
  * Returns a plain object for JSON serialization.
  *
  * @returns An object literal `{ x, y }`.
  */
 public toJSON(): { x: number; y: number } {
  return { x: this.x, y: this.y };
 }

 /**
  * Alias for {@link toJSON} with explicit semantics.
  *
  * @returns An object literal `{ x, y }`.
  */
 public toObject(): { x: number; y: number } {
  return this.toJSON();
 }

 /**
  * Writes this vector’s components into an array or typed array.
  *
  * @typeParam T - `number[]` or `Float32Array`.
  * @param outArray - Destination array. @defaultValue a new `number[]`
  * @param offset - Index at which to write `x` and `y`. @defaultValue `0`
  * @returns The `outArray` reference for chaining.
  *
  * @example
  * ```ts
  * const v = new Vector2(5, 7);
  * const arr = v.toArray();           // [5, 7]
  * const buf = new Float32Array(4);
  * v.toArray(buf, 2);                  // buf = [0, 0, 5, 7]
  * ```
  */
 public toArray<T extends number[] | Float32Array>(
  outArray: T = [] as unknown as T,
  offset = 0,
 ): T {
  (outArray as any)[offset] = this.x;
  (outArray as any)[offset + 1] = this.y;

  return outArray;
 }

 /**
  * Enables array destructuring: `[...vector] → [x, y]`.
  *
  * @returns An iterator yielding `x` then `y`.
  *
  * @example
  * ```ts
  * const v = new Vector2(3, 4);
  * const [x, y] = [...v]; // x=3, y=4
  * ```
  */
 *[Symbol.iterator](): IterableIterator<number> {
  yield this.x;
  yield this.y;
 }

 /**
  * Returns a string representation `"x,y"`.
  *
  * @param precision - Optional number of decimal places for each component.
  * @returns The formatted string.
  */
 public toString(precision?: number): string {
  return precision != null
   ? `${this.x.toFixed(precision)},${this.y.toFixed(precision)}`
   : `${this.x},${this.y}`;
 }

 /* ----------------------------------------------------------------------- */
 /* Utilities (instance)                                                    */
 /* ----------------------------------------------------------------------- */

 /**
  * Computes a fast 32‑bit unsigned hash of this vector’s components.
  *
  * @returns A 32‑bit unsigned integer hash (not cryptographically secure).
  */
 public hashCode(): number {
  return Vector2.hashCode(this);
 }
}
