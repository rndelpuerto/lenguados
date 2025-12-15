/**
 * @file core/vector2.ts
 * @module @lenguados/math2d/core
 * @description Industrial-grade mutable 2D vector implementation.
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
 * - Trigonometric and square-root operations delegate to {@link DeterministicMath}.
 * - All operations use auxiliary modules to maintain DRY principle.
 */

import { sinCos } from '../auxiliary/angle/operations';
import { safeAcos, safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import {
 abs as scalarAbs,
 clamp,
 max as scalarMax,
 min as scalarMin,
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
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type {
 ReadonlyComplexLike,
 ReadonlyMatrix2Like,
 ReadonlyRotation2Like,
 ReadonlyTransform2Like,
 ReadonlyVector2Like,
 Vector2Like,
} from '../types';
import { assertFinite } from '../validation/assert';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Vector2} instance.
 * @public
 */
export type ReadonlyVector2 = Readonly<Vector2>;

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Vector2} instance so it can no longer be mutated.
 *
 * @param vector - The Vector2 object to freeze.
 * @returns The same instance, now typed as ReadonlyVector2.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `x` or `y` throws a TypeError.
 *
 * @example
 * ```typescript
 * const ORIGIN = freezeVector2(new Vector2(0, 0));
 * ORIGIN.x = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.8.0
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
 * - **Numerics:** Uses DeterministicMath for cross-platform reproducibility.
 * - **Safety:** "Safe" variants avoid throwing on degeneracies.
 *
 * @example
 * ```typescript
 * // Static (pure, allocation-controlled)
 * const sum = Vector2.add(a, b);
 * Vector2.add(a, b, existingVector); // Reuse allocation
 *
 * // Instance (mutable, chainable)
 * velocity.add(acceleration).scale(dt);
 * ```
 *
 * @category Core
 * @since 0.1.0
 */
export class Vector2 implements Vector2Like {
 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Vector2): Vector2 {
  return out ?? new Vector2();
 }

 private static sanitizeComponent(value: number, name: string): number {
  assertFinite(value, name);
  return value;
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /** The zero/origin vector `(0, 0)`. */
 public static readonly ZERO = freezeVector2(new Vector2(0, 0));

 /** Alias for ZERO - the origin vector. */
 public static readonly ORIGIN = Vector2.ZERO;

 /** Epsilon vector `(ε, ε)`. */
 public static readonly EPSILON_VECTOR = freezeVector2(new Vector2(EPSILON, EPSILON));

 /** The all-ones vector `(1, 1)`. */
 public static readonly ONE = freezeVector2(new Vector2(1, 1));

 /** The all-negative-ones vector `(-1, -1)`. */
 public static readonly NEGATIVE_ONE = freezeVector2(new Vector2(-1, -1));

 /** Unit vector along +X `(1, 0)`. */
 public static readonly UNIT_X = freezeVector2(new Vector2(1, 0));

 /** Unit vector along +Y `(0, 1)`. */
 public static readonly UNIT_Y = freezeVector2(new Vector2(0, 1));

 /** Unit vector along -X `(-1, 0)`. */
 public static readonly NEGATIVE_UNIT_X = freezeVector2(new Vector2(-1, 0));

 /** Unit vector along -Y `(0, -1)`. */
 public static readonly NEGATIVE_UNIT_Y = freezeVector2(new Vector2(0, -1));

 /** 45° diagonal unit `(1/√2, 1/√2)`. */
 public static readonly UNIT_DIAGONAL = freezeVector2(new Vector2(Math.SQRT1_2, Math.SQRT1_2));

 /** 225° diagonal unit `(-1/√2, -1/√2)`. */
 public static readonly NEGATIVE_UNIT_DIAGONAL = freezeVector2(
  new Vector2(-Math.SQRT1_2, -Math.SQRT1_2),
 );

 /** The `(+∞, +∞)` vector. */
 public static readonly POSITIVE_INFINITY = freezeVector2(
  new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
 );

 /** The `(-∞, -∞)` vector. */
 public static readonly NEGATIVE_INFINITY = freezeVector2(
  new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
 );

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a vector from explicit components.
  *
  * @param x - X component.
  * @param y - Y component.
  * @param out - Optional output vector.
  * @returns A Vector2 with components `(x, y)`.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromValues(x: number, y: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(x, y);
 }

 /**
  * Creates a deep copy of a vector.
  *
  * @param source - Vector to clone.
  * @param out - Optional output vector.
  * @returns A Vector2 with identical components.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static clone(source: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(source.x, source.y);
 }

 /**
  * Copies component values from source into destination (alloc-free).
  *
  * @param source - Source vector.
  * @param destination - Target vector to receive the copy.
  * @returns The destination vector.
  *
  * @category Factory
  * @since 0.8.0
  */
 public static copy(source: ReadonlyVector2Like, destination: Vector2): Vector2 {
  return destination.set(source.x, source.y);
 }

 /**
  * Creates a vector from polar coordinates.
  *
  * @param angle - Angle in radians (from +X, CCW positive).
  * @param radius - Magnitude. @defaultValue `1`
  * @param out - Optional output vector.
  * @returns A Vector2 positioned at the given angle and radius.
  *
  * @example
  * ```typescript
  * Vector2.fromAngle(Math.PI / 2, 2); // → (0, 2)
  * ```
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromAngle(angle: number, radius = 1, out?: Vector2): Vector2 {
  const { cos, sin } = sinCos(angle);
  return this.ensureOut(out).set(cos * radius, sin * radius);
 }

 /**
  * Creates a vector from a plain object `{ x, y }`.
  *
  * @param object - Plain object with numeric x and y.
  * @param out - Optional output vector.
  * @returns A Vector2 with the object's components.
  * @throws {Error} If x or y is not finite.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromObject(object: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const x = this.sanitizeComponent(object.x, 'Vector2.fromObject:x');
  const y = this.sanitizeComponent(object.y, 'Vector2.fromObject:y');
  return this.ensureOut(out).set(x, y);
 }

 /**
  * Creates a vector from a flat numeric array.
  *
  * @param array - Numeric array with at least two elements.
  * @param offset - Index of the x component. @defaultValue `0`
  * @param out - Optional output vector.
  * @returns A Vector2 initialized from the array.
  * @throws {RangeError} If offset is out of bounds.
  *
  * @example
  * ```typescript
  * Vector2.fromArray([10, 20, 30]);    // → (10, 20)
  * Vector2.fromArray([10, 20, 30], 1); // → (20, 30)
  * ```
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Vector2): Vector2 {
  if (offset < 0 || offset + 1 >= array.length) {
   throw new RangeError(
    `Vector2.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  const x = this.sanitizeComponent(array[offset]!, 'Vector2.fromArray:x');
  const y = this.sanitizeComponent(array[offset + 1]!, 'Vector2.fromArray:y');
  return this.ensureOut(out).set(x, y);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Computes the sum of components `x + y`.
  *
  * @param vector - Vector to read.
  * @returns The scalar sum `vector.x + vector.y`.
  *
  * @category Arithmetic
  * @since 0.8.0
  */
 public static sumComponents(vector: ReadonlyVector2Like): number {
  return vector.x + vector.y;
 }

 /**
  * Component-wise addition `a + b`.
  *
  * @param a - First addend.
  * @param b - Second addend.
  * @param out - Optional output vector.
  * @returns Vector equal to `(a.x + b.x, a.y + b.y)`.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(a.x + b.x, a.y + b.y);
 }

 /**
  * Adds a scalar to both components `v + s`.
  *
  * @param v - Source vector.
  * @param s - Scalar addend.
  * @param out - Optional output vector.
  * @returns Vector equal to `(v.x + s, v.y + s)`.
  *
  * @category Arithmetic
  * @since 0.8.0
  */
 public static addScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x + s, v.y + s);
 }

 /**
  * Component-wise subtraction `a - b`.
  *
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @param out - Optional output vector.
  * @returns Vector equal to `(a.x - b.x, a.y - b.y)`.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static subtract(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(a.x - b.x, a.y - b.y);
 }

 /**
  * Subtracts a scalar from both components `v - s`.
  *
  * @param v - Source vector.
  * @param s - Scalar to subtract.
  * @param out - Optional output vector.
  * @returns Vector equal to `(v.x - s, v.y - s)`.
  *
  * @category Arithmetic
  * @since 0.8.0
  */
 public static subtractScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x - s, v.y - s);
 }

 /**
  * Component-wise multiplication `a * b` (Hadamard product).
  *
  * @param a - First factor.
  * @param b - Second factor.
  * @param out - Optional output vector.
  * @returns Vector equal to `(a.x * b.x, a.y * b.y)`.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static multiply(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(a.x * b.x, a.y * b.y);
 }

 /**
  * Scales a vector by a scalar `v * s`.
  *
  * @param v - Vector to scale.
  * @param s - Scale factor.
  * @param out - Optional output vector.
  * @returns Vector equal to `(v.x * s, v.y * s)`.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static scale(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x * s, v.y * s);
 }

 /**
  * Component-wise division `a / b` using safe division.
  *
  * @param a - Numerator vector.
  * @param b - Divisor vector.
  * @param out - Optional output vector.
  * @returns Vector with safe division per component (0 if divisor near zero).
  *
  * @remarks
  * Uses safeDivide internally - division by zero returns 0 per component.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static divide(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(safeDivide(a.x, b.x), safeDivide(a.y, b.y));
 }

 /**
  * Scalar division `v / s` using safe division.
  *
  * @param v - Vector to divide.
  * @param s - Scalar divisor (if near zero, returns (0, 0)).
  * @param out - Optional output vector.
  * @returns Vector equal to `(v.x / s, v.y / s)` or (0, 0) if s is near zero.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static divideScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  if (isNearZero(s)) {
   return this.ensureOut(out).set(0, 0);
  }
  const inv = 1 / s;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Unary negation `(-x, -y)`.
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Negated vector.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static negate(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(-v.x, -v.y);
 }

 /**
  * Adds a scaled vector: `base + scale * scaled`.
  *
  * @param base - Base vector.
  * @param scaled - Vector to scale and add.
  * @param scale - Scale factor.
  * @param out - Optional output vector.
  * @returns Vector equal to `base + scaled * scale`.
  *
  * @remarks
  * Common in physics for velocity integration: `v = v + a * dt`
  *
  * @example
  * ```typescript
  * velocity = Vector2.addScaledVector(velocity, acceleration, dt);
  * ```
  *
  * @category Arithmetic
  * @since 0.8.0
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
  * @param a - Vector to scale.
  * @param scale - Scale factor.
  * @param b - Vector to add.
  * @param out - Optional output vector.
  * @returns Vector equal to `a * scale + b`.
  *
  * @remarks
  * More efficient than separate multiply and add operations.
  *
  * @category Arithmetic
  * @since 0.8.0
  */
 public static fma(
  a: ReadonlyVector2Like,
  scale: number,
  b: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  return this.ensureOut(out).set(a.x * scale + b.x, a.y * scale + b.y);
 }

 /**
  * Component-wise modulo operation `a % b`.
  *
  * @param a - Dividend vector.
  * @param b - Divisor vector.
  * @param out - Optional output vector.
  * @returns Vector with positive modulo per component.
  *
  * @remarks
  * Uses the positive modulo operation from auxiliary module,
  * which handles negative values correctly (always returns positive).
  *
  * @category Arithmetic
  * @since 0.8.0
  */
 public static mod(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarModule(a.x, b.x), scalarModule(a.y, b.y));
 }

 /**
  * Scalar modulo operation `v % s`.
  *
  * @param v - Vector dividend.
  * @param s - Scalar divisor.
  * @param out - Optional output vector.
  * @returns Vector with modulo applied to both components.
  *
  * @category Arithmetic
  * @since 0.8.0
  */
 public static modScalar(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarModule(v.x, s), scalarModule(v.y, s));
 }

 /* ======================================================================== */
 /* Static Numeric Transforms                                                */
 /* ======================================================================== */

 /**
  * Applies Math.floor to both components.
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Floored vector.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static floor(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.floor(v.x), Math.floor(v.y));
 }

 /**
  * Applies Math.ceil to both components.
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Ceiled vector.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static ceil(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.ceil(v.x), Math.ceil(v.y));
 }

 /**
  * Applies Math.round to both components.
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Rounded vector.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static round(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(Math.round(v.x), Math.round(v.y));
 }

 /**
  * Applies Math.abs to both components.
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Absolute-valued vector.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static abs(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarAbs(v.x), scalarAbs(v.y));
 }

 /**
  * Component-wise sign extraction: (sign(x), sign(y)).
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Vector with components -1, 0, or 1.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static sign(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarSign(v.x), scalarSign(v.y));
 }

 /**
  * Component-wise reciprocal (1/x, 1/y).
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Inverted vector.
  * @throws {RangeError} If any component is zero.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static inverse(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  if (v.x === 0 || v.y === 0) {
   throw new RangeError('Vector2.inverse: cannot invert zero component');
  }
  return this.ensureOut(out).set(1 / v.x, 1 / v.y);
 }

 /**
  * Safe reciprocal. Components near zero become 0.
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Safe inverted vector.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static inverseSafe(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(isNearZero(v.x) ? 0 : 1 / v.x, isNearZero(v.y) ? 0 : 1 / v.y);
 }

 /**
  * Swaps x and y components.
  *
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Vector with swapped components `(y, x)`.
  *
  * @category Numeric Transform
  * @since 0.8.0
  */
 public static swap(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.y, v.x);
 }

 /**
  * Component-wise step function (GLSL-style).
  *
  * @param edge - Threshold vector.
  * @param v - Input vector.
  * @param out - Optional output vector.
  * @returns Vector with 0 where `v < edge`, 1 otherwise.
  *
  * @remarks
  * Useful for shader-like operations and conditional masking.
  *
  * @category Numeric Transform
  * @since 0.8.0
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
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor.
  * @param out - Optional output vector.
  * @returns Interpolated vector.
  *
  * @category Interpolation
  * @since 0.1.0
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
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor (clamped).
  * @param out - Optional output vector.
  * @returns Clamped interpolated vector.
  *
  * @category Interpolation
  * @since 0.8.0
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
  * Linear interpolation without clamping t.
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor (not clamped, can extrapolate).
  * @param out - Optional output vector.
  * @returns Interpolated vector.
  *
  * @remarks
  * Alias for `lerp`. Provided for symmetry with `lerpClamped`.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static lerpUnclamped(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  return this.lerp(a, b, t, out);
 }

 /**
  * Spherical linear interpolation between two vectors.
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor (0 to 1).
  * @param out - Optional output vector.
  * @returns Spherically interpolated vector.
  *
  * @remarks
  * Interpolates the angle while maintaining constant angular velocity.
  * Falls back to linear interpolation for nearly parallel or opposite vectors.
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public static slerp(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  const lengthA = Vector2.length(a);
  const lengthB = Vector2.length(b);

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
  const theta = safeAcos(dot);

  if (isNearZero(theta)) {
   return this.lerp(a, b, t, out);
  }

  const sinTheta = DeterministicMath.sin(theta);
  const wa = DeterministicMath.sin((1 - t) * theta) / sinTheta;
  const wb = DeterministicMath.sin(t * theta) / sinTheta;

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
  * @param a - Start vector.
  * @param b - End vector.
  * @param t - Interpolation factor (clamped to [0, 1]).
  * @param out - Optional output vector.
  * @returns Interpolated vector.
  *
  * @category Interpolation
  * @since 0.9.0
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
  * @param a - Start vector
  * @param b - End vector
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output vector
  * @returns Smoothly interpolated vector
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  * Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.
  *
  * @example
  * ```typescript
  * const a = { x: 0, y: 0 };
  * const b = { x: 10, y: 10 };
  * const smooth = Vector2.smoothStep(a, b, 0.5); // Smooth interpolation
  * ```
  *
  * @category Interpolation
  * @since 0.11.0
  */
 public static smoothStep(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  t: number,
  out?: Vector2,
 ): Vector2 {
  const smoothT = smoothStep(0, 1, saturate(t));
  return Vector2.lerp(a, b, smoothT, out);
 }

 /* ======================================================================== */
 /* Static Geometry & Measures                                               */
 /* ======================================================================== */

 /**
  * Dot product `a·b = a.x*b.x + a.y*b.y`.
  *
  * @param a - First operand.
  * @param b - Second operand.
  * @returns Scalar dot product.
  *
  * @category Geometry
  * @since 0.8.0
  */
 public static dot(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return a.x * b.x + a.y * b.y;
 }

 /**
  * 2D scalar cross product (z-component): `a.x*b.y - a.y*b.x`.
  *
  * @param a - First operand.
  * @param b - Second operand.
  * @returns Scalar cross product (signed area magnitude).
  *
  * @remarks
  * Positive if b is CCW from a, negative if CW.
  *
  * @category Geometry
  * @since 0.8.0
  */
 public static cross(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return a.x * b.y - a.y * b.x;
 }

 /**
  * Twice the signed area of triangle (a, b, c).
  *
  * @param a - First vertex.
  * @param b - Second vertex.
  * @param c - Third vertex.
  * @returns Twice the signed area (positive if CCW winding).
  *
  * @category Geometry
  * @since 0.8.0
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
  * @param v - Vector to measure.
  * @returns The Euclidean norm.
  *
  * @category Geometry
  * @since 0.8.0
  */
 public static length(v: ReadonlyVector2Like): number {
  return safeSqrt(v.x * v.x + v.y * v.y);
 }

 /**
  * Squared length `||v||²` (avoids square root).
  *
  * @param v - Vector to measure.
  * @returns The squared length.
  *
  * @category Geometry
  * @since 0.8.0
  */
 public static lengthSquared(v: ReadonlyVector2Like): number {
  return v.x * v.x + v.y * v.y;
 }

 /**
  * Manhattan length `|x| + |y|`.
  *
  * @param v - Vector to measure.
  * @returns The Manhattan (L1) norm.
  *
  * @category Geometry
  * @since 0.1.0
  */
 public static manhattanLength(v: ReadonlyVector2Like): number {
  return scalarAbs(v.x) + scalarAbs(v.y);
 }

 /**
  * Euclidean distance between a and b.
  *
  * @param a - First point.
  * @param b - Second point.
  * @returns The Euclidean distance.
  *
  * @category Geometry
  * @since 0.1.0
  */
 public static distance(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return safeSqrt(dx * dx + dy * dy);
 }

 /**
  * Squared Euclidean distance between a and b.
  *
  * @param a - First point.
  * @param b - Second point.
  * @returns The squared distance.
  *
  * @category Geometry
  * @since 0.1.0
  */
 public static distanceSquared(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
 }

 /**
  * Manhattan (L1) distance between a and b.
  *
  * @param a - First point.
  * @param b - Second point.
  * @returns The Manhattan distance.
  *
  * @category Geometry
  * @since 0.8.0
  */
 public static manhattanDistance(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return scalarAbs(b.x - a.x) + scalarAbs(b.y - a.y);
 }

 /* ======================================================================== */
 /* Static Direction & Angles                                                */
 /* ======================================================================== */

 /**
  * Unit direction from `from` to `to`. Returns (0,0) if coincident.
  *
  * @param from - Start point.
  * @param to - End point.
  * @param out - Optional output vector.
  * @returns Unit direction vector.
  *
  * @category Direction
  * @since 0.8.0
  */
 public static direction(
  from: ReadonlyVector2Like,
  to: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = safeSqrt(dx * dx + dy * dy);
  if (isNearZero(length)) {
   return this.ensureOut(out).set(0, 0);
  }
  return this.ensureOut(out).set(dx / length, dy / length);
 }

 /**
  * Heading (angle) of v from +X axis in radians ∈ [-π, π].
  *
  * @param v - Vector to measure.
  * @returns Angle in radians (CCW positive).
  *
  * @category Direction
  * @since 0.1.0
  */
 public static angle(v: ReadonlyVector2Like): number {
  return DeterministicMath.atan2(v.y, v.x);
 }

 /**
  * Signed angle from a to b (positive if b is CCW from a).
  *
  * @param a - Start vector.
  * @param b - End vector.
  * @returns Signed angle in radians.
  *
  * @remarks
  * Uses `atan2(cross(a,b), dot(a,b))` for robust behavior.
  *
  * @category Direction
  * @since 0.8.0
  */
 public static angleTo(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return DeterministicMath.atan2(Vector2.cross(a, b), Vector2.dot(a, b));
 }

 /**
  * Smallest unsigned angle between a and b in radians ∈ [0, π].
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @returns Unsigned angle in radians.
  *
  * @category Direction
  * @since 0.8.0
  */
 public static angleBetween(a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  const lengthA = Vector2.length(a);
  const lengthB = Vector2.length(b);
  if (isNearZero(lengthA) || isNearZero(lengthB)) return 0;

  const dot = Vector2.dot(a, b);
  const cosAngle = clamp(dot / (lengthA * lengthB), -1, 1);
  return safeAcos(cosAngle);
 }

 /* ======================================================================== */
 /* Static Constraints                                                       */
 /* ======================================================================== */

 /**
  * Component-wise clamp between min and max vectors.
  *
  * @param v - Vector to clamp.
  * @param minV - Per-component minima.
  * @param maxV - Per-component maxima.
  * @param out - Optional output vector.
  * @returns Clamped vector.
  *
  * @category Constraint
  * @since 0.1.0
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
  * @param v - Vector to clamp.
  * @param min - Minimum scalar.
  * @param max - Maximum scalar.
  * @param out - Optional output vector.
  * @returns Clamped vector.
  *
  * @category Constraint
  * @since 0.8.0
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
  * @param v - Vector to clamp.
  * @param minLength - Minimum magnitude.
  * @param maxLength - Maximum magnitude.
  * @param out - Optional output vector.
  * @returns Vector with clamped magnitude.
  *
  * @category Constraint
  * @since 0.1.0
  */
 public static clampLength(
  v: ReadonlyVector2Like,
  minLength: number,
  maxLength: number,
  out?: Vector2,
 ): Vector2 {
  const length = Vector2.length(v);
  if (isNearZero(length)) {
   return this.ensureOut(out).set(0, 0);
  }
  const newLength = clamp(length, minLength, maxLength);
  const scale = newLength / length;
  return this.ensureOut(out).set(v.x * scale, v.y * scale);
 }

 /**
  * Limits vector length to maxLength.
  *
  * @param v - Vector to limit.
  * @param maxLength - Maximum allowed magnitude.
  * @param out - Optional output vector.
  * @returns Vector with limited magnitude.
  *
  * @remarks Equivalent to `clampLength(v, 0, maxLength)`.
  *
  * @category Constraint
  * @since 0.8.0
  */
 public static limit(v: ReadonlyVector2Like, maxLength: number, out?: Vector2): Vector2 {
  const lengthSq = Vector2.lengthSquared(v);
  if (lengthSq > maxLength * maxLength && lengthSq > 0) {
   const scale = maxLength / safeSqrt(lengthSq);
   return this.ensureOut(out).set(v.x * scale, v.y * scale);
  }
  return this.ensureOut(out).set(v.x, v.y);
 }

 /**
  * Component-wise minimum of a and b.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param out - Optional output vector.
  * @returns Vector with per-component minima.
  *
  * @category Constraint
  * @since 0.8.0
  */
 public static min(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarMin(a.x, b.x), scalarMin(a.y, b.y));
 }

 /**
  * Component-wise maximum of a and b.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param out - Optional output vector.
  * @returns Vector with per-component maxima.
  *
  * @category Constraint
  * @since 0.8.0
  */
 public static max(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(scalarMax(a.x, b.x), scalarMax(a.y, b.y));
 }

 /* ======================================================================== */
 /* Static Vector Transforms                                                 */
 /* ======================================================================== */

 /**
  * Normalizes v to unit length.
  *
  * @param v - Vector to normalize.
  * @param out - Optional output vector.
  * @returns Unit vector.
  * @throws {RangeError} If v has zero length.
  *
  * @remarks
  * **Numerical Limits:** For vectors with extremely small components
  * (magnitude < ~1e-154), intermediate calculations may underflow to zero
  * due to IEEE 754 double precision limits, causing a RangeError even if
  * the vector is technically non-zero. Use {@link normalizeSafe} for
  * graceful handling of such edge cases.
  *
  * @category Transform
  * @since 0.1.0
  */
 public static normalize(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const length = Vector2.length(v);
  if (isNearZero(length)) {
   throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');
  }
  const inv = 1 / length;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Safe normalization. Returns (0,0) if v has zero length.
  *
  * @param v - Vector to normalize.
  * @param out - Optional output vector.
  * @returns Normalized vector or zero vector.
  *
  * @category Transform
  * @since 0.1.0
  */
 public static normalizeSafe(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const lengthSq = Vector2.lengthSquared(v);
  if (isNearZero(lengthSq)) {
   return this.ensureOut(out).set(0, 0);
  }
  const inv = 1 / safeSqrt(lengthSq);
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
 }

 /**
  * Returns a copy of v with the requested length.
  *
  * @param v - Source vector.
  * @param newLength - Desired magnitude.
  * @param out - Optional output vector.
  * @returns Vector with specified length.
  * @throws {RangeError} If newLength < 0 or v has zero length.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static setLength(v: ReadonlyVector2Like, newLength: number, out?: Vector2): Vector2 {
  if (newLength < 0) {
   throw new RangeError('Vector2.setLength: length must be non-negative');
  }
  const length = Vector2.length(v);
  if (isNearZero(length)) {
   throw new RangeError('Vector2.setLength: cannot set length on zero vector');
  }
  const scale = newLength / length;
  return this.ensureOut(out).set(v.x * scale, v.y * scale);
 }

 /**
  * Safe setLength. Zero vectors become (newLength, 0).
  *
  * @param v - Source vector.
  * @param newLength - Desired magnitude (clamped to 0 if negative).
  * @param out - Optional output vector.
  * @returns Vector with specified length.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static setLengthSafe(v: ReadonlyVector2Like, newLength: number, out?: Vector2): Vector2 {
  const nn = newLength < 0 ? 0 : newLength;
  const length = Vector2.length(v);
  if (isNearZero(length)) {
   return this.ensureOut(out).set(nn, 0);
  }
  const scale = nn / length;
  return this.ensureOut(out).set(v.x * scale, v.y * scale);
 }

 /**
  * Returns vector with same magnitude but new heading.
  *
  * @param v - Source vector.
  * @param angle - New heading in radians.
  * @param out - Optional output vector.
  * @returns Vector with rotated heading.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static setHeading(v: ReadonlyVector2Like, angle: number, out?: Vector2): Vector2 {
  const magnitude = Vector2.length(v);
  const { cos, sin } = sinCos(angle);
  return this.ensureOut(out).set(cos * magnitude, sin * magnitude);
 }

 /**
  * Projects v onto axis.
  *
  * @param v - Vector to project.
  * @param axis - Projection axis.
  * @param out - Optional output vector.
  * @returns Projection of v onto axis.
  *
  * @remarks
  * If axis is zero, returns (0, 0).
  *
  * @remarks
  * Mathematically equivalent to `axis * (dot(v, axis) / lengthSquared(axis))`.
  * Uses {@link Vector2.dot} and {@link Vector2.lengthSquared} internally.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static project(v: ReadonlyVector2Like, axis: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const denom = Vector2.lengthSquared(axis);
  if (isNearZero(denom)) {
   return this.ensureOut(out).set(0, 0);
  }
  const s = Vector2.dot(v, axis) / denom;
  return this.ensureOut(out).set(axis.x * s, axis.y * s);
 }

 /**
  * Projects v onto a unit axis (optimized).
  *
  * @param v - Vector to project.
  * @param unitAxis - Unit-length axis.
  * @param out - Optional output vector.
  * @returns Projection of v onto unitAxis.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static projectOnUnit(
  v: ReadonlyVector2Like,
  unitAxis: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const s = Vector2.dot(v, unitAxis);
  return this.ensureOut(out).set(unitAxis.x * s, unitAxis.y * s);
 }

 /**
  * Vector rejection: component of a perpendicular to b.
  *
  * @param a - Vector to decompose.
  * @param b - Axis of projection.
  * @param out - Optional output vector.
  * @returns Rejection of a from b.
  *
  * @remarks
  * `reject(a, b) = a - project(a, b)`
  *
  * @category Transform
  * @since 0.8.0
  */
 public static reject(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const denom = Vector2.lengthSquared(b);
  if (isNearZero(denom)) {
   return this.ensureOut(out).set(a.x, a.y);
  }
  const s = Vector2.dot(a, b) / denom;
  return this.ensureOut(out).set(a.x - b.x * s, a.y - b.y * s);
 }

 /**
  * Reflection of v about a unit normal: `r = v - 2(v·n)n`.
  *
  * @param v - Incident vector.
  * @param unitNormal - Unit-length normal.
  * @param out - Optional output vector.
  * @returns Reflected vector.
  *
  * @remarks
  * Implements the reflection formula: `r = v - 2 * dot(v, n) * n`.
  * Uses {@link Vector2.dot} internally.
  * For physics bounces, the incident velocity reflects off surfaces using this formula.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static reflect(
  v: ReadonlyVector2Like,
  unitNormal: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const d2 = 2 * Vector2.dot(v, unitNormal);
  return this.ensureOut(out).set(v.x - d2 * unitNormal.x, v.y - d2 * unitNormal.y);
 }

 /**
  * Safe reflection. Normalizes the normal; near-zero normal returns v.
  *
  * @param v - Incident vector.
  * @param normal - Normal (need not be unit).
  * @param out - Optional output vector.
  * @returns Reflected vector.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static reflectSafe(
  v: ReadonlyVector2Like,
  normal: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const lengthSq = Vector2.lengthSquared(normal);
  if (isNearZero(lengthSq)) {
   return this.ensureOut(out).set(v.x, v.y);
  }
  const invLength = 1 / safeSqrt(lengthSq);
  const nx = normal.x * invLength;
  const ny = normal.y * invLength;
  const d2 = 2 * (v.x * nx + v.y * ny);
  return this.ensureOut(out).set(v.x - d2 * nx, v.y - d2 * ny);
 }

 /**
  * Perpendicular vector (±90°) with unchanged length.
  *
  * @param v - Source vector.
  * @param clockwise - CW (-90°) if true, CCW (+90°) if false. @defaultValue `false`
  * @param out - Optional output vector.
  * @returns Perpendicular vector.
  *
  * @remarks
  * - CCW (+90°): `(-y, x)`
  * - CW (-90°): `(y, -x)`
  *
  * @category Transform
  * @since 0.8.0
  */
 public static perpendicular(v: ReadonlyVector2Like, clockwise = false, out?: Vector2): Vector2 {
  return clockwise ? this.ensureOut(out).set(v.y, -v.x) : this.ensureOut(out).set(-v.y, v.x);
 }

 /**
  * Unit perpendicular. Throws if v is zero.
  *
  * @param v - Source vector.
  * @param clockwise - CW if true, CCW if false.
  * @param out - Optional output vector.
  * @returns Unit perpendicular vector.
  * @throws {RangeError} If v has zero length.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static unitPerpendicular(
  v: ReadonlyVector2Like,
  clockwise = false,
  out?: Vector2,
 ): Vector2 {
  const perp = this.perpendicular(v, clockwise, out);
  return Vector2.normalize(perp, perp);
 }

 /**
  * Safe unit perpendicular. Returns (0, 0) if v is zero.
  *
  * @param v - Source vector.
  * @param clockwise - CW if true, CCW if false.
  * @param out - Optional output vector.
  * @returns Unit perpendicular vector or zero.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static unitPerpendicularSafe(
  v: ReadonlyVector2Like,
  clockwise = false,
  out?: Vector2,
 ): Vector2 {
  const perp = this.perpendicular(v, clockwise, out);
  return Vector2.normalizeSafe(perp, perp);
 }

 /**
  * Rotates v by angle radians.
  *
  * @param v - Vector to rotate.
  * @param angle - Rotation angle (CCW positive).
  * @param out - Optional output vector.
  * @returns Rotated vector.
  *
  * @category Transform
  * @since 0.1.0
  */
 public static rotate(v: ReadonlyVector2Like, angle: number, out?: Vector2): Vector2 {
  const { cos, sin } = sinCos(angle);
  return this.rotateCS(v, cos, sin, out);
 }

 /**
  * Rotates v using precomputed cos/sin (optimal for batches).
  *
  * @param v - Vector to rotate.
  * @param c - Cosine of angle.
  * @param s - Sine of angle.
  * @param out - Optional output vector.
  * @returns Rotated vector.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static rotateCS(v: ReadonlyVector2Like, c: number, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(v.x * c - v.y * s, v.x * s + v.y * c);
 }

 /**
  * Rotates v around center by angle.
  *
  * @param v - Vector to rotate.
  * @param center - Rotation pivot.
  * @param angle - Rotation angle.
  * @param out - Optional output vector.
  * @returns Rotated vector.
  *
  * @category Transform
  * @since 0.8.0
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
  * @param v - Vector to rotate.
  * @param center - Rotation pivot.
  * @param c - Cosine of angle.
  * @param s - Sine of angle.
  * @param out - Optional output vector.
  * @returns Rotated vector.
  *
  * @remarks
  * Optimal when rotating many points around the same center.
  *
  * @category Transform
  * @since 0.8.0
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
  * Midpoint between a and b.
  *
  * @param a - First endpoint.
  * @param b - Second endpoint.
  * @param out - Optional output vector.
  * @returns Midpoint vector.
  *
  * @category Transform
  * @since 0.8.0
  */
 public static midpoint(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
 }

 /**
  * Box2D-style cross: vector × scalar = (s*y, -s*x).
  *
  * @param v - Source vector.
  * @param s - Scalar factor.
  * @param out - Optional output vector.
  * @returns Perpendicular scaled vector (CW rotation).
  *
  * @category Transform
  * @since 0.8.0
  */
 public static crossVS(v: ReadonlyVector2Like, s: number, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(s * v.y, -s * v.x);
 }

 /**
  * Box2D-style cross: scalar × vector = (-s*y, s*x).
  *
  * @param s - Scalar factor.
  * @param v - Source vector.
  * @param out - Optional output vector.
  * @returns Perpendicular scaled vector (CCW rotation).
  *
  * @category Transform
  * @since 0.8.0
  */
 public static crossSV(s: number, v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(-s * v.y, s * v.x);
 }

 /**
  * Computes tangent vector from scalar rotation rate and radius vector.
  *
  * @param omega - Scalar rotation rate (radians per unit time).
  * @param r - Radius vector from rotation center.
  * @param out - Optional output vector.
  * @returns Tangent vector `(-ω*r.y, ω*r.x)`.
  *
  * @remarks
  * Mathematically equivalent to `crossSV(omega, r)`.
  * In 2D, a scalar "angular rate" crossed with a position vector
  * yields the perpendicular (tangent) velocity at that position.
  *
  * @example
  * ```typescript
  * const omega = Math.PI;
  * const r = new Vector2(1, 0);
  * const tangent = Vector2.angularToLinearVelocity(omega, r);
  * // tangent ≈ (0, π)
  * ```
  *
  * @category Transform
  * @since 0.9.0
  */
 public static angularToLinearVelocity(
  omega: number,
  r: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  return Vector2.crossSV(omega, r, out);
 }

 /* ======================================================================== */
 /* Static Transform Integration                                             */
 /* ======================================================================== */

 /**
  * Applies a Rotation2 (unit complex) to a vector.
  *
  * @param v - Vector to transform.
  * @param rotation - Rotation with c (cos) and s (sin) components.
  * @param out - Optional output vector.
  * @returns Rotated vector.
  *
  * @remarks
  * Equivalent to `rotateCS(v, rotation.cos, rotation.sin, out)`.
  * Uses interface for loose coupling.
  *
  * @category Transform Integration
  * @since 0.9.0
  */
 public static applyRotation(
  v: ReadonlyVector2Like,
  rotation: ReadonlyRotation2Like,
  out?: Vector2,
 ): Vector2 {
  return Vector2.rotateCS(v, rotation.cos, rotation.sin, out);
 }

 /**
  * Transforms a vector by a 2x2 matrix.
  *
  * @param v - Vector to transform.
  * @param matrix - Matrix with m00, m01, m10, m11 components.
  * @param out - Optional output vector.
  * @returns Transformed vector.
  *
  * @remarks
  * Computes: [m00*x + m10*y, m01*x + m11*y] (column-major convention).
  * Uses interface for loose coupling.
  *
  * @category Transform Integration
  * @since 0.9.0
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
  * Applies a full 2D transform (scale → rotate → translate) to a vector.
  *
  * @param v - Vector to transform.
  * @param transform - Transform with position, rotation (angle), and scale.
  * @param out - Optional output vector.
  * @returns Transformed vector.
  *
  * @remarks
  * Transform order: Scale first, then rotate, then translate.
  * Uses interface for loose coupling.
  *
  * @category Transform Integration
  * @since 0.9.0
  */
 public static applyTransform(
  v: ReadonlyVector2Like,
  transform: ReadonlyTransform2Like,
  out?: Vector2,
 ): Vector2 {
  const { cos, sin } = sinCos(transform.rotation);
  const sx = v.x * transform.scale.x;
  const sy = v.y * transform.scale.y;
  return this.ensureOut(out).set(
   sx * cos - sy * sin + transform.position.x,
   sx * sin + sy * cos + transform.position.y,
  );
 }

 /**
  * Creates a vector from a complex number.
  *
  * @param complex - Complex number with real and imag components.
  * @param out - Optional output vector.
  * @returns Vector with x=real, y=imag.
  *
  * @remarks
  * Uses interface for loose coupling with Complex class.
  *
  * @category Factory
  * @since 0.9.0
  */
 public static fromComplex(complex: ReadonlyComplexLike, out?: Vector2): Vector2 {
  return this.ensureOut(out).set(complex.real, complex.imag);
 }

 /* ======================================================================== */
 /* Static Comparison & Validation                                           */
 /* ======================================================================== */

 /**
  * Tests whether v is exactly (0, 0).
  *
  * @param v - Vector to test.
  * @returns True if both components are zero.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public static isZero(v: ReadonlyVector2Like): boolean {
  return v.x === 0 && v.y === 0;
 }

 /**
  * Tests whether both components are within epsilon of 0.
  *
  * @param v - Vector to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if |x| ≤ epsilon and |y| ≤ epsilon.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public static nearZero(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return isNearZero(v.x, epsilon) && isNearZero(v.y, epsilon);
 }

 /**
  * Exact component-wise equality (bit-identical).
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @returns True if components are exactly identical.
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public static exactEquals(a: ReadonlyVector2Like, b: ReadonlyVector2Like): boolean {
  return a.x === b.x && a.y === b.y;
 }

 /**
  * Approximate component-wise equality using relative tolerance.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if both component differences are within scaled epsilon.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  * This scales with value magnitude, making it robust for both small and large values.
  *
  * @category Comparison
  * @since 0.8.0
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
  * @param v - Vector to test.
  * @returns True if v is unit length.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public static isUnit(v: ReadonlyVector2Like): boolean {
  return scalarNearEquals(Vector2.length(v), 1);
 }

 /**
  * Tests whether both components are finite numbers.
  *
  * @param v - Vector to test.
  * @returns True if both components are finite.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public static isFinite(v: ReadonlyVector2Like): boolean {
  return Number.isFinite(v.x) && Number.isFinite(v.y);
 }

 /**
  * Tests if any component is NaN.
  *
  * @param v - Vector to test.
  * @returns True if any component is NaN.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static hasNaN(v: ReadonlyVector2Like): boolean {
  return Number.isNaN(v.x) || Number.isNaN(v.y);
 }

 /**
  * Tests parallelism: |cross(a, b)| ≤ epsilon.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if vectors are parallel.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public static isParallel(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  epsilon = EPSILON,
 ): boolean {
  return isNearZero(Vector2.cross(a, b), epsilon);
 }

 /**
  * Tests perpendicularity: |dot(a, b)| ≤ epsilon.
  *
  * @param a - First vector.
  * @param b - Second vector.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if vectors are perpendicular.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public static isPerpendicular(
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  epsilon = EPSILON,
 ): boolean {
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
  * @param xOrSource - X component, array, or object.
  * @param y - Y component (when first arg is a number).
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
 }

 /* ======================================================================== */
 /* Instance Getters (Derived)                                               */
 /* ======================================================================== */

 /**
  * Returns a normalized copy (or zero if this is zero).
  * @returns New unit vector.
  */
 public get normalized(): Vector2 {
  const length = this.length();
  return isNearZero(length) ? new Vector2(0, 0) : new Vector2(this.x / length, this.y / length);
 }

 /**
  * Returns a negated copy.
  * @returns New negated vector.
  */
 public get negated(): Vector2 {
  return new Vector2(-this.x, -this.y);
 }

 /**
  * Returns an absolute-valued copy.
  * @returns New absolute-valued vector.
  */
 public get absolute(): Vector2 {
  return new Vector2(scalarAbs(this.x), scalarAbs(this.y));
 }

 /* ======================================================================== */
 /* Instance Swizzle Getters                                                 */
 /* ======================================================================== */

 /**
  * Returns a copy of this vector (identity swizzle).
  * @returns New Vector2(x, y).
  */
 public get xy(): Vector2 {
  return new Vector2(this.x, this.y);
 }

 /**
  * Returns a copy with swapped components.
  * @returns New Vector2(y, x).
  */
 public get yx(): Vector2 {
  return new Vector2(this.y, this.x);
 }

 /**
  * Returns a vector with both components set to x.
  * @returns New Vector2(x, x).
  */
 public get xx(): Vector2 {
  return new Vector2(this.x, this.x);
 }

 /**
  * Returns a vector with both components set to y.
  * @returns New Vector2(y, y).
  */
 public get yy(): Vector2 {
  return new Vector2(this.y, this.y);
 }

 /* ======================================================================== */
 /* Instance Basic Mutators                                                  */
 /* ======================================================================== */

 /**
  * Assigns both components.
  * @param x - New x component.
  * @param y - New y component.
  * @returns This for chaining.
  */
 public set(x: number, y: number): this {
  this.x = x;
  this.y = y;
  return this;
 }

 /**
  * Copies from another vector.
  * @param v - Source vector.
  * @returns This for chaining.
  */
 public copy(v: ReadonlyVector2Like): this {
  return this.set(v.x, v.y);
 }

 /**
  * Resets both components to zero.
  * @returns This for chaining.
  */
 public zero(): this {
  return this.set(0, 0);
 }

 /**
  * Sets both components to the same scalar.
  * @param s - Scalar value.
  * @returns This for chaining.
  */
 public setScalar(s: number): this {
  return this.set(s, s);
 }

 /**
  * Sets the x component.
  * @param x - New x value.
  * @returns This for chaining.
  */
 public setX(x: number): this {
  this.x = x;
  return this;
 }

 /**
  * Sets the y component.
  * @param y - New y value.
  * @returns This for chaining.
  */
 public setY(y: number): this {
  this.y = y;
  return this;
 }

 /**
  * Returns a component by index.
  * @param index - 0 for x, 1 for y.
  * @returns The component value.
  */
 public getComponent(index: 0 | 1): number {
  return index === 1 ? this.y : this.x;
 }

 /**
  * Sets a component by index.
  * @param index - 0 for x, 1 for y.
  * @param value - New value.
  * @returns This for chaining.
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
  * @param v - Vector to add.
  * @returns This for chaining.
  */
 public add(v: ReadonlyVector2Like): this {
  this.x += v.x;
  this.y += v.y;
  return this;
 }

 /**
  * Adds scalar to both components.
  * @param s - Scalar to add.
  * @returns This for chaining.
  */
 public addScalar(s: number): this {
  this.x += s;
  this.y += s;
  return this;
 }

 /**
  * Subtracts v component-wise.
  * @param v - Vector to subtract.
  * @returns This for chaining.
  */
 public subtract(v: ReadonlyVector2Like): this {
  this.x -= v.x;
  this.y -= v.y;
  return this;
 }

 /**
  * Subtracts scalar from both components.
  * @param s - Scalar to subtract.
  * @returns This for chaining.
  */
 public subtractScalar(s: number): this {
  this.x -= s;
  this.y -= s;
  return this;
 }

 /**
  * Multiplies by v component-wise (Hadamard product).
  *
  * @param v - Vector multiplier.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public multiply(v: ReadonlyVector2Like): this {
  this.x *= v.x;
  this.y *= v.y;
  return this;
 }

 /**
  * Scales by scalar.
  *
  * @param s - Scale factor.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public scale(s: number): this {
  this.x *= s;
  this.y *= s;
  return this;
 }

 /**
  * Divides by v component-wise (safe).
  *
  * @param v - Divisor vector.
  * @returns This for chaining.
  *
  * @remarks
  * Uses safeDivide internally - division by zero returns 0 per component.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public divide(v: ReadonlyVector2Like): this {
  this.x = safeDivide(this.x, v.x);
  this.y = safeDivide(this.y, v.y);
  return this;
 }

 /**
  * Divides by scalar (safe).
  *
  * @param s - Scalar divisor (if near zero, sets to (0, 0)).
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public divideScalar(s: number): this {
  if (isNearZero(s)) {
   return this.set(0, 0);
  }
  const inv = 1 / s;
  this.x *= inv;
  this.y *= inv;
  return this;
 }

 /**
  * Safe scalar division. If |s| ≤ EPSILON, sets to (0, 0).
  * @param s - Scalar divisor.
  * @returns This for chaining.
  */
 public divideScalarSafe(s: number): this {
  if (s === 0 || isNearZero(s)) {
   return this.set(0, 0);
  }
  return this.divideScalar(s);
 }

 /**
  * Unchecked scalar division for hot paths.
  *
  * @remarks
  * ⚠️ **Precondition:** Scalar must be non-zero.
  * Calling with zero scalar produces Infinity/NaN components.
  *
  * Use only when you can guarantee valid input (e.g., after explicit check).
  * For safe division, use {@link divideScalarSafe}.
  *
  * @param s - Scalar divisor (must be non-zero).
  * @returns This for chaining.
  *
  * @example
  * ```typescript
  * // Only use when you know s is non-zero
  * if (s !== 0) {
  *   v.divideScalarUnchecked(s);
  * }
  * ```
  *
  * @category Arithmetic
  * @since 1.1.0
  */
 public divideScalarUnchecked(s: number): this {
  const inv = 1 / s;
  this.x *= inv;
  this.y *= inv;
  return this;
 }

 /**
  * Negates both components.
  * @returns This for chaining.
  */
 public negate(): this {
  this.x = -this.x;
  this.y = -this.y;
  return this;
 }

 /**
  * Adds a scaled vector: this += scale * v.
  * @param v - Vector to scale and add.
  * @param scale - Scale factor.
  * @returns This for chaining.
  */
 public addScaledVector(v: ReadonlyVector2Like, scale: number): this {
  this.x += v.x * scale;
  this.y += v.y * scale;
  return this;
 }

 /**
  * Fused multiply-add: this = this * scale + v.
  * @param scale - Scale factor.
  * @param v - Vector to add.
  * @returns This for chaining.
  */
 public fma(scale: number, v: ReadonlyVector2Like): this {
  this.x = this.x * scale + v.x;
  this.y = this.y * scale + v.y;
  return this;
 }

 /**
  * Component-wise modulo.
  * @param v - Divisor vector.
  * @returns This for chaining.
  */
 public mod(v: ReadonlyVector2Like): this {
  this.x = scalarModule(this.x, v.x);
  this.y = scalarModule(this.y, v.y);
  return this;
 }

 /**
  * Scalar modulo on both components.
  * @param s - Scalar divisor.
  * @returns This for chaining.
  */
 public modScalar(s: number): this {
  this.x = scalarModule(this.x, s);
  this.y = scalarModule(this.y, s);
  return this;
 }

 /**
  * Component-wise reciprocal.
  * @returns This for chaining.
  * @throws {RangeError} If any component is zero.
  */
 public inverse(): this {
  if (this.x === 0 || this.y === 0) {
   throw new RangeError('Vector2.inverse: cannot invert zero component');
  }
  this.x = 1 / this.x;
  this.y = 1 / this.y;
  return this;
 }

 /**
  * Safe reciprocal. Components near zero become 0.
  * @returns This for chaining.
  */
 public inverseSafe(): this {
  this.x = isNearZero(this.x) ? 0 : 1 / this.x;
  this.y = isNearZero(this.y) ? 0 : 1 / this.y;
  return this;
 }

 /**
  * Swaps x and y components.
  * @returns This for chaining.
  */
 public swap(): this {
  const temporary = this.x;
  this.x = this.y;
  this.y = temporary;
  return this;
 }

 /* ======================================================================== */
 /* Instance Measures & Geometry                                             */
 /* ======================================================================== */

 /**
  * Dot product with v.
  * @param v - Second operand.
  * @returns Scalar dot product.
  */
 public dot(v: ReadonlyVector2Like): number {
  return this.x * v.x + this.y * v.y;
 }

 /**
  * 2D scalar cross product with v.
  * @param v - Second operand.
  * @returns Scalar cross product.
  */
 public cross(v: ReadonlyVector2Like): number {
  return this.x * v.y - this.y * v.x;
 }

 /**
  * Euclidean length.
  * @returns The Euclidean norm.
  */
 public length(): number {
  return safeSqrt(this.x * this.x + this.y * this.y);
 }

 /**
  * Squared length.
  * @returns The squared length.
  */
 public lengthSquared(): number {
  return this.x * this.x + this.y * this.y;
 }

 /**
  * Manhattan length.
  * @returns The Manhattan norm.
  */
 public manhattanLength(): number {
  return scalarAbs(this.x) + scalarAbs(this.y);
 }

 /**
  * Euclidean distance to v.
  * @param v - Target vector.
  * @returns The Euclidean distance.
  */
 public distanceTo(v: ReadonlyVector2Like): number {
  return Vector2.distance(this, v);
 }

 /**
  * Squared distance to v.
  * @param v - Target vector.
  * @returns The squared distance.
  */
 public distanceSquaredTo(v: ReadonlyVector2Like): number {
  return Vector2.distanceSquared(this, v);
 }

 /**
  * Manhattan (L1) distance to v.
  * @param v - Target vector.
  * @returns The Manhattan distance.
  */
 public manhattanDistanceTo(v: ReadonlyVector2Like): number {
  return Vector2.manhattanDistance(this, v);
 }

 /**
  * Returns the sum of components x + y.
  * @returns Scalar sum.
  */
 public sumComponents(): number {
  return this.x + this.y;
 }

 /**
  * Unit direction from this to target.
  * @param target - Target vector.
  * @returns New unit direction vector.
  */
 public directionTo(target: ReadonlyVector2Like): Vector2 {
  return Vector2.direction(this, target);
 }

 /**
  * Heading angle from +X axis.
  * @returns Angle in radians.
  */
 public angle(): number {
  return DeterministicMath.atan2(this.y, this.x);
 }

 /**
  * Signed angle to v.
  * @param v - Target vector.
  * @returns Signed angle in radians.
  */
 public angleTo(v: ReadonlyVector2Like): number {
  return Vector2.angleTo(this, v);
 }

 /**
  * Unsigned angle between this and v.
  * @param v - Target vector.
  * @returns Unsigned angle in radians.
  */
 public angleBetween(v: ReadonlyVector2Like): number {
  return Vector2.angleBetween(this, v);
 }

 /* ======================================================================== */
 /* Instance Transforms                                                      */
 /* ======================================================================== */

 /**
  * Normalizes to unit length.
  * @returns This for chaining.
  * @throws {RangeError} If zero length.
  */
 public normalize(): this {
  const length = this.length();
  if (isNearZero(length)) {
   throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');
  }
  return this.divideScalar(length);
 }

 /**
  * Safe normalization. Sets to (0, 0) if zero length.
  * @returns This for chaining.
  */
 public normalizeSafe(): this {
  const lengthSq = this.lengthSquared();
  if (isNearZero(lengthSq)) {
   return this.set(0, 0);
  }
  const inv = 1 / safeSqrt(lengthSq);
  return this.scale(inv);
 }

 /**
  * Unchecked normalization for hot paths.
  *
  * @remarks
  * ⚠️ **Precondition:** Vector must have non-zero length.
  * Calling with zero-length vector produces NaN/Infinity components.
  *
  * Use only when you can guarantee valid input (e.g., after explicit check).
  * For safe normalization, use {@link normalizeSafe}.
  * For normalization with error throwing, use {@link normalize}.
  *
  * @returns This for chaining.
  *
  * @example
  * ```typescript
  * // Only use when you know the vector is non-zero
  * if (v.lengthSquared() > 0) {
  *   v.normalizeUnchecked();
  * }
  * ```
  *
  * @category Transform
  * @since 1.1.0
  */
 public normalizeUnchecked(): this {
  const lengthSq = this.x * this.x + this.y * this.y;
  const inv = 1 / DeterministicMath.sqrt(lengthSq);
  this.x *= inv;
  this.y *= inv;
  return this;
 }

 /**
  * Sets the length.
  * @param newLength - Desired magnitude.
  * @returns This for chaining.
  * @throws {RangeError} If zero length or negative.
  */
 public setLength(newLength: number): this {
  if (newLength < 0) {
   throw new RangeError('Vector2.setLength: length must be non-negative');
  }
  const length = this.length();
  if (isNearZero(length)) {
   throw new RangeError('Vector2.setLength: cannot set length on zero vector');
  }
  return this.scale(newLength / length);
 }

 /**
  * Safe setLength. Zero vectors become (newLength, 0).
  * @param newLength - Desired magnitude.
  * @returns This for chaining.
  */
 public setLengthSafe(newLength: number): this {
  const nn = newLength < 0 ? 0 : newLength;
  const length = this.length();
  if (isNearZero(length)) {
   return this.set(nn, 0);
  }
  return this.scale(nn / length);
 }

 /**
  * Sets heading while preserving length.
  * @param angle - New heading in radians.
  * @returns This for chaining.
  */
 public setHeading(angle: number): this {
  const magnitude = this.length();
  const { cos, sin } = sinCos(angle);
  return this.set(cos * magnitude, sin * magnitude);
 }

 /**
  * Clamps components between min and max vectors.
  * @param minV - Per-component minima.
  * @param maxV - Per-component maxima.
  * @returns This for chaining.
  */
 public clamp(minV: ReadonlyVector2Like, maxV: ReadonlyVector2Like): this {
  this.x = clamp(this.x, minV.x, maxV.x);
  this.y = clamp(this.y, minV.y, maxV.y);
  return this;
 }

 /**
  * Clamps components between scalar bounds.
  * @param min - Minimum scalar.
  * @param max - Maximum scalar.
  * @returns This for chaining.
  */
 public clampScalar(min: number, max: number): this {
  this.x = clamp(this.x, min, max);
  this.y = clamp(this.y, min, max);
  return this;
 }

 /**
  * Clamps length to range.
  * @param minLength - Minimum magnitude.
  * @param maxLength - Maximum magnitude.
  * @returns This for chaining.
  */
 public clampLength(minLength: number, maxLength: number): this {
  const length = this.length();
  if (isNearZero(length)) return this;
  const newLength = clamp(length, minLength, maxLength);
  return this.scale(newLength / length);
 }

 /**
  * Limits length to maximum.
  * @param maxLength - Maximum allowed magnitude.
  * @returns This for chaining.
  */
 public limit(maxLength: number): this {
  const lengthSq = this.lengthSquared();
  if (lengthSq > maxLength * maxLength) {
   const scale = maxLength / safeSqrt(lengthSq);
   this.scale(scale);
  }
  return this;
 }

 /**
  * Component-wise minimum with v.
  * @param v - Other vector.
  * @returns This for chaining.
  */
 public min(v: ReadonlyVector2Like): this {
  this.x = scalarMin(this.x, v.x);
  this.y = scalarMin(this.y, v.y);
  return this;
 }

 /**
  * Component-wise maximum with v.
  * @param v - Other vector.
  * @returns This for chaining.
  */
 public max(v: ReadonlyVector2Like): this {
  this.x = scalarMax(this.x, v.x);
  this.y = scalarMax(this.y, v.y);
  return this;
 }

 /**
  * Applies Math.abs to both components.
  * @returns This for chaining.
  */
 public abs(): this {
  this.x = scalarAbs(this.x);
  this.y = scalarAbs(this.y);
  return this;
 }

 /**
  * Component-wise sign.
  * @returns This for chaining.
  */
 public sign(): this {
  this.x = scalarSign(this.x);
  this.y = scalarSign(this.y);
  return this;
 }

 /**
  * Applies Math.floor to both components.
  * @returns This for chaining.
  */
 public floor(): this {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
 }

 /**
  * Applies Math.ceil to both components.
  * @returns This for chaining.
  */
 public ceil(): this {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
 }

 /**
  * Applies Math.round to both components.
  * @returns This for chaining.
  */
 public round(): this {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
 }

 /**
  * Projects onto axis.
  * @param axis - Projection axis.
  * @returns This for chaining.
  */
 public project(axis: ReadonlyVector2Like): this {
  const denom = Vector2.lengthSquared(axis);
  if (isNearZero(denom)) {
   return this.set(0, 0);
  }
  const s = this.dot(axis) / denom;
  return this.set(axis.x * s, axis.y * s);
 }

 /**
  * Projects onto unit axis.
  * @param unitAxis - Unit-length axis.
  * @returns This for chaining.
  */
 public projectOnUnit(unitAxis: ReadonlyVector2Like): this {
  const s = this.dot(unitAxis);
  return this.set(unitAxis.x * s, unitAxis.y * s);
 }

 /**
  * Reflects about unit normal.
  * @param unitNormal - Unit-length normal.
  * @returns This for chaining.
  */
 public reflect(unitNormal: ReadonlyVector2Like): this {
  const d2 = 2 * this.dot(unitNormal);
  return this.set(this.x - d2 * unitNormal.x, this.y - d2 * unitNormal.y);
 }

 /**
  * Safe reflection.
  * @param normal - Normal (need not be unit).
  * @returns This for chaining.
  */
 public reflectSafe(normal: ReadonlyVector2Like): this {
  const lengthSq = Vector2.lengthSquared(normal);
  if (isNearZero(lengthSq)) {
   return this;
  }
  const invLength = 1 / safeSqrt(lengthSq);
  const nx = normal.x * invLength;
  const ny = normal.y * invLength;
  const d2 = 2 * (this.x * nx + this.y * ny);
  return this.set(this.x - d2 * nx, this.y - d2 * ny);
 }

 /**
  * Rotates by ±90°.
  * @param clockwise - CW if true, CCW if false.
  * @returns This for chaining.
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
  * Makes this vector a unit perpendicular.
  *
  * @param clockwise - CW if true, CCW if false.
  * @returns This for chaining.
  *
  * @category Transform
  * @since 0.8.0
  */
 public unitPerpendicular(clockwise = false): this {
  this.perpendicular(clockwise);
  return this.normalize();
 }

 /**
  * Safe unit perpendicular. Sets to (0, 0) if this is near zero.
  *
  * @param clockwise - CW if true, CCW if false.
  * @returns This for chaining.
  *
  * @category Transform
  * @since 0.8.0
  */
 public unitPerpendicularSafe(clockwise = false): this {
  this.perpendicular(clockwise);
  return this.normalizeSafe();
 }

 /**
  * Rotates by angle.
  * @param angle - Rotation angle.
  * @returns This for chaining.
  */
 public rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  return this.rotateCS(cos, sin);
 }

 /**
  * Rotates using precomputed cos/sin.
  * @param c - Cosine.
  * @param s - Sine.
  * @returns This for chaining.
  */
 public rotateCS(c: number, s: number): this {
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;
  return this.set(rx, ry);
 }

 /**
  * Rotates around center.
  * @param center - Pivot point.
  * @param angle - Rotation angle.
  * @returns This for chaining.
  */
 public rotateAround(center: ReadonlyVector2Like, angle: number): this {
  return this.subtract(center).rotate(angle).add(center);
 }

 /**
  * Rotates around center using precomputed cos/sin.
  * @param center - Pivot point.
  * @param c - Cosine of angle.
  * @param s - Sine of angle.
  * @returns This for chaining.
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
  * @param onto - Axis to reject from.
  * @returns This for chaining.
  */
 public reject(onto: ReadonlyVector2Like): this {
  const denom = Vector2.lengthSquared(onto);
  if (isNearZero(denom)) {
   return this;
  }
  const s = this.dot(onto) / denom;
  return this.set(this.x - onto.x * s, this.y - onto.y * s);
 }

 /**
  * Cross product: vector × scalar = (s*y, -s*x).
  * @param s - Scalar factor.
  * @returns This for chaining.
  */
 public crossScalarRight(s: number): this {
  const newX = s * this.y;
  const newY = -s * this.x;
  return this.set(newX, newY);
 }

 /**
  * Cross product: scalar × vector = (-s*y, s*x).
  * @param s - Scalar factor.
  * @returns This for chaining.
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
  * @param end - Target vector.
  * @param t - Interpolation factor.
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public lerp(end: ReadonlyVector2Like, t: number): this {
  this.x = lerp(this.x, end.x, t);
  this.y = lerp(this.y, end.y, t);
  return this;
 }

 /**
  * Clamped linear interpolation.
  * @param end - Target vector.
  * @param t - Interpolation factor (clamped).
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.8.0
  */
 public lerpClamped(end: ReadonlyVector2Like, t: number): this {
  return this.lerp(end, saturate(t));
 }

 /**
  * Linear interpolation without clamping t (alias for lerp).
  *
  * @param end - Target vector.
  * @param t - Interpolation factor (not clamped).
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public lerpUnclamped(end: ReadonlyVector2Like, t: number): this {
  return this.lerp(end, t);
 }

 /**
  * Spherical linear interpolation.
  * @param end - Target vector.
  * @param t - Interpolation factor.
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public slerp(end: ReadonlyVector2Like, t: number): this {
  const lengthA = this.length();
  const lengthB = Vector2.length(end);

  if (isNearZero(lengthA) || isNearZero(lengthB)) {
   return this.lerp(end, t);
  }

  const ax = this.x / lengthA;
  const ay = this.y / lengthA;
  const bx = end.x / lengthB;
  const by = end.y / lengthB;

  const dot = clamp(ax * bx + ay * by, -1, 1);
  const theta = safeAcos(dot);

  if (isNearZero(theta)) {
   return this.lerp(end, t);
  }

  const sinTheta = DeterministicMath.sin(theta);
  const wa = DeterministicMath.sin((1 - t) * theta) / sinTheta;
  const wb = DeterministicMath.sin(t * theta) / sinTheta;
  const lengthInterp = lerp(lengthA, lengthB, t);

  return this.set((wa * ax + wb * bx) * lengthInterp, (wa * ay + wb * by) * lengthInterp);
 }

 /**
  * Spherical linear interpolation with t clamped to [0, 1].
  * @param end - Target vector.
  * @param t - Interpolation factor (clamped to [0, 1]).
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public slerpClamped(end: ReadonlyVector2Like, t: number): this {
  return this.slerp(end, saturate(t));
 }

 /**
  * Smooth step interpolation.
  * @param end - Target vector.
  * @param t - Interpolation factor.
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.8.0
  */
 public smoothStep(end: ReadonlyVector2Like, t: number): this {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return this.lerp(end, factor);
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Tests if exactly zero.
  * @returns True if both components are zero.
  */
 public isZero(epsilon = 0): boolean {
  if (epsilon === 0) {
   return this.x === 0 && this.y === 0;
  }
  return isNearZero(this.x, epsilon) && isNearZero(this.y, epsilon);
 }

 /**
  * Exact equality with v (bit-identical).
  * @param v - Vector to compare.
  * @returns True if exactly identical.
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public exactEquals(v: ReadonlyVector2Like): boolean {
  return Vector2.exactEquals(this, v);
 }

 /**
  * Approximate equality with v using relative tolerance.
  * @param v - Vector to compare.
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public nearEquals(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return relativeEquals(this.x, v.x, epsilon) && relativeEquals(this.y, v.y, epsilon);
 }

 /**
  * Tests if this vector is near zero (both components within epsilon).
  *
  * @param epsilon - Tolerance for comparison.
  * @returns True if both components are within epsilon of zero.
  *
  * @category Comparison
  * @since 0.8.0
  */
 public isNearZero(epsilon = EPSILON): boolean {
  return Vector2.nearZero(this, epsilon);
 }

 /**
  * Tests if unit length.
  * @returns True if |length - 1| ≤ EPSILON.
  */
 public isUnit(): boolean {
  return scalarNearEquals(this.length(), 1);
 }

 /**
  * Tests if both components are finite.
  * @returns True if finite.
  */
 public isFinite(): boolean {
  return Number.isFinite(this.x) && Number.isFinite(this.y);
 }

 /**
  * Tests if any component is NaN.
  * @returns True if any component is NaN.
  */
 public hasNaN(): boolean {
  return Number.isNaN(this.x) || Number.isNaN(this.y);
 }

 /**
  * Tests parallelism with v.
  * @param v - Vector to compare.
  * @param epsilon - Tolerance.
  * @returns True if parallel.
  */
 public isParallelTo(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return Vector2.isParallel(this, v, epsilon);
 }

 /**
  * Tests perpendicularity with v.
  * @param v - Vector to compare.
  * @param epsilon - Tolerance.
  * @returns True if perpendicular.
  */
 public isPerpendicularTo(v: ReadonlyVector2Like, epsilon = EPSILON): boolean {
  return Vector2.isPerpendicular(this, v, epsilon);
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Returns a shallow clone.
  * @returns New Vector2 with same components.
  */
 public clone(): Vector2 {
  return new Vector2(this.x, this.y);
 }

 /**
  * Writes to array or typed array.
  * @param out - Destination array.
  * @param offset - Write offset.
  * @returns The output array.
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
  * @returns Object with x and y properties.
  */
 public toObject(): { x: number; y: number } {
  return { x: this.x, y: this.y };
 }

 /**
  * Alias for toObject (JSON serialization).
  * @returns Object with x and y properties.
  */
 public toJSON(): { x: number; y: number } {
  return this.toObject();
 }

 /**
  * Returns string representation.
  * @param precision - Decimal places. @defaultValue `4`
  * @returns Formatted string.
  *
  * @category Conversion
  * @since 0.1.0
  */
 public toString(precision = 4): string {
  return `Vector2(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)})`;
 }

 /**
  * Iterator for array destructuring.
  * @returns Iterator yielding x then y.
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.x;
  yield this.y;
 }

 /**
  * Converts this vector to a complex-like object.
  * @returns Object with real (x) and imag (y) properties.
  *
  * @remarks
  * Returns a plain object compatible with ComplexLike interface.
  * Does not create a Complex instance to avoid circular dependencies.
  *
  * @category Conversion
  * @since 0.9.0
  */
 public toComplexLike(): { real: number; imag: number } {
  return { real: this.x, imag: this.y };
 }

 /* ======================================================================== */
 /* Readonly Getters (New Vectors)                                           */
 /* ======================================================================== */

 /**
  * Returns perpendicular vector rotated 90° clockwise.
  * @returns New Vector2(y, -x).
  */
 public get perpCW(): Vector2 {
  return new Vector2(this.y, -this.x);
 }

 /**
  * Returns perpendicular vector rotated 90° counter-clockwise.
  * @returns New Vector2(-y, x).
  */
 public get perpCCW(): Vector2 {
  return new Vector2(-this.y, this.x);
 }

 /**
  * Returns a copy with x negated.
  * @returns New Vector2(-x, y).
  */
 public get flippedX(): Vector2 {
  return new Vector2(-this.x, this.y);
 }

 /**
  * Returns a copy with y negated.
  * @returns New Vector2(x, -y).
  */
 public get flippedY(): Vector2 {
  return new Vector2(this.x, -this.y);
 }

 /* ======================================================================== */
 /* Additional Instance Methods                                               */
 /* ======================================================================== */

 /**
  * Returns midpoint between this and other as a new vector.
  * @param other - Second endpoint.
  * @returns New midpoint vector.
  */
 public midpointTo(other: ReadonlyVector2Like): Vector2 {
  return Vector2.midpoint(this, other);
 }

 /**
  * Sets this vector to the midpoint between itself and v.
  *
  * @param v - The other vector.
  * @returns This for chaining.
  *
  * @category Transform
  * @since 0.8.0
  */
 public midpoint(v: ReadonlyVector2Like): this {
  this.x = (this.x + v.x) * 0.5;
  this.y = (this.y + v.y) * 0.5;
  return this;
 }

 /**
  * Applies step function: sets components to 0 where < edge, else 1.
  * @param edge - Threshold vector.
  * @returns This for chaining.
  */
 public stepBy(edge: ReadonlyVector2Like): this {
  this.x = scalarStep(edge.x, this.x);
  this.y = scalarStep(edge.y, this.y);
  return this;
 }

 /* ======================================================================== */
 /* Instance Transform Integration                                           */
 /* ======================================================================== */

 /**
  * Applies a rotation (unit complex) to this vector in place.
  * @param rotation - Rotation with c (cos) and s (sin) components.
  * @returns This for chaining.
  */
 public applyRotation(rotation: ReadonlyRotation2Like): this {
  const rx = rotation.cos * this.x - rotation.sin * this.y;
  const ry = rotation.sin * this.x + rotation.cos * this.y;
  return this.set(rx, ry);
 }

 /**
  * Transforms this vector by a 2x2 matrix in place.
  * @param matrix - Matrix with m00, m01, m10, m11 components.
  * @returns This for chaining.
  */
 public applyMatrix2(matrix: ReadonlyMatrix2Like): this {
  const rx = matrix.m00 * this.x + matrix.m10 * this.y;
  const ry = matrix.m01 * this.x + matrix.m11 * this.y;
  return this.set(rx, ry);
 }

 /**
  * Applies a full 2D transform (scale → rotate → translate) in place.
  * @param transform - Transform with position, rotation, and scale.
  * @returns This for chaining.
  */
 public applyTransform(transform: ReadonlyTransform2Like): this {
  const { cos, sin } = sinCos(transform.rotation);
  const sx = this.x * transform.scale.x;
  const sy = this.y * transform.scale.y;
  this.x = sx * cos - sy * sin + transform.position.x;
  this.y = sx * sin + sy * cos + transform.position.y;
  return this;
 }
}
