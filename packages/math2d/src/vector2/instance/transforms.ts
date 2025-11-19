/**
 * @file src/vector2/instance/transforms.ts
 * @module math2d/core/vector2/instance/transforms
 * @description Instance transform methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import { TOLERANCE } from '../../constants/tolerance-types';

// Module augmentation to add instance transform methods
declare module '../base' {
  interface Vector2Base {
    // Numeric transforms
    floor(): this;
    ceil(): this;
    round(): this;
    abs(): this;
    inverse(): this;
    inverseSafe(): this;
    swap(): this;
    
    // Vector transforms
    normalize(): this;
    normalizeSafe(tolerance?: number): this;
    setLength(length: number): this;
    setLengthSafe(length: number, tolerance?: number): this;
    setHeading(angle: number): this;
    rotate(angle: number): this;
    rotateTo(angle: number): this;
    rotateCS(c: number, s: number): this;
    rotate90CW(): this;
    rotate90CCW(): this;
    rotateAround(center: ReadonlyVector2, angle: number): this;
    rotateAroundCS(center: ReadonlyVector2, c: number, s: number): this;
    perpendicular(clockwise?: boolean): this;
    unitPerpendicular(clockwise?: boolean): this;
    unitPerpendicularSafe(clockwise?: boolean): this;
    project(onto: ReadonlyVector2): this;
    projectSafe(onto: ReadonlyVector2): this;
    projectOnUnit(unitAxis: ReadonlyVector2): this;
    reflect(normal: ReadonlyVector2): this;
    reflectSafe(normal: ReadonlyVector2, tolerance?: number): this;
    midpoint(v: ReadonlyVector2): this;
    reject(onto: ReadonlyVector2): this;
    crossScalarRight(s: number): this;
    crossScalarLeft(s: number): this;
    
    // Getters for immutable operations
    get absolute(): Vector2Base;
    get normalized(): Vector2Base;
  }
}

// Numeric transforms implementation

/**
 * Applies {@link Math.floor} to both components.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.floor = function (): any {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};

/**
 * Applies {@link Math.ceil} to both components.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.ceil = function (): any {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};

/**
 * Applies {@link Math.round} to both components.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.round = function (): any {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};

/**
 * Applies {@link Math.abs} to both components.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.abs = function (): any {
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);
  return this;
};

/**
 * Component-wise reciprocal.
 * 
 * @returns `this` for chaining.
 * @throws {RangeError} If any component is zero.
 */
Vector2Base.prototype.inverse = function (): any {
  if (this.x === 0 || this.y === 0) {
    throw new RangeError('Vector2.inverse: cannot invert vector with zero component');
  }
  this.x = 1 / this.x;
  this.y = 1 / this.y;
  return this;
};

/**
 * Safe reciprocal (|component| ≤ LINEAR_EPSILON → `0`).
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.inverseSafe = function (): any {
  this.x = Math.abs(this.x) <= TOLERANCE.LINEAR ? 0 : 1 / this.x;
  this.y = Math.abs(this.y) <= TOLERANCE.LINEAR ? 0 : 1 / this.y;
  return this;
};

/**
 * Swaps `x` and `y`.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.swap = function (): any {
  const t = this.x;
  this.x = this.y;
  this.y = t;
  return this;
};

// Vector transforms implementation

/**
 * Normalizes this vector to unit length.
 * 
 * @returns `this` for chaining.
 * @throws {RangeError} If this vector has zero length.
 */
Vector2Base.prototype.normalize = function (): any {
  const length = Math.hypot(this.x, this.y);
  if (length === 0) {
    throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');
  }
  this.x /= length;
  this.y /= length;
  return this;
};

/**
 * Safe normalization. If zero length, becomes `(0,0)`.
 * 
 * @param tolerance - Zero-length tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns `this` for chaining.
 */
Vector2Base.prototype.normalizeSafe = function (tolerance: number = TOLERANCE.LINEAR): any {
  const length = Math.hypot(this.x, this.y);
  if (length <= tolerance) {
    this.x = 0;
    this.y = 0;
    return this;
  }
  this.x /= length;
  this.y /= length;
  return this;
};

/**
 * Sets this vector's length (throws if negative or zero length).
 * 
 * @param newLength - Desired magnitude (≥ 0).
 * @returns `this` for chaining.
 * @throws {RangeError} If `newLength < 0` or this vector is zero-length.
 */
