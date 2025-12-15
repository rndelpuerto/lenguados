# Function: smootherStep()

> **smootherStep**(`edge0`, `edge1`, `x`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:143](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/interpolation.ts#L143)

Quintic Hermite interpolation (smoother step).
Even smoother than smoothStep.

## Parameters

### edge0

`number`

Lower edge

### edge1

`number`

Upper edge

### x

`number`

Input value

## Returns

`number`

Result in [0, 1]

## Remarks

Produces an even smoother transition than smoothStep with zero
first and second derivatives at the boundaries.

## Example

```typescript
smootherStep(0, 1, 0.5);   // 0.5
smootherStep(0, 10, 5);    // 0.5
```

## Since

1.0.0
