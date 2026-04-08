# Function: isInRange()

> **isInRange**(`value`, `min`, `max`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:149](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/guards.ts#L149)

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
