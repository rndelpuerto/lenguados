/**
 * @file src/core/vector2/arithmetic.ts
 * @module math2d/core/vector2/arithmetic
 * @description Component-wise arithmetic operations for Vector2.
 * @internal
 */

import { Vector2Base } from './base';
import type { ReadonlyVector2 } from './factories';
import { safeDivide } from '../numeric';

declare module './base' {
 // eslint-disable-next-line @typescript-eslint/no-namespace
 namespace Vector2Base {
  /**
   * Computes the sum of components `x + y`.
   * @param vector - Vector to read.
   * @returns The scalar sum `vector.x + vector.y`.
   */
  function sumComponents(vector: ReadonlyVector2): number;

  /**
   * Component-wise addition: `a + b`.
   * @param a - First operand.
   * @param b - Second operand.
   * @returns A new Vector2 with components `(a.x + b.x, a.y + b.y)`.
   */
  function add(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;

  /**
   * Component-wise addition into `outVector` (alloc‑free).
   * @param a - First operand.
   * @param b - Second operand.
   * @param outVector - Target vector for the result.
   * @returns The `outVector` with components `(a.x + b.x, a.y + b.y)`.
   */
  function add(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  /**
   * Adds scalar `s` to each component of `v`.
   * @param v - Vector operand.
   * @param s - Scalar to add.
   * @returns A new Vector2 with components `(v.x + s, v.y + s)`.
   */
  function addScalar(v: ReadonlyVector2, s: number): Vector2Base;

  /**
   * Adds scalar into `outVector` (alloc‑free).
   * @param v - Vector operand.
   * @param s - Scalar to add.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   */
  function addScalar(v: ReadonlyVector2, s: number, outVector: Vector2Base): Vector2Base;

  /**
   * Component-wise subtraction: `a - b`.
   * @param a - Minuend vector.
   * @param b - Subtrahend vector.
   * @returns A new Vector2 with components `(a.x - b.x, a.y - b.y)`.
   */
  function sub(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;

  /**
   * Component-wise subtraction into `outVector` (alloc‑free).
   * @param a - Minuend vector.
   * @param b - Subtrahend vector.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   */
  function sub(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  /**
   * Subtracts scalar `s` from each component of `v`.
   * @param v - Vector operand.
   * @param s - Scalar to subtract.
   * @returns A new Vector2 with components `(v.x - s, v.y - s)`.
   */
  function subScalar(v: ReadonlyVector2, s: number): Vector2Base;

  /**
   * Subtracts scalar into `outVector` (alloc‑free).
   * @param v - Vector operand.
   * @param s - Scalar to subtract.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   */
  function subScalar(v: ReadonlyVector2, s: number, outVector: Vector2Base): Vector2Base;

  /**
   * Component-wise multiplication (Hadamard product).
   * @param a - First operand.
   * @param b - Second operand.
   * @returns A new Vector2 with components `(a.x * b.x, a.y * b.y)`.
   */
  function multiply(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;

  /**
   * Component-wise multiplication into `outVector` (alloc‑free).
   * @param a - First operand.
   * @param b - Second operand.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   */
  function multiply(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  /**
   * Multiplies each component of `v` by scalar `s`.
   * @param v - Vector operand.
   * @param s - Scalar multiplier.
   * @returns A new Vector2 with components `(v.x * s, v.y * s)`.
   */
  function multiplyScalar(v: ReadonlyVector2, s: number): Vector2Base;

  /**
   * Scalar multiplication into `outVector` (alloc‑free).
   * @param v - Vector operand.
   * @param s - Scalar multiplier.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   */
  function multiplyScalar(v: ReadonlyVector2, s: number, outVector: Vector2Base): Vector2Base;

  /**
   * Component-wise division: `a / b`.
   * @param a - Dividend vector.
   * @param b - Divisor vector.
   * @returns A new Vector2 with components `(a.x / b.x, a.y / b.y)`.
   * @throws {Error} If any component of `b` is zero.
   */
  function divide(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;

  /**
   * Component-wise division into `outVector` (alloc‑free).
   * @param a - Dividend vector.
   * @param b - Divisor vector.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   * @throws {Error} If any component of `b` is zero.
   */
  function divide(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  /**
   * Divides each component of `v` by scalar `s`.
   * @param v - Vector dividend.
   * @param s - Scalar divisor.
   * @returns A new Vector2 with components `(v.x / s, v.y / s)`.
   * @throws {Error} If `s` is zero.
   */
  function divideScalar(v: ReadonlyVector2, s: number): Vector2Base;

  /**
   * Scalar division into `outVector` (alloc‑free).
   * @param v - Vector dividend.
   * @param s - Scalar divisor.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   * @throws {Error} If `s` is zero.
   */
  function divideScalar(v: ReadonlyVector2, s: number, outVector: Vector2Base): Vector2Base;

  /**
   * Component-wise safe division that returns zero for zero divisors.
   * @param a - Dividend vector.
   * @param b - Divisor vector.
   * @returns A new Vector2 where each component is `a[i]/b[i]` if `b[i] ≠ 0`, else `0`.
   */
  function divideSafe(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;

  /**
   * Safe division into `outVector` (alloc‑free).
   * @param a - Dividend vector.
   * @param b - Divisor vector.
   * @param outVector - Target vector for the result.
   * @returns The `outVector`.
   */
  function divideSafe(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
 }
}

// Implementations
Vector2Base.sumComponents = function (vector: ReadonlyVector2): number {
 return vector.x + vector.y;
};

Vector2Base.add = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = a.x + b.x;
 out.y = a.y + b.y;
 return out;
};

Vector2Base.addScalar = function (
 v: ReadonlyVector2,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = v.x + s;
 out.y = v.y + s;
 return out;
};

Vector2Base.sub = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = a.x - b.x;
 out.y = a.y - b.y;
 return out;
};

Vector2Base.subScalar = function (
 v: ReadonlyVector2,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = v.x - s;
 out.y = v.y - s;
 return out;
};

Vector2Base.multiply = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = a.x * b.x;
 out.y = a.y * b.y;
 return out;
};

Vector2Base.multiplyScalar = function (
 v: ReadonlyVector2,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = v.x * s;
 out.y = v.y * s;
 return out;
};

Vector2Base.divide = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 
 if (b.x === 0 || b.y === 0) {
  throw new Error(
   `Vector2.divide: division by zero (b.x=${b.x}, b.y=${b.y})`,
  );
 }

 out.x = a.x / b.x;
 out.y = a.y / b.y;
 return out;
};

Vector2Base.divideScalar = function (
 v: ReadonlyVector2,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();

 if (s === 0) {
  throw new Error('Vector2.divideScalar: division by zero');
 }

 out.x = v.x / s;
 out.y = v.y / s;
 return out;
};

Vector2Base.divideSafe = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = safeDivide(a.x, b.x);
 out.y = safeDivide(a.y, b.y);
 return out;
};
