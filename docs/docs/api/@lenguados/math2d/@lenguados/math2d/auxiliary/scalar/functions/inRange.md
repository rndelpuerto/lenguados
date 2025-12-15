# Function: inRange()

> **inRange**(`value`, `min`, `max`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:172](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/comparison.ts#L172)

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

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if value is within range with tolerance

## Remarks

Uses epsilon tolerance at both bounds:
- Lower bound: value >= min - epsilon
- Upper bound: value <= max + epsilon

## Example

```typescript
inRange(5, 0, 10);                     // true
inRange(0, 0, 10);                     // true (on boundary)
inRange(-0.0000000001, 0, 10);         // true (within epsilon)
inRange(-0.1, 0, 10);                  // false
inRange(5, 0, 10, 1);                  // true
inRange(-0.5, 0, 10, 1);               // true (within custom epsilon)
```

## Since

1.0.0
