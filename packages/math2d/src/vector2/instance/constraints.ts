/**
 * @file src/vector2/instance/constraints.ts
 * @module math2d/core/vector2/instance/constraints
 * @description Instance constraint methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';

// Module augmentation to add instance constraint methods
declare module '../base' {
  interface Vector2Base {
    // Constraint methods
    clamp(min: ReadonlyVector2, max: ReadonlyVector2): this;
    clampScalar(minVal: number, maxVal: number): this;
    clampLength(minLength: number, maxLength: number): this;
    limit(maxLength: number): this;
    min(v: ReadonlyVector2): this;
    max(v: ReadonlyVector2): this;
  }
}

// Implementation

Vector2Base.prototype.clamp = function (min: ReadonlyVector2, max: ReadonlyVector2): any {
  this.x = Math.min(Math.max(this.x, min.x), max.x);
  this.y = Math.min(Math.max(this.y, min.y), max.y);
  return this;
};

Vector2Base.prototype.clampScalar = function (minVal: number, maxVal: number): any {
  this.x = Math.min(Math.max(this.x, minVal), maxVal);
  this.y = Math.min(Math.max(this.y, minVal), maxVal);
  return this;
};

Vector2Base.prototype.clampLength = function (minLength: number, maxLength: number): any {
  const lsq = this.lengthSq();
  
  if (lsq === 0) return this;
  
  const l = Math.sqrt(lsq);
  
  if (l < minLength) {
    const s = minLength / l;
    this.x *= s;
    this.y *= s;
  } else if (l > maxLength) {
    const s = maxLength / l;
    this.x *= s;
    this.y *= s;
  }
  
  return this;
};

Vector2Base.prototype.limit = function (maxLength: number): any {
  const lsq = this.lengthSq();
  
  if (lsq > maxLength * maxLength) {
    const s = maxLength / Math.sqrt(lsq);
    this.x *= s;
    this.y *= s;
  }
  
  return this;
};

Vector2Base.prototype.min = function (v: ReadonlyVector2): any {
  this.x = Math.min(this.x, v.x);
  this.y = Math.min(this.y, v.y);
  return this;
};

Vector2Base.prototype.max = function (v: ReadonlyVector2): any {
  this.x = Math.max(this.x, v.x);
  this.y = Math.max(this.y, v.y);
  return this;
};
