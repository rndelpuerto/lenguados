# Function: asinSafe()

> **asinSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:723](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/deterministic/deterministic-kernels.ts#L723)

Safe arcsine that clamps input to [-1, 1].

## Parameters

### x

`number`

Any value (will be clamped)

## Returns

`number`

asin(clamp(x, -1, 1))

## Since

0.8.0
