# Function: sqrtSafe()

> **sqrtSafe**(`x`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:117](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L117)

Safe square root (clamps negative values to 0).

## Parameters

### x

`number`

Value to compute square root of

## Returns

`number`

Square root of x, or 0 for negative values

## Remarks

Uses `Math.sqrt` which is IEEE 754 required — correctly rounded and
deterministic across all platforms.

## Since

0.7.0
