# Interface: ReadonlyRotation2Like

Defined in: [src/types/index.ts:110](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/types/index.ts#L110)

Readonly interface for 2D rotation represented as cosine/sine components.

## Remarks

Represents a 2D rotation as the cosine and sine of the rotation angle.
This is mathematically equivalent to a unit complex number or a
rotation matrix R = [[cos, -sin], [sin, cos]].

For a rotation of angle θ:
- `cos` = cos(θ)
- `sin` = sin(θ)

## Example

```typescript
// 45-degree rotation
const rot: ReadonlyRotation2Like = {
  cos: Math.cos(Math.PI / 4),  // ≈ 0.707
  sin: Math.sin(Math.PI / 4),  // ≈ 0.707
};
```

## Properties

### cos

> `readonly` **cos**: `number`

Defined in: [src/types/index.ts:115](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/types/index.ts#L115)

Cosine component of the rotation.
For a rotation of angle θ, this equals cos(θ).

***

### sin

> `readonly` **sin**: `number`

Defined in: [src/types/index.ts:121](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/types/index.ts#L121)

Sine component of the rotation.
For a rotation of angle θ, this equals sin(θ).
