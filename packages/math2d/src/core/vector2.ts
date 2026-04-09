/**
 * @file core/vector2.ts
 * @module @lenguados/math2d/core
 * @description Two-dimensional vector implementation
 *
 * @remarks
 * **Angle & rotation conventions**
 * - Angles are in radians, measured from the +X axis with **counter-clockwise (CCW)** positive.
 * - Vectors are treated as column vectors; rotations use the standard matrix:
 *   ```
 *   [ cosθ  −sinθ ]
 *   [ sinθ   cosθ ]
 *   ```
 *
 * **Design principles**
 * - Instance methods mutate `this` for fluent chaining.
 * - Static methods are pure and accept an optional `out` parameter to avoid allocations.
 * - Trigonometric and square-root operations delegate to deterministic kernels.
 * - All operations use auxiliary modules to maintain DRY principle.
 */

import { angleFromVectors, sinCos } from '../auxiliary/angle/operations';
import { acosSafe, divideSafe } from '../auxiliary/numeric/safety';
import {
 clamp,
 mod as scalarModule,
 saturate,
 sign as scalarSign,
 step as scalarStep,
} from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 nearEquals as scalarNearEquals,
 relativeEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON, SQRT_HALF } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import { atan2, hypot, sin } from '../deterministic/deterministic-kernels';
import type {
 ReadonlyComplexLike,
 ReadonlyMatrix2Like,
 ReadonlyMatrix3Like,
 ReadonlyRotation2Like,
 ReadonlyTransform2Like,
 ReadonlyVector2Like,
 Vector2Like,
} from '../types';
import { assert, assertFinite } from '../validation/assert';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Vector2} instance.
 *
 * @category Types
 * @since 0.6.0
 * @public
 */
