# Function: mirror()

> **mirror**(`value`, `center`, `range`): `number`

Mirrors value around center.

## Parameters

### value

`number`

Value to mirror

### center

`number` = `0`

Mirror center (default: 0)

### range

`number` = `1`

Range from center (default: 1)

## Returns

`number`

Mirrored value

## Remarks

Creates a ping-pong effect where values beyond the range
are reflected back.

## Example

```typescript
mirror(3, 0, 2); // -1 (3 reflected around 2 from center 0)
mirror(5, 0, 2); // -1 (same as 3)
mirror(1, 5, 2); // 7 (within range [3,7])
mirror(8, 5, 2); // 6 (reflected back from 7)
```

## Since

1.0.0
