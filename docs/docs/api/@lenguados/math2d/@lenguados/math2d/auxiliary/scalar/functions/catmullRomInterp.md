# Function: catmullRomInterp()

> **catmullRomInterp**(`t`, `p0`, `p1`, `p2`, `p3`): `number`

Catmull-Rom spline interpolation.

## Parameters

### t

`number`

Parameter [0, 1]

### p0

`number`

Point before start

### p1

`number`

Start point

### p2

`number`

End point

### p3

`number`

Point after end

## Returns

`number`

Interpolated value

## Remarks

Passes through p1 and p2, using p0 and p3 for tangent calculation.

## Example

```typescript
// Smooth interpolation through points
catmullRomInterp(0.5, 0, 1, 2, 3); // 1.5
```

## Since

1.0.0
