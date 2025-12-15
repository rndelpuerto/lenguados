# Function: loop()

> **loop**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:233](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L233)

Loops value into [min, max) range (strict).

## Parameters

### value

`number`

Value to wrap.

### min

`number`

Lower bound (inclusive).

### max

`number`

Upper bound (exclusive).

## Returns

`number`

Wrapped value.

## Throws

If range is invalid (max <= min).

## See

- [loopSafe](loopSafe.md) - Returns min if range is invalid
- [loopUnchecked](loopUnchecked.md) - No validation

## Example

```typescript
loop(-1, 0, 10); // 9
loop(10, 0, 10); // 0
loop(15, 0, 10); // 5
```

## Since

1.0.0
