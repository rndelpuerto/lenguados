# Function: smootherStep()

> **smootherStep**(`edge0`, `edge1`, `x`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:205](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/interpolation.ts#L205)

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
smootherStep(0, 1, 0.5); // 0.5
smootherStep(0, 10, 5); // 0.5
```

## Since

0.7.0
