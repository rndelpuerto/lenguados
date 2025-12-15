# Function: safeSqrt()

> **safeSqrt**(`value`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:105](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/safety.ts#L105)

Safe deterministic square root (clamps negatives to 0).

## Parameters

### value

`number`

Value to take square root of

## Returns

`number`

Square root or 0 for negative values

## Remarks

**Determinism Guarantee:** Uses [DeterministicMath.sqrtSafe](../../../deterministic/classes/DeterministicMath.md#sqrtsafe) which
implements Newton-Raphson iteration for cross-platform reproducibility.

While IEEE 754 requires sqrt to be correctly rounded, different JavaScript
engines (V8, SpiderMonkey, JSC) may produce slightly different results for
edge cases (denormals, very small values). This function ensures bit-exact
results across all platforms, critical for:
- **Lockstep networking** in multiplayer games
- **Replay systems** where input must reproduce exact simulation
- **Unit testing** across different CI environments

**Performance:** ~10ns per call (vs ~2ns for native Math.sqrt).
Acceptable overhead for physics simulations.

## Example

```typescript
safeSqrt(4);      // 2
safeSqrt(0);      // 0
safeSqrt(-1);     // 0 (clamped, avoids NaN)
safeSqrt(-0.001); // 0 (clamped)
```

## Since

1.0.0
