# Function: powSafe()

> **powSafe**(`base`, `exponent`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:252](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L252)

Safe power that handles edge cases.

## Parameters

### base

`number`

Base value

### exponent

`number`

Exponent

## Returns

`number`

Result with special case handling

## Remarks

Uses deterministic math for cross-platform reproducibility.
Handles edge cases like:

- 0^0 returns 1 (following JavaScript convention)
- Negative base with fractional exponent returns NaN
- Prevents overflow/underflow where possible

**Note on Safe convention exception**: Unlike other `*Safe` functions
that always return finite values, `powSafe(-x, frac)` returns NaN because
this case is mathematically undefined in ℝ (the result is complex).
This matches IEEE 754 §9.2, C99 `pow()`, and every industrial math library
(Unity, GLM, Eigen, Three.js). Returning a finite fallback like 0 would be
mathematically misleading and inconsistent with universal external convention.

Note: 0^(-n) returns 0 (finite fallback per Safe contract, not mathematical Infinity).

## Example

```typescript
powSafe(2, 3); // 8
powSafe(0, 0); // 1 (by convention)
powSafe(-2, 0.5); // NaN (complex result)
powSafe(10, 1000); // Infinity (overflow)
```

## Since

0.7.0
