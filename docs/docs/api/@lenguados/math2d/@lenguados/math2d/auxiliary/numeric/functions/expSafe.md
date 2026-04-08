# Function: expSafe()

> **expSafe**(`x`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:211](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L211)

Safe exponential function (handles extreme values gracefully).

## Parameters

### x

`number`

Exponent value

## Returns

`number`

e^x, clamped to finite range

## Remarks

Uses deterministic math for cross-platform reproducibility.
Returns Number.MAX_VALUE for positive overflow (not Infinity) and 0 for
negative overflow, maintaining the Safe contract (finite-in/finite-out).

## Since

0.7.0
