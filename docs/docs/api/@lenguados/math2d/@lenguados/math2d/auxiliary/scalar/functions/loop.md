# Function: loop()

> **loop**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:190](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L190)

Loops value into [min, max) range.
Unlike clamp, wraps around.

## Parameters

### value

`number`

Value to wrap

### min

`number`

Lower bound (inclusive)

### max

`number`

Upper bound (exclusive)

## Returns

`number`

Wrapped value

## Example

```typescript
loop(-1, 0, 10);   // 9
loop(10, 0, 10);   // 0
loop(15, 0, 10);   // 5
```

## Since

1.0.0
