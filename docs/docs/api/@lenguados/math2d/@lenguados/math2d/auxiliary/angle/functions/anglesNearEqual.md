# Function: anglesNearEqual()

> **anglesNearEqual**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/auxiliary/angle/operations.ts:161](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/operations.ts#L161)

Tests if angles are approximately equal.

## Parameters

### a

`number`

First angle in radians.

### b

`number`

Second angle in radians.

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON).

## Returns

`boolean`

True if angles are within epsilon.

## Example

```typescript
anglesNearEqual(0, 2 * Math.PI); // true (same angle)
anglesNearEqual(-Math.PI, Math.PI); // true (same angle)
anglesNearEqual(0, 0.0000000001); // true (within epsilon)
anglesNearEqual(0, 0.1); // false
```

## Since

0.7.0