Vector2Base.prototype.setLength = function (newLength: number): any {
  if (newLength < 0) {
    throw new RangeError('Vector2.setLength: length must be non-negative');
  }
  const length = Math.hypot(this.x, this.y);
  if (length === 0) {
    throw new RangeError('Vector2.setLength: cannot set length on zero-length vector');
  }
  const s = newLength / length;
  this.x *= s;
  this.y *= s;
  return this;
};

/**
 * Safe setLength. Negative `newLength` is clamped to `0`. Zero vectors become `(newLength, 0)`.
 * 
 * @param newLength - Desired magnitude (non-negative).
 * @param tolerance - Zero-length tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns `this` for chaining.
 */
Vector2Base.prototype.setLengthSafe = function (newLength: number, tolerance: number = TOLERANCE.LINEAR): any {
  const nn = newLength < 0 ? 0 : newLength;
  const length = Math.hypot(this.x, this.y);
  if (length <= tolerance) {
    this.x = nn;
    this.y = 0;
    return this;
  }
  const s = nn / length;
  this.x *= s;
  this.y *= s;
  return this;
};

/**
 * Sets heading (angle) while preserving length.
 * 
 * @param angle - New heading in radians.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.setHeading = function (angle: number): any {
  const length = Math.hypot(this.x, this.y);
  this.x = Math.cos(angle) * length;
  this.y = Math.sin(angle) * length;
  return this;
};

/**
 * Rotates this vector by `angle` radians.
 * 
 * @param angle - Rotation angle in radians.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.rotate = function (angle: number): any {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;
  this.x = rx;
  this.y = ry;
  return this;
};

/**
 * Alias for {@link setHeading}.
 * 
 * @param angle - New heading in radians.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.rotateTo = function (angle: number): any {
  return this.setHeading(angle);
};

/**
 * Rotates this vector using precomputed `cos`/`sin`.
 * 
 * @param c - Cosine of the angle.
 * @param s - Sine of the angle.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.rotateCS = function (c: number, s: number): any {
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;
  this.x = rx;
  this.y = ry;
  return this;
};

/**
 * Rotates this vector 90° clockwise.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.rotate90CW = function (): any {
  const t = this.x;
  this.x = this.y;
  this.y = -t;
  return this;
};

/**
 * Rotates this vector 90° counter-clockwise.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.rotate90CCW = function (): any {
  const t = this.x;
  this.x = -this.y;
  this.y = t;
  return this;
};

/**
 * Rotates this vector around `center` by `angle`.
 * 
 * @param center - Center of rotation.
 * @param angle - Rotation angle in radians.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.rotateAround = function (center: ReadonlyVector2, angle: number): any {
  return this.sub(center).rotate(angle).add(center);
};

/**
 * Rotates this vector around `center` using precomputed `cos`/`sin`.
 * 
 * @param center - Center of rotation.
 * @param c - Cosine of the angle.
 * @param s - Sine of the angle.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.rotateAroundCS = function (center: ReadonlyVector2, c: number, s: number): any {
  return this.sub(center).rotateCS(c, s).add(center);
};

/**
 * Rotates this vector by ±90° while keeping its magnitude.
 * 
 * @param clockwise - `true` for CW; `false` for CCW. @defaultValue `false`
 * @returns `this` for chaining.
 */
Vector2Base.prototype.perpendicular = function (clockwise: boolean = false): any {
  const { x, y } = this;
  if (clockwise) {
    this.x = y;
    this.y = -x;
  } else {
    this.x = -y;
    this.y = x;
  }
  return this;
};

/**
 * Rotates this vector by ±90° and normalizes it to unit length.
 * 
 * @param clockwise - `true` for CW; `false` for CCW. @defaultValue `false`
 * @returns `this` for chaining.
 * @throws {RangeError} If this vector has zero length.
 */
Vector2Base.prototype.unitPerpendicular = function (clockwise: boolean = false): any {
  if (this.isZero()) {
    throw new RangeError('Vector2.unitPerpendicular: cannot compute unit perpendicular of a zero-length vector');
  }
  return this.perpendicular(clockwise).normalize();
};

/**
 * Safe unit perpendicular (zero vectors become `(-1,0)` or `(1,0)` depending on `clockwise`).
 * 
 * @param clockwise - `true` for CW; `false` for CCW. @defaultValue `false`
 * @returns `this` for chaining.
 */
Vector2Base.prototype.unitPerpendicularSafe = function (clockwise: boolean = false): any {
  if (this.isZero()) {
    this.x = clockwise ? 1 : -1;
    this.y = 0;
    return this;
  }
  return this.unitPerpendicular(clockwise);
};

