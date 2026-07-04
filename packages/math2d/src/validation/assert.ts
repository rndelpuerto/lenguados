/**
 * @file validation/assert.ts
 * @module @lenguados/math2d/validation
 * @description Debug assertions for development-time validation
 *
 * @remarks
 * **Pattern**: Development-only assertions with library-side build-time DCE.
 *
 * This module provides debug-only validation that is **completely eliminated**
 * in production builds via Dead Code Elimination (DCE) at the library build step.
 * The build-time constant substitution (configured in `rollup.config.mjs`) replaces
 * every literal occurrence of `__LENGUADOS_DEV__` with `false` for production library
 * bundles and `true` for development library bundles. The subsequent minification
 * strips `if (false) { ... }` blocks entirely.
 *
 * **Zero-Overhead Production**:
 * - Development bundle (`__LENGUADOS_DEV__ = true` literal): assertions active
 * - Production bundle (`__LENGUADOS_DEV__ = false` literal): assertion call sites,
 *   bodies, and string literals all removed at library build time
 *
 * **Two-Layer Protection System**:
 * 1. **Assertions** (this module): Catch errors early in development (eliminated in prod)
 * 2. **Safe functions** (`auxiliary/numeric/safety.ts`): Always active fallbacks
 *
 * **Categories in this module**:
 * - **Configuration**: Enable/disable assertion system at runtime (dev only)
 * - **Scalar Assertion**: Validate numeric values (finite, range, sign)
 * - **Generic Assertion**: Base assertion for any condition
 * - **Type Assertion**: Validate math types (Vector2, Matrix2, Matrix3, Rotation2)
 *
 * @example
 * ```typescript
 * import { assertFinite } from '@lenguados/math2d';
 *
 * // Development: assertions throw on invalid input
 * assertFinite(value, 'myParam');  // Throws if NaN/Infinity
 *
 * // Production: assertion calls are eliminated by DCE
 * // The above line becomes a no-op with ZERO runtime cost
 * ```
 *
 * @see {@link divideSafe} - Always-active safe division
 * @see {@link sqrtSafe} - Always-active safe square root
 */

import type {
 ComplexLike,
 IntervalLike,
 Matrix2Like,
 Matrix3Like,
 Rotation2Like,
 Transform2Like,
 Vector2Like,
} from '../types';
import {
 isComplexLike,
 isIntervalLike,
 isMatrix2Like,
 isMatrix3Like,
 isRotation2Like,
 isTransform2Like,
 isVector2Like,
} from '../types';

/* ========================================================================== */
/* Compile-Time Configuration                                                  */
/* ========================================================================== */

/**
 * Compile-time development-mode flag
 *
 * @remarks
 * **Library-side build-time DCE**:
 * The build-time constant substitution (configured at `rollup.config.mjs`
 * `jsc.transform.optimizer.globals.vars`) replaces every literal occurrence of
 * `__LENGUADOS_DEV__` with `false` in production library bundles and `true` in
 * development library bundles. Subsequent minification eliminates
 * `if (false) { ... }` blocks entirely — including the assertion
 * call sites and their string literals — so the library's production bundles are
 * self-contained and have zero assertion overhead, independently of any consumer
 * bundler configuration.
 *
 * @internal
 */
declare const __LENGUADOS_DEV__: boolean;

const DEV_MODE: boolean = __LENGUADOS_DEV__;

/* ========================================================================== */
/* Runtime State (Development Only)                                            */
/* ========================================================================== */

/**
 * Runtime assertions state for development
 * Only used when DEV_MODE is true.
 * @internal
 */
let assertionsEnabled = true;

/* ========================================================================== */
/* Configuration                                                               */
/* ========================================================================== */

/**
 * Enables or disables assertions globally at runtime
 *
 * @remarks
 * **Development only**: this function only has effect when consuming the
 * development library bundle (where `__LENGUADOS_DEV__` resolved to `true` at
 * library build time). In production library bundles the entire `if (DEV_MODE)`
 * branch in every assertion call site has been eliminated by the minifier, so
 * `setAssertionsEnabled` is a literal no-op — the stored module-internal
 * `assertionsEnabled` variable can still be toggled, but no assertion code is
 * reachable to read it. This is intentional: application code that toggles
 * assertions must not produce divergent runtime behaviour between dev and prod.
 *
 * The `safe*` functions in `auxiliary/numeric/safety.ts` remain active
 * regardless of this setting — they are the always-on safety net that
 * survives production DCE.
 *
 * @param enabled - `true` to enable assertions, `false` to disable
 *
 * @example
 * ```typescript
 * // Temporarily disable assertions for profiling (development only).
 * setAssertionsEnabled(false);
 *
 * // Re-enable for debugging.
 * setAssertionsEnabled(true);
 * ```
 *
 * @category Configuration
 * @since 0.7.0
 */
