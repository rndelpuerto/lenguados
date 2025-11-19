/**
 * @file src/core/vector2/temporary-complete.ts
 * @module math2d/core/vector2/temporary-complete
 * @description Temporary file containing all remaining Vector2 methods to be modularized.
 * This ensures the Vector2 class remains fully functional during the refactoring process.
 * @internal
 */

/* eslint-disable no-dupe-class-members */

import { Vector2Base } from './base';
import type { ReadonlyVector2 } from './factories';
import type { Vector2Like } from './helpers';
import { clampUnordered, safeDiv as safeDivide } from '../numeric';
import { EPSILON, clamp as clampNumber, sign as scalarSign } from '../scalar';
import { LINEAR_EPSILON } from '../constants/precision';
import { areNearEqual, isNearZero, validateTolerance } from '../core-utils/tolerance';

// Module augmentation to add all remaining methods
declare module './base' {
 interface Vector2Base {
  // Instance methods - Component access & swizzles
  getComponent(index: 0 | 1): number;
  clone(): Vector2Base;
  
  // Swizzle getters
  get xy(): Vector2Base;
  get yx(): Vector2Base;
  get xx(): Vector2Base;
  get yy(): Vector2Base;
  
  // Basic mutators
  set(x: number, y: number): this;
  setComponent(index: 0 | 1, value: number): this;
  setX(x: number): this;
  setY(y: number): this;
  setFromArray(array: ArrayLike<number>, offset?: number): this;
  setFromObject(object: Vector2Like): this;
  copy(source: ReadonlyVector2): this;
  zero(): this;
  one(): this;
  
  // Arithmetic (instance)
  sumComponents(): number;
  add(v: ReadonlyVector2): this;
  addScalar(s: number): this;
  sub(v: ReadonlyVector2): this;
  subScalar(s: number): this;
  multiply(v: ReadonlyVector2): this;
  multiplyScalar(s: number): this;
  scale(s: number): this;
  divide(v: ReadonlyVector2): this;
  divideScalar(s: number): this;
  divideSafe(v: ReadonlyVector2): this;
  
  // Numeric transforms (instance)
  negate(): this;
  floor(): this;
  ceil(): this;
  round(): this;
  abs(): this;
  inverse(): this;
  inverseSafe(): this;
  swap(): this;
  
  // Interpolation (instance)
  lerp(end: ReadonlyVector2, t: number): this;
  lerpClamped(end: ReadonlyVector2, t: number): this;
  slerp(end: ReadonlyVector2, t: number): this;
  
  // Geometry (instance)
  dot(v: ReadonlyVector2): number;
  cross(v: ReadonlyVector2): number;
  length(): number;
  lengthSq(): number;
  setLength(length: number): this;
  setLengthSafe(length: number, tolerance?: number): this;
  
  // Vector transforms (instance)
  normalize(): this;
  normalizeSafe(tolerance?: number): this;
  rotate(angle: number): this;
  rotateTo(angle: number): this;
  rotate90CW(): this;
  rotate90CCW(): this;
  project(onto: ReadonlyVector2): this;
  projectSafe(onto: ReadonlyVector2): this;
  reflect(normal: ReadonlyVector2): this;
  reflectSafe(normal: ReadonlyVector2, tolerance?: number): this;
  
  // Constraints (instance)
  clamp(min: ReadonlyVector2, max: ReadonlyVector2): this;
  clampScalar(minVal: number, maxVal: number): this;
  clampLength(maxLength: number): this;
  
  // Comparison (instance)
  angle(): number;
  angleTo(v: ReadonlyVector2): number;
  angleBetween(v: ReadonlyVector2): number;
  distanceTo(v: ReadonlyVector2): number;
  distanceSqTo(v: ReadonlyVector2): number;
  equals(v: ReadonlyVector2): boolean;
  nearEquals(v: ReadonlyVector2, tolerance?: number): boolean;
  fuzzyEquals(v: ReadonlyVector2, tolerance?: number): boolean;  // @deprecated
  isZero(): boolean;
  nearZero(tolerance?: number): boolean;
  fuzzyZero(tolerance?: number): boolean;  // @deprecated
  
  // Conversion (instance)
  toArray(): [number, number];
  toArray<T extends ArrayLike<number>>(array: T, offset?: number): T;
  toObject(): Vector2Like;
  toString(): string;
  toFixed(fractionDigits?: number): string;
  toExponential(fractionDigits?: number): string;
  toPrecision(precision?: number): string;
 }

