# Function: inverseLerp()

> **inverseLerp**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:89](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/interpolation.ts#L89)

Inverse linear interpolation (strict).
Returns t such that lerp(a, b, t) = value.

## Parameters

### a

`number`

Start value.

### b

`number`

End value.

### value

`number`

Value to find t for.

## Returns

`number`

Interpolation factor t.

## Throws

If a === b (degenerate range).

## See

- [inverseLerpSafe](inverseLerpSafe.md) - Returns 0 if range is degenerate
- [inverseLerpUnchecked](inverseLerpUnchecked.md) - No validation

## Example

```typescript
inverseLerp(0, 10, 5); // 0.5
inverseLerp(0, 10, 0); // 0
inverseLerp(0, 10, 10); // 1
```

## Since

0.7.0
