# Function: loop()

> **loop**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:198](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L198)

Loops value into [min, max) range (strict).

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

## Throws

If range is invalid (max <= min)

## Example

```typescript
loop(-1, 0, 10); // 9
loop(10, 0, 10); // 0
loop(15, 0, 10); // 5
```

## See

- [loopSafe](loopSafe.md) - Returns min if range is invalid
- [loopUnchecked](loopUnchecked.md) - No validation

## Since

0.7.0