 // eslint-disable-next-line @typescript-eslint/no-namespace
 namespace Vector2Base {
  // Remaining static methods
  
  // Numeric transforms
  function negate(v: ReadonlyVector2): Vector2Base;
  function negate(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  
  // Vector transforms
  function normalize(v: ReadonlyVector2): Vector2Base;
  function normalize(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  
  function normalizeSafe(v: ReadonlyVector2): Vector2Base;
  function normalizeSafe(v: ReadonlyVector2, outVector: Vector2Base, tolerance?: number): Vector2Base;
  
  function setLength(v: ReadonlyVector2, length: number): Vector2Base;
  function setLength(v: ReadonlyVector2, length: number, outVector: Vector2Base): Vector2Base;
  
  function setLengthSafe(v: ReadonlyVector2, length: number): Vector2Base;
  function setLengthSafe(v: ReadonlyVector2, length: number, outVector: Vector2Base, tolerance?: number): Vector2Base;
  
  function rotate(v: ReadonlyVector2, angle: number): Vector2Base;
  function rotate(v: ReadonlyVector2, angle: number, outVector: Vector2Base): Vector2Base;
  
  function rotateTo(v: ReadonlyVector2, angle: number): Vector2Base;
  function rotateTo(v: ReadonlyVector2, angle: number, outVector: Vector2Base): Vector2Base;
  
  function rotate90CW(v: ReadonlyVector2): Vector2Base;
  function rotate90CW(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  
  function rotate90CCW(v: ReadonlyVector2): Vector2Base;
  function rotate90CCW(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  
  function reflect(v: ReadonlyVector2, normal: ReadonlyVector2): Vector2Base;
  function reflect(v: ReadonlyVector2, normal: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  
  function reflectSafe(v: ReadonlyVector2, normal: ReadonlyVector2): Vector2Base;
  function reflectSafe(v: ReadonlyVector2, normal: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  
  // Constraints
  function clamp(v: ReadonlyVector2, min: ReadonlyVector2, max: ReadonlyVector2): Vector2Base;
  function clamp(v: ReadonlyVector2, min: ReadonlyVector2, max: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
  
  function clampScalar(v: ReadonlyVector2, minVal: number, maxVal: number): Vector2Base;
  function clampScalar(v: ReadonlyVector2, minVal: number, maxVal: number, outVector: Vector2Base): Vector2Base;
  
  function clampLength(v: ReadonlyVector2, maxLength: number): Vector2Base;
  function clampLength(v: ReadonlyVector2, maxLength: number, outVector: Vector2Base): Vector2Base;
  
  // Comparison
  function isZero(v: ReadonlyVector2): boolean;
  function nearZero(v: ReadonlyVector2, tolerance?: number): boolean;
  function fuzzyZero(v: ReadonlyVector2, tolerance?: number): boolean;  // @deprecated
  function equals(a: ReadonlyVector2, b: ReadonlyVector2): boolean;
  function nearEquals(a: ReadonlyVector2, b: ReadonlyVector2, tolerance?: number): boolean;
  function fuzzyEquals(a: ReadonlyVector2, b: ReadonlyVector2, tolerance?: number): boolean;  // @deprecated
  
  // Conversion
  function toArray(v: ReadonlyVector2): [number, number];
  function toArray<T extends ArrayLike<number>>(v: ReadonlyVector2, array: T, offset?: number): T;
  function toObject(v: ReadonlyVector2): Vector2Like;
  function toString(v: ReadonlyVector2): string;
  function toFixed(v: ReadonlyVector2, fractionDigits?: number): string;
 }
}

// Implementation of remaining static methods
Vector2Base.negate = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(-v.x, -v.y);
};

Vector2Base.normalize = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const length = Math.hypot(v.x, v.y);
 
 if (length === 0) {
  throw new RangeError('Vector2.normalize: cannot normalize zero vector');
 }
 
 return out.set(v.x / length, v.y / length);
};

Vector2Base.normalizeSafe = function (
 v: ReadonlyVector2,
 outVector?: Vector2Base | number,
 tolerance?: number,
): Vector2Base {
 if (typeof outVector === 'number') {
  tolerance = outVector;
  outVector = new Vector2Base();
 }
 
 const out = outVector ?? new Vector2Base();
 const tol = tolerance ?? LINEAR_EPSILON;
 const length = Math.hypot(v.x, v.y);
 
 if (length <= tol) {
  return out.set(0, 0);
 }
 
 return out.set(v.x / length, v.y / length);
};

Vector2Base.setLength = function (
 v: ReadonlyVector2,
 length: number,
 outVector?: Vector2Base,
): Vector2Base {
 return Vector2Base.normalize(v, outVector ?? new Vector2Base()).multiplyScalar(length);
};

Vector2Base.setLengthSafe = function (
 v: ReadonlyVector2,
 length: number,
 outVector?: Vector2Base | number,
 tolerance?: number,
): Vector2Base {
 if (typeof outVector === 'number') {
  tolerance = outVector;
  outVector = new Vector2Base();
 }
 
 const out = outVector ?? new Vector2Base();
 Vector2Base.normalizeSafe(v, out, tolerance);
 return out.multiplyScalar(length);
};

Vector2Base.rotate = function (
 v: ReadonlyVector2,
 angle: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const cos = Math.cos(angle);
 const sin = Math.sin(angle);
 const x = v.x * cos - v.y * sin;
 const y = v.x * sin + v.y * cos;
 return out.set(x, y);
};

Vector2Base.rotateTo = function (
 v: ReadonlyVector2,
 angle: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const length = Math.hypot(v.x, v.y);
 return out.set(length * Math.cos(angle), length * Math.sin(angle));
};

Vector2Base.rotate90CW = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(v.y, -v.x);
};

Vector2Base.rotate90CCW = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(-v.y, v.x);
};

Vector2Base.reflect = function (
 v: ReadonlyVector2,
 normal: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const dot2 = 2 * Vector2Base.dot(v, normal);
 return out.set(v.x - dot2 * normal.x, v.y - dot2 * normal.y);
};

Vector2Base.reflectSafe = function (
 v: ReadonlyVector2,
 normal: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const lengthSq = Vector2Base.lengthSq(normal);
 
 if (lengthSq < EPSILON * EPSILON) {
  return Vector2Base.copy(v, out);
 }
 
 const dot2 = 2 * Vector2Base.dot(v, normal) / lengthSq;
 return out.set(v.x - dot2 * normal.x, v.y - dot2 * normal.y);
};

Vector2Base.clamp = function (
 v: ReadonlyVector2,
 min: ReadonlyVector2,
 max: ReadonlyVector2,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(
  clampUnordered(v.x, min.x, max.x),
  clampUnordered(v.y, min.y, max.y),
 );
};

Vector2Base.clampScalar = function (
 v: ReadonlyVector2,
 minVal: number,
 maxVal: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 return out.set(
  clampNumber(v.x, minVal, maxVal),
  clampNumber(v.y, minVal, maxVal),
 );
};

Vector2Base.clampLength = function (
 v: ReadonlyVector2,
 maxLength: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 const lengthSq = Vector2Base.lengthSq(v);
 
 if (lengthSq <= maxLength * maxLength) {
  return Vector2Base.copy(v, out);
 }
 
 const scale = maxLength / Math.sqrt(lengthSq);
 return out.set(v.x * scale, v.y * scale);
};

Vector2Base.isZero = function (v: ReadonlyVector2): boolean {
 return v.x === 0 && v.y === 0;
};

Vector2Base.nearZero = function (v: ReadonlyVector2, tolerance?: number): boolean {
 const tol = tolerance ?? LINEAR_EPSILON;
 validateTolerance(tol, 'Vector2.nearZero');
 return isNearZero(v.x, tol) && isNearZero(v.y, tol);
};

/**
 * @deprecated Use nearZero() instead
 */
Vector2Base.fuzzyZero = function (v: ReadonlyVector2, tolerance?: number): boolean {
 return Vector2Base.nearZero(v, tolerance);
};

Vector2Base.equals = function (a: ReadonlyVector2, b: ReadonlyVector2): boolean {
 return a.x === b.x && a.y === b.y;
};

Vector2Base.nearEquals = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 tolerance?: number,
): boolean {
 const tol = tolerance ?? LINEAR_EPSILON;
 validateTolerance(tol, 'Vector2.nearEquals');
 return areNearEqual(a.x, b.x, tol) && areNearEqual(a.y, b.y, tol);
};

/**
 * @deprecated Use nearEquals() instead
 */
Vector2Base.fuzzyEquals = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 tolerance?: number,
): boolean {
 return Vector2Base.nearEquals(a, b, tolerance);
};

Vector2Base.toArray = function (v: ReadonlyVector2): [number, number];
Vector2Base.toArray = function <T extends ArrayLike<number>>(
 v: ReadonlyVector2,
 array?: T,
 offset?: number,
): T | [number, number] {
 if (!array) {
  return [v.x, v.y];
 }
 
 const off = offset ?? 0;
 (array as any)[off] = v.x;
 (array as any)[off + 1] = v.y;
 return array;
};

Vector2Base.toObject = function (v: ReadonlyVector2): Vector2Like {
 return { x: v.x, y: v.y };
};

Vector2Base.toString = function (v: ReadonlyVector2): string {
 return `[${v.x}, ${v.y}]`;
};

Vector2Base.toFixed = function (v: ReadonlyVector2, fractionDigits?: number): string {
 return `[${v.x.toFixed(fractionDigits)}, ${v.y.toFixed(fractionDigits)}]`;
};

// Implementation of instance methods
Vector2Base.prototype.getComponent = function (index: 0 | 1): number {
 return index === 1 ? this.y : this.x;
};

Vector2Base.prototype.clone = function (): Vector2Base {
 return new Vector2Base(this.x, this.y);
};

// Swizzle getters
Object.defineProperty(Vector2Base.prototype, 'xy', {
 get() {
  return new Vector2Base(this.x, this.y);
 },
});

Object.defineProperty(Vector2Base.prototype, 'yx', {
 get() {
  return new Vector2Base(this.y, this.x);
 },
});

Object.defineProperty(Vector2Base.prototype, 'xx', {
 get() {
  return new Vector2Base(this.x, this.x);
 },
});

Object.defineProperty(Vector2Base.prototype, 'yy', {
 get() {
  return new Vector2Base(this.y, this.y);
 },
});

// Basic mutators
Vector2Base.prototype.set = function (x: number, y: number): any {
 this.x = x;
 this.y = y;
 return this;
};

Vector2Base.prototype.setComponent = function (index: 0 | 1, value: number): any {
 if (index === 1) this.y = value;
 else this.x = value;
 return this;
};

Vector2Base.prototype.setX = function (x: number): any {
 this.x = x;
 return this;
};

Vector2Base.prototype.setY = function (y: number): any {
 this.y = y;
 return this;
};

Vector2Base.prototype.setFromArray = function (array: ArrayLike<number>, offset = 0): any {
 this.x = array[offset];
 this.y = array[offset + 1];
 return this;
};

Vector2Base.prototype.setFromObject = function (object: Vector2Like): any {
 this.x = object.x;
 this.y = object.y;
 return this;
};

Vector2Base.prototype.copy = function (source: ReadonlyVector2): any {
 this.x = source.x;
 this.y = source.y;
 return this;
};

Vector2Base.prototype.zero = function (): any {
 this.x = 0;
 this.y = 0;
 return this;
};

Vector2Base.prototype.one = function (): any {
 this.x = 1;
 this.y = 1;
 return this;
};

// Arithmetic (instance)
Vector2Base.prototype.sumComponents = function (): number {
 return this.x + this.y;
};

Vector2Base.prototype.add = function (v: ReadonlyVector2): any {
 this.x += v.x;
 this.y += v.y;
 return this;
};

Vector2Base.prototype.addScalar = function (s: number): any {
 this.x += s;
 this.y += s;
 return this;
};

Vector2Base.prototype.sub = function (v: ReadonlyVector2): any {
 this.x -= v.x;
 this.y -= v.y;
 return this;
};

Vector2Base.prototype.subScalar = function (s: number): any {
 this.x -= s;
 this.y -= s;
 return this;
};

Vector2Base.prototype.multiply = function (v: ReadonlyVector2): any {
 this.x *= v.x;
 this.y *= v.y;
 return this;
};

Vector2Base.prototype.multiplyScalar = function (s: number): any {
 this.x *= s;
 this.y *= s;
 return this;
};

Vector2Base.prototype.scale = function (s: number): any {
 return this.multiplyScalar(s);
};

Vector2Base.prototype.divide = function (v: ReadonlyVector2): any {
 if (v.x === 0 || v.y === 0) {
  throw new Error(`Vector2.divide: division by zero (v.x=${v.x}, v.y=${v.y})`);
 }
 this.x /= v.x;
 this.y /= v.y;
 return this;
};

Vector2Base.prototype.divideScalar = function (s: number): any {
 if (s === 0) {
  throw new Error('Vector2.divideScalar: division by zero');
 }
 this.x /= s;
 this.y /= s;
 return this;
};

Vector2Base.prototype.divideSafe = function (v: ReadonlyVector2): any {
 this.x = safeDivide(this.x, v.x);
 this.y = safeDivide(this.y, v.y);
 return this;
};

// Numeric transforms (instance)
Vector2Base.prototype.negate = function (): any {
 this.x = -this.x;
 this.y = -this.y;
 return this;
};

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
 const temp = this.x;
 this.x = this.y;
 this.y = temp;
 return this;
};

