# Function: angleWeightedAverage()

> **angleWeightedAverage**(`angles`, `weights`): `number`

Defined in: [src/auxiliary/angle/operations.ts:370](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L370)

Calculates weighted average of angles.

## Parameters

### angles

`number`[]

Array of angles in radians.

### weights

`number`[]

Array of weights (same length as angles).

## Returns

`number`

Weighted average angle.

## Example

```typescript
angleWeightedAverage([0, Math.PI / 2], [1, 1]); // Math.PI / 4
angleWeightedAverage([0, Math.PI / 2], [3, 1]); // ~0.32 (weighted towards 0)
angleWeightedAverage([0, Math.PI], [1, 0]); // 0 (second angle ignored)
```

## Since

1.0.0
