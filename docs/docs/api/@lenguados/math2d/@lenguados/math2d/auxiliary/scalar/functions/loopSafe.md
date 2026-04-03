# Function: loopSafe()

> **loopSafe**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:225](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L225)

Loops value into [min, max) range (safe).

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

Wrapped value, or min if range is invalid

## Example

```typescript
loopSafe(5, 0, 10); // 5
loopSafe(5, 5, 5); // 5 (return min)
```

## See

[loop](loop.md) - Throws for invalid range

## Since

0.7.0
