# @lenguados/math2d/core

## File

core/vector2.ts

## Description

Two-dimensional vector implementation for the Lenguado 2-D physics-engine family.

## Remarks

**Angle & rotation conventions**

- Angles are in radians, measured from the +X axis with **counter-clockwise (CCW)** positive.
- Vectors are treated as column vectors; rotations use the standard matrix:
  ```
  [ cosθ  −sinθ ]
  [ sinθ   cosθ ]
  ```

**Design principles**

- Instance methods mutate `this` for fluent chaining.
- Static methods are pure and accept an optional `out` parameter to avoid allocations.
- Trigonometric and square-root operations delegate to [DeterministicMath](../deterministic/classes/DeterministicMath.md).
- All operations use auxiliary modules to maintain DRY principle.

## Core

- [Vector2](classes/Vector2.md)

## Helpers

- [freezeVector2](functions/freezeVector2.md)

## Other

### isVector2Like

Re-exports [isVector2Like](../types/functions/isVector2Like.md)

## Types

- [ReadonlyVector2](type-aliases/ReadonlyVector2.md)
