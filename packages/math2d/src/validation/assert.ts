/**
 * @file src/validation/assert.ts
 * @module @lenguados/math2d/validation
 * @description Debug assertions for development.
 *
 * @remarks
 * **Pattern**: Inspired by Box2D/Bullet Physics assertions.
 *
 * This module provides debug-only validation that can be completely
 * disabled in production for zero overhead. The pattern follows
 * industry standards from physics engines like Box2D, Bullet, and Planck.js.
 *
 * **Two-Layer Protection System**:
 * 1. **Assertions** (this module): Catch errors early in development
 * 2. **Safe functions** (`auxiliary/numeric/safety.ts`): Always active fallbacks
 *
 * @example
 * ```typescript
 * import { setAssertionsEnabled, assertFinite } from '@lenguados/math2d';
 *
 * // Development (default): assertions enabled
 * assertFinite(value, 'myParam');  // Throws if NaN/Infinity
 *
 * // Production: disable for zero overhead
 * setAssertionsEnabled(false);
 * assertFinite(value, 'myParam');  // No-op, zero cost
 * ```
 */

/**
 * Default assertions state.
 * Enabled by default unless NODE_ENV is 'production'.
 * @internal
 */
const DEFAULT_ENABLED = !(
 typeof globalThis !== 'undefined' &&
 'process' in globalThis &&
 globalThis.process?.env?.NODE_ENV === 'production'
);

/**
 * Global assertions state.
 * @internal
 */
let assertionsEnabled = DEFAULT_ENABLED;

/**
 * Enables or disables assertions globally.
 *
 * @param enabled - `true` to enable, `false` to disable
 *
 * @remarks
 * When disabled, all assertion functions become no-ops with zero overhead.
 * The `safe*` functions in `auxiliary/numeric/safety.ts` remain active
 * regardless of this setting.
 *
 * @example
 * ```typescript
 * // Disable in production build
 * setAssertionsEnabled(false);
 *
 * // Enable for debugging
 * setAssertionsEnabled(true);
 * ```
 */
export function setAssertionsEnabled(enabled: boolean): void {
 assertionsEnabled = enabled;
}

/**
 * Returns the current assertions state.
 * @returns `true` if assertions are enabled
 */
export function areAssertionsEnabled(): boolean {
 return assertionsEnabled;
}

/**
 * Asserts that a value is finite (not NaN, not Infinity).
 *
 * @param value - Value to check
 * @param name - Parameter name for error messages
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
 */
export function assertFinite(value: number, name?: string): void {
 if (!assertionsEnabled) return;
 if (!Number.isFinite(value)) {
  throw new Error(`[math2d] ${name ?? 'value'} must be finite, got ${value}`);
 }
}

/**
 * Asserts that a value is not zero.
 *
 * @param value - Value to check
 * @param name - Parameter name for error messages
 * @throws {Error} If assertions enabled and value is zero
 *
 * @example
 * ```typescript
 * function divideScalar(v: Vector2, s: number): Vector2 {
 *   assertNonZero(s, 'scalar');
 *   return v.divideScalar(s);
 * }
 * ```
 */
export function assertNonZero(value: number, name?: string): void {
 if (!assertionsEnabled) return;
 if (value === 0) {
  throw new Error(`[math2d] ${name ?? 'value'} must not be zero`);
 }
}

/**
 * Asserts that a value is within a range (inclusive).
 *
 * @param value - Value to check
 * @param min - Minimum inclusive value
 * @param max - Maximum inclusive value
 * @param name - Parameter name for error messages
 * @throws {Error} If assertions enabled and value is out of range
 *
 * @example
 * ```typescript
 * function lerp(a: number, b: number, t: number): number {
 *   assertRange(t, 0, 1, 't');
 *   return a + (b - a) * t;
 * }
 * ```
 */
export function assertRange(value: number, min: number, max: number, name?: string): void {
 if (!assertionsEnabled) return;
 if (value < min || value > max) {
  throw new Error(`[math2d] ${name ?? 'value'} must be in [${min}, ${max}], got ${value}`);
 }
}

/**
 * Asserts that a value is positive (> 0).
 *
 * @param value - Value to check
 * @param name - Parameter name for error messages
 * @throws {Error} If assertions enabled and value <= 0
 *
 * @example
 * ```typescript
 * function setRadius(r: number): void {
 *   assertPositive(r, 'radius');
 *   this.radius = r;
 * }
 * ```
 */
