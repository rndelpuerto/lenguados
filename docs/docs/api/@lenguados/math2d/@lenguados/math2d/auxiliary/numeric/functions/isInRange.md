# Function: isInRange()

> **isInRange**(`value`, `min`, `max`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:149](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/guards.ts#L149)

Tests if value is in range [min, max].

## Parameters

### value

`number`

Value to test

### min

`number`

Lower bound (inclusive)

### max

`number`

Upper bound (inclusive)

## Returns

`boolean`

True if value is within range

## Example

```typescript
isInRange(5, 0, 10); // true
isInRange(0, 0, 10); // true (on boundary)
isInRange(11, 0, 10); // false
isInRange(-1, 0, 10); // false
```

## See

inRange For epsilon-tolerant range checking

## Since

0.7.0
