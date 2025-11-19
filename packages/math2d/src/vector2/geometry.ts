/**
 * @file src/vector2/geometry.ts
 * @module math2d/core/vector2/geometry
 * @description Geometric operations for Vector2.
 * @internal
 */

import { Vector2Base } from './base';
import type { ReadonlyVector2 } from './factories';
import { clamp as clampNumber, EPSILON } from '../scalar';

declare module './base' {
 // eslint-disable-next-line @typescript-eslint/no-namespace
 namespace Vector2Base {
  /**
   * Dot product `a·b = a.x*b.x + a.y*b.y`.
   */
  function dot(a: ReadonlyVector2, b: ReadonlyVector2): number;

  /**
   * 2‑D scalar cross product (z‑component): `a.x*b.y − a.y*b.x`.
   */
  function cross(a: ReadonlyVector2, b: ReadonlyVector2): number;

  /**
   * Twice the signed area of triangle `(a, b, c)`.
   */
  function cross3(a: ReadonlyVector2, b: ReadonlyVector2, c: ReadonlyVector2): number;

  /**
   * Euclidean length `||v||` using Math.hypot for stability.
   */
  function length(v: ReadonlyVector2): number;

  /**
   * Squared length `||v||²` (avoids the square root for performance).
   */
  function lengthSq(v: ReadonlyVector2): number;

  /**
   * Euclidean distance between `a` and `b`.
   */
  function distance(a: ReadonlyVector2, b: ReadonlyVector2): number;

  /**
   * Squared Euclidean distance between `a` and `b`.
   */
  function distanceSq(a: ReadonlyVector2, b: ReadonlyVector2): number;

  /**
   * Unit direction from `from` to `to`. Returns `(0,0)` if both points coincide.
   */
  function direction(from: ReadonlyVector2, to: ReadonlyVector2): Vector2Base;
  function direction(from: ReadonlyVector2, to: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  /**
   * Heading (angle) of `v` from the +X axis in radians ∈ `[−π, π]` (CCW positive).
   */
  function angle(v: ReadonlyVector2): number;

  /**
   * Signed angle from `a` to `b` in radians (positive if `b` is CCW from `a`).
   */
  function angleTo(a: ReadonlyVector2, b: ReadonlyVector2): number;

  /**
   * Smallest unsigned angle between `a` and `b` in radians ∈ `[0, π]`.
   */
  function angleBetween(a: ReadonlyVector2, b: ReadonlyVector2): number;

  /**
   * Projects `a` onto `b`, returning the component of `a` along `b`.
   */
  function project(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;
  function project(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;

  /**
   * Safe projection that returns zero vector if `b` is degenerate.
   * @param tolerance - Optional tolerance for zero length check (defaults to EPSILON)
   */
  function projectSafe(a: ReadonlyVector2, b: ReadonlyVector2): Vector2Base;
  function projectSafe(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  function projectSafe(a: ReadonlyVector2, b: ReadonlyVector2, outVector: Vector2Base, tolerance?: number): Vector2Base;
 }
}

// Implementations
Vector2Base.dot = function (a: ReadonlyVector2, b: ReadonlyVector2): number {
 return a.x * b.x + a.y * b.y;
};

Vector2Base.cross = function (a: ReadonlyVector2, b: ReadonlyVector2): number {
 return a.x * b.y - a.y * b.x;
};

Vector2Base.cross3 = function (a: ReadonlyVector2, b: ReadonlyVector2, c: ReadonlyVector2): number {
 return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
};

Vector2Base.length = function (v: ReadonlyVector2): number {
 return Math.hypot(v.x, v.y);
};

Vector2Base.lengthSq = function (v: ReadonlyVector2): number {
 return v.x * v.x + v.y * v.y;
};

Vector2Base.distance = function (a: ReadonlyVector2, b: ReadonlyVector2): number {
 return Math.hypot(a.x - b.x, a.y - b.y);
};

Vector2Base.distanceSq = function (a: ReadonlyVector2, b: ReadonlyVector2): number {
 const dx = a.x - b.x;
 const dy = a.y - b.y;
 return dx * dx + dy * dy;
};

Vector2Base.direction = function (
 from: ReadonlyVector2,
 to: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const dx = to.x - from.x;
 const dy = to.y - from.y;
 const length = Math.hypot(dx, dy);
 return length === 0 ? out.set(0, 0) : out.set(dx / length, dy / length);
};

Vector2Base.angle = function (v: ReadonlyVector2): number {
 return Math.atan2(v.y, v.x);
};

Vector2Base.angleTo = function (a: ReadonlyVector2, b: ReadonlyVector2): number {
 return Math.atan2(Vector2Base.cross(a, b), Vector2Base.dot(a, b));
};

Vector2Base.angleBetween = function (a: ReadonlyVector2, b: ReadonlyVector2): number {
 const product = Vector2Base.length(a) * Vector2Base.length(b);
 if (product === 0) return 0;
 const cosA = clampNumber(Vector2Base.dot(a, b) / product, -1, 1);
 return Math.acos(cosA);
};

Vector2Base.project = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const lengthSqB = Vector2Base.lengthSq(b);

 if (lengthSqB === 0) {
  throw new RangeError('Vector2.project: cannot project onto zero vector');
 }

 const scale = Vector2Base.dot(a, b) / lengthSqB;
 return out.set(b.x * scale, b.y * scale);
};

Vector2Base.projectSafe = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 outVectorOrTolerance?: Vector2Base | number,
 tolerance?: number,
): Vector2Base {
 let out: Vector2Base;
 let tol: number;
 
 if (typeof outVectorOrTolerance === 'number') {
  // Overload: projectSafe(a, b, tolerance)
  out = new Vector2Base();
  tol = outVectorOrTolerance;
 } else {
  // Overload: projectSafe(a, b, outVector?, tolerance?)
  out = outVectorOrTolerance ?? new Vector2Base();
  tol = tolerance ?? EPSILON;
 }
 
 const lengthSqB = Vector2Base.lengthSq(b);

 if (lengthSqB <= tol * tol) {
  return out.set(0, 0);
 }

 const scale = Vector2Base.dot(a, b) / lengthSqB;
 return out.set(b.x * scale, b.y * scale);
};
