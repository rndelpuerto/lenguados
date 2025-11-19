
import { safeDiv as safeDivide } from '../numeric';
import { TOLERANCE } from '../constants/tolerance-types';

import { Vector2Base } from './base';
import type { ReadonlyVector2 } from './factories';
import type { Vector2Like } from './helpers';

// Module augmentation to add missing static methods
declare module './base' {
 // eslint-disable-next-line @typescript-eslint/no-namespace
 namespace Vector2Base {
  // Missing numeric transforms
  function floor(v: ReadonlyVector2): Vector2Base;
  function floor(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function ceil(v: ReadonlyVector2): Vector2Base;
  function ceil(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function round(v: ReadonlyVector2): Vector2Base;
  function round(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function abs(v: ReadonlyVector2): Vector2Base;
  function abs(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function inverse(v: ReadonlyVector2): Vector2Base;
  function inverse(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function inverseSafe(v: ReadonlyVector2): Vector2Base;
  function inverseSafe(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function swap(v: ReadonlyVector2): Vector2Base;
  function swap(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

   // Missing arithmetic operations
   function mod(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;
   function mod(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

   function modScalar(v: ReadonlyVector2, s: number): Vector2Base;
   function modScalar(v: ReadonlyVector2, s: number, outVector: Vector2Base): Vector2Base;

  function addScaledVector(
   base: ReadonlyVector2,
   scaled: ReadonlyVector2,
   scale: number,
  ): Vector2Base;
  function addScaledVector(
   base: ReadonlyVector2,
   scaled: ReadonlyVector2,
   scale: number,
   outVector: Vector2Base,
  ): Vector2Base;

  // Missing geometry methods
  function manhattanLength(v: ReadonlyVector2): number;
  function manhattanDistance(a: ReadonlyVector2, b: ReadonlyVector2): number;

  // Missing constraint methods
  function limit(v: ReadonlyVector2, maxLength: number): Vector2Base;
  function limit(v: ReadonlyVector2, maxLength: number, outVector: Vector2Base): Vector2Base;

  function min(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;
  function min(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function max(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;
  function max(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  // Missing transform methods
  function setHeading(v: ReadonlyVector2, angle: number): Vector2Base;
  function setHeading(v: ReadonlyVector2, angle: number, outVector: Vector2Base): Vector2Base;

  function perpendicular(v: ReadonlyVector2, clockwise?: boolean): Vector2Base;
  function perpendicular(
   v: ReadonlyVector2,
   clockwise: boolean,
   outVector: Vector2Base,
  ): Vector2Base;

  function unitPerpendicular(v: ReadonlyVector2, clockwise?: boolean): Vector2Base;
  function unitPerpendicular(
   v: ReadonlyVector2,
   clockwise: boolean,
   outVector: Vector2Base,
  ): Vector2Base;

  function unitPerpendicularSafe(v: ReadonlyVector2, clockwise?: boolean): Vector2Base;
  function unitPerpendicularSafe(
   v: ReadonlyVector2,
   clockwise: boolean,
   outVector: Vector2Base,
  ): Vector2Base;

  function rotateCS(v: ReadonlyVector2, c: number, s: number): Vector2Base;
  function rotateCS(v: ReadonlyVector2, c: number, s: number, outVector: Vector2Base): Vector2Base;

  function rotateAround(v: ReadonlyVector2, center: ReadonlyVector2, angle: number): Vector2Base;
  function rotateAround(
   v: ReadonlyVector2,
   center: ReadonlyVector2,
   angle: number,
   outVector: Vector2Base,
  ): Vector2Base;

  function rotateAroundCS(
   v: ReadonlyVector2,
   center: ReadonlyVector2,
   c: number,
   s: number,
  ): Vector2Base;
  function rotateAroundCS(
   v: ReadonlyVector2,
   center: ReadonlyVector2,
   c: number,
   s: number,
   outVector: Vector2Base,
  ): Vector2Base;

  function midpoint(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;
  function midpoint(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function reject(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;
  function reject(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  function projectOnUnit(v: ReadonlyVector2, unitAxis: ReadonlyVector2): Vector2Base;
  function projectOnUnit(
   v: ReadonlyVector2,
   unitAxis: ReadonlyVector2,
   outVector: Vector2Base,
  ): Vector2Base;

  // Box2D-style cross products
  function crossVS(a: ReadonlyVector2, s: number): Vector2Base;
  function crossVS(a: ReadonlyVector2, s: number, outVector: Vector2Base): Vector2Base;

  function crossSV(s: number, a: ReadonlyVector2): Vector2Base;
  function crossSV(s: number, a: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  // Missing comparison methods
  function isUnit(v: ReadonlyVector2): boolean;
  function isFinite(v: ReadonlyVector2): boolean;
  function isParallel(a: ReadonlyVector2, b: ReadonlyVector2, epsilon?: number): boolean;
  function isPerpendicular(a: ReadonlyVector2, b: ReadonlyVector2, epsilon?: number): boolean;

  // Missing utility methods
  function hashCode(v: ReadonlyVector2): number;

  // Missing factory methods
  function parse(string: string): Vector2Base;
  function parse(string: string, outVector: Vector2Base): Vector2Base;

  function random(): Vector2Base;
  function random(outVector: Vector2Base): Vector2Base;

  function randomOnCircle(radius?: number): Vector2Base;
  function randomOnCircle(radius: number, outVector: Vector2Base): Vector2Base;

  function randomInUnitCircle(): Vector2Base;
  function randomInUnitCircle(outVector: Vector2Base): Vector2Base;
 }
}

// Implementation of missing static methods

// Numeric transforms

Vector2Base.floor = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
  const out = outVector ?? new Vector2Base();
  return out.set(Math.floor(v.x), Math.floor(v.y));
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param v - Source vector.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.ceil = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(Math.ceil(v.x), Math.ceil(v.y));
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param v - Source vector.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.round = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(Math.round(v.x), Math.round(v.y));
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param v - Source vector.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.abs = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(Math.abs(v.x), Math.abs(v.y));
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param v - Source vector.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 * @throws {RangeError} If any component is zero.
 */
Vector2Base.inverse = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 if (v.x === 0 || v.y === 0) {
  throw new RangeError('Vector2.inverse: cannot invert vector with zero component');
 }
 const out = outVector ?? new Vector2Base();
 return out.set(1 / v.x, 1 / v.y);
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param v - Source vector.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.inverseSafe = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(Math.abs(v.x) <= TOLERANCE.LINEAR ? 0 : 1 / v.x, Math.abs(v.y) <= TOLERANCE.LINEAR ? 0 : 1 / v.y);
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param v - Source vector.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.swap = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(v.y, v.x);
};

// Arithmetic operations

Vector2Base.mod = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 if (b.x === 0 || b.y === 0) {
  throw new RangeError('Vector2.mod: divisor components must be non-zero');
 }
 const out = outVector ?? new Vector2Base();
 return out.set(a.x % b.x, a.y % b.y);
};

Vector2Base.modScalar = function (
 v: ReadonlyVector2,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 if (s === 0) {
  throw new RangeError('Vector2.modScalar: divisor must be non-zero');
 }
 const out = outVector ?? new Vector2Base();
 return out.set(v.x % s, v.y % s);
};

Vector2Base.addScaledVector = function (
 base: ReadonlyVector2,
 scaled: ReadonlyVector2,
 scale: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(base.x + scaled.x * scale, base.y + scaled.y * scale);
};

// Geometry methods

/**
 * Manhattan length `|x| + |y|`.
 * 
 * @param v - Vector to measure.
 * @returns The L¹ norm.
 */
Vector2Base.manhattanLength = function (v: ReadonlyVector2): number {
 return Math.abs(v.x) + Math.abs(v.y);
};

/**
 * Manhattan distance between `a` and `b`.
 * 
 * @param a - First point.
 * @param b - Second point.
 * @returns The Manhattan distance.
 */
Vector2Base.manhattanDistance = function (a: ReadonlyVector2, b: ReadonlyVector2): number {
 return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

// Constraint methods

Vector2Base.limit = function (
 v: ReadonlyVector2,
 maxLength: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const lsq = v.x * v.x + v.y * v.y;

 if (lsq > maxLength * maxLength && lsq > 0) {
  const s = maxLength / Math.sqrt(lsq);
  return out.set(v.x * s, v.y * s);
 }

 return out.set(v.x, v.y);
};

Vector2Base.min = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(Math.min(a.x, b.x), Math.min(a.y, b.y));
};

Vector2Base.max = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(Math.max(a.x, b.x), Math.max(a.y, b.y));
};

// Transform methods

Vector2Base.setHeading = function (
 v: ReadonlyVector2,
 angle: number,
 outVector?: Vector2Base,
): Vector2Base {
 const length = Math.hypot(v.x, v.y);
 const out = outVector ?? new Vector2Base();
 return out.set(Math.cos(angle) * length, Math.sin(angle) * length);
};

Vector2Base.perpendicular = function (
 v: ReadonlyVector2,
 clockwise: boolean = false,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return clockwise ? out.set(v.y, -v.x) : out.set(-v.y, v.x);
};

Vector2Base.unitPerpendicular = function (
 v: ReadonlyVector2,
 clockwise: boolean = false,
 outVector?: Vector2Base,
): Vector2Base {
 const p = Vector2Base.perpendicular(v, clockwise, outVector);
 return Vector2Base.normalize(p, p);
};

Vector2Base.unitPerpendicularSafe = function (
 v: ReadonlyVector2,
 clockwise: boolean = false,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 if (v.x === 0 && v.y === 0) {
  return out.set(clockwise ? 1 : -1, 0);
 }
 return Vector2Base.unitPerpendicular(v, clockwise, out);
};

Vector2Base.rotateCS = function (
 v: ReadonlyVector2,
 c: number,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(v.x * c - v.y * s, v.x * s + v.y * c);
};

Vector2Base.rotateAround = function (
 v: ReadonlyVector2,
 center: ReadonlyVector2,
 angle: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const translatedX = v.x - center.x;
 const translatedY = v.y - center.y;

 const c = Math.cos(angle);
 const s = Math.sin(angle);

 return out.set(
  translatedX * c - translatedY * s + center.x,
  translatedX * s + translatedY * c + center.y,
 );
};

Vector2Base.rotateAroundCS = function (
 v: ReadonlyVector2,
 center: ReadonlyVector2,
 c: number,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const tx = v.x - center.x;
 const ty = v.y - center.y;

 return out.set(tx * c - ty * s + center.x, tx * s + ty * c + center.y);
};

Vector2Base.midpoint = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
};

Vector2Base.reject = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const denom = b.x * b.x + b.y * b.y;

 if (denom === 0) return out.set(a.x, a.y);

 const s = (a.x * b.x + a.y * b.y) / denom;
 return out.set(a.x - b.x * s, a.y - b.y * s);
};

Vector2Base.projectOnUnit = function (
 v: ReadonlyVector2,
 unitAxis: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const s = v.x * unitAxis.x + v.y * unitAxis.y;
 return out.set(unitAxis.x * s, unitAxis.y * s);
};

// Box2D-style cross products

Vector2Base.crossVS = function (
 a: ReadonlyVector2,
 s: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(s * a.y, -s * a.x);
};

Vector2Base.crossSV = function (
 s: number,
 a: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(-s * a.y, s * a.x);
};

// Comparison methods

/**
 * Checks if vector is unit length (magnitude 1).
 * 
 * @param v - Vector to test.
 * @returns `true` if vector has unit magnitude within {@link TOLERANCE.UNIT}.
 */
Vector2Base.isUnit = function (v: ReadonlyVector2): boolean {
 return Math.abs(Math.hypot(v.x, v.y) - 1) <= TOLERANCE.UNIT;
};

/**
 * Checks if both components are finite numbers.
 * 
 * @param v - Vector to test.
 * @returns `true` if both x and y are finite.
 */
Vector2Base.isFinite = function (v: ReadonlyVector2): boolean {
 return Number.isFinite(v.x) && Number.isFinite(v.y);
};

/**
 * Tests whether vectors `a` and `b` are parallel within angular tolerance.
 * 
 * @param a - First vector.
 * @param b - Second vector.
 * @param epsilon - Angular tolerance. @defaultValue {@link TOLERANCE.ANGULAR}
 * @returns `true` if vectors are parallel within tolerance.
 */
Vector2Base.isParallel = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 epsilon: number = TOLERANCE.ANGULAR,
): boolean {
 return Math.abs(a.x * b.y - a.y * b.x) <= epsilon;
};

/**
 * Tests whether vectors `a` and `b` are perpendicular within angular tolerance.
 * 
 * @param a - First vector.
 * @param b - Second vector.
 * @param epsilon - Angular tolerance. @defaultValue {@link TOLERANCE.ANGULAR}
 * @returns `true` if vectors are perpendicular within tolerance.
 */
Vector2Base.isPerpendicular = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 epsilon: number = TOLERANCE.ANGULAR,
): boolean {
 return Math.abs(a.x * b.x + a.y * b.y) <= epsilon;
};

// Utility methods

/**
 * Computes a hash code for the vector.
 * 
 * @param v - Vector to hash.
 * @returns Integer hash code suitable for hash tables.
 */
Vector2Base.hashCode = function (v: ReadonlyVector2): number {
 const xInt = Math.round(v.x * 1e6) & 0xffff;
 const yInt = Math.round(v.y * 1e6) & 0xffff;
 return ((xInt << 16) | yInt) >>> 0;
};

// Factory methods

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param string - String representation to parse.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 * @throws {Error} If format is invalid.
 */
Vector2Base.parse = function (string: string, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const parts = string.split(',').map((s) => parseFloat(s.trim()));

 if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
  throw new Error(`Vector2.parse: cannot parse Vector2 from string "${string}"`);
 }

 return out.set(parts[0]!, parts[1]!);
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.random = function (outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const angle = Math.random() * Math.PI * 2;
 return out.set(Math.cos(angle), Math.sin(angle));
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param radius - Circle radius.
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.randomOnCircle = function (radius: number = 1, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const a = Math.random() * Math.PI * 2;
 return out.set(Math.cos(a) * radius, Math.sin(a) * radius);
};

/**
 * Alloc-free variant writing into `outVector`.
 * 
 * @param outVector - Destination vector to receive the result.
 * @returns `outVector`.
 */
Vector2Base.randomInUnitCircle = function (outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const r = Math.sqrt(Math.random()); // sqrt(u) → uniform area
 const a = Math.random() * Math.PI * 2;
 return out.set(Math.cos(a) * r, Math.sin(a) * r);
};
