# Function: isAngleBetween()

> **isAngleBetween**(`angle`, `start`, `end`, `inclusive`): `boolean`

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

### inclusive

`boolean` = `true`

Whether to include boundaries (default: true)

## Returns

`boolean`

True if angle is in the CCW arc from start to end

## Remarks

Uses counter-clockwise convention. The arc from start to end
is traversed in the positive (CCW) direction.

## Example

```typescript
isAngleBetween(Math.PI / 4, 0, Math.PI / 2); // true
isAngleBetween((3 * Math.PI) / 2, 0, Math.PI); // false
isAngleBetween(0, 0, Math.PI, true); // true (on boundary)
isAngleBetween(0, 0, Math.PI, false); // false (boundary excluded)
```

## Since

1.0.0