export function setAssertionsEnabled(enabled: boolean): void {
 assertionsEnabled = enabled;
}

/**
 * Returns the current assertions state
 *
 * @remarks
 * In the development library bundle: returns the runtime state set by
 * {@link setAssertionsEnabled}. In the production library bundle: the
 * `DEV_MODE` short-circuit evaluates `false && assertionsEnabled` at the
 * literal level after the build-time constant substitution, and the call
 * typically reduces to a literal `return false;` after minification.
 *
 * @returns `true` if assertions are enabled, `false` otherwise
 *
 * @example
 * ```typescript
 * if (areAssertionsEnabled()) {
 *   console.log('Debug mode: assertions active');
 * }
 * ```
 *
 * @category Configuration
 * @since 0.7.0
 */
export function areAssertionsEnabled(): boolean {
 return DEV_MODE && assertionsEnabled;
}

/* ========================================================================== */
/* Scalar Assertion                                                            */
/* ========================================================================== */

/**
 * Asserts that a value is finite (not NaN, not Infinity)
 *
 * @remarks
 * No-op when assertions are disabled. Zero runtime cost in production.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value is not finite
 *
 * @example
 * ```typescript
 * function computeVelocity(dx: number, dt: number): number {
 *   assertFinite(dx, 'dx');
 *   assertFinite(dt, 'dt');
 *   return dx / dt;
 * }
 * ```
 *
 * @see {@link ensureFinite} - Always-active Safe variant that returns a fallback
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertFinite(value: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (!Number.isFinite(value)) {
  throw new Error(
   `[math2d] ${name ?? 'value'} must be finite, got ${value}. Use ensureFinite() for a fallback value`,
  );
 }
}

/**
 * Asserts that a value is not zero
 *
 * @remarks
 * Uses strict equality (`=== 0`). For near-zero checks, use `isNearZero`.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value is zero or NaN
 *
 * @example
 * ```typescript
 * function divideScalar(v: Vector2, s: number): Vector2 {
 *   assertNonZero(s, 'scalar');
 *   return v.divideScalar(s);
 * }
 * ```
 *
 * @see {@link divideSafe} - Always-active Safe variant that returns a fallback on zero
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertNonZero(value: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value !== value || value === 0) {
  throw new Error(
   `[math2d] ${name ?? 'value'} must not be zero. Use divideSafe() for a fallback value`,
  );
 }
}

/**
 * Asserts that a value is within a range (inclusive)
 *
 * @remarks
 * Uses inclusive bounds: `min ≤ value ≤ max`.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param min - Minimum inclusive bound
 * @param max - Maximum inclusive bound
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value ∉ [min, max]
 *
 * @example
 * ```typescript
 * function lerp(a: number, b: number, t: number): number {
 *   assertRange(t, 0, 1, 't');
 *   return a + (b - a) * t;
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertRange(value: number, min: number, max: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value !== value || value < min || value > max) {
  throw new Error(`[math2d] ${name ?? 'value'} must be in [${min}, ${max}], got ${value}`);
 }
}

/**
 * Asserts that a value is strictly positive (> 0)
 *
 * @remarks
 * Zero is not considered positive. Use `assertNonNegative` for ≥ 0.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value is ≤ 0 or NaN
 *
 * @example
 * ```typescript
 * function setRadius(r: number): void {
 *   assertPositive(r, 'radius');
 *   this.radius = r;
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertPositive(value: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value !== value || value <= 0) {
  throw new Error(
   `[math2d] ${name ?? 'value'} must be positive (> 0), got ${value}. Use clamp() or saturate() for a safe range`,
  );
 }
}

/**
 * Asserts that a value is non-negative (≥ 0)
 *
 * @remarks
 * Zero is considered valid. Use `assertPositive` for strictly > 0.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value is < 0 or NaN
 *
 * @example
 * ```typescript
 * function setBound(value: number): void {
 *   assertNonNegative(value, 'bound');
 * }
 * ```
 *
 * @see {@link sqrtSafe} - Always-active Safe variant that clamps negative input to 0
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertNonNegative(value: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value !== value || value < 0) {
  throw new Error(
   `[math2d] ${name ?? 'value'} must be non-negative (>= 0), got ${value}. Use clamp() or saturate() for a safe range`,
  );
 }
}

/**
 * Asserts that a value is a safe JavaScript integer
 *
 * @remarks
 * Safe integers are integers that can be exactly represented as
 * IEEE-754 double precision numbers. Range: -(2⁵³ - 1) to 2⁵³ - 1.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If value is not a safe integer
 *
 * @example
 * ```typescript
 * function setIndex(i: number): void {
 *   assertSafeInteger(i, 'index');
 *   this.index = i;
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertSafeInteger(value: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (!Number.isSafeInteger(value)) {
  throw new Error(`[math2d] ${name ?? 'value'} must be a safe integer, got ${value}`);
 }
}

/* ========================================================================== */
/* Generic Assertion                                                           */
/* ========================================================================== */

