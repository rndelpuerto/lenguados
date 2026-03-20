# Function: sqrtSafe()

> **sqrtSafe**(`x`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:116](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/safety.ts#L116)

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
