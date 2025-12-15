# Function: safeAcos()

> **safeAcos**(`value`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:134](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/safety.ts#L134)

Safe deterministic arc cosine (clamps input to [-1, 1]).

## Parameters

### value

`number`

Value to take arc cosine of

## Returns

`number`

Arc cosine in radians

## Remarks

**Determinism Guarantee:** Uses [DeterministicMath.acosSafe](../../../deterministic/classes/DeterministicMath.md#acossafe) which
computes acos using the identity `acos(x) = atan2(sqrt(1-x²), x)` with
deterministic sqrt and atan2 implementations.

This ensures cross-platform reproducibility for physics simulations,
lockstep networking, and replay systems.

## Example

```typescript
safeAcos(0.5);    // Math.PI / 3
safeAcos(1);      // 0
safeAcos(-1);     // Math.PI
safeAcos(2);      // 0 (clamped to 1)
safeAcos(-2);     // Math.PI (clamped to -1)
```

## Since

1.0.0
