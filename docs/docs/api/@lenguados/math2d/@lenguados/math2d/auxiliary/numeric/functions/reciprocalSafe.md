# Function: reciprocalSafe()

> **reciprocalSafe**(`value`, `epsilon`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:95](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L95)

Safe reciprocal (1/x).

## Parameters

### value

`number`

Value to invert

### epsilon

`number` = `MIN_SAFE_DIVISOR`

Minimum safe value (default: MIN_SAFE_DIVISOR)

## Returns

`number`

Reciprocal or 0 if value is too small

## Remarks

Default threshold is [MIN_SAFE_DIVISOR](../variables/MIN_SAFE_DIVISOR.md) (1e-10).
Returns 0 when |value| < epsilon, preventing Infinity from near-zero
reciprocal. Equivalent to `divideSafe(1, value, epsilon)`.

## Example

```typescript
reciprocalSafe(2); // 0.5
reciprocalSafe(0); // 0 (safe fallback)
reciprocalSafe(1e-11); // 0 (below epsilon)
```

## Since

0.7.0
