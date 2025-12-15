# Function: roundToMultiple()

> **roundToMultiple**(`value`, `multiple`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:74](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/rounding.ts#L74)

Rounds to nearest multiple.

## Parameters

### value

`number`

Value to round.

### multiple

`number`

Multiple to round to.

## Returns

`number`

Rounded value.

## Example

```typescript
roundToMultiple(7, 5); // 5
roundToMultiple(8, 5); // 10
roundToMultiple(23, 10); // 20
roundToMultiple(1.7, 0.5); // 1.5
```

## Since

1.0.0
