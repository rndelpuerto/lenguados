# Function: inRange()

> **inRange**(`value`, `min`, `max`, `epsilon?`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:242](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/scalar/comparison.ts#L242)

Tests if value is in range [min, max] with epsilon.

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

### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if value is within range with tolerance

## Remarks

Uses epsilon tolerance at both bounds:

- Lower bound: value >= min - epsilon
- Upper bound: value <= max + epsilon

## Throws

If epsilon is negative or NaN

## Example

```typescript
inRange(5, 0, 10); // true
inRange(0, 0, 10); // true (on boundary)
inRange(-0.0000000001, 0, 10); // true (within epsilon)
inRange(-0.1, 0, 10); // false
inRange(5, 0, 10, 1); // true
inRange(-0.5, 0, 10, 1); // true (within custom epsilon)
```

## See

isInRange For exact (non-tolerant) range checking

## Since

0.7.0
