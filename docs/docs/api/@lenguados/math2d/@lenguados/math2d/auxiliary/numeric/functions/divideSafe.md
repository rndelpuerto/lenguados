# Function: divideSafe()

> **divideSafe**(`numerator`, `denominator`, `epsilon`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:65](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L65)

Safe division with fallback to 0.

## Parameters

### numerator

`number`

Dividend

### denominator

`number`

Divisor

### epsilon

`number` = `MIN_SAFE_DIVISOR`

Minimum safe divisor (default: MIN_SAFE_DIVISOR)

## Returns

`number`

Result or 0 if denominator is too small

## Remarks

Default threshold is [MIN_SAFE_DIVISOR](../variables/MIN_SAFE_DIVISOR.md) (1e-10).
Returns 0 when |denominator| < epsilon, preventing Infinity/NaN from
near-zero division. Used internally by core types for `inverseSafe` and
`normalizeSafe` operations.

## Example

```typescript
divideSafe(10, 2); // 5
divideSafe(10, 0); // 0 (safe fallback)
divideSafe(10, 1e-11); // 0 (below epsilon)
divideSafe(10, 0, 0.1); // 0 (custom epsilon)
```

## Since

0.7.0
