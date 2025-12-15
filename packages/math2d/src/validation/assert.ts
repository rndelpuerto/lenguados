/**
 * @file src/validation/assert.ts
 * @module @lenguados/math2d/validation
 * @description Debug assertions for development-time validation.
 *
 * @remarks
 * **Pattern**: Inspired by Box2D/Bullet Physics assertions with compile-time DCE.
 *
 * This module provides debug-only validation that is **completely eliminated**
 * in production builds via Dead Code Elimination (DCE). The `__LENGUADOS_DEV__`
 * compile-time constant is injected by esbuild via `rollup.config.mjs`.
 *
 * **Zero-Overhead Production**:
 * - Development: `__LENGUADOS_DEV__ = true` → assertions active
 * - Production: `__LENGUADOS_DEV__ = false` → all assertion code eliminated
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
 * @see {@link safeDivide} - Always-active safe division
 * @see {@link safeSqrt} - Always-active safe square root
 */

/* ========================================================================== */
/* Compile-Time Configuration                                                  */
/* ========================================================================== */

/**
 * Compile-time constant injected by esbuild via rollup.config.mjs.
 * - Production build: `false` → triggers DCE (Dead Code Elimination)
 * - Development build: `true` → assertions are active
 *
 * @remarks
 * This must be `declare` (not `const`) for esbuild's `define` to work.
 * When not bundled (Jest/Node), falls back to `DEV_MODE` constant.
 *
 * @internal
 */
declare const __LENGUADOS_DEV__: boolean | undefined;

/**
 * Runtime fallback for when __LENGUADOS_DEV__ is not injected (Jest/Node).
 * @internal
 */
const DEV_MODE: boolean = typeof __LENGUADOS_DEV__ !== 'undefined' ? __LENGUADOS_DEV__ : true;

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
 * @param enabled - `true` to enable assertions, `false` to disable.
 *
 * @remarks
 * **Development only**: This function only has effect when `__LENGUADOS_DEV__`
 * is `true` (development build). In production builds, assertions are
 * eliminated at compile-time via DCE (Dead Code Elimination).
 *
 * The `safe*` functions in `auxiliary/numeric/safety.ts` remain active
 * regardless of this setting.
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
 * @returns `true` if assertions are enabled, `false` otherwise.
 *
 * @remarks
 * In development: Returns the runtime state set by {@link setAssertionsEnabled}.
 * In production: Always returns `false` (assertions are compile-time eliminated).
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
 * @param value - Numeric value to validate.
 * @param name - Parameter name for error messages (optional).
 * @throws {Error} If assertions enabled and value is not finite.
 *
 * @remarks
 * No-op when assertions are disabled. Zero runtime cost in production.
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
 * @category Scalar Assertion
 * @since 0.7.0
 */
export function assertFinite(value: number, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (!Number.isFinite(value)) {
  throw new Error(`[math2d] ${name ?? 'value'} must be finite, got ${value}`);
 }
}

/**
 * Asserts that a value is not zero.
 *
 * @param value - Numeric value to validate.
 * @param name - Parameter name for error messages (optional).
 * @throws {Error} If assertions enabled and value is exactly zero.
 *
 * @remarks
 * Uses strict equality (`=== 0`). For near-zero checks, use `isNearZero`.
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function divideScalar(v: Vector2, s: number): Vector2 {
 *   assertNonZero(s, 'scalar');
 *   return v.divideScalar(s);
 * }
 * ```
 *
 * @category Scalar Assertion
 * @since 0.7.0
 */
export function assertNonZero(value: number, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value === 0) {
  throw new Error(`[math2d] ${name ?? 'value'} must not be zero`);
 }
}

/**
 * Asserts that a value is within a range (inclusive).
 *
 * @param value - Numeric value to validate.
 * @param min - Minimum inclusive bound.
 * @param max - Maximum inclusive bound.
 * @param name - Parameter name for error messages (optional).
 * @throws {Error} If assertions enabled and value ∉ [min, max].
 *
 * @remarks
 * Uses inclusive bounds: `min ≤ value ≤ max`.
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function lerp(a: number, b: number, t: number): number {
 *   assertRange(t, 0, 1, 't');
 *   return a + (b - a) * t;
 * }
 * ```
 *
 * @category Scalar Assertion
 * @since 0.7.0
 */
export function assertRange(value: number, min: number, max: number, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value < min || value > max) {
  throw new Error(`[math2d] ${name ?? 'value'} must be in [${min}, ${max}], got ${value}`);
 }
}

/**
 * Asserts that a value is strictly positive (> 0).
 *
 * @param value - Numeric value to validate.
 * @param name - Parameter name for error messages (optional).
 * @throws {Error} If assertions enabled and value ≤ 0.
 *
 * @remarks
 * Zero is not considered positive. Use `assertNonNegative` for ≥ 0.
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function setRadius(r: number): void {
 *   assertPositive(r, 'radius');
 *   this.radius = r;
 * }
 * ```
 *
 * @category Scalar Assertion
 * @since 0.7.0
 */
export function assertPositive(value: number, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value <= 0) {
  throw new Error(`[math2d] ${name ?? 'value'} must be positive (> 0), got ${value}`);
 }
}

