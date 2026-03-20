# Function: acosSafe()

> **acosSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:696](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/deterministic/deterministic-kernels.ts#L696)

Safe arccosine that clamps input to [-1, 1].

## Parameters

### x

`number`

Any value (will be clamped)

## Returns

`number`

acos(clamp(x, -1, 1))

## See

[acos](acos.md) — Returns NaN for out-of-range inputs

## Since

0.8.0
