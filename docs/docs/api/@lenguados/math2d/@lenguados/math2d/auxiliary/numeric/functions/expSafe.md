# Function: expSafe()

> **expSafe**(`x`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:211](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/safety.ts#L211)

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
