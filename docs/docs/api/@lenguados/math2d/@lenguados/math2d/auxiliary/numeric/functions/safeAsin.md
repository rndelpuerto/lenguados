# Function: safeAsin()

> **safeAsin**(`value`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:171](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L171)

Safe deterministic arc sine (clamps input to [-1, 1]).

## Parameters

### value

`number`

Value to take arc sine of.

## Returns

`number`

Arc sine in radians.

## Remarks

**Determinism Guarantee:** Uses [DeterministicMath.asinSafe](../../../deterministic/classes/DeterministicMath.md#asinsafe) which
computes asin using the identity `asin(x) = atan2(x, sqrt(1-x²))` with
deterministic sqrt and atan2 implementations.

This ensures cross-platform reproducibility for physics simulations,
lockstep networking, and replay systems.

## Example

```typescript
safeAsin(0.5); // Math.PI / 6
safeAsin(1); // Math.PI / 2
safeAsin(-1); // -Math.PI / 2
safeAsin(2); // Math.PI / 2 (clamped to 1)
safeAsin(-2); // -Math.PI / 2 (clamped to -1)
```

## Since

1.0.0
