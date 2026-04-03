# Function: asinSafe()

> **asinSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:736](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L736)

Safe arcsine that clamps input to [-1, 1].

## Parameters

### x

`number`

Any value (will be clamped)

## Returns

`number`

asin(clamp(x, -1, 1))

## See

[asin](asin.md) — Returns NaN for out-of-range inputs

## Since

0.8.0
