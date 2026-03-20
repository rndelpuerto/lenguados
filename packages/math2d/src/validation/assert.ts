/**
 * @file validation/assert.ts
 * @module @lenguados/math2d/validation
 * @description Debug assertions for development-time validation
 *
 * @remarks
 * **Pattern**: Inspired by Box2D/Bullet Physics assertions with compile-time DCE.
 *
 * This module provides debug-only validation that is **completely eliminated**
 * in production builds via Dead Code Elimination (DCE). The `process.env.NODE_ENV`
 * ecosystem standard is used to safely trigger minifier pruning (e.g., in Vite, Webpack, Rollup).
 *
 * **Zero-Overhead Production**:
 * - Development: `process.env.NODE_ENV !== 'production'` → assertions active
 * - Production: `process.env.NODE_ENV === 'production'` → all assertion code eliminated
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
 * Resolves the development mode flag.
 *
 * @remarks
 * **Industry Standard DCE (Dead Code Elimination)**:
 * Modern bundlers (Vite, Webpack, Rollup) automatically replace `process.env.NODE_ENV !== 'production'`
 * with `false` during a production build. This guarantees that all `assert` functions
 * become unreachable (e.g. `if (false) { ... }`) and are completely stripped from the final bundle by minifiers,
 * providing zero-overhead development assertions.
 *
 * @internal
 */
declare const process: { env: { NODE_ENV: string } } | undefined;

const DEV_MODE: boolean =
 typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production'
  ? false
  : true;

/* ========================================================================== */
/* Runtime State (Development Only)                                            */
/* ========================================================================== */

/**
 * Runtime assertions state for development.
 * Only used when DEV_MODE is true.
 * @internal
 */
let assertionsEnabled = true;

/* ========================================================================== */
/* Configuration                                                               */
/* ========================================================================== */

/**
 * Enables or disables assertions globally at runtime.
 *
 * @remarks
 * **Development only**: This function only has effect when `process.env.NODE_ENV !== 'production'`
 * (development build). In production builds, assertions are
 * eliminated at compile-time via DCE (Dead Code Elimination).
 *
 * The `safe*` functions in `auxiliary/numeric/safety.ts` remain active
 * regardless of this setting.
 *
 * @param enabled - `true` to enable assertions, `false` to disable
 *
 * @example
 * ```typescript
 * // Temporarily disable assertions for performance testing
 * setAssertionsEnabled(false);
 *
 * // Re-enable for debugging
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
 * Returns the current assertions state.
 *
 * @remarks
 * In development: Returns the runtime state set by {@link setAssertionsEnabled}.
 * In production: Always returns `false` (assertions are compile-time eliminated).
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
 * Asserts that a value is finite (not NaN, not Infinity).
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
 * Asserts that a value is not zero.
 *
 * @remarks
 * Uses strict equality (`=== 0`). For near-zero checks, use `isNearZero`.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value is exactly zero
 *
 * @example
 * ```typescript
 * function divideScalar(v: Vector2, s: number): Vector2 {
 *   assertNonZero(s, 'scalar');
 *   return v.divideScalar(s);
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertNonZero(value: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value === 0) {
  throw new Error(
   `[math2d] ${name ?? 'value'} must not be zero. Use divideSafe() for a fallback value`,
  );
 }
}

/**
 * Asserts that a value is within a range (inclusive).
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
 * Asserts that a value is strictly positive (> 0).
 *
 * @remarks
 * Zero is not considered positive. Use `assertNonNegative` for ≥ 0.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value ≤ 0
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
 if (value <= 0) {
  throw new Error(
   `[math2d] ${name ?? 'value'} must be positive (> 0), got ${value}. Use clamp() or saturate() for a safe range`,
  );
 }
}

/**
 * Asserts that a value is non-negative (≥ 0).
 *
 * @remarks
 * Zero is considered valid. Use `assertPositive` for strictly > 0.
 * No-op when assertions are disabled.
 *
 * @param value - Numeric value to validate
 * @param name - Parameter name for error messages (optional)
 * @throws {Error} If assertions enabled and value < 0
 *
 * @example
 * ```typescript
 * function setMass(m: number): void {
 *   assertNonNegative(m, 'mass');
 *   this.mass = m;
 * }
 * ```
 *
 * @category Assertion
 * @since 0.7.0
 */
export function assertNonNegative(value: number, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value < 0) {
  throw new Error(
   `[math2d] ${name ?? 'value'} must be non-negative (>= 0), got ${value}. Use clamp() or saturate() for a safe range`,
  );
 }
}

