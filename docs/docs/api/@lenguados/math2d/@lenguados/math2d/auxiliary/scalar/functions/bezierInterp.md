# Function: bezierInterp()

> **bezierInterp**(`t`, `p0`, `p1`, `p2`, `p3`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:215](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/interpolation.ts#L215)

Bezier interpolation using control points.

## Parameters

### t

`number`

Parameter [0, 1].

### p0

`number`

Start point.

### p1

`number`

Control point 1.

### p2

`number`

Control point 2.

### p3

`number`

End point.

## Returns

`number`

Interpolated value.

## Remarks

Uses the cubic Bezier formula for smooth curves.

## Example

```typescript
// Ease-out curve
bezierInterp(0.5, 0, 0.58, 1, 1);
```

## Since

1.0.0