/**
 * Projects this vector onto `axis`. If `axis` is zero, sets `(0,0)`.
 * 
 * @param onto - Projection axis.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.project = function (onto: ReadonlyVector2): any {
  const denom = onto.x * onto.x + onto.y * onto.y;
  if (denom === 0) return this.zero();
  const s = this.dot(onto) / denom;
  return this.set(onto.x * s, onto.y * s);
};

/**
 * Safe projection (axis near zero → sets `(0,0)`).
 * 
 * @param onto - Projection axis.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.projectSafe = function (onto: ReadonlyVector2): any {
  const denom = onto.x * onto.x + onto.y * onto.y;
  if (denom <= EPSILON) return this.zero();
  const s = this.dot(onto) / denom;
  return this.set(onto.x * s, onto.y * s);
};

/**
 * Projects this vector onto a **unit** axis.
 * 
 * @param unitAxis - Unit-length axis of projection.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.projectOnUnit = function (unitAxis: ReadonlyVector2): any {
  const s = this.dot(unitAxis);
  return this.set(unitAxis.x * s, unitAxis.y * s);
};

/**
 * Reflects this vector about a **unit** normal.
 * 
 * @param unitNormal - Unit-length normal to reflect about.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.reflect = function (unitNormal: ReadonlyVector2): any {
  const dt2 = 2 * this.dot(unitNormal);
  this.x -= dt2 * unitNormal.x;
  this.y -= dt2 * unitNormal.y;
  return this;
};

/**
 * Safe reflection (normal is normalized internally; near-zero normal → no-op).
 * 
 * @param normal - Normal (need not be unitary).
 * @param tolerance - Zero-length tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns `this` for chaining.
 */
Vector2Base.prototype.reflectSafe = function (normal: ReadonlyVector2, tolerance: number = TOLERANCE.LINEAR): any {
  const length2 = normal.x * normal.x + normal.y * normal.y;
  if (length2 <= tolerance * tolerance) return this;
  
  const inv = 1 / Math.sqrt(length2);
  const nx = normal.x * inv;
  const ny = normal.y * inv;
  const dt2 = 2 * (this.x * nx + this.y * ny);
  
  this.x -= dt2 * nx;
  this.y -= dt2 * ny;
  return this;
};

/**
 * Sets this vector to the midpoint between itself and `v`.
 * 
 * @param v - The other vector.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.midpoint = function (v: ReadonlyVector2): any {
  this.x = (this.x + v.x) * 0.5;
  this.y = (this.y + v.y) * 0.5;
  return this;
};

/**
 * Replaces this vector by its rejection from `onto`: `this -= proj_onto(this)`.
 * 
 * @param onto - Axis of projection.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.reject = function (onto: ReadonlyVector2): any {
  const denom = onto.x * onto.x + onto.y * onto.y;
  if (denom === 0) return this;
  
  const s = this.dot(onto) / denom;
  this.x -= onto.x * s;
  this.y -= onto.y * s;
  return this;
};

/**
 * Box2D-style cross product **vector × scalar** on `this`: `this = ( s⋅y, -s⋅x )`.
 * 
 * @param s - Scalar factor.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.crossScalarRight = function (s: number): any {
  const { x, y } = this;
  this.x = s * y;
  this.y = -s * x;
  return this;
};

/**
 * Box2D-style cross product **scalar × vector** on `this`: `this = ( -s⋅y, s⋅x )`.
 * 
 * @param s - Scalar factor.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.crossScalarLeft = function (s: number): any {
  const { x, y } = this;
  this.x = -s * y;
  this.y = s * x;
  return this;
};

// Getters for immutable operations
/**
 * Absolute-value copy of this vector.
 * 
 * @returns A new {@link Vector2Base} with absolute components.
 */
Object.defineProperty(Vector2Base.prototype, 'absolute', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(Math.abs(this.x), Math.abs(this.y));
  },
  enumerable: false,
  configurable: true
});

/**
 * Unit-length copy of this vector (or `(0,0)` if zero).
 * 
 * @returns A new unit {@link Vector2Base}.
 */
Object.defineProperty(Vector2Base.prototype, 'normalized', {
  get: function (this: Vector2Base): Vector2Base {
    const length = Math.hypot(this.x, this.y);
    return length === 0 
      ? new Vector2Base(0, 0) 
      : new Vector2Base(this.x / length, this.y / length);
  },
  enumerable: false,
  configurable: true
});
