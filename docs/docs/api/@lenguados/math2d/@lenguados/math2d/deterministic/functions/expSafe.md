# Function: expSafe()

> **expSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:913](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L913)

Safe exponential function (handles extreme values gracefully).

## Parameters

### x

`number`

Exponent value

## Returns

`number`

e^x, clamped to finite range

## Remarks

Returns Number.MAX_VALUE for positive overflow (not Infinity) and 0 for
negative overflow, maintaining the Safe contract (finite-in/finite-out).

## Since

0.9.0
