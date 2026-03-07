# Function: isInRange()

> **isInRange**(`value`, `min`, `max`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:121](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/guards.ts#L121)

Tests if value is in range [min, max].

## Parameters

### value

`number`

Value to test.

### min

`number`

Lower bound (inclusive).

### max

`number`

Upper bound (inclusive).

## Returns

`boolean`

True if value is within range.

## Example

```typescript
isInRange(5, 0, 10); // true
isInRange(0, 0, 10); // true (on boundary)
isInRange(11, 0, 10); // false
isInRange(-1, 0, 10); // false
```

## Since

0.7.0
