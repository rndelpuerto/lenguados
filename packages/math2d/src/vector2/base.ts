/**
 * @file src/vector2/base.ts
 * @module math2d/core/vector2/base
 * @description Base Vector2 class definition.
 * @internal
 */

/**
 * Base Vector2 class with only core properties and constructor.
 * Methods are added via prototype extension in separate modules.
 * @internal
 */
export class Vector2Base {
 /**
  * X component.
  */
 public x: number;

 /**
  * Y component.
  */
 public y: number;

 /**
  * Constructs a new 2D vector.
  *
  * @param x - X component (defaults to 0).
  * @param y - Y component (defaults to 0).
  */
 public constructor(x = 0, y = 0) {
  this.x = x;
  this.y = y;
 }
}
