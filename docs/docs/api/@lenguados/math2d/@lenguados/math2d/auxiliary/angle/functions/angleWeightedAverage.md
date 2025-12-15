# Function: angleWeightedAverage()

> **angleWeightedAverage**(`angles`, `weights`): `number`

Defined in: [src/auxiliary/angle/operations.ts:367](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L367)

Calculates weighted average of angles.

## Parameters

### angles

`number`[]

Array of angles in radians

### weights

`number`[]

Array of weights (same length as angles)

## Returns

`number`

Weighted average angle

## Example

```typescript
angleWeightedAverage([0, Math.PI / 2], [1, 1]);      // Math.PI / 4
angleWeightedAverage([0, Math.PI / 2], [3, 1]);      // ~0.32 (weighted towards 0)
angleWeightedAverage([0, Math.PI], [1, 0]);          // 0 (second angle ignored)
```

## Since

1.0.0