/**
 * Asserts that a value is non-negative (≥ 0).
 *
 * @param value - Numeric value to validate.
 * @param name - Parameter name for error messages (optional).
 * @throws {Error} If assertions enabled and value < 0.
 *
 * @remarks
 * Zero is considered valid. Use `assertPositive` for strictly > 0.
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function setMass(m: number): void {
 *   assertNonNegative(m, 'mass');
 *   this.mass = m;
 * }
 * ```
 *
 * @category Scalar Assertion
 * @since 0.7.0
 */
export function assertNonNegative(value: number, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 if (value < 0) {
  throw new Error(`[math2d] ${name ?? 'value'} must be non-negative (>= 0), got ${value}`);
 }
}

/**
 * Asserts that a value is a safe JavaScript integer.
 *
 * @param value - Numeric value to validate.
 * @param name - Parameter name for error messages (optional).
 * @throws {Error} If value is not a safe integer.
 *
 * @remarks
 * Safe integers are integers that can be exactly represented as
 * IEEE-754 double precision numbers. Range: -(2⁵³ - 1) to 2⁵³ - 1.
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function setIndex(i: number): void {
 *   assertSafeInteger(i, 'index');
 *   this.index = i;
 * }
 * ```
 *
 * @category Scalar Assertion
 * @since 0.7.0
 */
