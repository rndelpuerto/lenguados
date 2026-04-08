# Function: logSafe()

> **logSafe**(`value`, `base?`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:187](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L187)

Safe logarithm (returns 0 for non-positive values).

## Parameters

### value

`number`

Value to take logarithm of

### base?

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
