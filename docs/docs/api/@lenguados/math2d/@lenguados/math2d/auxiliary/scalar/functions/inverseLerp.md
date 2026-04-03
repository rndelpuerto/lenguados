# Function: inverseLerp()

> **inverseLerp**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:93](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/interpolation.ts#L93)

Inverse linear interpolation (strict).
Returns t such that lerp(a, b, t) = value.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### value

`number`

Value to find t for

## Returns

`number`

Interpolation factor t

## Throws

If a === b (degenerate range)

## Example

```typescript
inverseLerp(0, 10, 5); // 0.5
inverseLerp(0, 10, 0); // 0
inverseLerp(0, 10, 10); // 1
```

## See

- [inverseLerpSafe](inverseLerpSafe.md) — Returns 0 if range is degenerate
- [inverseLerpUnchecked](inverseLerpUnchecked.md) — No validation

## Since

0.7.0
