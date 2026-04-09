# Function: isAngleBetween()

> **isAngleBetween**(`angle`, `start`, `end`, `inclusive?`): `boolean`

Defined in: [src/auxiliary/angle/operations.ts:219](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/operations.ts#L219)

Tests if angle is between start and end (CCW).

## Parameters

### angle

`number`

Angle to test

### start

`number`

Start angle

### end

`number`

End angle

### inclusive?

`boolean` = `true`

Whether to include boundaries (default: true)

## Returns

`boolean`

True if angle is in the CCW arc from start to end

## Remarks

Uses counter-clockwise convention. The arc from start to end
is traversed in the positive (CCW) direction.

When start === end after normalization, the arc is a single point (not a full circle).
Only the exact boundary angle matches (with `inclusive = true`).

## Example

```typescript
isAngleBetween(Math.PI / 4, 0, Math.PI / 2); // true
isAngleBetween((3 * Math.PI) / 2, 0, Math.PI); // false
isAngleBetween(0, 0, Math.PI, true); // true (on boundary)
isAngleBetween(0, 0, Math.PI, false); // false (boundary excluded)
```

## Since

0.7.0