// Interpolation (instance)
Vector2Base.prototype.lerp = function (end: ReadonlyVector2, t: number): any {
 this.x += (end.x - this.x) * t;
 this.y += (end.y - this.y) * t;
 return this;
};

Vector2Base.prototype.lerpClamped = function (end: ReadonlyVector2, t: number): any {
 const tt = clampNumber(t, 0, 1);
 return this.lerp(end, tt);
};

Vector2Base.prototype.slerp = function (end: ReadonlyVector2, t: number): any {
 Vector2Base.slerp(this, end, t, this);
 return this;
};

// Geometry (instance)
Vector2Base.prototype.dot = function (v: ReadonlyVector2): number {
 return this.x * v.x + this.y * v.y;
};

Vector2Base.prototype.cross = function (v: ReadonlyVector2): number {
 return this.x * v.y - this.y * v.x;
};

Vector2Base.prototype.length = function (): number {
 return Math.hypot(this.x, this.y);
};

Vector2Base.prototype.lengthSq = function (): number {
 return this.x * this.x + this.y * this.y;
};

Vector2Base.prototype.setLength = function (length: number): any {
 return this.normalize().multiplyScalar(length);
};

Vector2Base.prototype.setLengthSafe = function (length: number, tolerance = LINEAR_EPSILON): any {
 return this.normalizeSafe(tolerance).multiplyScalar(length);
};

