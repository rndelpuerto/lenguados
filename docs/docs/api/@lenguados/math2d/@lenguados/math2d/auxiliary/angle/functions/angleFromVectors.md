# Function: angleFromVectors()

> **angleFromVectors**(`x1`, `y1`, `x2`, `y2`): `number`

Defined in: [src/auxiliary/angle/operations.ts:446](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L446)

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

## Example

```typescript
angleFromVectors(1, 0, 0, 1);      // Math.PI / 2 (90 degrees CCW)
angleFromVectors(1, 0, 1, 0);      // 0 (same direction)
angleFromVectors(1, 0, -1, 0);     // Math.PI (opposite)
```

## Since

1.0.0