export type ReadonlyVector2 = Readonly<Vector2>;

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Vector2} instance so it can no longer be mutated.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `x` or `y` throws a TypeError.
 *
 * @param vector - The Vector2 object to freeze
 * @returns The same instance, now typed as ReadonlyVector2
 *
 * @example
 * ```typescript
 * const ORIGIN = freezeVector2(new Vector2(0, 0));
 * ORIGIN.x = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.6.0
 */
export function freezeVector2(vector: Vector2): ReadonlyVector2 {
 return Object.freeze(vector);
}

export { isVector2Like } from '../types';

/* ========================================================================== */
/* Class: Vector2                                                             */
/* ========================================================================== */

/**
 * Mutable, chainable two-dimensional vector with comprehensive operations for
 * arithmetic, geometry, transforms, comparisons and conversions.
 *
 * @remarks
 * - **Design:** Instance methods are mutable and chainable; static methods are pure
 *   with alloc-free overloads via `out` parameter.
 * - **Numerics:** Uses deterministic kernels for cross-platform reproducibility.
 * - **Safety:** "Safe" variants avoid throwing on degeneracies.
 *
 * @example
 * ```typescript
 * // Static (pure, allocation-controlled)
 * const sum = Vector2.add(a, b);
 * Vector2.add(a, b, existingVector); // Reuse allocation
 *
 * // Instance (mutable, chainable)
 * velocity.add(acceleration).multiplyScalar(dt);
 * ```
 *
 * @category Core
 * @since 0.6.0
 */
export class Vector2 implements Vector2Like {
 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Vector2): Vector2 {
  return out ?? new Vector2();
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * The zero/origin vector `(0, 0)`.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly ZERO = freezeVector2(new Vector2(0, 0));

 /**
  * Number of elements when serialized to an array.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 2;

 /**
  * The all-ones vector `(1, 1)`.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly ONE = freezeVector2(new Vector2(1, 1));

 /**
  * The all-negative-ones vector `(-1, -1)`.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly NEGATIVE_ONE = freezeVector2(new Vector2(-1, -1));

 /**
  * Unit vector along +X `(1, 0)`.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly UNIT_X = freezeVector2(new Vector2(1, 0));

 /**
  * Unit vector along +Y `(0, 1)`.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly UNIT_Y = freezeVector2(new Vector2(0, 1));

 /**
  * Unit vector along -X `(-1, 0)`.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly NEGATIVE_UNIT_X = freezeVector2(new Vector2(-1, 0));

 /**
  * Unit vector along -Y `(0, -1)`.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly NEGATIVE_UNIT_Y = freezeVector2(new Vector2(0, -1));

 /**
  * 45° diagonal unit `(1/√2, 1/√2)` - direction from origin at 45° from +X.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly UNIT_DIAGONAL = freezeVector2(new Vector2(SQRT_HALF, SQRT_HALF));

 /**
  * 225° diagonal unit `(-1/√2, -1/√2)` - direction from origin at 225° from +X.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly NEGATIVE_UNIT_DIAGONAL = freezeVector2(new Vector2(-SQRT_HALF, -SQRT_HALF));

 /**
  * The `(+∞, +∞)` vector.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly POSITIVE_INFINITY = freezeVector2(
  new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
 );

 /**
  * The `(-∞, -∞)` vector.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly NEGATIVE_INFINITY = freezeVector2(
  new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
 );

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a vector from explicit components.
  *
  * @param x - X component
  * @param y - Y component
  * @param out - Optional output vector
  * @returns A Vector2 with components `(x, y)`
  *
  * @example
  * ```typescript
  * Vector2.fromValues(3, 4);           // → (3, 4)
  * const out = new Vector2();
  * Vector2.fromValues(3, 4, out);      // reuses `out` → (3, 4)
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromValues(x: number, y: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(x, y);
 }

 /**
  * Creates a deep copy of a vector.
  *
  * @param source - Vector to clone
  * @param out - Optional output vector
  * @returns A Vector2 with identical components
  *
  * @example
  * ```typescript
  * const v = Vector2.fromValues(1, 2);
  * const w = Vector2.clone(v);         // → (1, 2), new instance
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static clone(source: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(source.x, source.y);
 }

 /**
  * Copies component values from source into destination (alloc-free).
  *
  * @param source - Source vector
  * @param destination - Target vector to receive the copy
  * @returns The destination vector
  *
  * @example
  * ```typescript
  * const src = Vector2.fromValues(5, 10);
  * const dst = new Vector2();
  * Vector2.copy(src, dst);             // dst → (5, 10)
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static copy(source: ReadonlyVector2Like, destination: Vector2): Vector2 {
  return destination.set(source.x, source.y);
 }

 /**
  * Creates a vector from polar coordinates.
  *
  * @param angle - Angle in radians (from +X, CCW positive)
  * @param radius - Magnitude. @defaultValue `1`
  * @param out - Optional output vector
  * @returns A Vector2 positioned at the given angle and radius
  *
  * @example
  * ```typescript
  * Vector2.fromAngle(Math.PI / 2, 2); // → (0, 2)
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromAngle(angle: number, radius = 1, out?: Vector2): Vector2 {
  assertFinite(angle, 'Vector2.fromAngle:angle');
  assertFinite(radius, 'Vector2.fromAngle:radius');
  const { cos, sin } = sinCos(angle);
  return this.ensureOut(out).set(cos * radius, sin * radius);
 }

 /**
  * Creates a vector from a plain object `{ x, y }`.
  *
  * @param object - Plain object with numeric x and y
  * @param out - Optional output vector
  * @returns A Vector2 with the object's components
  *
  * @example
  * ```typescript
  * Vector2.fromObject({ x: 7, y: -3 });  // → (7, -3)
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromObject(object: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(object.x, object.y);
 }

 /**
  * Creates a vector from a flat numeric array.
  *
  * @param array - Numeric array with at least two elements
  * @param offset - Index of the x component. @defaultValue `0`
  * @param out - Optional output vector
  * @returns A Vector2 initialized from the array
  * @throws {RangeError} If offset is out of bounds
  *
  * @example
  * ```typescript
  * Vector2.fromArray([10, 20, 30]);    // → (10, 20)
  * Vector2.fromArray([10, 20, 30], 1); // → (20, 30)
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Vector2): Vector2 {
  if (offset < 0 || offset + Vector2.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Vector2.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  return this.ensureOut(out).set(array[offset]!, array[offset + 1]!);
 }

 /**
  * Creates a vector from a complex number.
  *
  * @remarks
  * Uses interface for loose coupling with Complex class.
  *
  * @param complex - Complex number with real and imag components
  * @param out - Optional output vector
  * @returns Vector with x=real, y=imag
  *
  * @example
  * ```typescript
  * Vector2.fromComplex({ real: 3, imag: 4 }); // → (3, 4)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromComplex(complex: ReadonlyComplexLike, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(complex.real, complex.imag);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Computes the sum of components `x + y`.
  *
  * @remarks
  * A fundamental scalar reduction used as a building block for Manhattan norms,
  * barycentric coordinate validation, diagonal matrix traces, and divergence
  * approximations. Retained as a core primitive for downstream consumers.
  *
  * @param vector - Vector to read
  * @returns The scalar sum `vector.x + vector.y`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static sumComponents(vector: ReadonlyVector2Like): number {
  return vector.x + vector.y;
 }

 /**
  * Component-wise addition `a + b`.
  *
  * @param a - First addend
  * @param b - Second addend
  * @param out - Optional output vector
  * @returns Vector equal to `(a.x + b.x, a.y + b.y)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(a.x + b.x, a.y + b.y);
 }

 /**
  * Adds a scalar to both components `v + s`.
  *
  * @param v - Source vector
  * @param s - Scalar addend
  * @param out - Optional output vector
  * @returns Vector equal to `(v.x + s, v.y + s)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static addScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x + s, v.y + s);
 }

 /**
  * Component-wise subtraction `a - b`.
  *
  * @param a - Minuend
  * @param b - Subtrahend
  * @param out - Optional output vector
  * @returns Vector equal to `(a.x - b.x, a.y - b.y)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static subtract(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(a.x - b.x, a.y - b.y);
 }

 /**
  * Subtracts a scalar from both components `v - s`.
  *
  * @param v - Source vector
  * @param s - Scalar to subtract
  * @param out - Optional output vector
  * @returns Vector equal to `(v.x - s, v.y - s)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static subtractScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x - s, v.y - s);
 }

 /**
  * Component-wise multiplication `a * b` (Hadamard product).
  *
  * @param a - First factor
  * @param b - Second factor
  * @param out - Optional output vector
  * @returns Vector equal to `(a.x * b.x, a.y * b.y)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static multiply(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(a.x * b.x, a.y * b.y);
 }

 /**
  * Multiplies all vector components by a scalar `v * s`.
  *
  * @param v - Input vector
  * @param s - Scalar multiplier
  * @param out - Optional output vector
  * @returns Vector equal to `(v.x * s, v.y * s)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static multiplyScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x * s, v.y * s);
 }

 /**
  * Component-wise division `a / b` (strict).
  *
  * @param a - Numerator vector
  * @param b - Divisor vector
  * @param out - Optional output vector
  * @returns Vector equal to `(a.x / b.x, a.y / b.y)`
  * @throws {RangeError} If any component of b is near zero
  *
  * @see {@link divideSafe} - Returns 0 per component instead of throwing
  * @see {@link divideUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static divide(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  if (isNearZero(b.x) || isNearZero(b.y)) {
   throw new RangeError('Vector2.divide: cannot divide by near-zero component');
  }
  return this.ensureOut(out).set(a.x / b.x, a.y / b.y);
 }

 /**
  * Component-wise division `a / b` (safe).
  *
  * @param a - Numerator vector
  * @param b - Divisor vector
  * @param out - Optional output vector
  * @returns Vector with safe division per component (0 if divisor near zero)
  *
  * @see {@link divide} - Throws on near-zero component
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static divideSafe(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(isNearZero(b.x) ? 0 : a.x / b.x, isNearZero(b.y) ? 0 : a.y / b.y);
 }

 /**
  * Component-wise division `a / b` (unchecked for hot paths).
  *
  * @remarks
  * **Precondition:** `b.x ≠ 0` and `b.y ≠ 0`. Calling with zero produces Infinity/NaN.
  *
  * @param a - Numerator vector
  * @param b - Divisor vector (must have non-zero components)
  * @param out - Optional output vector
  * @returns Vector equal to `(a.x / b.x, a.y / b.y)`
  *
  * @see {@link divide} - Throws on near-zero component
  * @see {@link divideSafe} - Returns 0 per component on near-zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideUnchecked(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(a.x / b.x, a.y / b.y);
 }

 /**
  * Scalar division `v / s` (strict).
  *
  * @remarks
  * For safe division that returns zeros instead of throwing, use {@link divideScalarSafe}.
  * For hot paths where you've already validated the input, use {@link divideScalarUnchecked}.
  *
  * @param v - Vector to divide
  * @param s - Scalar divisor
  * @param out - Optional output vector
  * @returns Vector equal to `(v.x / s, v.y / s)`
  * @throws {RangeError} If scalar is near zero
  *
  * @see {@link divideScalarSafe} - Returns zero vector on near-zero divisor
  * @see {@link divideScalarUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static divideScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  if (isNearZero(s)) {
   throw new RangeError('Vector2.divideScalar: cannot divide by zero or near-zero scalar');
  }
  const inv = 1 / s;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Scalar division `v / s` (safe).
  *
  * @param v - Vector to divide
  * @param s - Scalar divisor (if near zero, returns (0, 0))
  * @param out - Optional output vector
  * @returns Vector equal to `(v.x / s, v.y / s)` or (0, 0) if s is near zero
  *
  * @see {@link divideScalar} - Throws for zero divisor
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static divideScalarSafe(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  if (isNearZero(s)) {
   return this.ensureOut(out).set(0, 0);
  }
  const inv = 1 / s;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Scalar division `v / s` (unchecked for hot paths).
  *
  * @remarks
  * **Precondition:** Scalar must be non-zero.
  * Calling with zero scalar produces Infinity/NaN components.
  *
  * @param v - Vector to divide
  * @param s - Scalar divisor (must be non-zero)
  * @param out - Optional output vector
  * @returns Vector equal to `(v.x / s, v.y / s)`
  *
  * @see {@link divideScalar} - Throws for zero divisor
  * @see {@link divideScalarSafe} - Returns zero vector for zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalarUnchecked(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  const inv = 1 / s;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Unary negation `(-x, -y)`.
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Negated vector
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static negate(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(-v.x, -v.y);
 }

 /**
  * Adds a scaled vector: `base + scale * scaled`.
  *
  * @remarks
  * Common in physics for velocity integration: `v = v + a * dt`
  *
  * @param base - Base vector
  * @param scaled - Vector to scale and add
  * @param scale - Scale factor
  * @param out - Optional output vector
  * @returns Vector equal to `base + scaled * scale`
  *
  * @example
  * ```typescript
  * velocity = Vector2.addScaledVector(velocity, acceleration, dt);
  * ```
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static addScaledVector(
  base: ReadonlyVector2Like,
  scaled: ReadonlyVector2Like,
  scale: number,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(base.x + scaled.x * scale, base.y + scaled.y * scale);
 }

 /**
  * Fused multiply-add: `a * scale + b`.
  *
  * @remarks
  * More efficient than separate multiply and add operations.
  *
  * @param a - Input vector
  * @param scalar - Scalar multiplier
  * @param b - Vector to add
  * @param out - Optional output vector
  * @returns Vector equal to `a * scalar + b`
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static fma(
  a: ReadonlyVector2Like,
  scalar: number,
  b: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(a.x * scalar + b.x, a.y * scalar + b.y);
 }

 /**
  * Component-wise modulo operation `a % b`.
  *
  * @remarks
  * Uses the positive modulo operation from auxiliary module,
  * which handles negative values correctly (always returns positive).
  *
  * @param a - Dividend vector
  * @param b - Divisor vector
  * @param out - Optional output vector
  * @returns Vector with positive modulo per component
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static mod(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarModule(a.x, b.x), scalarModule(a.y, b.y));
 }

 /**
  * Scalar modulo operation `v % s`.
  *
  * @param v - Vector dividend
  * @param s - Scalar divisor
  * @param out - Optional output vector
  * @returns Vector with modulo applied to both components
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static modScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarModule(v.x, s), scalarModule(v.y, s));
 }

 /* ======================================================================== */
 /* Static Transforms                                                        */
 /* ======================================================================== */

 /**
  * Applies Math.floor to both components.
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Floored vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static floor(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.floor(v.x), Math.floor(v.y));
 }

 /**
  * Applies Math.ceil to both components.
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Ceiled vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static ceil(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.ceil(v.x), Math.ceil(v.y));
 }

 /**
  * Applies Math.round to both components.
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Rounded vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static round(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.round(v.x), Math.round(v.y));
 }

 /**
  * Applies Math.trunc to both components (rounds towards zero).
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Truncated vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public static trunc(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.trunc(v.x), Math.trunc(v.y));
 }

 /**
  * Applies Math.abs to both components.
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Absolute-valued vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static abs(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.abs(v.x), Math.abs(v.y));
 }

 /**
  * Component-wise sign extraction: (sign(x), sign(y)).
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Vector with components -1, 0, or 1
  *
  * @category Transform
  * @since 0.7.0
  */
 public static sign(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarSign(v.x), scalarSign(v.y));
 }

 /**
  * Component-wise reciprocal (1/x, 1/y).
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Inverted vector
  * @throws {RangeError} If any component is zero
  *
  * @see {@link inverseSafe} - Returns 0 per component on near-zero value
  * @see {@link inverseUnchecked} - No validation
  *
  * @category Transform
  * @since 0.6.0
  */
 public static inverse(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  if (isNearZero(v.x) || isNearZero(v.y)) {
   throw new RangeError('Vector2.inverse: cannot invert near-zero component');
  }
  return this.ensureOut(out).set(1 / v.x, 1 / v.y);
 }

 /**
  * Safe reciprocal. Components near zero become 0.
  *
  * @remarks
  * Uses {@link isNearZero} with default {@link EPSILON} (1e-10) per component.
  * Components with |value| ≤ EPSILON become 0 instead of Infinity.
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Safe inverted vector
  *
  * @see {@link inverse} - Throws on near-zero component
  *
  * @category Transform
  * @since 0.6.0
  */
 public static inverseSafe(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(isNearZero(v.x) ? 0 : 1 / v.x, isNearZero(v.y) ? 0 : 1 / v.y);
 }

 /**
  * Unchecked reciprocal for hot paths.
  *
  * @remarks
  * **Precondition:** Both components must be non-zero.
  * Calling with zero produces Infinity.
  *
  * @param v - Source vector (must have non-zero components)
  * @param out - Optional output vector
  * @returns Inverted vector
  *
  * @see {@link inverse} - Throws on near-zero component
  * @see {@link inverseSafe} - Returns 0 per component on near-zero value
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseUnchecked(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(1 / v.x, 1 / v.y);
 }

 /**
  * Swaps x and y components.
  *
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Vector with swapped components `(y, x)`
  *
  * @category Transform
  * @since 0.6.0
  */
 public static swap(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.y, v.x);
 }

 /**
  * Component-wise step function (GLSL-style).
  *
  * @remarks
  * Useful for shader-like operations and conditional masking.
  *
  * @param edge - Threshold vector
  * @param v - Input vector
  * @param out - Optional output vector
  * @returns Vector with 0 where `v < edge`, 1 otherwise
  *
  * @category Transform
  * @since 0.7.0
  */
 public static step(edge: ReadonlyVector2Like, v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarStep(edge.x, v.x), scalarStep(edge.y, v.y));
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation: `a + t * (b - a)`. Factor t is not clamped.
  *
  * @param a - Start vector
  * @param b - End vector
  * @param t - Interpolation factor
  * @param out - Optional output vector
  * @returns Interpolated vector
  *
  * @category Interpolation
  * @since 0.6.0
  */
 public static lerp(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
 }

 /**
  * Linear interpolation with t clamped to [0, 1].
  *
  * @param a - Start vector
  * @param b - End vector
  * @param t - Interpolation factor (clamped)
  * @param out - Optional output vector
  * @returns Clamped interpolated vector
  *
  * @category Interpolation
  * @since 0.6.0
  */
 public static lerpClamped(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  const tc = saturate(t);
  return this.lerp(a, b, tc, out);
 }

 /**
  * Spherical linear interpolation between two vectors.
  *
  * @remarks
  * Interpolates the angle while maintaining constant angular velocity.
  * Falls back to linear interpolation for nearly parallel or opposite vectors.
  *
  * @param a - Start vector
  * @param b - End vector
  * @param t - Interpolation factor (0 to 1)
  * @param out - Optional output vector
  * @returns Spherically interpolated vector
  *
  * @example
  * ```typescript
  * const a = new Vector2(1, 0); // pointing right
  * const b = new Vector2(0, 1); // pointing up
  * const mid = Vector2.slerp(a, b, 0.5); // ~(0.707, 0.707) - 45° between
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static slerp(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  const lengthA = Vector2.magnitude(a);
  const lengthB = Vector2.magnitude(b);

  if (isNearZero(lengthA) || isNearZero(lengthB)) {
   return this.lerp(a, b, t, out);
  }

  // Normalize
  const ax = a.x / lengthA;
  const ay = a.y / lengthA;
  const bx = b.x / lengthB;
  const by = b.y / lengthB;

  // Angle between normalized vectors
  const dot = clamp(ax * bx + ay * by, -1, 1);
  const theta = acosSafe(dot);

  if (isNearZero(theta)) {
   return this.lerp(a, b, t, out);
  }

  const sinTheta = sin(theta);

  // Fall back to lerp for opposite vectors where sin(theta) ≈ 0
  if (isNearZero(sinTheta)) {
   return this.lerp(a, b, t, out);
  }

  const wa = sin((1 - t) * theta) / sinTheta;
  const wb = sin(t * theta) / sinTheta;

  // Interpolate magnitude
  const lengthInterp = lerp(lengthA, lengthB, t);

  return this.ensureOut(out).set(
   (wa * ax + wb * bx) * lengthInterp,
   (wa * ay + wb * by) * lengthInterp,
  );
 }

 /**
  * Spherical linear interpolation with t clamped to [0, 1].
  *
  * @param a - Start vector
  * @param b - End vector
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output vector
  * @returns Interpolated vector
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static slerpClamped(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  return this.slerp(a, b, saturate(t), out);
 }

 /**
  * Smooth Hermite interpolation between two vectors.
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  * Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.
  *
  * @param a - Start vector
  * @param b - End vector
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output vector
  * @returns Smoothly interpolated vector
  *
  * @example
  * ```typescript
  * const a = { x: 0, y: 0 };
  * const b = { x: 10, y: 10 };
  * const smooth = Vector2.smoothStep(a, b, 0.5); // Smooth interpolation
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static smoothStep(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  const smoothT = smoothStep(0, 1, t);
  return Vector2.lerp(a, b, smoothT, out);
 }

 /* ======================================================================== */
 /* Static Geometry                                                          */
 /* ======================================================================== */

 /**
  * Dot product `a·b = a.x*b.x + a.y*b.y`.
  *
  * @param a - First operand
  * @param b - Second operand
  * @returns Scalar dot product
  *
  * @example
  * ```typescript
  * const a = new Vector2(1, 0);
  * const b = new Vector2(0, 1);
  * Vector2.dot(a, b); // 0 - perpendicular vectors
  * Vector2.dot(a, a); // 1 - parallel vectors (self dot = magnitude²)
  * ```
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static dot(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return a.x * b.x + a.y * b.y;
 }

 /**
  * 2D scalar cross product (z-component): `a.x*b.y - a.y*b.x`.
  *
  * @remarks
  * Positive if b is CCW from a, negative if CW.
  *
  * @param a - First operand
  * @param b - Second operand
  * @returns Scalar cross product (signed area magnitude)
  *
  * @example
  * ```typescript
  * const a = new Vector2(1, 0);
  * const b = new Vector2(0, 1);
  * Vector2.cross(a, b); // 1 - b is CCW from a
  * Vector2.cross(b, a); // -1 - a is CW from b
  * ```
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static cross(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return a.x * b.y - a.y * b.x;
 }

 /**
  * Twice the signed area of triangle (a, b, c).
  *
  * @param a - First vertex
  * @param b - Second vertex
  * @param c - Third vertex
  * @returns Twice the signed area (positive if CCW winding)
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static cross3(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  c: ReadonlyVector2Like,
 ): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
 }

 /**
  * Euclidean length `||v||`.
  *
  * @param v - Vector to measure
  * @returns The Euclidean norm
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static magnitude(v: ReadonlyVector2Like): number {
  return hypot(v.x, v.y);
 }

 /**
  * Squared length `||v||²` (avoids square root).
  *
  * @param v - Vector to measure
  * @returns The squared length
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static magnitudeSq(v: ReadonlyVector2Like): number {
  return v.x * v.x + v.y * v.y;
 }

 /**
  * Manhattan length `|x| + |y|`.
  *
  * @param v - Vector to measure
  * @returns The Manhattan (L1) norm
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static manhattanLength(v: ReadonlyVector2Like): number {
  return Math.abs(v.x) + Math.abs(v.y);
 }

 /**
  * Chebyshev length `max(|x|, |y|)` (L∞ norm).
  *
  * @remarks
  * Also known as the L-infinity norm or chessboard norm. Returns the largest
  * absolute component value, corresponding to the minimum number of king moves
  * on a chessboard.
  *
  * @param v - Vector to measure
  * @returns The Chebyshev (L∞) norm
  *
  * @category Geometry
  * @since 0.7.0
  */
 public static chebyshevLength(v: ReadonlyVector2Like): number {
  return Math.max(Math.abs(v.x), Math.abs(v.y));
 }

 /**
  * Euclidean distance between a and b.
  *
  * @param a - First point
  * @param b - Second point
  * @returns The Euclidean distance
  *
  * @example
  * ```typescript
  * const a = new Vector2(0, 0);
  * const b = new Vector2(3, 4);
  * Vector2.distance(a, b); // 5 - the 3-4-5 triangle
  * ```
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static distance(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return hypot(dx, dy);
 }

 /**
  * Squared Euclidean distance between a and b.
  *
  * @param a - First point
  * @param b - Second point
  * @returns The squared distance
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static distanceSquared(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
 }

 /**
  * Manhattan (L1) distance between a and b.
  *
  * @param a - First point
  * @param b - Second point
  * @returns The Manhattan distance
  *
  * @category Geometry
  * @since 0.6.0
  */
 public static manhattanDistance(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
 }

 /**
  * Chebyshev (L∞) distance between a and b.
  *
  * @remarks
  * Also known as the chessboard distance. Returns the maximum absolute
  * difference across components: `max(|ax - bx|, |ay - by|)`.
  *
  * @param a - First point
  * @param b - Second point
  * @returns The Chebyshev distance
  *
  * @category Geometry
  * @since 0.7.0
  */
 public static chebyshevDistance(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
 }

 /* ======================================================================== */
 /* Static Direction                                                         */
 /* ======================================================================== */

 /**
  * Unit direction from `from` to `to`.
  *
  * @param from - Start point
  * @param to - End point
  * @param out - Optional output vector
  * @returns Unit direction vector
  * @throws {RangeError} If from and to are coincident
  *
  * @see {@link directionSafe} - Returns (0,0) instead of throwing
  * @see {@link directionUnchecked} - No validation, for hot paths
  *
  * @category Direction
  * @since 0.6.0
  */
 public static direction(
  from: ReadonlyVector2Like,
  to: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = hypot(dx, dy);
  if (isNearZero(length)) {
   throw new RangeError('Vector2.direction: from and to are coincident');
  }
  return this.ensureOut(out).set(dx / length, dy / length);
 }

 /**
  * Unit direction from `from` to `to`, returning (0,0) if coincident.
  *
  * @param from - Start point
  * @param to - End point
  * @param out - Optional output vector
  * @returns Unit direction vector, or (0,0) if coincident
  *
  * @see {@link direction} - Throws on coincident points
  *
  * @category Direction
  * @since 0.7.0
  */
 public static directionSafe(
  from: ReadonlyVector2Like,
  to: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = hypot(dx, dy);
  if (isNearZero(length)) {
   return this.ensureOut(out).set(0, 0);
  }
  return this.ensureOut(out).set(dx / length, dy / length);
 }

 /**
  * Unit direction without validation (hot path).
  *
  * @remarks
  * **Precondition:** `from ≠ to`.
  * Calling with identical points produces NaN/Infinity.
  *
  * @param from - Start point
  * @param to - End point (must be different from `from`)
  * @param out - Optional output vector
  * @returns Unit direction vector
  *
  * @see {@link direction} - Throws on coincident points
  * @see {@link directionSafe} - Returns (0,0) on coincident points
  *
  * @category Direction
  * @since 0.7.0
  */
 public static directionUnchecked(
  from: ReadonlyVector2Like,
  to: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const invLength = 1 / Math.sqrt(dx * dx + dy * dy);
  return this.ensureOut(out).set(dx * invLength, dy * invLength);
 }

 /**
  * Heading (angle) of v from +X axis in radians ∈ [-π, π].
  *
  * @param v - Vector to measure
  * @returns Angle in radians (CCW positive)
  *
  * @category Direction
  * @since 0.6.0
  */
 public static angle(v: ReadonlyVector2Like): number {
  return atan2(v.y, v.x);
 }

 /**
  * Signed angle from a to b (positive if b is CCW from a).
  *
  * @remarks
  * Uses `atan2(cross(a,b), dot(a,b))` for robust behavior.
  *
  * @param a - Start vector
  * @param b - End vector
  * @returns Signed angle in radians
  *
  * @category Direction
  * @since 0.6.0
  */
 public static angleTo(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return angleFromVectors(a.x, a.y, b.x, b.y);
 }

 /**
  * Smallest unsigned angle between a and b in radians ∈ [0, π].
  *
  * @param a - First vector
  * @param b - Second vector
  * @returns Unsigned angle in radians
  *
  * @category Direction
  * @since 0.6.0
  */
 public static angleBetween(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  const lengthA = Vector2.magnitude(a);
  const lengthB = Vector2.magnitude(b);
  if (isNearZero(lengthA) || isNearZero(lengthB)) return 0;

  const dot = Vector2.dot(a, b);
  const cosAngle = clamp(dot / (lengthA * lengthB), -1, 1);
  return acosSafe(cosAngle);
 }

 /* ======================================================================== */
 /* Static Constraint                                                        */
 /* ======================================================================== */

 /**
  * Component-wise clamp between min and max vectors.
  *
  * @param v - Vector to clamp
  * @param minV - Per-component minima
  * @param maxV - Per-component maxima
  * @param out - Optional output vector
  * @returns Clamped vector
  *
  * @category Constraint
  * @since 0.6.0
  */
 public static clamp(
  v: ReadonlyVector2Like,
  minV: ReadonlyVector2Like,
  maxV: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(clamp(v.x, minV.x, maxV.x), clamp(v.y, minV.y, maxV.y));
 }

 /**
  * Clamps both components between scalar min and max.
  *
  * @param v - Vector to clamp
  * @param min - Minimum scalar
  * @param max - Maximum scalar
  * @param out - Optional output vector
  * @returns Clamped vector
  *
  * @category Constraint
  * @since 0.6.0
  */
 public static clampScalar(
  v: ReadonlyVector2Like,
  min: number,
  max: number,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(clamp(v.x, min, max), clamp(v.y, min, max));
 }

 /**
  * Clamps vector length to [minLength, maxLength].
  *
  * @param v - Vector to clamp
  * @param minLength - Minimum magnitude
  * @param maxLength - Maximum magnitude
  * @param out - Optional output vector
  * @returns Vector with clamped magnitude
  *
  * @category Constraint
  * @since 0.6.0
  */
 public static clampMagnitude(
  v: ReadonlyVector2Like,
  minLength: number,
  maxLength: number,
  out?: Vector2,
 ): Vector2 {
  const length = Vector2.magnitude(v);
  if (isNearZero(length)) {
   return this.ensureOut(out).set(0, 0);
  }
  const newMagnitude = clamp(length, minLength, maxLength);
  const scale = newMagnitude / length;
  return this.ensureOut(out).set(v.x * scale, v.y * scale);
 }

 /**
  * Limits vector length to maxLength.
  *
  * @remarks Equivalent to `clampMagnitude(v, 0, maxLength)`.
  *
  * @param v - Vector to limit
  * @param maxLength - Maximum allowed magnitude
  * @param out - Optional output vector
  * @returns Vector with limited magnitude
  *
  * @category Constraint
  * @since 0.6.0
  */
 public static limit(v: ReadonlyVector2Like, maxLength: number, out?: Vector2): Vector2 {
  const lengthSq = Vector2.magnitudeSq(v);
  if (lengthSq > maxLength * maxLength && lengthSq > 0) {
   const mag = hypot(v.x, v.y);
   const scale = maxLength / mag;
   return this.ensureOut(out).set(v.x * scale, v.y * scale);
  }
  return this.ensureOut(out).set(v.x, v.y);
 }

 /**
  * Component-wise minimum of a and b.
  *
  * @param a - First vector
  * @param b - Second vector
  * @param out - Optional output vector
  * @returns Vector with per-component minima
  *
  * @category Constraint
  * @since 0.6.0
  */
 public static min(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.min(a.x, b.x), Math.min(a.y, b.y));
 }

 /**
  * Component-wise maximum of a and b.
  *
  * @param a - First vector
  * @param b - Second vector
  * @param out - Optional output vector
  * @returns Vector with per-component maxima
  *
  * @category Constraint
  * @since 0.6.0
  */
 public static max(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.max(a.x, b.x), Math.max(a.y, b.y));
 }

 /**
  * Component-wise minimum of v and scalar s.
  *
  * @param v - Vector
  * @param s - Scalar bound
  * @param out - Optional output vector
  * @returns Vector with each component ≤ s
  *
  * @category Constraint
  * @since 0.7.0
  */
 public static minScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.min(v.x, s), Math.min(v.y, s));
 }

 /**
  * Component-wise maximum of v and scalar s.
  *
  * @param v - Vector
  * @param s - Scalar bound
  * @param out - Optional output vector
  * @returns Vector with each component ≥ s
  *
  * @category Constraint
  * @since 0.7.0
  */
 public static maxScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.max(v.x, s), Math.max(v.y, s));
 }

 /* ======================================================================== */
 /* Static Transforms (Normalize & Project)                                  */
 /* ======================================================================== */

 /**
  * Normalizes v to unit length.
  *
  * @remarks
  * **Numerical Limits:** For vectors with extremely small components
  * (magnitude < ~1e-154), intermediate calculations may underflow to zero
  * due to IEEE 754 double precision limits, causing a RangeError even if
  * the vector is technically non-zero. Use {@link normalizeSafe} for
  * graceful handling of such edge cases.
  *
  * @param v - Vector to normalize
  * @param out - Optional output vector
  * @returns Unit vector
  * @throws {RangeError} If v has zero length
  *
  * @example
  * ```typescript
  * const v = new Vector2(3, 4);
  * const unit = Vector2.normalize(v); // (0.6, 0.8) - unit vector
  * ```
  *
  * @see {@link normalizeSafe} - Returns (0,0) on zero-length vector
  * @see {@link normalizeUnchecked} - No validation
  *
  * @category Transform
  * @since 0.6.0
  */
 public static normalize(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const mag = hypot(v.x, v.y);
  if (isNearZero(mag)) {
   throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');
  }
  const inv = 1 / mag;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Safe normalization. Returns (0,0) if v has zero length.
  *
  * @remarks
  * Returns `(0,0)` for zero-length vectors because there is no meaningful
  * unit direction to preserve. Unlike Complex and Rotation2 which use `(1,0)`
  * as their identity element, vectors have no algebraic identity for
  * normalization — the zero vector is the least surprising fallback.
  *
  * @param v - Vector to normalize
  * @param out - Optional output vector
  * @returns Normalized vector or zero vector
  *
  * @see {@link normalize} - Throws on zero-length vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static normalizeSafe(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const mag = hypot(v.x, v.y);
  if (isNearZero(mag)) {
   return this.ensureOut(out).set(0, 0);
  }
  const inv = 1 / mag;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Normalizes a vector without validation (for hot paths).
  *
  * @remarks
  * **WARNING:** This method performs no validation.
  * - If v is zero, the result will be (NaN, NaN).
  * - Use only when you can guarantee the vector has non-zero length.
  *
  * Uses `Math.sqrt(x*x + y*y)` for magnitude, which is faster than `Math.hypot`
  * but overflows to `Infinity` for components larger than ~1e154 (since squaring
  * exceeds `Number.MAX_VALUE`). For vectors with very large components, prefer
  * {@link normalize} or {@link normalizeSafe} which use overflow-safe magnitude.
  *
  * @param v - Vector to normalize (must have non-zero length)
  * @param out - Optional output vector
  * @returns Normalized vector
  *
  * @see {@link normalize} - Throws on zero-length vectors
  * @see {@link normalizeSafe} - Returns (0,0) on zero-length vectors
  *
  * @category Transform
  * @since 0.7.0
  */
 public static normalizeUnchecked(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const lengthSq = v.x * v.x + v.y * v.y;
  const inv = 1 / Math.sqrt(lengthSq);
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Computes length and unit vector in a single operation.
  *
  * @remarks
  * More efficient than calling length() and normalize() separately
  * when both values are needed, as it avoids computing sqrt twice.
  *
  * @param v - Vector to process
  * @param out - Optional output vector for the unit vector
  * @returns Object with length and unit vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public static getLengthAndNormalize(
  v: ReadonlyVector2Like,
  out?: Vector2,
 ): { length: number; unit: Vector2 } {
  const length = hypot(v.x, v.y);
  if (isNearZero(length)) {
   return { length: 0, unit: this.ensureOut(out).set(0, 0) };
  }
  const inv = 1 / length;
  return { length, unit: this.ensureOut(out).set(v.x * inv, v.y * inv) };
 }

 /**
  * Returns a copy of v with the requested length.
  *
  * @param v - Source vector
  * @param newMagnitude - Desired magnitude
  * @param out - Optional output vector
  * @returns Vector with specified length
  * @throws {RangeError} If newMagnitude < 0 or v has zero length
  *
  * @see {@link setMagnitudeSafe} - Returns fallback on zero-length vector
  * @see {@link setMagnitudeUnchecked} - No validation
  *
  * @category Transform
  * @since 0.6.0
  */
 public static setMagnitude(v: ReadonlyVector2Like, newMagnitude: number, out?: Vector2): Vector2 {
  if (newMagnitude < 0) {
   throw new RangeError('Vector2.setMagnitude: length must be non-negative');
  }
  const length = Vector2.magnitude(v);
  if (isNearZero(length)) {
   throw new RangeError('Vector2.setMagnitude: cannot set length on zero vector');
  }
  const scale = newMagnitude / length;
  return this.ensureOut(out).set(v.x * scale, v.y * scale);
 }

 /**
  * Safe setMagnitude. Zero vectors become (newMagnitude, 0).
  *
  * @param v - Source vector
  * @param newMagnitude - Desired magnitude (clamped to 0 if negative)
  * @param out - Optional output vector
  * @returns Vector with specified length
  *
  * @see {@link setMagnitude} - Throws on zero-length vector or negative magnitude
  *
  * @category Transform
  * @since 0.6.0
  */
 public static setMagnitudeSafe(
  v: ReadonlyVector2Like,
  newMagnitude: number,
  out?: Vector2,
 ): Vector2 {
  const nn = newMagnitude < 0 ? 0 : newMagnitude;
  const length = Vector2.magnitude(v);
  if (isNearZero(length)) {
   return this.ensureOut(out).set(nn, 0);
  }
  const scale = nn / length;
  return this.ensureOut(out).set(v.x * scale, v.y * scale);
 }

 /**
  * Sets length without validation (hot path).
  *
  * @remarks
  * **Preconditions:** `v` must have non-zero length, `newMagnitude >= 0`.
  * Calling with zero-length vector produces NaN/Infinity.
  *
  * @param v - Source vector (must have non-zero length)
  * @param newMagnitude - Desired magnitude (must be non-negative)
  * @param out - Optional output vector
  * @returns Vector with specified length
  *
  * @see {@link setMagnitude} - Throws on invalid input
  * @see {@link setMagnitudeSafe} - Handles edge cases gracefully
  *
  * @category Transform
  * @since 0.7.0
  */
 public static setMagnitudeUnchecked(
  v: ReadonlyVector2Like,
  newMagnitude: number,
  out?: Vector2,
 ): Vector2 {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  const scale = newMagnitude / length;
  return this.ensureOut(out).set(v.x * scale, v.y * scale);
 }

 /**
  * Returns vector with same magnitude but new angle.
  *
  * @param v - Source vector
  * @param angle - New heading in radians
  * @param out - Optional output vector
  * @returns Vector with new angle
  *
  * @category Transform
  * @since 0.6.0
  */
 public static setAngle(v: ReadonlyVector2Like, angle: number, out?: Vector2): Vector2 {
  const magnitude = Vector2.magnitude(v);
  const { cos, sin } = sinCos(angle);
  return this.ensureOut(out).set(cos * magnitude, sin * magnitude);
 }

 /**
  * Projects v onto axis.
  *
  * @remarks
  * Mathematically equivalent to `axis * (dot(v, axis) / magnitudeSq(axis))`.
  *
  * @param v - Vector to project
  * @param axis - Projection axis
  * @param out - Optional output vector
  * @returns Projection of v onto axis
  * @throws {RangeError} If axis has zero length
  *
  * @example
  * ```typescript
  * const v = new Vector2(3, 4);
  * const axis = new Vector2(1, 0);
  * const proj = Vector2.project(v, axis); // (3, 0) - projection onto X axis
  * ```
  *
  * @see {@link projectSafe} - Returns (0,0) instead of throwing
  * @see {@link projectUnchecked} - No validation, for hot paths
  * @see {@link projectOnUnit} - Optimized for unit vectors
  *
  * @category Transform
  * @since 0.6.0
  */
 public static project(v: ReadonlyVector2Like, axis: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const denom = Vector2.magnitudeSq(axis);
  if (isNearZero(denom)) {
   throw new RangeError('Vector2.project: cannot project onto zero-length axis');
  }
  const s = Vector2.dot(v, axis) / denom;
  return this.ensureOut(out).set(axis.x * s, axis.y * s);
 }

 /**
  * Projects v onto axis, returning (0,0) if axis has zero length.
  *
  * @param v - Vector to project
  * @param axis - Projection axis
  * @param out - Optional output vector
  * @returns Projection of v onto axis, or (0,0) if axis is zero
  *
  * @see {@link project} - Throws on zero-length axis
  * @see {@link projectOnUnit} - Optimized for unit vectors
  *
  * @category Transform
  * @since 0.6.0
  */
 public static projectSafe(
  v: ReadonlyVector2Like,
  axis: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const denom = Vector2.magnitudeSq(axis);
  if (isNearZero(denom)) {
   return this.ensureOut(out).set(0, 0);
  }
  const s = Vector2.dot(v, axis) / denom;
  return this.ensureOut(out).set(axis.x * s, axis.y * s);
 }

 /**
  * Projects v onto axis without validation (hot path).
  *
  * @remarks
  * **Precondition:** `axis` must have non-zero length.
  * If axis is zero, result will be (NaN, NaN).
  *
  * @param v - Vector to project
  * @param axis - Projection axis (must have non-zero length)
  * @param out - Optional output vector
  * @returns Projection of v onto axis
  *
  * @see {@link project} - Throws on zero-length axis
  * @see {@link projectSafe} - Returns (0,0) on zero-length axis
  * @see {@link projectOnUnit} - Optimized for unit vectors
  *
  * @category Transform
  * @since 0.7.0
  */
 public static projectUnchecked(
  v: ReadonlyVector2Like,
  axis: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const denom = Vector2.magnitudeSq(axis);
  const s = Vector2.dot(v, axis) / denom;
  return this.ensureOut(out).set(axis.x * s, axis.y * s);
 }

 /**
  * Projects v onto a unit axis (optimized).
  *
  * @param v - Vector to project
  * @param unitAxis - Unit-length axis
  * @param out - Optional output vector
  * @returns Projection of v onto unitAxis
  *
  * @category Transform
  * @since 0.6.0
  */
 public static projectOnUnit(
  v: ReadonlyVector2Like,
  unitAxis: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  assert(
   isNearZero(Vector2.magnitudeSq(unitAxis) - 1),
   'Vector2.projectOnUnit: unitAxis must be unit-length. Use Vector2.project() for non-unit axes.',
  );
  const s = Vector2.dot(v, unitAxis);
  return this.ensureOut(out).set(unitAxis.x * s, unitAxis.y * s);
 }

 /**
  * Vector rejection: component of a perpendicular to b.
  *
  * @remarks
  * `reject(a, b) = a - project(a, b)`
  *
  * @param a - Vector to decompose
  * @param b - Axis of projection
  * @param out - Optional output vector
  * @returns Rejection of a from b
  * @throws {RangeError} If b has zero length
  *
  * @example
  * ```typescript
  * const v = new Vector2(3, 4);
  * const axis = new Vector2(1, 0);
  * const rej = Vector2.reject(v, axis); // (0, 4) - the perpendicular component
  * ```
  *
  * @see {@link rejectSafe} - Returns copy of a instead of throwing
  * @see {@link rejectUnchecked} - No validation, for hot paths
  * @see {@link rejectOnUnit} - Optimized for unit vectors
  *
  * @category Transform
  * @since 0.6.0
  */
 public static reject(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const denom = Vector2.magnitudeSq(b);
  if (isNearZero(denom)) {
   throw new RangeError('Vector2.reject: cannot reject from zero-length vector');
  }
  const s = Vector2.dot(a, b) / denom;
  return this.ensureOut(out).set(a.x - b.x * s, a.y - b.y * s);
 }

 /**
  * Vector rejection, returning copy of a if b has zero length.
  *
  * @param a - Vector to decompose
  * @param b - Axis of projection
  * @param out - Optional output vector
  * @returns Rejection of a from b, or copy of a if b is zero
  *
  * @see {@link reject} - Throws on zero-length axis
  * @see {@link rejectOnUnit} - Optimized for unit vectors
  *
  * @category Transform
  * @since 0.7.0
  */
 public static rejectSafe(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const denom = Vector2.magnitudeSq(b);
  if (isNearZero(denom)) {
   return this.ensureOut(out).set(a.x, a.y);
  }
  const s = Vector2.dot(a, b) / denom;
  return this.ensureOut(out).set(a.x - b.x * s, a.y - b.y * s);
 }

 /**
  * Vector rejection without validation (hot path).
  *
  * @remarks
  * **Precondition:** `b` must have non-zero length.
  * If b is zero, result will be (NaN, NaN).
  *
  * @param a - Vector to decompose
  * @param b - Axis of projection (must have non-zero length)
  * @param out - Optional output vector
  * @returns Rejection of a from b
  *
  * @see {@link reject} - Throws on zero-length axis
  * @see {@link rejectSafe} - Returns copy of input on zero-length axis
  * @see {@link rejectOnUnit} - Optimized for unit vectors
  *
  * @category Transform
  * @since 0.7.0
  */
 public static rejectUnchecked(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const denom = Vector2.magnitudeSq(b);
  const s = Vector2.dot(a, b) / denom;
  return this.ensureOut(out).set(a.x - b.x * s, a.y - b.y * s);
 }

 /**
  * Vector rejection onto a unit axis (optimized hot path).
  *
  * @remarks
  * `rejectOnUnit(a, unitAxis) = a - projectOnUnit(a, unitAxis)`
  * Use when you know the axis is already normalized.
  *
  * @param a - Vector to decompose
  * @param unitAxis - Unit-length axis
  * @param out - Optional output vector
  * @returns Rejection of a from unitAxis
  *
  * @category Transform
  * @since 0.7.0
  */
 public static rejectOnUnit(
  a: ReadonlyVector2Like,
  unitAxis: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const s = Vector2.dot(a, unitAxis);
  return this.ensureOut(out).set(a.x - unitAxis.x * s, a.y - unitAxis.y * s);
 }

 /**
  * Reflection of v about a unit normal: `r = v - 2(v·n)n`.
  *
  * @remarks
  * Implements the reflection formula: `r = v - 2 * dot(v, n) * n`.
  * Uses {@link Vector2.dot} internally.
  * For physics bounces, the incident velocity reflects off surfaces using this formula.
  *
  * @param v - Incident vector
  * @param unitNormal - Unit-length normal
  * @param out - Optional output vector
  * @returns Reflected vector
  *
  * @throws {RangeError} If unitNormal is not unit length
  *
  * @example
  * ```typescript
  * const v = new Vector2(1, -1); // incoming at 45°
  * const normal = new Vector2(0, 1); // horizontal surface
  * const r = Vector2.reflect(v, normal); // (1, 1) - bounces off
  * ```
  *
  * @see {@link reflectSafe} - Normalizes normal first
  * @see {@link reflectUnchecked} - No validation, for hot paths
  *
  * @category Transform
  * @since 0.6.0
  */
 public static reflect(
  v: ReadonlyVector2Like,
  unitNormal: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const magSq = Vector2.magnitudeSq(unitNormal);
  if (!scalarNearEquals(magSq, 1)) {
   throw new RangeError('Vector2.reflect: normal must be unit length');
  }
  const d2 = 2 * Vector2.dot(v, unitNormal);
  return this.ensureOut(out).set(v.x - d2 * unitNormal.x, v.y - d2 * unitNormal.y);
 }

 /**
  * Safe reflection. Normalizes the normal; near-zero normal returns v.
  *
  * @param v - Incident vector
  * @param normal - Normal (need not be unit)
  * @param out - Optional output vector
  * @returns Reflected vector
  *
  * @see {@link reflect} - Throws if normal is not unit length
  *
  * @category Transform
  * @since 0.6.0
  */
 public static reflectSafe(
  v: ReadonlyVector2Like,
  normal: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const mag = hypot(normal.x, normal.y);
  if (isNearZero(mag)) {
   return this.ensureOut(out).set(v.x, v.y);
  }
  const invLength = 1 / mag;
  const nx = normal.x * invLength;
  const ny = normal.y * invLength;
  const d2 = 2 * (v.x * nx + v.y * ny);
  return this.ensureOut(out).set(v.x - d2 * nx, v.y - d2 * ny);
 }

 /**
  * Reflection without validation (hot path).
  *
  * @remarks
  * **Precondition:** `unitNormal` must have unit length.
  * If not unit, result will be incorrect but not NaN.
  *
  * @param v - Incident vector
  * @param unitNormal - Unit-length normal (must be unit)
  * @param out - Optional output vector
  * @returns Reflected vector
  *
  * @see {@link reflect} - Throws if normal is not unit
  * @see {@link reflectSafe} - Normalizes normal first
  *
  * @category Transform
  * @since 0.7.0
  */
 public static reflectUnchecked(
  v: ReadonlyVector2Like,
  unitNormal: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const d2 = 2 * Vector2.dot(v, unitNormal);
  return this.ensureOut(out).set(v.x - d2 * unitNormal.x, v.y - d2 * unitNormal.y);
 }

 /**
  * Perpendicular vector (±90°) with unchanged length.
  *
  * @remarks
  * - CCW (+90°): `(-y, x)`
  * - CW (-90°): `(y, -x)`
  *
  * @param v - Source vector
  * @param clockwise - CW (-90°) if true, CCW (+90°) if false. @defaultValue `false`
  * @param out - Optional output vector
  * @returns Perpendicular vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static perpendicular(v: ReadonlyVector2Like, clockwise = false, out?: Vector2): Vector2 {
  return clockwise ? this.ensureOut(out).set(v.y, -v.x) : this.ensureOut(out).set(-v.y, v.x);
 }

 /**
  * Rotates v by angle radians.
  *
  * @param v - Vector to rotate
  * @param angle - Rotation angle (CCW positive)
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @example
  * ```typescript
  * const v = new Vector2(1, 0);
  * const rotated = Vector2.rotate(v, Math.PI / 2); // (0, 1) - 90° CCW
  * ```
  *
  * @category Transform
  * @since 0.6.0
  */
 public static rotate(v: ReadonlyVector2Like, angle: number, out?: Vector2): Vector2 {
  const { cos, sin } = sinCos(angle);
  return this.rotateCS(v, cos, sin, out);
 }

 /**
  * Rotates v using precomputed cos/sin (optimal for batches).
  *
  * @param v - Vector to rotate
  * @param c - Cosine of angle
  * @param s - Sine of angle
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static rotateCS(v: ReadonlyVector2Like, c: number, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x * c - v.y * s, v.x * s + v.y * c);
 }

 /**
  * Rotates v around center by angle.
  *
  * @param v - Vector to rotate
  * @param center - Rotation pivot
  * @param angle - Rotation angle
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @example
  * ```typescript
  * const point = new Vector2(2, 0);
  * const center = new Vector2(1, 0);
  * const rotated = Vector2.rotateAround(point, center, Math.PI); // (0, 0)
  * ```
  *
  * @category Transform
  * @since 0.6.0
  */
 public static rotateAround(
  v: ReadonlyVector2Like,
  center: ReadonlyVector2Like,
  angle: number,
  out?: Vector2,
 ): Vector2 {
  const { cos, sin } = sinCos(angle);
  const tx = v.x - center.x;
  const ty = v.y - center.y;
  return this.ensureOut(out).set(tx * cos - ty * sin + center.x, tx * sin + ty * cos + center.y);
 }

 /**
  * Rotates v around center using precomputed cos/sin.
  *
  * @remarks
  * Optimal when rotating many points around the same center.
  *
  * @param v - Vector to rotate
  * @param center - Rotation pivot
  * @param c - Cosine of angle
  * @param s - Sine of angle
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public static rotateAroundCS(
  v: ReadonlyVector2Like,
  center: ReadonlyVector2Like,
  c: number,
  s: number,
  out?: Vector2,
 ): Vector2 {
  const tx = v.x - center.x;
  const ty = v.y - center.y;
  return this.ensureOut(out).set(tx * c - ty * s + center.x, tx * s + ty * c + center.y);
 }

 /**
  * 2D cross product: vector × scalar = (s*y, -s*x).
  * Scalar is on the RIGHT side of the cross product.
  *
  * @param v - Source vector
  * @param s - Scalar factor (on right)
  * @param out - Optional output vector
  * @returns Perpendicular scaled vector (CW rotation)
  *
  * @see {@link crossScalarLeft} - For scalar on left side
  *
  * @category Transform
  * @since 0.6.0
  */
 public static crossScalarRight(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(s * v.y, -s * v.x);
 }

 /**
  * 2D cross product: scalar × vector = (-s*y, s*x).
  * Scalar is on the LEFT side of the cross product.
  *
  * @param s - Scalar factor (on left)
  * @param v - Source vector
  * @param out - Optional output vector
  * @returns Perpendicular scaled vector (CCW rotation)
  *
  * @example
  * ```typescript
  * const v = new Vector2(1, 0);
  * const perp = Vector2.crossScalarLeft(1, v); // (0, 1) - CCW perpendicular
  * ```
  *
  * @see {@link crossScalarRight} - For scalar on right side
  *
  * @category Transform
  * @since 0.6.0
  */
 public static crossScalarLeft(s: number, v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(-s * v.y, s * v.x);
 }

 /* ======================================================================== */
 /* Static Transform Integration                                             */
 /* ======================================================================== */

 /**
  * Applies a Rotation2 (unit complex) to a vector.
  *
  * @remarks
  * - Use `Rotation2.apply` semantics (pure operator).
  * - Equivalent to `rotateCS(v, rotation.cos, rotation.sin, out)`.
  * - Uses interface for loose coupling.
  *
  * @param v - Vector to transform
  * @param rotation - Rotation2 with cos and sin components
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public static applyRotation2(
  v: ReadonlyVector2Like,
  rotation: ReadonlyRotation2Like,
  out?: Vector2,
 ): Vector2 {
  return Vector2.rotateCS(v, rotation.cos, rotation.sin, out);
 }

 /**
  * Transforms a vector by a 2x2 matrix.
  *
  * @remarks
  * - Use `Matrix2.transformVector` semantics (spatial transform).
  * - Computes: [m00*x + m10*y, m01*x + m11*y] (column-major convention).
  * - Uses interface for loose coupling.
  *
  * @param v - Vector to transform
  * @param matrix - Matrix with m00, m01, m10, m11 components
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @example
  * ```typescript
  * const v = new Vector2(1, 0);
  * const mat = Matrix2.fromRotation(Math.PI / 2); // 90° rotation
  * const result = Vector2.applyMatrix2(v, mat); // (0, 1)
  * ```
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public static applyMatrix2(
  v: ReadonlyVector2Like,
  matrix: ReadonlyMatrix2Like,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(
   matrix.m00 * v.x + matrix.m10 * v.y,
   matrix.m01 * v.x + matrix.m11 * v.y,
  );
 }

 /**
  * Transforms a vector by a 3x3 matrix (includes translation and perspective).
  *
  * @remarks
  * - Use `Matrix3.transformPoint` semantics (spatial transform + translation).
  * - For affine matrices (m02=0, m12=0, m22=1), computes:
  * `[m00*x + m10*y + m20, m01*x + m11*y + m21]`
  *
  * For projective matrices, divides by the homogeneous coordinate w.
  * When w ≈ 0, the point collapses to origin via `divideSafe` (returns 0).
  *
  * This treats the vector as a point (applies translation).
  * For direction vectors (no translation), use Matrix3.transformVector.
  *
  * Uses interface for loose coupling to avoid circular dependencies.
  *
  * @param v - Vector to transform (treated as a point)
  * @param matrix - 3x3 transformation matrix
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @example
  * ```typescript
  * const m = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 10, m21: 20, m22: 1 };
  * const v = { x: 1, y: 2 };
  * const result = Vector2.applyMatrix3(v, m); // (11, 22)
  * ```
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public static applyMatrix3(
  v: ReadonlyVector2Like,
  matrix: ReadonlyMatrix3Like,
  out?: Vector2,
 ): Vector2 {
  const { x, y } = v;
  const w = matrix.m02 * x + matrix.m12 * y + matrix.m22;
  const rx = matrix.m00 * x + matrix.m10 * y + matrix.m20;
  const ry = matrix.m01 * x + matrix.m11 * y + matrix.m21;

  // Optimization: skip division for affine matrices (w ≈ 1)
  if (isNearZero(w - 1)) {
   return this.ensureOut(out).set(rx, ry);
  }
  const invW = divideSafe(1, w);
  return this.ensureOut(out).set(rx * invW, ry * invW);
 }

 /**
  * Applies a full 2D transform (scale → rotate → translate) to a vector.
  *
  * @remarks
  * - Use `Transform2.transformPoint` semantics (spatial transform).
  * - Transform order: Scale first, then rotate, then translate.
  * - Uses interface for loose coupling.
  *
  * @param v - Vector to transform
  * @param transform - Transform2 with position, rotation (angle), and scale
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @example
  * ```typescript
  * const v = new Vector2(1, 0);
  * const t = Transform2.fromValues(10, 0, Math.PI, 2, 2); // pos(10,0), rot=180°, scale=2
  * const result = Vector2.applyTransform2(v, t); // scaled, rotated, translated
  * ```
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public static applyTransform2(
  v: ReadonlyVector2Like,
  transform: ReadonlyTransform2Like,
  out?: Vector2,
 ): Vector2 {
  const { cos, sin } = transform.rotation;
  const sx = v.x * transform.scale.x;
  const sy = v.y * transform.scale.y;
  return this.ensureOut(out).set(
   sx * cos - sy * sin + transform.position.x,
   sx * sin + sy * cos + transform.position.y,
  );
 }

 /**
  * Applies a complex number as a rotation to a vector.
  *
  * @remarks
  * - Use `Complex.apply` semantics (pure operator).
  * - The complex number is normalized before applying to ensure
  * a pure rotation without scaling. For unit complex numbers,
  * this is equivalent to complex multiplication.
  *
  * Mathematically equivalent to treating the vector as a complex number
  * and multiplying: (v.x + i*v.y) * (c.real + i*c.imag) / |c|
  *
  * @param v - Vector to transform
  * @param complex - Complex number (will be normalized first)
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @example
  * ```typescript
  * const c = { real: Math.SQRT1_2, imag: Math.SQRT1_2 }; // 45° rotation
  * const v = { x: 1, y: 0 };
  * const rotated = Vector2.applyComplex(v, c); // ≈ (0.707, 0.707)
  * ```
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public static applyComplex(
  v: ReadonlyVector2Like,
  complex: ReadonlyComplexLike,
  out?: Vector2,
 ): Vector2 {
  const mag = hypot(complex.real, complex.imag);
  if (isNearZero(mag)) {
   return this.clone(v, out);
  }
  const invMag = 1 / mag;
  const c = complex.real * invMag;
  const s = complex.imag * invMag;
  return this.ensureOut(out).set(c * v.x - s * v.y, s * v.x + c * v.y);
 }

 /* ======================================================================== */
 /* Static Comparison                                                        */
 /* ======================================================================== */

 /**
  * Tests whether v is exactly (0, 0).
  *
  * @param v - Vector to test
  * @returns True if both components are zero
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isZero(v: ReadonlyVector2Like): boolean {
  return v.x === 0 && v.y === 0;
 }

 /**
  * Tests whether both components are within epsilon of 0.
  *
  * @param v - Vector to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if |x| ≤ epsilon and |y| ≤ epsilon
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isNearZero(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return isNearZero(v.x, epsilon) && isNearZero(v.y, epsilon);
 }

 /**
  * Exact component-wise equality (bit-identical).
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param a - First vector
  * @param b - Second vector
  * @returns True if components are exactly identical
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static exactEquals(a: ReadonlyVector2Like, b: ReadonlyVector2Like): boolean {
  return a.x === b.x && a.y === b.y;
 }

 /**
  * Approximate component-wise equality using relative tolerance.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  * This scales with value magnitude, making it robust for both small and large values.
  *
  * @param a - First vector
  * @param b - Second vector
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if both component differences are within scaled epsilon
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static nearEquals(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  epsilon = EPSILON,
 ): boolean {
  return relativeEquals(a.x, b.x, epsilon) && relativeEquals(a.y, b.y, epsilon);
 }

 /**
  * Tests whether |length(v) - 1| ≤ EPSILON.
  *
  * @param v - Vector to test
  * @param epsilon - Tolerance for comparison. @defaultValue `EPSILON`
  * @returns True if v is unit length
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isUnit(v: ReadonlyVector2Like, epsilon: number = EPSILON): boolean {
  const magnitudeSq = v.x * v.x + v.y * v.y;
  return Math.abs(magnitudeSq - 1) <= epsilon;
 }

 /**
  * Tests whether both components are finite numbers.
  *
  * @param v - Vector to test
  * @returns True if both components are finite
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isFinite(v: ReadonlyVector2Like): boolean {
  return Number.isFinite(v.x) && Number.isFinite(v.y);
 }

 /**
  * Tests if any component is NaN.
  *
  * @param v - Vector to test
  * @returns True if any component is NaN
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasNaN(v: ReadonlyVector2Like): boolean {
  return Number.isNaN(v.x) || Number.isNaN(v.y);
 }

 /**
  * Tests if any component is infinite (±Infinity).
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @param v - Vector to test
  * @returns True if any component is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasInfinity(v: ReadonlyVector2Like): boolean {
  return (
   (!Number.isFinite(v.x) && !Number.isNaN(v.x)) || (!Number.isFinite(v.y) && !Number.isNaN(v.y))
  );
 }

 /**
  * Tests parallelism: |cross(a, b)| ≤ epsilon.
  *
  * @remarks
  * The epsilon is applied to the raw cross product, not normalized by
  * vector magnitudes. For scale-invariant comparison, normalize both
  * vectors first.
  *
  * @param a - First vector
  * @param b - Second vector
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if vectors are parallel
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isParallel(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  epsilon = EPSILON,
 ): boolean {
  if (isNearZero(Vector2.magnitudeSq(a)) || isNearZero(Vector2.magnitudeSq(b))) return false;
  return isNearZero(Vector2.cross(a, b), epsilon);
 }

 /**
  * Tests perpendicularity: |dot(a, b)| ≤ epsilon.
  *
  * @remarks
  * The epsilon is applied to the raw dot product, not normalized by
  * vector magnitudes. For scale-invariant comparison, normalize both
  * vectors first.
  *
  * @param a - First vector
  * @param b - Second vector
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if vectors are perpendicular
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isPerpendicular(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  epsilon = EPSILON,
 ): boolean {
  if (isNearZero(Vector2.magnitudeSq(a)) || isNearZero(Vector2.magnitudeSq(b))) return false;
  return isNearZero(Vector2.dot(a, b), epsilon);
 }

 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 /** X component. */
 public x: number;

 /** Y component. */
 public y: number;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 /** Creates a zero vector `(0, 0)`. */
 constructor();
 /** Creates a vector from components `(x, y)`. */
 constructor(x: number, y: number);
 /** Creates a vector from a tuple `[x, y]`. */
 constructor(array: [number, number]);
 /** Creates a vector from a plain object `{ x, y }`. */
 constructor(object: ReadonlyVector2Like);
 /**
  * Creates a new Vector2.
  *
  * @param xOrSource - X component, array, or object
  * @param y - Y component (when first arg is a number)
  * @throws {RangeError} If array has less than 2 elements
  * @throws {TypeError} If arguments are invalid
  *
  * @example
  * ```typescript
  * new Vector2();           // (0, 0)
  * new Vector2(3, 4);       // (3, 4)
  * new Vector2([3, 4]);     // (3, 4)
  * new Vector2({ x: 3, y: 4 }); // (3, 4)
  * ```
  */
 constructor(xOrSource?: number | [number, number] | ReadonlyVector2Like, y?: number) {
  if (xOrSource === undefined) {
   this.x = 0;
   this.y = 0;
  } else if (typeof xOrSource === 'number') {
   this.x = xOrSource;
   this.y = y ?? 0;
  } else if (Array.isArray(xOrSource)) {
   if (xOrSource.length < 2) {
    throw new RangeError('Vector2: array must have at least 2 elements');
   }
   this.x = xOrSource[0];
   this.y = xOrSource[1];
  } else if (typeof xOrSource === 'object' && 'x' in xOrSource && 'y' in xOrSource) {
   this.x = xOrSource.x;
   this.y = xOrSource.y;
  } else {
   throw new TypeError('Vector2: invalid constructor arguments');
  }
  // Pure math: no assertions - Infinity/NaN are valid IEEE 754 values
 }

 /* ======================================================================== */
 /* Instance Accessors                                                       */
 /* ======================================================================== */

 /**
  * Returns a normalized copy (or zero if this is zero).
  * @returns New unit vector
  * @category Accessor
  * @since 0.6.0
  */
 public get normalized(): Vector2 {
  const mag = hypot(this.x, this.y);
  if (isNearZero(mag)) {
   return new Vector2(0, 0);
  }
  const inv = 1 / mag;
  return new Vector2(this.x * inv, this.y * inv);
 }

 /**
  * Returns a negated copy.
  * @returns New negated vector
  * @category Accessor
  * @since 0.6.0
  */
 public get negated(): Vector2 {
  return new Vector2(-this.x, -this.y);
 }

 /**
  * Returns an absolute-valued copy.
  * @returns New absolute-valued vector
  * @category Accessor
  * @since 0.6.0
  */
 public get absolute(): Vector2 {
  return new Vector2(Math.abs(this.x), Math.abs(this.y));
 }

 /**
  * Returns a component-wise inverted copy (1/x, 1/y).
  *
  * @remarks
  * A zero component produces ±Infinity (IEEE 754: 1/0 = Infinity).
  * Use {@link inverse} or {@link inverseSafe} for validated alternatives
  * that guard against near-zero divisors.
  *
  * @returns New inverted vector
  * @category Accessor
  * @since 0.6.0
  */
 public get inverted(): Vector2 {
  return new Vector2(1 / this.x, 1 / this.y);
 }

 /* ======================================================================== */
 /* Instance Accessors (Swizzle)                                             */
 /* ======================================================================== */

 /**
  * Returns a copy of this vector (identity swizzle).
  * @returns New Vector2(x, y)
  * @category Accessor
  * @since 0.6.0
  */
 public get xy(): Vector2 {
  return new Vector2(this.x, this.y);
 }

 /**
  * Returns a copy with swapped components.
  * @returns New Vector2(y, x)
  * @category Accessor
  * @since 0.6.0
  */
 public get yx(): Vector2 {
  return new Vector2(this.y, this.x);
 }

 /**
  * Returns a vector with both components set to x.
  * @returns New Vector2(x, x)
  * @category Accessor
  * @since 0.6.0
  */
 public get xx(): Vector2 {
  return new Vector2(this.x, this.x);
 }

 /**
  * Returns a vector with both components set to y.
  * @returns New Vector2(y, y)
  * @category Accessor
  * @since 0.6.0
  */
 public get yy(): Vector2 {
  return new Vector2(this.y, this.y);
 }

 /* ======================================================================== */
 /* Instance Mutators                                                        */
 /* ======================================================================== */

 /**
  * Assigns both components.
  * @param x - New x component
  * @param y - New y component
  * @returns This for chaining
  * @category Mutator
  * @since 0.6.0
  */
 public set(x: number, y: number): this {
  this.x = x;
  this.y = y;
  return this;
 }

 /**
  * Copies from another vector.
  * @param v - Source vector
  * @returns This for chaining
  * @category Mutator
  * @since 0.6.0
  */
 public copy(v: ReadonlyVector2Like): this {
  return this.set(v.x, v.y);
 }

 /**
  * Sets this vector from polar coordinates.
  * @param angle - Angle in radians (CCW from +X)
  * @param radius - Distance from origin (default 1)
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 public setFromAngle(angle: number, radius = 1): this {
  const { cos, sin } = sinCos(angle);
  return this.set(cos * radius, sin * radius);
 }

 /**
  * Sets this vector from array values.
  * @param array - Source array
  * @param offset - Starting index (default 0)
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 public setFromArray(array: ArrayLike<number>, offset = 0): this {
  if (offset < 0 || offset + 2 > array.length) {
   throw new RangeError(
    `Vector2.setFromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  return this.set(array[offset]!, array[offset + 1]!);
 }

 /**
  * Sets this vector from a complex number.
  * @param complex - Source complex (real→x, imag→y)
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 public setFromComplex(complex: ReadonlyComplexLike): this {
  return this.set(complex.real, complex.imag);
 }

 /**
  * Resets both components to zero.
  * @returns This for chaining
  * @category Mutator
  * @since 0.6.0
  */
 public zero(): this {
  return this.set(0, 0);
 }

 /**
  * Sets both components to the same scalar.
  * @param s - Scalar value
  * @returns This for chaining
  * @category Mutator
  * @since 0.6.0
  */
 public setScalar(s: number): this {
  return this.set(s, s);
 }

 /**
  * Sets the x component.
  * @param x - New x value
  * @returns This for chaining
  * @category Mutator
  * @since 0.6.0
  */
 public setX(x: number): this {
  this.x = x;
  return this;
 }

 /**
  * Sets the y component.
  * @param y - New y value
  * @returns This for chaining
  * @category Mutator
  * @since 0.6.0
  */
 public setY(y: number): this {
  this.y = y;
  return this;
 }

 /**
  * Returns a component by index.
  * @param index - 0 for x, 1 for y
  * @returns The component value
  * @category Accessor
  * @since 0.6.0
  */
 public getComponent(index: 0 | 1): number {
  return index === 1 ? this.y : this.x;
 }

 /**
  * Sets a component by index.
  * @param index - 0 for x, 1 for y
  * @param value - New value
  * @returns This for chaining
  * @category Mutator
  * @since 0.6.0
  */
 public setComponent(index: 0 | 1, value: number): this {
  if (index === 1) {
   this.y = value;
  } else {
   this.x = value;
  }
  return this;
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Adds v component-wise.
  *
  * @param v - Vector to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public add(v: ReadonlyVector2Like): this {
  this.x += v.x;
  this.y += v.y;
  return this;
 }

 /**
  * Adds scalar to both components.
  *
  * @param s - Scalar to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public addScalar(s: number): this {
  this.x += s;
  this.y += s;
  return this;
 }

 /**
  * Subtracts v component-wise.
  *
  * @param v - Vector to subtract
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public subtract(v: ReadonlyVector2Like): this {
  this.x -= v.x;
  this.y -= v.y;
  return this;
 }

 /**
  * Subtracts scalar from both components.
  *
  * @param s - Scalar to subtract
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public subtractScalar(s: number): this {
  this.x -= s;
  this.y -= s;
  return this;
 }

 /**
  * Multiplies by v component-wise (Hadamard product).
  *
  * @param v - Vector multiplier
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public multiply(v: ReadonlyVector2Like): this {
  this.x *= v.x;
  this.y *= v.y;
  return this;
 }

 /**
  * Multiplies all components by a scalar.
  *
  * @param s - Scalar multiplier
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public multiplyScalar(s: number): this {
  this.x *= s;
  this.y *= s;
  return this;
 }

 /**
  * Divides by v component-wise (strict).
  *
  * @param v - Divisor vector
  * @returns This for chaining
  * @throws {RangeError} If any component of v is near zero
  *
  * @see {@link divideSafe} - Sets to 0 per component instead of throwing
  * @see {@link divideUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public divide(v: ReadonlyVector2Like): this {
  if (isNearZero(v.x) || isNearZero(v.y)) {
   throw new RangeError('Vector2.divide: cannot divide by near-zero component');
  }
  this.x = this.x / v.x;
  this.y = this.y / v.y;
  return this;
 }

 /**
  * Divides by v component-wise (safe).
  *
  * @param v - Divisor vector
  * @returns This for chaining (0 if divisor near zero)
  *
  * @see {@link divide} - Throws on near-zero component
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public divideSafe(v: ReadonlyVector2Like): this {
  this.x = isNearZero(v.x) ? 0 : this.x / v.x;
  this.y = isNearZero(v.y) ? 0 : this.y / v.y;
  return this;
 }

 /**
  * Divides by v component-wise (unchecked).
  *
  * @remarks
  * **Precondition:** `v.x ≠ 0` and `v.y ≠ 0`.
  *
  * @param v - Divisor vector (must have non-zero components)
  * @returns This for chaining
  *
  * @see {@link divide} - Throws on near-zero component
  * @see {@link divideSafe} - Returns 0 per component on near-zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public divideUnchecked(v: ReadonlyVector2Like): this {
  this.x = this.x / v.x;
  this.y = this.y / v.y;
  return this;
 }

 /**
  * Divides by scalar (strict).
  *
  * @remarks
  * For safe division that returns zeros, use {@link divideScalarSafe}.
  * For hot paths, use {@link divideScalarUnchecked}.
  *
  * @param s - Scalar divisor
  * @returns This for chaining
  * @throws {RangeError} If scalar is near zero
  *
  * @see {@link divideScalarSafe} - Returns zero vector on near-zero divisor
  * @see {@link divideScalarUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public divideScalar(s: number): this {
  if (isNearZero(s)) {
   throw new RangeError('Vector2.divideScalar: cannot divide by zero or near-zero scalar');
  }
  const inv = 1 / s;
  this.x *= inv;
  this.y *= inv;
  return this;
 }

 /**
  * Safe scalar division. If |s| ≤ EPSILON, sets to (0, 0).
  * @param s - Scalar divisor
  * @returns This for chaining
  *
  * @see {@link divideScalar} - Throws for zero divisor
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public divideScalarSafe(s: number): this {
  if (isNearZero(s)) {
   return this.set(0, 0);
  }
  const inv = 1 / s;
  this.x *= inv;
  this.y *= inv;
  return this;
 }

 /**
  * Unchecked scalar division for hot paths.
  *
  * @remarks
  * **Precondition:** Scalar must be non-zero.
  * Calling with zero scalar produces Infinity/NaN components.
  *
  * Use only when you can guarantee valid input (e.g., after explicit check).
  * For safe division, use {@link divideScalarSafe}.
  *
  * @param s - Scalar divisor (must be non-zero)
  * @returns This for chaining
  *
  * @see {@link divideScalar} - Throws for zero divisor
  * @see {@link divideScalarSafe} - Returns zero vector for zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public divideScalarUnchecked(s: number): this {
  const inv = 1 / s;
  this.x *= inv;
  this.y *= inv;
  return this;
 }

 /**
  * Negates both components.
  *
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public negate(): this {
  this.x = -this.x;
  this.y = -this.y;
  return this;
 }

 /**
  * Adds a scaled vector: this += scale * v.
  * @param v - Vector to scale and add
  * @param scale - Scale factor
  * @returns This for chaining
  * @category Arithmetic
  * @since 0.6.0
  */
 public addScaledVector(v: ReadonlyVector2Like, scale: number): this {
  this.x += v.x * scale;
  this.y += v.y * scale;
  return this;
 }

 /**
  * Fused multiply-add: this = this * scalar + v.
  * @param scalar - Scalar multiplier
  * @param v - Vector to add
  * @returns This for chaining
  * @category Arithmetic
  * @since 0.7.0
  */
 public fma(scalar: number, v: ReadonlyVector2Like): this {
  this.x = this.x * scalar + v.x;
  this.y = this.y * scalar + v.y;
  return this;
 }

 /**
  * Component-wise modulo.
  * @param v - Divisor vector
  * @returns This for chaining
  * @category Arithmetic
  * @since 0.6.0
  */
 public mod(v: ReadonlyVector2Like): this {
  this.x = scalarModule(this.x, v.x);
  this.y = scalarModule(this.y, v.y);
  return this;
 }

 /**
  * Scalar modulo on both components.
  * @param s - Scalar divisor
  * @returns This for chaining
  * @category Arithmetic
  * @since 0.6.0
  */
 public modScalar(s: number): this {
  this.x = scalarModule(this.x, s);
  this.y = scalarModule(this.y, s);
  return this;
 }

 /**
  * Component-wise reciprocal.
  * @returns This for chaining
  * @throws {RangeError} If any component is zero
  *
  * @see {@link inverseSafe} - Returns 0 per component on near-zero value
  * @see {@link inverseUnchecked} - No validation
  *
  * @category Transform
  * @since 0.6.0
  */
 public inverse(): this {
  if (isNearZero(this.x) || isNearZero(this.y)) {
   throw new RangeError('Vector2.inverse: cannot invert near-zero component');
  }
  this.x = 1 / this.x;
  this.y = 1 / this.y;
  return this;
 }

 /**
  * Safe reciprocal. Components near zero become 0.
  * @returns This for chaining
  *
  * @see {@link inverse} - Throws on near-zero component
  *
  * @category Transform
  * @since 0.6.0
  */
 public inverseSafe(): this {
  this.x = isNearZero(this.x) ? 0 : 1 / this.x;
  this.y = isNearZero(this.y) ? 0 : 1 / this.y;
  return this;
 }

 /**
  * Unchecked reciprocal for hot paths.
  *
  * @remarks
  * **Precondition:** Both components must be non-zero.
  * Calling with zero produces Infinity.
  *
  * @returns This for chaining
  *
  * @see {@link inverse} - Throws on near-zero component
  * @see {@link inverseSafe} - Returns 0 per component on near-zero value
  *
  * @category Transform
  * @since 0.7.0
  */
 public inverseUnchecked(): this {
  this.x = 1 / this.x;
  this.y = 1 / this.y;
  return this;
 }

 /**
  * Swaps x and y components.
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public swap(): this {
  const temporary = this.x;
  this.x = this.y;
  this.y = temporary;
  return this;
 }

 /* ======================================================================== */
 /* Instance Geometry                                                        */
 /* ======================================================================== */

 /**
  * Dot product with v.
  * @param v - Second operand
  * @returns Scalar dot product
  * @category Geometry
  * @since 0.6.0
  */
 public dot(v: ReadonlyVector2Like): number {
  return this.x * v.x + this.y * v.y;
 }

 /**
  * 2D scalar cross product with v.
  * @param v - Second operand
  * @returns Scalar cross product
  * @category Geometry
  * @since 0.6.0
  */
 public cross(v: ReadonlyVector2Like): number {
  return this.x * v.y - this.y * v.x;
 }

 /**
  * Euclidean magnitude (length).
  * @returns The Euclidean norm
  *
  * @category Geometry
  * @since 0.6.0
  */
 public magnitude(): number {
  return hypot(this.x, this.y);
 }

 /**
  * Squared length.
  * @returns The squared length
  * @category Geometry
  * @since 0.6.0
  */
 public magnitudeSq(): number {
  return this.x * this.x + this.y * this.y;
 }

 /**
  * Manhattan length.
  * @returns The Manhattan norm
  * @category Geometry
  * @since 0.6.0
  */
 public manhattanLength(): number {
  return Math.abs(this.x) + Math.abs(this.y);
 }

 /**
  * Chebyshev length (L∞ norm).
  * @returns The Chebyshev norm
  * @category Geometry
  * @since 0.7.0
  */
 public chebyshevLength(): number {
  return Math.max(Math.abs(this.x), Math.abs(this.y));
 }

 /**
  * Euclidean distance to v.
  * @param v - Target vector
  * @returns The Euclidean distance
  * @category Geometry
  * @since 0.6.0
  */
 public distanceTo(v: ReadonlyVector2Like): number {
  return Vector2.distance(this, v);
 }

 /**
  * Squared distance to v.
  * @param v - Target vector
  * @returns The squared distance
  * @category Geometry
  * @since 0.6.0
  */
 public distanceSquaredTo(v: ReadonlyVector2Like): number {
  return Vector2.distanceSquared(this, v);
 }

 /**
  * Manhattan (L1) distance to v.
  * @param v - Target vector
  * @returns The Manhattan distance
  * @category Geometry
  * @since 0.6.0
  */
 public manhattanDistanceTo(v: ReadonlyVector2Like): number {
  return Vector2.manhattanDistance(this, v);
 }

 /**
  * Chebyshev (L∞) distance to v.
  * @param v - Target vector
  * @returns The Chebyshev distance
  * @category Geometry
  * @since 0.7.0
  */
 public chebyshevDistanceTo(v: ReadonlyVector2Like): number {
  return Vector2.chebyshevDistance(this, v);
 }

 /**
  * Returns the sum of components x + y.
  *
  * @remarks
  * A fundamental scalar reduction used as a building block for Manhattan norms,
  * barycentric coordinate validation, diagonal matrix traces, and divergence
  * approximations. Retained as a core primitive for downstream consumers.
  *
  * @returns Scalar sum
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public sumComponents(): number {
  return this.x + this.y;
 }

 /**
  * Unit direction from this to target.
  * @param target - Target vector
  * @returns New unit direction vector
  * @category Direction
  * @since 0.6.0
  */
 public directionTo(target: ReadonlyVector2Like): Vector2 {
  return Vector2.direction(this, target);
 }

 /**
  * Unit direction from this to target, returning (0, 0) if coincident.
  * @param target - Target vector
  * @returns Unit direction vector, or (0, 0) if coincident
  *
  * @see {@link directionTo} - Throws on coincident points
  *
  * @category Direction
  * @since 0.7.0
  */
 public directionToSafe(target: ReadonlyVector2Like): Vector2 {
  return Vector2.directionSafe(this, target);
 }

 /**
  * Unit direction from this to target without validation.
  *
  * @remarks
  * **Precondition:** `this` and `target` must not be coincident.
  * Calling with coincident points produces Infinity/NaN.
  *
  * @param target - Target vector (must differ from this)
  * @returns Unit direction vector
  *
  * @see {@link directionTo} - Throws on coincident points
  * @see {@link directionToSafe} - Returns (0,0) on coincident points
  *
  * @category Direction
  * @since 0.7.0
  */
 public directionToUnchecked(target: ReadonlyVector2Like): Vector2 {
  return Vector2.directionUnchecked(this, target);
 }

 /**
  * Heading angle from +X axis.
  * @returns Angle in radians from +X axis
  * @category Accessor
  * @since 0.6.0
  */
 public get angle(): number {
  return atan2(this.y, this.x);
 }

 /**
  * Sets the direction angle while preserving magnitude.
  * @param radians - Angle in radians (CCW positive)
  *
  * @category Accessor
  * @since 0.6.0
  */
 public set angle(radians: number) {
  this.setAngle(radians);
 }

 /**
  * Signed angle to v.
  * @param v - Target vector
  * @returns Signed angle in radians
  * @category Direction
  * @since 0.6.0
  */
 public angleTo(v: ReadonlyVector2Like): number {
  return Vector2.angleTo(this, v);
 }

 /**
  * Unsigned angle between this and v.
  * @param v - Target vector
  * @returns Unsigned angle in radians
  * @category Direction
  * @since 0.6.0
  */
 public angleBetween(v: ReadonlyVector2Like): number {
  return Vector2.angleBetween(this, v);
 }

 /* ======================================================================== */
 /* Instance Transforms                                                      */
 /* ======================================================================== */

 /**
  * Normalizes to unit length.
  * @returns This for chaining
  * @throws {RangeError} If zero length
  *
  * @see {@link normalizeSafe} - Returns (0,0) on zero-length vector
  * @see {@link normalizeUnchecked} - No validation
  *
  * @category Transform
  * @since 0.6.0
  */
 public normalize(): this {
  const length = this.magnitude();
  if (isNearZero(length)) {
   throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');
  }
  return this.multiplyScalar(1 / length);
 }

 /**
  * Safe normalization. Sets to (0, 0) if zero length.
  * @returns This for chaining
  *
  * @see {@link normalize} - Throws on zero-length vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public normalizeSafe(): this {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   return this.set(0, 0);
  }
  return this.multiplyScalar(1 / mag);
 }

 /**
  * Unchecked normalization for hot paths.
  *
  * @remarks
  * **Precondition:** Vector must have non-zero length.
  * Calling with zero-length vector produces NaN/Infinity components.
  *
  * Use only when you can guarantee valid input (e.g., after explicit check).
  * For safe normalization, use {@link normalizeSafe}.
  * For normalization with error throwing, use {@link normalize}.
  *
  * @returns This for chaining
  *
  * @see {@link normalize} - Throws on zero-length vector
  * @see {@link normalizeSafe} - Returns (0,0) on zero-length vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public normalizeUnchecked(): this {
  const lengthSq = this.x * this.x + this.y * this.y;
  const inv = 1 / Math.sqrt(lengthSq);
  this.x *= inv;
  this.y *= inv;
  return this;
 }

 /**
  * Sets the length.
  * @param newMagnitude - Desired magnitude
  * @returns This for chaining
  * @throws {RangeError} If zero length or negative
  *
  * @see {@link setMagnitudeSafe} - Returns fallback on zero-length vector
  *
  * @category Transform
  * @since 0.6.0
  */
 public setMagnitude(newMagnitude: number): this {
  if (newMagnitude < 0) {
   throw new RangeError('Vector2.setMagnitude: length must be non-negative');
  }
  const length = this.magnitude();
  if (isNearZero(length)) {
   throw new RangeError('Vector2.setMagnitude: cannot set length on zero vector');
  }
  return this.multiplyScalar(newMagnitude / length);
 }

 /**
  * Safe setMagnitude. Zero vectors become (newMagnitude, 0).
  * @param newMagnitude - Desired magnitude
  * @returns This for chaining
  *
  * @see {@link setMagnitude} - Throws on zero-length vector or negative magnitude
  *
  * @category Transform
  * @since 0.6.0
  */
 public setMagnitudeSafe(newMagnitude: number): this {
  const nn = newMagnitude < 0 ? 0 : newMagnitude;
  const length = this.magnitude();
  if (isNearZero(length)) {
   return this.set(nn, 0);
  }
  return this.multiplyScalar(nn / length);
 }

 /**
  * Sets magnitude without validation (hot path).
  *
  * @remarks
  * **Precondition:** `newMagnitude >= 0` and this vector has non-zero length.
  * Zero-length vectors produce NaN. Negative magnitudes scale backwards.
  *
  * @param newMagnitude - Desired magnitude (must be non-negative)
  * @returns This for chaining
  *
  * @see {@link setMagnitude} - Throws on invalid input
  * @see {@link setMagnitudeSafe} - Handles edge cases gracefully
  *
  * @category Transform
  * @since 0.7.0
  */
 public setMagnitudeUnchecked(newMagnitude: number): this {
  const length = Math.sqrt(this.x * this.x + this.y * this.y);
  return this.multiplyScalar(newMagnitude / length);
 }

 /**
  * Sets angle (direction) while preserving length.
  * @param angle - New heading in radians
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public setAngle(angle: number): this {
  const magnitude = this.magnitude();
  const { cos, sin } = sinCos(angle);
  return this.set(cos * magnitude, sin * magnitude);
 }

 /**
  * Clamps components between min and max vectors.
  * @param minV - Per-component minima
  * @param maxV - Per-component maxima
  * @returns This for chaining
  * @category Constraint
  * @since 0.6.0
  */
 public clamp(minV: ReadonlyVector2Like, maxV: ReadonlyVector2Like): this {
  this.x = clamp(this.x, minV.x, maxV.x);
  this.y = clamp(this.y, minV.y, maxV.y);
  return this;
 }

 /**
  * Clamps components between scalar bounds.
  * @param min - Minimum scalar
  * @param max - Maximum scalar
  * @returns This for chaining
  * @category Constraint
  * @since 0.6.0
  */
 public clampScalar(min: number, max: number): this {
  this.x = clamp(this.x, min, max);
  this.y = clamp(this.y, min, max);
  return this;
 }

 /**
  * Clamps length to range.
  * @param minLength - Minimum magnitude
  * @param maxLength - Maximum magnitude
  * @returns This for chaining
  * @category Constraint
  * @since 0.6.0
  */
 public clampMagnitude(minLength: number, maxLength: number): this {
  const length = this.magnitude();
  if (isNearZero(length)) return this;
  const newMagnitude = clamp(length, minLength, maxLength);
  return this.multiplyScalar(newMagnitude / length);
 }

 /**
  * Limits length to maximum.
  * @param maxLength - Maximum allowed magnitude
  * @returns This for chaining
  * @category Constraint
  * @since 0.6.0
  */
 public limit(maxLength: number): this {
  const lengthSq = this.magnitudeSq();
  if (lengthSq > maxLength * maxLength && lengthSq > 0) {
   const mag = hypot(this.x, this.y);
   const scale = maxLength / mag;
   this.multiplyScalar(scale);
  }
  return this;
 }

 /**
  * Component-wise minimum with v.
  * @param v - Other vector
  * @returns This for chaining
  * @category Constraint
  * @since 0.6.0
  */
 public min(v: ReadonlyVector2Like): this {
  this.x = Math.min(this.x, v.x);
  this.y = Math.min(this.y, v.y);
  return this;
 }

 /**
  * Component-wise maximum with v.
  * @param v - Other vector
  * @returns This for chaining
  * @category Constraint
  * @since 0.6.0
  */
 public max(v: ReadonlyVector2Like): this {
  this.x = Math.max(this.x, v.x);
  this.y = Math.max(this.y, v.y);
  return this;
 }

 /**
  * Component-wise minimum with scalar.
  * @param s - Scalar bound
  * @returns This for chaining
  *
  * @category Constraint
  * @since 0.7.0
  */
 public minScalar(s: number): this {
  this.x = Math.min(this.x, s);
  this.y = Math.min(this.y, s);
  return this;
 }

 /**
  * Component-wise maximum with scalar.
  * @param s - Scalar bound
  * @returns This for chaining
  *
  * @category Constraint
  * @since 0.7.0
  */
 public maxScalar(s: number): this {
  this.x = Math.max(this.x, s);
  this.y = Math.max(this.y, s);
  return this;
 }

 /**
  * Applies Math.abs to both components.
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public abs(): this {
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);
  return this;
 }

 /**
  * Component-wise sign.
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 public sign(): this {
  this.x = scalarSign(this.x);
  this.y = scalarSign(this.y);
  return this;
 }

 /**
  * Applies Math.floor to both components.
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public floor(): this {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
 }

 /**
  * Applies Math.ceil to both components.
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public ceil(): this {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
 }

 /**
  * Applies Math.round to both components.
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public round(): this {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
 }

 /**
  * Applies Math.trunc to both components (rounds towards zero).
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 public trunc(): this {
  this.x = Math.trunc(this.x);
  this.y = Math.trunc(this.y);
  return this;
 }

 /**
  * Projects onto axis.
  * @param axis - Projection axis
  * @returns This for chaining
  * @throws {RangeError} If axis has zero length
  *
  * @see {@link projectSafe} - Returns (0,0) on zero-length axis
  * @see {@link projectUnchecked} - No validation
  *
  * @category Transform
  * @since 0.6.0
  */
 public project(axis: ReadonlyVector2Like): this {
  const denom = Vector2.magnitudeSq(axis);
  if (isNearZero(denom)) {
   throw new RangeError('Vector2.project: cannot project onto zero-length axis');
  }
  const s = this.dot(axis) / denom;
  return this.set(axis.x * s, axis.y * s);
 }

 /**
  * Safe projection onto axis. Returns (0,0) if axis has zero length.
  * @param axis - Projection axis
  * @returns This for chaining
  *
  * @see {@link project} - Throws on zero-length axis
  *
  * @category Transform
  * @since 0.6.0
  */
 public projectSafe(axis: ReadonlyVector2Like): this {
  const denom = Vector2.magnitudeSq(axis);
  if (isNearZero(denom)) {
   return this.set(0, 0);
  }
  const s = this.dot(axis) / denom;
  return this.set(axis.x * s, axis.y * s);
 }

 /**
  * Unchecked projection onto axis (hot path).
  * @param axis - Projection axis (must have non-zero length)
  * @returns This for chaining
  *
  * @see {@link project} - Throws on zero-length axis
  * @see {@link projectSafe} - Returns (0,0) on zero-length axis
  *
  * @category Transform
  * @since 0.7.0
  */
 public projectUnchecked(axis: ReadonlyVector2Like): this {
  const denom = Vector2.magnitudeSq(axis);
  const s = this.dot(axis) / denom;
  return this.set(axis.x * s, axis.y * s);
 }

 /**
  * Projects onto unit axis.
  * @param unitAxis - Unit-length axis
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public projectOnUnit(unitAxis: ReadonlyVector2Like): this {
  assert(
   isNearZero(Vector2.magnitudeSq(unitAxis) - 1),
   'Vector2.projectOnUnit: unitAxis must be unit-length. Use Vector2.project() for non-unit axes.',
  );
  const s = this.dot(unitAxis);
  return this.set(unitAxis.x * s, unitAxis.y * s);
 }

 /**
  * Reflects about unit normal.
  * @param unitNormal - Unit-length normal
  * @returns This for chaining
  * @throws {RangeError} If unitNormal is not unit length
  *
  * @see {@link reflectSafe} - Normalizes normal first
  *
  * @category Transform
  * @since 0.6.0
  */
 public reflect(unitNormal: ReadonlyVector2Like): this {
  const magSq = Vector2.magnitudeSq(unitNormal);
  if (!scalarNearEquals(magSq, 1)) {
   throw new RangeError('Vector2.reflect: normal must be unit length');
  }
  const d2 = 2 * this.dot(unitNormal);
  return this.set(this.x - d2 * unitNormal.x, this.y - d2 * unitNormal.y);
 }

 /**
  * Safe reflection.
  * @param normal - Normal (need not be unit)
  * @returns This for chaining
  *
  * @see {@link reflect} - Throws if normal is not unit length
  *
  * @category Transform
  * @since 0.6.0
  */
 public reflectSafe(normal: ReadonlyVector2Like): this {
  const mag = hypot(normal.x, normal.y);
  if (isNearZero(mag)) {
   return this;
  }
  const invLength = 1 / mag;
  const nx = normal.x * invLength;
  const ny = normal.y * invLength;
  const d2 = 2 * (this.x * nx + this.y * ny);
  return this.set(this.x - d2 * nx, this.y - d2 * ny);
 }

 /**
  * Reflection without validation (hot path).
  *
  * @remarks
  * **Precondition:** `unitNormal` must be unit length.
  * If not unit, the result will be geometrically incorrect but not NaN.
  *
  * @param unitNormal - Unit-length normal (must be unit)
  * @returns This for chaining
  *
  * @see {@link reflect} - Throws if normal is not unit
  * @see {@link reflectSafe} - Normalizes normal first
  *
  * @category Transform
  * @since 0.7.0
  */
 public reflectUnchecked(unitNormal: ReadonlyVector2Like): this {
  const d2 = 2 * this.dot(unitNormal);
  return this.set(this.x - d2 * unitNormal.x, this.y - d2 * unitNormal.y);
 }

 /**
  * Rotates by ±90°.
  * @param clockwise - CW if true, CCW if false
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
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
  * Rotates by angle.
  * @param angle - Rotation angle
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  return this.rotateCS(cos, sin);
 }

 /**
  * Rotates using precomputed cos/sin.
  * @param c - Cosine
  * @param s - Sine
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public rotateCS(c: number, s: number): this {
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;
  return this.set(rx, ry);
 }

 /**
  * Rotates around center.
  * @param center - Pivot point
  * @param angle - Rotation angle
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public rotateAround(center: ReadonlyVector2Like, angle: number): this {
  return this.subtract(center).rotate(angle).add(center);
 }

 /**
  * Rotates around center using precomputed cos/sin.
  * @param center - Pivot point
  * @param c - Cosine of angle
  * @param s - Sine of angle
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public rotateAroundCS(center: ReadonlyVector2Like, c: number, s: number): this {
  const tx = this.x - center.x;
  const ty = this.y - center.y;
  this.x = tx * c - ty * s + center.x;
  this.y = tx * s + ty * c + center.y;
  return this;
 }

 /**
  * Vector rejection: removes projection onto axis.
  * @param onto - Axis to reject from
  * @returns This for chaining
  * @throws {RangeError} If onto has zero length
  *
  * @see {@link rejectSafe} - Returns copy of this on zero-length axis
  * @see {@link rejectUnchecked} - No validation
  *
  * @category Transform
  * @since 0.6.0
  */
 public reject(onto: ReadonlyVector2Like): this {
  const denom = Vector2.magnitudeSq(onto);
  if (isNearZero(denom)) {
   throw new RangeError('Vector2.reject: cannot reject from zero-length vector');
  }
  const s = this.dot(onto) / denom;
  return this.set(this.x - onto.x * s, this.y - onto.y * s);
 }

 /**
  * Safe rejection. Returns copy of this if onto has zero length.
  * @param onto - Axis to reject from
  * @returns This for chaining
  *
  * @see {@link reject} - Throws on zero-length axis
  *
  * @category Transform
  * @since 0.7.0
  */
 public rejectSafe(onto: ReadonlyVector2Like): this {
  const denom = Vector2.magnitudeSq(onto);
  if (isNearZero(denom)) {
   return this;
  }
  const s = this.dot(onto) / denom;
  return this.set(this.x - onto.x * s, this.y - onto.y * s);
 }

 /**
  * Unchecked rejection (hot path).
  * @param onto - Axis to reject from (must have non-zero length)
  * @returns This for chaining
  *
  * @see {@link reject} - Throws on zero-length axis
  * @see {@link rejectSafe} - Returns copy of this on zero-length axis
  *
  * @category Transform
  * @since 0.7.0
  */
 public rejectUnchecked(onto: ReadonlyVector2Like): this {
  const denom = Vector2.magnitudeSq(onto);
  const s = this.dot(onto) / denom;
  return this.set(this.x - onto.x * s, this.y - onto.y * s);
 }

 /**
  * Rejection onto a unit axis (hot path).
  *
  * @remarks
  * Use when you know the axis is already normalized.
  *
  * @param unitAxis - Unit-length axis
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 public rejectOnUnit(unitAxis: ReadonlyVector2Like): this {
  const s = this.dot(unitAxis);
  return this.set(this.x - unitAxis.x * s, this.y - unitAxis.y * s);
 }

 /**
  * Cross product: vector × scalar = (s*y, -s*x).
  * @param s - Scalar factor
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public crossScalarRight(s: number): this {
  const newX = s * this.y;
  const newY = -s * this.x;
  return this.set(newX, newY);
 }

 /**
  * Cross product: scalar × vector = (-s*y, s*x).
  * @param s - Scalar factor
  * @returns This for chaining
  * @category Transform
  * @since 0.6.0
  */
 public crossScalarLeft(s: number): this {
  const newX = -s * this.y;
  const newY = s * this.x;
  return this.set(newX, newY);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation towards end.
  * @param end - Target vector
  * @param t - Interpolation factor
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.6.0
  */
 public lerp(end: ReadonlyVector2Like, t: number): this {
  this.x = lerp(this.x, end.x, t);
  this.y = lerp(this.y, end.y, t);
  return this;
 }

 /**
  * Clamped linear interpolation.
  * @param end - Target vector
  * @param t - Interpolation factor (clamped)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.6.0
  */
 public lerpClamped(end: ReadonlyVector2Like, t: number): this {
  return this.lerp(end, saturate(t));
 }

 /**
  * Spherical linear interpolation.
  * @param end - Target vector
  * @param t - Interpolation factor
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public slerp(end: ReadonlyVector2Like, t: number): this {
  Vector2.slerp(this, end, t, this);
  return this;
 }

 /**
  * Spherical linear interpolation with t clamped to [0, 1].
  * @param end - Target vector
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public slerpClamped(end: ReadonlyVector2Like, t: number): this {
  return this.slerp(end, saturate(t));
 }

 /**
  * Smooth step interpolation.
  * @param end - Target vector
  * @param t - Interpolation factor
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public smoothStep(end: ReadonlyVector2Like, t: number): this {
  Vector2.smoothStep(this, end, t, this);
  return this;
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Tests if exactly zero.
  * @returns True if both components are zero
  *
  * @see {@link isNearZero} For tolerance-based comparison.
  *
  * @category Comparison
  * @since 0.6.0
  */
 public isZero(): boolean {
  return this.x === 0 && this.y === 0;
 }

 /**
  * Exact equality with v (bit-identical).
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param v - Vector to compare
  * @returns True if exactly identical
  *
  * @category Comparison
  * @since 0.6.0
  */
 public exactEquals(v: ReadonlyVector2Like): boolean {
  return Vector2.exactEquals(this, v);
 }

 /**
  * Approximate equality with v using relative tolerance.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @param v - Vector to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @category Comparison
  * @since 0.6.0
  */
 public nearEquals(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return relativeEquals(this.x, v.x, epsilon) && relativeEquals(this.y, v.y, epsilon);
 }

 /**
  * Tests if this vector is near zero (both components within epsilon).
  *
  * @param epsilon - Tolerance for comparison
  * @returns True if both components are within epsilon of zero
  *
  * @category Comparison
  * @since 0.6.0
  */
 public isNearZero(epsilon = EPSILON): boolean {
  return Vector2.isNearZero(this, epsilon);
 }

 /**
  * Tests if unit length.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if |magnitudeSq - 1| ≤ epsilon
  * @category Comparison
  * @since 0.6.0
  */
 public isUnit(epsilon: number = EPSILON): boolean {
  return Vector2.isUnit(this, epsilon);
 }

 /**
  * Tests if both components are finite.
  * @returns True if finite
  * @category Comparison
  * @since 0.6.0
  */
 public isFinite(): boolean {
  return Number.isFinite(this.x) && Number.isFinite(this.y);
 }

 /**
  * Tests if any component is NaN.
  * @returns True if any component is NaN
  * @category Comparison
  * @since 0.7.0
  */
 public hasNaN(): boolean {
  return Number.isNaN(this.x) || Number.isNaN(this.y);
 }

 /**
  * Tests if any component is infinite (±Infinity).
  * @returns True if any component is ±Infinity
  * @category Comparison
  * @since 0.7.0
  */
 public hasInfinity(): boolean {
  return Vector2.hasInfinity(this);
 }

 /**
  * Tests parallelism with v.
  * @remarks See {@link Vector2.isParallel} for scale-dependence note.
  * @param v - Vector to compare
  * @param epsilon - Tolerance
  * @returns True if parallel
  * @category Comparison
  * @since 0.6.0
  */
 public isParallelTo(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return Vector2.isParallel(this, v, epsilon);
 }

 /**
  * Tests perpendicularity with v.
  * @remarks See {@link Vector2.isPerpendicular} for scale-dependence note.
  * @param v - Vector to compare
  * @param epsilon - Tolerance
  * @returns True if perpendicular
  * @category Comparison
  * @since 0.6.0
  */
 public isPerpendicularTo(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return Vector2.isPerpendicular(this, v, epsilon);
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Returns a shallow clone.
  * @returns New Vector2 with same components
  * @category Conversion
  * @since 0.6.0
  */
 public clone(): Vector2 {
  return new Vector2(this.x, this.y);
 }

 /**
  * Writes to array or typed array.
  * @param out - Destination array
  * @param offset - Write offset
  * @returns The output array
  * @category Conversion
  * @since 0.6.0
  */
 public toArray<T extends ArrayLike<number> & { [index: number]: number }>(
  out?: T,
  offset = 0,
 ): T | [number, number] {
  if (!out) {
   return [this.x, this.y];
  }
  out[offset] = this.x;
  out[offset + 1] = this.y;
  return out;
 }

 /**
  * Returns plain object { x, y }.
  * @returns Object with x and y properties
  * @category Conversion
  * @since 0.6.0
  */
 public toObject(): { x: number; y: number } {
  return { x: this.x, y: this.y };
 }

 /**
  * Alias for toObject (JSON serialization).
  * @returns Object with x and y properties
  * @category Conversion
  * @since 0.6.0
  */
 public toJSON(): { x: number; y: number } {
  return this.toObject();
 }

 /**
  * Returns string representation.
  * @param precision - Decimal places. @defaultValue `4`
  * @returns Formatted string
  *
  * @category Conversion
  * @since 0.6.0
  */
 public toString(precision = 4): string {
  return `Vector2(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)})`;
 }

 /**
  * Iterator for array destructuring.
  * @returns Iterator yielding x then y
  * @category Conversion
  * @since 0.7.0
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.x;
  yield this.y;
 }

 /**
  * Converts this vector to a complex-like object.
  *
  * @remarks
  * Returns a plain object compatible with ComplexLike interface.
  * Does not create a Complex instance to avoid circular dependencies.
  *
  * @returns Object with real (x) and imag (y) properties
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toComplexLike(): { real: number; imag: number } {
  return { real: this.x, imag: this.y };
 }

 /* ======================================================================== */
 /* Instance Accessors (Readonly)                                            */
 /* ======================================================================== */

 /**
  * Returns a copy with x negated.
  * @returns New Vector2(-x, y)
  * @category Accessor
  * @since 0.6.0
  */
 public get flippedX(): Vector2 {
  return new Vector2(-this.x, this.y);
 }

 /**
  * Returns a copy with y negated.
  * @returns New Vector2(x, -y)
  * @category Accessor
  * @since 0.6.0
  */
 public get flippedY(): Vector2 {
  return new Vector2(this.x, -this.y);
 }

 /* ======================================================================== */
 /* Instance Transforms (Step)                                               */
 /* ======================================================================== */

 /**
  * Applies step function: sets components to 0 where < edge, else 1.
  * @param edge - Threshold vector
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 public step(edge: ReadonlyVector2Like): this {
  this.x = scalarStep(edge.x, this.x);
  this.y = scalarStep(edge.y, this.y);
  return this;
 }

 /* ======================================================================== */
 /* Instance Transform Integration                                           */
 /* ======================================================================== */

 /**
  * Applies a Rotation2 (unit complex) to this vector in place.
  *
  * @remarks
  * - Use `Rotation2.apply` semantics (pure operator).
  * - Use for chaining operations.
  *
  * @param rotation - Rotation2 with cos and sin components
  * @returns This for chaining
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public applyRotation2(rotation: ReadonlyRotation2Like): this {
  const rx = rotation.cos * this.x - rotation.sin * this.y;
  const ry = rotation.sin * this.x + rotation.cos * this.y;
  return this.set(rx, ry);
 }

 /**
  * Transforms this vector by a 2x2 matrix in place.
  * @remarks
  * - Use `Matrix2.transformVector` semantics (spatial transform).
  * - Use for chaining operations.
  *
  * @param matrix - Matrix with m00, m01, m10, m11 components
  * @returns This for chaining
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public applyMatrix2(matrix: ReadonlyMatrix2Like): this {
  const rx = matrix.m00 * this.x + matrix.m10 * this.y;
  const ry = matrix.m01 * this.x + matrix.m11 * this.y;
  return this.set(rx, ry);
 }

 /**
  * Transforms this vector by a 3x3 matrix in place (includes translation and perspective).
  *
  * @remarks
  * - Use `Matrix3.transformPoint` semantics (spatial transform + translation).
  * - Treats this vector as a point (applies translation).
  * - For projective matrices, divides by the homogeneous coordinate w.
  *
  * @param matrix - 3x3 transformation matrix
  * @returns This for chaining
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public applyMatrix3(matrix: ReadonlyMatrix3Like): this {
  const { x, y } = this;
  const w = matrix.m02 * x + matrix.m12 * y + matrix.m22;
  const rx = matrix.m00 * x + matrix.m10 * y + matrix.m20;
  const ry = matrix.m01 * x + matrix.m11 * y + matrix.m21;

  if (isNearZero(w - 1)) {
   return this.set(rx, ry);
  }
  const invW = divideSafe(1, w);
  return this.set(rx * invW, ry * invW);
 }

 /**
  * Applies a full 2D transform (scale → rotate → translate) in place.
  *
  * @remarks
  * - Use `Transform2.transformPoint` semantics (spatial transform).
  * - Transform order: Scale first, then rotate, then translate.
  *
  * @param transform - Transform2 with position, rotation, and scale
  * @returns This for chaining
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public applyTransform2(transform: ReadonlyTransform2Like): this {
  const { cos, sin } = transform.rotation;
  const sx = this.x * transform.scale.x;
  const sy = this.y * transform.scale.y;
  this.x = sx * cos - sy * sin + transform.position.x;
  this.y = sx * sin + sy * cos + transform.position.y;
  return this;
 }

 /**
  * Applies a complex number as a rotation to this vector in place.
  *
  * @remarks
  * - Use `Complex.apply` semantics (pure operator).
  * - The complex number is normalized before applying to ensure
  * a pure rotation without scaling.
  *
  * @param complex - Complex number (will be normalized first)
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * const c = { real: Math.SQRT1_2, imag: Math.SQRT1_2 }; // 45° rotation
  * const v = new Vector2(1, 0);
  * v.applyComplex(c); // v ≈ (0.707, 0.707)
  * ```
  *
  * @category Transform Integration
  * @since 0.7.0
  */
 public applyComplex(complex: ReadonlyComplexLike): this {
  const mag = hypot(complex.real, complex.imag);
  if (isNearZero(mag)) {
   return this;
  }
  const invMag = 1 / mag;
  const c = complex.real * invMag;
  const s = complex.imag * invMag;
  const rx = c * this.x - s * this.y;
  const ry = s * this.x + c * this.y;
  return this.set(rx, ry);
 }
}
