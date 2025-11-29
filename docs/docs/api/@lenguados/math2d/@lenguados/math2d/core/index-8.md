# @lenguados/math2d/core

## File

core/vector2.draft.ts

## Description

Industrial-grade mutable 2D vector implementation.

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

## Helpers

- [freezeVector2](functions/freezeVector2.md)

## Other

### isVector2Like

Re-exports [isVector2Like](../types/functions/isVector2Like.md)

---

### Vector2

Re-exports [Vector2](../../../index.ts/classes/Vector2.md)
