# Function: wrap()

> **wrap**(`value`, `min`, `max`): `number`

Wraps a value to [min, max) range.

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

## Remarks

Delegates to [loop](../../scalar/functions/loop.md) from scalar/arithmetic for DRY compliance.
Use this alias when working in a wrapping/modulo context.

## Example

```typescript
wrap(5, 0, 10); // 5
wrap(15, 0, 10); // 5
wrap(-5, 0, 10); // 5
wrap(10, 0, 10); // 0
wrap(0, -5, 5); // 0
wrap(7, -5, 5); // -3
```

## Since

1.0.0