export function assertSafeInteger(value: number, name?: string): void {
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
 * @param condition - Boolean condition to validate.
 * @param message - Error message if condition is false (optional).
 * @throws {Error} If assertions enabled and condition is `false`.
 *
 * @remarks
 * Base assertion for any custom validation logic.
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * assert(array.length > 0, 'Array must not be empty');
 * assert(index >= 0 && index < array.length, `Index ${index} out of bounds`);
 * ```
 *
 * @category Generic Assertion
 * @since 0.7.0
 */
export function assert(condition: boolean, message?: string): void {
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
 * @param x - X component to validate.
 * @param y - Y component to validate.
 * @param name - Vector name for error messages (optional).
 * @throws {Error} If assertions enabled and any component is not finite.
 *
 * @remarks
 * Validates both components are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function createVector(x: number, y: number): Vector2 {
 *   assertVector2(x, y, 'input');
 *   return new Vector2(x, y);
 * }
 * ```
 *
 * @category Type Assertion
 * @since 0.7.0
 */
export function assertVector2(x: number, y: number, name?: string): void {
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
 * @param m00 - Element at row 0, column 0.
 * @param m01 - Element at row 0, column 1.
 * @param m10 - Element at row 1, column 0.
 * @param m11 - Element at row 1, column 1.
 * @param name - Matrix name for error messages (optional).
 * @throws {Error} If assertions enabled and any element is not finite.
 *
 * @remarks
 * Validates all 4 elements are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function createMatrix(m00: number, m01: number, m10: number, m11: number): Matrix2 {
 *   assertMatrix2(m00, m01, m10, m11, 'input');
 *   return new Matrix2(m00, m01, m10, m11);
 * }
 * ```
 *
 * @category Type Assertion
 * @since 0.7.0
 */
export function assertMatrix2(
 m00: number,
 m01: number,
 m10: number,
 m11: number,
 name?: string,
): void {
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
 * @param m00 - Element at row 0, column 0.
 * @param m01 - Element at row 0, column 1.
 * @param m02 - Element at row 0, column 2.
 * @param m10 - Element at row 1, column 0.
 * @param m11 - Element at row 1, column 1.
 * @param m12 - Element at row 1, column 2.
 * @param m20 - Element at row 2, column 0.
 * @param m21 - Element at row 2, column 1.
 * @param m22 - Element at row 2, column 2.
 * @param name - Matrix name for error messages (optional).
 * @throws {Error} If assertions enabled and any element is not finite.
 *
 * @remarks
 * Validates all 9 elements are finite (not NaN, not Infinity).
 * No-op when assertions are disabled.
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
 * @category Type Assertion
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
 * @param cos - Cosine component to validate.
 * @param sin - Sine component to validate.
 * @param name - Rotation name for error messages (optional).
 * @throws {Error} If assertions enabled and any component is not finite.
 *
 * @remarks
 * Validates both cos and sin are finite (not NaN, not Infinity).
 * Does NOT validate that cos² + sin² = 1 (unit constraint).
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function createRotation(cos: number, sin: number): Rotation2 {
 *   assertRotation2(cos, sin, 'input');
 *   return new Rotation2(cos, sin);
 * }
 * ```
 *
 * @category Type Assertion
 * @since 0.7.0
 */
export function assertRotation2(cos: number, sin: number, name?: string): void {
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

/* ========================================================================== */
/* Object Shape Assertion                                                      */
/* ========================================================================== */

/**
 * Asserts that an object has valid Vector2-like shape with finite components.
 *
 * @param value - Object to validate.
 * @param name - Object name for error messages (optional).
 * @throws {Error} If assertions enabled and object is not Vector2-like or has invalid components.
 *
 * @remarks
 * Validates that object has `x` and `y` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @example
 * ```typescript
 * function processVector(v: unknown): Vector2 {
 *   assertVector2Like(v, 'input');
 *   return new Vector2(v.x, v.y);
 * }
 * ```
 *
 * @category Object Assertion
 * @since 0.7.0
 */
export function assertVector2Like(value: unknown, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (typeof value !== 'object' || value === null) {
  throw new Error(`[math2d] ${label} must be an object, got ${typeof value}`);
 }
 const object = value as Record<string, unknown>;
 if (typeof object.x !== 'number' || !Number.isFinite(object.x)) {
  throw new Error(`[math2d] ${label}.x must be a finite number`);
 }
 if (typeof object.y !== 'number' || !Number.isFinite(object.y)) {
  throw new Error(`[math2d] ${label}.y must be a finite number`);
 }
}

/**
 * Asserts that an object has valid Matrix2-like shape with finite elements.
 *
 * @param value - Object to validate.
 * @param name - Object name for error messages (optional).
 * @throws {Error} If assertions enabled and object is not Matrix2-like or has invalid elements.
 *
 * @remarks
 * Validates that object has `m00`, `m01`, `m10`, `m11` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @category Object Assertion
 * @since 0.7.0
 */
export function assertMatrix2Like(value: unknown, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (typeof value !== 'object' || value === null) {
  throw new Error(`[math2d] ${label} must be an object, got ${typeof value}`);
 }
 const object = value as Record<string, unknown>;
 const elements = ['m00', 'm01', 'm10', 'm11'] as const;
 for (const element of elements) {
  if (typeof object[element] !== 'number' || !Number.isFinite(object[element] as number)) {
   throw new Error(`[math2d] ${label}.${element} must be a finite number`);
  }
 }
}

/**
 * Asserts that an object has valid Complex-like shape with finite components.
 *
 * @param value - Object to validate.
 * @param name - Object name for error messages (optional).
 * @throws {Error} If assertions enabled and object is not Complex-like or has invalid components.
 *
 * @remarks
 * Validates that object has `real` and `imag` numeric properties that are finite.
 * No-op when assertions are disabled.
 *
 * @category Object Assertion
 * @since 0.7.0
 */
export function assertComplexLike(value: unknown, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (typeof value !== 'object' || value === null) {
  throw new Error(`[math2d] ${label} must be an object, got ${typeof value}`);
 }
 const object = value as Record<string, unknown>;
 if (typeof object.real !== 'number' || !Number.isFinite(object.real)) {
  throw new Error(`[math2d] ${label}.real must be a finite number`);
 }
 if (typeof object.imag !== 'number' || !Number.isFinite(object.imag)) {
  throw new Error(`[math2d] ${label}.imag must be a finite number`);
 }
}

/**
 * Asserts that an object has valid Interval-like shape with finite bounds.
 *
 * @param value - Object to validate.
 * @param name - Object name for error messages (optional).
 * @throws {Error} If assertions enabled and object is not Interval-like or has invalid bounds.
 *
 * @remarks
 * Validates that object has `min` and `max` numeric properties that are finite.
 * Also validates that min ≤ max.
 * No-op when assertions are disabled.
 *
 * @category Object Assertion
 * @since 0.7.0
 */
export function assertIntervalLike(value: unknown, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (typeof value !== 'object' || value === null) {
  throw new Error(`[math2d] ${label} must be an object, got ${typeof value}`);
 }
 const object = value as Record<string, unknown>;
 if (typeof object.min !== 'number' || !Number.isFinite(object.min)) {
  throw new Error(`[math2d] ${label}.min must be a finite number`);
 }
 if (typeof object.max !== 'number' || !Number.isFinite(object.max)) {
  throw new Error(`[math2d] ${label}.max must be a finite number`);
 }
 if ((object.min as number) > (object.max as number)) {
  throw new Error(
   `[math2d] ${label}.min (${object.min}) must not exceed ${label}.max (${object.max})`,
  );
 }
}

/**
 * Asserts that an object has valid Transform2-like shape.
 *
 * @param value - Object to validate.
 * @param name - Object name for error messages (optional).
 * @throws {Error} If assertions enabled and object is not Transform2-like.
 *
 * @remarks
 * Validates that object has `position` (Vector2-like), `rotation` (number), and `scale` (Vector2-like).
 * No-op when assertions are disabled.
 *
 * @category Object Assertion
 * @since 0.7.0
 */
export function assertTransform2Like(value: unknown, name?: string): void {
 if (!DEV_MODE) return;
 if (!assertionsEnabled) return;
 const label = name ?? 'value';
 if (typeof value !== 'object' || value === null) {
  throw new Error(`[math2d] ${label} must be an object, got ${typeof value}`);
 }
 const object = value as Record<string, unknown>;

 // Validate position
 assertVector2Like(object.position, `${label}.position`);

 // Validate rotation
 if (typeof object.rotation !== 'number' || !Number.isFinite(object.rotation)) {
  throw new Error(`[math2d] ${label}.rotation must be a finite number`);
 }

 // Validate scale
 assertVector2Like(object.scale, `${label}.scale`);
}
