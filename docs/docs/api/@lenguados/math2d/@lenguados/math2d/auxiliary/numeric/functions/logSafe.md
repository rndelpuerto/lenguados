# Function: logSafe()

> **logSafe**(`value`, `base`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:166](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/safety.ts#L166)

Safe logarithm (returns 0 for non-positive values).

## Parameters

### value

`number`

Value to take logarithm of

### base

`number` = `Math.E`

Logarithm base (default: Math.E for natural log)

## Returns

`number`

Logarithm or 0 for non-positive values

## Remarks

Uses deterministic math for cross-platform reproducibility.
Returns 0 (not -Infinity) for non-positive inputs, consistent
with the Safe convention: fallbacks are always finite and usable.

## Example

```typescript
logSafe(Math.E); // 1
logSafe(10, 10); // 1
logSafe(100, 10); // 2
logSafe(0); // 0 (safe fallback)
logSafe(-1); // 0 (safe fallback)
```

## Since

0.7.0
