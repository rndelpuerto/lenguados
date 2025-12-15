# Function: inverseLerp()

> **inverseLerp**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:86](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/interpolation.ts#L86)

Inverse linear interpolation.
Returns t such that lerp(a, b, t) = value.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### value

`number`

Value to find t for

## Returns

`number`

Interpolation factor t

## Example

```typescript
inverseLerp(0, 10, 5);     // 0.5
inverseLerp(0, 10, 0);     // 0
inverseLerp(0, 10, 10);    // 1
inverseLerp(0, 10, 20);    // 2 (extrapolation)
```

## Since

1.0.0