/**
 * Asserts that a value is a safe JavaScript integer.
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
 * Asserts a generic boolean condition.
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
 * Asserts that Vector2-like components are finite.
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
 * Asserts that Matrix2-like elements are finite.
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
 * Asserts that Matrix3-like elements are finite.
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
 * Asserts that Rotation2-like components are finite.
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
 * Asserts that Complex-like components are finite.
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
 * @since 0.8.0
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
 * Asserts that Interval components are finite and properly ordered.
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
 * @since 0.8.0
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
 * Asserts that Transform2 components are finite.
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
 * @since 0.8.0
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
 * Asserts that an object has valid Vector2-like shape with finite components.
 *
 * @remarks
 * Validates that object has `x` and `y` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {Error} If assertions enabled and object is not Vector2-like or has invalid components
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
export function assertVector2Like(value: unknown, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isVector2Like(value)) {
  throw new TypeError(`[math2d] Expected Vector2Like for ${label}, got ${typeof value}`);
 }
 if (!Number.isFinite(value.x) || !Number.isFinite(value.y)) {
  throw new Error(`[math2d] ${label}.x and .y must be finite numbers`);
 }
}

/**
 * Asserts that an object has valid Rotation2-like shape with finite elements.
 *
 * @remarks
 * Validates that object has `cos` and `sin` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {Error} If assertions enabled and object is not Rotation2-like or has invalid elements
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
 * @since 0.8.0
 */
export function assertRotation2Like(value: unknown, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isRotation2Like(value)) {
  throw new TypeError(`[math2d] Expected Rotation2Like for ${label}, got ${typeof value}`);
 }
 if (!Number.isFinite(value.cos) || !Number.isFinite(value.sin)) {
  throw new Error(`[math2d] ${label}.cos and .sin must be finite numbers`);
 }
}

/**
 * Asserts that an object has valid Matrix2-like shape with finite elements.
 *
 * @remarks
 * Validates that object has `m00`, `m01`, `m10`, `m11` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {Error} If assertions enabled and object is not Matrix2-like or has invalid elements
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
export function assertMatrix2Like(value: unknown, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isMatrix2Like(value)) {
  throw new TypeError(`[math2d] Expected Matrix2Like for ${label}, got ${typeof value}`);
 }
 for (const key of ['m00', 'm01', 'm10', 'm11'] as const) {
  if (!Number.isFinite(value[key])) {
   throw new Error(`[math2d] ${label}.${key} must be a finite number`);
  }
 }
}

/**
 * Asserts that an object has valid Matrix3-like shape with finite elements.
 *
 * @remarks
 * Validates that object has `m00`..`m22` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {Error} If assertions enabled and object is not Matrix3-like or has invalid elements
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
 * @since 0.8.0
 */
export function assertMatrix3Like(value: unknown, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isMatrix3Like(value)) {
  throw new TypeError(`[math2d] Expected Matrix3Like for ${label}, got ${typeof value}`);
 }
 for (const key of ['m00', 'm01', 'm02', 'm10', 'm11', 'm12', 'm20', 'm21', 'm22'] as const) {
  if (!Number.isFinite(value[key])) {
   throw new Error(`[math2d] ${label}.${key} must be a finite number`);
  }
 }
}

/**
 * Asserts that an object has valid Complex-like shape with finite components.
 *
 * @remarks
 * Validates that object has `real` and `imag` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {Error} If assertions enabled and object is not Complex-like or has invalid components
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
export function assertComplexLike(value: unknown, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isComplexLike(value)) {
  throw new TypeError(`[math2d] Expected ComplexLike for ${label}, got ${typeof value}`);
 }
 if (!Number.isFinite(value.real) || !Number.isFinite(value.imag)) {
  throw new Error(`[math2d] ${label}.real and .imag must be finite numbers`);
 }
}

/**
 * Asserts that an object has valid Interval-like shape with finite bounds.
 *
 * @remarks
 * Validates that object has `min` and `max` numeric properties that are finite.
 * Also validates that min ≤ max.
 * No-op when assertions are disabled.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {Error} If assertions enabled and object is not Interval-like or has invalid bounds
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
export function assertIntervalLike(value: unknown, name?: string): void {
 /* istanbul ignore next -- DCE: eliminated in production */
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (!isIntervalLike(value)) {
  throw new TypeError(`[math2d] Expected IntervalLike for ${label}, got ${typeof value}`);
 }
 if (!Number.isFinite(value.min) || !Number.isFinite(value.max)) {
  throw new Error(`[math2d] ${label}.min and .max must be finite numbers`);
 }
 if (value.min > value.max) {
  throw new Error(
   `[math2d] ${label}.min (${value.min}) must not exceed ${label}.max (${value.max})`,
  );
 }
}

/**
 * Asserts that an object has valid Transform2-like shape.
 *
 * @remarks
 * Validates that object has `position` (Vector2-like), `rotation` (Rotation2-like), and `scale` (Vector2-like).
 * No-op when assertions are disabled.
 *
 * @param value - Object to validate
 * @param name - Object name for error messages (optional)
 * @throws {Error} If assertions enabled and object is not Transform2-like
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
export function assertTransform2Like(value: unknown, name?: string): void {
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
