# Function: safeSqrt()

> **safeSqrt**(`value`): `number`

Safe square root (clamps negatives to 0).

## Parameters

### value

`number`

Value to take square root of

## Returns

`number`

Square root or 0 for negative values

## Remarks

**Determinism Note:** Uses native `Math.sqrt` which is deterministic
across modern JavaScript engines for the same input value. The IEEE 754
standard requires sqrt to be correctly rounded, ensuring consistent
results across platforms.

For cases where you need deterministic sqrt via Newton-Raphson iteration,
use DeterministicMath.sqrt instead.

## Example

```typescript
safeSqrt(4); // 2
safeSqrt(0); // 0
safeSqrt(-1); // 0 (clamped, avoids NaN)
safeSqrt(-0.001); // 0 (clamped)
```

## Since

1.0.0
