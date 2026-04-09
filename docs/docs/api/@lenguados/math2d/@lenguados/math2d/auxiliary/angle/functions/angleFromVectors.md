# Function: angleFromVectors()

> **angleFromVectors**(`x1`, `y1`, `x2`, `y2`): `number`

Defined in: [src/auxiliary/angle/operations.ts:306](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/operations.ts#L306)

Computes the directed angle from vector1 to vector2.

## Parameters

### x1

`number`

X component of first vector

### y1

`number`

Y component of first vector

### x2

`number`

X component of second vector

### y2

`number`

Y component of second vector

## Returns

`number`

Angle from vector1 to vector2

## Remarks

Uses deterministic math (`atan2` from deterministic-kernels).

Returns 0 when either vector is zero, since `atan2(0, 0)` → 0.

## Example

```typescript
angleFromVectors(1, 0, 0, 1); // Math.PI / 2 (90 degrees CCW)
angleFromVectors(1, 0, 1, 0); // 0 (same direction)
angleFromVectors(1, 0, -1, 0); // Math.PI (opposite)
```

## Since

0.7.0