/**
 * Asserts a generic boolean condition
 *
 * @remarks
 * Base assertion for any custom validation logic.
 * No-op when assertions are disabled.
 *
 * @param condition - Boolean condition to validate
 * @param message - Error message if condition is false (optional)
 * @throws {Error} If assertions enabled and condition is `false`
 *
 * @example
 * ```typescript
 * assert(array.length > 0, 'Array must not be empty');
 * assert(index >= 0 && index < array.length, `Index ${index} out of bounds`);
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assert(condition: boolean, message?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (!condition) {
  throw new Error(`[math2d] ${message ?? 'Assertion failed'}`);
 }
}

/* ========================================================================== */
/* Type Assertion                                                              */
/* ========================================================================== */

/**
 * Asserts that Vector2-like components are finite
 *
 * @remarks
 * Validates both components are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
 *
 * @param x - X component to validate
 * @param y - Y component to validate
 * @param name - Vector name for error messages (optional)
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function createVector(x: number, y: number): Vector2 {
 *   assertVector2(x, y, 'input');
 *   return new Vector2(x, y);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertVector2(x: number, y: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const prefix = name ? `${name}.` : '';
 if (!Number.isFinite(x)) {
  throw new Error(`[math2d] ${prefix}x must be finite, got ${x}`);
 }
 if (!Number.isFinite(y)) {
  throw new Error(`[math2d] ${prefix}y must be finite, got ${y}`);
 }
}

/**
 * Asserts that Matrix2-like elements are finite
 *
 * @remarks
 * Validates all 4 elements are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
 *
 * @param m00 - Element at row 0, column 0
 * @param m01 - Element at row 0, column 1
 * @param m10 - Element at row 1, column 0
 * @param m11 - Element at row 1, column 1
 * @param name - Matrix name for error messages (optional)
 * @throws {Error} If assertions enabled and any element is not finite
 *
 * @example
 * ```typescript
 * function createMatrix(m00: number, m01: number, m10: number, m11: number): Matrix2 {
 *   assertMatrix2(m00, m01, m10, m11, 'input');
 *   return new Matrix2(m00, m01, m10, m11);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertMatrix2(
 m00: number,
 m01: number,
 m10: number,
 m11: number,
 name?: string,
): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const prefix = name ?? 'matrix';
 if (!Number.isFinite(m00)) {
  throw new Error(`[math2d] ${prefix}[0,0] must be finite, got ${m00}`);
 }
 if (!Number.isFinite(m01)) {
  throw new Error(`[math2d] ${prefix}[0,1] must be finite, got ${m01}`);
 }
 if (!Number.isFinite(m10)) {
  throw new Error(`[math2d] ${prefix}[1,0] must be finite, got ${m10}`);
 }
 if (!Number.isFinite(m11)) {
  throw new Error(`[math2d] ${prefix}[1,1] must be finite, got ${m11}`);
 }
}

/**
 * Asserts that Matrix3-like elements are finite
 *
 * @remarks
 * Validates all 9 elements are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
 *
 * @param m00 - Element at row 0, column 0
 * @param m01 - Element at row 0, column 1
 * @param m02 - Element at row 0, column 2
 * @param m10 - Element at row 1, column 0
 * @param m11 - Element at row 1, column 1
 * @param m12 - Element at row 1, column 2
 * @param m20 - Element at row 2, column 0
 * @param m21 - Element at row 2, column 1
 * @param m22 - Element at row 2, column 2
 * @param name - Matrix name for error messages (optional)
 * @throws {Error} If assertions enabled and any element is not finite
 *
 * @example
 * ```typescript
 * function createMatrix(elements: number[]): Matrix3 {
 *   assertMatrix3(elements[0], elements[1], elements[2],
 *                 elements[3], elements[4], elements[5],
 *                 elements[6], elements[7], elements[8], 'input');
 *   return Matrix3.fromArray(elements);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertMatrix3(
 m00: number,
 m01: number,
 m02: number,
 m10: number,
 m11: number,
 m12: number,
 m20: number,
 m21: number,
 m22: number,
 name?: string,
): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const prefix = name ?? 'matrix';
 if (!Number.isFinite(m00)) {
  throw new Error(`[math2d] ${prefix}[0,0] must be finite, got ${m00}`);
 }
 if (!Number.isFinite(m01)) {
  throw new Error(`[math2d] ${prefix}[0,1] must be finite, got ${m01}`);
 }
 if (!Number.isFinite(m02)) {
  throw new Error(`[math2d] ${prefix}[0,2] must be finite, got ${m02}`);
 }
 if (!Number.isFinite(m10)) {
  throw new Error(`[math2d] ${prefix}[1,0] must be finite, got ${m10}`);
 }
 if (!Number.isFinite(m11)) {
  throw new Error(`[math2d] ${prefix}[1,1] must be finite, got ${m11}`);
 }
 if (!Number.isFinite(m12)) {
  throw new Error(`[math2d] ${prefix}[1,2] must be finite, got ${m12}`);
 }
 if (!Number.isFinite(m20)) {
  throw new Error(`[math2d] ${prefix}[2,0] must be finite, got ${m20}`);
 }
 if (!Number.isFinite(m21)) {
  throw new Error(`[math2d] ${prefix}[2,1] must be finite, got ${m21}`);
 }
 if (!Number.isFinite(m22)) {
  throw new Error(`[math2d] ${prefix}[2,2] must be finite, got ${m22}`);
 }
}

/**
 * Asserts that Rotation2-like components are finite
 *
 * @remarks
 * Validates both cos and sin are finite (not NaN, not Infinity).
 * Does NOT validate that cos² + sin² = 1 (unit constraint).
 * No-op when assertions are disabled.
 *
 * @param cos - Cosine component to validate
 * @param sin - Sine component to validate
 * @param name - Rotation name for error messages (optional)
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function createRotation(cos: number, sin: number): Rotation2 {
 *   assertRotation2(cos, sin, 'input');
 *   return new Rotation2(cos, sin);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertRotation2(cos: number, sin: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const prefix = name ? `${name}.` : '';
 if (!Number.isFinite(cos)) {
  throw new Error(`[math2d] ${prefix}cos must be finite, got ${cos}`);
 }
 if (!Number.isFinite(sin)) {
  throw new Error(`[math2d] ${prefix}sin must be finite, got ${sin}`);
 }
}

/**
 * Asserts that Rotation2-like components are finite AND form a unit rotation
 *
 * @remarks
 * Validates that cos and sin are finite AND that cos² + sin² ≈ 1 within
 * the given tolerance. Use this for stricter validation than {@link assertRotation2}
 * when the unit constraint must be enforced.
 * No-op when assertions are disabled.
 *
 * @param cos - Cosine component to validate
 * @param sin - Sine component to validate
 * @param tolerance - Maximum deviation of cos²+sin² from 1 (default: 1e-10)
 * @param name - Rotation name for error messages (optional)
 * @throws {Error} If assertions enabled and components are not finite or not unit
 *
 * @example
 * ```typescript
 * assertRotation2Normalized(1, 0); // passes (unit rotation)
 * assertRotation2Normalized(0.6, 0.8); // passes (cos²+sin² = 1)
 * assertRotation2Normalized(2, 0); // throws (cos²+sin² = 4)
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertRotation2Normalized(
 cos: number,
 sin: number,
 tolerance = 1e-10,
 name?: string,
): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const prefix = name ? `${name}.` : '';
 if (!Number.isFinite(cos)) {
  throw new Error(`[math2d] ${prefix}cos must be finite, got ${cos}`);
 }
 if (!Number.isFinite(sin)) {
  throw new Error(`[math2d] ${prefix}sin must be finite, got ${sin}`);
 }
 const magSq = cos * cos + sin * sin;
 if (Math.abs(magSq - 1) > tolerance) {
  throw new Error(`[math2d] ${prefix}rotation must be unit (cos²+sin² ≈ 1), got ${magSq}`);
 }
}

/**
 * Asserts that Complex-like components are finite
 *
 * @remarks
 * Validates both real and imag are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
 *
 * @param real - Real component to validate
 * @param imag - Imaginary component to validate
 * @param name - Complex name for error messages (optional)
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function createComplex(real: number, imag: number): Complex {
 *   assertComplex(real, imag, 'input');
 *   return new Complex(real, imag);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertComplex(real: number, imag: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const prefix = name ? `${name}.` : '';
 if (!Number.isFinite(real)) {
  throw new Error(`[math2d] ${prefix}real must be finite, got ${real}`);
 }
 if (!Number.isFinite(imag)) {
  throw new Error(`[math2d] ${prefix}imag must be finite, got ${imag}`);
 }
}

/**
 * Asserts that Interval components are finite and properly ordered
 *
 * @remarks
 * Validates both components are finite AND min <= max.
 * No-op when assertions are disabled.
 *
 * @param min - Minimum bound to validate
 * @param max - Maximum bound to validate
 * @param name - Interval name for error messages (optional)
 * @throws {Error} If assertions enabled and any component is not finite or min > max
 *
 * @example
 * ```typescript
 * function createInterval(min: number, max: number): Interval {
 *   assertInterval(min, max, 'bounds');
 *   return new Interval(min, max);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertInterval(min: number, max: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'interval';
 if (!Number.isFinite(min)) {
  throw new Error(`[math2d] ${label}.min must be finite, got ${min}`);
 }
 if (!Number.isFinite(max)) {
  throw new Error(`[math2d] ${label}.max must be finite, got ${max}`);
 }
 if (min > max) {
  throw new Error(`[math2d] ${label}.min (${min}) must not exceed ${label}.max (${max})`);
 }
}

/**
 * Asserts that Transform2 components are finite
 *
 * @remarks
 * Validates all 6 components are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
 *
 * @param px - Position X to validate
 * @param py - Position Y to validate
 * @param cos - Rotation cosine to validate
 * @param sin - Rotation sine to validate
 * @param sx - Scale X to validate
 * @param sy - Scale Y to validate
 * @param name - Transform name for error messages (optional)
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function createTransform(px: number, py: number, cos: number, sin: number): Transform2 {
 *   assertTransform2(px, py, cos, sin, 1, 1, 'input');
 *   return new Transform2(px, py, cos, sin, 1, 1);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertTransform2(
 px: number,
 py: number,
 cos: number,
 sin: number,
 sx: number,
 sy: number,
 name?: string,
): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const prefix = name ? `${name}.` : '';
 if (!Number.isFinite(px)) {
  throw new Error(`[math2d] ${prefix}position.x must be finite, got ${px}`);
 }
 if (!Number.isFinite(py)) {
  throw new Error(`[math2d] ${prefix}position.y must be finite, got ${py}`);
 }
 if (!Number.isFinite(cos)) {
  throw new Error(`[math2d] ${prefix}rotation.cos must be finite, got ${cos}`);
 }
 if (!Number.isFinite(sin)) {
  throw new Error(`[math2d] ${prefix}rotation.sin must be finite, got ${sin}`);
 }
 if (!Number.isFinite(sx)) {
  throw new Error(`[math2d] ${prefix}scale.x must be finite, got ${sx}`);
 }
 if (!Number.isFinite(sy)) {
  throw new Error(`[math2d] ${prefix}scale.y must be finite, got ${sy}`);
 }
}

/* ========================================================================== */
/* Object Shape Assertion                                                      */
/* ========================================================================== */

