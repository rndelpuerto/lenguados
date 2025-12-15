# Function: bezierInterp()

> **bezierInterp**(`t`, `p0`, `p1`, `p2`, `p3`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:235](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/interpolation.ts#L235)

Bezier interpolation using control points.

## Parameters

### t

`number`

Parameter [0, 1]

### p0

`number`

Start point

### p1

`number`

Control point 1

### p2

`number`

Control point 2

### p3

`number`

End point

## Returns

`number`

Interpolated value

## Remarks

Uses the cubic Bezier formula for smooth curves.

## Example

```typescript
// Ease-out curve
bezierInterp(0.5, 0, 0.58, 1, 1);
```

## Since

1.0.0
