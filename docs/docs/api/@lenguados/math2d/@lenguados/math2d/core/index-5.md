# @lenguados/math2d/core

## File

core/rotation2.ts

## Description

Deterministic 2D rotation for physics simulations.

## Remarks

## Design Pattern: Box2D b2Rot

This class follows the proven design from Box2D physics engine:

- Stores rotation as `(cos θ, sin θ)` instead of angle
- Avoids repeated trigonometric calls
- Enables efficient rotation composition via complex multiplication
- Used by: Box2D, Planck.js, Rapier2D

## Why (cos, sin) Instead of Angle?

| Operation         | With angle            | With (cos, sin) |
| ----------------- | --------------------- | --------------- |
| Rotate vector     | sin/cos call          | 2 multiplies    |
| Compose rotations | angle add + normalize | 4 multiplies    |
| Get angle         | direct                | atan2 call      |

For physics simulations that rotate many vectors per frame,
storing (cos, sin) is significantly faster.

## Rotation2 vs Complex

[Rotation2](classes/Rotation2.md) is a **unit complex number** optimized for rotations:

- Always normalized: `cos² + sin² = 1`
- Use Rotation2 for: physics bodies, sprites, transforms
- Use [Complex](classes/Complex.md) for: Fourier, roots, exponentials

## Example

```typescript
// Create rotation
const rot = Rotation2.fromAngle(Math.PI / 4); // 45°

// Rotate a vector (efficient: no trig calls)
const v = new Vector2(1, 0);
const rotated = rot.rotateVector(v); // (0.707, 0.707)

// Compose rotations
const rot90 = Rotation2.QUARTER_TURN;
const combined = rot.multiply(rot90); // 135°
```

## See

- [Complex](classes/Complex.md) for general complex number operations
- Transform2 for position + rotation

## Core

- [Rotation2](classes/Rotation2.md)

## Helpers

- [freezeRotation2](functions/freezeRotation2.md)