/**
 * Flat-key tuples for the six `assert*Like` shapes that admit a uniform
 * key iteration. `Transform2Like` is intentionally excluded — its nested
 * structure (`{ position, rotation, scale }`) does not reduce to a flat
 * list and is handled bespoke in `assertTransform2Like`.
 *
 * @internal
 */
const VECTOR2_KEYS = ['x', 'y'] as const;
/** @internal */
const ROTATION2_KEYS = ['cos', 'sin'] as const;
/** @internal */
const COMPLEX_KEYS = ['real', 'imag'] as const;
/** @internal */
const INTERVAL_KEYS = ['min', 'max'] as const;
/** @internal */
const MATRIX2_KEYS = ['m00', 'm01', 'm10', 'm11'] as const;
/** @internal */
const MATRIX3_KEYS = ['m00', 'm01', 'm02', 'm10', 'm11', 'm12', 'm20', 'm21', 'm22'] as const;

/**
 * Shared shape-and-finiteness check for the `assert*Like` family
 *
 * @remarks
 * Centralises the pattern "runtime type guard + every declared key is a finite
 * number" so the six flat-shape `assert*Like` callers do not reinvent the
 * pre-check + loop on every core type. `assertIntervalLike` routes through
 * this helper and then appends the `min ≤ max` invariant; `assertTransform2Like`
 * is excluded because its nested shape (`position`, `rotation`, `scale`) would
 * not decompose cleanly into a flat key list.
 *
 * The helper is a no-op when assertions are disabled or in production builds
 * (eliminated via DCE together with its callers).
 *
 * @param value - Unknown candidate to validate
 * @param typeName - Human-readable type label used in the `TypeError` message (e.g. `'Vector2Like'`)
 * @param isLike - Type-guard predicate that checks the shape of `value`
 * @param keys - Flat list of numeric property names that must each be finite
 * @param name - Optional caller-facing label for error messages
 * @throws {TypeError} If `value` fails the type guard
 * @throws {Error} If any `key` in `value` is not a finite number
 *
 * @internal
 * @category Helpers
 * @since 0.7.0
 */
