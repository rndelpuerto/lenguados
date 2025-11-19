/**
 * @file src/vector2/instance/interpolation.ts
 * @module math2d/core/vector2/instance/interpolation
 * @description Instance interpolation methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';

// Module augmentation to add instance interpolation methods
declare module '../base' {
  interface Vector2Base {
    // Interpolation methods
    lerp(end: ReadonlyVector2, t: number): this;
    lerpClamped(end: ReadonlyVector2, t: number): this;
    slerp(end: ReadonlyVector2, t: number): this;
  }
}

// Implementation

Vector2Base.prototype.lerp = function (end: ReadonlyVector2, t: number): any {
  this.x += (end.x - this.x) * t;
  this.y += (end.y - this.y) * t;
  return this;
};

Vector2Base.prototype.lerpClamped = function (end: ReadonlyVector2, t: number): any {
  if (t <= 0) return this;
  if (t >= 1) return this.copy(end);
  return this.lerp(end, t);
};

Vector2Base.prototype.slerp = function (end: ReadonlyVector2, t: number): any {
  // Get the angle between vectors
  const startLength = this.length();
  const endLength = end.length();
  
  // Handle degenerate cases
  if (startLength === 0 || endLength === 0) {
    return this.lerp(end, t);
  }
  
  // Normalize both vectors
  const startX = this.x / startLength;
  const startY = this.y / startLength;
  const endX = end.x / endLength;
  const endY = end.y / endLength;
  
  // Calculate the angle between them
  let dot = startX * endX + startY * endY;
  
  // Clamp dot product to avoid numerical errors
  dot = Math.max(-1, Math.min(1, dot));
  
  const theta = Math.acos(dot);
  const sinTheta = Math.sin(theta);
  
  // If vectors are nearly parallel, use linear interpolation
  if (Math.abs(sinTheta) < 0.001) {
    return this.lerp(end, t);
  }
  
  // Perform spherical interpolation
  const a = Math.sin((1 - t) * theta) / sinTheta;
  const b = Math.sin(t * theta) / sinTheta;
  
  // Interpolate the direction
  const dirX = a * startX + b * endX;
  const dirY = a * startY + b * endY;
  
  // Interpolate the length
  const length = startLength + (endLength - startLength) * t;
  
  // Set the final result
  this.x = dirX * length;
  this.y = dirY * length;
  return this;
};