// Vector transforms (instance)
Vector2Base.prototype.normalize = function (): any {
 const length = this.length();
 
 if (length === 0) {
  throw new RangeError('Vector2.normalize: cannot normalize zero vector');
 }
 
 return this.divideScalar(length);
};

Vector2Base.prototype.normalizeSafe = function (tolerance = LINEAR_EPSILON): any {
 const length = this.length();
 
 if (length <= tolerance) {
  return this.set(0, 0);
 }
 
 return this.divideScalar(length);
};

Vector2Base.prototype.rotate = function (angle: number): any {
 const cos = Math.cos(angle);
 const sin = Math.sin(angle);
 const x = this.x * cos - this.y * sin;
 const y = this.x * sin + this.y * cos;
 return this.set(x, y);
};

Vector2Base.prototype.rotateTo = function (angle: number): any {
 const length = this.length();
 return this.set(length * Math.cos(angle), length * Math.sin(angle));
};

Vector2Base.prototype.rotate90CW = function (): any {
 const temp = this.x;
 this.x = this.y;
 this.y = -temp;
 return this;
};

Vector2Base.prototype.rotate90CCW = function (): any {
 const temp = this.x;
 this.x = -this.y;
 this.y = temp;
 return this;
};

Vector2Base.prototype.project = function (onto: ReadonlyVector2): any {
 const lengthSq = onto.x * onto.x + onto.y * onto.y;
 
 if (lengthSq === 0) {
  throw new RangeError('Vector2.project: cannot project onto zero vector');
 }
 
 const scale = this.dot(onto) / lengthSq;
 return this.set(onto.x * scale, onto.y * scale);
};