function validateShape(
 value: unknown,
 typeName: string,
 isLike: (v: unknown) => boolean,
 keys: readonly string[],
 name?: string,
): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isLike(value)) {
  throw new TypeError(`[math2d] Expected ${typeName} for ${label}, got ${typeof value}`);
 }
 const numericView = value as Record<string, number>;
 for (const key of keys) {
  if (!Number.isFinite(numericView[key])) {
   throw new Error(`[math2d] ${label}.${key} must be a finite number`);
  }
 }
}

/**
 * Asserts that an object has valid Vector2-like shape with finite components
 *
 * @remarks
 * Validates that object has `x` and `y` numeric properties that are finite.
 * No-op when assertions are disabled. In production builds, this function
 * is eliminated via DCE. For runtime shape validation, use `isVector2Like()`.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {TypeError} If assertions enabled and object is not Vector2-like
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function processVector(v: unknown): Vector2 {
 *   assertVector2Like(v, 'input');
 *   return new Vector2(v.x, v.y);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertVector2Like(value: unknown, name?: string): asserts value is Vector2Like {
 validateShape(value, 'Vector2Like', isVector2Like, VECTOR2_KEYS, name);
}

/**
 * Asserts that an object has valid Rotation2-like shape with finite elements
 *
 * @remarks
 * Validates that object has `cos` and `sin` numeric properties that are finite.
 * No-op when assertions are disabled. In production builds, this function
 * is eliminated via DCE. For runtime shape validation, use `isRotation2Like()`.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {TypeError} If assertions enabled and object is not Rotation2-like
 * @throws {Error} If assertions enabled and any element is not finite
 *
 * @example
 * ```typescript
 * function processRotation(r: unknown): Rotation2 {
 *   assertRotation2Like(r, 'input');
 *   return new Rotation2(r.cos, r.sin);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertRotation2Like(value: unknown, name?: string): asserts value is Rotation2Like {
 validateShape(value, 'Rotation2Like', isRotation2Like, ROTATION2_KEYS, name);
}

/**
 * Asserts that an object has valid Matrix2-like shape with finite elements
 *
 * @remarks
 * Validates that object has `m00`, `m01`, `m10`, `m11` numeric properties that are finite.
 * No-op when assertions are disabled. In production builds, this function
 * is eliminated via DCE. For runtime shape validation, use `isMatrix2Like()`.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {TypeError} If assertions enabled and object is not Matrix2-like
 * @throws {Error} If assertions enabled and any element is not finite
 *
 * @example
 * ```typescript
 * function processMatrix(m: unknown): Matrix2 {
 *   assertMatrix2Like(m, 'input');
 *   return new Matrix2(m.m00, m.m01, m.m10, m.m11);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertMatrix2Like(value: unknown, name?: string): asserts value is Matrix2Like {
 validateShape(value, 'Matrix2Like', isMatrix2Like, MATRIX2_KEYS, name);
}

/**
 * Asserts that an object has valid Matrix3-like shape with finite elements
 *
 * @remarks
 * Validates that object has `m00`..`m22` numeric properties that are finite.
 * No-op when assertions are disabled. In production builds, this function
 * is eliminated via DCE. For runtime shape validation, use `isMatrix3Like()`.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {TypeError} If assertions enabled and object is not Matrix3-like
 * @throws {Error} If assertions enabled and any element is not finite
 *
 * @example
 * ```typescript
 * function processMatrix3(m: unknown): void {
 *   assertMatrix3Like(m, 'transform');
 *   // m is now validated as Matrix3Like with finite elements
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertMatrix3Like(value: unknown, name?: string): asserts value is Matrix3Like {
 validateShape(value, 'Matrix3Like', isMatrix3Like, MATRIX3_KEYS, name);
}

/**
 * Asserts that an object has valid Complex-like shape with finite components
 *
 * @remarks
 * Validates that object has `real` and `imag` numeric properties that are finite.
 * No-op when assertions are disabled. In production builds, this function
 * is eliminated via DCE. For runtime shape validation, use `isComplexLike()`.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {TypeError} If assertions enabled and object is not Complex-like
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function processComplex(c: unknown): Complex {
 *   assertComplexLike(c, 'input');
 *   return new Complex(c.real, c.imag);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertComplexLike(value: unknown, name?: string): asserts value is ComplexLike {
 validateShape(value, 'ComplexLike', isComplexLike, COMPLEX_KEYS, name);
}

/**
 * Asserts that an object has valid Interval-like shape with finite bounds
 *
 * @remarks
 * Validates that object has `min` and `max` numeric properties that are finite.
 * Also validates that min ≤ max.
 * No-op when assertions are disabled. In production builds, this function
 * is eliminated via DCE. For runtime shape validation, use `isIntervalLike()`.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {TypeError} If assertions enabled and object is not Interval-like
 * @throws {Error} If assertions enabled and any bound is not finite or min > max
 *
 * @example
 * ```typescript
 * function processInterval(i: unknown): Interval {
 *   assertIntervalLike(i, 'range');
 *   return new Interval(i.min, i.max);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertIntervalLike(value: unknown, name?: string): asserts value is IntervalLike {
 validateShape(value, 'IntervalLike', isIntervalLike, INTERVAL_KEYS, name);
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const typed = value as IntervalLike;
 if (typed.min > typed.max) {
  const label = name ?? 'value';
  throw new Error(
   `[math2d] ${label}.min (${typed.min}) must not exceed ${label}.max (${typed.max})`,
  );
 }
}

/**
 * Asserts that an object has valid Transform2-like shape
 *
 * @remarks
 * Validates that object has `position` (Vector2-like), `rotation` (Rotation2-like), and `scale` (Vector2-like).
 * No-op when assertions are disabled. In production builds, this function
 * is eliminated via DCE. For runtime shape validation, use `isTransform2Like()`.
 *
 * Unlike the other six `assert*Like` helpers, this function does NOT route
 * through the shared `validateShape` helper. Transform2Like has a nested
 * structure (`{ position: Vector2Like, rotation: Rotation2Like, scale: Vector2Like }`)
 * whose finite-number fields live one level deeper than a flat `*_KEYS` tuple
 * can express, so the shape and finite checks are kept inline here.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {TypeError} If assertions enabled and object is not Transform2-like
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function processTransform(t: unknown): void {
 *   assertTransform2Like(t, 'input');
 *   // t is now validated as Transform2Like with finite components
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertTransform2Like(
 value: unknown,
 name?: string,
): asserts value is Transform2Like {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isTransform2Like(value)) {
  throw new TypeError(`[math2d] Expected Transform2Like for ${label}, got ${typeof value}`);
 }
 // Finite checks for all sub-components
 if (!Number.isFinite(value.position.x) || !Number.isFinite(value.position.y)) {
  throw new Error(`[math2d] ${label}.position.x and .y must be finite numbers`);
 }
 if (!Number.isFinite(value.rotation.cos) || !Number.isFinite(value.rotation.sin)) {
  throw new Error(`[math2d] ${label}.rotation.cos and .sin must be finite numbers`);
 }
 if (!Number.isFinite(value.scale.x) || !Number.isFinite(value.scale.y)) {
  throw new Error(`[math2d] ${label}.scale.x and .y must be finite numbers`);
 }
}
