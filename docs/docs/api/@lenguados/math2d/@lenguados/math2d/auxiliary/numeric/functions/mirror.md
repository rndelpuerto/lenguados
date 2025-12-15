# Function: mirror()

> **mirror**(`value`, `center`, `range`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:143](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L143)

Mirrors value around center (strict).

## Parameters

### value

`number`

Value to mirror.

### center

`number` = `0`

Mirror center (default: 0).

### range

`number` = `1`

Range from center (default: 1).

## Returns

`number`

Mirrored value.

## Throws

If range is <= 0.

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

## See

- [mirrorSafe](mirrorSafe.md) - Returns center if range is invalid
- [mirrorUnchecked](mirrorUnchecked.md) - No validation

## Since

1.0.0