Vector2Base.prototype.projectSafe = function (onto: ReadonlyVector2): any {
 const lengthSq = onto.x * onto.x + onto.y * onto.y;
 
 if (lengthSq <= EPSILON * EPSILON) {
  return this.set(0, 0);
 }
 
 const scale = this.dot(onto) / lengthSq;
 return this.set(onto.x * scale, onto.y * scale);
};

Vector2Base.prototype.reflect = function (normal: ReadonlyVector2): any {
 const dot2 = 2 * this.dot(normal);
 this.x -= dot2 * normal.x;
 this.y -= dot2 * normal.y;
 return this;
};

Vector2Base.prototype.reflectSafe = function (normal: ReadonlyVector2): any {
 const lengthSq = normal.x * normal.x + normal.y * normal.y;
 
 if (lengthSq < EPSILON * EPSILON) {
  return this;
 }
 
 const dot2 = 2 * this.dot(normal) / lengthSq;
 this.x -= dot2 * normal.x;
 this.y -= dot2 * normal.y;
 return this;
};

// Constraints (instance)
Vector2Base.prototype.clamp = function (min: ReadonlyVector2, max: ReadonlyVector2): any {
 this.x = clampUnordered(this.x, min.x, max.x);
 this.y = clampUnordered(this.y, min.y, max.y);
 return this;
};

