# Function: anglesNearEqual()

> **anglesNearEqual**(`a`, `b`, `epsilon?`): `boolean`

Defined in: [src/auxiliary/angle/operations.ts:157](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/operations.ts#L157)

Tests if angles are approximately equal.

## Parameters

### a

`number`

First angle in radians

### b

`number`

Second angle in radians

### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if angles are within epsilon

## Example

```typescript
anglesNearEqual(0, 2 * Math.PI); // true (same angle)
anglesNearEqual(-Math.PI, Math.PI); // true (same angle)
anglesNearEqual(0, 0.0000000001); // true (within epsilon)
anglesNearEqual(0, 0.1); // false
```

## Since

0.7.0
