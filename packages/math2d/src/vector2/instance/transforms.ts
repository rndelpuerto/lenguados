/**
 * @file src/vector2/instance/transforms.ts
 * @module math2d/core/vector2/instance/transforms
 * @description Instance transform methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import { EPSILON } from '../../scalar';

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

Vector2Base.prototype.floor = function (): any {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};

Vector2Base.prototype.ceil = function (): any {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};

Vector2Base.prototype.round = function (): any {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};

Vector2Base.prototype.abs = function (): any {
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);
  return this;
};

Vector2Base.prototype.inverse = function (): any {
  if (this.x === 0 || this.y === 0) {
    throw new RangeError('Vector2.inverse: cannot invert vector with zero component');
  }
  this.x = 1 / this.x;
  this.y = 1 / this.y;
  return this;
};

Vector2Base.prototype.inverseSafe = function (): any {
  this.x = Math.abs(this.x) <= EPSILON ? 0 : 1 / this.x;
  this.y = Math.abs(this.y) <= EPSILON ? 0 : 1 / this.y;
  return this;
};

Vector2Base.prototype.swap = function (): any {
  const t = this.x;
  this.x = this.y;
  this.y = t;
  return this;
};

// Vector transforms implementation

Vector2Base.prototype.normalize = function (): any {
  const length = Math.hypot(this.x, this.y);
  if (length === 0) {
    throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');
  }
  this.x /= length;
  this.y /= length;
  return this;
};

Vector2Base.prototype.normalizeSafe = function (tolerance: number = EPSILON): any {
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

Vector2Base.prototype.setLengthSafe = function (newLength: number, tolerance: number = EPSILON): any {
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

Vector2Base.prototype.setHeading = function (angle: number): any {
  const length = Math.hypot(this.x, this.y);
  this.x = Math.cos(angle) * length;
  this.y = Math.sin(angle) * length;
  return this;
};

Vector2Base.prototype.rotate = function (angle: number): any {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;
  this.x = rx;
  this.y = ry;
  return this;
};

Vector2Base.prototype.rotateTo = function (angle: number): any {
  return this.setHeading(angle);
};

Vector2Base.prototype.rotateCS = function (c: number, s: number): any {
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;
  this.x = rx;
  this.y = ry;
  return this;
};

Vector2Base.prototype.rotate90CW = function (): any {
  const t = this.x;
  this.x = this.y;
  this.y = -t;
  return this;
};

Vector2Base.prototype.rotate90CCW = function (): any {
  const t = this.x;
  this.x = -this.y;
  this.y = t;
  return this;
};

Vector2Base.prototype.rotateAround = function (center: ReadonlyVector2, angle: number): any {
  return this.sub(center).rotate(angle).add(center);
};

Vector2Base.prototype.rotateAroundCS = function (center: ReadonlyVector2, c: number, s: number): any {
  return this.sub(center).rotateCS(c, s).add(center);
};

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

Vector2Base.prototype.unitPerpendicular = function (clockwise: boolean = false): any {
  if (this.isZero()) {
    throw new RangeError('Vector2.unitPerpendicular: cannot compute unit perpendicular of a zero-length vector');
  }
  return this.perpendicular(clockwise).normalize();
};

Vector2Base.prototype.unitPerpendicularSafe = function (clockwise: boolean = false): any {
  if (this.isZero()) {
    this.x = clockwise ? 1 : -1;
    this.y = 0;
    return this;
  }
  return this.unitPerpendicular(clockwise);
};

Vector2Base.prototype.project = function (onto: ReadonlyVector2): any {
  const denom = onto.x * onto.x + onto.y * onto.y;
  if (denom === 0) return this.zero();
  const s = this.dot(onto) / denom;
  return this.set(onto.x * s, onto.y * s);
};

Vector2Base.prototype.projectSafe = function (onto: ReadonlyVector2): any {
  const denom = onto.x * onto.x + onto.y * onto.y;
  if (denom <= EPSILON) return this.zero();
  const s = this.dot(onto) / denom;
  return this.set(onto.x * s, onto.y * s);
};

Vector2Base.prototype.projectOnUnit = function (unitAxis: ReadonlyVector2): any {
  const s = this.dot(unitAxis);
  return this.set(unitAxis.x * s, unitAxis.y * s);
};

Vector2Base.prototype.reflect = function (unitNormal: ReadonlyVector2): any {
  const dt2 = 2 * this.dot(unitNormal);
  this.x -= dt2 * unitNormal.x;
  this.y -= dt2 * unitNormal.y;
  return this;
};

Vector2Base.prototype.reflectSafe = function (normal: ReadonlyVector2, tolerance: number = EPSILON): any {
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

Vector2Base.prototype.midpoint = function (v: ReadonlyVector2): any {
  this.x = (this.x + v.x) * 0.5;
  this.y = (this.y + v.y) * 0.5;
  return this;
};

Vector2Base.prototype.reject = function (onto: ReadonlyVector2): any {
  const denom = onto.x * onto.x + onto.y * onto.y;
  if (denom === 0) return this;
  
  const s = this.dot(onto) / denom;
  this.x -= onto.x * s;
  this.y -= onto.y * s;
  return this;
};

Vector2Base.prototype.crossScalarRight = function (s: number): any {
  const { x, y } = this;
  this.x = s * y;
  this.y = -s * x;
  return this;
};

Vector2Base.prototype.crossScalarLeft = function (s: number): any {
  const { x, y } = this;
  this.x = -s * y;
  this.y = s * x;
  return this;
};

// Getters for immutable operations
Object.defineProperty(Vector2Base.prototype, 'absolute', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(Math.abs(this.x), Math.abs(this.y));
  },
  enumerable: false,
  configurable: true
});

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