Vector2Base.prototype.clampScalar = function (minVal: number, maxVal: number): any {
 this.x = clampNumber(this.x, minVal, maxVal);
 this.y = clampNumber(this.y, minVal, maxVal);
 return this;
};

Vector2Base.prototype.clampLength = function (maxLength: number): any {
 const lengthSq = this.lengthSq();
 
 if (lengthSq <= maxLength * maxLength) {
  return this;
 }
 
 const scale = maxLength / Math.sqrt(lengthSq);
 return this.multiplyScalar(scale);
};

// Comparison (instance)
Vector2Base.prototype.angle = function (): number {
 return Math.atan2(this.y, this.x);
};

Vector2Base.prototype.angleTo = function (v: ReadonlyVector2): number {
 return Math.atan2(this.cross(v), this.dot(v));
};

Vector2Base.prototype.angleBetween = function (v: ReadonlyVector2): number {
 const product = this.length() * Vector2Base.length(v);
 
 if (product === 0) return 0;
 
 const cosA = clampNumber(this.dot(v) / product, -1, 1);
 return Math.acos(cosA);
};

Vector2Base.prototype.distanceTo = function (v: ReadonlyVector2): number {
 return Math.hypot(this.x - v.x, this.y - v.y);
};

Vector2Base.prototype.distanceSqTo = function (v: ReadonlyVector2): number {
 const dx = this.x - v.x;
 const dy = this.y - v.y;
 return dx * dx + dy * dy;
};

Vector2Base.prototype.equals = function (v: ReadonlyVector2): boolean {
 return this.x === v.x && this.y === v.y;
};

Vector2Base.prototype.nearEquals = function (v: ReadonlyVector2, tolerance = LINEAR_EPSILON): boolean {
 validateTolerance(tolerance, 'Vector2.nearEquals');
 return areNearEqual(this.x, v.x, tolerance) && areNearEqual(this.y, v.y, tolerance);
};

/**
 * @deprecated Use nearEquals() instead
 */
Vector2Base.prototype.fuzzyEquals = function (v: ReadonlyVector2, tolerance = LINEAR_EPSILON): boolean {
 return this.nearEquals(v, tolerance);
};

Vector2Base.prototype.isZero = function (): boolean {
 return this.x === 0 && this.y === 0;
};

Vector2Base.prototype.nearZero = function (tolerance = LINEAR_EPSILON): boolean {
 validateTolerance(tolerance, 'Vector2.nearZero');
 return isNearZero(this.x, tolerance) && isNearZero(this.y, tolerance);
};

/**
 * @deprecated Use nearZero() instead
 */
Vector2Base.prototype.fuzzyZero = function (tolerance = LINEAR_EPSILON): boolean {
 return this.nearZero(tolerance);
};

// Conversion (instance)
Vector2Base.prototype.toArray = function <T extends ArrayLike<number>>(
 array?: T,
 offset = 0,
): T | [number, number] {
 if (!array) {
  return [this.x, this.y];
 }
 
 (array as any)[offset] = this.x;
 (array as any)[offset + 1] = this.y;
 return array;
};

Vector2Base.prototype.toObject = function (): Vector2Like {
 return { x: this.x, y: this.y };
};

Vector2Base.prototype.toString = function (): string {
 return `[${this.x}, ${this.y}]`;
};

Vector2Base.prototype.toFixed = function (fractionDigits?: number): string {
 return `[${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}]`;
};

Vector2Base.prototype.toExponential = function (fractionDigits?: number): string {
 return `[${this.x.toExponential(fractionDigits)}, ${this.y.toExponential(fractionDigits)}]`;
};

Vector2Base.prototype.toPrecision = function (precision?: number): string {
 return `[${this.x.toPrecision(precision)}, ${this.y.toPrecision(precision)}]`;
};
