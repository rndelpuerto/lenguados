# Function: loopSafe()

> **loopSafe**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:206](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L206)

Loops value into [min, max) range (safe).

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

Wrapped value, or min if range is invalid.

## Example

```typescript
loopSafe(5, 0, 10); // 5
loopSafe(5, 5, 5); // 5 (return min)
```

## See

[loop](loop.md) - Throws for invalid range

## Since

0.7.0
