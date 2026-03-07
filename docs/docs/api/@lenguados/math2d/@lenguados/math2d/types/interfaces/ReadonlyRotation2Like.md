# Interface: ReadonlyRotation2Like

Defined in: [src/types/index.ts:135](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/types/index.ts#L135)

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
 cos: Math.cos(Math.PI / 4), // ≈ 0.707
 sin: Math.sin(Math.PI / 4), // ≈ 0.707
};
```

## Since

0.7.0

## Properties

### cos

> `readonly` **cos**: `number`

Defined in: [src/types/index.ts:140](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/types/index.ts#L140)

Cosine component of the rotation.
For a rotation of angle θ, this equals cos(θ).

---

### sin

> `readonly` **sin**: `number`

Defined in: [src/types/index.ts:146](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/types/index.ts#L146)

Sine component of the rotation.
For a rotation of angle θ, this equals sin(θ).
