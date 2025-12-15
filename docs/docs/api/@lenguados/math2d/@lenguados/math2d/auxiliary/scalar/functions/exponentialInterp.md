# Function: exponentialInterp()

> **exponentialInterp**(`a`, `b`, `t`, `power`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:166](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/interpolation.ts#L166)

Exponential interpolation.
Useful for zoom, scale animations.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### t

`number`

Interpolation factor [0, 1]

### power

`number` = `2`

Exponential power (default: 2)

## Returns

`number`

Interpolated value

## Example

```typescript
exponentialInterp(0, 100, 0.5, 2);    // 25 (quadratic ease-in)
exponentialInterp(0, 100, 0.5, 3);    // 12.5 (cubic ease-in)
```

## Since

1.0.0
