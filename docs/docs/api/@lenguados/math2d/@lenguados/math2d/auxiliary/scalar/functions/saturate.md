# Function: saturate()

> **saturate**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:119](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L119)

Saturates value to [0, 1] range.
Commonly used for colors, interpolation factors.

## Parameters

### value

`number`

Value to saturate

## Returns

`number`

Saturated value in [0, 1]

## Example

```typescript
saturate(-0.5);  // 0
saturate(0.5);   // 0.5
saturate(1.5);   // 1
```

## Since

1.0.0