export function assertPositive(value: number, name?: string): void {
 if (!assertionsEnabled) return;
 if (value <= 0) {
  throw new Error(`[math2d] ${name ?? 'value'} must be positive (> 0), got ${value}`);
 }
}

/**
 * Asserts that a value is non-negative (>= 0).
 *
 * @param value - Value to check
 * @param name - Parameter name for error messages
 * @throws {Error} If assertions enabled and value < 0
 *
 * @example
 * ```typescript
 * function setMass(m: number): void {
 *   assertNonNegative(m, 'mass');
 *   this.mass = m;
 * }
 * ```
 */
export function assertNonNegative(value: number, name?: string): void {
 if (!assertionsEnabled) return;
 if (value < 0) {
  throw new Error(`[math2d] ${name ?? 'value'} must be non-negative (>= 0), got ${value}`);
 }
}

/**
 * Asserts a generic condition.
 *
 * @param condition - Condition to check
 * @param message - Error message if condition fails
 * @throws {Error} If assertions enabled and condition is false
 *
 * @example
 * ```typescript
 * assert(array.length > 0, 'Array must not be empty');
 * assert(index >= 0 && index < array.length, `Index ${index} out of bounds`);
 * ```
 */
export function assert(condition: boolean, message?: string): void {
 if (!assertionsEnabled) return;
 if (!condition) {
  throw new Error(`[math2d] ${message ?? 'Assertion failed'}`);
 }
}

/**
 * Asserts that Vector2-like components are finite.
 *
 * @param x - X component
 * @param y - Y component
 * @param name - Vector name for error messages
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function createVector(x: number, y: number): Vector2 {
 *   assertVector2(x, y, 'input');
 *   return new Vector2(x, y);
 * }
 * ```
 */
export function assertVector2(x: number, y: number, name?: string): void {
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
 * Asserts that Matrix2-like components are finite.
 *
 * @param m00 - Element [0,0]
 * @param m01 - Element [0,1]
 * @param m10 - Element [1,0]
 * @param m11 - Element [1,1]
 * @param name - Matrix name for error messages
 * @throws {Error} If assertions enabled and any element is not finite
 *
 * @example
 * ```typescript
 * function createMatrix(m00: number, m01: number, m10: number, m11: number): Matrix2 {
 *   assertMatrix2(m00, m01, m10, m11, 'input');
 *   return new Matrix2(m00, m01, m10, m11);
 * }
 * ```
 */
export function assertMatrix2(
 m00: number,
 m01: number,
 m10: number,
 m11: number,
 name?: string,
): void {
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
 * @param m00 - Element at row 0, column 0
 * @param m01 - Element at row 0, column 1
 * @param m02 - Element at row 0, column 2
 * @param m10 - Element at row 1, column 0
 * @param m11 - Element at row 1, column 1
 * @param m12 - Element at row 1, column 2
 * @param m20 - Element at row 2, column 0
 * @param m21 - Element at row 2, column 1
 * @param m22 - Element at row 2, column 2
 * @param name - Matrix name for error messages
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
 * @param cos - Cosine component
 * @param sin - Sine component
 * @param name - Rotation name for error messages
 * @throws {Error} If assertions enabled and any component is not finite
 *
 * @example
 * ```typescript
 * function createRotation(cos: number, sin: number): Rotation2 {
 *   assertRotation2(cos, sin, 'input');
 *   return new Rotation2(cos, sin);
 * }
 * ```
 */
export function assertRotation2(cos: number, sin: number, name?: string): void {
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
 * Asserts that an integer is within safe JavaScript integer range.
 *
 * @param value - Value to check
 * @param name - Parameter name for error messages
 * @throws {Error} If value is not a safe integer
 *
 * @remarks
 * Safe integers are integers that can be exactly represented as
 * IEEE-754 double precision numbers. Range: -(2^53 - 1) to 2^53 - 1.
 *
 * @example
 * ```typescript
 * function setIndex(i: number): void {
 *   assertSafeInteger(i, 'index');
 *   this.index = i;
 * }
 * ```
 */
export function assertSafeInteger(value: number, name?: string): void {
 if (!assertionsEnabled) return;
 if (!Number.isSafeInteger(value)) {
  throw new Error(`[math2d] ${name ?? 'value'} must be a safe integer, got ${value}`);
 }
}
